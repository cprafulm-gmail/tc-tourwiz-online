import React, { Component } from 'react'
import ModelPopup from '../../helpers/model';
import Imagelibrary from './ImageLibrary';

export class ContentLibrary extends Component {
    constructor(props) {
        super(props)

        this.state = {
            isCopyItemPopup: false,
            title: '',
            body: '',
            ImageName: '',
            ImageUrl: '',
        }
    }
    modelData = () => {
        this.setState({ isCopyItemPopup: true })
    }
    handleHidePopup = () => {
        this.setState({
            isCopyItemPopup: !this.state.isCopyItemPopup,
        });
    };
    imageDetails = (data, url) => {
        this.setState({ ImageName: data, ImageUrl: url, isCopyItemPopup: false })
    }
    render() {
        return (
            <React.Fragment>
                {this.state.ImageUrl !== '' && < img src={this.state.ImageUrl} className="img-responsive img-thumbnail" style={{ height: "150px", width: "250px" }} alt='' />}<br />
                <label>{this.state.ImageName}</label>
                <div className='container'>
                    <div className='row'>
                        <div className='col-sm-12 mt-5  d-flex justify-content-center'>
                            <button className='btn btn-primary' onClick={() => this.modelData()}>Upload Images</button>
                        </div>
                    </div>
                </div>
                {
                    this.state.isCopyItemPopup &&
                    <ModelPopup
                        header="Content Library"
                        content={<Imagelibrary imageDetails={this.imageDetails} />}
                        sizeClass="modal-dialog modal-lg modal-dialog-centered"
                        handleHide={this.handleHidePopup}
                    />
                }

            </React.Fragment>
        )
    }
}
export default ContentLibrary;

