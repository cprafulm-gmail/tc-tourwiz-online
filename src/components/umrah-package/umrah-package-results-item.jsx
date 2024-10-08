import React, { Component } from "react";
import StarRating from "./../common/star-rating";
import Amenities from "./../common/amenities";
import SVGIcon from "../../helpers/svg-icon";
import UmrahPackageQuickBook from "../results/umrah-package-quick-book";
import { Trans } from "../../helpers/translate";
import HtmlParser from "../../helpers/html-parser";
import ImageNotFoundActivity from "../../assets/images/ImageNotFound-Activity.gif";
import ImageNotFoundPackage from "../../assets/images/ImageNotFound-Package.gif";
import ImageNotFoundTransportation from "../../assets/images/ImageNotFound-Transportation.gif";
import ImageNotFoundGroundservice from "../../assets/images/ImageNotFound-GroundServices.gif";
import ImageNotFoundTransfers from "../../assets/images/ImageNotFound-Transfers.gif";
import ImageNotFoundVehicle from "../../assets/images/ImageNotFound-Vehicle.gif";
import ImageNotFoundHotel from "../../assets/images/ImageNotFound-Hotel.gif";
import * as Global from "../../helpers/global";

class UmrahPackageResultsItem extends Component {
  constructor(props) {
    super(props);
    this.state = { detailPopup: false };
  }

  handleQuickBook = (itemId, mode) => {
    this.setState({ detailPopup: mode });
    this.props.handleQuickBook(itemId);
  };

  getOnErrorImageURL = () => {
    if (this.props.businessName === "hotel") return (ImageNotFoundHotel.toString());
    else if (this.props.businessName === "activity") {
      return ImageNotFoundActivity.toString();
    } else if (this.props.businessName === "package") {
      return ImageNotFoundPackage.toString();
    } else if (this.props.businessName === "transportation") {
      return ImageNotFoundTransportation.toString();
    } else if (this.props.businessName === "groundservice") {
      return ImageNotFoundGroundservice.toString();
    } else if (this.props.businessName === "transfers") {
      return ImageNotFoundTransfers.toString();
    } else if (this.props.businessName === "vehicle") {
      return ImageNotFoundVehicle.toString();
    }
  };

