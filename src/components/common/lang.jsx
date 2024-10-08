import React, { Component } from "react";
import * as Global from "../../helpers/global";
import { Trans } from "../../helpers/translate";
import SVGIcon from "../../helpers/svg-icon";

class Lang extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLangToggle: false
    };
    this.nodeLangMenu = React.createRef();
    this.nodeLangMenuLink = React.createRef();
  }

  handleLangMenu = data => {
    if (data !== undefined)
      this.setState({
        isLangToggle: false
      });
    else {
      this.setState({
        isLangToggle: !this.state.isLangToggle
      });
    }
  };

  handleClickOutside = event => {
    if (
      this.nodeLangMenu.current !== null &&
      this.nodeLangMenu.current.contains(event.target)
    ) {
      return true;
    } else if (
      this.nodeLangMenuLink.current !== null &&
      this.nodeLangMenuLink.current.contains(event.target)
    ) {
      this.handleLangMenu();
      return true;
    } else {
      this.handleLangMenu(false);
    }
    return true;
  };

  componentDidMount() {
    localStorage.getItem("lang") === null && localStorage.setItem("lang", Global.getEnvironmetKeyValue("availableLanguages") ? Global.getEnvironmetKeyValue("availableLanguages")[0].cultureName : "en-US");
    document.addEventListener("mousedown", this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside);
  }

  handleLangChange = currLang => {
    if(localStorage.getItem("lang") === null || localStorage.getItem("lang") !== currLang){
      let currentLang =
        localStorage.getItem("lang") === null ? "en-US" : currLang;
      localStorage.setItem("lang", currentLang);
      window.location.reload();
    }
    else{
      this.setState({isLangToggle:false});
    }
  };
  render() {
    return (
      <React.Fragment>
        {Global.getEnvironmetKeyValue("availableLanguages") &&
          Global.getEnvironmetKeyValue("availableLanguages").length > 1 && (
            <button
              className="btn btn-sm m-0 btn-outline-secondary pull-right text-capitalize"
              ref={this.nodeLangMenuLink}
            >
              <SVGIcon
                name={
                  localStorage.getItem("lang") === null
                    ? "lang-flag-en"
                    : "lang-flag-" + localStorage.getItem("lang")
                }
                className="mr-2 align-text-top"
                width="16"
              ></SVGIcon>
              {localStorage.getItem("lang") === null
                ? Trans("_cultureList_en")
                : Trans("_cultureList_" + localStorage.getItem("lang"))}
            </button>
          )}
        {this.state.isLangToggle ? (
          <ul
            className="lang-list list-unstyled p-3 mr-3 border bg-white shadow"
            ref={this.nodeLangMenu}
            style={{ minWidth: "150px" }}
          >
            {" "}
            {Global.getEnvironmetKeyValue("availableLanguages").map(
              (item, index) => {
                return (
                  <React.Fragment key={index}>
                    <li
                      className="pb-1 mb-2 border-bottom cursor-pointer"
                      onClick={() => this.handleLangChange(item.cultureName)}
                    >
                      <SVGIcon
                        name={"lang-flag-" + item.cultureName.split("-")[0]}
                        className="mr-2 align-text-top"
                        width="16"
                      ></SVGIcon>
                      {Trans(
                        "_cultureList_" + item.cultureName.replace("-", "_")
                      )}
                    </li>
                  </React.Fragment>
                );
              }
            )}
          </ul>
        ) : null}
      </React.Fragment>
    );
  }
}

export default Lang;
