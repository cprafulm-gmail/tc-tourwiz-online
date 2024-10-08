import React, { Component } from "react";
import BookingBase from "../base/booking-base";
import BookingLoadingTable from "../components/loading/booking-loading-table";
import Datecomp from "../helpers/date";
import { apiRequester } from "../services/requester";
import * as Global from "../helpers/global";
import Amount from "../helpers/amount";
import moment from "moment";
import { Trans } from "../helpers/translate";
import DateRangePicker from "../components/common/date-range";
import SVGIcon from "../helpers/svg-icon";
import DownloadEWalletStatement from "../components/export/export-ewallet-statement"
import Form from "../components/common/form";

class EWalletStatement extends Form {
  constructor(props) {
    super(props);
    this.state = {
      page: "ledgerbalance",
      agentBalance: 0,
      results: [],
      isLoading: true,
      pageLength: 10,
      currentPage: 1,
      totalPages: 0,
      data: {
        bookingFromDate: moment(new Date().setDate(new Date().getDate() - 7)).format("YYYY-MM-DDT00:00:00"),
        bookingToDate: moment(new Date()).format("YYYY-MM-DDT00:00:00")
      },
      errors: {}
    };
  }

  //Get EWalletStatement
  getEWalletStatement = (accountNumber, criteriaInfo) => {
    this.setState({
      isLoading: true
    });
    var reqURL = "api/v1/ewallet/statement";
    var reqOBJ = {
      "request": {
        "code": accountNumber,
        "criteriaInfo": criteriaInfo
      }
    }

    apiRequester(
      reqURL,
      reqOBJ,
      function (data) {
        if (data.response.responseDeatils
          && data.response.responseDeatils.accountStatment
          && data.response.responseDeatils.accountStatment.accountStatmentDeatils
          && data.response.responseDeatils.accountStatment.availableBalance
          && data.response.responseDeatils.accountStatment.accountStatmentDeatils[0].transactionAmount)
          this.setState({
            agentBalance: data.response.responseDeatils.accountStatment.availableBalance,
            results: data.response.responseDeatils.accountStatment.accountStatmentDeatils,
            isLoading: false,
            totalPages: parseInt(data.response.responseDeatils.accountStatment.accountStatmentDeatils.length / this.state.pageLength)
              + (data.response.responseDeatils.accountStatment.accountStatmentDeatils.length % this.state.pageLength === 0 ? 0 : 1)
          });
        else
          this.setState({
            agentBalance: 0,
            results: [],
            isLoading: false,
            totalPages: 0,
            currentPage: 1
          });
      }.bind(this)
    );
  };

  handlePaginationResults = (currentPage, pageLength) => {
    this.setState({
      currentPage: parseInt(currentPage),
      pageLength: parseInt(pageLength),
      totalPages: parseInt(this.state.results.length / pageLength) + (this.state.results.length % pageLength === 0 ? 0 : 1)
    });
  }

  handleSearch = () => {
    this.getEWalletStatement(Global.getEnvironmetKeyValue("MOHUewalletAccountNo", "cobrand"),
      [{
        dateInfo: {
          "startDate": this.state.data.bookingFromDate,
          "endDate": this.state.data.bookingToDate
        }
      }]
    );
  }

  componentDidMount() {
    this.handleSearch();
  }

