import React from 'react'
import Form from "../common/form";
export class Filter extends Form {
    constructor(props) {
        super(props);
        this.state = {
            data: {
                type: "agent"
            },
        };
    }

    onRadiochange = (value) => {
        const { data } = this.state;
        data.type = value;
        this.setState({ data }, () => {
            this.props.handleFilters(this.state.data)
        });
    }

    render() {
        const { data } = this.state;
        return (
            <div className="border pt-2 pb-2 pl-3 pr-3 shadow-sm">
                <h5 className="text-primary border-bottom pb-2 mb-2">
                    Filters
                </h5>
                <div className="row">
                    <div className="col-lg-4">
                        <div className={"d-flex"}>

                            <div className="input-group">
                                <label className="form-check-label">{"Type: "}&nbsp;</label>
                                <div className="form-check form-check-inline" onClick={() => this.onRadiochange("agent")}>
                                    <input className="form-check-input" type="radio" name="type" id="yes"
                                        onChange={() => this.onRadiochange("agent")} value={data.type}
                                        checked={data.type === "agent"} />
                                    <label className="form-check-label" htmlFor="type">Agent</label>
                                </div>
                                <div className="form-check form-check-inline" onClick={() => this.onRadiochange("customer")}>
                                    <input className="form-check-input" type="radio" name="type" id="no"
                                        value={data.type} onChange={() => this.onRadiochange("customer")}
                                        checked={data.type === "customer"} />
                                    <label className="form-check-label" htmlFor="type">Customer</label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Filter
