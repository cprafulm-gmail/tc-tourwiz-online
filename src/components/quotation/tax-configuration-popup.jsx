import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import ConfirmationModal from '../../helpers/action-modal'
import { apiRequester_unified_api } from '../../services/requester-unified-api';
export class TaxConfigurationPopup extends Component {
	constructor(props) {
		super(props)
		this.state = {
			isShowpopup: true,
			title: "Information",
			message: <>
				<div>Kindly configure taxes. Click <Link
					to="/TaxConfiguration"
					className="text-primary"
				>here</Link> to manage tax configurations.</div>
			</>,
		}
	}

	handleHidePopup = () => {
		localStorage.setItem("showTaxConfigurationPopup", false);
		this.setState({
			isShowpopup: !this.state.isShowpopup,
		});
	}

	isShowtaxconfigpopup = () => {
		this.setState({ isShowpopup: false });
		localStorage.setItem("showTaxConfigurationPopup", false);
		let reqURL = "admin/disabletaxconfig";
		apiRequester_unified_api(reqURL, null, function (response) {
		}.bind(this), "POST");
	}

	render() {
		return (
			<div>

				<React.Fragment>
					{this.state.isShowpopup &&
						<ConfirmationModal
							title={this.state.title}
							message={this.state.message}
							negativeButtonText="Close"
							onNegativeButton={this.handleHidePopup}
							positiveButtonText="Do Not Show Again"
							onPositiveButton={() => this.isShowtaxconfigpopup()}
							handleHide={this.handleHidePopup}
						/>
					}
				</React.Fragment>
			</div>
		)
	}
}
export default TaxConfigurationPopup;

