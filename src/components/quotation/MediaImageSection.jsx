import React from 'react';
import SearchLibrayIcon from "../../assets/images/dashboard/serachicon.svg";
import moment from "moment";
import { apiRequester_quotation_api } from "../../services/requester-quotation";
import { apiRequester } from "../../services/requester";
import ConfirmationModal from '../../helpers/action-modal';
import Loader from '../common/loader';
import ImageNotFound from "../../assets/images/no-image-found.png";


export default class MediaImageSection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      documentID: "",
      error: "",
      results: [],
      resultsExport: "",
      imageName: "",
      imageUrl: "",
      isError: false,
      isBtnLoading: false,
      isBtnLoadingMode: "",
      currentPage: 0,
      pageSize: 12,
      totalRecords: 0,
      hasNextPage: false,
      isExport: false,
      searchBy: "createddate",
      filter: {
        fileName: "",
        fromDate: moment().add(-1, "M").format("YYYY-MM-DD"),
        toDate: moment().format("YYYY-MM-DD"),
        dateMode: "this-month",
        searchBy: "createddate",
      },
      isCopyItemPopup: false,
      isDeleteConfirmPopup: false,
      isSuccess: "",
      title: "Confirm Delete",
      message: 'Are you sure you want to delete this image ?'
    }
  }
  componentDidMount = () => {
    this.getAuthToken();
  }
  getAuthToken = () => {
    this.getmediaList("page-load");
    /* var reqURL = "api/v1/user/token";
    var reqOBJ = {};
    apiRequester(reqURL, reqOBJ, (data) => {
      localStorage.setItem("userToken", data.response);

      this.getmediaList("page-load");

    }); */
  };
  getmediaList = (isBtnLoadingMode) => {
    this.setState({ isBtnLoading: true })
    var reqURL = "media/list";
    let cPage = this.state.currentPage;
    let pSize = this.state.pageSize;
    var reqURL =
      "media/list?pagesize=" +
      +pSize +
      "&page=" +
      cPage;
    if (this.state.filter.fileName)
      reqURL += "&imagename=" + this.state.filter.fileName;
    var reqOBJ = {};
    let hasNextPage = true;
    apiRequester_quotation_api(
      reqURL,
      reqOBJ,
      (data) => {
        let results = [];
        if (data.result.length === 0) {
          this.setState({ error: "No image(s) available ", isError: true });
          results = [];
        }
        else {
          if (isBtnLoadingMode == "pageing") {
            results = this.state.results;
            results = results.concat(data.result);
          }
          else {
            results = data.result;
            this.setState({ isBtnLoading: false })
          }

          if (
            data?.paging?.totalRecords > (this.state.currentPage === 0 ? 1 : this.state.currentPage + 1) * this.state.pageSize
          ) {
            hasNextPage = true;
          } else {
            hasNextPage = false;
          }
        }
        this.setState({
          results,
          totalRecords: data?.paging?.totalRecords ?? 0,
          defaultResults: results,
          hasNextPage,
          isBtnLoading: false,
          isBtnLoadingMode: "",
          isButtonLoading: false,
          isBtnLoadingfilter: false
        });
      }
      ,
      "GET"
    );
  };
  imageClick = (data, url, extension) => {
    this.setState({ imageName: data, imageUrl: url, imageExtension: extension })
  }
  handlePaginationResults = (currentPage) => {
    this.setState({ isBtnLoading: true, currentPage, isExport: true }, () =>
      this.getmediaList("pageing")
    );
  };
  handleFilters = (data) => {
    let filter = this.state.filter;
    filter["fileName"] = data;
    this.setState({ filter });
  };
  removeImage = (documentID) => {

    this.setState({ isCopyItemPopup: true, documentID: documentID })
    this.handleConfirmDelete();
  }
  handleHidePopup = () => {
    this.setState({
      isCopyItemPopup: !this.state.isCopyItemPopup,
    });
  };
  imageConfirmDelete = (documentID) => {

    let reqURL = "media/delete";
    let reqOBJ = {
      documentID: documentID
    };
    apiRequester_quotation_api(reqURL, reqOBJ, (data) => {

      this.setState({
        title: "Delete Image",
        message: "Image Deleted Successfully",
      })
      setTimeout(() => this.setState({
        isCopyItemPopup: false,
        currentPage: 0,
        title: "Confirm Delete",
        message: 'Are you sure you want to delete this image ?',
      }), 900)

      setTimeout(() => this.getmediaList("page-load"), 1100)
    },
      "POST"
    );

  };
  handleConfirmDelete = (isConfirmDelete) => {

    this.setState({ isDeleteConfirmPopup: !this.state.isDeleteConfirmPopup });
    isConfirmDelete && this.imageConfirmDelete(this.state.documentID);
  };
  render() {
    const mode = this.props.name;
    const { currentPage, hasNextPage, isBtnLoading } = this.state;
    return (
      <React.Fragment>
        <div className='container'>
          <div className='row'>
            <div className='col-sm-3 d-flex justify-content-start'>
              <button className='btn text-dark' onClick={() => this.props.modeData('upload')}>Upload</button>
              <button className='btn text-dark font-weight-bold' style={{ borderTop: "2px solid #ea7c10" }} onClick={() => this.props.modeData('media')}>Media</button>
            </div>
            <div className="col-sm-6 input-group">
              <input type="text" className="form-control" placeholder='Search Image Name' name="fileName" value={this.state.filter.fileName} onChange={(e) => this.handleFilters(e.target.value)} />
              <div className="input-group-prepend" onClick={this.getmediaList}>
                <button className="input-group-text">
                  <img
                    className='img-responsive'
                    style={{ filter: "none" }}
                    src={SearchLibrayIcon}
                  />
                </button>

              </div>
            </div>

            {!this.props.name ?
              <div className='col-sm-3'>
                {this.state.imageName && this.state.results.length > 0 &&
                  <button className='btn btn-primary text-light form-control' onClick={() => this.props.imageDetails(this.state.imageName, this.state.imageUrl, this.state.imageExtension)}>Select</button>
                }
              </div> : <div></div>
            }
          </div>
          <hr className='border border-1 border-dark' />
        </div>

        {
          !isBtnLoading && this.state.results.length > 0 ?
            <div className='row' style={!mode ? { overflowY: "auto", maxHeight: "300px" } : {}}>
              {this.state.results.map((item) =>
                <div className={'col-md-3 my-2 text-center ' +
                  (this.state.imageUrl === item.fileURL ?
                    "highlight-image-contantLibrary"
                    : "")}
                  data-toggle="tooltip" data-placement="top"
                  title={item.fileName + "." + item.fileExtension}
                  onDoubleClick={() => this.props.imageDetails(this.state.imageName, this.state.imageUrl, this.state.imageExtension)}
                >
                  <button
                    type="button"
                    className="close"
                    data-dismiss="alert"
                    data-toggle="tooltip"
                    title="delete"
                    aria-label="Close"
                    onClick={() => this.removeImage(item.documentID)}
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                  <img src={item.fileURL} className="img-fluid" style={{ height: "150px", width: "250px", objectFit: "cover" }} onClick={() => this.imageClick(item.fileName, item.fileURL, item.fileExtension)} />
                  <label>
                    {item.fileName.length > 20 ? item.fileName.slice(0, 20) + "..." : (item.fileName + "." + item.fileExtension)}
                  </label>
                </div>
              )}
            </div> :
            (this.state.isError ?
              <h3 style={{ textAlign: "center" }}>{this.state.error} </h3> :
              <Loader />
            )
        }
        <div className='row'>
          <div className='col-sm-12'>
            <nav>
              <ul className="pagination justify-content-center mt-3">
                <li
                  className={
                    this.state.totalRecords > 0 ? "page-item" : "page-item disabled d-none"
                  }
                  style={{
                    display: "flex",
                    "justifyContent": "space-between",
                    "flexGrow": "2",
                  }}
                >
                  <span className="text-primary">Showing{" "}{(this.state.currentPage + 1) * this.state.pageSize > this.state.totalRecords ? this.state.totalRecords : (this.state.currentPage + 1) * this.state.pageSize}{" "} out of {this.state.totalRecords}</span>
                  <button
                    className={"page-link" + (!hasNextPage ? " d-none" : "")}
                    onClick={() => this.handlePaginationResults(currentPage + 1)}
                  >
                    {isBtnLoading && (
                      <span className="spinner-border spinner-border-sm mr-2"></span>
                    )}
                    Show More
                  </button>

                </li>
              </ul>
            </nav>
          </div>

          {this.state.isCopyItemPopup &&
            <ConfirmationModal
              title={this.state.title}
              message={this.state.message}
              positiveButtonText="Confirm"
              onPositiveButton={() => this.handleConfirmDelete(true)}
              handleHide={this.handleHidePopup}
            />}
        </div>
      </React.Fragment >
    );
  }
}
