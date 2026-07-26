import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendPasswordResetEmail = async (
  to: string,
  name: string,
  token: string
): Promise<void> => {
  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${token}`;

  await transporter.sendMail({
    from: `"${process.env.FROM_NAME}" <${process.env.FROM_EMAIL}>`,
    to,
    subject: 'Reset your KHOJ password',
    html: `
      <h2>Hello ${name},</h2>
      <p>You requested a password reset for your KHOJ account.</p>
      <p>Click the link below to reset your password. This link expires in 1 hour.</p>
      <a href="${resetUrl}" style="background:#c0392b;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;display:inline-block;">
        Reset Password
      </a>
      <p>If you did not request this, please ignore this email.</p>
      <p>— The KHOJ Team</p>
    `,
  });
};

export const sendWelcomeEmail = async (to: string, name: string): Promise<void> => {
  await transporter.sendMail({
    from: `"${process.env.FROM_NAME}" <${process.env.FROM_EMAIL}>`,
    to,
    subject: 'Welcome to KHOJ – Discover the Soul of Nepal',
    html: `
      <h2>Namaste ${name} 🙏</h2>
      <p>Welcome to KHOJ. We're excited to have you explore Nepal's living heritage.</p>
      <p>Start by using the AI Cultural Compass to discover communities, crafts, and festivals that resonate with you.</p>
      <p>— The KHOJ Team</p>
    `,
  });
};