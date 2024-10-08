import React from "react";
import SVGIcon from "../../helpers/svg-icon";
import { Trans } from "../../helpers/translate";
import Date from "../../helpers/date";

const QuotationResultsTotal = (props) => {
  const itemCount =
    props.pageInfoIndex !== undefined ? props.pageInfoIndex[0].item.filteredResults : null;
  const { businessName, searchRequest } = props;
  const Location = searchRequest.fromLocation.name;
  const StartDate = searchRequest.dates.checkInDate;
  const EndDate = searchRequest.dates.checkOutDate;
  const fromLocation = businessName === "air" && searchRequest.fromLocation.id;
  const toLocation = businessName === "air" && searchRequest.toLocation.id;
  let isRoundTrip = businessName === "air" && searchRequest.isTripDirectionRoundtrip;
  if(props.isDomesticRoundTrip)
    isRoundTrip = true;

  return (
    props.pageInfoIndex !== undefined && (
      <div className="quotation-results-total d-flex p-2 pl-3 pr-3 m-0 bg-light">
        <div className="mr-auto d-flex align-items-center">
          <SVGIcon
            className="mr-2 d-flex align-items-center"
            name={businessName}
            width="24"
            type="fill"
          ></SVGIcon>
          {(businessName === "hotel" ||
            businessName === "activity" ||
            businessName === "transfers") && (
            <h6 className="font-weight-bold m-0 p-0">
              {itemCount} {Trans("_title" + businessName)} Found - {Location} -{" "}
              <Date date={StartDate} /> to <Date date={EndDate} />
            </h6>
          )}
          {businessName === "air" && (
            <h6 className="font-weight-bold m-0 p-0">
              {props.isDomesticRoundTrip ? (
                  fromLocation + "-" + toLocation +" "
                )
                :(
                  itemCount+ " " + Trans("_title" + businessName) + "Found -" + fromLocation + "-" + toLocation +" "
                )
              }
              {isRoundTrip && " - " + fromLocation} - <Date date={StartDate} />
              {isRoundTrip && " to "}
              {isRoundTrip && <Date date={EndDate} />}
            </h6>
          )}
        </div>
        <button className="btn btn-sm text-primary bg-white border" style={{ display: "none" }}>
          <SVGIcon name="filter" width="12" type="fill" height="12" className="mr-2"></SVGIcon>
          Filters and Sort
        </button>
        <button className="btn btn-sm" onClick={props.showhideResults}>
          <SVGIcon
            className="d-flex align-items-center"
            name={props.isShowResults ? "caret-down" : "caret-up"}
            width="24"
            type="fill"
          ></SVGIcon>
        </button>
        <button
          className="btn btn-sm border bg-white"
          style={{ borderRadius: "50%" }}
          onClick={props.deleteResults}
        >
          <SVGIcon
            className="d-flex align-items-center"
            name="times"
            width="16"
            height="16"
          ></SVGIcon>
        </button>
      </div>
    )
  );
};

export default QuotationResultsTotal;
