import React, { useEffect } from "react";

const SessionExpired = props => {

    useEffect(() => {
        props.handleLogoutExpire();
    }, []);

    return (
        <div className="card text-center shadow  mx-5 my-4 bg-white rounded">
            <div className="card-body">
                <h5 className="card-title">Information</h5>
                <p className="card-text">Due to security reasons, session has been expired.</p>
                <a href="/" className="btn btn-primary">Home</a>
            </div>
        </div>
    );
};

export default SessionExpired;
