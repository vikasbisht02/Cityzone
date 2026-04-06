export function sendWelcomeEmailTemplate(dashboardURL) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Citizone</title>
</head>

<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f7fa;">

  <!-- Header -->
  <div style="background: linear-gradient(to right, #2563eb, #1e40af); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="color: #ffffff; margin: 0; font-size: 28px;">
      Welcome to Citizone 🎉
    </h1>
    <p style="color: #dbeafe; margin-top: 10px;">
      Connecting communities. Empowering cities.
    </p>
  </div>

  <!-- Body -->
  <div style="background-color: #ffffff; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">

    <p style="font-size: 18px; color: #1e40af;">
      Hello,
    </p>

    <p>
      We’re excited to have you on <strong>Citizone</strong> — a platform built to bring people,
      services, and communities together in one place.
    </p>

    <p>
      With Citizone, you can:
    </p>

    <ul style="padding-left: 20px; color: #374151;">
      <li>Access local updates and announcements</li>
      <li>Connect with community members</li>
      <li>Raise issues and track resolutions</li>
      <li>Stay informed and engaged</li>
    </ul>

    <!-- CTA Button -->
    <div style="text-align: center; margin: 30px 0;">
      <a
        href="${dashboardURL}"
        style="
          background-color: #2563eb;
          color: #ffffff;
          padding: 14px 30px;
          text-decoration: none;
          border-radius: 30px;
          font-weight: bold;
          font-size: 16px;
          display: inline-block;
        "
      >
        Continue with Citizone
      </a>
    </div>

    <p>
      If you have any questions or need help, our support team is always here for you.
    </p>

    <p style="margin-top: 30px;">
      Warm regards,<br>
      <strong>The Citizone Team</strong>
    </p>
  </div>

  <!-- Footer -->
  <p style="text-align: center; font-size: 12px; color: #6b7280; margin-top: 20px;">
    © ${new Date().getFullYear()} Citizone. All rights reserved.
  </p>

</body>
</html>
  `;
}

export const verificationEmailTemplate = (verificationCode) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Verify Your Email - Citizone</title>
</head>

<body style="
  font-family: Arial, sans-serif;
  line-height: 1.6;
  color: #333;
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f5f7fa;
">

  <!-- Header -->
  <div style="
    background: linear-gradient(to right, #2563eb, #1e40af);
    padding: 25px;
    text-align: center;
    border-radius: 8px 8px 0 0;
  ">
    <h1 style="color: #ffffff; margin: 0;">
      Verify Your Email
    </h1>
  </div>

  <!-- Body -->
  <div style="
    background-color: #ffffff;
    padding: 25px;
    border-radius: 0 0 8px 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  ">

    <p>Hello,</p>

    <p>
      Thank you for registering on <strong>Citizone</strong>.
      Please use the verification code below to confirm your email address.
    </p>

    <!-- Verification Code -->
    <div style="text-align: center; margin: 30px 0;">
      <span style="
        font-size: 32px;
        font-weight: bold;
        letter-spacing: 6px;
        color: #2563eb;
      ">
        ${verificationCode}
      </span>
    </div>

    <p>
      Enter this code on the verification screen to complete your registration.
    </p>

    <p style="color: #6b7280; font-size: 14px;">
      This code will expire in <strong>10 minutes</strong> for security reasons.
    </p>

    <p>
      If you did not create an account on Citizone, you can safely ignore this email.
    </p>

    <p style="margin-top: 25px;">
      Regards,<br />
      <strong>Citizone Team</strong>
    </p>
  </div>

  <!-- Footer -->
  <div style="text-align: center; margin-top: 20px; color: #9ca3af; font-size: 12px;">
    <p>This is an automated message. Please do not reply.</p>
    <p>© ${new Date().getFullYear()} Citizone. All rights reserved.</p>
  </div>

</body>
</html>
  `;
};


export const welcomeEmailTemplate = () => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Welcome to Citizone</title>
</head>

<body style="font-family: Arial, sans-serif; background-color: #f5f7fa; padding: 20px;">

  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">

    <!-- Header -->
    <div style="background: linear-gradient(to right, #2563eb, #1e40af); padding: 25px; text-align: center;">
      <h1 style="color: #ffffff; margin: 0;">Welcome to Citizone </h1>
    </div>

    <!-- Body -->
    <div style="padding: 25px; color: #374151;">
      <p>Hello,</p>

      <p>
        We’re excited to welcome you to <strong>Citizone</strong> — a platform designed
        to connect communities, services, and people in one place.
      </p>

      <ul>
        <li>Stay updated with local announcements</li>
        <li>Connect with your community</li>
        <li>Raise and track issues easily</li>
      </ul>

      <p>
        If you need any help, our support team is always here for you.
      </p>

      <p style="margin-top: 20px;">
        Regards,<br />
        <strong>Citizone Team</strong>
      </p>
    </div>

    <!-- Footer -->
    <div style="text-align: center; padding: 15px; font-size: 12px; color: #9ca3af;">
      © ${new Date().getFullYear()} Citizone. All rights reserved.
    </div>

  </div>
