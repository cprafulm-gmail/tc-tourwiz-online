import { Component } from "react";
import { apiRequester } from "../services/requester";

class CallCenterBase extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  getPortals = () => {
    let reqURL = "api/v1/callcenter/portals";
    let reqOBJ = {
      Request: "",
    };

    apiRequester(
      reqURL,
      reqOBJ,
      function (data) {
        if (data.status.code === 41070) {
          this.setState({
            isLoading: true,
          });
        } else {
          this.setState({
            portals: data.response,
            portal: sessionStorage.getItem("portalId")
              ? sessionStorage.getItem("portalId")
              : data.response[0].name,
            isLoading: false,
          });

          !sessionStorage.getItem("personateId") &&
            sessionStorage.setItem("personateId", data.response[0].defaultPersonateId);
        }
      }.bind(this)
    );
  };

  handlePortal = (portalId) => {
    this.setState({
      isShowPopup: false,
    });
    sessionStorage.setItem("portalId", portalId);
    let personateId = this.state.portals.find((x) => x.id === portalId).defaultPersonateId;

    let req = {
      id: personateId,
      details: { firstName: "" },
    };
    this.handleSelect(req);
  };

  handleCallCenterDetails = (query) => {
    this.setState({
      isShowPopup: true,
    });
    query
      ? this.setState({
          portal: sessionStorage.getItem("portalId"),
          bookingFor: query.bookingFor,
          isCallCenterDetails: !this.state.isCallCenterDetails,
        })
      : this.setState({
          isCallCenterDetails: !this.state.isCallCenterDetails,
        });
  };

  handleQuery = (query) => {
    this.setState({
      results: "",
    });

    query &&
      this.setState({
        portal: sessionStorage.getItem("portalId"),
        bookingFor: query.bookingFor,
      });

    let reqURL = "api/v1/callcenter/detail";
    let reqOBJ = {
      Request: {
        Data: {
          portalId: sessionStorage.getItem("portalId")
            ? sessionStorage.getItem("portalId")
            : this.state.portals[0].id,
          query: query ? query.bookingFor : this.state.bookingFor,
        },
        PageInfoIndex: [
          {
            Code: "default",
            Type: "default",
            Item: {
              CurrentPage: 0,
              PageLength: 100,
            },
          },
        ],
      },
    };

    apiRequester(
      reqURL,
      reqOBJ,
      function (data) {
        this.setState({
          results: data.response,
        });

        let guestCustomer =
          data.response.data.find((x) => x.type === "GuestCustomer") &&
          data.response.data.find((x) => x.type === "GuestCustomer").id;
        sessionStorage.setItem("guestCustomer", guestCustomer);
      }.bind(this)
    );
  };

  handleSelect = (req) => {
    this.setState({
      isCallCenterLoader: true,
    });

    let reqURL = "api/v1/callcenter/setpersonate";
    let reqOBJ = {
      Request: req.id,
    };
    apiRequester(
      reqURL,
      reqOBJ,
      function (data) {
        sessionStorage.setItem("personateId", req.id);
        sessionStorage.setItem("callCenterType", req.type);
        sessionStorage.setItem("bookingFor", req.details.firstName);
        sessionStorage.setItem("bookingForInfo", JSON.stringify(req.details));
        localStorage.setItem("environment", JSON.stringify(data.response));
        localStorage.removeItem("cartLocalId");
        this.setState({
          bookingFor: req.details.firstName,
          isCallCenterDetails: !this.state.isCallCenterDetails,
        });
        window.location.reload();
      }.bind(this)
    );
  };

  resetQuery = () => {
    this.setState({
      isShowPopup: false,
    });
    let portals = this.state.portals;
    let portalId = sessionStorage.getItem("portalId");
    let personateId = portalId
      ? portals.find((x) => x.id === portalId).defaultPersonateId
      : portals[0].defaultPersonateId;

    let req = {
      id: personateId,
      details: { firstName: "" },
    };
    this.handleSelect(req);
  };
}

export default CallCenterBase;
