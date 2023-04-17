import React, { useState, useEffect } from 'react';
import Record from './Record';
import Socket from '../../Services/Socket';
import { ulid } from 'ulid';

const Room = ({ conversationId, name }) => {
    const [messages, setMessages] = useState([]);

    const addMessage = (user, message) => {
        setMessages(messages => [...messages, {user, message}]);
    }

    const sendMessage = (message) => {
        Socket.send({
            action: 'send',
            data: {
                conversationId,
                message: {
                    id: ulid(),
                    message
                },
                user: {
                    name
                }
            }
        });
    }

    const handleEvent = (event, data) => {
        if (event === 'messageSent') {
            addMessage(data.user, data.message);
        }
    }

    useEffect(() => {
        Socket.listen(handleEvent);

        return () => Socket.removeListener(handleEvent);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="container">
            <div className="row">
                <div className="col">
                    <h1 className="display-1">{conversationId}</h1>

                    {messages.map((message) => {
                        return <p key={message.message.id}>
                            <strong>{message.user.name}:</strong><br />
                            {message.message.message}
                        </p>
                    })}

                    <Record addMessage={sendMessage} />

                    <button className="btn btn-primary" 
                        onClick={() => sendMessage('Hello random message! '+Math.random())}
                    >
                        Test message
                    </button>

                </div>
            </div>
        </div>
    );
}

export default Room;
