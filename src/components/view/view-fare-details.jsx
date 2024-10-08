import React from "react";
import Amount from "../../helpers/amount";
import { Trans } from "../../helpers/translate";

const ViewFareDetails = props => {
  let tmpPriceBrackup = props.fareBreakup.map(
    (cart_inner_Item, cart_inner_index) => {
      return {
        title: cart_inner_Item.item[0].displayRateInfo[0].description,
        itemArr: cart_inner_Item.item.map(
          (cart_inner1_Item, cart_inner1_index) => {
            return cart_inner1_Item.displayRateInfo.map(
              (cart_inner2_Item, cart_inner2_index) => {
                return {
                  name: cart_inner2_Item.description,
                  amount: cart_inner2_Item.displayAmount,
                  lable: cart_inner2_Item.title
                };
              }
            );
          }
        )
      };
    }
  );
  tmpPriceBrackup = tmpPriceBrackup.flat();
  let priceBrackup = [];
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
  let isInclusiveGST = props.fareBreakup.find(x => x.flags.isShowMessageForInclusiveGST) !== undefined;
  return (
    <div className="card shadow-sm mb-3">
      <div className="card-header">
        <h5 className="m-0 p-0">{Trans("_viewFareSummary")}</h5>
      </div>
      <div className="card-body">
        <ul className="list-unstyled p-0 m-0">
          {priceBrackup.map((item, index) => {
            //Room Wise Loop
            return (
              <React.Fragment key={index}>
                {item.title !== undefined && (
                  <li className="row">
                    <label className="col-lg-12">
                      {Trans("_lbl" + item.title.replaceAll(" ", ""))}
                    </label>
                  </li>
                )}
                {item.title !== undefined ? (
                  item.itemArr.map((item_inner, index) => {
                    //Room Wise Loop
                    return (
                      <li className="row">
                        <label className="col-lg-3">{item_inner.name}</label>
                        <b className="col-lg-9">
                          {item_inner.amount}
                        </b>
                      </li>
                    );
                  })
                ) : (
                  <li className="row">
                    <label className="col-lg-3">
                      {item.lable !== undefined && item.lable !== ""
                        ? item.lable
                        : Trans("_lbl" + item.name.replaceAll(" ", ""))}
                    </label>
                    <b className="col-lg-9">
                      {item.amount}
                    </b>
                  </li>
                )}
              </React.Fragment>
            );
          })}
          {/* {props.item.map(function(item, key) {
            return (
              <li className="row" key={key}>
                <label className="col-3">
                  {Trans("_view" + item.description.split(" ").join(""))}
                </label>
                <b className="col-9">
                  <Amount amount={item.amount} />
                </b>
              </li>
            );
          })} */}
        </ul>
        {isInclusiveGST && <small className="">- Total price inclusive of all taxes</small>}
      </div>
    </div>
  );
};

export default ViewFareDetails;
