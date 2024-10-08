import React, { Component } from "react";
import CallCenterSelection from "./call-center-selection";
import Loader from "../common/loader";
import { Trans } from "../../helpers/translate";

class CallCenterDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isInnerLoding: ""
    };
  }

  handleQuery = query => {
    this.props.handleQuery(query);
  };

  handleSelect = item => {
    if (this.state.isInnerLoding === "") {
      this.setState({
        isInnerLoding: item.details.customerID
      });
      this.props.handleSelect(item)
    }
  };

  componentDidMount() {
    this.props.handleQuery();
  }

  render() {
    let isLoading = this.props.results;
    let results = this.props.results.data;

    return (
      <div className="model-popup call-center-selection">
        <div className="modal fade show d-block">
          <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <div className="w-100 pr-3">
                  <CallCenterSelection
                    {...this.props}
                    handleCallCenterDetails={this.handleQuery}
                    isPortalsDisabled={true}
                  />
                </div>

                <button
                  type="button"
                  className="close"
                  onClick={() => this.props.handleCallCenterDetails()}
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <div>
                  {isLoading ? (
                    <div className="border shadow-sm">
                      <div className="table-responsive">
                        <table className="table offline-booking-table">
                          <thead>
                            <tr>
                              <th className="align-middle bg-light">{Trans("_name")}</th>
                              <th className="align-middle bg-light">{Trans("_viewType")}</th>
                              <th className="align-middle bg-light">{Trans("_lblBranch")}</th>
                              <th className="align-middle bg-light">{Trans("_email")}</th>
                              <th className="align-middle bg-light">{Trans("_viewPhone")}</th>
                              <th className="align-middle bg-light">{Trans("_actions")}</th>
                            </tr>
                          </thead>
                          <tbody>
                            {results.map((item, key) => {
                              const { type, branchName } = item;
                              const { firstName, entityID, customerID } = item.details;
                              const {
                                email,
                                phoneNumber
                              } = item.details.contactInformation;

                              return (
                                <tr key={key}>
                                  <td>{firstName}</td>
                                  <td>{type}</td>
                                  <td>{branchName ? branchName : "-"}</td>
                                  <td style={{ "wordBreak": "break-word" }}>{email ? email.endsWith(process.env.REACT_APP_B2CPORTALDOMAIN.replace(".", "@")) ? "-" : email : "-"}</td>
                                  <td>{phoneNumber ? phoneNumber : "-"}</td>
                                  <td>
                                    <button
                                      className="btn btn-sm btn-primary"
                                      onClick={this.state.isInnerLoding === customerID || this.state.isInnerLoding === "" ? () =>
                                        this.handleSelect(item) : null
                                      }
                                      style={{ minWidth: "80px" }}
                                    >{this.state.isInnerLoding === customerID && (
                                      <span className="spinner-border spinner-border-sm mr-2"></span>
                                    )}
                                      {Trans("_select")}
                                    </button>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : (
                    <Loader />
                  )}
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

export default CallCenterDetails;
