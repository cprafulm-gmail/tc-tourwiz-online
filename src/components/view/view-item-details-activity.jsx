import React from "react";
import { Trans } from "../../helpers/translate";
import ImageNotFoundActivity from "../../assets/images/ImageNotFound-Activity.gif";
import ImageNotFoundPackage from "../../assets/images/ImageNotFound-Package.gif";
import ImageNotFoundTransfer from "../../assets/images/ImageNotFound-Transfers.gif";
import * as Global from "../../helpers/global";

const ViewItemDetailsActivity = (props) => {
  const isCRSRoomSelectionFlowEnable = Global.getEnvironmetKeyValue("IsCRSRoomSelectionFlowEnable", "cobrand") ? true : false;
  const { businessObject } = props;
  const getOnErrorImageURL = () => {
    if (businessObject.business === "activity") {
      return ImageNotFoundActivity.toString();
    } else if (businessObject.business === "package") {
      return ImageNotFoundPackage.toString();
    } else if (businessObject.business === "transfers") {
      return ImageNotFoundTransfer.toString();
    }
  };
  return (
    <div className="card shadow-sm mb-3">
      <div className="card-header">
        <h5 className="m-0 p-0">
          {Trans("_view" + businessObject.business + "DetailsTitile")}
        </h5>
      </div>
      <div className="card-body position-relative mb-3">
        <div className="row">
          <div className="col-lg-10">
            <ul className="list-unstyled p-0 m-0">
              <li className="row">
                <label className="col-lg-3">
                  {Trans("_view" + businessObject.business + "Name") + " : "}
                </label>
                <b className="col-lg-7">{businessObject.name.replaceAll("&amp;", "&")}</b>
              </li>
              {businessObject.business === "activity" && businessObject.tpExtension.find((x) => x.key === "scheduleStart") &&
                businessObject.tpExtension.find((x) => x.key === "scheduleStart")
                  .value !== "" && (
                  <li className="row">
                    <label className="col-lg-3">
                      {Trans("Schedule Name") + " : "}
                    </label>
                    <b className="col-lg-7">
                      {
                        businessObject.tpExtension.find(
                          (x) => x.key === "scheduleStart"
                        ).value
                      }
                    </b>
                  </li>
                )}
              {businessObject.vendors[0].item.contactInformation &&
                businessObject.vendors[0].item.contactInformation.phoneNumber && (
                  <li className="row">
                    <label className="col-lg-3">
                      {Trans("_contactPhone") + " : "}
                    </label>
                    <b className="col-lg-7">
                      {
                        businessObject.vendors[0].item.contactInformation
                          .phoneNumber
                      }
                    </b>
                  </li>
                )}
              {businessObject.locationInfo &&
                businessObject.locationInfo.fromLocation.address && (
                  <li className="row">
                    <label className="col-lg-3">{Trans("_address") + " : "}</label>
                    <b className="col-lg-7">
                      {businessObject.locationInfo.fromLocation.address}
                    </b>
                  </li>
                )}

              {businessObject.locationInfo.toLocation.name &&
                businessObject.locationInfo.toLocation.name !== "" && (
                  <li className="row">
                    <label className="col-lg-3">{Trans("_viewAddress") + " : "}</label>
                    <b className="col-lg-7">
                      {businessObject.locationInfo.toLocation.name === ""
                        ? "---"
                        : businessObject.locationInfo.toLocation.name}
                    </b>
                  </li>
                )}
              {businessObject.business === "transfers" && businessObject.tpExtension.find((x) => x.key === "scheduleStart") &&
                businessObject.tpExtension.find((x) => x.key === "scheduleStart")
                  .value !== "" && (
                  <li className="row">
                    <label className="col-lg-3">
                      {Trans("_vehicleName") + " : "}
                    </label>
                    <b className="col-lg-7">
                      {
                        businessObject.tpExtension.find(
                          (x) => x.key === "scheduleStart"
                        ).value
                      }
                    </b>
                  </li>
                )}
              {businessObject.tpExtension.find((x) => x.key === "operatorName") &&
                businessObject.tpExtension.find((x) => x.key === "operatorName")
                  .value !== "" && (
                  <li className="row">
                    <label className="col-lg-3">
                      {Trans("_viewOperatorName") + " : "}
                    </label>
                    <b className="col-lg-7">
                      {
                        businessObject.tpExtension.find(
                          (x) => x.key === "operatorName"
                        ).value
                      }
                    </b>
                  </li>
                )}
              {businessObject.amenities.length > 0 ? (
                <li className="row">
                  <label className="col-lg-3">{Trans("_viewType") + " : "}</label>
                  <b className="col-lg-7">{businessObject.amenities[0].name}</b>
                </li>
              ) : null}
              {businessObject.tpExtension.find((x) => x.key === "meetingPlace")
                .value ? (
                <li className="row">
                  <label className="col-lg-3">
                    {Trans("_viewMeetingPlace") + " : "}
                  </label>
                  <b className="col-lg-7">
                    {
                      businessObject.tpExtension.find(
                        (x) => x.key === "meetingPlace"
                      ).value
                    }
                  </b>
                </li>
              ) : null}
              {businessObject.contactInformation &&
                businessObject.contactInformation.workEmail ? (
                <li className="row">
                  <label className="col-lg-3">{Trans("_viewEmail") + " : "}</label>
                  <b className="col-lg-7">
                    {businessObject.contactInformation.workEmail}
                  </b>
                </li>
              ) : null}
              {businessObject.tpExtension.find((x) => x.key === "duration")
                .value ? (
                <li className="row">
                  <label className="col-lg-3">{Trans("_viewDuration") + " : "}</label>
                  <b className="col-lg-7">
                    {
                      businessObject.tpExtension.find((x) => x.key === "duration")
                        .value
                    }
                  </b>
                </li>
              ) : null}

              {isCRSRoomSelectionFlowEnable && businessObject.items[0].item[0].business === "package" &&
                <li className="row">
                  <label className="col-lg-3">Guest & Rooms :</label>
                  <b className="col-lg-7">{businessObject.items[0].item[0].name}</b>
                </li>
              }
            </ul>
          </div>
          <div className="col-lg-2 d-flex justify-content-end">
            <img
              className="img-fluid img-thumbnail"
              src={businessObject.url}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = getOnErrorImageURL();
              }}
              style={{ maxHeight: "94px" }}
              alt="abd"
            ></img>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewItemDetailsActivity;
