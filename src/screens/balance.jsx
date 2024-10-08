import React from "react";
import BookingBase from "../base/booking-base";
import BookingLoadingTable from "../components/loading/booking-loading-table";
import Datecomp from "../helpers/date";
import BookingFilters from "../components/booking-management/booking-filters";
import SVGICon from "../helpers/svg-icon";
import Pagination from "../components/booking-management/booking-pagination";
import * as Global from "../helpers/global";
import moment from "moment";
import { Trans } from "../helpers/translate";
import CallCenter from "../components/call-center/call-center";
import Amount from "../helpers/amount";

class Balance extends BookingBase {
  constructor(props) {
    super(props);
    this.state = {
      page: "ledgerbalance",
      results: [],
      isLoading: true,
      pageLength: 10,
      defaultFilters: [
        {
          Name: "daterange",
          minValue: moment().add(-1, 'months').format(Global.DateFormate),
          maxValue: moment().format(Global.DateFormate)
        }
      ]
    };
  }

  componentDidMount() {
    this.getBookings(this.state.defaultFilters);
  }

  render() {
    const { page, results, isLoading } = this.state;
    return (
      <div className="balance">
        <div className="title-bg pt-3 pb-3 mb-3">
          <div className="container">
            <h1 className="text-white m-0 p-0 f30">
              <SVGICon
                name="list-ul"
                width="24"
                height="24"
                className="mr-3"
              ></SVGICon>
              {Trans("_balanceTransactionDetails")}
            </h1>
          </div>
        </div>
        <div className="container">
          <div className="mt-2 mb-3">
            <CallCenter />
          </div>

          <BookingFilters
            {...results}
            page={page}
            balanceInfo={this.props.userInfo}
            filterResults={this.filterResults}
          />
          {!isLoading && results.data && results.data.length > 0 ? (
            <div className="border shadow-sm">
              <div className="table-responsive">
                <table className="table balance-table">
                  <thead>
                    <tr>
                      <th className="align-middle bg-light">{Trans("_paymentDate")}</th>
                      <th className="align-middle bg-light">{Trans("_openingBalance")}</th>
                      <th className="align-middle bg-light">{Trans("_creditBalance")}</th>
                      <th className="align-middle bg-light">{Trans("_debitBalance")}</th>
                      <th className="align-middle bg-light">{Trans("_closingBalance")}</th>
                      <th className="align-middle bg-light">{Trans("_receiptNumber")}</th>
                      <th className="align-middle bg-light">
                        {Trans("_itineraryNumber")}
                      </th>
                      <th className="align-middle bg-light">{Trans("_bookingRefNo")}</th>
                      <th className="align-middle bg-light">
                        {Trans("_transactionType")}
                      </th>
                      <th className="align-middle bg-light">{Trans("_reason")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.data.map((item, key) => {
                      const {
                        transactionDate,
                        openingBalance,
                        creditAmount,
                        debitAmount,
                        closingBalance,
                        receiptNo,
                        itineraryRefNo,
                        bookingRefNo,
                        transactionType,
                        reason
                      } = item;
                      return (
                        <tr key={key}>
                          <td className="text-nowrap">
                            <Datecomp date={transactionDate} />
                          </td>
                          <td className="text-nowrap">
                            {openingBalance === "0" &&
                              <Amount amount={openingBalance} />
                            }
                            {openingBalance === "0" ? "" : openingBalance}
                          </td>
                          <td className="text-nowrap">
                            {creditAmount === "0" &&
                              <Amount amount={creditAmount} />
                            }
                            {creditAmount === "0" ? "" : creditAmount}
                          </td>
                          <td className="text-nowrap"> {debitAmount === "0" &&
                            <Amount amount={debitAmount} />
                          }
                            {debitAmount === "0" ? "" : debitAmount}</td>
                          <td className="text-nowrap">{closingBalance}</td>
                          <td className="text-nowrap">{receiptNo}</td>
                          <td className="text-nowrap">{itineraryRefNo}</td>
                          <td className="text-nowrap">{bookingRefNo}</td>
                          <td title={transactionType}>
                            {transactionType.length > 20
                              ? transactionType.substring(0, 20) + "..."
                              : transactionType}
                          </td>
                          <td title={reason}>
                            {reason.length > 20
                              ? reason.substring(0, 20) + "..."
                              : reason}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
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

export default Balance;
