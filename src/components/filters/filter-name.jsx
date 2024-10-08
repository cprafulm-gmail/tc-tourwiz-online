import React, { Component } from "react";
import { Trans } from "../../helpers/translate";
import SVGIcon from "../../helpers/svg-icon";

class FilterName extends Component {
  constructor(props) {
    super(props);
    this.state = { defaultValue: "" };
  }

  render() {
    return (
      <div className="col-lg-12 col-sm-6 filter-name">
        <div className="border-bottom mb-3">
          <h3>{Trans("_filter" + this.props.name)}</h3>
          <ul className="list-unstyled">
            <li>
              <div className="input-group">
                <input
                  className="form-control"
                  placeholder={Trans(
                    "_filter" + this.props.businessName + "Name"
                  )}
                  type="text"
                  value={this.state.defaultValue}
                  onChange={e =>
                    this.setState({ defaultValue: e.target.value })
                  }
                />
                <div className="input-group-append">
                  <button
                    className="btn btn-primary"
                    type="button"
                    onClick={() =>
                      this.props.handleFilters(
                        this.props.name,
                        this.state.defaultValue
                      )
                    }
                  ><SVGIcon name="search" width="16" height="16" className="text-white"></SVGIcon>
                  </button>

                  {this.state.defaultValue !== "" ? (
                    <button
                      className="btn btn-secondary"
                      onClick={() => {
                        this.setState({ defaultValue: "" });
                        this.props.handleFilters(this.props.name, "");
                      }}
                    >
                      <SVGIcon name="times" width="16" height="16" className="text-white"></SVGIcon>
                    </button>
                  ) : null}
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}

export default FilterName;
