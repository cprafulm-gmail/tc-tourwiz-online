import React from "react";
import { Trans } from "../../helpers/translate";

const ViewRoomDetails = props => {
  const roomDetails = props.businessObject.items;
  return (
    <div className="card shadow-sm mb-3">
      <div className="card-header">
        <h5 className="m-0 p-0">{Trans("_viewRoomDetails")}</h5>
      </div>
      <div className="card-body">
        <ul className="list-unstyled p-0 m-0">
          {roomDetails.map((items, key) => {
            return (
              <li key={key} className="row">
                {items.item.map((item, key) => {
                  if (props.travellerDetails[key].details.firstName !== "TBA" || props.travellerDetails[key].details.lastName !== "TBA") {
                    return (
                      <React.Fragment key={key}>
                        <b className="col-12 text-primary mb-1">
                          {Trans("_viewRoom") + " - "}
                          {item.description}
                        </b>

                        <label className="col-3">{Trans("_viewGuestName")}</label>
                        <b className="col-9">
                          {props.travellerDetails[key].details.firstName === "TBA" ? "" : props.travellerDetails[key].details.firstName}{" "}
                          {props.travellerDetails[key].details.lastName === "TBA" ? "" : props.travellerDetails[key].details.lastName}
                        </b>

                        <label className="col-3">{Trans("_viewAdults")}</label>
                        <b className="col-9">
                          {item.tpExtension.find(o => o.key === "adults").value}
                        </b>
                        <label className="col-3">{Trans("_viewChildren")}</label>
                        <b className="col-9">
                          {item.tpExtension.find(o => o.key === "children").value}
                        </b>

                        {item.boardTypes !== undefined
                          ? item.boardTypes.map(function (boardTypes, key) {
                            return (
                              <React.Fragment key={key}>
                                <label className="col-3">
                                  {Trans("_viewBoardTypes")}
                                </label>
                                <b className="col-9">{boardTypes.type}</b>
                              </React.Fragment>
                            );
                          })
                          : ""}
                      </React.Fragment>
                    );
                  }
                })}
              </li>
            );

          })}
        </ul>
      </div>
    </div>
  );
};

export default ViewRoomDetails;
