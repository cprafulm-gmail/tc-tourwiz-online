import React from "react";
import * as Global from "../../helpers/global";
import Linkedin from '../../assets/images/linkedin.png';
import Facebook from '../../assets/images/facebook.png';
import Instagram from '../../assets/images/instagram.png';

const QuotationSupplierEmailFooter = (props) => {
  const { userInfo } = props;
  const { contactInformation, location, provider } = userInfo;

  return (
    <table cellPadding="0" cellSpacing="0" border="0" width="100%">
      <tbody>
        <tr>
          <td style={{ padding: "9px 0px 8px 0px", fontSize: "14px" }}>
            <span>Please confirm the above details so we can inform the details to customer.</span>
          </td>
        </tr>
        <tr>
          <td style={{ padding: "0px 0px 8px 0px", fontSize: "14px" }}>
            <span>Thank You,</span>
          </td>
        </tr>
        <tr>
          <td style={{ padding: "16px 0px 8px 0px", fontSize: "14px" }}>
            {userInfo?.provider?.logo?.url ? (
              <img
                src={userInfo?.provider?.logo?.url}
                height="42px"
                style={{ height: "42px" }}
                alt=""
              />
            ) : (
              <h6
                style={{
                  background: "#f8f9fa",
                  border: "solid 2px #dee2e6",
                  borderRadius: "4px",
                  float: "left",
                  padding: "8px",
                  color: "rgb(241, 130, 71)",
                  margin: "0px",
                  fontSize: "18px",
                }}
              >
                {provider?.name}
              </h6>
            )}
          </td>
        </tr>

        <tr>
          <td style={{ padding: "0px 0px 4px 0px", fontSize: "14px" }}>
            <b>{provider?.name}</b>
          </td>
        </tr>
        <tr>
          <td style={{ padding: "0px 0px 8px 0px", fontSize: "14px" }}>
            <span>{location?.address}</span>
          </td>
        </tr>
        <tr>
          <td style={{ padding: "0px 0px 8px 0px", fontSize: "14px" }}>
            <span>
              Phone :{" "}
              {(contactInformation?.phoneNumberCountryCode
                ? contactInformation?.phoneNumberCountryCode + " "
                : "") + contactInformation?.phoneNumber}
            </span>
          </td>
        </tr>
        <tr>
          <td style={{ padding: "0px 0px 8px 0px", fontSize: "14px" }}>
            <span>
              Email :{" "}
              <a
                href={
                  "mailto:" + Global.getEnvironmetKeyValue("customerCareEmail")
                }
              >
                {contactInformation?.email}
              </a>
            </span>
          </td>
        </tr>
        {userInfo?.websiteURL &&
          <tr>
            <td style={{ padding: "0px 0px 8px 0px", fontSize: "14px" }}>
              <span>
                Website :{" "}
                <a
                  href={userInfo?.websiteURL}
                  target="_blank"
                >
                  {userInfo?.websiteURL}
                </a>
              </span>
            </td>
          </tr>}
        <tr>
          <td className="d-flex justify-content-start mb-2">
            {userInfo?.facebookURL &&
              <a
                target="_blank"
                href={userInfo?.facebookURL}
                className="shadow-sm"
              >
                <img className='img-responsive mr-1'
                  width="24"
                  style={{ filter: "none" }}
                  src={Facebook} />
              </a>
            }
            {userInfo?.instagramURL &&
              <a
                target="_blank"
                href={userInfo?.instagramURL}
                className="shadow-sm"
              >
                <img width="24"
                  className='img-responsive mr-1'
                  style={{ filter: "none" }}
                  src={Instagram}
                />
              </a>
            }
            {userInfo?.linkedinURL &&
              <a
                href={userInfo?.linkedinURL}
                target="_blank"
                className="shadow-sm"
              >
                <img width="24"
                  className='img-responsive mr-1'
                  style={{ filter: "none" }}
                  src={Linkedin}
                />
              </a>
            }
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default QuotationSupplierEmailFooter;
