import React, { Component } from "react";
import moment from "moment";
import Check from "../../assets/images/svg/card-checklist.svg";
import { Trans } from "../../helpers/translate";

class ActivityLogDetails extends Component {

  render() {
    let activityLogDetails = this.props.activityLogDetails.activityLogs;
    let activityParameter = this.props.activityLogDetails.activityParameter;
    let gmtTimeDifference = (new Date()).getTimezoneOffset() * -1;
    //let gmtTimeDifference = this.props.userInfo.gmtTimeDifference;
    return (
      <div className="container">
        {activityLogDetails.map(item => {

          return item.actionType === "inquiry_updated" && item.comment === null
            ? <React.Fragment></React.Fragment>
            : <div className="row ml-2 mb-3">
              <div className="col-lg-1 d-flex p-0 justify-content-center align-items-center">
                <img
                  style={{ filter: "none", height: "30px" }}
                  src={Check}
                  alt=""
                />
              </div>
              <div className="col-lg-11 py-1 pl-1 justify-content-start align-items-center">
                <div className="d-block w-100">
                  <span className=" p-0 text-primary" >
                    {item.actionTypeDesc === "Quotation Added"
                      ? Trans("_quotationReplaceKey") + " Added"
                      : item.actionTypeDesc === "Quotation Created"
                        ? Trans("_quotationReplaceKey") + " Created"
                        : (item.actionTypeDesc === "Inquiry Status Updated" && this.props?.type === "Quotation")
                          ? "Proposal Status Updated"
                          : (item.actionTypeDesc === "Inquiry Status Updated" && this.props?.type === "Itinerary")
                            ? "Itinerary Status Updated"
                            : (item.actionTypeDesc === "Itinerary Replied" && this.props?.type === "Quotation")
                              ? "Assigned To employee"
                              : item.actionTypeDesc}
                    <small className="pt-4 pl-1 h6  text-secondary" style={{ fontSize: "12px" }}>- {item.userDisplayName}</small>
                  </span>
                </div>
                <div className="d-block w-100" style={{ marginTop: "-7px" }}>
                  <small className="m-0 p-0" style={{ fontSize: "12px" }}>
                    {moment(item.actionDateTime).add(gmtTimeDifference, 'minutes').format('LLL')} {/* - {item.userDisplayName} */}
                  </small>
                </div>

              </div>
              {activityParameter.filter(x => x.activityLogID === item.activityLogID).length > 0 &&
                item.actionType !== "send_email" &&
                <React.Fragment>
                  <div className="col-lg-1"></div>
                  <div className="border col-lg-11 p-1">
                    <span className="p-1 " style={{ fontSize: "12px" }}>
                      {item.actionType === "inquiry_status_update" &&
                        /* https://dribbble.com/shots/14596841-Vizibl-New-Activity-Log/attachments/6288410?mode=media */
                        <span>
                          Status updated with <u>{activityParameter.find(x => x.activityLogID === item.activityLogID && x.paramName === "NewStatus").actionParamValue}</u>.
                          Previous status was <u>{activityParameter.find(x => x.activityLogID === item.activityLogID && x.paramName === "OldStatus").actionParamValue}</u>.
                          <br />
                          {(this.props?.type !== "Quotation" && this.props?.type !== "Itinerary") && "Comments : " + item.activityText}
                        </span>

                      }
                      {item.actionType === "itinerary_change_assignee" &&
                        activityParameter.filter(x => x.activityLogID === item.activityLogID && x.paramName === "NewAssigneeUserID").length > 0 &&
                        activityParameter.filter(x => x.activityLogID === item.activityLogID && x.paramName === "OldAssigneeUserID").length > 0 &&
                        <span>
                          Itinerary assigned to <u>{activityParameter.find(x => x.activityLogID === item.activityLogID && x.paramName === "NewAssigneeUserID").actionParamValue}</u>
                          &nbsp;from <u>{activityParameter.find(x => x.activityLogID === item.activityLogID && x.paramName === "OldAssigneeUserID").actionParamValue}</u>
                          {/* <br />
                          Comments : {item.activityText} */}
                        </span>
                      }
                      {item.actionType === "itinerary_status_closed" &&
                        <span>
                          Itinerary <u> {item.actionTypeDesc}</u>
                          {/* <br />
                          Comments : {item.activityText} */}
                        </span>
                      }

                      {item.actionType === "quotation_change_assignee" &&
                        activityParameter.filter(x => x.activityLogID === item.activityLogID && x.paramName === "NewAssigneeUserID").length > 0 &&
                        activityParameter.filter(x => x.activityLogID === item.activityLogID && x.paramName === "OldAssigneeUserID").length > 0 &&
                        <span>
                          Proposal assigned to <u>{activityParameter.find(x => x.activityLogID === item.activityLogID && x.paramName === "NewAssigneeUserID").actionParamValue}</u>
                          &nbsp;from <u>{activityParameter.find(x => x.activityLogID === item.activityLogID && x.paramName === "OldAssigneeUserID").actionParamValue}</u>
                          {/* <br />
                          Comments : {item.activityText} */}
                        </span>
                      }
                      {item.actionType === "inquiry_change_assignee" &&
                        activityParameter.filter(x => x.activityLogID === item.activityLogID && x.paramName === "NewAssigneeUserID").length > 0 &&
                        activityParameter.filter(x => x.activityLogID === item.activityLogID && x.paramName === "OldAssigneeUserID").length > 0 &&
                        <span>
                          {this.props.type === "Quotation" && "Proposal "}
                          {this.props.type === "Itinerary" && " Itinerary "}
                          {(this.props.type !== "Itinerary" && this.props.type !== "Quotation") && "Inquiry "}
                          assigned to <u>{activityParameter.find(x => x.activityLogID === item.activityLogID && x.paramName === "NewAssigneeUserID").actionParamValue}</u>
                          &nbsp;from <u>{activityParameter.find(x => x.activityLogID === item.activityLogID && x.paramName === "OldAssigneeUserID").actionParamValue}</u>
                          <br />
                          Comments : {item.activityText}
                        </span>
                      }
                      {item.actionType === "itinerary_followup_date_update" &&
                        <span>
                          New Date <u>{moment(activityParameter
                            .find(x => x.activityLogID === item.activityLogID && x.paramName === "NewFollowupDate").actionParamValue).format('LL')}</u>.
                          Previous Date : <u>{moment(activityParameter
                            .find(x => x.activityLogID === item.activityLogID && x.paramName === "OldFollowupDate").actionParamValue).format('LL')}</u>.
                          <br />
                          {/* Comments : {item.activityText} */}
                        </span>
                      }
                      {item.actionType === "quotation_followup_date_update" &&
                        <span>
                          New Date <u>{moment(activityParameter
                            .find(x => x.activityLogID === item.activityLogID && x.paramName === "NewFollowupDate").actionParamValue).format('LL')}</u>.
                          Previous Date : <u>{moment(activityParameter
                            .find(x => x.activityLogID === item.activityLogID && x.paramName === "OldFollowupDate").actionParamValue).format('LL')}</u>.
                          <br />
                          {/* Comments : {item.activityText} */}
                        </span>
                      }
                      {item.actionType === "inquiry_followup_date_update" &&
                        <span>
                          New Date <u>{moment(activityParameter
                            .find(x => x.activityLogID === item.activityLogID && x.paramName === "NewFollowupDate").actionParamValue).format('LL')}</u>.
                          Previous Date : <u>{moment(activityParameter
                            .find(x => x.activityLogID === item.activityLogID && x.paramName === "OldFollowupDate").actionParamValue).format('LL')}</u>.
                          <br />
                          Comments : {item.activityText}
                        </span>
                      }
                      {(item.actionType === "priority"
                        && ((activityParameter.find(x => x.activityLogID === item.activityLogID && x.paramName === "OldPriority").actionParamValue == "" ||
                          activityParameter.find(x => x.activityLogID === item.activityLogID && x.paramName === "OldPriority").actionParamValue == null))) &&
                        <span>
                          <u>{activityParameter.find(x => x.activityLogID === item.activityLogID && x.paramName === "NewPriority").actionParamValue}</u>
                          &nbsp; priority assigned to the
                          {this.props.type === "Quotation" && " Proposal"}
                          {this.props.type === "Itinerary" && " Itinerary"}
                          {(this.props.type !== "Itinerary" && this.props.type !== "Quotation") && " Inquiry"}
                          <br />
                        </span>
                      }
                      {(item.actionType === "priority" &&
                        activityParameter.find(x => x.activityLogID === item.activityLogID && x.paramName === "NewPriority").actionParamValue == null) &&
                        <span>
                          priority has been removed <u>({activityParameter.find(x => x.activityLogID === item.activityLogID && x.paramName === "OldPriority").actionParamValue})</u>
                          &nbsp;
                          <br />
                        </span>
                      }
                      {(item.actionType === "priority" &&
                        activityParameter.find(x => x.activityLogID === item.activityLogID && x.paramName === "OldPriority").actionParamValue !== "" &&
                        activityParameter.find(x => x.activityLogID === item.activityLogID && x.paramName === "OldPriority").actionParamValue !== null &&
                        activityParameter.find(x => x.activityLogID === item.activityLogID && x.paramName === "NewPriority").actionParamValue !== null) &&
                        <span>
                          {this.props.type === "Quotation" && "Proposal "}
                          {this.props.type === "Itinerary" && " Itinerary "}
                          {(this.props.type !== "Itinerary" && this.props.type !== "Quotation") && "Inquiry "}
                          priority to <u>{activityParameter.find(x => x.activityLogID === item.activityLogID && x.paramName === "NewPriority")?.actionParamValue}</u>
                          &nbsp;from <u>{activityParameter.find(x => x.activityLogID === item.activityLogID && x.paramName === "OldPriority")?.actionParamValue}</u>
                          <br />
                        </span>
                      }
                      {(item.actionType === "inquiry_priority"
                        && ((activityParameter.find(x => x.activityLogID === item.activityLogID && x.paramName === "OldPriority").actionParamValue == "" ||
                          activityParameter.find(x => x.activityLogID === item.activityLogID && x.paramName === "OldPriority").actionParamValue == null))) &&
                        <span>
                          <u>{activityParameter.find(x => x.activityLogID === item.activityLogID && x.paramName === "NewPriority").actionParamValue}</u>
                          &nbsp; priority assigned to the
                          {this.props.type === "Quotation" && " Proposal"}
                          {this.props.type === "Itinerary" && " Itinerary"}
                          {(this.props.type !== "Itinerary" && this.props.type !== "Quotation") && " Inquiry"}
                          <br />
                        </span>
                      }
                      {(item.actionType === "inquiry_priority" &&
                        activityParameter.find(x => x.activityLogID === item.activityLogID && x.paramName === "NewPriority").actionParamValue == null) &&
                        <span>
                          priority has been removed <u>({activityParameter.find(x => x.activityLogID === item.activityLogID && x.paramName === "OldPriority").actionParamValue})</u>
                          &nbsp;
                          <br />
                        </span>
                      }
                      {(item.actionType === "inquiry_priority" &&
                        activityParameter.find(x => x.activityLogID === item.activityLogID && x.paramName === "OldPriority").actionParamValue !== "" &&
                        activityParameter.find(x => x.activityLogID === item.activityLogID && x.paramName === "OldPriority").actionParamValue !== null &&
                        activityParameter.find(x => x.activityLogID === item.activityLogID && x.paramName === "NewPriority").actionParamValue !== null) &&
                        <span>
                          {this.props.type === "Quotation" && "Proposal "}
                          {this.props.type === "Itinerary" && " Itinerary "}
                          {(this.props.type !== "Itinerary" && this.props.type !== "Quotation") && "Inquiry "}
                          priority to <u>{activityParameter.find(x => x.activityLogID === item.activityLogID && x.paramName === "NewPriority")?.actionParamValue}</u>
                          &nbsp;from <u>{activityParameter.find(x => x.activityLogID === item.activityLogID && x.paramName === "OldPriority")?.actionParamValue}</u>
                          <br />
                        </span>
                      }
                    </span>
                  </div>
                </React.Fragment>
              }
              {item.comment &&
                <React.Fragment>
                  <div className="col-lg-1"></div>
                  <div className="border col-lg-11 p-1">
                    <span className="p-1" style={{ fontSize: "12px", whiteSpace: "pre-line" }}>
                      Other requirements : <br /> {item.comment}
                    </span>
                  </div>
                </React.Fragment>
              }
            </div>
        })}
        {activityLogDetails.length === 0 &&
          <span>No activity log found.</span>
        }
      </div>
    );
  }
}

export default ActivityLogDetails;