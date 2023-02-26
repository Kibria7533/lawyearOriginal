const footer = require("./email-component");
const { fontendUrl } = require("../config");

const FileCompletionAlertTemplate = ({ queryString, from }) => {
  let link = fontendUrl + queryString;
  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
  <html xmlns="http://www.w3.org/1999/xhtml">
    <head>
      <meta charset="UTF-8" />
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>${
        from
          ? `Lawyer has added a new ${from}`
          : "You have a reminder from your lawyer"
      }</title>
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
          Reminder from lawyer
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
          ${
            from
              ? `Lawyer has added a new ${from}. `
              : "You have a reminder from your lawyer. "
          }Please signin to Dossier Direct and give the information.
          </p>
          <a
            class="btn"
            href="${link}"
            role="button"
            style="
              display: inline-block;
              border-color: transparent;
              padding: 10px 25px;
              text-decoration: none;
              border-radius: 5px;
              font-size: 15px;
              color: #3d3d3d !important;
              background-color: #2064ee !important;
              color: #fff !important;
              display: inline-block;
              margin-top: 10px;
            "
            target="_blank"
            >Open Request</a
          >
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

module.exports = FileCompletionAlertTemplate;
