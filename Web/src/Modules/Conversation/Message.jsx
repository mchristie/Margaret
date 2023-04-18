import React from 'react';
import Ellipses from '../../Components/Ellipses';

const Message = ({message}) => {
    if (message.message.complete === false) {
        return <p className="text-muted">
            <strong>{message.user.name} (typing):</strong><br />
            {message.message.message}
            <Ellipses />
        </p>
    }

    return <p>
        <strong>{message.user.name}:</strong><br />
        {message.message.message}
    </p>
}

export default Message;