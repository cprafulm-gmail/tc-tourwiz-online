import React, { Component } from 'react'
import SVGIcon from "../helpers/svg-icon";
import QuotationMenu from "../components/quotation/quotation-menu";
import ComingSoon from "../helpers/coming-soon";
import { apiRequester_quotation_api } from "../services/requester-quotation";
import AuthorizeComponent, { AuthorizeComponentCheck } from "../components/common/authorize-component";
import ModelPopupAuthorize from "../helpers/modelforauthorize";
import { Trans } from '../helpers/translate';

class Rewards extends Component {
    constructor(props) {
        super(props);
        this.state = {
            comingsoon: false,
            totalrewardpoints: 0,
            isshowauthorizepopup: false
        };
    }
    hideauthorizepopup = () => {
        this.setState({ isshowauthorizepopup: !this.state.isshowauthorizepopup });
    }


    handleComingSoon = () => {
        this.setState({
            comingsoon: !this.state.comingsoon,
        });
    };

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

    getRewardpoints = () => {
        const { userInfo: { agentID } } = this.props;

        var reqURL = "reward/summary";
        var reqOBJ = {};

        apiRequester_quotation_api(
            reqURL,
            {},
            function (data) {
                if (data.response) {
                    this.setState({ totalrewardpoints: data.response.totalRewardPoints });
                }
            }.bind(this),
            "GET"
        );

    }

    componentDidMount() {
        this.getRewardpoints();
    }

    render() {
        return (
            <div>
                <div className="title-bg pt-3 pb-3 mb-3">
                    <div className="container">
                        <h1 className="text-white m-0 p-0 f30">
                            <SVGIcon
                                name="file-text"
                                width="24"
                                height="24"
                                className="mr-3"
                            ></SVGIcon>
                            Reward Program
                        </h1>
                    </div>
                </div>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-3 hideMenu">
                            <QuotationMenu handleMenuClick={this.handleMenuClick} userInfo={this.props.userInfo} />
                        </div>

                        <div className="col-lg-9">
                            <div className="container">
                                <div className="row">
                                    <div className="col-lg-12 border rounded alert alert-info m-3 pt-4">
                                        <b>You have earned <b>{this.state.totalrewardpoints}</b> reward points</b>
                                        <AuthorizeComponent title="Rewards~rewardprogram-redeemnow" type="button" rolepermissions={this.props.userInfo.rolePermissions}>
                                            <button className="btn btn-primary float-right" onClick={this.handleComingSoon}>
                                                Redeem Now
                                            </button>
                                        </AuthorizeComponent>
                                    </div>

                                    <div className="col-lg-12 d-flex flex-wrap justify-content-center align-content-center">
                                        <div className="container">
                                            <div className="row">
                                                <div className="col-lg-12 text-center text-secondary">
                                                    <div className="module">
                                                        <h5>With the TourWiz reward program, you earn points on various actions, such as when you capture an inquiry, create an itinerary & {Trans("_quotationReplaceKeys")}, add a booking etc.

                                                            You can redeem these points on tourwizonline.com against your subscription.

                                                            This way the more you use TourWiz, the more you save!

                                                            Terms and conditions apply*
                                                        </h5>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>

                        {this.state.comingsoon && (
                            <ComingSoon handleComingSoon={this.handleComingSoon} />
                        )}
                        {this.state.isshowauthorizepopup &&
                            <ModelPopupAuthorize
                                header={""}
                                content={""}
                                handleHide={this.hideauthorizepopup}
                                history={this.props.history}
                            />
                        }
                        {/* <div className="col-lg-9 d-flex flex-wrap justify-content-center align-content-center">
                            <div className="container">
                                <div className="row">
                                    <div className="col-lg-12 text-center text-secondary">
                                        <h1 className="">Coming Soon</h1>
                                        <div className="module">
                                            <h5>Reward points</h5>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div> */}
                    </div>
                </div>
            </div >
        )
    }
}

export default Rewards;
