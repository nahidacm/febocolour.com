import nodemailer from "nodemailer";

const host = process.env.SMTP_HOST;
const port = Number(process.env.SMTP_PORT ?? 587);
const user = process.env.SMTP_USER;
const pass = process.env.SMTP_PASS;

export const emailFrom = {
  name: process.env.SMTP_FROM_NAME ?? "FeboColour",
  address: process.env.SMTP_FROM_EMAIL ?? "orders@febocolour.com",
};

const transporter = host
  ? nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: user && pass ? { user, pass } : undefined,
    })
  : null;

export async function sendMail(options: { to: string; subject: string; html: string; text: string }) {
  if (!transporter) {
    console.warn(`SMTP not configured — skipping email "${options.subject}" to ${options.to}`);
    return;
  }

  await transporter.sendMail({
    from: emailFrom,
    to: options.to,
    subject: options.subject,
    html: options.html,
    text: options.text,
  });
}
