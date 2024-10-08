import React from "react";
import HtmlParser from "../../helpers/html-parser";


const QuotationEmailSupplierHeader = (props) => {
  return (
    <table cellPadding="0" cellSpacing="0" border="0" width="100%">
      <tbody>
        <tr>
          <td style={{ padding: "0px 0px 8px 0px", fontSize: "14px" }}>
            <span>Dear Vendor/Supplier,</span>
          </td>
        </tr>

        <tr>
          <td style={{ padding: "0px 0px 8px 0px", fontSize: "14px" }}>
            {props.supplieremailtermsconditions === "" &&
              <span>
                We have a received a request for {props.type === "Quotation" && "quotation"}{props.type === "Itinerary" && "itinerary"}. Below are the details requested for your review:
              </span>
            }
            {props.supplieremailtermsconditions !== "" &&
              <span>
                {<HtmlParser text={props.supplieremailtermsconditions.replaceAll("\n", "<br/>")} />}
              </span>
            }
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default QuotationEmailSupplierHeader;
