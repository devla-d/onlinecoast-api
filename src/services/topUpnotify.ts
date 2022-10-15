import moment from "moment";

const topUpNotify = (tx: any, ty_pe: string) => {
  return `


    <!DOCTYPE html>
<html
  lang="en"
  xmlns="http://www.w3.org/1999/xhtml"
  xmlns:o="urn:schemas-microsoft-com:office:office"
>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <meta name="x-apple-disable-message-reformatting" />
    <title></title>
    <style type="text/css">
      @media screen {
        @font-face {
          font-family: "Lato";
          font-style: normal;
          font-weight: 400;
          src: local("Lato Regular"), local("Lato-Regular"),
            url(https://fonts.gstatic.com/s/lato/v11/qIIYRU-oROkIk8vfvxw6QvesZW2xOQ-xsNqO47m55DA.woff)
              format("woff");
        }
        @font-face {
          font-family: "Lato";
          font-style: normal;
          font-weight: 700;
          src: local("Lato Bold"), local("Lato-Bold"),
            url(https://fonts.gstatic.com/s/lato/v11/qdgUG4U09HnJwhYI-uK18wLUuEpTyoUstqEm5AMlJo4.woff)
              format("woff");
        }
        @font-face {
          font-family: "Lato";
          font-style: italic;
          font-weight: 400;
          src: local("Lato Italic"), local("Lato-Italic"),
            url(https://fonts.gstatic.com/s/lato/v11/RYyZNoeFgb0l7W3Vu1aSWOvvDin1pK8aKteLpeZ5c0A.woff)
              format("woff");
        }
        @font-face {
          font-family: "Lato";
          font-style: italic;
          font-weight: 700;
          src: local("Lato Bold Italic"), local("Lato-BoldItalic"),
            url(https://fonts.gstatic.com/s/lato/v11/HkF_qI1x_noxlxhrhMQYELO3LdcAZYWl9Si6vvxL-qU.woff)
              format("woff");
        }
      }

      body,
      table,
      td,
      a {
        -webkit-text-size-adjust: 100%;
        -ms-text-size-adjust: 100%;
      }

      table,
      td {
        mso-table-lspace: 0pt;
        mso-table-rspace: 0pt;
      }

      img {
        -ms-interpolation-mode: bicubic;
      }

      img {
        border: 0;
        height: auto;
        line-height: 100%;
        outline: none;
        text-decoration: none;
      }

      table {
        border-collapse: collapse !important;
      }

      body {
        height: 100% !important;
        margin: 0 !important;
        padding: 0 !important;
        width: 100% !important;
      }

      a[x-apple-data-detectors] {
        color: inherit !important;
        text-decoration: none !important;
        font-size: inherit !important;
        font-family: inherit !important;
        font-weight: inherit !important;
        line-height: inherit !important;
      }

      @media screen and (max-width: 480px) {
        .mobile-hide {
          display: none !important;
        }
        .mobile-center {
          text-align: center !important;
        }
      }

      div[style*="margin: 16px 0;"] {
        margin: 0 !important;
      }

      .align-items-center {
        -webkit-box-align: center !important;
        -ms-flex-align: center !important;
        align-items: center !important;
      }

      .justify-content-center {
        -webkit-box-pack: center !important;
        -ms-flex-pack: center !important;
        justify-content: center !important;
      }

      .d-flex {
        display: -webkit-box !important;
        display: -ms-flexbox !important;
        display: flex !important;
      }
      .text-truncate {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    </style>
  </head>

  <body
    style="
      margin: 0 !important;
      padding: 0 !important;
      background-color: #eeeeee;
    "
    bgcolor="#eeeeee"
  >
    <table border="0" cellpadding="0" cellspacing="0" width="100%">
      <tr>
        <td align="center" style="background-color: #eeeeee" bgcolor="#eeeeee">
          <table
            align="center"
            border="0"
            cellpadding="0"
            cellspacing="0"
            width="100%"
            style="max-width: 600px"
          >
            <tr>
              <td
                align="left"
                style="padding: 35px 35px 20px 35px; background-color: #ffffff"
                bgcolor="#ffffff"
              >
                <div
                  class="logo d-flex align-items-center justify-content-center"
                  style="
                    height: 4.375rem;
                    text-decoration: none;
                    font-size: 1rem;
                    font-weight: 800;
                    padding: 1.5rem 1rem;
                    letter-spacing: 0.05rem;
                  "
                >
                  <div>
                    <img
                      src="https://onlineseacoastacct.net/home/logo.png"
                      width="200"
                      style="display: block; width: 200px"
                      alt=""
                    />
                  </div>
                </div>
                <div class="tanktxt">
                  <h1
                    class="text-trunca"
                    style="
                      font-family: 'Lato', Helvetica, Arial, sans-serif;
                      font-size: 20px;
                    "
                  >
                    Dear ${tx.first_name}  ${tx.last_name}
                  </h1>
                  <p
                    style="
                      font-family: 'Lato', Helvetica, Arial, sans-serif;
                      font-size: 18px;
                      font-weight: 400;
                      line-height: 25px;
                      text-transform: capitalize;
                    "
                  >
                    your account has been ${ty_pe}
                  </p>
                  <h4 style="font-size: 20px; font-weight: 400">
                    Invoice ID:
                    <strong
                      style="
                        color: #666666;
                        font-family: 'Lato', Helvetica, Arial, sans-serif;
                        font-size: 14px;
                        font-weight: 600;
                        line-height: 18px;
                      "
                      >${tx.invoiceRef}</strong
                    >
                  </h4>
                  <h4 style="font-size: 20px; font-weight: 400">
                    Amount:
                    <small
                      style="
                        color: #666666;
                        font-family: 'Lato', Helvetica, Arial, sans-serif;
                        font-size: 14px;
                        font-weight: 600;
                        line-height: 18px;
                      "
                      >$${tx.amount}</small
                    >
                  </h4>
                  <h4 style="font-size: 20px; font-weight: 400">
                    Date:
                    <small
                      style="
                        color: #666666;
                        font-family: 'Lato', Helvetica, Arial, sans-serif;
                        font-size: 14px;
                        font-weight: 600;
                        line-height: 18px;
                      "
                      >${moment(tx.createdAt).format(
                        "MMMM Do YYYY, h:mm:ss a"
                      )}</small
                    >
                  </h4>
                  <p>
                    (If you have any question or feedback, just reply to this
                    email )
                  </p>
                </div>
              </td>
            </tr>
            <tr>
              <td
                align="left"
                style="padding: 35px 35px 20px 35px; background-color: #e6e4e4"
                bgcolor="#ffffff"
              >
                <div>
                  <h3>This email was sent by {{domain}}</h3>
                  <p>
                    123 Disney Street Slim Av. Brooklyn Bridge, NY, New York
                  </p>
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>



    
    
    `;
};

export default topUpNotify;
