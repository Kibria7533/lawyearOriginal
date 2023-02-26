const footer = require("./email-component");
const { fontendUrl } = require("../config");

const resetPasswordTemplate = ({ tokens }) => {
  let tokensString = "";
  tokens.map(({ token, user_id, role }) => {
    let link = fontendUrl + "restore-password/" + token;

    tokensString =
      tokensString +
      `<a
            class="btn"
            href="${link}"
            style="
              border-color: transparent;
              padding: 5px 18px;
              text-decoration: none;
              border-radius: 0px;
              font-size: 15px;
              background-color: #2064ee !important;
              color: #fff !important;
              display: inline-block;
              width: 100%;
              text-align: center;
              margin-top: 10px;
            "
            target="_blank"
            >${user_id} (${role})</a
          ><br/>`;
  });
  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
  <html xmlns="http://www.w3.org/1999/xhtml">
    <head>
      <meta charset="UTF-8" />
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Password Reset Request for Dossier Direct</title>
      <style type="text/css">
        @import url("https://use.typekit.net/erz2ipp.css");
        @import url("https://use.typekit.net/grk1pie.css");
      </style>
    </head>
    <body style="margin: 0; padding: 0; color: #3d3d3d">
      <div
        class="body-inner"
        style="
          max-width: 500px;
          margin: auto;
          font-family: neue-kabel, sans-serif !important;
        "
      >
        <h2 class="subject" style="font-size: 24px; color: #000000">
          Password Reset Request for Dossier Direct
        </h2>
        <div
          class="brand-logo-wrapper"
          style="text-align: center"
        >
          <img
            src="https://res.cloudinary.com/sendbox-payment/image/upload/v1635935966/logo_xpziwi.png"
            alt=""
            style="max-width: 50% !important; padding: 10px 0"
          />
        </div>
        <div class="content" style="width: 95%; margin: auto; padding: 15px">
          <p style="font-size: 16px; margin-bottom: 30px; font-weight: bold">
            A request has been received to change the password for your Dossier Direct
            account. You can click which is your desired USER ID for reset password.
          </p>
          ${tokensString}
          <p style="font-size: 16px; margin-top: 20px;">
            If you did not initiate this request, please contact us immediately at
            <a
              href="mailto:support@dossierDirect.com"
              style="color: #3d3d3d !important; text-decoration: underline !important;"
              >support@dossierDirect.com.</a
            >
          </p>
          <h3 class="thank" style="margin-top: 40px; font-size: 16px">
            Thanks! <br />
            Dossier Direct Team
          </h3>
          <p
            style="
              color: #969696;
              font-size: 10px !important;
            "
          >
            This email was sent from a notification-only address that cannot
            accept incoming email. Please do not reply to this message.
          </p>
        </div>
       ${footer(fontendUrl)}
      </div>
    </body>
  </html>
  `;
};

module.exports = resetPasswordTemplate;