  render() {
    const { results, dates, agentBalance, isLoading, totalPages, currentPage, pageLength } = this.state;
    const recordPerPage = [10, 20, 30, 50, 100];
    return (
      <div className="balance">
        <div className="title-bg pt-3 pb-3 mb-3">
          <div className="container">
            <h1 className="text-white m-0 p-0 f30">
              <SVGIcon
                name="list-ul"
                width="24"
                height="24"
                className="mr-3"
              ></SVGIcon>
              {Trans("_EWalletStatement")}
            </h1>
          </div>
        </div>
        <div className="container">
          <div className="border pt-3 pl-3 pr-3 pb-0 m-0 mb-3 shadow-sm">
            <h5 className="text-primary border-bottom pb-3">
              <SVGIcon
                name="filter"
                width="16"
                height="16"
                type="fill"
                className="mr-2"
              ></SVGIcon>
              <span>{" " + Trans("_filters")}</span>
              {!isLoading && (
                <div className="pull-right">
                  <h5 className="text-primary">
                    {Trans("_eWalletBalance") + " : "}{" "}
                    <Amount amount={agentBalance} currencySymbol={"SAR"} currencyCode={"SAR"} />
                  </h5>
                </div>
              )}
            </h5>
            <div className="row">
              <div className="col-lg-4">
                {this.renderDate(
                  "bookingFromDate",
                  "bookingToDate",
                  Trans("_fromDate"),
                  Trans("_toDate")
                )}
              </div>
              <div className="col-lg-2 mb-3">
                <label>&nbsp;</label>
                <button
                  className="btn btn-sm btn-primary form-control"
                  onClick={() => this.handleSearch()}
                >
                  <SVGIcon
                    name="filter"
                    width="12"
                    height="12"
                    className="mr-1"
                    type="fill"
                  ></SVGIcon>
                  {Trans("_applyFilter")}
                </button>
              </div>
              {false && !isLoading && results && results.length > 0 &&
                <div className="col-lg-2 mb-3">
                  <label>&nbsp;</label>
                  <DownloadEWalletStatement data={results} />
                </div>
              }
            </div>
          </div>

          {!isLoading && results && results.length > 0 ? (
            <div className="border shadow-sm">
              <div className="table-responsive">
                <table className="table balance-table">
                  <thead>
                    <tr>
                      <th className="align-middle bg-light">{Trans("_transactionDate")}</th>
                      <th className="align-middle bg-light">{Trans("_transactionAmount")}</th>
                      <th className="align-middle bg-light">{Trans("_transactionType")}</th>
                      <th className="align-middle bg-light">{Trans("_comment")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.slice(((currentPage - 1) * pageLength), (((currentPage - 1) * pageLength)) + pageLength).map((item, key) => {
                      const {
                        comment,
                        transactionAmount,
                        transactionDate,
                        transactionType
                      } = item;
                      return (
                        <tr key={key}>
                          <td className="text-nowrap">
                            <Datecomp date={transactionDate} />{" "}
                            <Datecomp date={transactionDate} format={"LT"} />
                          </td>
                          <td className="text-nowrap"><Amount amount={transactionAmount} currencySymbol={"SAR"} currencyCode={"SAR"} /></td>
                          <td className="text-nowrap">{transactionType}</td>
                          <td className="text-nowrap">{comment}</td>
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
            results &&
            results &&
            results.length > 0 && (
              <nav className="d-flex justify-content-between mt-3">
                <div className="d-flex text-secondary">
                  {Trans("_grid_paging_totalRecord")}: <b className="text-primary ml-2">{results.length}</b>
                </div>
                <div className="d-flex text-secondary">
                  {Trans("_grid_paging_recordsPerPage")}
                  <select
                    className="form-control form-control form-control-sm ml-2"
                    style={{ width: "auto" }}
                    onChange={e =>
                      this.handlePaginationResults(1, e.target.value)
                    }
                    defaultValue={pageLength}
                  >
                    {recordPerPage.map(option => {
                      return (
                        <option value={option} key={option}>
                          {option}
                        </option>
                      );
                    })}
                  </select>

                </div>
                <div className="d-flex text-secondary">
                  {Trans("_grid_paging_gotoPage")}
                  <select
                    className="form-control form-control form-control-sm ml-2"
                    style={{ width: "auto" }}
                    onChange={e =>
                      this.handlePaginationResults(e.target.value, pageLength)
                    }
                    defaultValue={currentPage - 1}
                  >
                    {[...Array(totalPages).keys()].map(option => {
                      return (
                        <option value={option + 1} key={option}>
                          {option + 1}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <ul className="pagination p-0 m-0">
                  <li className={"page-item" + (currentPage === 1 ? " disabled" : "")}>
                    <button className="page-link"
                      onClick={() =>
                        this.handlePaginationResults(currentPage - 1, pageLength)
                      }>{Trans("_grid_paging_previous")}</button>
                  </li>
                  <li className="page-item">
                    <span className="page-link text-secondary bg-light">{Trans("_grid_paging_page")} {currentPage} {Trans("_grid_paging_of")} {totalPages}</span>
                  </li>
                  <li className={"page-item" + (currentPage === totalPages ? " disabled" : "")}>
                    <button className="page-link"
                      onClick={() =>
                        this.handlePaginationResults(currentPage + 1, pageLength)
                      }>{Trans("_grid_paging_next")}</button>
                  </li>
                </ul>
              </nav>
            )
          }

          {
            !isLoading && results.length === 0 && (
              <span className={"alert alert-danger mt-2 p-1 d-inline-block "}>
                {Trans("_noEWalletTransactionFound")}
              </span>
            )
          }
        </div >
      </div >
    );
  }
}

export default EWalletStatement;
