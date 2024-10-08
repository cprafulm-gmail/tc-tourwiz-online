import React from "react";
import * as Global from "../../helpers/global";
import Datecomp from "../../helpers/date";

const GetInquiryEmail = props => {
  let portalCurrency = Global.getEnvironmetKeyValue("portalCurrencyCode");
  const { contactInformation, location, provider } = props.userInfo;
  return (
  <div id="emailHTML" className="mt-4">
    <table
      cellPadding="0"
      cellSpacing="0"
      border="0"
      width="800px"
      style={{ border: "solid 2px #434C5B" }}
    >
      <tbody>
        <tr>
          <td>
            <table cellPadding="0" cellSpacing="0" border="0" width="100%">
              <tbody>
                <tr>
                  <td>
                    <table cellPadding="0" cellSpacing="0" border="0" width="100%">
                      <tbody>
                        <tr>
                          <td
                            style={{
                              background: "#434C5B",
                              padding: "8px 16px",
                              color: "#ffffff",
                              fontSize: "24px",
                              fontWeight: "bold",
                            }}
                          >
                            {"Inquiry Details"}
                            <img
                              src={props.userInfo?.provider?.logo?.url ? props.userInfo?.provider?.logo?.url
                                  : Global.getEnvironmetKeyValue("portalLogo")}
                              height="32px"
                              style={{
                                height: "32px",
                                background: "#fff",
                                borderRadius: "4px",
                                float: "right",
                                padding: "0px 4px",
                              }}
                              alt=""
                            />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>

                <tr>
                  <td style={{ padding: "16px" }}>
                    <table cellPadding="0" cellSpacing="0" border="0" width="100%">
                      <tbody>
                        <tr>
                          <td>
                            <table cellPadding="0" cellSpacing="0" border="0" width="100%">
                              <tbody>
                                <tr>
                                  <td style={{ padding: "0px 0px 8px 0px", fontSize: "14px" }}>
                                    <span>Dear {props.item.data.customerName},</span>
                                  </td>
                                </tr>

                                <tr>
                                  <td style={{ padding: "0px 0px 8px 0px", fontSize: "14px" }}>
                                    <span>
                                      Following your recent inquiry details:
                                    </span>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>

                        <tr>
                          <td>
                          <table cellPadding="0" cellSpacing="0" border="0" width="100%">
                              <tbody>
                                <tr>
                                  <td width="20%">
                                    <span>Inquiry Type:</span>
                                  </td>
                                  <td>
                                    <span>{props.item.data.inquiryType !== "" ? props.item.data.inquiryType : "--"}</span>
                                  </td>
                                </tr>
                                <tr>
                                  <td width="20%">
                                    <span>Name:</span>
                                  </td>
                                  <td>
                                    <span>{props.item.data.customerName}</span>
                                  </td>
                                </tr>
                                <tr>
                                  <td width="20%">
                                    <span>Email:</span>
                                  </td>
                                  <td>
                                    <span>{props.item.data.email}</span>
                                  </td>
                                </tr>
                                <tr>
                                  <td width="20%">
                                    <span>Contact Phone:</span>
                                  </td>
                                  <td>
                                    <span>{props.item.data.phone}</span>
                                  </td>
                                </tr>
                                <tr>
                                  <td width="20%">
                                    <span>Inquiry Title / Details:</span>
                                  </td>
                                  <td>
                                    <span>{props.item.title}</span>
                                  </td>
                                </tr>
                                <tr>
                                  <td width="20%">
                                    <span>Inquiry Source:</span>
                                  </td>
                                  <td>
                                    <span>{props.item.data.inquirySource !== "" ? props.item.data.inquirySource : "--"}</span>
                                  </td>
                                </tr>
                                <tr>
                                  <td width="20%">
                                    <span>Trip Type:</span>
                                  </td>
                                  <td>
                                    <span>{props.item.data.tripType !== "" ? props.item.data.tripType : "--"}</span>
                                  </td>
                                </tr>
                                <tr>
                                  <td width="20%">
                                    <span>Booking For Source:</span>
                                  </td>
                                  <td>
                                    <span>{props.item.data.bookingFor !== "" ? props.item.data.bookingFor : "--"}</span>
                                  </td>
                                </tr>
                                <tr>
                                  <td width="20%">
                                    <span>Start Date:</span>
                                  </td>
                                  <td>
                                    <span>{<Datecomp date={props.item.startDate}/>}</span>
                                  </td>
                                </tr>
                                <tr>
                                  <td width="20%">
                                    <span>Duration (Nights):</span>
                                  </td>
                                  <td>
                                    <span>{props.item.data.duration}</span>
                                  </td>
                                </tr>
                                <tr>
                                  <td width="20%">
                                    <span>Followup Date:</span>
                                  </td>
                                  <td>
                                    <span>{<Datecomp date={props.item.followupDate}/>}</span>
                                  </td>
                                </tr>
                                <tr>
                                  <td width="20%">
                                    <span>Budget ({portalCurrency}):</span>
                                  </td>
                                  <td>
                                    <span>{props.item.data.budget !== "" ? props.item.data.budget : 0.00}</span>
                                  </td>
                                </tr>
                                <tr>
                                  <td width="20%">
                                    <span>Adult:</span>
                                  </td>
                                  <td>
                                    <span>{props.item.data.adults !== "" ? props.item.data.adults : 0}</span>
                                  </td>
                                </tr>
                                <tr>
                                  <td width="20%">
                                    <span>Child:</span>
                                  </td>
                                  <td>
                                    <span>{props.item.data.children !== "" ? props.item.data.children : 0}</span>
                                  </td>
                                </tr>
                                <tr>
                                  <td width="20%">
                                    <span>Infant(s):</span>
                                  </td>
                                  <td>
                                    <span>{props.item.data.infant !== "" ? props.item.data.infant : 0}</span>
                                  </td>
                                </tr>
                                <tr>
                                  <td width="20%">
                                    <span>Other Requirements:</span>
                                  </td>
                                  <td>
                                    <span>{props.item.data.requirements !== "" ? props.item.data.requirements : "--"}</span>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>

                        <tr>
                          <td>
                          <table cellPadding="0" cellSpacing="0" border="0" width="100%">
                            <tbody>
                              <tr>&nbsp;</tr>
                              <tr>
                                <td style={{ padding: "0px 0px 8px 0px", fontSize: "14px" }}>
                                  <span>Thank You,</span>
                                </td>
                              </tr>
                              <tr>
                                <td style={{ padding: "16px 0px 8px 0px", fontSize: "14px" }}>
                                  {props.userInfo?.provider?.logo?.url ? (
                                    <img
                                      src={props.userInfo?.provider?.logo?.url}
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
                            </tbody>
                          </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  )
}

export default GetInquiryEmail;