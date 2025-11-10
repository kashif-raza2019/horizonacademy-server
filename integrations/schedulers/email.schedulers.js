const nodecron = require("node-cron");
const db = require("../../services/database.service");
const { sendEmail } = require("../email/service");
const marketingTemplate1 = require("../email/templates/marketing-email-1");

// Schedule a task to run every day at 01:45 AM monday per week
nodecron.schedule(
    "0 2 * * 1",
    async () => {
        try {
            // Fetch all enquiries from the database
            const [enquiries] = await db.query("SELECT * FROM enquiries");

            for (const enquiry of enquiries) {
                const emailHtml = marketingTemplate1(enquiry.parent_name);

                // Send marketing email to each enquiry
                await sendEmail({
                    to: enquiry.email,
                    subject: "Discover More About Horizon Academy!",
                    html: emailHtml,
                    email_user: "enquiries"
                });
            }

            console.log("✅ Marketing emails sent successfully to all enquiries.");
        } catch (err) {
            console.error("❌ Error sending marketing emails:", err.message);
        }
    });

module.exports = nodecron;