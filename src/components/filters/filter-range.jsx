import React, { Component } from "react";
import Nouislider from "nouislider-react";
import "nouislider/distribute/nouislider.css";
import { Trans } from "../../helpers/translate";
import Amount from "../../helpers/amount";
import wNumb from 'wnumb';
import * as Global from "../../helpers/global";

class FilterRange extends Component {
  constructor(props) {
    super(props);
    this.state = { minValue: null, maxValue: null };
  }

  onChange = value => {
    this.setState({
      minValue: Math.round(Number(value[0])),
      maxValue: Math.round(Number(value[1]))
    });

    const range = {
      minValue: Number(value[0]),
      maxValue: Number(value[1])
    };

    this.props.handleFilters(this.props.name, range);
  };

  onSlide = (render, handle, value, un, percent) => {
    this.setState({
      minValue: Number(value[0]),
      maxValue: Number(value[1])
    });
  };

  render() {
    const name = this.props.name;
    const minValue = Number(this.props.minValue);
    const maxValue = Number(this.props.maxValue);
    if(this.props.isfromTourwiz && name === "pricerange" )
      return(null);
    return (
      <div className="col-lg-12 col-sm-6 filter-price">
        <div className="border-bottom mb-3">
          <h3>{Trans("_filter" + name)}</h3>
          <ul className={name==="pricerange" ? "list-unstyled p-1 mt-5 mb-1  mx-4" : "list-unstyled p-1 mt-3 mb-1"}>
            <li>
              <Nouislider
                start={[this.state.minValue && this.state.minValue === this.props.minValue
                  ? this.state.minValue
                  : this.props.minValue
                  , this.state.maxValue && this.state.maxValue === this.props.maxValue
                  ? this.state.maxValue
                  : this.props.maxValue]}
                range={{ min: minValue, max: maxValue }}
                step={1}
                connect={true}
                onChange={this.onChange}
                onSlide={this.onSlide}
              tooltips={name === "pricerange" ? [wNumb({
                decimals: Global.getEnvironmetKeyValue("isRoundOff") ? 0 : 2,
                prefix: this.props.filterCurrencySymbol + " "
              })
                , wNumb({
                  decimals: Global.getEnvironmetKeyValue("isRoundOff") ? 0 : 2,
                  prefix: this.props.filterCurrencySymbol + " "
                })] : [false, false]}
              />
              <label className="mt-2">
                {Trans(name === "pricerange" ? "_filterPrice" : "_distance") + " : "}
                {name === "pricerange" ? (
                  <Amount
                    amount={
                      this.state.minValue && this.state.minValue === this.props.minValue
                        ? this.state.minValue
                        : this.props.minValue
                    }
                    currencySymbol={this.props.filterCurrencySymbol}
                  />
                ) : (
                    this.state.minValue
                      ? this.state.minValue
                      : this.props.minValue
                  )}
                &nbsp;-&nbsp;
                {name === "pricerange" ? (
                  <Amount
                    amount={
                      this.state.maxValue && this.state.maxValue === this.props.maxValue
                        ? this.state.maxValue
                        : this.props.maxValue
                    }
                    currencySymbol={this.props.filterCurrencySymbol}
                  />
                ) : (
                    this.state.maxValue
                      ? this.state.maxValue
                      : this.props.maxValue
                  )}
              </label>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}

export default FilterRange;
