import React, { useState, useEffect } from 'react';

const Welcome = ({ setName, setRoomId }) => {
    const [tmpRoomId, setTmpRoomId] = useState('');
    const [tmpName, setTmpName] = useState('');

    const startRoom = () => {
        setRoomId(
            [
                Math.round(Math.random() * 10),
                Math.round(Math.random() * 10),
                Math.round(Math.random() * 10),
                Math.round(Math.random() * 10),
                Math.round(Math.random() * 10),
                Math.round(Math.random() * 10),
                Math.round(Math.random() * 10),
                Math.round(Math.random() * 10),
            ].join('')
        );
    }

    const joinRoom = () => {
        if (tmpRoomId.match(/^[0-9]{8}$/) === null) {
            alert('Please enter a valid room ID');
            return;
        }

        setRoomId(tmpRoomId);
    }

    useEffect(() => {
        if (tmpRoomId.match(/^[0-9]{8}$/) !== null) {
            joinRoom();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tmpRoomId]);

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
                                <button className="btn btn-primary" onClick={() => startRoom()}>Start room</button>
                            </div>
                        </div>
                        <div className="col">
                            OR
                        </div>
                        <div className="col">
                            <div className="mb-3">
                                <input type="text"
                                    className="form-control"
                                    placeholder="Room ID"
                                    value={tmpRoomId}
                                    onChange={(e) => setTmpRoomId(e.target.value)}
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