  render() {
    const results = this.props;
    const { showQuickBook, businessName, details, isDetailsResponseLoading } = this.props;
    const { detailPopup } = this.state;
    return (
      <div className="quotation-search-results border-top">
        <div className="row">
          {results.data[0].item.map((item, key) => {
            const stopInfo =
              item.stopInfo.find((x) => x.type === "distanceFromCenter") &&
              item.stopInfo
                .find((x) => x.type === "distanceFromCenter")
                .item.find((y) => y.distance !== "") &&
              item.stopInfo
                .find((x) => x.type === "distanceFromCenter")
                .item.find((y) => y.distance !== "").distance +
              " " +
              item.stopInfo
                .find((x) => x.type === "distanceFromCenter")
                .item.find((y) => y.distance !== "").distanceUnit;
            return (
              <div className="quotation-result-item col-lg-12" key={key}>
                <div className="row no-gutters border-bottom p-3">
                  <div class="col-lg-1 pr-2">
                    <img
                      className="img-fluid"
                      src={
                        businessName === "transportation"
                          ? ImageNotFoundTransportation
                          : item.url ||
                          (item.images.find((x) => x.type === "default") !== undefined &&
                            item.images.find((x) => x.type === "default").url) ||
                          (localStorage.getItem("isUmrahPortal") ? ImageNotFoundHotelUmrah : ImageNotFoundHotel)
                      }
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = this.getOnErrorImageURL();
                      }}
                      alt=""
                      onClick={() => this.handleQuickBook(item.id, true)}
                      style={{ cursor: "pointer" }}
                    />
                  </div>
                  <div className="col-lg-5">
                    <h2
                      onClick={() => this.handleQuickBook(item.id, true)}
                      style={{ cursor: "pointer" }}
                    >
                      <HtmlParser text={item.name} />
                      <span className="ml-2 text-nowrap position-relative" style={{ top: "-2px" }}>
                        <StarRating {...[item.rating]} />
                      </span>
                    </h2>

                    {(businessName === "hotel" || businessName === "activity" || businessName === "Transportation") && (
                      <small className="mr-3 text-secondary">
                        <SVGIcon
                          name="map-marker"
                          width="16"
                          type="fill"
                          height="16"
                          className="mr-2"
                        ></SVGIcon>
                        {item.locationInfo.fromLocation.address ||
                          item.locationInfo.fromLocation.city}
                      </small>
                    )}
                    {stopInfo && (
                      <div className="small mt-2 text-secondary">
                        <SVGIcon name={localStorage.getItem("isUmrahPortal") ? "makkah" : "compass"} className="mr-1"></SVGIcon>
                        {localStorage.getItem("isUmrahPortal") && businessName === "hotel" && this.props.requestObject().Request.CriteriaInfo[0].LocationInfo.FromLocation.ID.split('_')[0] == "SA26" && (stopInfo + " away from Masjid al-Haram")}
                        {localStorage.getItem("isUmrahPortal") && businessName === "hotel" && this.props.requestObject().Request.CriteriaInfo[0].LocationInfo.FromLocation.ID.split('_')[0] == "SA25" && (stopInfo + " away from Masjid-e-Nabawi")}
                        {!localStorage.getItem("isUmrahPortal") && (stopInfo + " from center")}
                      </div>
                    )}
                    {businessName === "transfers" && (
                      <small className="mr-3 text-secondary">
                        {item.description.length > 74 ? (
                          <HtmlParser text={item.description.substring(0, 74) + "..."} />
                        ) : (
                          <HtmlParser text={item.description} />
                        )}
                      </small>
                    )}
                  </div>

                  <div className="col-lg-2 d-flex align-items-center justify-content-start">
                    {businessName === "hotel" && item.amenities && item.amenities.length > 0 && (
                      <Amenities amenities={item.amenities} />
                    )}

                    {item.tpExtension.find((x) => x.key === "duration") !== undefined &&
                      item.tpExtension.find((x) => x.key === "duration").value !== "" ? (
                      <p className="small mt-2">
                        <SVGIcon name="clock" className="mr-2"></SVGIcon>
                        {Trans("_duration")} :{" "}
                        <HtmlParser
                          text={item.tpExtension.find((x) => x.key === "duration").value}
                        />
                      </p>
                    ) : item.tpExtension.find((x) => x.key === "totalduration") !== undefined &&
                      item.tpExtension.find((x) => x.key === "totalduration").value !== "" ? (
                      <p className="small mt-2">
                        <SVGIcon name="clock" className="mr-2"></SVGIcon>
                        {Trans("_duration")} :{" "}
                        <HtmlParser
                          text={item.tpExtension.find((x) => x.key === "totalduration").value}
                        />
                      </p>
                    ) : null}
                  </div>

                  <div className="col-lg-2 d-flex align-items-center justify-content-center">
                    <div>
                    {businessName === "groundservice" ? (
                        <h3
                          className="btn btn-link text-dark p-0"
                          onClick={() => this.props.showPriceFarebreakup(false, item, item.token)}
                        >
                          {item.displayAmount}
                        </h3>
                      ):
                      <h3>{item.displayAmount}</h3>}                      
                      {item.flags.isAmountPerNight ? (
                        <small className="d-block text-secondary text-center">
                          {Trans("_perNight")}
                        </small>
                      ) : (
                        <small className="d-block text-secondary text-center">
                          {businessName === "groundservice" ? "Per person" : Trans("_totalPrice")} 
                        </small>
                      )}
                    </div>
                  </div>

                  <div className="col-lg-2 d-flex align-items-center justify-content-end">
                    <button
                      className="btn btn-sm btn-primary m-0 text-nowrap"
                      onClick={() => this.handleQuickBook(item.id, false)}
                    >
                      {businessName === "hotel" && "Select Rooms"}
                      {(businessName === "activity" || businessName === "transfers") &&
                        "Select Schedule"}
                      {businessName === "transportation" && "Select Transportation"}
                      {businessName === "groundservice" && "Select Ground service"}
                    </button>
                  </div>

                  {showQuickBook === item.id && (
                    <UmrahPackageQuickBook
                      {...item}
                      details={
                        (businessName === "transportation" || businessName === "groundservice")
                          ? {
                            items: [...item.items],
                            token: item.token,
                            id: item.id,
                            policies: item.policies,
                          }
                          : details
                      }
                      itemid={item.id}
                      businessName={businessName}
                      handleCart={this.props.handleCart}
                      isBtnLoading={this.props.isBtnLoading}
                      showRoomTerms={this.props.showRoomTerms}
                      getAminitiesLength={this.props.getAminitiesLength}
                      showPriceFarebreakup={this.props.showPriceFarebreakup}
                      handleShowPolicyPopup={this.props.handleShowPolicyPopup}
                      hideQuickBook={this.props.hideQuickBook}
                      isDetailsResponseLoading={isDetailsResponseLoading}
                      requestObject={this.props.requestObject}
                      type={this.props.type}
                      detailPopup={detailPopup}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

export default UmrahPackageResultsItem;
