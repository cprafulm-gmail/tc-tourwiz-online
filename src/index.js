import React from "react";
import ReactDOM from "react-dom";
import * as Sentry from '@sentry/browser';
import { HashRouter, BrowserRouter } from "react-router-dom";
import App from "./App";
import "bootstrap/dist/css/bootstrap.css";
import "./assets/css/style.css";
import "./assets/css/font-awesome.min.css";
import * as serviceWorker from "./serviceWorker";
import Config from "./config.json";
import AppPartner from "./App_Partner";
import AppCustomer from "./App_Customer";
import AppCustomerLite from "./App_Customer_lite";
import AppTripCenter from "./App_tripcenter";
import AppTourwiz from "./App_tourwiz";
import AppMarketPlace from "./App_marketplace";
serviceWorker.unregister();
debugger;
// Initialize sentry, add value only if required for development and inject values in deployment pipeline for production usage
Sentry.init({ dsn: Config.sentryDsn });
const codebaseType = Config.codebaseType;
if (window.location.href.toLowerCase().indexOf('/intl') > -1) {
  if (!localStorage.getItem('afUserType') && !localStorage.getItem('userToken')) {
    if (window.location.href.toLowerCase().endsWith('/intl')) {
      localStorage.setItem('country-manual', 'US')
    }
    else {
      localStorage.setItem('country-manual', window.location.href.toLowerCase().replace(window.location.protocol.toLowerCase() + '//' + window.location.host.toLowerCase() + '/intl/', ''));
    }
    if (localStorage.getItem('country-manual') === 'remove') {
      localStorage.removeItem('country-manual');
    }
  }
  window.location.href = window.location.protocol + '//' + window.location.host;
}
if (Config.codebaseType === "tourwiz") {
  ReactDOM.render(
    <BrowserRouter>
      <React.StrictMode>
        <AppTourwiz />
      </React.StrictMode>
    </BrowserRouter>,
    document.getElementById("root")
  );
}
else if (Config.codebaseType === "tourwiz-partner") {
  ReactDOM.render(
    <BrowserRouter>
      <React.StrictMode>
        <AppPartner />
      </React.StrictMode>
    </BrowserRouter>,
    document.getElementById("root")
  );
}
else if (Config.codebaseType === "tourwiz-customer" && window.location.origin.toLowerCase().indexOf(process.env.REACT_APP_DEFAULTB2CPORTAL) > -1) {
  ReactDOM.render(
    <BrowserRouter basename={window.location.href.replace(window.location.origin, '').split('/')[1]}>
      <React.StrictMode>
        <AppCustomerLite />
      </React.StrictMode>
    </BrowserRouter>,
    document.getElementById("root")
  );
}
else if (Config.codebaseType === "tourwiz-customer") {
  ReactDOM.render(
    <BrowserRouter>
      <React.StrictMode>
        <AppCustomer />
      </React.StrictMode>
    </BrowserRouter>,
    document.getElementById("root")
  );
}
else if (Config.codebaseType === "tourwiz-tripcenter") {
  ReactDOM.render(
    <BrowserRouter>
      <React.StrictMode>
        <AppTripCenter />
      </React.StrictMode>
    </BrowserRouter>,
    document.getElementById("root")
  );
}
else if (Config.codebaseType === "tourwiz-marketplace") {
  ReactDOM.render(
    <BrowserRouter>
      <React.StrictMode>
        <AppMarketPlace />
      </React.StrictMode>
    </BrowserRouter>,
    document.getElementById("root")
  );
}
else if (Config.codebaseType === "travelcarma") {
  ReactDOM.render(
    <BrowserRouter>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </BrowserRouter>,
    document.getElementById("root")
  );
}
