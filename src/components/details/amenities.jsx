import React from "react";
import { Trans } from "../../helpers/translate";

const Amenities = props => {
  const amenities = props.amenities !== undefined ? props.amenities : [];

  return (
    <React.Fragment>
      {amenities.length > 0 ? (
        <div className="amenities row mb-4">
          <div className="col-12">
            <h4 className="font-weight-bold">{Trans("_titleFacilities")}</h4>
            <ul className="row list-unstyled mb-4">
              {amenities.map((item, key) => {
                return (
                  <li className="col-4 mt-1 mb-1" key={key}>
                    {item.name}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      ) : null}
    </React.Fragment>
  );
};

export default Amenities;
