const Conversations = require("./Conversations");
const Users = require("./Users");

exports.handler = async (event, ) => {
    const { requestContext, body } = event;

    const payload = body ? JSON.parse(body) : null;
    const connectionId = requestContext.connectionId;

    if (requestContext.eventType === 'CONNECT') {
        // Handle @connect event
        console.log(`WebSocket connected: ${connectionId}`);
    } else if (requestContext.eventType === 'DISCONNECT') {
        // Handle @disconnect event
        console.log(`WebSocket disconnected: ${connectionId}`);
    } else if (requestContext.eventType === 'MESSAGE') {
        // Handle @message event
        await handleAction(payload, connectionId);
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
    await emitEvent(conversationId, 'userJoined', {conversationId, user}, connectionId);
}

const sendMessage = async (conversationId, sendingUser, message) => {
    await emitEvent(conversationId, 'messageSent', {user: sendingUser, message});
}

const emitEvent = async (conversationId, event, data, extraConnectionId) => {
    const users = await Conversations.getUsersByConversationId(conversationId)
    users.forEach(async (user) => {
        console.log('Sending event to user', event, data, user);
        await Users.sendMessage(user.connectionId, {event, data});
    });

    if (extraConnectionId) {
        // await Users.sendMessage(extraConnectionId, {event, data});
    }
}