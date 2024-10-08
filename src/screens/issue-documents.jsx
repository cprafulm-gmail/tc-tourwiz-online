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
import IssueDocumentsPopup from "../components/booking-management/issue-documents-popup";
import Amount from "../helpers/amount";

class IssueDocuments extends BookingBase {
  constructor(props) {
    super(props);
    this.state = {
      page: "holdbookings",
      results: [],
      isLoading: true,
      pageLength: 10,
      isIssueDocumentsPopup: false,
      issueDocumentsDetails: null,
      mode: null,
      defaultFilters: [
        {
          Name: "daterange",
          minValue: moment().add(-7, 'days').format(
            Global.DateFormate
          ),
          maxValue: moment().format(Global.DateFormate)
        }
      ],
      issueDocumentsBalance: null
    };
  }

  componentDidMount() {
    this.getBookings(this.state.defaultFilters);
  }

  render() {
    const {
      results,
      isLoading,
      isIssueDocumentsPopup,
      issueDocumentsDetails,
      mode,
      issueDocumentsBalance
    } = this.state;

    return (
      <div className="balance">
        <div className="title-bg pt-3 pb-3 mb-3">
          <div className="container">
            <h1 className="text-white m-0 p-0 f30">
              <i className="fa fa-list-ul mr-3" aria-hidden="true"></i>
              {Trans("_issueDocuments")}
            </h1>
          </div>
        </div>
        <div className="container">
          <div className="mt-2 mb-3">
            <CallCenter />
          </div>

          <BookingFilters
            {...results}
            page={this.state.page}
            filterResults={this.filterResults}
          />

          {!isLoading && results.data && results.data.length > 0 ? (
            <div className="border shadow-sm">
              <div className="table-responsive">
                <table className="table offline-booking-table">
                  <thead>
                    <tr>
                      <th className="align-middle bg-light">{Trans("_bookingRefNo")}</th>
                      <th className="align-middle bg-light">{Trans("_supplier")}</th>
                      <th className="align-middle bg-light">{Trans("_supplierAmount")}</th>
                      <th className="align-middle bg-light">{Trans("_bookingDate")}</th>
                      <th className="align-middle bg-light">{Trans("_eventDate")}</th>
                      <th className="align-middle bg-light">{Trans("_deadlineDate")}</th>
                      <th className="align-middle bg-light">{Trans("_lblDetails")}</th>
                      <th className="align-middle bg-light text-center">
                        {Trans("_actions")}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.data.map((item, key) => {
                      const itinerary = item[Object.keys(item)[0]];
                      return itinerary.map((booking, key) => {
                        const {
                          bookingRefNo,
                          providerName,
                          bookingDate,
                          dateInfo,
                          details,
                          deadlineDate,
                          amount,
                          businessShortDescription,
                          currencySymbol,
                          flags
                        } = booking;
                        return (
                          <tr
                            key={key}
                            className={
                              flags.pastdatebooking
                                ? "text-danger"
                                : flags.todaysdatebooking
                                  ? "text-warning"
                                  : flags.upcomingdatebooking
                                    ? "text-success"
                                    : ""
                            }
                          >
                            <td className="text-nowrap">
                              <SVGIcon
                                name={businessShortDescription}
                                className="mr-3 text-secondary"
                                width="16"
                                type="fill"
                              ></SVGIcon>
                              {bookingRefNo}
                            </td>
                            <td className="text-nowrap">{providerName}</td>
                            <td className="text-nowrap">
                              <Amount amount={amount} />
                            </td>
                            <td className="text-nowrap">
                              <Datecomp date={bookingDate} />
                            </td>
                            <td className="text-nowrap">
                              <Datecomp date={dateInfo.startDate} />
                            </td>
                            <td className="text-nowrap">
                              <Datecomp date={deadlineDate} />
                            </td>
                            <td className="text-nowrap">
                              <span
                                className="d-inline-block text-truncate"
                                style={{ maxWidth: "180px" }}
                                title={details}
                              >
                                {details}
                              </span>
                            </td>
                            <td className="text-center">
                              <button
                                className="btn btn-link p-0 m-0"
                                onClick={() =>
                                  this.handleIssueDocuments(booking, "confirm")
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
                                  this.handleIssueDocuments(booking, "cancel")
                                }
                              >
                                <i
                                  className="fa fa-ban text-primary"
                                  aria-hidden="true"
                                ></i>
                              </button>
                            </td>
                          </tr>
                        );
                      });
                    })}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan="8" className="pb-0">
                        <span className="col-md-3 col-xs-12 text-danger">
                          {Trans("_deadlineDateHasPassedForBooking")}
                        </span>
                        <span className="col-md-3 col-xs-12 text-warning">
                          {Trans("_todayIsTheDeadlineDateForBooking")}
                        </span>
                        <span className="col-md-3 col-xs-12 text-success">
                          {Trans("_thisBookingDeadlineDateIsUpcoming")}
                        </span>
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
              {isIssueDocumentsPopup && (
                <IssueDocumentsPopup
                  issueDocumentsDetails={issueDocumentsDetails}
                  mode={mode}
                  issueDocumentsBalance={issueDocumentsBalance}
                  hideIssueDocumentsPopup={this.hideIssueDocumentsPopup}
                  handleIssueDocumentsUpdate={this.handleIssueDocumentsUpdate}
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
      </div>
    );
  }
}

export default IssueDocuments;
