import React, { Component } from "react";
import IntlTelInput from "react-intl-tel-input";
import "react-intl-tel-input/dist/main.css";
import * as DropdownList from "../../helpers/dropdown-list";
import * as Global from "../../helpers/global";

class Input extends Component {
  constructor(props) {
    super(props);
    this.state = {
      phoneNumber: "",
      countryCode: "",
      isFromComponentDidMount:
        props.isDefaultLoad !== undefined ? props.isDefaultLoad : false
    };
  }

  componentDidMount() {
    if (
      this.props.value &&
      this.props.value !== "" &&
      this.props.value !== "undefined"
    ) {
      this.getUpdatedPhoneNumber();
    }
  }
  /**
   * Whenever props value get changed this method will call
   */
  componentDidUpdate = prevProps => {
    /**
     * Check current props and prevProps value and if both are different then only update
     * state value
     */
    if (this.props.value !== prevProps.value) {
      if (
        this.props.value &&
        this.props.value !== "" &&
        this.props.value !== "undefined"
      ) {
        this.getUpdatedPhoneNumber();
      }
    }
    if (!this.state.isFromComponentDidMount) {
      this.setState({
        isFromComponentDidMount: true
      });
    }
  };

  getUpdatedPhoneNumber = () => {
    //Split props(phone number) value in countryCode and phoneNumber
    var countryC = this.props.value.split("-")[0];
    var number = this.props.value.split("-")[1];
    //Find country object for contry code
    const foundCountry = DropdownList.CountryList.find(
      element => element.countryCode === parseInt(countryC).toString()
    );
    //If get countryCode then only update state
    if (foundCountry && foundCountry !== "undefined") {
      this.setState({
        phoneNumber: number ? number : "",
        countryCode: foundCountry.isoCode.toLowerCase()
      });
    }
  };
  /**
   * Callback method when change phone number from input
   */
  onPhoneNumberChange = (status, value, countryData, number, id) => {
    this.setState({
      phoneNumber: value ? value : ""
    });
  };

  render() {
    const { phoneNumber, countryCode, isFromComponentDidMount } = this.state;
    return (
      isFromComponentDidMount && (
        <div className={"form-group " + this.props.name}>
          <label htmlFor={this.props.name}>{this.props.label}</label>
          <IntlTelInput
            preferredCountries={[]}
            defaultCountry={
              countryCode === ""
                ? Global.getEnvironmetKeyValue(
                  "PortalCountryCode"
                ).toLowerCase()
                : this.state.countryCode
            }
            onPhoneNumberChange={this.onPhoneNumberChange}
            onPhoneNumberBlur={this.props.onPhoneNumberBlur}
            containerClassName={[
              "form-control intl-tel-input allow-dropdown w-100 col-lg-12 p-0 position-relative"
            ]}
            inputClassName="form-control d-block"
            value={phoneNumber ? phoneNumber : ""}
            fieldName={this.props.name}
            fieldId={this.props.name}
            autoHideDialCode={true}
            formatOnInit={false}
            separateDialCode={false}
            format={false}
            useMobileFullscreenDropdown={false}
            placeholder=""
            disabled={this.props.isReadOnly}
            allowDropdown={!this.props.isReadOnly}
          />
          {this.props.error && (
            <small className="alert alert-danger mt-2 p-1 d-inline-block">
              {this.props.error}
            </small>
          )}
        </div>
      )
    );
  }
}
export default Input;
