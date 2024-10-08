import React from "react";
import { Trans } from "../../helpers/translate";

const TripAdvisorRating = ({ rating }) => {
  const url = rating.find(x => x.type === "tripAdvisor").image.url;
  const count = rating.find(x => x.type === "tripAdvisor").ratersCount;

  return (
    <span>
      <img src={url} alt="" style={{ maxHeight: "16px" }} />
      {count !== -1 &&
        <small className="mt-1 ml-2 text-secondary">
          {count}
          &nbsp;{Trans("_reviews")}
        </small>
      }
    </span>
  );
};

export default TripAdvisorRating;
