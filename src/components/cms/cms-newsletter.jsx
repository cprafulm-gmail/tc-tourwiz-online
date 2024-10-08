import React, { useContext, useState } from "react";
import { apiRequesterCMS } from "../../services/requester-cms";
import { cmsConfig } from "../../helpers/cms-config";
import Form from "../../components/common/form";
import freshideas from "../../assets/images/customer-portal/template-images/footer-freshideas.png";
import { CMSContext } from "../../screens/cms/cms-context";

const CMSNewsLetter = () => {
  const { cmsState, cmsProps } = useContext(CMSContext);
  const { cmsSettings, cmsContents } = cmsState;

  const [state, setState] = useState({
    data: {
      email: "",
    },
    errors: {},
    isInquirySubmited: false,
    isLoading: true,
  });

  const SubmitInquiry = () => {
    let reqOBJ = {
      request: {
        Title: "",
        FirstName: "",
        LastName: "",
        Address: "",
        Address2: "",
        City: "",
        State: "",
        PostCode: "",
        EmailAddress: state.data.email,
        Phone: "",
        Mobile: "",
        Country: "",
        IsReceiveNewsLetter: 1,
        IsReceiveElectronicCommunication: 1,
        ModuleID: 1,
        CultureId: 1,
        ParentId: 1,
      },
    };
    let reqURL = "cms/newsletter/add";
    apiRequesterCMS(
      reqURL,
      reqOBJ,
      (data) => {
        setState(
          { ...state, isInquirySubmited: true },
          () => handleEnquiryEmail
        );
      },
      "POST"
    );
  };

  const sendInquiryEmail = () => {
    const errors = {};
    if (state.data.email === "") errors.email = "Email is required";

    const errorsNew = Object.keys(errors).length === 0 ? null : errors;
    setState({ ...state, errors: errorsNew || {} });
    if (errorsNew) return;
    SubmitInquiry();
  };

  const handleEnquiryEmail = () => {
    let reqOBJ = {
      toemail: "sales@tourwizonline.com",
    };

    let reqURL =
      process.env.REACT_APP_UNIFIED_API_ENDPOINT + "/cms/newsletter/send";
    var xhttp;
    xhttp = new XMLHttpRequest();
    xhttp.open("POST", reqURL, true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify(reqOBJ));
    xhttp.onreadystatechange = function () { };
  };

  return (
    <div className="cp-home-newsletter">
      <div className="container">
        <div className="row">
          <div className="col-lg-4">
            <div className="freshideas">
              <h3>Need Fresh Ideas?</h3>
              <div className="freshideas-wrap">
                <figure>
                  <img src={freshideas} alt="" />
                </figure>
                <span>
                  <p>
                    Stay in the loop and never miss a beat - subscribe to our newsletter today!
                  </p>
                  <a href="#">Go!</a>
                </span>
              </div>
            </div>
          </div>
          <div className="col-lg-8 mb-3">
            <div className="col-lg-12 mb-3">
              <h2>Newsletter signup</h2>
              <h3>Fill in this form. We will call you back.</h3>
            </div>
            {!state.isInquirySubmited && (
              <React.Fragment>
                <div className="col-lg-8">
                  <div className="form-group">
                    <input
                      className="form-control"
                      type="text"
                      value={state.data.email}
                      onChange={(e) => {
                        setState({
                          ...state,
                          data: { ...state.data, email: e.target.value },
                        });
                      }}
                    />
                    {state.errors.email !== undefined &&
                      state.errors.email !== "" && (
                        <div className="col-lg-12 col-sm-12 m-0 p-0">
                          <small className="alert alert-danger mt-2 mb-0 p-1 d-inline-block">
                            {state.errors.email}
                          </small>
                        </div>
                      )}
                  </div>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={sendInquiryEmail}
                  >
                    Submit
                  </button>
                </div>
              </React.Fragment>
            )}

            {state.isInquirySubmited && (
              <div className="col-lg-12 mb-5">
                <div className="text-left">
                  <h5 className="text-primary mb-4">
                    Thank you for subscribe news letter. We will get in touch
                    with you soon.
                  </h5>

                  <p>
                    If you have any other queries in the meantime, please don't
                    hesitate to get in touch with us at{" "}
                    <a
                      href={`mailto:${cmsContents.agentDetails && cmsContents.agentDetails.customerCareEmail && cmsContents.agentDetails.customerCareEmail}`}
                      className="text-primary"
                    >
                      {`${cmsContents.agentDetails && cmsContents.agentDetails.customerCareEmail && cmsContents.agentDetails.customerCareEmail}`}
                    </a>
                  </p>
                </div>
              </div>
            )}

            <div style={{ display: "none" }}>
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
                        <table
                          cellPadding="0"
                          cellSpacing="0"
                          border="0"
                          width="100%"
                        >
                          <tbody>
                            <tr>
                              <td>
                                <table
                                  cellPadding="0"
                                  cellSpacing="0"
                                  border="0"
                                  width="100%"
                                >
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
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                            </tr>

                            <tr>
                              <td style={{ padding: "16px" }}>
                                <table
                                  cellPadding="0"
                                  cellSpacing="0"
                                  border="0"
                                  width="100%"
                                >
                                  <tbody>
                                    <tr>
                                      <td>
                                        <table
                                          cellPadding="0"
                                          cellSpacing="0"
                                          border="0"
                                          width="100%"
                                        >
                                          <tbody>
                                            <tr>
                                              <td
                                                style={{
                                                  padding: "0px 0px 8px 0px",
                                                  fontSize: "14px",
                                                }}
                                              >
                                                <span>Dear,</span>
                                              </td>
                                            </tr>

                                            <tr>
                                              <td
                                                style={{
                                                  padding: "0px 0px 8px 0px",
                                                  fontSize: "14px",
                                                }}
                                              >
                                                <span>
                                                  Following your recent inquiry
                                                  details:
                                                </span>
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                      </td>
                                    </tr>

                                    <tr>
                                      <td>
                                        <table
                                          cellPadding="0"
                                          cellSpacing="0"
                                          border="0"
                                          width="100%"
                                        >
                                          <tbody>
                                            <tr>&nbsp;</tr>
                                            <tr>
                                              <td
                                                style={{
                                                  padding: "0px 0px 8px 0px",
                                                  fontSize: "14px",
                                                }}
                                              >
                                                <span>Thank You,</span>
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CMSNewsLetter;
