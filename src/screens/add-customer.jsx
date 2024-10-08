import React, { Component } from "react";
import { apiRequester } from "../services/requester";
import * as Global from "../helpers/global";
import * as DropdownList from "../helpers/dropdown-list";

class AddCustomer extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  addCustomer = () => {
    const foundCountry = DropdownList.CountryList.find(
      element => element.name === Global.getEnvironmetKeyValue("PortalCountryName").toString()
    );
    var reqURL = "api/v1/customer/create";
    var reqOBJ = {
      Request: {
        UserID: null,
        AgentID: null,
        CustomerClassID: "0",
        UserDisplayName: "Test Patel",
        IsNewsLetterSubscription: false,
        IsActive: false,
        ProfilePicture: null,
        SupplierXML: null,
        LoginName: null,
        FirstName: "Test",
        MiddleName: null,
        LastName: "Patel",
        Password: null,
        Provider: null,
        DateFormatType: null,
        ProviderCurrency: null,
        OfficeID: null,
        RatePercentage: 0.0,
        DiscountChangePercentage: 0.0,
        CancelWaiveOffPercentage: 0.0,
        Location: {
          Id: Global.getEnvironmetKeyValue("PortalCountryCode"),
          CommonCode: null,
          CultureIrrelevantName: null,
          Name: null,
          CountryID: Global.getEnvironmetKeyValue("PortalCountryCode"),
          Country: Global.getEnvironmetKeyValue("PortalCountryName"),
          Yype: null,
          Latitude: 0.0,
          Longitude: 0.0,
          Priority: 0,
          Address: "Test",
          City: "City",
          State: "",
          ZipCode: "",
          District: "",
          Image: null,
          Flags: null
        },
        ContactInformation: {
          Name: null,
          Description: null,
          PhoneNumber: "9123918933",
          PhoneNumberCountryCode: "+" + foundCountry.countryCode.toString() + "-",
          HomePhoneNumberCountryCode: null,
          ActlFormatHomePhoneNumber: null,
          Fax: null,
          Email: "testpatel1@avanicimcon.com",
          WorkEmail: null
        },
        CardType: null,
        CardNumber: null,
        IssuingCountryCode: null,
        IsSelfSubscribed: false,
        GmtTimeDifference: 0,
        TimeZoneID: null,
        IsHeadOffice: false,
        IsEmployee: false,
        BusinessProviders: null,
        BookingMode: null,
        AgentBalance: 0.0,
        MilesCard: null,
        MilesCardNumber: null,
        Crmid: null,
        CanSendEmail: false,
        Age: 0,
        NationalityCode: null,
        GenderDesc: "Male",
        Gender: "M",
        ActlGender: "19",
        BirthDate: "1991-11-11T23:00:00",
        Type: null,
        CompanyName: null,
        CustomLogoPath: null,
        CustomHomeURL: null,
        ParentCompanyName: null,
        CustomerCareEmail: null,
        BookedOnBranch: null,
        SupportEmail: null,
        IsPortalAdmin: false,
        OpenIDs: null,
        AnniversaryDate: "0001-01-01T00:00:00",
        PassportExpirationDate: "0001-01-01T00:00:00",
        DocumentType: null,
        DocumentNumber: null,
        IsCoPAX: false,
        SeqNo: 0,
        ProfilePercentage: 0,
        CreatedDate: "0001-01-01T00:00:00",
        LoginCount: 0,
        TotalBookingAmount: 0.0
      },
      Flags: {
        iscmsportalcreated: this.props.userInfo.issendregistrationemail.toLowerCase() === "true" ? true : false
      },
    };

    apiRequester(
      reqURL,
      reqOBJ,
      function (data) {
      }.bind(this)
    );
  };

  componentDidMount() {
    this.addCustomer();
  }

  render() {
    return <div>Add Customer</div>;
  }
}

export default AddCustomer;
