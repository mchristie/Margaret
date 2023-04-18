import React, { useState, useEffect } from 'react';
import Record from './Record';
import Socket from '../../Services/Socket';
import { ulid } from 'ulid';
import Settings from '../../Services/Settings';
import Message from './Message';
import Faker from '../../Services/Faker';
import JoinInstructions from './JoinInstructions';

const Room = ({ conversationId }) => {
    const [newMessageId, setNewMessageId] = useState(ulid());
    const [redraw, setRedraw] = useState(ulid());
    const [messages, setMessages] = useState({});

    const addMessage = (user, message) => {
        setMessages(messages => {
            messages[message.id] = { user, message };
            return messages;
        });
    }

    const sendMessage = (message, complete) => {
        Socket.send({
            action: 'send',
            data: {
                conversationId,
                message: {
                    id: newMessageId,
                    complete,
                    message
                },
                user: {
                    name: Settings.get('name')
                }
            }
        });
        if (complete) {
            setNewMessageId(ulid());
        }
    }

    const handleEvent = (event, data) => {
        if (event === 'messageSent') {
            addMessage(data.user, data.message);
        }
        setRedraw(ulid());
    }

    useEffect(() => {
        return Socket.onMessage(handleEvent);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="container">
            <div className="row">
                <div className="col">

                    <div id="conversation-outer">
                        <div id="conversation-inner">
                            <JoinInstructions conversationId={conversationId} />

                            {Object.values(messages).map(
                                (message) => <Message key={message.message.id} message={message} />
                            )}
                        </div>
                    </div>

                    <hr />

                    <p className="d-none">Redraw: {redraw}</p>
                    <p className="d-none">NewMessageId: {newMessageId}</p>

                    <Record partialMessage={t => sendMessage(t, false)}
                        finalMessage={t => sendMessage(t, true)}
                    />

                    <button className="btn btn-secondary w-100 mt-5"
                        onClick={() => Faker.sendMessage(conversationId)}
                    >
                        Fake message
                    </button>

                </div>
            </div>
        </div>
    );
}

export default Room;
