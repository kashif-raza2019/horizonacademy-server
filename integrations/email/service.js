const nodemailer = require('nodemailer');

// Email authentication configuration -- Default to no-reply credentials
const email_user_selections = [
    {
        id: 'no-reply',
        from: 'No Reply <' + process.env.SMTP_NOREPLY_USER + '>',
        user: process.env.SMTP_NOREPLY_USER,
        pass: process.env.SMTP_NOREPLY_PASSWORD
    },
    {
        id: 'enquiries',
        from: 'Horizon Enquiries <' + process.env.SMTP_ENQUIRIES_USER + '>',
        user: process.env.SMTP_ENQUIRIES_USER,
        pass: process.env.SMTP_ENQUIRIES_PASSWORD
    },
    {
        id: 'student',
        from: 'Student Services <' + process.env.SMTP_STUDENTS_USER + '>',
        user: process.env.SMTP_STUDENTS_USER,
        pass: process.env.SMTP_STUDENTS_PASSWORD
    }
]

// Default email configuration
const email_config = {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT || 465,
    secure: process.env.SMTP_SECURE || true // true for 465, false for other ports
}

const email_transporter = (email_user) => {
   
    // Find the selected email user configuration
    const selected_user = email_user_selections.find(user => user.id === email_user) || email_user_selections[0];
    
    // Merge the selected user credentials into the email configuration
    const config = {
        ...email_config,
        auth: {
            user: selected_user.user,
            pass: selected_user.pass
        }
    };

    // Create a transporter object using the merged configuration
    return nodemailer.createTransport(config);
}

const sendEmail = async (options) => {
    const transporter = email_transporter(options.email_user || 'no-reply');

    const mailOptions = {
        from: options.from || transporter.options.auth.user,
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Email sent:', info.messageId);
        return info;
    } catch (error) {
        console.error('❌ Error sending email:', error);
        throw error;
    }
};

module.exports = {
    sendEmail
};

