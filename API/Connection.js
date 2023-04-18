const Conversations = require("./Conversations");
const Users = require("./Users");

exports.handler = async (event) => {
    const { requestContext, body } = event;

    const payload = body ? JSON.parse(body) : null;
    const connectionId = requestContext.connectionId;

    switch (requestContext.eventType) {
        case 'CONNECT':
            console.log(`WebSocket connected: ${connectionId}`);
            break;

        case 'DISCONNECT':
            console.log(`WebSocket disconnected: ${connectionId}`);
            break;

        case 'MESSAGE':
            await handleAction(payload, connectionId);
            break;
    }

    // Return a successful response
    return {
        statusCode: 200,
        body: 'OK',
    };
};

const handleAction = async (payload, connectionId) => {
    const { action, data } = payload;
    switch (action) {
        case 'start':
            return await startConversation(data.user, connectionId);
        case 'join':
            return await joinConversation(data.conversationId, connectionId, data.user);
        case 'send':
            return await sendMessage(data.conversationId, data.user, data.message);
        case 'ping':
            return await sendPing(data?.conversationId, connectionId, data.user);
        default:
            return 'UNKNOWN ACTION';
    }
}

const startConversation = async (user, connectionId) => {
    const conversationId = await Conversations.startConversation();
    await joinConversation(conversationId, connectionId, user);
    return user;
}

const joinConversation = async (conversationId, connectionId, user) => {
    await Conversations.addUser(conversationId, connectionId, user.name);
    await emitEvent(conversationId, 'userJoined', {conversationId, user});
}

const sendMessage = async (conversationId, sendingUser, message) => {
    await emitEvent(conversationId, 'messageSent', {user: sendingUser, message});
}

const sendPing = async (conversationId, connectionId, sendingUser) => {
    if (conversationId) {
        await emitEvent(conversationId, 'ping', {user: sendingUser});
    } else {
        await Users.sendMessage(connectionId, {user: sendingUser});
    }
}

const emitEvent = async (conversationId, event, data) => {
    const users = await Conversations.getUsersByConversationId(conversationId)
    users.forEach(async (user) => {
        console.log('Sending event to user', event, data, user);
        await Users.sendMessage(user.connectionId, {event, data});
    });
}