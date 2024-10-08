import React from "react";
import BookingBase from "../base/booking-base";
import Datecomp from "../helpers/date";
import BookingFilters from "../components/booking-management/booking-filters";
import Pagination from "../components/booking-management/booking-pagination";
import * as Global from "../helpers/global";
import SVGIcon from "../helpers/svg-icon";
import OfflineBookingComments from "../components/booking-management/offline-booking-comments";
import BookingLoadingTable from "../components/loading/booking-loading-table";
import { Trans } from "../helpers/translate";
import moment from "moment";
import CallCenter from "../components/call-center/call-center";
import { Helmet } from "react-helmet";

class OfflineBookings extends BookingBase {
  constructor(props) {
    super(props);
    this.state = {
      page: "mybookings/getchangerequests",
      results: [],
      isLoading: true,
      pageLength: 10,
      isCommentPopup: false,
      offlineComment: null,
      mode: null,
      defaultFilters: [
        {
          Name: "BookingStatusID",
          DefaultValue: "2"
        },
        {
          Name: "changerequestdaterange",
          minValue: moment().add(-1, 'months').format(Global.DateFormate),
          maxValue: moment().add(7, 'days').format(
            Global.DateFormate
          )
        }
      ]
    };
  }

  componentDidMount() {
    this.getBookings(this.state.defaultFilters);
  }

  render() {
    const {
      results,
      isLoading,
      isCommentPopup,
      offlineComment,
      mode
    } = this.state;

    return (
      <div className="balance">
        <div className="title-bg pt-3 pb-3 mb-3">
          <Helmet>
            <title>
              {Trans("_offlineBookings")}
            </title>
          </Helmet>
          <div className="container">
            <h1 className="text-white m-0 p-0 f30">
              <i className="fa fa-list-ul mr-3" aria-hidden="true"></i>
              {Trans("_offlineBookings")}
            </h1>
          </div>
        </div>
        <div className="container">
          <div className="mt-2 mb-3">
            <CallCenter />
          </div>
          <BookingFilters
            {...results}
            page={"mybookings/getchangerequests"}
            filterResults={this.filterResults}
          />

          {!isLoading && results.data && results.data.length > 0 ? (
            <div className="border shadow-sm">
              <div className="table-responsive">
                <table className="table offline-booking-table">
                  <thead>
                    <tr>
                      <th className="align-middle bg-light">{Trans("_bookingRefNo")}</th>
                      <th className="align-middle bg-light">{Trans("_vendor")}</th>
                      <th className="align-middle bg-light">{Trans("_bookingDate")}</th>
                      <th className="align-middle bg-light">{Trans("_eventDate")}</th>
                      <th className="align-middle bg-light">{Trans("_deadlineDate")}</th>
                      <th className="align-middle bg-light">{Trans("_lblDetails")}</th>
                      <th className="align-middle bg-light">{Trans("_status")}</th>
                      <th className="align-middle bg-light text-center">
                        {Trans("_comment")}
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
                          transactionDate,
                          details,
                          startDate,
                          bookingStatusID,
                          businessShortDescription,
                          deadlineDate
                        } = booking;

                        return (
                          <tr key={key}>
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
                              <Datecomp date={transactionDate} />
                            </td>
                            <td className="text-nowrap">
                              <Datecomp date={startDate} />
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
                            <td className="text-nowrap">
                              {Global.getBookingStatus(bookingStatusID)}
                            </td>
                            <td className="text-center">
                              <button
                                className="btn btn-link p-0 m-0"
                                onClick={() =>
                                  this.getOfflineComments(booking, "view")
                                }
                              >
                                <i
                                  className="fa fa-file-text-o text-primary"
                                  aria-hidden="true"
                                ></i>
                              </button>
                              <button
                                className="btn btn-link p-0 m-0 ml-3"
                                onClick={() =>
                                  this.getOfflineComments(booking, "add")
                                }
                              >
                                <i
                                  className="fa fa-plus-square-o text-primary"
                                  aria-hidden="true"
                                ></i>
                              </button>
                            </td>
                          </tr>
                        );
                      });
                    })}
                  </tbody>
                </table>
              </div>
              {isCommentPopup && (
                <OfflineBookingComments
                  offlineComment={offlineComment}
                  mode={mode}
                  hideCommentPopup={this.hideCommentPopup}
                  updateOfflineBooking={this.updateOfflineBooking}
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

export default OfflineBookings;
