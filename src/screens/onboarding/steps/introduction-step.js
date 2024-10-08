import * as React from "react";
import countries from "../data/countries.json";
import { StepContent } from "../components/wizard-container";
import { TourwizApi, global } from "../api";
import AsyncSelect from "react-select/async";
import { useEffect, useState } from "react";

const countriesMap = countries.map((x) => {
  return {
    label: x.name,
    value: x.code,
  };
});

const IntroductionStep = (props) => {
  const [locations, setLocations] = useState();
  const [locationsData, setLocationsData] = useState();
  const [isLocationSearchLoading, setLocationSearchLoading] = useState(false);
  const [isFormValid, setFormValid] = useState(false);
  const { setNextState } = props;
  const [validationResult, setValidationResult] = useState({
    businessName: false,
    location: false,
    address: false,
    postalCode: false,
    phoneNumber: false,
  });

  const validateForm = () => {
    // 1. Validate company name
    let isBusinessNameValid = global?.introduction?.businessName?.length > 4;
    let isLocationValid = !!global?.introduction?.location?.cityId;
    let isAddressValid = global?.introduction?.address?.length > 5;
    let isPoBoxCodeValid = global?.introduction?.postalCode?.length > 4;
    let isPhoneNumberValid = !!global?.introduction?.supportPhoneNumber?.match(
      /^\+\d{2}-\d{10}$/
    );
    setFormValid(
      isBusinessNameValid &&
        isLocationValid &&
        isAddressValid &&
        isPoBoxCodeValid &&
        isPhoneNumberValid
    );
    setValidationResult({
      businessName: isBusinessNameValid,
      location: isLocationValid,
      address: isAddressValid,
      postalCode: isPoBoxCodeValid,
      phoneNumber: isPhoneNumberValid,
    });
  };

  useEffect(() => {
    if (props.isVisible) {
      setNextState({
        ...props.nextState,
        disabled: !isFormValid,
      });
    }
  }, [isFormValid, props.isVisible]);

  return (
    <StepContent {...props}>
      {/*<div className="alert alert-success" role="alert">*/}
      {/*    Description on Introduction*/}
      {/*</div>*/}

      <div className="mb-3">
        <label htmlFor="businessName" className="form-label">
          Business Name *
        </label>
        <input
          type="text"
          className={`form-control ${
            validationResult.businessName ? "is-valid" : ""
          }`}
          id="businessName"
          placeholder="e.g. Travel Company Inc."
          onChange={(e) => {
            global.introduction.businessName = e.target.value;
            validateForm();
          }}
        />
      </div>

      <div className="mb-3">
        <label htmlFor="location" className="form-label">
          City *
        </label>
        <AsyncSelect
          placeholder={"Enter in which city your business is located"}
          cacheOptions
          loadOptions={(query) => {
            return new Promise((resolve, reject) => {
              setLocationSearchLoading(true);
              TourwizApi.queryLocations(query)
                .then((res) => {
                  setLocations(
                    res.response.map((x) => {
                      return {
                        label: x.name,
                        value: JSON.stringify(x),
                      };
                    })
                  );
                  setLocationsData(res.response);
                  setLocationSearchLoading(false);
                  resolve(locations);
                })
                .catch(reject);
            });
          }}
          onChange={(e) => {
            if (e && e.value) {
              global.introduction.location = JSON.parse(e.value);
            } else {
              global.introduction.location = null;
            }
            validateForm();
          }}
        />
      </div>
      <div className="mb-3">
        <label htmlFor="address" className="form-label">
          Address *
        </label>
        <textarea
          type="text"
          className={`form-control ${
            validationResult.address ? "is-valid" : ""
          }`}
          id="address"
          placeholder="Enter Address"
          onChange={(e) => {
            global.introduction.address = e.target.value;
            validateForm();
          }}
        />
      </div>
      <div className="mb-3">
        <label htmlFor="pinCode" className="form-label">
          Pin Code *
        </label>
        <input
          type="text"
          className={`form-control ${
            validationResult.postalCode ? "is-valid" : ""
          }`}
          id="pinCode"
          placeholder="Enter PO Box Code"
          onChange={(e) => {
            global.introduction.postalCode = e.target.value;
            validateForm();
          }}
        />
      </div>
      <div className="mb-3">
        <label htmlFor="supportPhoneNumber" className="form-label">
          Support Phone Number *{" "}
          <span className="text-secondary">(e.g. +91-912399999)</span>
        </label>
        <input
          defaultValue="+91-"
          type="text"
          className={`form-control ${
            validationResult.phoneNumber ? "is-valid" : ""
          }`}
          id="supportPhoneNumber"
          placeholder="e.g. +91-912399999"
          onChange={(e) => {
            if (e.target.value.match(/^\+\d{2}-\d{10}$/)) {
              global.introduction.supportPhoneNumber = e.target.value;
            } else {
              global.introduction.supportPhoneNumber = null;
            }
            validateForm();
          }}
        />
      </div>
    </StepContent>
  );
};

export default IntroductionStep;
