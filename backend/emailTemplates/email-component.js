const footer = (fontendUrl) => `<div
style="background-color: #2c2c2c; color: #fff; margin: 30px 0 30px"
>
<div class="content" style="width: 95%; margin: auto; padding: 15px">
  <p
    style="
      font-size: 16px;
      margin: 15px 0;
      color: #fff;
      font-size: 10px;
      margin: 0;
    "
  >
    Customer Service:
    <a
      href="mailto:support@dossierDirect.com"
      style="font-size: 10px; margin: 0; color: #fff !important; text-decoration: underline !important;"
      ><strong>support@dossierDirect.com </strong>
    </a>
    <span style="color: #fff !important">
      Monday through Friday, 9 a.m - 6 p.m E.T.
    </span>
  </p>
  <ul class="footer-ul" style="padding: 0; list-style: none">
    <li
      class="border-li"
      style="
        padding-right: 7px;
        margin-right: 4px;
        margin-left: 0 !important;
        border-right: 2px solid #fff;
        display: inline-block;
      "
    >
      <p
        style="font-size: 16px; color: #fff; font-size: 10px; margin: 0"
      >
        <a
          href="${fontendUrl}contact"
          target="_blank"
          style="font-size: 10px; margin: 0; color: #fff !important; text-decoration: underline !important;"
          >Privacy Policy</a
        >
      </p>
    </li>
    <li
      class="border-li"
      style="
        padding-right: 7px;
        margin-left: 0 !important;
        margin-right: 4px;
        border-right: 2px solid #fff;
        display: inline-block;
      "
    >
      <p
        style="font-size: 16px; color: #fff; font-size: 10px; margin: 0"
      >
        <a
          href="${fontendUrl}contact"
          target="_blank"
          style="font-size: 10px; margin: 0; color: #fff !important; text-decoration: underline !important;"
          >Term & Conditions</a
        >
      </p>
    </li>
    <li style="display: inline-block; margin-left: 0 !important">
      <p
        style="font-size: 16px; color: #fff; font-size: 10px; margin: 0"
      >
        <a
          href="${fontendUrl}contact"
          target="_blank"
          style="font-size: 10px; margin: 0; color: #fff !important;  text-decoration: underline !important;"
          >Contact us</a
        >
      </p>
    </li>
  </ul>
  <p
    class="follow"
    style="
      padding-bottom: 15px;
      border-bottom: 2px solid #fff;
      font-size: 16px;
      margin: 15px 0;
      color: #fff;
      font-size: 10px;
      margin: 0;
    "
  >
    Follow us on
    <a
      href="https://www.instagram.com/dossierDirect"
      target="_blank"
      style="
        font-size: 10px;
        margin: 0;
        color: #fff !important;
        text-decoration: underline !important;
      "
      ><strong>Instagram</strong></a
    >
  </p>
  <img
    src="https://res.cloudinary.com/sendbox-payment/image/upload/v1635935966/logo_xpziwi.png"
    alt=""
    class="footer-logo"
    style="margin: 20px 0; max-width: 50% !important; filter: brightness(0) invert(1);"
  />
  <p
    class="copyright-msg"
    style="
      font-size: 16px;
      margin: 15px 0;
      color: #fff;
      font-size: 10px;
      margin: 0;
    "
  >
    © Dossier Direct 2021. All rights reserved.
  </p>
</div>
</div>`;

module.exports = footer;
