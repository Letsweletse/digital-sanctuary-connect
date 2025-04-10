
export function getEmailStyles(): string {
  return `
  <style type="text/css">
    /* Base styles */
    body {
      margin: 0;
      padding: 0;
      font-family: Arial, sans-serif;
      line-height: 1.5;
      color: #333333;
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
      background-color: #f8fafc;
    }
    table {
      border-spacing: 0;
      border-collapse: collapse;
      width: 100%;
      mso-table-lspace: 0pt;
      mso-table-rspace: 0pt;
    }
    td {
      padding: 0;
      vertical-align: top;
    }
    img {
      border: 0;
      height: auto;
      line-height: 100%;
      outline: none;
      text-decoration: none;
      display: block;
      -ms-interpolation-mode: bicubic;
      max-width: 100%;
    }
    p {
      margin: 0 0 15px 0;
      display: block;
    }
    h1, h2, h3, h4, h5, h6 {
      color: #333333;
      line-height: 1.3;
      margin-top: 0;
      margin-bottom: 10px;
    }
    a {
      color: #3b82f6;
      text-decoration: underline;
    }
    a:hover {
      text-decoration: none;
    }
    .main-container {
      width: 100%;
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
    }
    
    /* Fix for Outlook and older clients */
    .ExternalClass {
      width: 100%;
    }
    .ExternalClass,
    .ExternalClass p,
    .ExternalClass span,
    .ExternalClass font,
    .ExternalClass td,
    .ExternalClass div {
      line-height: 100%;
    }
    
    /* Email client specific fixes */
    @media all {
      .ReadMsgBody { width: 100%; }
      .ExternalClass { width: 100%; }
      .ExternalClass * { line-height: 100%; }
      .gmail-fix { display: none !important; }
    }
    
    /* Mobile responsiveness */
    @media only screen and (max-width: 600px) {
      .two-col {
        width: 100% !important;
        display: block !important;
      }
      .spacer {
        display: none !important;
      }
      .qr-container {
        margin-bottom: 20px !important;
      }
      .mobile-padding {
        padding: 15px !important;
      }
      .mobile-center {
        text-align: center !important;
      }
      .mobile-full-width {
        width: 100% !important;
      }
      .mobile-hidden {
        display: none !important;
      }
      .mobile-stack {
        display: block !important;
      }
      .mobile-img {
        height: auto !important;
        width: 100% !important;
      }
    }
  </style>
  `;
}

export function getEmailWrapper(content: string): string {
  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <meta name="color-scheme" content="light">
  <meta name="supported-color-schemes" content="light">
  <title>Registration Confirmation</title>
  ${getEmailStyles()}
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: Arial, sans-serif; width: 100% !important; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%;">
  <!-- Fix for Gmail on iOS -->
  <div class="gmail-fix" style="white-space: nowrap; font: 15px courier; line-height: 0;">&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;</div>
  
  <!--[if mso]>
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
  <tr>
  <td align="center">
  <![endif]-->
  
  <!-- Email Wrapper -->
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f8fafc; padding: 20px 0;">
    <tr>
      <td align="center">
        <!-- Main Email Container -->
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" style="max-width: 600px; border: 1px solid #eaeaea; border-radius: 8px; overflow: hidden; background-color: #ffffff;">
          ${content}
        </table>
      </td>
    </tr>
  </table>
  
  <!--[if mso]>
  </td>
  </tr>
  </table>
  <![endif]-->
</body>
</html>`;
}
