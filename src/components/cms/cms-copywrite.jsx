import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { CMSContext } from "../../screens/cms/cms-context";

const CMSCopywrite = () => {
  const { cmsState, cmsProps } = useContext(CMSContext);
  const { cmsSettings } = cmsState;
  const companyName = cmsSettings?.footerText;
  return (
    <div className="cp-copyrights">
      <div className="container">
        <div className="row">
          <div className="col-lg-12 d-flex align-items-center justify-content-center">
            <div>
              {companyName} |{" "}
              <Link to="/terms">Terms of Use | Privacy Policy</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CMSCopywrite;
