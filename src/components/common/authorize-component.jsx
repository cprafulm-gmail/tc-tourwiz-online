import React from "react";
import ModelPopup from "../../helpers/model";
import Config from "../../config.json";

export function AuthorizeComponentCheck(rolepermissions, title) {

  let permissions = rolepermissions && rolepermissions !== null ? rolepermissions : [];
  let userType = localStorage.getItem('afUserType');

  // if (userType !== "" && userType !== "PortalAdminEmployee-Admin")
  //   permissions = rolepermissions && rolepermissions["loggedinuserrole"];

  let isPermission;
  if (permissions && permissions.filter(x => x.objectkeyid === title).length > 0 && (permissions.filter(x => x.objectkeyid === title)[0]["permissionname"] === "Popup" || permissions.filter(x => x.objectkeyid === title)[0]["permissionname"] === "Hide")) {
    isPermission = false;
  }
  else if (permissions && permissions.filter(x => x.objectkeyid === title).length > 0 && permissions.filter(x => x.objectkeyid === title)[0]["permissionname"] === "View") {
    isPermission = true;
  }
  else if (Config.codebaseType === "travelcarma") {
    isPermission = true;
  }
  else
    isPermission = true;

  return isPermission;
}

const AuthorizeComponent = (props) => {

  let isPermission = true;
  //const permissions = props.rolepermissions && props.rolepermissions !== null ? props.rolepermissions["loggedinuserrole"] : [];
  const permissions = props.rolepermissions && props.rolepermissions !== null ? props.rolepermissions : [];
  if (permissions && permissions.filter(x => x.objectkeyid === props.title).length > 0 && permissions.filter(x => x.objectkeyid === props.title)[0]["permissionname"] === "Hide") {
    isPermission = false;
  }
  if (Config.codebaseType === "travelcarma")
    isPermission = true;

  return (
    <React.Fragment>
      {isPermission && props.children}
      {!isPermission && props.type === "page" &&
        <center>
          <div className="mt-5 m-3 p-0 m-0 text-secondary">
            Unauthorised access!
            <br />
            <button
              className="mt-2 btn btn-link p-0 m-0 text-secondary"
              onClick={() => props.history.push("/")}>
              Click here for dashboard.
            </button>
          </div>
        </center>
      }

    </React.Fragment>
  );
};

export default AuthorizeComponent;
