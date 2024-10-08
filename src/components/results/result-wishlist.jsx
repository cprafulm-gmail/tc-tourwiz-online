import React from "react";
import SVGIcon from "../../helpers/svg-icon";
import Date from "../../helpers/date";
import Stops from "../common/stops";
import HtmlParser from "../../helpers/html-parser";
import { Trans } from "../../helpers/translate";

const WishList = (props) => {
  const { wishList } = props;

  return (
    <div className="wishlist border bg-white p-3 shadow-sm mt-3">
      <div className="row">
        <div className="col-lg-12">
          <h6 className="border-bottom mb-2 pb-3 font-weight-bold">
            {Trans("_wishList")}
          </h6>
        </div>
      </div>
      <div className="row">
        <div className="col-lg-12">
          <ul className="list-unstyled">
            {wishList.length > 0
              ? wishList.map((item, key) => {
                  return (
                    <li className="pt-1 pb-1" key={key}>
                      {item.business !== "air" && (
                        <React.Fragment>
                          <SVGIcon
                            name="check-circle"
                            width="16"
                            height="16"
                            className="text-primary mr-2"
                            type="fill"
                          ></SVGIcon>
                          <HtmlParser text={item.name} />
                        </React.Fragment>
                      )}
                      {item.business === "air" && (
                        <ul className="list-unstyled m-0 border p-2">
                          {item.items.map((item, itemKey) => {
                            const loc = item.locationInfo;
                            loc.fromLocation =
                              loc.fromLocation || loc.FromLocation;
                            loc.toLocation = loc.toLocation || loc.ToLocation;
                            const date = item.dateInfo;
                            const stopCount = item.item.length - 1;
                            const stops =
                              stopCount === 0
                                ? "non stop"
                                : stopCount === 1
                                ? stopCount + " stop"
                                : stopCount + " stops";
                            return (
                              <li className="p-3" key={itemKey}>
                                <div className="row">
                                  <div className="col-lg-4 d-flex justify-content-center align-items-end flex-column">
                                    <span className="small text-secondary">
                                      {loc.fromLocation.id}
                                    </span>

                                    <b>
                                      <Date
                                        date={date.startDate}
                                        format="shortTime"
                                      />
                                    </b>

                                    <span className="small text-secondary text-nowrap">
                                      <Date
                                        date={date.startDate}
                                        format="shortDate"
                                      />
                                    </span>
                                  </div>
                                  <div className="col-lg-4 d-flex justify-content-center align-items-center flex-column">
                                    <Stops {...[stopCount]} />
                                    <span className="small mt-1">{stops}</span>
                                  </div>
                                  <div className="col-lg-4 d-flex justify-content-center align-items-start flex-column">
                                    <span className="small text-secondary">
                                      {loc.toLocation.id}
                                    </span>

                                    <b>
                                      <Date
                                        date={date.endDate}
                                        format="shortTime"
                                      />
                                    </b>

                                    <span className="small text-secondary text-nowrap">
                                      <Date
                                        date={date.endDate}
                                        format="shortDate"
                                      />
                                    </span>
                                  </div>
                                </div>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </li>
                  );
                })
              : Trans("_noItemsAdded")}
          </ul>
        </div>
      </div>
      {wishList.length > 0 && (
        <div className="row">
          <div className="col-lg-12">
            <button
              className="btn btn-primary btn-sm mr-2"
              onClick={props.handleWishListPopup}
            >
              {Trans("_emailWishList")}
            </button>
            <button
              onClick={props.clearWishList}
              className="btn btn-outline-primary btn-sm"
            >
              {Trans("_clear")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WishList;
