import React from "react";

const UmrahPackageEmailHeader = (props) => {
  return (
    <table cellPadding="0" cellSpacing="0" border="0" width="100%">
      <tbody>
        <tr>
          <td style={{ padding: "0px 0px 8px 0px", fontSize: "14px" }}>
            <span>Dear {props.customerName},</span>
          </td>
        </tr>

        <tr>
          <td style={{ padding: "0px 0px 8px 0px", fontSize: "14px" }}>
            <span>
              Following your recent inquiry, we are pleased to offer you the following{" "}
              {props.type === "Quotation" && "quotation"}
              {props.type === "Itinerary" && "itinerary"} for your trip:
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default UmrahPackageEmailHeader;
