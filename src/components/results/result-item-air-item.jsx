import React from "react";
import Date from "../../helpers/date";
import Stops from "../common/stops";
import { Trans } from "../../helpers/translate";
import SVGIcon from "../../helpers/svg-icon";
import ImageNotFound from "../../assets/images/image-not-found-flight.png";
import * as Global from "../../helpers/global";

const ResultItemAirItem = (props) => {
  const { items } = props;
  let isWishList =
    Global.getEnvironmetKeyValue("EnableWishList", "cobrand") === "true"
      ? true
      : false;
      let HideSupplierName  = (Global.getEnvironmetKeyValue("HideSupplierName", "cobrand")
       && Global.getEnvironmetKeyValue("HideSupplierName", "cobrand") === "true") ? false : true;
  let wishList = props.wishList;
  return (
    <div className="row no-gutters">
      <div className="col-lg-10">
        <ul className="list-unstyled m-0">
          {items.map((item, itemKey) => {
            const loc = item.locationInfo;
            loc.fromLocation = loc.fromLocation || loc.FromLocation;
            loc.toLocation = loc.toLocation || loc.ToLocation;
            const date = item.dateInfo;
            const stopCount = item.item.length - 1;
            const stops =
              stopCount === 0
                ? "non stop"
                : stopCount === 1
                  ? stopCount + " stop"
                  : stopCount + " stops";
            const duration =
              item.tpExtension.find((x) => x.key === "durationHours").value +
              "h " +
              item.tpExtension.find((x) => x.key === "durationMinutes").value +
              "m";
            const url = item.item[0].images.find((x) => x.type === "default")
              .url;

            const airline = item.item[0].vendors[0].item.name;
            const airlineCode = item.item[0].code;

            const getOnErrorImageURL = () => {
              return ImageNotFound.toString();
            };

            return (
              <li className="border-bottom p-3" key={itemKey}>
                <div className="row">
                  <div className="col-lg-2 d-flex justify-content-center align-items-center flex-column">
                    <img
                      className="img-fluid"
                      src={url || ImageNotFound}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = getOnErrorImageURL();
                      }}
                      alt=""
                    />
                    <span className="small text-secondary mt-2">
                      {airline + " " + airlineCode}
                    </span>
                  </div>
                  <div className="col-lg-3 d-flex justify-content-center align-items-end flex-column">
                    <span className="small text-secondary">
                      {loc.fromLocation.id}
                    </span>

                    <b>
                      <Date date={date.startDate} format="shortTime" />
                    </b>

                    <span className="small text-secondary">
                      <Date date={date.startDate} format={Global.getEnvironmetKeyValue("DisplayDateFormate")} />
                    </span>
                  </div>
                  <div className="col-lg-2 d-flex justify-content-center align-items-center flex-column">
                    <Stops {...[stopCount]} />
                    <span className="small mt-1">{Trans("_" + stops.replace(" ", "").replace(" ", "").toLowerCase())}</span>
                  </div>
                  <div className="col-lg-3 d-flex justify-content-center align-items-start flex-column">
                    <span className="small text-secondary">
                      {loc.toLocation.id}
                    </span>

                    <b>
                      <Date date={date.endDate} format="shortTime" />
                    </b>

                    <span className="small text-secondary">
                      <Date date={date.endDate} format={Global.getEnvironmetKeyValue("DisplayDateFormate")} />
                    </span>
                  </div>
                  <div className="col-lg-2 d-flex justify-content-center align-items-start flex-column">
                    <span className="small text-nowrap">
                      <i className="align-text-bottom">
                        <SVGIcon
                          name="clock"
                          className="mr-1 text-secondary"
                          width="12"
                          height="12"
                        ></SVGIcon>
                      </i>
                      {duration}
                    </span>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="col-lg-2 border-left bg-light d-flex justify-content-center align-items-center flex-column">
        <h2>{props.displayAmount}</h2>

        {localStorage.getItem("ssotoken") === null ? (
          props.isBtnLoading === false ? (
            <button
              className="btn btn-primary mt-1"
              onClick={() => props.handleCart(props.token, props.token)}
            >
              {Trans("_bookNow")}
            </button>
          ) : (
            <button className="btn btn-primary mt-1">
              {props.isBtnLoading === props.token && (
                <span className="spinner-border spinner-border-sm mr-2"></span>
              )}
              {Trans("_bookNow")}
            </button>
          )
        ) : null}
        <button
          className="btn btn-link mt-1 text-secondary"
          onClick={() => props.handelDetails(props.token)}
        >
          {props.isShow ? Trans("_hideDetails") : Trans("_viewDetails")}
        </button>
        {HideSupplierName && props.tpExtension.find((x) => x.key === "providername") !==
          undefined &&
          props.tpExtension.find((x) => x.key === "providername").value !==
          "" && (
            <small className="d-block mt-2">
              {props.tpExtension.find((x) => x.key === "providername").value}
            </small>
          )}

        {isWishList && (
          <button
            className="btn btn-sm btn-link text-primary w-100 text-nowrap"
            onClick={() => props.addToWishList(props)}
          >
            {wishList.find((e) => e.token === props.token)
              ? Trans("_removeFromWishList")
              : Trans("_addToWishList")}
          </button>
        )}
      </div>
    </div>
  );
};

export default ResultItemAirItem;
