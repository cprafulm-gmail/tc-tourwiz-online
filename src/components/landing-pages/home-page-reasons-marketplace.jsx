import React from "react";
import W1 from "../../assets/images/tw/W1N.png";
import W2 from "../../assets/images/tw/W2N.png";
import W3 from "../../assets/images/tw/W3N.png";
import W4 from "../../assets/images/tw/W4N.png";
import W5 from "../../assets/images/tw/W5N.png";
import W6 from "../../assets/images/tw/W6N.png";
import { Link } from "react-router-dom";
const HomePageReasonsMarketPlace = (props) => {
  const css = `
  p {
   font-size:15px !important;
  }
  `;
  return (
    <div className="tw-reasons pt-5 pb-5">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <h2>Who is it for?</h2>
          </div>
        </div>
        <style>{css}</style>
        <div className="row  justify-content-start mb-5">
          <div className="col-lg-2 mt-5">
            <div className="tw-reasons-box">
              <div className="w-100">
                <img className="w-50"
                  src={W1}
                  alt="Get registered as a partner"
                />
              </div>
              <div className=""><p>
                Hoteliers/<br />Accommodation <br />Providers
              </p></div>
            </div>
          </div>

          <div className="col-lg-2 mt-5">
            <Link to="/tour-operator" className="text-decoration-none">
              <div className="tw-reasons-box">
                <div className="w-100">
                  <img className="w-50" src={W2} alt="Create offers in the system by adding details and photos" />
                </div><div className="w-100"><p>
                  DMCs
                </p></div>
              </div>
            </Link>
          </div>

          <div className="col-lg-2 mt-5">
            <Link to="/tour-operator" className="text-decoration-none">
              <div className="tw-reasons-box">
                <div className="w-100"><img className="w-50" src={W3} alt="Preview and publish your offers" />
                </div><div className="w-100"><p>
                  Tour Operators
                </p></div>
              </div>
            </Link>
          </div>
          <div className="col-lg-2 mt-5">
            <div className="tw-reasons-box">

              <div className="w-100"><img className="w-50"
                src={W4}
                alt="Once published, your offers start appearing on TourWiz and can be seen by all the registered agents on our platform"
              />
              </div>
              <div className="w-100"><p>
                Ground Transportation Companies
              </p></div>
            </div>
          </div>

          <div className="col-lg-2 mt-5">
            <div className="tw-reasons-box">

              <div className="w-100"><img className="w-50" src={W5} alt="They click on the offers and get to see your information" />
              </div><div className="w-100"><p>
                Sightseeing/<br />Activity operators
              </p></div>
            </div>
          </div>

          <div className="col-lg-2 mt-5">
            <Link to="/travel-agents" className="text-decoration-none">
              <div className="tw-reasons-box">
                <div className="w-100"><img className="w-50" src={W6} alt="For more details, they get redirected to your website or contact you directly" />
                </div><div className="w-100"><p>
                  Travel Agencies
                </p></div>
              </div>
            </Link>
          </div>
        </div>

        {/* <div className="row pb-5 mb-5 justify-content-end">
          <div className="col-lg-3 mt-5 pl-4 pr-4">
            <div className="tw-reasons-box">

              <div className="w-100"><img className="w-50"
                src={W4}
                alt="Once published, your offers start appearing on TourWiz and can be seen by all the registered agents on our platform"
              />
              </div>
              <div className="w-100"><p>
                Ground Transportation Companies
              </p></div>
            </div>
          </div>

          <div className="col-lg-3 mt-5 pl-4 pr-4">
            <div className="tw-reasons-box">

              <div className="w-100"><img className="w-50" src={W5} alt="They click on the offers and get to see your information" />
              </div><div className="w-100"><p>
                Sightseeing/Activity operators
              </p></div>
            </div>
          </div>

          <div className="col-lg-3 mt-5 pl-4 pr-4">
            <div className="tw-reasons-box">

              <div className="w-100"><img className="w-50" src={W6} alt="For more details, they get redirected to your website or contact you directly" />
              </div><div className="w-100"><p>
                Travel Agencies
              </p></div>
            </div>
          </div>
        </div> */}

        <button style={{ display: "none" }}
          onClick={() => props.handleLoginPopup("signup")}
          className="btn btn-lg"
        >
          Start Free
        </button>
      </div>
    </div>
  );
};

export default HomePageReasonsMarketPlace;
