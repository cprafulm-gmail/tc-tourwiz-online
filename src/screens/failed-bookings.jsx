import React from "react";
import BookingBase from "../base/booking-base";
import Datecomp from "../helpers/date";
import BookingFilters from "../components/booking-management/booking-filters";
import Pagination from "../components/booking-management/booking-pagination";
import * as Global from "../helpers/global";
import SVGIcon from "../helpers/svg-icon";
import BookingLoadingTable from "../components/loading/booking-loading-table";
import { Trans } from "../helpers/translate";
import moment from "moment";
import CallCenter from "../components/call-center/call-center";
import FailedBookingPopup from "../components/booking-management/failed-booking-popup";
import ModelPopup from "../helpers/model";
import Amount from "../helpers/amount";
import { Helmet } from "react-helmet";

class FailedBookings extends BookingBase {
  constructor(props) {
    super(props);
    this.state = {
      page: "mytransactions",
      results: [],
      isLoading: true,
      pageLength: 10,
      isFailedBookingPopup: false,
      failedBookingDetails: null,
      mode: null,
      defaultFilters: [
        {
          Name: "PaymentStatusID",
          DefaultValue: "101"
        },
        {
          Name: "daterange",
          minValue: moment().add(-1, 'days').format(
            Global.DateFormate
          ),
          maxValue: moment().format(Global.DateFormate)
        }
      ],
      isShow: [],
      viewBookingDetails: null,
      showPopup: false,
      popupHeader: null,
      popupContent: null,
      handleHidePopup: null
    };
  }

  componentDidMount() {
    this.getBookings(this.state.defaultFilters);
  }

