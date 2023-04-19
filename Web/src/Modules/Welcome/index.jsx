import React, { useState } from 'react';
import Socket from '../../Services/Socket';
import Settings from '../../Services/Settings';

const Welcome = () => {
    const [tmpConversationId, setTmpConversationId] = useState('');
    const [working, setWorking] = useState(false);

    const startConversation = () => {
        Socket.send({
            action: 'start',
            data: {
                user: {
                    name: Settings.get('name')
                }
            }
        });
        setWorking(true);
    }

    const joinConversation = () => {
        if (tmpConversationId.match(/^[0-9]{6}$/) === null) {
            alert('Please enter a valid conversation ID');
            return;
        }

        Socket.send({
            action: 'join',
            data: {
                conversationId: tmpConversationId,
                user: {
                    name: Settings.get('name')
                }
            }
        });
        setWorking(true);
    }

    return (
        <div className="container">
            <div className="row">
                <div className="col-12">
                    <h3>The simple free service to help the hearing impaired communicate.</h3>
                    <h3>No downloads, no logins, no fuss.</h3>

                    <div className="alert alert-warning">
                        This is a proof of concept. It's riddled with bugs.<br />
                        Please contribute at <a href="https://github.com/mchristie/margaret">github.com/mchristie/margaret</a>
                    </div>
                </div>
            </div>

            <div className="row mt-5 text-center">

                <div className="col-12">
                    <div className="mb-3">
                        <button className="btn btn-primary"
                            onClick={() => startConversation()}
                            style={{width: '200px'}}
                            disabled={working}
                        >
                            Start conversation
                        </button>
                    </div>
                </div>
                <div className="col-12">
                    <p>- &nbsp; or &nbsp; -</p>
                </div>
                <div className="col-12">
                    <div className="row mx-auto" style={{width: '200px'}}>
                        <input type="text"
                            className="form-control mx-auto"
                            placeholder="Conversation ID"
                            value={tmpConversationId}
                            onChange={(e) => setTmpConversationId(e.target.value)}
                            disabled={working}
                        />
                        <button className="btn btn-primary mt-2"
                            onClick={() => joinConversation()}
                            disabled={working}
                        >
                            Join
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default Welcome;
