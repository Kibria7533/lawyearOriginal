const sendGrid = require("@sendgrid/mail");

sendGrid.setApiKey(
  "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"
);
const mailSender = async (msg) => {
  return await sendGrid.send(msg);
};

const multipleMailSender = async ({ emails, subject, html }) => {
  const msg = {
    from: process.env.SMTP_EMAIL,
    to: emails,
    subject,
    html,
  };
  try {
    await sendGrid.send(msg, true);
  } catch (error) {
    console.log(error.response.body);
  }
};

module.exports = mailSender;
