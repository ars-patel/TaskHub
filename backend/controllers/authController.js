import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Verification from "../models/verification.js";
import { sendEmail } from "../libs/send-email.js";
import aj from "../libs/arcjet.js";
import dotenv from "dotenv";

dotenv.config();

const registerUser = async (req, res) => {
  try {
    const { email, name, password, role } = req.body;
    console.log("Incoming email:", email);

    const decision = await aj.protect(req, { email });
    console.log("Arcjet decision", decision.isDenied());

    if (decision.isDenied()) {
      console.log("Arcjet blocked this request", decision);
      res.writeHead(403, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Invalid email address" }));
      return;
    }

    const existingUser = await User.findOne({ email, role });

    if (existingUser) {
      return res.status(400).json({
        message: `Email address already in use for this ${role}`,
      });
    }

    const salt = await bcrypt.genSalt(10);

    const hashPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      email,
      password: hashPassword,
      name,
      role,
    });

    const verificationToken = jwt.sign(
      { userId: newUser._id, purpose: "email-verification" },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    await Verification.create({
      userId: newUser._id,
      token: verificationToken,
      expiresAt: new Date(Date.now() + 1 * 60 * 60 * 1000),
    });

    // send email
    const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
    const emailBody = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 8px;">
    <h2 style="text-align: center; color: #4F46E5;">Verify Your Email Address</h2>
    <p style="font-size: 16px; color: #333;">
        Hi ${name || "there"},
    </p>
    <p style="font-size: 16px; color: #333;">
        Thank you for registering! Please verify your email to activate your account.
    </p>
    <div style="text-align: center; margin: 40px 0;">
        <a href="${verificationLink}" 
           style="background-color: #4F46E5; color: white; text-decoration: none; padding: 15px 30px; border-radius: 8px; font-size: 16px; font-weight: 600; display: inline-block; box-shadow: 0 2px 4px rgba(79, 70, 229, 0.2);">
            Verify Email Address
        </a>
    </div>
    <p style="font-size: 14px; color: #666; text-align: center; margin-top: 30px;">
        This verification link will expire in 1 hour.
    </p>
    <p style="font-size: 14px; color: #999; margin-top: 20px; text-align: center;">
        If you didn't create this account, please ignore this email.
    </p>
    <hr style="border: none; border-top: 1px solid #eaeaea; margin: 30px 0;" />
    <p style="font-size: 12px; color: #aaa; text-align: center;">
        &copy; ${new Date().getFullYear()} ${
      process.env.APP_NAME || "Our App"
    }. All rights reserved.
    </p>
</body>
</html>`;

    const emailSubject = "Verify your email";
    console.log("Verification link:", verificationLink);

    const isEmailSent = await sendEmail(email, emailSubject, emailBody);

    if (!isEmailSent) {
      return res.status(500).json({
        message: "Failed to send verification email",
      });
    }

    res.status(201).json({
      message: `Thank you for registering as a ${role}. Please verify your email to activate your account.`,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: "Internal server error" });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // Find user with password field
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    if (!user.isEmailVerified) {
      const existingVerification = await Verification.findOne({
        userId: user._id,
      });

      // If token still valid
      if (existingVerification && existingVerification.expiresAt > new Date()) {
        return res.status(400).json({
          message:
            "Email not verified. Please check your email for the verification link.",
        });
      } else {
        if (existingVerification) {
          await Verification.findByIdAndDelete(existingVerification._id);
        }

        // Create new verification token
        const verificationToken = jwt.sign(
          { userId: user._id, purpose: "email-verification" },
          process.env.JWT_SECRET,
          { expiresIn: "1h" }
        );

        await Verification.create({
          userId: user._id,
          token: verificationToken,
          expiresAt: new Date(Date.now() + 1 * 60 * 60 * 1000),
        });

        // Send email
        const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
        const emailBody = `<p>Click <a href="${verificationLink}">here</a> to verify your email</p>`;
        const emailSubject = "Verify your email";
        const isEmailSent = await sendEmail(email, emailSubject, emailBody);

        if (!isEmailSent) {
          return res.status(500).json({
            message: "Failed to send verification email",
          });
        }

        return res.status(201).json({
          message:
            "Verification email sent to your email. Please check and verify your account.",
        });
      }
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Create login token
    const token = jwt.sign(
      { userId: user._id, purpose: "login" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    user.lastLogin = new Date();
    await user.save();

    // Prepare user data without password
    const userData = user.toObject();
    delete userData.password;

    return res.status(200).json({
      message: `Login successful as ${role}`,
      token,
      user: userData,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const { token } = req.body;

    const payload = jwt.verify(token, process.env.JWT_SECRET);

    if (!payload) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { userId, purpose } = payload;

    if (purpose !== "email-verification") {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const verification = await Verification.findOne({
      userId,
      token,
    });

    if (!verification) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const isTokenExpired = verification.expiresAt < new Date();

    if (isTokenExpired) {
      return res.status(401).json({ message: "Token expired" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({ message: "Email already verified" });
    }

    user.isEmailVerified = true;
    await user.save();

    await Verification.findByIdAndDelete(verification._id);

    res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const resetPasswordRequest = async (req, res) => {
  try {
    const { role } = req.body;
    const { email } = req.body;

    if (!role || !email) {
      return res.status(400).json({ message: "Email and role are required" });
    }


    const user = await User.findOne({ email, role });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (!user.isEmailVerified) {
      return res
        .status(400)
        .json({ message: "Please verify your email first" });
    }

    const existingVerification = await Verification.findOne({
      userId: user._id,
    });

    if (existingVerification && existingVerification.expiresAt > new Date()) {
      return res.status(400).json({
        message: "Reset password request already sent",
      });
    }

    if (existingVerification && existingVerification.expiresAt < new Date()) {
      await Verification.findByIdAndDelete(existingVerification._id);
    }

    const resetPasswordToken = jwt.sign(
      { userId: user._id, purpose: "reset-password" },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    await Verification.create({
      userId: user._id,
      token: resetPasswordToken,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000),
    });

    const resetPasswordLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetPasswordToken}`;
    const emailBody = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f7f7f7;">
    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto;">
        <tr>
            <td style="padding: 40px 20px;">
                <!-- Card -->
                <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background: #ffffff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.05);">
                    <!-- Header -->
                    <tr>
                        <td style="padding: 30px 30px 10px; text-align: center;">
                            <h1 style="margin: 0; color: #4F46E5; font-size: 22px; font-weight: 600;">Password Reset Request</h1>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 20px 30px; color: #444444; font-size: 15px; line-height: 1.6;">
                            <p>Hello ${user.name +" " +`${role}` || "there"},</p>
                            <p>We received a request to reset your password. Click the button below to create a new password:</p>
                        </td>
                    </tr>
                    
                    <!-- Button -->
                    <tr>
                        <td style="padding: 0 30px 25px; text-align: center;">
                            <a href="${resetPasswordLink}" 
                               style="background-color: #4F46E5; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-size: 15px; font-weight: 600; display: inline-block;">
                                Reset Password
                            </a>
                        </td>
                    </tr>
                    
                    <!-- Expiration Notice -->
                    <tr>
                        <td style="padding: 0 30px 20px; color: #666666; font-size: 14px; text-align: center;">
                            <p style="margin: 0;">This link expires in 15 minutes.</p>
                            <p style="margin: 10px 0 0;">If you didn't request this, please ignore this email.</p>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="padding: 20px 30px; background-color: #f9f9f9; border-top: 1px solid #eeeeee; text-align: center;">
                            <p style="margin: 0; color: #999999; font-size: 12px;">
                                &copy; ${new Date().getFullYear()} ${
      process.env.APP_NAME || "Our App"
    }. All rights reserved.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
`;
    const emailSubject = "Reset your password";

    const isEmailSent = await sendEmail(email, emailSubject, emailBody);

    if (!isEmailSent) {
      return res.status(500).json({
        message: "Failed to send reset password email",
      });
    }

    res.status(200).json({ message: "Reset email sent successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const verifyResetPasswordTokenAndResetPassword = async (req, res) => {
  try {
    const { token, newPassword, confirmPassword } = req.body;

    const payload = jwt.verify(token, process.env.JWT_SECRET);

    if (!payload) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { userId, purpose } = payload;

    if (purpose !== "reset-password") {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const verification = await Verification.findOne({
      userId,
      token,
    });

    if (!verification) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const isTokenExpired = verification.expiresAt < new Date();

    if (isTokenExpired) {
      return res.status(401).json({ message: "Token expired" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const salt = await bcrypt.genSalt(10);

    const hashPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashPassword;
    await user.save();

    await Verification.findByIdAndDelete(verification._id);

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export {
  registerUser,
  loginUser,
  verifyEmail,
  resetPasswordRequest,
  verifyResetPasswordTokenAndResetPassword,
};
