import React from "react";
import Form from "../common/form";
import SVGIcon from "../../helpers/svg-icon";
import moment from "moment";
import * as Global from "../../helpers/global";

class InvoiceType extends Form {
  state = {
    data: {
      invoicetype: 'itemizedprice',
    },
    errors: {}
  };

  handleSubmit = () => {
    var data = this.state.data;
    this.props.handleSubmit({ count: this.props.count, data: data });
  };

  changeinvoiceType = (type) => {
    const { data } = this.state;

    if (type === 'itemizedprice')
      data.invoicetype = 'itemizedprice';
    else
      data.invoicetype = 'withoutitemizedprice';
    this.setState({ data });
  }

  componentDidMount() {
    this.props.onRef(this);
  }

  componentWillUnmount() {
    this.props.onRef(undefined);
  }

  render() {
    return (
      <div className="contact-details border p-3 bg-white box-shadow mt-3">
        <h5 className="border-bottom pb-3 mb-3 font-weight-bold">
          <SVGIcon
            name="envelope"
            width="20"
            height="20"
            className="mr-2"
          ></SVGIcon>
          Choose Invoice type
        </h5>


        <div className="row">
          <div className="col-lg-12">
            <div className="row form-group ml-0">

              <div className="col-sm-4 custom-control custom-switch">
                <input
                  type="checkbox"
                  checked={this.state.data.invoicetype === 'itemizedprice' ? true : false}
                  className="custom-control-input"
                  id="customSwitchinvoiceitemized"
                  onChange={(e) => this.changeinvoiceType("itemizedprice")}
                />
                <label className="custom-control-label" htmlFor="customSwitchinvoiceitemized">
                  Invoice with Itemized Price
                </label>
              </div>
              <div className="col-sm-4 custom-control custom-switch">
                <input
                  type="checkbox"
                  checked={this.state.data.invoicetype !== 'itemizedprice' ? true : false}
                  className="custom-control-input"
                  id="customSwitchinvoicewithoutitemized"
                  onChange={(e) => this.changeinvoiceType("withoutitemizedprice")}
                />
                <label className="custom-control-label" htmlFor="customSwitchinvoicewithoutitemized">
                  Invoice without Itemized Price
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default InvoiceType;
