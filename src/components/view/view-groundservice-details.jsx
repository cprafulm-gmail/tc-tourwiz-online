import React from "react";
import { Trans } from "../../helpers/translate";
import Amount from "../../helpers/amount";

const ViewGroundserviceDetails = props => {
    return (
        <React.Fragment>
            <div className="card shadow-sm mb-3">
                <div className="card-header">
                    <h5 className="m-0 p-0">
                        {Trans("_groundserviceDetails")}
                    </h5>
                </div>
                <div className="card-body">
                    <ul className="list-unstyled p-0 m-0">
                        <li className="row">
                            <label className="col-lg-3">
                                {Trans("_filtername") + " : "}
                            </label>
                            <b className="col-lg-9">{props.businessObject.name.trim()}</b>
                        </li>
                        <li className="row">
                            <label className="col-lg-3">
                                {Trans("_viewType") + " : "}
                            </label>
                            <b className="col-lg-9">{props.businessObject.amenities[0].name}</b>
                        </li>
                        <li className="row">
                            <label className="col-lg-3">
                                {Trans("_lblAddress") + " : "}
                            </label>
                            <b className="col-lg-9">{props.locationInfo.fromLocation.name !== "" ? props.locationInfo.fromLocation.name : "--"}</b>
                        </li>
                        <li className="row">
                            <label className="col-lg-3">
                                {Trans("_email") + " : "}
                            </label>
                            <b className="col-lg-9">{props.businessObject.contactInformation.workEmail}</b>
                        </li>
                        <li className="row">
                            <label className="col-lg-3">
                                {Trans("_viewPhone") + " : "}
                            </label>
                            <b className="col-lg-9">{props.businessObject.contactInformation.phoneNumber}</b>
                        </li>
                        <li className="row">
                            <label className="col-lg-3">
                                {Trans("_viewOperatorName") + " : "}
                            </label>
                            <b className="col-lg-9">{props.businessObject.vendors.find((x) => x.type === "operator").item.name}</b>
                        </li>

                    </ul>
                </div>
            </div>
            {/* {props.items[0].item.map(item => {
                return <div className="card shadow-sm mb-3">
                    <div className="card-header">
                        <h5 className="m-0 p-0">
                            {item.name}
                        </h5>
                    </div>
                    <div className="card-body">
                        <ul className="list-unstyled p-0 m-0">
                            <li className="row">
                                <label className="col-lg-3">
                                    {Trans("_vehicleCategory") + " : "}
                                </label>
                                <b className="col-lg-9">{item.tpExtension.find(x => x.key === "categoryName").value}</b>
                            </li>
                            <li className="row">
                                <label className="col-lg-3">
                                    {Trans("_vehicleModel") + " : "}
                                </label>
                                <b className="col-lg-9">{item.tpExtension.find(x => x.key === "modelFrom").value} - {item.tpExtension.find(x => x.key === "modelTo").value}</b>
                            </li>
                            <li className="row">
                                <label className="col-lg-3">
                                    {Trans("_vehicleQuantity") + " : "}
                                </label>
                                <b className="col-lg-9">{item.quantity}</b>
                            </li>
                            <li className="row">
                                <label className="col-lg-3">
                                    {Trans("_VehicleNoOfPersion") + " : "}
                                </label>
                                <b className="col-lg-9">{item.availabilityCount}</b>
                            </li>
                            {item.specialRequests && item.specialRequests.find(x => x.categoryName === "additionalServices").specialRequestItems &&
                                <React.Fragment>
                                    <h6>{Trans("_lbladditionalServices")}</h6>
                                    {item.specialRequests && item.specialRequests.find(x => x.categoryName === "additionalServices").specialRequestItems.map((additionalServices, key) => {
                                        return <li className="row">
                                            <label className="col-lg-3">
                                                {additionalServices.name}
                                            </label>
                                            <b className="col-lg-9">
                                                <Amount amount={additionalServices.charges.find(y => y.purpose === "10").amount}></Amount>
                                            </b>
                                        </li>
                                    })}
                                </React.Fragment>
                            }
                        </ul>
                    </div>
                </div>
            })} */}
        </React.Fragment>
    );
};

export default ViewGroundserviceDetails;
