import React, { Component } from 'react';
import MediaImageSection from './MediaImageSection';
import UploadImageSection from './UploadImageSection';
export default class Imagelibrary extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			mode: 'media',
		}
	}
	modeData = (data) => {
		this.setState({ mode: data })
	}
	imageDetailsLoad = (data, url, extension) => {
		this.props.imageDetails(data, url, extension);
	}
	imageDetails = (data, url, extension) => {
		this.imageDetailsLoad(data, url, extension);
	}
	render() {
		return (
			<React.Fragment>
				{this.state.mode === 'upload' &&
					<UploadImageSection modeData={this.modeData} />
				}
				{this.state.mode === 'media' &&
					<MediaImageSection modeData={this.modeData} imageDetails={this.imageDetails} name={this.props.name} />
				}
			</React.Fragment>

		);
	}
}