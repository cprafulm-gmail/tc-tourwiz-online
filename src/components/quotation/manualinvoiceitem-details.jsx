import React, { Component } from "react";
import SVGIcon from "../../helpers/svg-icon";
import ActionModal from "../../helpers/action-modal";
import ManualInvoiceDetailsItems from "./manualinvoice-details-items";

class ManualInvoiceItemsDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: "cart",
      cart: null,
      isRemoveCartLoading: null,
      deleteItem: "",
      isDeleteConfirmPopup: false,
      isDetailPopup: false,
    };
  }

  handleItemDelete = (item) => {
    this.setState({ deleteItem: item, isDeleteConfirmPopup: !this.state.isDeleteConfirmPopup });
  };

  handleConfirmDelete = (isConfirmDelete) => {
    this.setState({ isDeleteConfirmPopup: !this.state.isDeleteConfirmPopup });
    isConfirmDelete && this.props.handleItemDelete(this.state.deleteItem);
  };

  showHideDetailPopup = () => {
    this.setState({ isDetailPopup: !this.state.isDetailPopup });
  };

  render() {
    const { items } = this.props;
    const { isDeleteConfirmPopup } = this.state;

    return (
      <div className="quotation-details border shadow-sm mt-3">
        <div className="border-bottom bg-light d-flex p-3">
          <div className="mr-auto d-flex align-items-center">
            <SVGIcon
              name={"file-text"}
              className="mr-2 d-flex align-items-center"
              width="24"
              type="fill"
            ></SVGIcon>
            <h6 className="font-weight-bold m-0 p-0">{this.props.category} Items</h6>
          </div>
        </div>

        {items.map(
          (item, key) =>
            item.offlineItem && (
              <ManualInvoiceDetailsItems
                key={key}
                handleItemDelete={this.handleItemDelete}
                handleItemEdit={this.props.handleItemEdit}
                item={item}
                removeEditDeleteBtn={this.props.removeEditDeleteBtn}
                invoiceid={this.props.invoiceid}
                mode={this.props.mode}
                userInfo={this.props.userInfo}
              />
            )
        )}

        {isDeleteConfirmPopup && (
          <ActionModal
            title="Confirm Delete"
            message="Are you sure you want to delete this item?"
            positiveButtonText="Confirm"
            onPositiveButton={() => this.handleConfirmDelete(true)}
            handleHide={() => this.handleConfirmDelete(false)}
          />
        )}
      </div>
    );
  }
}

export default ManualInvoiceItemsDetails;
