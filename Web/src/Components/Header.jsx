import React from 'react';
import Settings from '../Services/Settings';

const Header = () => {

    const reset = () => {
        Settings.reset();
        window.location.reload();
    }
    const reload = () => {
        window.location.reload();
    }

    return (
        <div className="container">
            <div className="row border-bottom pb-2 mb-4">
                <div className="col">
                    <h1 className="display-1">Margaret.chat</h1>
                </div>
                <div className="col-auto text-right">
                    <button className="btn btn-outline-primary me-2"
                        onClick={() => reload()}
                    >
                        Reload
                    </button>
                    <button className="btn btn-outline-danger"
                        onClick={() => reset()}
                    >
                        Reset
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Header;