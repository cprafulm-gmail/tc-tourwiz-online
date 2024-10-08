import React, { Component } from "react";
import Form from "../common/form";
import DateComp from "../../helpers/date";
import Amount from "../../helpers/amount";
import * as Global from "../../helpers/global";

class InquiryView extends Form {
  state = {
    data: {
      customerName: "",
      email: "",
      phone: "",
      title: "",
      duration: "",
      startDate: "",
      endDate: "",
      dates: "",
      datesIsValid: "valid",
      cutOfDays: 1,
      stayInDays: 4,
      createdDate: "",
      status: "",
      phoneNotoValidate: "",
      fromCopy: true,
    },
    addcustomer: false,
    selectcustomer: true,
    customeraction: "selectcustomer",
    isCustomerSet: false,
    customerData: {},
    errors: {},
  };

  render() {
    let item = this.props.item;
    let destinationlocation = (item.data.destinationlocation === "" || item.data.destinationlocation === undefined)
      ? "" : " - " + item.data.destinationlocation;
    return (
      <div className="model-popup">
        <div className="modal fade show d-block" tabIndex='-1'>
          <div
            className={"modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg"}
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{destinationlocation !== "" ? item.title + destinationlocation : item.title}</h5>
                <button
                  type="button"
                  className="close"
                  onClick={this.props.handleHide}
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <React.Fragment>
                  <div>
                    <div className="row quotation-list-grid-header">
                      <div className="col-lg-12">
                        <div className="bg-light border-bottom pt-2 pb-2 pl-3 pr-3">
                          <div className="row">
                            <div className="col-lg-5">
                              <b>Customer Details</b>
                            </div>
                            <div className="col-lg-5">
                              <b>Inquiry Details</b>
                            </div>

                            <div className="col-lg-2">
                              <b>Status</b>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div
                      key={"df"}
                      className="border-bottom pl-3 pr-3 pt-3 position-relative"
                    >
                      <div className="row quotation-list-item">
                        <div className="col-lg-5 d-flex pb-3">
                          <div>
                            <h5 className="m-0 p-0 mb-1">{item.from}</h5>
                            {item.data.email.endsWith(process.env.REACT_APP_B2CPORTALDOMAIN.replace(".", "@")) ? '' : item.fromEmail &&
                              <small className="d-block text-secondary mt-2">
                                <span>Email : {item.fromEmail}</span>
                              </small>}
                            <small className="d-block text-secondary mt-2">
                              <span className="quotation-list-item-sprt">
                                Contact Phone :{" "}
                              </span>
                              <span>{item.data.phone}</span>
                            </small>
                          </div>
                        </div>

                        <div className="col-lg-5 d-flex align-items-center pb-3">
                          <div>
                            <span className="text-secondary mr-3 d-block">
                              <b className="text-primary">{destinationlocation !== "" ? item.title + destinationlocation : item.title}</b>
                            </span>
                            <span className="text-secondary mr-3">
                              {item.data.startDate && (
                                <small>
                                  {(item.data.inquiryType.toLowerCase() === 'air' || item.data.inquiryType.toLowerCase() === 'rail' || item.data.inquiryType.toLowerCase() === 'bus') ? 'Departure Date :' : item.data.inquiryType.toLowerCase() === 'hotel' ? 'Check In :' : (item.data.inquiryType.toLowerCase() === 'visa' || item.data.inquiryType.toLowerCase() === 'forex') ? 'Travel Date :' : (item.data.inquiryType.toLowerCase() === 'transfers' || item.data.inquiryType.toLowerCase() === 'rent a car') ? 'Pick Up Date :' : 'Start Date :'} <DateComp date={item.data.startDate} format={Global.getEnvironmetKeyValue("DisplayDateFormate")} />
                                </small>
                              )}

                              {(item.data.inquiryType.toLowerCase() === 'air' || item.data.inquiryType.toLowerCase() === 'rail' || item.data.inquiryType.toLowerCase() === 'bus') && item.data.endDate && (
                                <small>
                                  <br />
                                  {'Arrival Date :'} <DateComp date={item.data.endDate} format={Global.getEnvironmetKeyValue("DisplayDateFormate")} />
                                </small>
                              )}

                              {(item.data.inquiryType.toLowerCase() === 'transfers' || item.data.inquiryType.toLowerCase() === 'rent a car') && item.data.pickuptime && (
                                <small>
                                  <br />
                                  {'Pick Up Time :'} {" " + item.data.pickuptime}
                                </small>
                              )}

                              {item.data.inquiryType.toLowerCase() !== 'air' && item.data.inquiryType.toLowerCase() !== 'rent a car' && item.data.inquiryType.toLowerCase() !== 'bus' && item.data.inquiryType.toLowerCase() !== 'forex' && item.data.inquiryType.toLowerCase() !== 'rail' && item.data.inquiryType.toLowerCase() !== 'transfers' && item.data.duration && (

                                <small>
                                  <br />
                                  <span className="quotation-list-item-sprt">
                                    {((item.data.inquiryType.toLowerCase() === 'visa'
                                      || item.data.inquiryType.toLowerCase() === 'packages')
                                      ? "Duration (Days) :"
                                      : item.data.inquiryType.toLowerCase() === 'hotel'
                                        ? "Duration (Nights) :"
                                        : "Duration :")}
                                  </span>
                                  {" " + item.data.duration} day(s)
                                </small>
                              )}

                              {item.data.typetheme && (
                                <small>
                                  <br />
                                  <span className="quotation-list-item-sprt">
                                    Theme :
                                  </span>
                                  {item.data.typetheme}
                                </small>
                              )}

                              {item.data.budget && (
                                <small>
                                  <br />
                                  <span className="quotation-list-item-sprt">
                                    {item.data.inquiryType.toLowerCase() === 'forex' ? 'Amount :' : 'Budget :'}
                                  </span>
                                  {" "}<Amount amount={isNaN(item.data.budget) ? 0 : item.data.budget}></Amount>
                                </small>
                              )}

                              {item.data.inquiryType.toLowerCase() !== 'forex' && item.data.adults && (
                                <small>
                                  <br />
                                  <span className="quotation-list-item-sprt">
                                    Adults :
                                  </span>
                                  {" " + item.data.adults}
                                </small>
                              )}

                              {item.data.inquiryType.toLowerCase() !== 'forex' && item.data.children && (
                                <small>
                                  <span className="quotation-list-item-sprt">
                                    {" "} | Children :
                                  </span>
                                  {" " + item.data.children}
                                </small>
                              )}

                              {item.data.inquiryType.toLowerCase() !== 'forex' && item.data.infant && (
                                <small>
                                  <span className="quotation-list-item-sprt">
                                    {" "} | Infant :
                                  </span>
                                  {" " + item.data.infant}
                                </small>
                              )}
                              {item.data.inquiryType && (
                                <small>
                                  <br />
                                  <span className="quotation-list-item-sprt">
                                    Type :
                                  </span>
                                  {" " + item.data.inquiryType}
                                </small>
                              )}
                              {item.data.inquirySource && (
                                <small>
                                  <br />
                                  <span className="quotation-list-item-sprt">
                                    Source : {" "}
                                  </span>
                                  {item.data.inquirySource === "Social Media"
                                    ? (item.data.referredBy !== undefined && item.data.referredBy !== "")
                                      ? item.data.inquirySource + " - " + item.data.referredBy
                                      : item.data.inquirySource
                                    : item.data.inquirySource}
                                </small>
                              )}
                              {item.data.classtype && (
                                <small>
                                  <br />
                                  <span className="quotation-list-item-sprt">
                                    {item.data.inquiryType.toLowerCase() === 'packages' ? 'Package Type :'
                                      : item.data.inquiryType.toLowerCase() === 'hotel' ? 'Star Rating :'
                                        : item.data.inquiryType.toLowerCase() === 'rail' ? 'Journey Type :'
                                          : 'Class Type :'
                                    }
                                  </span>
                                  {" " + item.data.classtype}
                                </small>
                              )}
                              {item.data.journeytype && (
                                <small>
                                  <br />
                                  <span className="quotation-list-item-sprt">
                                    Journey Type
                                  </span>
                                  {" " + item.data.journeytype}
                                </small>
                              )}
                              {item.data.tripType && (
                                <small>
                                  <br />
                                  <span className="quotation-list-item-sprt">
                                    {item.data.inquiryType.toLowerCase() === 'visa' ? 'Category :' : 'Trip Type :'}
                                  </span>
                                  {" " + item.data.tripType}
                                </small>
                              )}
                              {item.data.bookingFor && (
                                <small>
                                  <br />
                                  <span className="quotation-list-item-sprt">
                                    Booking For Source :
                                  </span>
                                  {" " + item.data.bookingFor}
                                </small>
                              )}
                              {item.followUpDate && (
                                <small>
                                  <br />
                                  <span className="quotation-list-item-sprt">
                                    Followup Date :
                                  </span>
                                  {" "}<DateComp date={item.followUpDate}></DateComp>
                                </small>
                              )}
                              {item.followupTime && (
                                <small>
                                  <br />
                                  <span className="quotation-list-item-sprt">
                                    Followup Time :
                                  </span>
                                  {" "}{item.followupTime}
                                </small>
                              )}
                              {item.assignedUserName &&
                                <small>
                                  <br />
                                  <span className="quotation-list-item-sprt">Assigned to : </span>
                                  {" "}{item.assignedUserName}
                                </small>}
                              {item.data.requirements && (
                                <small>
                                  <br />
                                  <span className="quotation-list-item-sprt">
                                    {item.data.inquiryType.toLowerCase() === 'visa' ?
                                      'Nationality / Documents Received /Remarks :'
                                      : item.data.inquiryType.toLowerCase() === 'transfers' ?
                                        'Other Requirements/e.g SIC, PVT :'
                                        : item.data.inquiryType.toLowerCase() === 'rail' ?
                                          'Other Requirements ll CLASS ll GENERAL,SLEEPER, 1ST TIER,OTHERS :'
                                          : item.data.inquiryType.toLowerCase() === 'rent a car' ?
                                            'Other Requirements :'
                                            : 'Other Requirements :'}
                                  </span>
                                  {" " + item.data.requirements}
                                </small>
                              )}
                            </span>
                          </div>
                        </div>

                        <div className="col-lg-2">
                          {item.status === "active" && !item?.data?.itemId && (
                            <div>
                              <small>Inquiry created</small>
                              <small className="text-secondary d-block mt-1">
                                <DateComp date={item.createdDate}></DateComp>
                              </small>
                            </div>
                          )}

                          {item.status === "active" && item?.data?.itemId && (
                            <div>
                              <small>{item.data.itemType} added</small>
                              <small className="text-secondary d-block mt-1">
                                <DateComp date={item.updatedDate}></DateComp>
                              </small>
                            </div>
                          )}

                          {item.status !== "active" && <div>
                            <small>{item.status}</small>
                            <small className="text-secondary d-block mt-1">
                              <DateComp date={item.updatedDate}></DateComp>
                            </small>
                          </div>}
                          {item.inquiryNumber &&
                            <div>
                              <span class="badge badge-info badge-info-custom mt-1">
                                <b className="text-secondary d-block ">
                                  {item.inquiryNumber}
                                </b>
                              </span>
                            </div>
                          }
                          {localStorage.getItem('portalType') !== 'B2C' && localStorage.getItem("userToken") &&
                            item.priority &&
                            <div>
                              <span
                                className={item.priority === "Low" ?
                                  "badge badge-info badge-info-custom mt-1 px-1" :
                                  item.priority === "High" ?
                                    "badge badge-danger badge-info-danger mt-1 px-1" :
                                    "badge badge-primary badge-info-primary mt-1 px-1"
                                }>
                                <b className={item.priority === "Low" ?
                                  "text-secondary d-block " :
                                  item.priority === "High" ?
                                    "text-white d-block " :
                                    "text-white d-block "
                                }>
                                  {item.priority}
                                </b>
                              </span>
                            </div>
                          }
                        </div>
                      </div>
                    </div>

                  </div>
                </React.Fragment>
              </div>
            </div>
          </div>
        </div>
        <div className="modal-backdrop fade show"></div>
      </div>






    );
  }
}

export default InquiryView;
