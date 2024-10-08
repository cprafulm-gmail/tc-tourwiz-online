import React, { Component } from 'react'
import SVGIcon from "../../helpers/svg-icon";
import QuotationMenu from "../../components/quotation/quotation-menu";
import { apiRequester_unified_api } from "../../services/requester-unified-api";
import Loader from "../../components/common/loader";
import EmailConfriguration from '../../components/confrigurations/emailConfriguration';
//import EmployeeAccessManagement from '../../components/confrigurations/employeeAccessManagement';
//import InvoiceTemplate from '../../components/confrigurations/invoice-template-format';
import { Helmet } from "react-helmet";
export class Configuration extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {
                ProviderID: this.props.userInfo.agentID
            },
            isLoading: false,
            employeesOptions: [],
            configsettings: [],
            SelectedConfigurationID: [],
            selectedTemplateName: "vertical",
        };
    }
    handleMenuClick = (req, redirect) => {
        if (redirect) {
            if (redirect === "back-office")
                this.props.history.push(`/Backoffice/${req}`);
            else {
                this.props.history.push(`/Reports`);
            }
            window.location.reload();
        } else {
            this.props.history.push(`${req}`);
        }
    };
    componentDidMount = async () => {
        this.setState({ isLoading: true });
        let configurations = await this.getConfigurations();
        let employeeList = await this.getEmployees();
        this.setState({ ...configurations, ...employeeList, isLoading: false });
    }
    getEmployees = async () => {
        let reqOBJ = { Request: { IsActive: true, PageNumber: 0, PageSize: 0 } };
        let reqURL = "admin/employee/list";
        return new Promise(function (resolve, reject) {
            apiRequester_unified_api(
                reqURL,
                reqOBJ,
                function (data) {
                    if (data.response.length > 0) {
                        let employeesOptions = data.response.map(item => {
                            return {
                                label: item.fullName ?? item.firstName + " " + item.lastName,
                                value: item.userID,
                                isLoggedinEmployee: item.isLoggedinEmployee,
                                crewNatureId: item.crewNatureID,
                            }
                        });
                        resolve({ employeesOptions })
                    }
                    else {
                        resolve({ employeesOptions: [] })
                    }
                }.bind(this),
                "POST");
        });
    }
    getConfigurations = async () => {
        const reqOBJ = {};
        let reqURL = "admin/getconfigurations";
        return new Promise(function (resolve, reject) {
            apiRequester_unified_api(reqURL, reqOBJ, function (resonsedata) {
                resolve({ configsettings: resonsedata.response });

            }.bind(this), "GET");
        });
    }

    render() {
        let { isLoading } = this.state
        return (
            <div>
                <div className="title-bg pt-3 pb-3 mb-3">
                    <Helmet>
                        <title>
                            {"Website Configuration"}
                        </title>
                    </Helmet>
                    <div className="container">
                        <h1 className="text-white m-0 p-0 f30">
                            <SVGIcon
                                name="file-text"
                                width="24"
                                height="24"
                                className="mr-3"
                            ></SVGIcon>
                            {"Website Configuration"}
                        </h1>
                    </div>
                </div>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-3 hideMenu">
                            <QuotationMenu handleMenuClick={this.handleMenuClick} userInfo={this.props.userInfo} />
                        </div>
                        {isLoading &&
                            <div className="col-lg-8">
                                <div className="container ">
                                    <Loader />
                                </div>
                            </div>
                        }

                        {!isLoading && this.state.employeesOptions.find(x => x.crewNatureId === 3 && x.isLoggedinEmployee) &&
                            <div className="col-lg-9">
                                <div className='row'>
                                    <EmailConfriguration
                                        {...this.props}
                                        configsettings={this.state.configsettings}
                                    />
                                    {/* <EmployeeAccessManagement
                                        {...this.props}
                                        employeeList={this.state.employeesOptions}
                                    /> 
                                    <InvoiceTemplate
                                        {...this.props}
                                        configSettings={this.state.configsettings}
                                    /> */}
                                </div>
                            </div>
                        }
                    </div>
                </div >
            </div >
        )
    }
}

export default Configuration
