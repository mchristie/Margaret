import React, { useState } from 'react';
import Record from './Record';

const Room = ({ roomId }) => {
    const [messages, setMessages] = useState([]);

    const addMessage = (message) => {
        setMessages([...message, messages]);
    }

    return (
        <div className="container">
            <div className="row">
                <div className="col">
                    <h1 className="display-1">Welcome</h1>
                    <p>{roomId}</p>

                    {messages.map((message, index) => {
                        return <p key={index}>{message}</p>
                    })}

                    <Record addMessage={addMessage} />

                </div>
            </div>
        </div>
    );
}

export default Room;
