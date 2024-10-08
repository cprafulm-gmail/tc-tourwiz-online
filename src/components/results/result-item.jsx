import React from "react";
import StarRating from "../common/star-rating";
import HtmlParser from "../../helpers/html-parser";
import ImageNotFoundHotel from "../../assets/images/ImageNotFound-Hotel.gif";
import Amenities from "../common/amenities";
import QuickBook from "./quick-book";
import { Trans } from "../../helpers/translate";
import ImageNotFoundActivity from "../../assets/images/ImageNotFound-Activity.gif";
import ImageNotFoundPackage from "../../assets/images/ImageNotFound-Package.gif";
import ImageNotFoundTransportation from "../../assets/images/ImageNotFound-Transportation.gif";
import ImageNotFoundGroundservice from "../../assets/images/ImageNotFound-GroundServices.gif";
import ImageNotFoundTransfers from "../../assets/images/ImageNotFound-Transfers.gif";
import ImageNotFoundVehicle from "../../assets/images/ImageNotFound-Vehicle.gif";
import TripAdvisorRating from "../common/trip-advisor-rating";
import SVGIcon from "../../helpers/svg-icon";
import * as Global from "../../helpers/global";
import Advertisement from "./result-advertisement";
import Amount from "../../helpers/amount";

const ResultItem = (props) => {
  let code = "default";
  const businessName = props.businessName;
  const view = props.currentView;
  const showQuickBook = props.showQuickBook;
  const details = props.details;
  let t1 = props.t1;
  let t2 = performance.now();
  const isCRSRoomSelectionFlowEnable = Global.getEnvironmetKeyValue("IsCRSRoomSelectionFlowEnable", "cobrand") ? true : false;
  let isQuickBook =
    (businessName === "transportation" || businessName === "vehicle" || businessName === "groundservice")
      ? true
      : Global.getEnvironmetKeyValue("IsAllowQuickBook", "cobrand");
  isQuickBook = isCRSRoomSelectionFlowEnable === true && businessName === "package" ? false : isQuickBook;
  let isWishList =
    Global.getEnvironmetKeyValue("EnableWishList", "cobrand") === "true" ? true : false;

  let HideSupplierName = (Global.getEnvironmetKeyValue("HideSupplierName", "cobrand") && Global.getEnvironmetKeyValue("HideSupplierName", "cobrand") === "true") ? false : true;

  let DoNotShowNonRefundableText = Global.getEnvironmetKeyValue("DoNotShowNonRefundableText", "cobrand") === "true" ? true : false;

  let ShowSupplierWisePrice = Global.getEnvironmetKeyValue("ShowSupplierWisePrice", "cobrand") === "true" ? true : false;

  let wishList = props.wishList;
  const advt = props.data.find((x) => x.code === "advertisement");
  const getOnErrorImageURL = () => {
    if (props.businessName === "hotel") return (ImageNotFoundHotel.toString());
    else if (props.businessName === "activity") {
      return ImageNotFoundActivity.toString();
    } else if (props.businessName === "package") {
      return ImageNotFoundPackage.toString();
    } else if (props.businessName === "transportation") {
      return ImageNotFoundTransportation.toString();
    } else if (props.businessName === "groundservice") {
      return ImageNotFoundGroundservice.toString();
    } else if (props.businessName === "transfers") {
      return ImageNotFoundTransfers.toString();
    } else if (props.businessName === "vehicle") {
      return ImageNotFoundVehicle.toString();
    }
  };
  return (

    props.data !== undefined && (
      <div className={"search-results search-results-" + businessName}>
        {advt && <Advertisement {...advt} />}
        <div className="row">
          {props.data.find((x) => x.code === code).item.length === 0 ? (
            <h6 className="ml-3">{Trans("_no" + props.businessName + "Found")}</h6>
          ) : null}
          {props.data
            .find((x) => x.code === code)
            .item.map((item, key) => {
              const transportationCategory = businessName === "transportation" && item.items.flatMap((items) => {
                return items.item.flatMap(item => {
                  return item.tpExtension.find((x) => x.key === "categoryName").value
                });
              })
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
                <div
                  className={
                    view === "listview" ? "result-item col-lg-12" : "result-item col-lg-4 mb-3"
                  }
                  key={key}
                  name={"item" + (props.businessName === "vehicle" ? item.token : item.id)}
                >
                  <div
                    className={
                      view === "listview"
                        ? "row no-gutters border shadow-sm mb-3"
                        : "row no-gutters border shadow-sm h-100"
                    }
                  >
                    <div className={view === "listview" ? "col-lg-3 p-0" : "col-lg-12 p-0"}>
                      {businessName !== "vehicle" && businessName !== "groundservice" && (
                        <img
                          className="img-fluid"
                          src={
                            businessName === "transportation"
                              ? ImageNotFoundTransportation
                              : item.url ||
                              (item.images.find((x) => x.type === "default") !== undefined &&
                                item.images.find((x) => x.type === "default").url) ||
                              (ImageNotFoundHotel)
                          }
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = getOnErrorImageURL();
                          }}
                          alt=""
                          onClick={() =>
                            props.redirectToDetail(
                              props.urlPath,
                              item.id,
                              item.vendors[0].item.provider,
                              item,
                              true
                            )
                          }
                          style={{ cursor: "pointer" }}
                        />
                      )}
                      {businessName === "groundservice" && (
                        <img
                          className="img-fluid"
                          style={businessName === "groundservice" ? { "object-fit": "scale-down" } : {}}
                          src={
                            businessName === "transportation"
                              ? ImageNotFoundTransportation
                              : item.url ||
                              (item.images.find((x) => x.type === "default") !== undefined &&
                                item.images.find((x) => x.type === "default").url) ||
                              (ImageNotFoundHotel)
                          }
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = getOnErrorImageURL();
                          }}
                          alt=""
                        />
                      )}
                      {businessName === "vehicle" && (
                        <img
                          className="img-fluid"
                          style={businessName === "groundservice" ? { "object-fit": "scale-down" } : {}}
                          src={
                            businessName === "transportation"
                              ? ImageNotFoundTransportation
                              : item.url
                          }
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = getOnErrorImageURL();
                          }}
                          alt=""
                        />
                      )}
                      {businessName === "vehicle" && (
                        <img className="" src={item.vendors[0].item.url} alt="" />
                      )}
                      {item.hasSpecialDeal ? (
                        <div className="ribbons">{Trans("_HotDeals")}</div>
                      ) : null}
                    </div>
                    <div className={view === "listview" ? "col-lg-6 p-3" : "col-lg-12 p-3"}>
                      {businessName === "transportation" || businessName === "vehicle" || businessName === "groundservice" ? (
                        <h2 style={{ cursor: "pointer" }}>
                          <HtmlParser text={item.name} />
                        </h2>
                      ) : (
                        <h2
                          onClick={() =>
                            props.redirectToDetail(
                              props.urlPath,
                              item.id,
                              item.vendors[0].item.provider,
                              item,
                              true
                            )
                          }
                          style={{ cursor: "pointer" }}
                        >
                          <HtmlParser text={item.name} />
                        </h2>
                      )}
                      {businessName !== "vehicle" && (
                        <span className="star-rating">
                          <StarRating {...[item.rating]} />
                        </span>
                      )}
                      {item.ratingInfo && item.ratingInfo.find((x) => x.type === "tripAdvisor") && (
                        <span className="tripadvisor-rating ml-3">
                          <TripAdvisorRating rating={item.ratingInfo} />
                        </span>
                      )}
                      {stopInfo && (
                        <span className="small ml-3 text-secondary">
                          <SVGIcon name={localStorage.getItem("isUmrahPortal") ? "makkah" : "compass"} className="mr-1"></SVGIcon>
                          {localStorage.getItem("isUmrahPortal") && props.searchParam.params.locationID == "SA26" && (stopInfo + " away from Masjid al-Haram")}
                          {localStorage.getItem("isUmrahPortal") && props.searchParam.params.locationID == "SA25" && (stopInfo + " away from Masjid-e-Nabawi")}
                          {!localStorage.getItem("isUmrahPortal") && (stopInfo + " from center")}
                        </span>
                      )}

                      {businessName === "hotel" ? (
                        props.businessName === "hotel" &&
                          item.locationInfo.fromLocation.latitude !== undefined &&
                          item.locationInfo.fromLocation.latitude !== "" &&
                          item.locationInfo.fromLocation.longitude !== undefined &&
                          item.locationInfo.fromLocation.longitude !== "" &&
                          item.locationInfo.fromLocation.address !== undefined &&
                          item.locationInfo.fromLocation.address !== "" ? (
                          <p className="small mt-2">
                            <button
                              title={Trans("_mapView")}
                              className="btn btn-link p-0 btn btn-link text-dark text-left"
                              onClick={() => props.mapByItem("mapview", item)}
                            >
                              <p className="small m-0">
                                <SVGIcon
                                  name="map-marker"
                                  width="16"
                                  type="fill"
                                  height="16"
                                  className="mr-2"
                                ></SVGIcon>
                                <HtmlParser text={item.locationInfo.fromLocation.address} />
                              </p>
                            </button>
                          </p>
                        ) : (
                          item.locationInfo.fromLocation.address !== undefined &&
                            item.locationInfo.fromLocation.address !== "" ? (
                            <p className="small mt-2">
                              <SVGIcon
                                name="map-marker"
                                width="16"
                                type="fill"
                                height="16"
                                className="mr-2"
                              ></SVGIcon>{" "}
                              <HtmlParser text={item.locationInfo.fromLocation.address} />
                            </p>
                          )
                            : null
                        )
                      ) : (
                        <React.Fragment>
                          {businessName !== "vehicle" &&
                            item.locationInfo !== undefined &&
                            item.locationInfo.fromLocation.address !== undefined &&
                            item.locationInfo.fromLocation.address !== "" ? (
                            <p className="small mt-2">
                              <SVGIcon
                                name="map-marker"
                                width="16"
                                type="fill"
                                height="16"
                                className="mr-2"
                              ></SVGIcon>

                              <HtmlParser text={item.locationInfo.fromLocation.address} />
                            </p>
                          ) : null}

                          {businessName == "vehicle" &&
                            item.category !== undefined &&
                            item.category !== "" ? (
                            <p className="small mt-2">
                              {Trans("_category") + " "}
                              <HtmlParser text={item.category} />
                            </p>
                          ) : null}

                          {businessName == "vehicle" && (
                            <div>
                              <div>
                                <ul>
                                  {item.tpExtension.find((x) => x.key === "passengerQuantity") !==
                                    undefined && (
                                      <li title="Passenger quantity">
                                        <i className="fa fa-user mr-2" aria-hidden="true"></i>
                                        <span>
                                          x
                                          {
                                            item.tpExtension.find(
                                              (x) => x.key === "passengerQuantity"
                                            ).value
                                          }
                                        </span>
                                      </li>
                                    )}
                                  {item.tpExtension.find((x) => x.key === "doorCount") !==
                                    undefined && (
                                      <li title="Doors quantity">
                                        <i className="fa fa-user mr-2" aria-hidden="true"></i>
                                        <span>
                                          x{item.tpExtension.find((x) => x.key === "doorCount").value}
                                        </span>
                                      </li>
                                    )}
                                  {item.flags.isAirConditionAvailable !== undefined &&
                                    item.flags.isAirConditionAvailable === true && (
                                      <li title="Air Conditioning">
                                        <i className="fa fa-user mr-2" aria-hidden="true"></i>
                                        <span>{Trans("_yes")}</span>
                                      </li>
                                    )}
                                  {item.flags.isAirConditionAvailable !== undefined &&
                                    item.flags.isAirConditionAvailable === false && (
                                      <li title="Air Conditioning">
                                        <i className="fa fa-user mr-2" aria-hidden="true"></i>
                                        <span>{Trans("_no")}</span>
                                      </li>
                                    )}
                                  {item.tpExtension.find((x) => x.key === "transmissionType") !==
                                    undefined && (
                                      <li
                                        title={
                                          item.tpExtension.find((x) => x.key === "transmissionType")
                                            .value + " Transmission"
                                        }
                                      >
                                        <i className="fa fa-user mr-2" aria-hidden="true"></i>
                                        <span>
                                          {
                                            item.tpExtension.find((x) => x.key === "transmissionType")
                                              .value
                                          }
                                        </span>
                                      </li>
                                    )}
                                  {item.tpExtension.find((x) => x.key === "baggageQuantity") !==
                                    undefined && (
                                      <li title="Baggage Quantity">
                                        <i className="fa fa-suitcase mr-2" aria-hidden="true"></i>
                                        <span>
                                          {
                                            item.tpExtension.find((x) => x.key === "baggageQuantity")
                                              .value
                                          }
                                        </span>
                                      </li>
                                    )}
                                </ul>
                              </div>
                              <div>
                                <ul>
                                  {item.pickupTypes !== undefined && (
                                    <li title={Trans(item.pickupTypes[0].id + "Desc")}>
                                      <i className="fa fa-check-square mr-2" aria-hidden="true"></i>
                                      <span>{Trans(item.pickupTypes[0].id + "Desc")}</span>
                                    </li>
                                  )}
                                  {item.flags.freeCancellation !== undefined &&
                                    item.flags.freeCancellation === true && (
                                      <li
                                        title={Trans("FreeCancellation").replace(
                                          "##CancellationDay##",
                                          item.cancellationPeriod
                                        )}
                                      >
                                        <i
                                          className="fa fa-check-square mr-2"
                                          aria-hidden="true"
                                        ></i>
                                        <span>{Trans("FreeCancellationLabel")}</span>
                                      </li>
                                    )}
                                  {item.flags.freeAmendment !== undefined &&
                                    item.flags.freeAmendment === true && (
                                      <li title={Trans("FreeAmendment")}>
                                        <i
                                          className="fa fa-check-square mr-2"
                                          aria-hidden="true"
                                        ></i>
                                        <span>{Trans("FreeAmendmentLabel")}</span>
                                      </li>
                                    )}
                                  {item.flags.unlimitedMileage !== undefined &&
                                    item.flags.unlimitedMileage === true && (
                                      <li title={Trans("MileageLabel")}>
                                        <i
                                          className="fa fa-check-square mr-2"
                                          aria-hidden="true"
                                        ></i>
                                        <span>{Trans("FreeMileageLabel")}</span>
                                      </li>
                                    )}
                                  {item.flags.FuelType !== undefined &&
                                    item.flags.FuelType === "petrol" && (
                                      <li title={Trans("DieselVehLabel")}>
                                        <i
                                          className="fa fa-check-square mr-2"
                                          aria-hidden="true"
                                        ></i>
                                        <span>{Trans("DieselVehLabel")}</span>
                                      </li>
                                    )}
                                  {item.policies.find((x) => x.type === "FuelPolicy") !==
                                    undefined && (
                                      <li
                                        title={Trans(
                                          item.policies.find((x) => x.type === "FuelPolicy").id +
                                          "Desc"
                                        )}
                                      >
                                        <i className="fa fa-check-square mr-2" aria-hidden="true"></i>
                                        <span>
                                          {Trans(
                                            item.policies.find((x) => x.type === "FuelPolicy").id
                                          )}
                                        </span>
                                      </li>
                                    )}
                                  {item.features.map((item) => {
                                    return (
                                      <li title={Trans(item.id)}>
                                        <i
                                          className="fa fa-check-square mr-2"
                                          aria-hidden="true"
                                        ></i>
                                        <span>{Trans(item.id)}</span>
                                      </li>
                                    );
                                  })}

                                  <li>
                                    <button
                                      className="btn btn-link text-secondary p-0"
                                      onClick={() => props.showRentalConditions(item.token)}
                                    >
                                      {Trans("RentalConditionslabel")}
                                    </button>
                                  </li>
                                </ul>
                              </div>
                            </div>
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
                          ) : item.tpExtension.find((x) => x.key === "totalduration") !==
                            undefined &&
                            item.tpExtension.find((x) => x.key === "totalduration").value !== "" ? (
                            <p className="small mt-2">
                              <SVGIcon name="clock" className="mr-2"></SVGIcon>
                              {Trans("_duration")} :{" "}
                              <HtmlParser
                                text={item.tpExtension.find((x) => x.key === "totalduration").value}
                              />
                            </p>
                          ) : null}

                          {transportationCategory &&
                            <p class="text-secondary mt-3 mb-0">
                              {Trans("_category") + " "}
                              {[...new Set(transportationCategory)].toString().replaceAll(',', ', ')}</p>
                          }
                          {businessName === "groundservice" && item.description && (
                            <p className="text-secondary mt-3 mb-0">
                              {item.description.length > 110 ? (
                                <React.Fragment>
                                  <HtmlParser text={(Trans("_Description") + " " + item.description.substring(0, 110) + "...")} />
                                  <button
                                    className="btn btn-link pull-right text-primary"
                                    onClick={() =>
                                      props.showmoredetailspopup(item.name, item.description)
                                    }
                                  >
                                    {Trans("_morelabel")}
                                  </button>
                                </React.Fragment>
                              ) : (
                                <HtmlParser text={item.description} />
                              )}
                            </p>
                          )}
                          {(businessName !== "vehicle" && businessName !== "groundservice") && item.description && (
                            <p className="text-secondary mt-3 mb-0">
                              {item.description.length > 110 ? (
                                <HtmlParser text={item.description.substring(0, 110) + "..."} />
                              ) : (
                                <HtmlParser text={item.description} />
                              )}
                            </p>
                          )}
                        </React.Fragment>
                      )}
                      {props.businessName === "hotel" &&
                        item.amenities &&
                        item.amenities.length > 0 && <Amenities amenities={item.amenities} />}
                      {item.mealTypes && item.mealTypes.length > 0 && (
                        <div className="meal-type mt-2">
                          {item.mealTypes.slice(0, 3).map((meal, mealKey) => {
                            return (
                              <span
                                className="badge badge-light border p-1 pl-2 pr-2 mr-2 mb-2 font-weight-normal text-primary"
                                key={mealKey}
                              >
                                {meal.name}
                              </span>
                            );
                          })}
                        </div>
                      )}
                    </div>
                    <div
                      className={
                        view === "listview"
                          ? "col-lg-3 p-3 text-center border-left bg-light"
                          : "col-lg-12 p-3 text-center border-top bg-light"
                      }
                    >
                      {(businessName === "vehicle" || businessName === "groundservice") && (
                        <h3
                          className="btn btn-link text-secondary p-0"
                          onClick={
                            Global.getEnvironmetKeyValue("portalType").toLowerCase() !== "b2c" &&
                            (() => props.showPriceFarebreakup(false, item, item.token))
                          }
                        >
                          {item.displayAmount}
                        </h3>
                      )}
                      {(businessName !== "vehicle" && businessName !== "groundservice") && <h3>{item.displayAmount}</h3>}
                      {item.flags.isAmountPerNight ? (
                        <p className="small text-secondary">{businessName === "hotel" ? Trans("_perNight") : Trans("_perNight")}</p>
                      ) : (
                        <p className="small text-secondary">{businessName === "groundservice" ? "Per person" : businessName === "hotel" ? Trans("_totalPrice") : Trans("_totalPrice")}</p>
                      )}

                      {isQuickBook ? (
                        <React.Fragment>
                          {view !== "gridview" && (
                            <div>
                              <button
                                onClick={() =>
                                  props.handleQuickBook(
                                    props.businessName === "vehicle" ? item.token : item.id,
                                    item
                                  )
                                }
                                className="btn btn-primary"
                              >
                                {businessName !== "vehicle"
                                  ? (localStorage.getItem("ssotoken") !== null ? Trans("_viewDetails") : Trans("_bookNow"))
                                  : Trans("SelectCarlabel")}
                              </button>
                            </div>
                          )}
                          {businessName !== "vehicle" && businessName !== "transportation" && businessName !== "groundservice" && (
                            <button
                              className="btn btn-sm btn-outline-primary mt-2"
                              onClick={() =>
                                props.redirectToDetail(
                                  props.urlPath,
                                  item.id,
                                  item.vendors[0].item.provider,
                                  item
                                )
                              }
                            >
                              {Trans("_viewDetails")}
                            </button>
                          )}
                        </React.Fragment>
                      ) : (
                        <button
                          className="btn btn-primary mt-2"
                          onClick={() =>
                            props.redirectToDetail(
                              props.urlPath,
                              item.id,
                              item.vendors[0].item.provider,
                              item
                            )
                          }
                        >
                          {localStorage.getItem("ssotoken") !== null ? Trans("_viewDetails") : Trans("_bookNow")}
                        </button>
                      )}

                      {businessName === "vehicle" && (
                        <button
                          className="btn btn-link text-secondary p-0"
                          onClick={() => props.showVehicletermsCondition(item.token)}
                        >
                          {Trans("_jumpToTermsAndConditions")}
                        </button>
                      )}

                      {!DoNotShowNonRefundableText && item.flags && item.flags.isAtleastOneRefundable && (
                        <small className="d-block mt-2">{Trans("_refundable")}</small>
                      )}

                      {isWishList && businessName !== "vehicle" && (
                        <button
                          className="btn btn-sm btn-link text-primary w-100"
                          onClick={() => props.addToWishList(item)}
                        >
                          {wishList.find((e) => e.id === item.id)
                            ? Trans("_removeFromWishList")
                            : Trans("_addToWishList")}
                        </button>
                      )}

                      {isWishList && businessName === "vehicle" && (
                        <button
                          className="btn btn-sm btn-link text-primary w-100"
                          onClick={() => props.addToWishList(item)}
                        >
                          {wishList.find((e) => e.token === item.token)
                            ? Trans("_removeFromWishList")
                            : Trans("_addToWishList")}
                        </button>
                      )}

                      {HideSupplierName && item.tpExtension.find((x) => x.key === "providername") !== undefined &&
                        item.tpExtension.find((x) => x.key === "providername").value !== "" && (
                          <small className="d-block mt-2">
                            {item.tpExtension.find((x) => x.key === "providername").value}
                          </small>
                        )}
                    </div>

                    {view !== "gridview" &&
                      showQuickBook === (businessName === "vehicle" ? item.token : item.id) && (
                        <div className="col-12 p-3 border-top">
                          <div className="row">
                            <div className="col-lg-12">
                              <QuickBook
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
                                businessName={businessName}
                                handleCart={props.handleCart}
                                isBtnLoading={props.isBtnLoading}
                                showRoomTerms={props.showRoomTerms}
                                getAminitiesLength={props.getAminitiesLength}
                                showPriceFarebreakup={props.showPriceFarebreakup}
                                handleShowPolicyPopup={props.handleShowPolicyPopup}
                                itemid={item.id}
                                hideQuickBook={props.hideQuickBook}
                                isDetailsResponseLoading={props.isDetailsResponseLoading}
                                requestObject={props.requestObject}
                              />
                            </div>
                          </div>
                        </div>
                      )}
                  </div>
                </div>
              );
            })}
        </div>
        {/* <div className="notification-box">
          <small className="text-white">
            {Trans("_renderingTime") + " : "} {parseInt(t2 - t1)} ms
          </small>
        </div> */}
      </div>
    )
  );
};

export default ResultItem;
