
// enrollInviteTemplate.js
function template(parentName = "Parent") {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Join the Horizon Family!</title>
    <style>
      body {
        font-family: 'Poppins', sans-serif;
        background-color: #f4fbf9;
        margin: 0;
        padding: 0;
        color: #444;
      }
      .email-container {
        max-width: 650px;
        margin: 25px auto;
        background: #ffffff;
        border-radius: 14px;
        overflow: hidden;
        box-shadow: 0 4px 12px rgba(0,0,0,0.08);
      }
      .header {
        background: linear-gradient(120deg, #a1e3d8, #c8e7ff);
        color: #02475e;
        text-align: center;
        padding: 35px 20px 20px;
      }
      .header h1 {
        font-size: 28px;
        margin: 0;
      }
      .header img {
        width: 90px;
        margin-bottom: 15px;
      }
      .body {
        padding: 30px 25px;
        line-height: 1.6;
      }
      .body h2 {
        color: #02735e;
        font-size: 22px;
        margin-bottom: 10px;
      }
      .highlight {
        color: #036d85;
        font-weight: 600;
      }
      .fact-box {
        background: #e8f8f2;
        border-left: 5px solid #4cbfa6;
        padding: 15px 20px;
        margin: 25px 0;
        border-radius: 8px;
      }
      .fact-box strong {
        color: #026670;
      }
      .cta {
        text-align: center;
        margin-top: 25px;
      }
      .cta a {
        display: inline-block;
        background: linear-gradient(90deg, #4cbfa6, #59c2f0);
        color: white;
        text-decoration: none;
        padding: 14px 28px;
        border-radius: 30px;
        font-size: 16px;
        font-weight: 600;
      }
      .footer {
        background-color: #f2f8f7;
        padding: 20px;
        text-align: center;
        font-size: 13px;
        color: #777;
      }
      .illustration {
        text-align: center;
        padding: 10px 0;
      }
      .illustration img {
        max-width: 100%;
        border-radius: 12px;
      }
    </style>
  </head>
  <body>
    <div class="email-container">
      <div class="header">
        <img src="https://cdn-icons-png.flaticon.com/512/3075/3075977.png" alt="Horizon Academy Logo" />
        <h1>Welcome to Horizon Academy 🌿</h1>
        <p>Where every child’s imagination takes flight!</p>
      </div>

      <div class="body">
        <h2>Dear ${parentName},</h2>
        <p>
          Give your child the <span class="highlight">right beginning</span> with a nurturing environment designed to make learning joyful and meaningful. 
          At <strong>Horizon Academy, Indore</strong>, we believe in growing curiosity, creativity, and confidence — the three wings every child needs to soar.
        </p>

        <div class="illustration">
          <img src="https://cdn.pixabay.com/photo/2017/06/20/13/21/kids-2428072_1280.jpg" alt="Happy Kids Learning" />
        </div>

        <p>
          Our programs focus on holistic development — blending play, discovery, and emotional intelligence. 
          Your little one will experience a world of colors, stories, music, and exploration every single day.
        </p>

        <div class="fact-box">
          <strong>Did You Know?</strong><br>
          Children who engage in early creative play have up to <b>30% higher cognitive growth</b> by age 6! 🌱
        </div>

        <p>
          Be a part of the <span class="highlight">Horizon Family</span> — where every milestone is celebrated, 
          every question is encouraged, and every smile matters.
        </p>

        <div class="cta">
          <a href="https://myhorizonacademy.in/enroll" target="_blank">Enroll Your Child Today</a>
        </div>
      </div>

      <div class="footer">
        © ${new Date().getFullYear()} Horizon Academy, Indore<br>
        <em>"Shaping bright futures, one little dream at a time."</em>
      </div>
    </div>
  </body>
  </html>
  `;
}

module.exports = template;
