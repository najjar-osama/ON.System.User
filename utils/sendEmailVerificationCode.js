const sendgrid = require("@sendgrid/mail");
sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmailVerificationCode = (email, name, code) => {
  const emailHtmlBody = `<div style="height:100%;" >
                    <p>Dear ${name},</p>
                    <p>Thanks for Signing up. </p>
                    <p>You can use this code to verify your email : <b>${code}</b>
                    <p></p>
                    <p>Best reagrds,</p>
                    <p>Dev team.</p>
                </div>`;
  const emailPlainText = `Dear ${name},
  Thanks for Signing up.
  You can use this code to verify your email : ${code}

  Best reagrds,
  Dev team.`;

  const message = {
    to: email,
    from: "dev@company_name.com",
    subject: "Welcome to NAME- Verify your email.",
    text: emailPlainText,
    html: emailHtmlBody
  };

  sendgrid.send(message);
};

module.exports = sendEmailVerificationCode;
