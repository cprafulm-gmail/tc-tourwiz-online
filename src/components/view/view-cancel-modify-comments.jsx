import React from "react";
import Date from "../../helpers/date";
import { Trans } from "../../helpers/translate";

const ViewCancelModifyComments = props => {
  const { changeRequestDetails } = props;

  const isChangeRequestDetails =
    changeRequestDetails.length > 0 && changeRequestDetails;

  const transactionDate =
    isChangeRequestDetails &&
    changeRequestDetails.find(x => x.transactionDate).transactionDate;

  const comment =
    isChangeRequestDetails && changeRequestDetails.find(x => x.comment).comment;

  const requestDetails = props.changeRequestDetails;
  return (
    <React.Fragment>
      {isChangeRequestDetails && (
        <div className="card shadow-sm mb-3">
          <div className="card-header">
            <h5 className="m-0 p-0">{Trans("_requestComments")}</h5>
          </div>
          <div className="card-body">
            <ul className="list-unstyled p-0 m-0">
              {requestDetails.map((items, key) => {
                return (
                  <React.Fragment>
                    {items.bookingStatus &&
                      <li key={key} className="row">
                        <label className="col-3">{Trans("_status")} : </label>
                        <b className="col-9">{items.bookingStatus}</b>
                      </li>
                    }
                    <li key={key} className="row">
                      <label className="col-3">{Trans("_requestDate")} : </label>
                      <b className="col-9">
                        <span>
                          <Date date={items.transactionDate} />{" "}
                          <Date date={items.transactionDate} format="shortTime" />
                        </span>
                        <sub className="ml-3">
                          ({Trans("_utcDate")} : <Date date={items.changeRequestDate} />{" "}
                          <Date date={items.changeRequestDate} format="shortTime" />)
                        </sub>
                      </b>
                    </li>
                    <li key={key} className="row">
                      <label className="col-3">{Trans("_lblDetails")} : </label>
                      <b className="col-9">{unescape(items.comment)}</b>
                    </li>

                    <li key={key} className="row">
                      <label className="col-3">{Trans("_commentBy")} : </label>
                      <b className="col-9">{items.displayUserName}</b>
                    </li>

                    {requestDetails.length !== key + 1 &&
                      <li className="border-bottom pb-1 mb-2"></li>}
                  </React.Fragment>
                );
              })}
            </ul>
          </div>
        </div>
      )}
    </React.Fragment>
  );
};

export default ViewCancelModifyComments;
