import React, { useEffect, useState } from 'react';
import Welcome from './Modules/Welcome';
import Conversation from './Modules/Conversation';
import './App.scss';
import Socket from './Services/Socket';

function App() {
    const [conversationId, setConversationId] = useState(null);
    const [name, setName] = useState(null);
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        async function func() {
            // TODO Listen for disconnects and reconnects
            Socket.connect().then(() => setConnected(true));
            Socket.listen((event, data) => {
                if (data?.conversationId) {
                    setConversationId(data.conversationId);
                }
            });
        }
        func();
    }, []);

    if (conversationId && name) {
        return <Conversation {...{conversationId, name}} />
    } else {
        return <Welcome {...{setConversationId, setName, connected}} />
    }
}

export default App;
