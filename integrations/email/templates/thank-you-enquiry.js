// thankYouTemplate.js
function template(parentName = "Parent") {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Thank You - My Horizon Academy</title>
    <style>
      body {
        font-family: 'Poppins', sans-serif;
        background-color: #f9f9ff;
        margin: 0;
        padding: 0;
        color: #444;
      }
      .email-container {
        max-width: 600px;
        margin: 20px auto;
        background: #ffffff;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 4px 10px rgba(0,0,0,0.08);
      }
      .header {
        background: linear-gradient(90deg, #ffb347, #ffcc33);
        color: #fff;
        text-align: center;
        padding: 25px 20px;
      }
      .header h1 {
        margin: 0;
        font-size: 26px;
        font-weight: 600;
      }
      .body {
        padding: 30px 25px;
        line-height: 1.6;
      }
      .body h2 {
        color: #333;
        font-size: 20px;
      }
      .footer {
        background-color: #fafafa;
        padding: 20px;
        text-align: center;
        font-size: 13px;
        color: #888;
      }
      .cta-button {
        display: inline-block;
        background: #ffb347;
        color: white;
        text-decoration: none;
        padding: 10px 20px;
        border-radius: 25px;
        font-weight: 600;
        margin-top: 15px;
      }
      .illustration {
        text-align: center;
        padding-top: 10px;
      }
      .illustration img {
        max-width: 100px;
      }
    </style>
  </head>
  <body>
    <div class="email-container">
      <div class="header">
        <h1>Horizon Academy, Indore</h1>
      </div>

      <div class="body">
        <h2>Dear ${parentName},</h2>
        <p>
          Thank you for your enquiry about <strong>Horizon Academy</strong>. 
          We’re delighted to know that you’re exploring a nurturing environment 
          for your child’s early learning journey.
        </p>
        <p>
          Our team will get in touch with you shortly with details about admissions, 
          curriculum, and facilities.
        </p>

        <div class="illustration">
          <img src="https://cdn-icons-png.flaticon.com/512/201/201623.png" alt="Kids Illustration">
        </div>

        <p style="text-align:center;">
          <a href="https://myhorizonacademy.in" class="cta-button">Visit Our Website</a>
        </p>
      </div>

      <div class="footer">
        © ${new Date().getFullYear()} Horizon Academy, Indore<br>
        <em>“Where little dreams grow big.”</em>
      </div>
    </div>
  </body>
  </html>
  `;
}

module.exports = template;
