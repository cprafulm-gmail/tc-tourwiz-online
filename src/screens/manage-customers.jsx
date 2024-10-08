import React from "react";
import BookingBase from "../base/booking-base";
import BookingLoadingTable from "../components/loading/booking-loading-table";
import Datecomp from "../helpers/date";
import SVGICon from "../helpers/svg-icon";
import Pagination from "../components/booking-management/booking-pagination";
import { Trans } from "../helpers/translate";
import CallCenter from "../components/call-center/call-center";

class ManageCustomers extends BookingBase {
  constructor(props) {
    super(props);
    this.state = {
      page: "customers",
      results: [],
      isLoading: true,
      pageLength: 10,
      defaultFilters: []
    };
  }

  componentDidMount() {
    this.getBookings(this.state.defaultFilters);
  }

  render() {
    const { results, isLoading } = this.state;
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
              Manage Customers
            </h1>
          </div>
        </div>
        <div className="container">
          <div className="mt-2 mb-3">
            <CallCenter />
          </div>
          {!isLoading && results.data && results.data.length > 0 ? (
            <div className="border shadow-sm">
              <div className="table-responsive">
                <table className="table balance-table">
                  <thead>
                    <tr>
                      <th className="align-middle bg-light">Payment Date</th>
                      <th className="align-middle bg-light">Opening Balance</th>
                      <th className="align-middle bg-light">Credit Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.data.map((item, key) => {
                      const {
                        transactionDate,
                        openingBalance,
                        creditAmount,
                        debitAmount
                      } = item;
                      return (
                        <tr key={key}>
                          <td className="text-nowrap">
                            <Datecomp date={transactionDate} />
                          </td>
                          <td className="text-nowrap">{openingBalance}</td>
                          <td className="text-nowrap">{creditAmount}</td>
                          <td className="text-nowrap">{debitAmount}</td>
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

export default ManageCustomers;
