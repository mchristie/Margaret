import React, { useEffect, useState } from 'react';
import Welcome from './Modules/Welcome';
import Conversation from './Modules/Conversation';
import './App.scss';
import Socket from './Services/Socket';
import Connecting from './Components/Connecting';
import Header from './Components/Header';
import Settings from './Services/Settings';

function App() {
    const [conversationId, setConversationId] = useState(Settings.get('conversationId'));
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        const openRemove = Socket.onOpen(() => {
            console.log('Connected!');
            setConnected(true);
            if (conversationId) {
                Socket.send({
                    action: 'reJoin',
                    data: {
                        conversationId,
                        user: {
                            name: Settings.get('name')
                        }
                    }
                });
            }
        });
        const closeRemove = Socket.onClose(() => {
            console.log('Disconnected :(');
            setConnected(false);
            Socket.connect();
        });
        const messageRemove = Socket.onMessage((event, data) => {
            console.log('Message received', event, data);
            if (data?.conversationId) {
                setConversationId(data?.conversationId);
                Settings.set('conversationId', data?.conversationId);
            }
        });

        // Sometimes events seem to get stuck, but relaying a ping can help
        // Could be an issue with the lambda pausing before the event is sent :/
        const ping = setInterval(() => {
            Socket.send({
                action: 'ping',
                data: {user: Settings.get('name')}
            });
        }, 5 * 1000);

        Socket.connect();
            
        return () => {
            openRemove();
            closeRemove();
            messageRemove();
            clearInterval(ping);
        }
    }, [conversationId]);

    let display = null;
    if (!connected) {
        display = <Connecting />;
    } else if (conversationId) {
        display = <Conversation {...{conversationId}} />
    } else {
        display = <Welcome />
    }

    return <div id="main">
        <Header />
        {display}
    </div>
}

export default App;
