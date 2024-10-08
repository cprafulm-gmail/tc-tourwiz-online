import React from "react";
import * as Global from "../../helpers/global";

const UmrahPackageEmailFooter = (props) => {
  return (
    <table cellPadding="0" cellSpacing="0" border="0" width="100%">
      <tbody>
        <tr>
          <td style={{ padding: "0px 0px 8px 0px", fontSize: "14px" }}>
            <br />
            <br />
            <span>Terms and Conditions: </span>
            <p style={{ whiteSpace: "pre-wrap" }}>{props.data.terms}</p>
          </td>
        </tr>
        <tr>
          <td style={{ padding: "0px 0px 8px 0px", fontSize: "14px" }}>
            <span>Thank You,</span>
          </td>
        </tr>
        <tr>
          <td style={{ padding: "16px 0px 8px 0px", fontSize: "14px" }}>
            <img
              src={Global.getEnvironmetKeyValue("portalLogo")}
              height="42px"
              style={{ height: "42px" }}
              alt=""
            />
          </td>
        </tr>

        <tr>
          <td style={{ padding: "0px 0px 4px 0px", fontSize: "14px" }}>
            <b>{Global.getEnvironmetKeyValue("portalName")}</b>
          </td>
        </tr>
        <tr>
          <td style={{ padding: "0px 0px 8px 0px", fontSize: "14px" }}>
            <span>{Global.getEnvironmetKeyValue("portalAddress")}</span>
          </td>
        </tr>
        <tr>
          <td style={{ padding: "0px 0px 8px 0px", fontSize: "14px" }}>
            <span>Phone : {Global.getEnvironmetKeyValue("portalPhone")}</span>
          </td>
        </tr>
        <tr>
          <td style={{ padding: "0px 0px 8px 0px", fontSize: "14px" }}>
            <span>
              Email :{" "}
              <a href={"mailto:" + Global.getEnvironmetKeyValue("customerCareEmail")}>
                {Global.getEnvironmetKeyValue("customerCareEmail")}
              </a>
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default UmrahPackageEmailFooter;
