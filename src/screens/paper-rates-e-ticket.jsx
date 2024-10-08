import React, { Component } from 'react'
import Loader from '../components/common/loader'
import Stops from '../components/common/stops'
import Form from "../components/common/form";
import Date from "../helpers/date";
import Duration from "../assets/images/clock.svg";
import Calendar from "../assets/images/calendar.svg";
import Baggage from "../assets/images/baggage.svg";
import CheckInBaggage from "../assets/images/checkinbaggage.svg";
import Airplane from "../assets/images/airplane.png";
import Ticket from "../assets/images/ticket.svg";
import { Trans } from "../helpers/translate";
import AirplaneMain from "../assets/images/airplanestd.png";
import { apiRequester_quotation_api } from "../services/requester-quotation";

class PaperRatesEticket extends Form {
  state = {
    errors: {},
    data: {},
    isSetTravelerData: false,
    isShowSuccessMsg: false,
    isBtnLoading: false
  };

  static getDerivedStateFromProps(props, state) {
    if (props.bookingDetails && props.bookingDetails !== null && !state.isSetTravelerData) {
      var data = {};
      props.bookingDetails.travellerDetails.map((item, key) => {
        let val = "traveller_";
        val = val + item.memberDetailID;
        data[val] = item.bookingDetails.eTicketNo ? item.bookingDetails.eTicketNo : "";
      });
      return { data, isSetTravelerData: true }
    }
    return {
      isSetTravelerData: state.isSetTravelerData
    };
  }
  UpdateEticket = (isfromupdate, itineraryRefNo) => {
    const errors = this.validateData();
    this.setState({ errors: errors || {} });
    if (errors) return;
    this.setState({ isBtnLoading: true });
    let data = { ...this.state.data };
    let travellerdetails = [];
    this.props.bookingDetails.travellerDetails.map((item, key) => {
      travellerdetails.push({
        TravellerId: item.memberDetailID,
        TravellerName: item.details.firstName + " " + item.details.lastName,
        EticketNo: this.state.data["traveller_" + item.memberDetailID]
      });
    });
    let reqURL = "paperrates/generateticket";
    var reqOBJ = {
      ItineraryDetailsId: this.props.itineraryDetailID,
      TravellerDetails: travellerdetails
    };
    apiRequester_quotation_api(
      reqURL,
      reqOBJ,
      (data) => {
        this.setState({
          isShowSuccessMsg: true,
          isBtnLoading: false
        });
        this.props.updateBookingEticketStatus(this.props.itineraryDetailID, itineraryRefNo);
      },
      "POST"
    );

  }
  validateData = () => {
    const errors = {};
    const { data } = { ...this.state };
    var temp = [];
    Object.keys(data).map(item => {
      temp.push(data[item]);
      if (!this.validateFormData(data[item], "require")) {
        errors[item] = "E-Ticket Number  required";
      }
      else if (!this.validateFormData(data[item], "alpha_numeric")) {
        errors[item] = "Enter valid E-ticket number";
      }
      let uniqueTicketNum = [...new Set(temp)];
      if (data[item] !== "" && temp.length !== uniqueTicketNum.length) { errors[item] = "E-ticket number must be unique"; }
    });
    return Object.keys(errors).length === 0 ? null : errors;
  }
  render() {
    if (!this.props.bookingDetails) {
      return <div className="row p-3">
        <div className="container">
          <Loader />
        </div>
      </div>
    }
    else {
      const departAirlineDetails = this.props.bookingDetails.businessObject.items[0];
      const bookingDetails = departAirlineDetails.item[0];
      const tripType = this.props.bookingDetails.businessObject.tripType;
      const departFlightNumber = bookingDetails.code;
      const airlineName = bookingDetails.vendors[0].item.name;
      const departClass = bookingDetails.tpExtension[0].value;
      const fromAirportName = bookingDetails.locationInfo.fromLocation.name;
      const fromAirportCity = bookingDetails.locationInfo.fromLocation.city;
      const toAirportCity = bookingDetails.locationInfo.toLocation.city;
      const fromAirportCode = bookingDetails.locationInfo.fromLocation.id;
      const toAirportName = bookingDetails.locationInfo.toLocation.name;
      const toAirportCode = bookingDetails.locationInfo.toLocation.id;
      const departStartDate = bookingDetails.dateInfo.startDate.split("T")[0];
      const departEndDate = bookingDetails.dateInfo.endDate.split("T")[0];
      const departStartTime = bookingDetails.dateInfo.startDate.split("T")[1].slice(0, 5)
      const departEndTime = bookingDetails.dateInfo.endDate.split("T")[1].slice(0, 5)
      const departDurationH = departAirlineDetails.tpExtension[0].value < 0 ? 0 : departAirlineDetails.tpExtension[0].value
      const departDurationM = departAirlineDetails.tpExtension[1].value < 0 ? 0 : departAirlineDetails.tpExtension[1].value;
      const departStops = bookingDetails.stops;
      const returnAirlineDetails = this.props.bookingDetails.businessObject?.items[1]?.item[0];
      const returnClass = returnAirlineDetails?.tpExtension.find((x) => x.key === "cabinClass") &&
        returnAirlineDetails.tpExtension.find(
          (x) => x.key === "cabinClass"
        ).value;
      const returnStartDate = returnAirlineDetails?.dateInfo.startDate.split("T")[0]
      const returnEndDate = returnAirlineDetails?.dateInfo.endDate.split("T")[0]
      const returnStartTime = returnAirlineDetails?.dateInfo.startDate.split("T")[1].slice(0, 5)
      const returnEndTime = returnAirlineDetails?.dateInfo.endDate.split("T")[1].slice(0, 5)
      const returnAirportName = returnAirlineDetails?.locationInfo.fromLocation.name
      const returnFromAirportCity = returnAirlineDetails?.locationInfo.fromLocation.city
      const returnToAirportCity = returnAirlineDetails?.locationInfo.toLocation.city
      const returnAirportCode = returnAirlineDetails?.locationInfo.fromLocation.id
      const returnToAirportName = returnAirlineDetails?.locationInfo.toLocation.name
      const returnToAirportCode = returnAirlineDetails?.locationInfo.toLocation.id
      const returnAirlineName = returnAirlineDetails?.vendors[0].item.name
      const returnStops = returnAirlineDetails?.stops
      const returnFlightNumber = returnAirlineDetails?.code
      const returnDurationH = this.props.bookingDetails.businessObject?.items[1]?.tpExtension[0].value < 0 ? 0 : this.props.bookingDetails.businessObject?.items[1]?.tpExtension[0].value;
      const returnDurationM = this.props.bookingDetails.businessObject?.items[1]?.tpExtension[1].value < 0 ? 0 : this.props.bookingDetails.businessObject?.items[1]?.tpExtension[1].value;
      const TravellersDetails = this.props.bookingDetails.travellerDetails;
      const isfromUpdateEticket = this.props.isfromUpdateEticket;
      const { isBtnLoading, isShowSuccessMsg } = this.state;
      const itineraryRefNo = this.props.bookingDetails.itineraryRefNo;
      return (
        <>
          <div className='container-fluid'>
            {tripType === "RoundTrip" &&
              <React.Fragment>
                <div className='row m-0 p-0'>
                  <div className='col-lg-6 d-flex justify-content-center'>
                    <div className='row'>
                      <div className='col-lg-12'>
                        <div className="card border-0" style={{ "width": "34rem" }}>
                          <div className="card-body">
                            <div className='container border pt-3 '>
                              <div className='row'>
                                <div className='col-lg-5 text-center'>
                                  <small className='text-secondary'>{departStartTime}</small>
                                  <h4 className="card-title text-primary">{fromAirportCode}
                                    <h6 className='text-secondary'>{fromAirportCity}</h6>
                                    <small className='h6 font-weight-normal text-dark' >
                                      <img
                                        className="pb-1 pr-1"
                                        style={{ filter: "none", height: "16px" }}
                                        src={Calendar}
                                        alt=""
                                      />
                                      Depart <Date date={departStartDate} format="shortDate" />
                                    </small>
                                  </h4>
                                </div>
                                <div className='col-lg-2 d-flex justify-content-center mt-4'>
                                  <img
                                    className="pt-1"
                                    style={{ filter: "none", height: "24px" }}
                                    src={AirplaneMain}
                                    alt=""
                                  />
                                </div>
                                <div className='col-lg-5 text-center'>
                                  <small className='text-secondary'>{departEndTime}</small>
                                  <h4 className="card-title text-primary">{toAirportCode}
                                    <h6 className='text-secondary'>{toAirportCity}</h6>
                                    <small className='h6 font-weight-normal text-dark'>
                                      <img
                                        className="pb-1 pr-1"
                                        style={{ filter: "none", height: "16px" }}
                                        src={Calendar}
                                        alt=""
                                      />
                                      Arrival <Date date={departEndDate} format="shortDate" />
                                    </small>
                                  </h4>
                                </div>
                              </div>
                              <div className='row mt-2 pb-3'>
                                <div className='col-lg-12'>
                                  <p className="card-text pl-2">
                                    <img
                                      className="pb-1"
                                      style={{ filter: "none", height: "20px" }}
                                      src={Airplane}
                                      alt=""
                                    /> {airlineName} - {departFlightNumber}<br />
                                    <img
                                      className="pb-1"
                                      style={{ filter: "none", height: "16px" }}
                                      src={Ticket}
                                      alt=""
                                    /> {departClass}<br />
                                    <img
                                      className="pb-1"
                                      style={{ filter: "none", height: "16px" }}
                                      src={Duration}
                                      alt=""
                                    />  {departDurationH ? departDurationH : 0}h {departDurationM ? departDurationM : 0}m - {departStops ? departStops : "Non"} Stops<br />
                                    <img
                                      className="pb-1"
                                      style={{ filter: "none", height: "16px" }}
                                      src={Baggage}
                                      alt=""
                                    />  Cabin Baggage 7 kg (1 piece)<br />
                                    <img
                                      className="pb-1"
                                      style={{ filter: "none", height: "16px" }}
                                      src={CheckInBaggage}
                                      alt=""
                                    />  Check-in Baggage 15 kg (1 piece)<br />
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='col-lg-6 d-flex justify-content-center'>
                    <div className='row'>
                      <div className='col-lg-12'>
                        <div className="card border-0" style={{ "width": "34rem" }}>
                          <div className="card-body">
                            <div className='container border pt-3 '>
                              <div className='row'>
                                <div className='col-lg-5 text-center'>
                                  <small className='text-secondary'>{returnStartTime}</small>
                                  <h4 className="card-title text-primary">{returnAirportCode}
                                    <h6 className='text-secondary'>{returnFromAirportCity}</h6>
                                    <small className='h6 font-weight-normal text-dark'>
                                      <img
                                        className="pb-1 pr-1"
                                        style={{ filter: "none", height: "16px" }}
                                        src={Calendar}
                                        alt=""
                                      />
                                      Depart  <Date date={returnStartDate} format="shortDate" />
                                    </small>
                                  </h4>
                                </div>
                                <div className='col-lg-2 d-flex justify-content-center mt-4'>
                                  <img
                                    className="pt-1"
                                    style={{ filter: "none", height: "24px" }}
                                    src={AirplaneMain}
                                    alt=""
                                  />
                                </div>
                                <div className='col-lg-5 text-center'>
                                  <small className='text-secondary'>{returnEndTime}</small>
                                  <h4 className="card-title text-primary">{returnToAirportCode}
                                    <h6 className='text-secondary'>{returnFromAirportCity}</h6>
                                    <small className='h6 font-weight-normal text-dark'>
                                      <img
                                        className="pb-1 pr-1"
                                        style={{ filter: "none", height: "16px" }}
                                        src={Calendar}
                                        alt=""
                                      />
                                      Arrival  <Date date={returnEndDate} format="shortDate" />
                                    </small>
                                  </h4>
                                </div>
                              </div>
                              <div className='row mt-2 pb-3'>
                                <div className='col-lg-12'>
                                  <p className="card-text pl-2">
                                    <img
                                      className="pb-1"
                                      style={{ filter: "none", height: "20px" }}
                                      src={Airplane}
                                      alt=""
                                    /> {returnAirlineName} - {returnFlightNumber}<br />
                                    <img
                                      className="pb-1"
                                      style={{ filter: "none", height: "16px" }}
                                      src={Ticket}
                                      alt=""
                                    /> {returnClass}<br />
                                    <img
                                      className="pb-1"
                                      style={{ filter: "none", height: "16px" }}
                                      src={Duration}
                                      alt=""
                                    />  {returnDurationH ? returnDurationH : 0}h  {returnDurationM ? returnDurationM : 0}m - {returnStops ? returnStops : "Non"} Stops<br />
                                    <img
                                      className="pb-1"
                                      style={{ filter: "none", height: "16px" }}
                                      src={Baggage}
                                      alt=""
                                    />  Cabin Baggage 7 kg (1 piece)<br />
                                    <img
                                      className="pb-1"
                                      style={{ filter: "none", height: "16px" }}
                                      src={CheckInBaggage}
                                      alt=""
                                    />  Check-in Baggage 15 kg (1 piece)<br />
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='row p-2'>
                  <div className='col-lg-12'>
                    <table class="table table-borderless table-hover">
                      <thead>
                        <tr>
                          <th>Traveller Type</th>
                          <th>Name</th>
                          <th>Gender</th>
                          <th>Age</th>
                          <th>E-ticket</th>
                        </tr>
                      </thead>
                      <tbody>
                        {TravellersDetails.map((item, key) => {
                          const { typeString } = item;
                          const type =
                            typeString === "ADT"
                              ? Trans("_viewAdult")
                              : typeString === "CHD"
                                ? Trans("_viewChild")
                                : Trans("_viewInfant");
                          return <><tr>
                            <td>{type}</td>
                            <td>{item.details.firstName + " " + item.details.lastName}</td>
                            <td>{item.details.genderDesc}</td>
                            <td>{item.details.age}</td>
                            {!isShowSuccessMsg ? <td>{this.renderInput("traveller_" + item.memberDetailID, "", "text", false, undefined, 0, 20)}</td>
                              : <td>{this.renderInput("traveller_" + item.memberDetailID, "", "text", true)}</td>}
                          </tr>
                          </>
                        })}
                      </tbody>
                    </table>
                  </div>
                  <div className='col-lg-12 mt-2 d-flex justify-content-end modal-footer border-0'>
                    {isShowSuccessMsg &&
                      <React.Fragment>
                        <h6 className="alert alert-success d-inline-block">
                          {isfromUpdateEticket ? "E-ticket updated successfully!" : "E-ticket generated successfully!"}
                        </h6>
                        <button
                          type="button"
                          className="btn btn-sm btn-primary"
                          onClick={this.props.handleHide}
                        >
                          Close
                        </button>
                      </React.Fragment>
                    }
                    {!isBtnLoading ?
                      (!isShowSuccessMsg &&
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => this.UpdateEticket(isfromUpdateEticket, itineraryRefNo)}
                        >
                          <small>{isfromUpdateEticket ? "Update E-Ticket" : "Generate E-Ticket"}</small>
                        </button>) :
                      (!isShowSuccessMsg &&
                        <button
                          className="btn btn-primary btn-sm">
                          <small><span className="spinner-border spinner-border-sm mr-2"></span>{isfromUpdateEticket ? "Update E-Ticket" : "Add E-Ticket"}</small>
                        </button>)

                    }
                  </div>
                </div>
              </React.Fragment>
            }
            {tripType !== "RoundTrip" &&
              <div className='row'>
                <div className='col-lg-12 d-flex justify-content-start'>
                  <div className='row'>
                    <div className='col-lg-12'>
                      <div className="card border-0" style={{ "width": "66rem" }}>
                        <div className="card-body">
                          <div className='container border pt-3 '>
                            <div className='row'>
                              <div className='col-lg-5 text-center'>
                                <small className='text-secondary'>{departStartTime}</small>
                                <h4 className="card-title text-primary">{fromAirportCode}
                                  <h6 className='text-secondary'>{fromAirportCity}</h6>
                                  <small className='h6 font-weight-normal text-dark'>
                                    <img
                                      className="pb-1 pr-1"
                                      style={{ filter: "none", height: "16px" }}
                                      src={Calendar}
                                      alt=""
                                    />
                                    Depart  <Date date={departStartDate} format="shortDate" />
                                  </small>
                                </h4>
                              </div>
                              <div className='col-lg-2 d-flex justify-content-center mt-4'>
                                <img
                                  className="pt-1"
                                  style={{ filter: "none", height: "24px" }}
                                  src={AirplaneMain}
                                  alt=""
                                />
                              </div>
                              <div className='col-lg-5 text-center'>
                                <small className='text-secondary'>{departEndTime}</small>
                                <h4 className="card-title text-primary">{toAirportCode}
                                  <h6 className='text-secondary'>{toAirportCity}</h6>
                                  <small className='h6 font-weight-normal text-dark'>
                                    <img
                                      className="pb-1 pr-1"
                                      style={{ filter: "none", height: "16px" }}
                                      src={Calendar}
                                      alt=""
                                    />
                                    Arrival  <Date date={departEndDate} format="shortDate" />
                                  </small>
                                </h4>
                              </div>
                            </div>
                            <div className='row mt-1 pb-3'>
                              <div className='col-lg-5 mt-2 d-flex justify-content-center'>
                                <p className="card-text">
                                  <img
                                    className="pb-1"
                                    style={{ filter: "none", height: "20px" }}
                                    src={Airplane}
                                    alt=""
                                  /> {airlineName} - {departFlightNumber}<br />
                                  <img
                                    className="pb-1"
                                    style={{ filter: "none", height: "16px" }}
                                    src={Ticket}
                                    alt=""
                                  /> {departClass}<br />
                                  <img
                                    className="pb-1"
                                    style={{ filter: "none", height: "16px" }}
                                    src={Duration}
                                    alt=""
                                  />  {departDurationH ? departDurationH : 0}h {departDurationM ? departDurationM : 0}m - {departStops ? departStops : "Non"} Stops<br />
                                </p>
                              </div>
                              <div className='col-lg-2'>
                                <hr className='text-muted' style={{ border: "none", borderLeft: " 1px solid rgb(198 207 203)", height: "10vh", width: "1px" }}></hr>
                              </div>
                              <div className='col-lg-5 mt-2 d-flex justify-content-center'>
                                <p className="card-text">
                                  <img
                                    className="pb-1"
                                    style={{ filter: "none", height: "16px" }}
                                    src={Baggage}
                                    alt=""
                                  />  Cabin Baggage 7 kg (1 piece)<br />
                                  <img
                                    className="pb-1"
                                    style={{ filter: "none", height: "16px" }}
                                    src={CheckInBaggage}
                                    alt=""
                                  />  Check-in Baggage 15 kg (1 piece)<br />
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='col-lg-12 d-flex justify-content-start'>
                  <div className='container '>
                    <div className='row m-0 p-0'>
                      <div className='col-lg-12 m-0 p-0'>
                        <table class="table table-borderless table-hover m-0 p-0">
                          <thead>
                            <tr>
                              <th>Traveller Type</th>
                              <th>Name</th>
                              <th>Gender</th>
                              <th>Age</th>
                              <th>E-ticket</th>
                            </tr>
                          </thead>
                          <tbody>
                            {TravellersDetails.map((item, key) => {
                              const { typeString } = item;
                              const type =
                                typeString === "ADT"
                                  ? Trans("_viewAdult")
                                  : typeString === "CHD"
                                    ? Trans("_viewChild")
                                    : Trans("_viewInfant");
                              return <><tr>
                                <td>{type}</td>
                                <td>{item.details.firstName + " " + item.details.lastName}</td>
                                <td>{item.details.genderDesc}</td>
                                <td>{item.details.age}</td>
                                {!isShowSuccessMsg ? <td>{this.renderInput("traveller_" + item.memberDetailID, "", "text", false, undefined, 0, 20)}</td>
                                  : <td>{this.renderInput("traveller_" + item.memberDetailID, "", "text", true)}</td>}
                              </tr>
                              </>
                            })}
                          </tbody>
                        </table>
                      </div>
                      <div className='col-lg-12 mt-2 d-flex justify-content-end modal-footer border-0 m-0 p-0'>
                        {isShowSuccessMsg &&
                          <React.Fragment>
                            <h6 className="alert alert-success d-inline-block">
                              {isfromUpdateEticket ? "E-ticket updated successfully!" : "E-ticket generated successfully!"}
                            </h6>
                            <button
                              type="button"
                              className="btn btn-sm btn-primary"
                              onClick={this.props.handleHide}
                            >
                              Close
                            </button>
                          </React.Fragment>
                        }
                        {!isBtnLoading ?
                          (!isShowSuccessMsg &&
                            <button
                              className="btn btn-primary btn-sm"
                              onClick={() => this.UpdateEticket(isfromUpdateEticket, itineraryRefNo)}
                            >
                              <small>{isfromUpdateEticket ? "Update E-Ticket" : "Generate E-Ticket"}</small>
                            </button>) :
                          (!isShowSuccessMsg &&
                            <button
                              className="btn btn-primary btn-sm">
                              <small><span className="spinner-border spinner-border-sm mr-2"></span>{isfromUpdateEticket ? "Update E-Ticket" : "Add E-Ticket"}</small>
                            </button>)

                        }
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            }
          </div>
        </>
      )
    }
  }
}
export default PaperRatesEticket;