import React from "react";
import Amount from "../../helpers/amount";
import ResultItemAirFare from "./price-breakup-air";
import PriceBreakupHotel from "./price-breakup-hotel";
import HtmlParser from "../../helpers/html-parser";
import { Trans } from "../../helpers/translate";
import SVGIcon from "../../helpers/svg-icon";

const PriceBreakup = (props) => {
  const totalAmount = props.displayCharges.find(
    (x) => x.description === "Total"
  ).amount;
  const businessBadgeClass = (business, flags) => {
    business = flags.isCustomBusiness ? "custom" : business;
    return business === "hotel"
      ? "hotel"
      : business === "activity"
        ? "activity"
        : business === "package"
          ? "package"
          : business === "air"
            ? "plane"
            : business === "transportation"
              ? "transportation"
              : business === "transfers"
                ? "transfers"
                : business === "vehicle"
                  ? "vehicle"
                  : business === "groundservice"
                    ? "groundservice"
                    : business === "custom"
                      ? "customnew"
                      : "";

  };
  if (totalAmount === 0)
    return <React.Fragment></React.Fragment>
  else
    return (
      <div className="border bg-white">
        <div className="row">
          <div className="col-12">
            <div className="p-3">
              <h5 className="border-bottom pb-3 mb-3">
                <SVGIcon
                  name="credit-card"
                  width="24"
                  height="24"
                  type="fill"
                  className="mr-2"
                ></SVGIcon>
                {Trans("_priceDetails")}
              </h5>
              {props.items.map((cartItem, cart_index) => {
                if (cartItem.data.amount === 0)
                  return <></>;
                let tmpPriceBrackup = [];
                let priceBrackup = [];
                let IsManualItem = cartItem.data.flags.isManualItem ? true : false;
                const rooms = cartItem.data.items;
                const business = cartItem.data.business;
                const adults = () => {
                  if (business === "hotel") {
                    if (rooms[0].flags["isGroupedRooms"] === "true")
                      return rooms[0].paxInfo[0].item[0].quantity;
                    else {
                      var adultsCount = 0;
                      rooms.map((group) => {
                        group.item.map((room) => {
                          adultsCount += parseInt(
                            room.tpExtension.find((x) => x.key === "adults").value
                          );
                          return true;
                        });
                        return true;
                      });
                      return adultsCount;
                    }
                  } else if (business === "activity") {
                    return rooms[0].item[0].tpExtension.find(x => x.key === "PackageScheduleName")?.value ?? rooms[0].properties.pax.adult + rooms[0].properties.pax.child;
                  } else if (business === "package" && IsManualItem) {
                    return rooms[0].properties.pax.adult;
                  } else if (business === "package" && !IsManualItem) {
                    return rooms[0].properties.pax.adult + rooms[0].properties.pax.child;
                  } else if (business === "transfers") {
                    return rooms[0].item[0].tpExtension.find((x) => x.key === "adultCount")
                      .value;
                  } else return 0;
                };

                const children = () => {
                  if (business === "hotel") {
                    if (rooms[0].flags["isGroupedRooms"] === "true")
                      return rooms[0].paxInfo[0].item[2].quantity;
                    else {
                      var adultsCount = 0;
                      rooms.map((group) => {
                        group.item.map((room) => {
                          adultsCount += parseInt(
                            room.tpExtension.find((x) => x.key === "children").value
                          );
                          return true;
                        });
                        return true;
                      });
                      return adultsCount;
                    }
                  } else if (business === "activity") {
                    return rooms[0].properties.pax.adult + rooms[0].properties.pax.child;
                  } else if (business === "package" && IsManualItem) {
                    return rooms[0].properties.pax.child;
                  } else if (business === "package" && !IsManualItem) {
                    return rooms[0].properties.pax.adult + rooms[0].properties.pax.child;
                  } else return 0;
                };

                const infants = () => {
                  if (business === "package" && IsManualItem) {
                    return rooms[0].properties.pax.infant;
                  } else return 0;
                };
                if (
                  cartItem.data.business !== "air" &&
                  cartItem.data.business !== "hotel"
                ) {
                  tmpPriceBrackup = cartItem.fareBreakup.map(
                    (cart_inner_Item, cart_inner_index) => {
                      return cart_inner_Item.item.map(
                        (cart_inner1_Item, cart_inner1_index) => {
                          if (
                            cart_inner1_Item.type === "" ||
                            cart_inner1_Item.type === "transportation" ||
                            cart_inner1_Item.type === "groundservice" ||
                            cart_inner1_Item.type === "activity" ||
                            cart_inner1_Item.type === "transfers" ||
                            cart_inner1_Item.type === "package" ||
                            cart_inner1_Item.type === "vehicle"
                          ) {
                            if (cart_inner1_Item.displayRateInfo.length > 0 && cart_inner1_Item.displayRateInfo[0].purpose > 150 && cart_inner1_Item.displayRateInfo[0].purpose < 165) {
                              cart_inner1_Item.displayRateInfo = cart_inner1_Item.displayRateInfo.sort((a, b) => (a.purpose > b.purpose) ? 1 : ((b.purpose > a.purpose) ? -1 : 0));
                            }
                            return cart_inner1_Item.displayRateInfo.map(
                              (cart_inner2_Item, cart_inner2_index) => {
                                return {
                                  name: Trans("_fareBreakup_" + cart_inner2_Item.description) === "_fareBreakup_" + cart_inner2_Item.description ? cart_inner2_Item.description : Trans("_fareBreakup_" + cart_inner2_Item.description),
                                  amount: cart_inner2_Item.amount,
                                  label:
                                    cart_inner2_Item.title !== undefined &&
                                      cart_inner2_Item.title !== ""
                                      ? (localStorage.getItem("isUmrahPortal") && cart_inner2_Item.title === "VAT" ? "Tax & VAT" : cart_inner2_Item.title)
                                      : undefined,
                                  isInclusiveTax: cart_inner2_Item.isInclusiveTax,
                                };
                              }
                            );
                          } else {
                            return {
                              name: cart_inner1_Item.type,
                              count: cart_inner1_Item.quantity,
                              amount: cart_inner1_Item.totalAmount,
                              label:
                                cart_inner1_Item.item[0].displayRateInfo[0]
                                  .title !== undefined &&
                                  cart_inner1_Item.item[0].displayRateInfo[0]
                                    .title !== ""
                                  ? cart_inner1_Item.item[0].displayRateInfo[0]
                                    .title
                                  : undefined,
                            };
                          }
                        }
                      );
                    }
                  );
                  tmpPriceBrackup = tmpPriceBrackup.flat();
                  priceBrackup = [];
                  let i = 0;
                  while (i < tmpPriceBrackup.length) {
                    if (
                      priceBrackup.length > 0 &&
                      priceBrackup.find((x) => x.name === tmpPriceBrackup[i].name)
                    ) {
                      priceBrackup.find(
                        (x) => x.name === tmpPriceBrackup[i].name
                      ).count += priceBrackup.find(
                        (x) => x.name === tmpPriceBrackup[i].name
                      ).count;
                      priceBrackup.find(
                        (x) => x.name === tmpPriceBrackup[i].name
                      ).amount += tmpPriceBrackup[i].amount;
                    } else {
                      if (Array.isArray(tmpPriceBrackup[i])) {
                        let j = 0;
                        while (j < tmpPriceBrackup[i].length) {
                          priceBrackup.push(tmpPriceBrackup[i][j]);
                          j++;
                        }
                      } else {
                        priceBrackup.push(tmpPriceBrackup[i]);
                      }
                    }
                    i++;
                  }
                }
                //Business/item Wise Loop
                return cartItem.data.business === "air" ? (
                  <ResultItemAirFare key={cart_index} {...cartItem} totalamount={cartItem.data.amount} isManual={cartItem.data.config.filter(x => x.key === "isOfflineItinerary").length > 0 && cartItem.data.config.filter(x => x.key === "isOfflineItinerary")[0].value === "true" ? true : false} />
                ) : cartItem.data.business === "hotel" ? (
                  <PriceBreakupHotel key={cart_index} {...cartItem} />
                ) : (
                  <React.Fragment key={cart_index}>
                    { }
                    <h6>
                      <span className="text-capitalize badge badge-secondary bg-success pricebreackup-badge">
                        <SVGIcon
                          name={businessBadgeClass(cartItem.data.business, cartItem.data.flags)}
                          type="fill"
                        ></SVGIcon>{" "}
                        {cartItem.data.flags.isCustomBusiness ? "Custom" : Trans("_widgetTab" + cartItem.data.business)}
                      </span>
                    </h6>
                    <h6>
                      <span className=" pb-3 font-weight-bold">
                        <HtmlParser text={cartItem.data.name} />
                      </span>
                    </h6>
                    <ul className="list-unstyled p-0 m-0">
                      {priceBrackup.filter(x => x.amount !== 0).map((item, index) => {
                        //Room Wise Loop
                        return (
                          <React.Fragment key={index}>
                            {item.name === "Total Amount" && <hr></hr>}
                            <li className="row">
                              {item.name === "Base Rate" && IsManualItem && cartItem.data.business === "package" ?
                                <label className="col-lg-8">
                                  <HtmlParser
                                    text={Trans(
                                      "_lbl" + item.name.replace(" ", "")
                                    )}
                                  />
                                  <br />
                                  Adults <b>{adults()}</b>{","}<br />Children <b>{children()}</b>{","}<br />Infant <b>{infants()}</b>
                                </label>
                                : <label className="col-lg-8">
                                  {item.label !== undefined ? (
                                    <HtmlParser text={item.label} />
                                  ) : (
                                    <HtmlParser
                                      text={Trans(
                                        "_lbl" + item.name.replace(" ", "")
                                      )}
                                    />
                                  )}{" "}
                                  {item.count !== undefined && "X " + item.count}
                                </label>
                              }

                              <b className="col-lg-4 text-right">
                                <Amount amount={item.amount}></Amount>
                              </b>
                            </li>
                            {item.isInclusiveTax &&
                              <li className="row mb-2">
                                <small className="col-lg-12">
                                  *** Total price inclusive of all taxes
                                </small>
                              </li>
                            }
                          </React.Fragment>
                        );
                      })}
                    </ul>
                  </React.Fragment>
                );
              })}
              <ul className="list-unstyled p-0 m-0">
                {props.displayCharges.find((x) => x.description === "UmrahVisaFee")
                  && props.displayCharges.find((x) => x.description === "UmrahVisaFee").amount > 0
                  &&
                  <li className="row border-top pt-3 font-weight-bold text-primary">
                    <label className="col-lg-5">{Trans("_mutamerVisaFee")}</label>
                    <b className="col-lg-7 text-right">
                      <Amount amount={props.displayCharges.find((x) => x.description === "UmrahVisaFee").amount}></Amount>
                    </b>
                  </li>
                }
                {totalAmount > 0 &&
                  <li className="row border-top pt-3 font-weight-bold text-primary">
                    <label className="col-lg-5">{Trans("_grandTotal")}</label>
                    <b className="col-lg-7 text-right">
                      <Amount amount={totalAmount}></Amount>
                    </b>
                  </li>}
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
};

export default PriceBreakup;
