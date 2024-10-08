import React, { Component } from "react";

class UmrahPackageListFilters extends Component {
  state = { name: "", email: "", phone: "", title: "" };

  handleFilters = () => {
    let filters = [
      { name: this.state.name },
      { title: this.state.title },
      { email: this.state.email },
      { phone: this.state.phone },
    ];
    this.props.handleFilters(filters);
  };

  handleChange = (e) => {
    if (e.target.name === "name") {
      this.setState({ name: e.target.value.trim() }, () =>
        this.handleFilters()
      );
    }
    if (e.target.name === "title") {
      this.setState({ title: e.target.value.trim() }, () =>
        this.handleFilters()
      );
    }
    if (e.target.name === "email") {
      this.setState({ email: e.target.value.trim() }, () =>
        this.handleFilters()
      );
    }
    if (e.target.name === "phone") {
      this.setState({ phone: e.target.value.trim() }, () =>
        this.handleFilters()
      );
    }
  };

  handleResetFilters = () => {
    this.setState({ name: "", title: "", email: "", phone: "" }, () =>
      this.handleFilters()
    );
  };

  render() {
    const { name, title, email, phone } = this.state;

    return (
      <div className="mb-3">
        <div className="border pt-2 pb-2 pl-3 pr-3 shadow-sm">
          <h5 className="text-primary border-bottom pb-2 mb-2">
            Filters
            <button
              type="button"
              className="close"
              onClick={this.props.showHideFilters}
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </h5>

          <div className="row">
            <div className="col-lg-3">
              <div className="form-group">
                <label>Title</label>
                <input
                  className="form-control"
                  value={title}
                  name="title"
                  type="text"
                  onChange={this.handleChange}
                />
              </div>
            </div>

            <div className="col-lg-3">
              <div className="form-group">
                <label>Customer Name</label>
                <input
                  className="form-control"
                  value={name}
                  name="name"
                  type="text"
                  onChange={this.handleChange}
                />
              </div>
            </div>

            <div className="col-lg-3">
              <div className="form-group">
                <label>Email</label>
                <input
                  className="form-control"
                  value={email}
                  name="email"
                  type="text"
                  onChange={this.handleChange}
                />
              </div>
            </div>

            <div className="col-lg-2">
              <div className="form-group">
                <label>Phone</label>
                <input
                  className="form-control"
                  value={phone}
                  name="phone"
                  type="text"
                  onChange={this.handleChange}
                />
              </div>
            </div>

            <div className="col-lg-1">
              <div className="form-group">
                <label className="d-block">&nbsp;</label>
                <button
                  name="reset"
                  onClick={this.handleResetFilters}
                  className="btn btn-primary"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default UmrahPackageListFilters;
