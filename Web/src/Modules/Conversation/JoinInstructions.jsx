import React from 'react';

const JoinInstructions = ({conversationId}) => {
    const half = Math.ceil(conversationId.length / 2);
    const regex = new RegExp(`([0-9]{${half}})([0-9]+)`);
    const formatted = conversationId.replace(regex, '$1-$2');

    return <div className="row">
        <div className="col">
            <div className="alert alert-primary w-50 mx-auto text-center">
                Conversation ID<br />
                <span className="display-4">{formatted}</span>
            </div>
        </div>
    </div>
}

export default JoinInstructions;