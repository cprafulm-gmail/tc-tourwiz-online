import React from "react";
import mapping from "../common/iconMapping";
import { Trans } from "../../helpers/translate";

const AllAmenities = props => {
  const amenities = props.amenities !== undefined ? props.amenities : [];
  return (
    <div className=" row mb-4">
      <div className="col-12">
        <h4 className="font-weight-bold">{Trans("_thingsYouWillLove")}</h4>
        <div style={{ marginBottom: 30 }} />
        {amenities.map((amenity, key) => {
          if (amenity.type === "Room") return;
          var svgIcon = mapping[amenity.name.toLowerCase()]
            ? mapping[amenity.name.toLowerCase()]
            : null;
          if (svgIcon === null || svgIcon === "undefined") return true;

          return (
            <React.Fragment key={key}>
              <span
                className="badge badge-light border p-1 pl-2 pr-2 mr-2 mb-2 font-weight-normal"
                key={key}
              >
                {
                  <img
                    title={amenity.name}
                    src={svgIcon.default ?? svgIcon}
                    style={{ width: 35, height: 35 }}
                    alt=""
                  />
                }
                <div style={{ marginBottom: 10 }} />
                <small className="text-muted">{amenity.name}</small>
              </span>
              <span style={{ marginRight: 10 }} />
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default AllAmenities;
