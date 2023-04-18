const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, GetCommand, UpdateCommand, PutCommand } = require('@aws-sdk/lib-dynamodb');


class Conversations {
    constructor() {
        this.tableName = process.env.CONVERSATIONS_TABLE;
        this.dynamoDBClient = new DynamoDBClient();
        this.documentClient = DynamoDBDocumentClient.from(this.dynamoDBClient);
        this.userConsistentReads = false;
    }

    async startConversation() {
        const conversationId = Math.floor(Math.random() * 1000000).toString();

        const params = {
            TableName: this.tableName,
            Item: {
                ConversationId: conversationId,
                Users: [],
            },
        };

        this.userConsistentReads = true;

        try {
            await this.documentClient.send(new PutCommand(params));
            return conversationId;
        } catch (error) {
            console.error('Error starting conversation:', error);
            throw error;
        }
    }

    async addUser(conversationId, connectionId, name) {
        const params = {
            TableName: this.tableName,
            Key: {
                ConversationId: conversationId
            },
            UpdateExpression: 'SET #users = list_append(#users, :newUser)',
            ExpressionAttributeValues: {
                ':newUser': [{ connectionId, name }],
            },
            ExpressionAttributeNames: {
                '#users': 'Users',
            },
        };

        this.userConsistentReads = true;

        try {
            await this.documentClient.send(new UpdateCommand(params));
        } catch (error) {
            console.error('Error adding user to conversation:', error);
            throw error;
        }
    }

    async getUsersByConversationId(conversationId) {
        const params = {
            TableName: this.tableName,
            Key: {
                ConversationId: conversationId
            },
            ConsistentRead: this.userConsistentReads
        };

        try {
            const response = await this.documentClient.send(new GetCommand(params));
            return response.Item ? response.Item.Users : [];
        } catch (error) {
            console.error('Error getting users by conversationId:', error);
            throw error;
        }
    }
}

module.exports = new Conversations();
