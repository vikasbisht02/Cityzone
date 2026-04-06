import { accepteFriendRequestTemplate, passwordResetRequestTemplate, passwordResetSuccessTemplate, sendFriendRequestTemplate, sendWelcomeEmailTemplate, verificationEmailTemplate, welcomeEmailTemplate } from "./emailTemplate.js";
import { transporter } from "./nodemailerConfig.js";

export const sendWelcomeEmail = async (email) => {
  try {
    const mailOptions = {
      from: `"Citizone" <no-reply@citizone.com>`, // Sender address
      to: email, // Recipient address
      subject: "Welcome to Signup", // Email subject
      html: welcomeEmailTemplate(), // HTML body
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);

    console.log(
      `Welcome Email sent successfully to ${email}. Message ID: ${info.messageId}`
    );

    // Return success response
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`Failed to send Welcome Email to ${email}:`, error.message);
    // Return failure response
    return { success: false, error: error.message };
  }
};
export const sendVerificationEmail = async (email, verificationToken) => {
  try {
    // Validate inputs
    if (!email || !verificationToken) {
      throw new Error(
        "Missing required parameters: email or verificationToken"
      );
    }

    const mailOptions = {
      from: `"Citizone" <no-reply@citizone.com>`, // Sender address
      to: email, // Recipient address
      subject: "Email Verification", // Email subject
      text: "This message for OTP Verification please don't share it.",
      html: verificationEmailTemplate(verificationToken), // HTML body
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);

    console.log(
      `Verification Email sent successfully to ${email}. Message ID: ${info.messageId}`
    );

    // Return success response
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`Failed to send verification Email to ${email}:`, error.message);
    // Return failure response
    return { success: false, error: error.message };
  }
};

export const sendPasswordResetEmail = async (email, resetURL) => {
  try {

    // Validates inputs
    if (!email || !resetURL) {
      throw new Error(
        "Missing required parameters: email or resetURL"
      );
    }

    const mailOptions = {
      from: `"Citizone" <no-reply@citizone.com>`, // Sender address
      to: email, // Recipient address
      subject: "Forgot Password", // Email subject
      html: passwordResetRequestTemplate(resetURL), // HTML body
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);

    console.log(
      `Forgot password email sent successfully to ${email}. Message ID: ${info.messageId}`
    );

    // Return success response
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`Failed to send forgot password email to ${email}:`, error.message);
    // Return failure response
    return { success: false, error: error.message };
  }
};

export const sendResetSuccessEmail = async (email) => {
  try {
    const mailOptions = {
      from: `"Citizone" <no-reply@citizone.com>`, // Sender address
      to: email, // Recipient address
      subject: "Password Reset", // Email subject
      html: passwordResetSuccessTemplate(), // HTML body
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);

    console.log(
      `Password reset successfully email sent successfully to ${email}. Message ID: ${info.messageId}`
    );

    // Return success response
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`Failed to send password reset successfully email to ${email}:`, error.message);

    // Return failure response
    return { success: false, error: error.message };
  }
};

export const sendCommentNotificationEmail = async (
  recipientEmail,
  recipientName,
  commenterName,
  postUrl,
  commentContent
) => {
  try {
    // Ensure required parameters are provided
    if (
      !recipientEmail ||
      !recipientName ||
      !commenterName ||
      !postUrl ||
      !commentContent
    ) {
      throw new Error("Missing required parameters for sending email");
    }

    const mailOptions = {
      from: `"LinkedIn" <no-reply@linkedin.com>`, // Sender address
      to: recipientEmail, // Recipient email
      subject: "New comment on your post", // Email subject
      html: sendFriendRequestTemplate(
        recipientName,
        commenterName,
        postUrl,
        commentContent
      ), // HTML body content
    };

    const info = await transporter.sendMail(mailOptions); // Send the email
    console.log(
      `Notification Email sent successfully to ${recipientEmail}. Message ID: ${info.messageId}`
    );

    // Return success status
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(
      `Failed to send Comment Notification Email to ${recipientEmail}:`,
      error.message
    );

    // Return failure status
    return { success: false, error: error.message };
  }
};

export const sendConnectionAcceptedEmail = async (
  senderEmail,
  senderName,
  recipientName,
  profileUrl
) => {

  try {
    // Ensure required parameters are provided
    if (!senderEmail || !senderName || !recipientName || !profileUrl) {
      throw new Error("Missing required parameters for sending email");
    }

    const mailOptions = {
      from: `"LinkedIn" <no-reply@linkedin.com>`, // Sender address
      to: senderEmail, // Recipient email
      subject: `${recipientName} accepted your connection request`, // Email subject
      html: accepteFriendRequestTemplate(senderName, recipientName, profileUrl), // HTML body content
    };

    const info = await transporter.sendMail(mailOptions); // Send the email
    console.log(
      `Connection request accepted Email sent successfully to ${senderEmail}. Message ID: ${info.messageId}`
    );

    // Return success status
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(
      `Failed to send Connection request accepted Email to ${recipientEmail}:`,
      error.message
    );

    // Return failure status
    return { success: false, error: error.message };
  }
};

export const sendWelcomeEmail1 = async (email, dashboardUrl) => {
  try {
    // Validate inputs
    if (!email || !dashboardUrl) {
      throw new Error(
        "Missing required parameters: email or dashboardUrl"
      );
    }

    const mailOptions = {
      from: `"LinkedIn" <no-reply@linkedin.com>`, // Sender address
      to: email, // Recipient address
      subject: "Welcome to Signup", // Email subject
      html: sendWelcomeEmailTemplate(dashboardUrl), // HTML body
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);

    console.log(
      `Welcome Email sent successfully to ${email}. Message ID: ${info.messageId}`
    );

    // Return success response
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`Failed to send Welcome Email to ${email}:`, error.message);

    // Return failure response
    return { success: false, error: error.message };
  }
};



