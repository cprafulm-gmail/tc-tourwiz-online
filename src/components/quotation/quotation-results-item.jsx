import React, { Component } from "react";
import StarRating from "./../common/star-rating";
import Amenities from "./../common/amenities";
import SVGIcon from "../../helpers/svg-icon";
import QuotationQuickBook from "../results/quotation-quick-book";
import { Trans } from "../../helpers/translate";
import HtmlParser from "../../helpers/html-parser";
import { Button } from "react-scroll";

class QuotationResultsItem extends Component {
  constructor(props) {
    super(props);
    this.state = { detailPopup: false };
  }

  handleQuickBook = (itemId, mode) => {
    this.setState({ detailPopup: mode });
    this.props.handleQuickBook(itemId);
  };

  render() {
    const results = this.props;
    const {
      showQuickBook,
      businessName,
      details,
      isDetailsResponseLoading,
    } = this.props;
    const { detailPopup } = this.state;

    return (
      <div className="quotation-search-results border-top">
        <div className="row">
          {results.data[0].item.map((item, key) => {
            return (
              <div className="quotation-result-item col-lg-12" key={key}>
                <div className="row no-gutters border-bottom p-3">
                  <div className="col-lg-6">
                    <h2
                      onClick={() => this.handleQuickBook(item.id, true)}
                      style={{ cursor: "pointer" }}
                    >
                      <HtmlParser text={item.name} />
                      <span
                        className="ml-2 text-nowrap position-relative"
                        style={{ top: "-2px" }}
                      >
                        <StarRating {...[item.rating]} />
                      </span>
                    </h2>

                    {(businessName === "hotel" ||
                      businessName === "activity") && (
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

                    {businessName === "transfers" && (
                      <small className="mr-3 text-secondary">
                        {item.description.length > 74 ? (
                          <HtmlParser
                            text={item.description.substring(0, 74) + "..."}
                          />
                        ) : (
                          <HtmlParser text={item.description} />
                        )}
                      </small>
                    )}
                  </div>

                  <div className="col-lg-2 d-flex align-items-center justify-content-start">
                    {businessName === "hotel" &&
                      item.amenities &&
                      item.amenities.length > 0 && (
                        <Amenities amenities={item.amenities} />
                      )}

                    {item.tpExtension.find((x) => x.key === "duration") !==
                      undefined &&
                    item.tpExtension.find((x) => x.key === "duration").value !==
                      "" ? (
                      <p className="small mt-2">
                        <SVGIcon name="clock" className="mr-2"></SVGIcon>
                        {Trans("_duration")} :{" "}
                        <HtmlParser
                          text={
                            item.tpExtension.find((x) => x.key === "duration")
                              .value
                          }
                        />
                      </p>
                    ) : item.tpExtension.find(
                        (x) => x.key === "totalduration"
                      ) !== undefined &&
                      item.tpExtension.find((x) => x.key === "totalduration")
                        .value !== "" ? (
                      <p className="small mt-2">
                        <SVGIcon name="clock" className="mr-2"></SVGIcon>
                        {Trans("_duration")} :{" "}
                        <HtmlParser
                          text={
                            item.tpExtension.find(
                              (x) => x.key === "totalduration"
                            ).value
                          }
                        />
                      </p>
                    ) : null}
                  </div>

                  <div className="col-lg-2 d-flex align-items-center justify-content-center">
                    <div className="d-none">
                      <h3>{item.displayAmount}</h3>
                      {item.flags.isAmountPerNight ? (
                        <small className="d-block text-secondary text-center">
                          {Trans("_perNight")}
                        </small>
                      ) : (
                        <small className="d-block text-secondary text-center">
                          {Trans("_totalPrice")}
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
                      {(businessName === "activity" ||
                        businessName === "transfers") &&
                        "Select Schedule"}
                    </button>
                  </div>

                  {showQuickBook === item.id && (
                    <QuotationQuickBook
                      {...item}
                      details={details}
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

export default QuotationResultsItem;
