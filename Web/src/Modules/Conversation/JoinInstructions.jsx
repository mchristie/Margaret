import React from 'react';

const JoinInstructions = ({conversationId}) => {
    const half = Math.ceil(conversationId.length / 2);
    const regex = new RegExp(`([0-9]{${half}})([0-9]+)`);
    const formatted = conversationId.replace(regex, '$1-$2');

    return <div className="row">
        <div className="col-8 col-md-6 mx-auto">
            <div className="alert alert-primary mx-auto text-center">
                <span className="display-4">{formatted}</span><br />
                Enter this code to join from any device.
            </div>
        </div>
    </div>
}

export default JoinInstructions;