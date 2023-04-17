import React, { useState, useEffect } from 'react';
import Socket from '../../Services/Socket';

const Welcome = ({ setName }) => {
    const [tmpConversationId, setTmpConversationId] = useState('');
    const [tmpName, setTmpName] = useState('Test name');

    const startConversation = () => {
        setName(tmpName);
        Socket.send({
            action: 'start',
            data: {
                user: {
                    name: tmpName
                }
            }
        });
    }

    const joinConversation = () => {
        if (tmpConversationId.match(/^[0-9]{8}$/) === null) {
            alert('Please enter a valid conversation ID');
            return;
        }

        setName(tmpName);
        Socket.send({
            action: 'join',
            user: {
                conversationId: tmpConversationId,
                name: tmpName
            }
        });
    }

    useEffect(() => {
        if (tmpConversationId.match(/^[0-9]{8}$/) !== null) {
            joinConversation();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tmpConversationId]);

    return (
        <div className="container">
            <div className="row">
                <div className="col">
                    <h1 className="display-1">Welcome</h1>

                    <div className="mb-3">
                        <label className="form-label">Set your name</label>
                        <input type="text"
                            className="form-control"
                            placeholder="Joe Bloggs"
                            value={tmpName}
                            onChange={(e) => setTmpName(e.target.value)}
                        />
                    </div>

                    <hr />

                    <div className="row">
                        <div className="col">
                            <div className="mb-3">
                                <button className="btn btn-primary" onClick={() => startConversation()}>Start conversation</button>
                            </div>
                        </div>
                        <div className="col">
                            OR
                        </div>
                        <div className="col">
                            <div className="mb-3">
                                <input type="text"
                                    className="form-control"
                                    placeholder="Conversation ID"
                                    value={tmpConversationId}
                                    onChange={(e) => setTmpConversationId(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default Welcome;
