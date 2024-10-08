import React from "react";
import { Trans } from "../../helpers/translate";
import SVGIcon from "../../helpers/svg-icon";

const HotelContactInfo = props => {
  return (
    (props.contactInformation.phoneNumber ||
      props.contactInformation.fax ||
      props.contactInformation.email ||
      props.url) && (
      <div className="row mb-4">
        <div className="col-12">
          <h4 className="font-weight-bold">
            {Trans("_titleContactInformation")}
          </h4>
          <ul className="row list-unstyled mb-4">
            {props.contactInformation.phoneNumber && (
              <li className="col mt-1 mb-1">
                <span>
                  <SVGIcon name="phone" type="fill" className="mr-2"></SVGIcon>
                  {props.contactInformation.phoneNumber}
                </span>
              </li>
            )}
            {props.contactInformation.fax && (
              <li className="col mt-1 mb-1">
                <span>
                  <SVGIcon name="fax" className="mr-2"></SVGIcon>
                  {props.contactInformation.fax}
                </span>
              </li>
            )}
            {props.contactInformation.email && (
              <li className="col mt-1 mb-1">
                <span>
                  <SVGIcon name="envelope" className="mr-2"></SVGIcon>
                  <a
                    className="mailto"
                    href={"mailto:" + props.contactInformation.email}
                  >
                    {props.contactInformation.email}
                  </a>
                </span>
              </li>
            )}
            {props.url && (
              <li className="col mt-1 mb-1">
                <span>
                  <SVGIcon name="globe" className="mr-2"></SVGIcon>
                  <a href={props.url} target="_blank">
                    {props.url.length > 20
                      ? props.url.substring(0, 35) + "..."
                      : props.url}
                  </a>
                </span>
              </li>
            )}
          </ul>
        </div>
      </div>
    )
  );
};

export default HotelContactInfo;
