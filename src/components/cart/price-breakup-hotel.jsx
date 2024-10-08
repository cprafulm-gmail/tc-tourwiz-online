import React from "react";
import Amount from "../../helpers/amount";
import HtmlParser from "../../helpers/html-parser";
import SVGIcon from "../../helpers/svg-icon";
import { Trans } from "../../helpers/translate";

const PriceBreakupHotel = (props) => {
  const businessBadgeClass = (business) => {
    return business === "hotel" ? "hotel" : "";
  };

  let tmpPriceBrackup = props.fareBreakup.map((cart_inner_Item, cart_inner_index) => {
    return cart_inner_Item.item.map((cart_inner1_Item, cart_inner1_index) => {
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
            isInclusiveTax: cart_inner2_Item.isInclusiveTax,
          };
        });
      } else {
        return {
          name: cart_inner1_Item.type,
          count: cart_inner1_Item.quantity,
          amount: cart_inner1_Item.totalAmount,
        };
      }
    });
  });
  tmpPriceBrackup = tmpPriceBrackup.flat();
  if (props.data.flags.isManualItem) {
    let roomName = tmpPriceBrackup.filter(x => x.count).map((item) => { return " " + item.name }).toString();
    let roomAmount = tmpPriceBrackup.filter(x => x.count).reduce((sum, item) => sum + item.amount, 0);
    tmpPriceBrackup = tmpPriceBrackup.filter(x => !x.count);
    tmpPriceBrackup.unshift([{ "name": roomName, "amount": roomAmount }])
  }
  let priceBrackup = [];
  let i = 0;
  while (i < tmpPriceBrackup.length) {
    if (priceBrackup.length > 0 && priceBrackup.find((x) => x.name === tmpPriceBrackup[i].name)) {
      priceBrackup.find((x) => x.name === tmpPriceBrackup[i].name).count += priceBrackup.find(
        (x) => x.name === tmpPriceBrackup[i].name
      ).count;
      priceBrackup.find((x) => x.name === tmpPriceBrackup[i].name).amount +=
        tmpPriceBrackup[i].amount;
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

  return (
    <React.Fragment>
      <h6>
        <span className="text-capitalize badge badge-secondary bg-success pricebreackup-badge">
          <SVGIcon name={businessBadgeClass(props.data.business)} type="fill"></SVGIcon>{" "}
          {Trans("_widgetTab" + props.data.business)}
        </span>
      </h6>
      <h6>
        <span className=" pb-3 font-weight-bold">
          <HtmlParser text={props.data.name} />
        </span>
      </h6>
      <ul className="list-unstyled p-0 m-0">
        {priceBrackup.filter(x => x.amount !== 0).map((item, index) => {
          //Room Wise Loop
          return (
            <React.Fragment key={index}>
              {item.name === "Total Amount" && <hr></hr>}
              <li className="row">
                <label className="col-lg-7">
                  {item.name === "Total Amount" ? (
                    Trans("_lbl" + item.name.replace(" ", ""))
                  ) : (
                    <HtmlParser text={localStorage.getItem("isUmrahPortal") && item.name === "VAT" ? "Tax & VAT" : item.name} />
                  )}{" "}
                  {item.count !== undefined && "X " + item.count}
                </label>
                <b className="col-lg-5 text-right text-nowrap">
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
        {/* <li className="row">
          <label className="col-lg-8">{Trans("_totalPrice")}</label>
          <b className="col-lg-4 text-right">
            <Amount amount={props.data.amount}></Amount>
          </b>
        </li> */}
      </ul>
    </React.Fragment>
  );
};

export default PriceBreakupHotel;
