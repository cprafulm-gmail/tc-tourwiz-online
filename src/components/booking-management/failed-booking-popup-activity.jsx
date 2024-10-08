import React, { Component } from "react";
import Date from "../../helpers/date";
import { Trans } from "../../helpers/translate";
import Amount from "../../helpers/amount";

class FailedBookingPopupActivity extends Component {
  render() {
    const { viewBookingDetails } = this.props;
    return (
      <div>
        <div className="row">
          <div className="col-lg-12">
            <h5 className="text-primary">{viewBookingDetails.businessObject.name}</h5>
            <h6 className="text-secondary d-inline-block">
              <i
                className="fa fa-map-marker mr-2"
                aria-hidden="true"
              ></i>
              {viewBookingDetails.locationInfo.fromLocation.name}
            </h6>
            <h6 className="text-secondary d-inline-block ml-4">
              <i
                className="fa fa-calendar mr-2"
                aria-hidden="true"
              ></i>
              <Date date={viewBookingDetails.businessShortDescription.toLowerCase() === "transfers" || viewBookingDetails.businessObject.business === "transportation" || viewBookingDetails.businessObject.business === "groundservice" ? viewBookingDetails.businessObject.dateInfo.startDate : viewBookingDetails.dateInfo.startDate} />
            </h6>
            {viewBookingDetails.businessObject.business === "transportation" &&
              <h6 className="text-secondary d-inline-block ml-4">
                <i
                  className="fa fa-clock-o mr-2"
                  aria-hidden="true"
                ></i>
                {Trans("_transportationCompany")} : {viewBookingDetails.businessObject.vendors.find(x => x.type === "company").item.name}
              </h6>
            }
            {viewBookingDetails?.businessObject?.tpExtension && viewBookingDetails?.businessObject?.tpExtension.length > 0 &&
              viewBookingDetails.businessObject.tpExtension.find(x => x.key === "scheduleStart") &&
              <h6 className="text-secondary d-inline-block">
                <i
                  className="fa fa-clock-o mr-2"
                  aria-hidden="true"
                ></i>
                {viewBookingDetails.businessObject.business === "groundservice" ? Trans("_sortcategory") : Trans("_schedule")} : {viewBookingDetails.businessObject.tpExtension.find(x => x.key === "scheduleStart").value}
              </h6>
            }
            {viewBookingDetails?.businessObject?.tpExtension && viewBookingDetails?.businessObject?.tpExtension.length > 0 &&
              viewBookingDetails.businessObject.tpExtension.find(x => x.key === "duration") &&
              <h6 className="text-secondary d-inline-block ml-4">
                <i
                  className="fa fa-clock-o mr-2"
                  aria-hidden="true"
                ></i>
                {Trans("_duration")} : {viewBookingDetails.businessObject.tpExtension.find(x => x.key === "duration").value}
              </h6>
            }
          </div>
        </div>

        <div className="row">
          <div className="col-lg-12">
            <label className="text-secondary mr-2">{Trans("_name")} :</label>
            <span>{viewBookingDetails.travellerDetails[0].details.firstName + " " + viewBookingDetails.travellerDetails[0].details.lastName}</span>
          </div>
          <div className="col-lg-12">
            <label className="text-secondary mr-2">{Trans("_email")} :</label>
            <span>
              {viewBookingDetails.travellerDetails[0].details.contactInformation.email}
            </span>
          </div>
          <div className="col-lg-12">
            <label className="text-secondary mr-2">{Trans("_lblPhoneNumber")} :</label>
            <span>
              {(this.props.viewBookingDetails.travellerDetails[0].details.contactInformation.phoneNumberCountryCode !== undefined && this.props.viewBookingDetails.travellerDetails[0].details.contactInformation.phoneNumber !== undefined) ? (viewBookingDetails.travellerDetails[0].details.contactInformation.phoneNumberCountryCode + " " + viewBookingDetails.travellerDetails[0].details.contactInformation.phoneNumber) : "--"}
            </span>
          </div>
          {(viewBookingDetails.businessObject.business !== "transportation" || viewBookingDetails.businessObject.business !== "groundservice") &&
            <div className="col-lg-12">
              <label className="text-secondary mr-2">{Trans("_noOfPassengers")} :</label>
              <span>
                {viewBookingDetails.businessObject.paxInfo.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            </div>
          }
          {viewBookingDetails.businessObject.business !== "groundservice" &&
          <div className="col-lg-12">
            <label className="text-secondary mr-2">{Trans("_supplierBaseRate")} :</label>
            <span>
              <Amount
                currencyCode={viewBookingDetails.businessObject.items[0].item[0].displayRateInfo.find(x => x.purpose === "14").currencyCode}
                amount={viewBookingDetails.businessObject.items[0].item[0].displayRateInfo.find(x => x.purpose === "14").amount}
              />{" "}
              ({viewBookingDetails.businessObject.items[0].item[0].displayRateInfo.find(x => x.purpose === "14").currencyCode})
            </span>
          </div>
          }
          {viewBookingDetails.businessObject.business === "groundservice" &&
          <div className="col-lg-12">
            <label className="text-secondary mr-2">{Trans("_supplierBaseRate")} :</label>
            <span>
              <Amount
                currencyCode={viewBookingDetails.businessObject.displayRateInfo.find(x => x.purpose === "14").currencyCode}
                amount={viewBookingDetails.businessObject.displayRateInfo.find(x => x.purpose === "14").amount}
              />{" "}
              ({viewBookingDetails.businessObject.displayRateInfo.find(x => x.purpose === "14").currencyCode})
            </span>
          </div>
          }
        </div>
      </div>
    );
  }
}

export default FailedBookingPopupActivity;
