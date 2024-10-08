import React from "react";
import Amount from "../../helpers/amount";
import { Trans } from "../../helpers/translate";
import SVGIcon from "../../helpers/svg-icon";

const ResultItemAirFare = (props) => {
  let priceBrackup = [];
  let tmpPriceBrackup = [];
  if (props.isManual) {
    let baseRate = [{
      title: "Base Price",
      amount: props.fareBreakup.find(x => x.type === "1").item.reduce((sum, item) => { sum += item.displayRateInfo[0].amount; return sum }, 0),
      lable: "Base Price",
    }];
    let tax = [];
    if (props.fareBreakup.find(x => x.type === "7"))
      tax = [{
        title: "Tax",
        amount: Math.trunc(props.fareBreakup.find(x => x.type === "7").item.reduce((sum, item) => sum += item.totalAmount, 0) + 0.001),
        lable: "Tax",
      }];
    let discount = [];
    if (props.fareBreakup.find(x => x.type === "146"))
      discount = [{
        title: "Discount",
        amount: Math.trunc(props.fareBreakup.find(x => x.type === "146").item.reduce((sum, item) => sum += item.totalAmount, 0) + 0.001),
        lable: "Discount",
      }];
    let customTaxRate = [];
    if (props.fareBreakup.find(x => x.type === 'customtax'))
      customTaxRate = props.fareBreakup.find(x => x.type === 'customtax').item[0].displayRateInfo
        .sort((a, b) => (a.purpose > b.purpose) ? 1 : ((b.purpose > a.purpose) ? -1 : 0))
        .map(item => {
          return {
            title: item.description,
            amount: item.amount,
            lable: item.description,
          };
        });
    let totalRate = [{
      title: "Total Price",
      amount: props.fareBreakup.find(x => x.type === '10').item[0].displayRateInfo[0].amount,
      lable: "Total Price",
      isInclusiveTax: props.fareBreakup.find(x => x.type === '10').item[0].displayRateInfo[0].isInclusiveTax,
    }];
    tmpPriceBrackup.push(...baseRate, ...tax, ...customTaxRate, ...discount, ...totalRate);
    tmpPriceBrackup = tmpPriceBrackup.filter(x => x.amount !== 0);
    priceBrackup = tmpPriceBrackup;
  }
  else {
    tmpPriceBrackup = props.fareBreakup.map((cart_inner_Item, cart_inner_index) => {
      return {
        title: cart_inner_Item.item[0].displayRateInfo[0].description,
        itemArr:
          cart_inner_Item.item.map((cart_inner1_Item, cart_inner1_index) => {
            if (cart_inner1_Item.type === "") {
              if (cart_inner1_Item.displayRateInfo.length > 0 && cart_inner1_Item.displayRateInfo[0].purpose > 150 && cart_inner1_Item.displayRateInfo[0].purpose < 165) {
                cart_inner1_Item.displayRateInfo = cart_inner1_Item.displayRateInfo.sort((a, b) => (a.purpose > b.purpose) ? 1 : ((b.purpose > a.purpose) ? -1 : 0));
              }
              return cart_inner1_Item.displayRateInfo.map((cart_inner2_Item, cart_inner2_index) => {
                return {
                  name:
                    Trans("_fareBreakup_" + cart_inner2_Item.description) ===
                      "_fareBreakup_" + cart_inner2_Item.description
                      ? cart_inner2_Item.description
                      : Trans("_fareBreakup_" + cart_inner2_Item.description),
                  amount: cart_inner2_Item.amount,
                  lable: cart_inner2_Item.title,
                  isInclusiveTax: cart_inner2_Item.isInclusiveTax,
                };
              });
            }
            else if (cart_inner1_Item.type === "") {
              if (cart_inner1_Item.displayRateInfo.length > 0 && cart_inner1_Item.displayRateInfo[0].purpose > 150 && cart_inner1_Item.displayRateInfo[0].purpose < 165) {
                cart_inner1_Item.displayRateInfo = cart_inner1_Item.displayRateInfo.sort((a, b) => (a.purpose > b.purpose) ? 1 : ((b.purpose > a.purpose) ? -1 : 0));
              }
              return cart_inner1_Item.displayRateInfo.map((cart_inner2_Item, cart_inner2_index) => {
                return {
                  name:
                    Trans("_fareBreakup_" + cart_inner2_Item.description) ===
                      "_fareBreakup_" + cart_inner2_Item.description
                      ? cart_inner2_Item.description
                      : Trans("_fareBreakup_" + cart_inner2_Item.description),
                  amount: cart_inner2_Item.amount,
                  lable: cart_inner2_Item.title,
                  isInclusiveTax: cart_inner2_Item.isInclusiveTax,
                };
              });
            } else {
              return {
                name:
                  cart_inner1_Item.quantity +
                  " " +
                  (cart_inner1_Item.type === "0"
                    ? Trans("_lblAdult")
                    : cart_inner1_Item.type === "1"
                      ? Trans("_lblChild")
                      : cart_inner1_Item.type === "2"
                        ? Trans("_lblInfant")
                        : "") +
                  " (x " +
                  cart_inner1_Item.displayRateInfo[0].displayAmount +
                  ")",
                amount: cart_inner1_Item.totalAmount,
                lable: cart_inner1_Item.displayRateInfo[0].title,
              };
            }
          }),
      };
    });


    tmpPriceBrackup = tmpPriceBrackup.flat();

    let i = 0;
    while (i < tmpPriceBrackup.length) {
      if (tmpPriceBrackup[i].itemArr[0]) {
        if (Array.isArray(tmpPriceBrackup[i].itemArr[0])) {
          let j = 0;
          while (j < tmpPriceBrackup[i].itemArr[0].length) {
            priceBrackup.push(tmpPriceBrackup[i].itemArr[0][j]);
            j++;
          }
        } else {
          priceBrackup.push(tmpPriceBrackup[i]);
        }
      }
      i++;
    }
  }
  const adult = props.data.paxInfo.find((x) => x.typeString === "ADT");
  const child = props.data.paxInfo.find((x) => x.typeString === "CHD");
  const infant = props.data.paxInfo.find((x) => x.typeString === "INF");

  const businessBadgeClass = (business) => {
    return business === "hotel"
      ? "hotel"
      : business === "activity"
        ? "globe"
        : business === "package"
          ? "gift"
          : business === "air"
            ? "plane"
            : "";
  };
  const cartItem = { data: props.data };
  const getname = () => {
    let name =
      cartItem.data.tripType === "multicity"
        ? cartItem.data.items.reduce((sum, item) => sum + (sum === "" ? "" : ", ") + item.locationInfo.fromLocation.id + " - " + item.locationInfo.toLocation.id, "") :
        cartItem.data.tripType === "roundtrip"
          ? cartItem.data.items[0].locationInfo.fromLocation.id + " - " +
          cartItem.data.items[0].locationInfo.toLocation.id + " - " +
          cartItem.data.items[0].locationInfo.fromLocation.id
          : cartItem.data.items[0].locationInfo.fromLocation.id + " - " +
          cartItem.data.items[0].locationInfo.toLocation.id
      ;
    return name.replaceAll("&amp;", "&").replaceAll("&Amp;", "&");
  };
  return (
    <React.Fragment>
      <h6>
        <span className="text-capitalize badge badge-secondary bg-success pricebreackup-badge">
          <SVGIcon
            name={businessBadgeClass(cartItem.data.business)}
            width="15"
            height="15"
            type="fill"
          ></SVGIcon>{" "}
          {Trans("_widgetTab" + cartItem.data.business)}
        </span>
      </h6>
      <h6>
        <span className=" pb-3 font-weight-bold">{getname()}</span>
      </h6>
      <ul className="list-unstyled p-0 m-0">
        {props.isManual && tmpPriceBrackup && tmpPriceBrackup.filter(x => x.title.toLowerCase() !== "total price").map((item, index) => {
          return <React.Fragment key={index}>
            {item.title !== undefined && (
              <li className="row">
                <label className="col-lg-8">
                  {item.title}
                </label>
                <b className="col-lg-4 text-right">
                  <Amount amount={item.amount}></Amount>
                </b>
              </li>
            )}

          </React.Fragment>
        })}

        {props.isManual && tmpPriceBrackup && tmpPriceBrackup.filter(x => x.title.toLowerCase() === "total price").map((item, index) => {
          return <React.Fragment key={index}>
            {item.title !== undefined && (
              <React.Fragment>
                <hr />
                <li className="row">
                  <label className="col-lg-8">
                    {item.title}
                  </label>
                  <b className="col-lg-4 text-right">
                    <Amount amount={item.amount}></Amount>
                  </b>
                </li>
              </React.Fragment>
            )}
          </React.Fragment>
        })}


        {!props.isManual && priceBrackup.map((item, index) => {
          //Room Wise Loop
          return (
            <React.Fragment key={index}>
              {item.title !== undefined && (
                <li className="row">
                  <strong className="col-lg-12 text-primary">
                    {Trans("_lbl" + item.title.replace(" ", ""))}
                  </strong>
                </li>
              )}
              {item.title !== undefined ? (
                item.itemArr.map((item_inner, index) => {
                  //Room Wise Loop
                  return (
                    <li className="row" key={index}>
                      <label className="col-lg-5 text-nowrap">{item_inner.name}</label>
                      <b className="col-lg-7 text-right text-nowrap">
                        <Amount amount={item_inner.amount}></Amount>
                      </b>
                    </li>
                  );
                })
              ) : (
                <React.Fragment>
                  {item.name.toLowerCase() === "total amount" && (
                    <li className="border-top pb-2"></li>
                  )}
                  <li
                    className={
                      item.name.toLowerCase() === "total amount"
                        ? "row font-weight-bold text-primary"
                        : "row"
                    }
                  >
                    <label className="col-lg-4 text-nowrap">
                      {item.lable !== undefined && item.lable !== ""
                        ? item.lable
                        : Trans("_lbl" + item.name.replace(" ", ""))}
                    </label>
                    <b className="col-lg-8 text-right text-nowrap">
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
              )}
            </React.Fragment>
          );
        })}
      </ul>
    </React.Fragment>
  );
};

export default ResultItemAirFare;
