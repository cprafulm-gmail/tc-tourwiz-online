import React, { Component } from "react";
import SVGIcon from "../../helpers/svg-icon";
import Environment from "../../base/environment";
import ModelPopup from "../../helpers/model";
import CartBase from "../../base/cart-base";
import { Trans } from "../../helpers/translate";

class CartSummary extends CartBase {
  constructor(props) {
    super(props);
    this.state = {
      page: "cart-icon",
      isLoading: true,
      cart: null,
      cartId: localStorage.getItem("cartLocalId"),
      isRemoveCartLoading: null,
      showPopup: false,
      popupTitle: "",
      popupContent: null
    };
    this.nodeCartMenu = React.createRef();
    this.nodeCartMenuLink = React.createRef();
  }

  handleCartMenu = data => {
    if (data !== undefined)
      this.setState({
        isCartToggle: false
      });
    else {
      this.setState({
        isCartToggle: !this.state.isCartToggle
      });
    }
  };

  handleClickOutside = event => {
    if (
      this.nodeCartMenu.current !== null &&
      this.nodeCartMenu.current.contains(event.target)
    ) {
      return true;
    } else if (
      this.nodeCartMenuLink.current !== null &&
      this.nodeCartMenuLink.current.contains(event.target)
    ) {
      this.handleCartMenu();
      return true;
    } else {
      this.handleCartMenu(false);
    }
    return true;
  };

  componentDidMount() {
    document.addEventListener("mousedown", this.handleClickOutside);
    if (
      localStorage.getItem("cartLocalId") !== undefined &&
      localStorage.getItem("cartLocalId") !== null &&
      localStorage.getItem("cartLocalId") !== ""
    )
      this.viewCart();
    this.setState({
      isLoading: false
    });
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside);
  }

  handleCartChange = currCart => {
    this.props.history.push(`/Cart`);
  };
  render() {
    const { cart, isLoading } = this.state;
    return (
      <React.Fragment>
        <div
          className="mr-2 mb-3"
          style={{
            position: "fixed",
            right: "10px",
            bottom: "10px",
            zIndex: "1000"
          }}
        >
          {this.state.isCartToggle ? (
            <ul
              className="Cart-list list-unstyled p-3 border bg-white shadow-center"
              ref={this.nodeCartMenu}
              style={{ minWidth: "200px" }}
            >
              {cart !== null &&
              cart !== undefined &&
              cart !== "" &&
              cart.items.length > 0 ? (
                <React.Fragment>
                  {cart.items.map((cart, key) => {
                    return cart.data.business !== "air" ? (
                      <li
                        key={key}
                        className="pb-1 mb-2 border-bottom cursor-pointer"
                      >
                        <SVGIcon
                          name={cart.data.business}
                          className="mr-2 align-text-top"
                          width="16"
                          type="fill"
                          onClick={() => this.handleCartChange(cart.data.name)}
                        ></SVGIcon>
                        <span
                          onClick={() => this.handleCartChange(cart.data.name)}
                        >
                          {cart.data.name}
                        </span>
                        <span
                          className="btn p-0 m-0 float-right"
                          onClick={() => this.removeCartItemConfirm(key)}
                        >
                          <SVGIcon
                            name="times-circle"
                            className="mr-2 ml-2 align-text-bottom pull-right"
                            width="16"
                            type="fill"
                          ></SVGIcon>
                        </span>
                      </li>
                    ) : (
                      <li className="pb-1 mb-2 border-bottom cursor-pointer">
                        <SVGIcon
                          name={cart.data.business}
                          className="mr-2 align-text-top"
                          width="16"
                          type="fill"
                          onClick={() => this.handleCartChange(cart.data.name)}
                        ></SVGIcon>
                        <span
                          onClick={() => this.handleCartChange(cart.data.name)}
                        >
                          {cart.data.items[0].locationInfo.fromLocation.id +
                            " - " +
                            cart.data.items[0].locationInfo.toLocation.id}
                          {cart.data.tripType === "roundtrip" &&
                            " - " +
                              cart.data.items[0].locationInfo.fromLocation.id}
                        </span>
                        <span
                          className="btn p-0 m-0 float-right"
                          onClick={() => this.removeCartItemConfirm(key)}
                        >
                          <SVGIcon
                            name="times-circle"
                            className="mr-2 ml-2 align-text-bottom pull-right"
                            width="16"
                            type="fill"
                          ></SVGIcon>
                        </span>
                      </li>
                    );
                  })}
                </React.Fragment>
              ) : (
                <li className="pb-1 mb-2 border-bottom cursor-pointer">
                  {Trans("_SorryNoItemHere")}
                </li>
              )}
            </ul>
          ) : null}
          <button
            className="btn btn-primary btn-sm m-0 mr-2 pull-right shadow-center text-capitalize"
            ref={this.nodeCartMenuLink}
          >
            {this.state.isLoading ? (
              <span
                className="spinner-border spinner-border-sm mr-2"
                role="status"
                aria-hidden="true"
              ></span>
            ) : (
              <React.Fragment>
                <SVGIcon
                  name={"shopping-cart"}
                  className="mr-2 align-text-top"
                  width="20"
                  type="fill"
                ></SVGIcon>
                <h5 className="pull-right m-0">
                  {cart !== null && cart !== undefined && cart !== ""
                    ? cart.items.length
                    : "0"}
                </h5>
              </React.Fragment>
            )}
          </button>
        </div>
        {this.state.showPopup ? (
          <ModelPopup
            header={this.state.popupTitle}
            content={this.state.popupContent}
            handleHide={this.handleHidePopup}
          />
        ) : null}
      </React.Fragment>
    );
  }
}

export default CartSummary;
