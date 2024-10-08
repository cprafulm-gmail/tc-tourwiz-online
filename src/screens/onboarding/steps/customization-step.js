import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import styled from "styled-components";
import Select from "react-select";
import { StepContent } from "../components/wizard-container";
import { TourwizApi, global } from "../api";
import * as React from "react";

const ImagePicker = styled.div`
  padding: 30px;
  border: 1px dashed #ccc;
  border-radius: 5px;
  background: rgba(240, 240, 240, 0.5);
  text-align: center;
  color: #777;
  vertical-align: middle;
`;

const Logo = styled.img`
  width: 100%;
  border-radius: 5px;
  border: 1px solid #ddd;
  padding: 10px;
`;

const CloseButton = styled.button`
  border: 1px solid #ccc;
  background: white;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  color: #777;
  font-size: 12px;
  text-align: center;
  vertical-align: middle;
  position: absolute;
  right: 10px;
  top: 10px;
  box-shadow: 0px 4px 5px rgba(0, 0, 0, 0.1);
`;

const CustomizationStep = (props) => {
  const [selectedCurrency, setSelectedCurrency] = useState({
    label: "INR (Rs)",
    value: "INR",
  });
  const [selectedLanguage, setSelectedLanguage] = useState({
    label: "English",
    key: "English",
  });

  const [currencyLookup, setCurrencyLookup] = useState([]);

  const [isDomainValid, setDomainValid] = useState(0);

  const [logo, setLogo] = useState(null);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: "image/jpeg, image/png",
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles?.length > 0) {
        let file = acceptedFiles[0];
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.onload = () => {
          let imageData = fileReader.result.replace(/^data:.+,/, "");

          try {
            let extension = file.name.match(/\.\w+$/)[0];
            let contentType = file.type;
            let data = imageData;
            global.customization.logo = {
              extension: extension,
              contentType: contentType,
              data: data,
            };
          } catch (e) {
            global.customization.logo = null;
          }
        };
        setLogo(URL.createObjectURL(acceptedFiles[0]));
      }
    },
  });

  const { setNextState } = props;

  useEffect(() => {
    global.customization.language = "English";
    global.customization.currency = "INR";

    // fetch currencies

    TourwizApi.queryCurrencies().then((currencyRes) => {
      setCurrencyLookup(
        currencyRes.response.map((x) => {
          return {
            label: `${x.isoCode} (${x.symbol})`,
            value: x.isoCode,
          };
        })
      );
    });
  }, []);

  useEffect(() => {
    if (props.isVisible) {
      setNextState({
        ...props.nextState,
        disabled: !isDomainValid,
      });
    }
  }, [isDomainValid, props.isVisible]);

  return (
    <StepContent {...props}>
      {/*<div className="alert alert-success" role="alert">*/}
      {/*    Description on Customization*/}
      {/*</div>*/}
      <div className="mb-3">
        {logo && (
          <div
            style={{
              position: "relative",
            }}
          >
            <CloseButton
              onClick={() => {
                setLogo(null);
                global.customization.logo = null;
              }}
            >
              ╳
            </CloseButton>
            <Logo src={logo} />
          </div>
        )}
        {!logo && (
          <>
            <label>Choose Logo</label>
            <ImagePicker
              image={logo}
              {...getRootProps({ className: "dropzone" })}
            >
              <input {...getInputProps()} />
              {!logo && <>Drag 'n' drop logo here, or click here to select</>}
            </ImagePicker>
          </>
        )}
      </div>

      <div className="mb-3">
        <label>Currency *</label>
        <Select
          id={"currency"}
          defaultValue={selectedCurrency}
          options={currencyLookup}
          onChange={(e) => {
            setSelectedCurrency(e);
            global.customization.currency = e.value;
          }}
        />
      </div>
      <div className="mb-3">
        <label>Language *</label>
        <Select
          id={"language"}
          defaultValue={selectedLanguage}
          options={[
            {
              label: "English",
              value: "English",
            },
          ]}
          onChange={(e) => {
            setSelectedLanguage(e);
          }}
        />
      </div>
      <div className="mb-3">
        <label>Domain *</label>
        <div className="input-group mb-3">
          <input
            type="text"
            className={`form-control ${
              isDomainValid === 1
                ? "is-valid"
                : isDomainValid === 3
                ? "is-invalid"
                : ""
            }`}
            placeholder="e.g. yourtravelbusiness"
            aria-label="yourbusiness"
            aria-describedby="basic-addon2"
            onChange={(e) => {
              if (e.target.value?.length === 0) {
                setDomainValid(0);
              } else if (e.target.value.length <= 3) {
                setDomainValid(3);
              } else {
                TourwizApi.validateDomain(e.target.value)
                  .then((x) => {
                    if (x.result) {
                      setDomainValid(1);
                      global.customization.domain = e.target.value;
                    } else {
                      setDomainValid(3);
                      global.customization.domain = null;
                    }
                  })
                  .catch(() => {
                    setDomainValid(3);
                    global.customization.domain = null;
                  });
              }
            }}
          />
          <span className="input-group-text" id="basic-addon2">
            .tourwizonline.com
          </span>
          {isDomainValid === 1 && (
            <div className={"valid-feedback"}>Domain is available</div>
          )}
          {isDomainValid === 3 && (
            <div className={"invalid-feedback"}>Domain is not available</div>
          )}
        </div>
      </div>
    </StepContent>
  );
};

export default CustomizationStep;
