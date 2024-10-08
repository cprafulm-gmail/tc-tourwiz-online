import React, { Component } from "react";
import Loader from "../common/loader";
import { Trans } from "../../helpers/translate";
import Amount from "../../helpers/amount";

class IssueDocumentsPopup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isBtnLoading: false,
      isShowComments: this.props.mode,
      comment: "",
      errors: {}
    };
  }

  handleIssueDocumentsUpdate = () => {
    const errors = {};
    if (this.state.comment === "" && this.props.mode === "cancel")
      errors.comment = Trans("_error_comment_require");

    const errorsNew = Object.keys(errors).length === 0 ? null : errors;
    this.setState({ errors: errorsNew || {} });
    if (errorsNew) return;
    let issueDocumentsReq = this.props.issueDocumentsDetails;
    this.state.comment &&
      (issueDocumentsReq.comments = [
        {
          key: "",
          value: this.state.comment
        }
      ]);

    this.setState({
      isBtnLoading: true
    });
    this.props.handleIssueDocumentsUpdate(issueDocumentsReq, this.props.mode);
  };

  render() {
    const { isBtnLoading } = this.state;
    const { mode, issueDocumentsBalance, issueDocumentsDetails } = this.props;

    return (
      <div className="model-popup">
        <div className="modal fade show d-block">
          <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title text-capitalize">
                  {mode === "confirm" ? Trans("_confirmBooking")
                    : Trans("_cancelBooking")}
                </h5>
                <button
                  type="button"
                  className="close"
                  onClick={this.props.hideIssueDocumentsPopup}
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <div>
                  {mode === "confirm" && (
                    <div className="row">
                      <div className="col-lg-12">
                        {issueDocumentsBalance ? (
                          <ul className="list-unstyled m-0">
                            <li>
                              <label className="text-secondary mr-2">
                                {Trans("_name")} :
                              </label>
                              <span>{issueDocumentsBalance.companyName}</span>
                            </li>

                            <li>
                              <label className="text-secondary mr-2">
                                {Trans("_balance")} :
                              </label>
                              <span>
                                <Amount amount={issueDocumentsBalance.agentBalance} currencyCode={issueDocumentsBalance.currencies[0].symbol} />
                              </span>
                            </li>

                            <li>
                              <label className="text-secondary mr-2">
                                {Trans("_payableAmount")} :
                              </label>
                              <span>
                                <Amount amount={issueDocumentsDetails.paidAmount} currencyCode={issueDocumentsBalance.currencies[0].symbol} />
                              </span>
                            </li>
                          </ul>
                        ) : (
                            <Loader />
                          )}
                      </div>
                    </div>
                  )}

                  {mode === "cancel" && (
                    <div className="row">
                      <div className="col-lg-12">
                        <div className="form-group">
                          <label>{Trans("_comments")} * : </label>
                          <textarea
                            className="form-control"
                            value={this.state.comment}
                            onChange={e =>
                              this.setState({ comment: e.target.value })
                            }
                          />
                          {this.state.errors.comment !== undefined &&
                            this.state.errors.comment !== "" && (
                              <div className="col-lg-12 col-sm-12 m-0 p-0">
                                <small className="alert alert-danger mt-2 mb-0 p-1 d-inline-block">
                                  {this.state.errors.comment}
                                </small>
                              </div>
                            )}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="row">
                    <div className="col-lg-12 mt-2">
                      <h6 className="text-primary font-weight-bold">
                        {Trans("_areYouSureYouWantToConfirmOrCancle")}{" "}
                        {mode === "confirm" ? Trans("_confirm") : Trans("_cancel")} {Trans("_thisBooking")}
                      </h6>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-lg-12 mt-3">
                      <button
                        className="btn btn-primary mr-3"
                        onClick={this.handleIssueDocumentsUpdate}
                      >
                        {isBtnLoading && (
                          <span className="spinner-border spinner-border-sm mr-2"></span>
                        )}
                        {Trans("_yes")}
                      </button>
                      <button
                        className="btn btn-secondary mr-3"
                        onClick={this.props.hideIssueDocumentsPopup}
                      >
                        {Trans("_no")}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="modal-backdrop fade show"></div>
      </div>
    );
  }
}

export default IssueDocumentsPopup;