  render() {
    const {
      results,
      isLoading,
      isFailedBookingPopup,
      failedBookingDetails,
      mode,
      isShow,
      viewBookingDetails
    } = this.state;
    const isEnableActions = localStorage.getItem("isUmrahPortal") ? false : true
    const isPersonateEnabled = Global.getEnvironmetKeyValue("isPersonateEnabled");
    return (
      <div className="balance">
        <div className="title-bg pt-3 pb-3 mb-3">
          <Helmet>
            <title>
              {Trans("_failedBookings")}
            </title>
          </Helmet>
          <div className="container">
            <h1 className="text-white m-0 p-0 f30">
              <i className="fa fa-list-ul mr-3" aria-hidden="true"></i>
              {Trans("_failedBookings")}
            </h1>
          </div>
        </div>
        <div className="container">
          {isPersonateEnabled && (
            <div className="mt-2 mb-3">
              <CallCenter />
            </div>
          )}

          <BookingFilters
            {...results}
            page={this.state.page}
            filterResults={this.filterResults}
          />

          {!isLoading && results.data && results.data.length > 0 ? (
            <div className="border shadow-sm">
              <div className="table-responsive">
                <table className="table offline-booking-table m-0">
                  <thead>
                    <tr>
                      <th className="align-middle bg-light">{Trans("_transactionNo")}</th>
                      <th className="align-middle bg-light">{Trans("_date")}</th>
                      <th className="align-middle bg-light">{Trans("_agent")}</th>
                      <th className="align-middle bg-light">{Trans("_customer")}</th>
                      <th className="align-middle bg-light">{Trans("_lblMobileNumber")}</th>
                      <th className="align-middle bg-light">{Trans("_email")}</th>
                      <th className="align-middle bg-light">{Trans("_gateway")}</th>
                      <th className="align-middle bg-light">{Trans("_itineraryRefNo")}</th>
                      <th className="align-middle bg-light"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.data.map((item, key) => {
                      const itinerary = item[Object.keys(item)[0]];
                      const {
                        itineraryRefno,
                        paymentToken,
                        bookingDate,
                        agentName,
                        gateway,
                      } = itinerary[0];

                      const {
                        firstName,
                        lastName
                      } = itinerary[0].primaryContactDetails;

                      const {
                        email, phoneNumber
                      } = itinerary[0].primaryContactDetails.contactInformation;

                      let id = "id" + key;
                      return (
                        <React.Fragment key={key}>
                          <tr>
                            <td>{paymentToken}</td>
                            <td>
                              <Datecomp date={bookingDate} />
                            </td>
                            <td>{agentName}</td>
                            <td>{firstName + " " + lastName}</td>
                            <td>{phoneNumber}</td>
                            <td>{email}</td>
                            <td>{gateway}</td>
                            <td>{itineraryRefno}</td>
                            <td>
                              <button
                                className="btn btn-link text-primary p-0 m-0"
                                onClick={() => this.handleDetails(id)}
                              >
                                {!isShow.find(x => x === id) && (
                                  <i
                                    className="fa fa-plus-square-o"
                                    aria-hidden="true"
                                  ></i>
                                )}
                                {isShow.find(x => x === id) && (
                                  <i
                                    className="fa fa-minus-square-o"
                                    aria-hidden="true"
                                  ></i>
                                )}
                              </button>
                            </td>
                          </tr>

                          {isShow.find(x => x === id) && (
                            <tr>
                              <td colSpan="9">
                                <div className="border shadow-sm">
                                  <div className="table-responsive">
                                    <table className="table offline-booking-table m-0">
                                      <thead>
                                        <tr>
                                          <th className="align-middle bg-light">
                                            {Trans("_lblDetails")}
                                          </th>
                                          <th className="align-middle bg-light">
                                            {Trans("_supplier")}
                                          </th>
                                          <th className="align-middle bg-light">
                                            {Trans("_viewPREPAYAMOUNT")}
                                          </th>
                                          <th className="align-middle bg-light">
                                            {Trans("_netBookingAmount")}
                                          </th>
                                          <th className="align-middle bg-light">
                                            {Trans("_status")}
                                          </th>
                                          <th className="align-middle bg-light">
                                            {Trans("_actions")}
                                          </th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {itinerary[0].transactionRequest.map(
                                          (booking, key) => {
                                            const {
                                              businessDescription,
                                              businessDetails,
                                              providerName,
                                              paymentStatus,
                                              paidAmount,
                                              gdsProviderName,
                                              gdsEventlogID,
                                              gdsInvocationErros
                                            } = booking;

                                            booking.itineraryRefno =
                                              itinerary[0].itineraryRefno;

                                            return (
                                              <tr key={key}>
                                                <td className="text-nowrap">
                                                  <SVGIcon
                                                    name={businessDescription}
                                                    className="mr-3 text-secondary"
                                                    width="16"
                                                    type="fill"
                                                  ></SVGIcon>
                                                  {businessDetails}
                                                </td>
                                                <td className="text-nowrap">
                                                  {providerName} {localStorage.getItem("isUmrahPortal") && gdsProviderName && (" - " + gdsProviderName)}
                                                </td>
                                                <td className="text-nowrap">
                                                  <Amount amount={paidAmount} />
                                                </td>
                                                <td className="text-nowrap">
                                                  <Amount amount={paidAmount} />
                                                </td>
                                                <td className="text-nowrap">
                                                  {paymentStatus}
                                                </td>
                                                <td className="text-nowrap">

                                                  {localStorage.getItem("isUmrahPortal") &&
                                                    (gdsEventlogID || (gdsInvocationErros && gdsInvocationErros.length > 0))
                                                    &&
                                                    <button
                                                      className="btn btn-link p-0 m-0"
                                                      onClick={() =>
                                                        this.handleGDSInfo(
                                                          gdsEventlogID, gdsInvocationErros[0].message
                                                        )
                                                      }
                                                    >
                                                      <i className="fa fa-info-circle text-primary"></i>
                                                    </button>
                                                  }

                                                  {isEnableActions && paymentStatus === "Reservation Failure" && (
                                                    <React.Fragment>
                                                      <button
                                                        className="btn btn-link p-0 m-0"
                                                        onClick={() =>
                                                          this.handleFailedBookings(
                                                            booking,
                                                            "confirm"
                                                          )
                                                        }
                                                      >
                                                        <i
                                                          className="fa fa-check text-primary"
                                                          aria-hidden="true"
                                                        ></i>
                                                      </button>
                                                      <button
                                                        className="btn btn-link p-0 m-0 ml-3"
                                                        onClick={() =>
                                                          this.handleFailedBookings(
                                                            booking,
                                                            "cancel"
                                                          )
                                                        }
                                                      >
                                                        <i
                                                          className="fa fa-ban text-primary"
                                                          aria-hidden="true"
                                                        ></i>
                                                      </button>
                                                    </React.Fragment>
                                                  )}
                                                  {paymentStatus === "Reservation Failure" && (
                                                    <button
                                                      className="btn btn-link p-0 m-0 ml-3"
                                                      onClick={() =>
                                                        this.handleFailedBookings(
                                                          booking,
                                                          "view"
                                                        )
                                                      }
                                                    >
                                                      <i
                                                        className="fa fa-search text-primary"
                                                        aria-hidden="true"
                                                      ></i>
                                                    </button>
                                                  )}
                                                </td>
                                              </tr>
                                            );
                                          }
                                        )}
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              {isFailedBookingPopup && (
                <FailedBookingPopup
                  failedBookingDetails={failedBookingDetails}
                  mode={mode}
                  viewBookingDetails={viewBookingDetails}
                  hideFailedBookingPopup={this.hideFailedBookingPopup}
                  handleFailedBookingUpdate={this.handleFailedBookingUpdate}
                />
              )}
            </div>
          ) : (
            isLoading && <BookingLoadingTable />
          )}

          {!isLoading &&
            this.state.results &&
            this.state.results.data &&
            this.state.results.data.length > 0 && (
              <Pagination
                {...results}
                handlePaginationResults={this.paginationResults}
              />
            )}

          {!isLoading && this.state.results.data.length === 0 && (
            <span className={"alert alert-danger mt-2 p-1 d-inline-block "}>
              {Trans("_noBookingFound")}
            </span>
          )}
        </div>
        {this.state.showPopup ? (
          <ModelPopup
            header={this.state.popupHeader}
            content={this.state.popupContent}
            handleHide={this.handleHidePopup}
            sizeClass={"modal-lg"}
          />
        ) : null}
      </div>
    );
  }
}

export default FailedBookings;
