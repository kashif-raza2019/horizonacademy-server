const fetch = require('node-fetch');

const RAZORPAY_URL = 'https://api.razorpay.com/v1/';
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID;
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;

// Basic Auth header for Razorpay API
const authHeader = 'Basic ' + Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString('base64');

// Calculate the next 1 day expiry time in UNIX timestamp
function getExpiryTimestamp() {
    const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
    const oneDayInSeconds = 24 * 60 * 60;
    return currentTime + oneDayInSeconds;
}

// Function to create a standard razorpay payment link
async function createRazorpayPaymentLink(customerId, amount, currency, customer, description, notes, isUPI) {
    const expiryTimestamp = getExpiryTimestamp();
    if(!customer || !customer.name || !customer.email || !customer.contact) {
        throw new Error('Customer information (name, email, contact) is required to create a payment link.');
    };
    if(!amount || amount <=0 ) {
        throw new Error('A valid amount greater than 0 is required to create a payment link.');
    }

    if(!currency) {
        currency = 'INR'; // Default to INR if not provided
    }
    if(!description) {
        description = 'Payment Link created via My Horizon Academy';
    }

    if(!notes) {
        notes = {};
    }

    let referenceId = `cust_${customerId}_${Date.now()}`;

    let callback_url

    const payload = {
        amount: amount * 100, // Amount in paise
        currency: currency,
        accept_partial: false,
        description: description,
        customer: customer,
        reference_id: referenceId,
        notify: {
            sms: true,
            email: true
        },
        reminder_enable: true,
        notes: notes,
        expiry_time: expiryTimestamp * 1000, // Convert to milliseconds
        callback_url: callback_url,
        callback_method: 'get'
    };
    if(isUPI) {
        payload.upi_link = true;
    }
    
    const response = await fetch(RAZORPAY_URL + 'payment_links', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': authHeader
        },
        body: JSON.stringify(payload)
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(`Error creating Razorpay payment link: ${data.error.description}`);
    }
    return data.short_url;
}

module.exports = {
    createRazorpayPaymentLink
};
