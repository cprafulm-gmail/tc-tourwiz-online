import React from "react";
import SVGIcon from "../../helpers/svg-icon";
import Date from "../../helpers/date";
import AuthorizeComponent from "../common/authorize-component";
import { Trans } from "../../helpers/translate";

const Quotationinfo = (props) => {
  let tmpTypeConcate = props.type.includes('Master') ? "master-" : '';
  return (
    <div className="quotation-info border bg-light d-flex p-2">
      <div className="mr-auto d-flex align-items-center">
        <SVGIcon
          name={"user-circle"}
          className="mr-2 d-flex align-items-center"
          width="22"
          type="fill"
        ></SVGIcon>
        {!props.isquickpropo &&
          <h6 className="font-weight-bold m-0 p-0">
            {(props.type === "Quotation" || props.type === "Quotation_Master")
              ? Trans("_quotationReplaceKey")
              : "Itinerary"} for {props.customerName} -{" "}
            {props.title}
            {(props.type === "Itinerary" || props.type === "Itinerary_Master") && (
              <React.Fragment>
                {" - "}
                <Date date={props.startDate} />
                {" to "}
                <Date date={props.endDate} />
              </React.Fragment>
            )}
          </h6>
        }
        {props.isquickpropo &&
          <h6 className="font-weight-bold m-0 p-0">
            {"Quick " + Trans("_quotationReplaceKey")}
            {props.mode === "CreateQuick" ?
              " " :
              (" for " + props.customerName + " - " + props.title)}
          </h6>
        }
      </div>
      {/* {(props.type === 'Quotation_Master' || props.type === 'Quotation') &&
        <div class="mt-2 mr-4">
          <small>
            <div className="custom-control custom-switch d-inline-block mr-2 mb-2">
              <input
                id="isQuickProposal"
                name="isQuickProposal"
                type="checkbox"
                className="custom-control-input"
                checked={props.rdoquickproposal}
                onChange={props.handlequickproposal}
              />
              <label className="custom-control-label font-weight-bold " htmlFor="isQuickProposal">
                Quick Proposal
              </label>
            </div>
          </small>
        </div>
      } */}
      <AuthorizeComponent title={(props.type === "Quotation" || props.type === "Quotation_Master") ? "dashboard-menu~" + tmpTypeConcate + "quotation-create-quotation" : "dashboard-menu~" + tmpTypeConcate + "itineraries-create-itineraries"} type="button" rolepermissions={props.userInfo.rolePermissions} >
        <button className="btn p-0 m-0" onClick={props.handleEdit}>
          <SVGIcon name={"pencil-alt"} className="mr-2" width="16" type="fill"></SVGIcon>
        </button>
      </AuthorizeComponent>
    </div>
  );
};

export default Quotationinfo;