</body>
</html>
`;
};

export const passwordResetRequestTemplate = (resetUrl) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Reset Your Password</title>
</head>

<body style="font-family: Arial, sans-serif; background-color: #f5f7fa; padding: 20px;">

  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">

    <div style="background: linear-gradient(to right, #2563eb, #1e40af); padding: 25px; text-align: center;">
      <h1 style="color: #ffffff; margin: 0;">Password Reset</h1>
    </div>

    <div style="padding: 25px;">
      <p>Hello,</p>

      <p>
        We received a request to reset your Citizone account password.
      </p>

      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetUrl}" style="
          background-color: #1e40af;
          color: #ffffff;
          padding: 12px 24px;
          text-decoration: none;
          border-radius: 30px;
          font-weight: bold;
        ">
          Reset Password
        </a>
      </div>

      <p style="font-size: 14px; color: #6b7280;">
        This link will expire in <strong>10 Minutes</strong>.
        If you didn’t request this, please ignore this email.
      </p>

      <p>
        Regards,<br />
        <strong>Citizone Team</strong>
      </p>
    </div>

    <div style="text-align: center; padding: 15px; font-size: 12px; color: #9ca3af;">
      This is an automated message. Please do not reply.
    </div>

  </div>
</body>
</html>
`;
};

export const passwordResetSuccessTemplate = () => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Password Reset Successful</title>
</head>

<body style="font-family: Arial, sans-serif; background-color: #f5f7fa; padding: 20px;">

  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">

    <div style="background: linear-gradient(to right, #2563eb, #1e40af); padding: 25px; text-align: center;">
      <h1 style="color: #ffffff; margin: 0;">Password Reset Successful</h1>
    </div>

    <div style="padding: 25px;">
      <p>Hello,</p>

      <p>
        This email confirms that your Citizone account password has been
        successfully reset.
      </p>

      <p style="color: #6b7280;">
        If you did not perform this action, please contact our support team immediately.
      </p>

      <p>
        Stay safe,<br />
        <strong>Citizone Team</strong>
      </p>
    </div>

    <div style="text-align: center; padding: 15px; font-size: 12px; color: #9ca3af;">
      © ${new Date().getFullYear()} Citizone. All rights reserved.
    </div>

  </div>
</body>
</html>
`;
};

export const sendFriendRequestTemplate = (recipientName, commenterName, postUrl, commentContent) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Comment on Your Post</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(to right, #0077B5, #00A0DC); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <img src="https://img.freepik.com/premium-vector/linkedin-logo_578229-227.jpg" alt="UnLinked Logo" style="width: 150px; margin-bottom: 20px;border-radius: 10px;"/>
    <h1 style="color: white; margin: 0; font-size: 28px;">New Comment on Your Post</h1>
  </div>
  <div style="background-color: #ffffff; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
    <p style="font-size: 18px; color: #0077B5;"><strong>Hello ${recipientName},</strong></p>
    <p>${commenterName} has commented on your post:</p>
    <div style="background-color: #f3f6f8; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <p style="font-style: italic; margin: 0;">"${commentContent}"</p>
    </div>
    <div style="text-align: center; margin: 30px 0;">
      <a href=${postUrl} style="background-color: #0077B5; color: white; padding: 14px 28px; text-decoration: none; border-radius: 30px; font-weight: bold; font-size: 16px; transition: background-color 0.3s;">View Comment</a>
    </div>
    <p>Stay engaged with your network by responding to comments and fostering discussions.</p>
    <p>Best regards,<br>The UnLinked Team</p>
  </div>
</body>
</html>
`;

export const accepteFriendRequestTemplate = (senderName, recipientName, dashboardURL) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Connection Request Accepted</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(to right, #0077B5, #00A0DC); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <img src="https://img.freepik.com/premium-vector/linkedin-logo_578229-227.jpg" alt="UnLinked Logo" style="width: 150px; margin-bottom: 20px;border-radius: 10px;"/>
    <h1 style="color: white; margin: 0; font-size: 28px;">Connection Accepted!</h1>
  </div>
  <div style="background-color: #ffffff; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
    <p style="font-size: 18px; color: #0077B5;"><strong>Hello ${senderName},</strong></p>
    <p>Great news! <strong>${recipientName}</strong> has accepted your connection request on UnLinked.</p>
    <div style="background-color: #f3f6f8; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <p style="font-size: 16px; margin: 0;"><strong>What's next?</strong></p>
      <ul style="padding-left: 20px;">
        <li>Check out ${recipientName}'s full profile</li>
        <li>Send a message to start a conversation</li>
        <li>Explore mutual connections and interests</li>
      </ul>
    </div>
    <div style="text-align: center; margin: 30px 0;">
      <a href="${dashboardURL}" style="background-color: #0077B5; color: white; padding: 14px 28px; text-decoration: none; border-radius: 30px; font-weight: bold; font-size: 16px; transition: background-color 0.3s;">View ${recipientName}'s Profile</a>
    </div>
    <p>Expanding your professional network opens up new opportunities. Keep connecting!</p>
    <p>Best regards,<br>The UnLinked Team</p>
  </div>
</body>
</html>
`;


