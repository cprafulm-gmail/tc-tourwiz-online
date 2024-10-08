import React from "react";
import TwLogo from "../../assets/images/tw/tw-logo-white.svg";
import { Trans } from "../../helpers/translate";

const PublicPageRewardsPoint = (props) => {
  return (
    <div className="tw-rewards-point">
      <div className="container">
        <div className="row">
          <div className="col-lg-7 rewards-point-content">
            <div>
              <h2>Earn Handsome Rewards when you use TourWiz</h2>
              <p>
                With the TourWiz Reward Program, you earn
                points on various actions such as adding an
                inquiry, creating an itinerary/{Trans("_quotationReplaceKeys")}, adding

                a booking etc. You can then redeem these points
                on tourwizonline.com against your subscription.
              </p>
              <p>This way the more you use TourWiz, the more you save!</p>
            </div>

            <button
              onClick={() => props.handleLoginPopup("signup")}
              className="btn btn-lg mt-3"
            >
              Start Free
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicPageRewardsPoint;
