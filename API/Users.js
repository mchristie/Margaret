const { ApiGatewayManagementApiClient, PostToConnectionCommand } = require('@aws-sdk/client-apigatewaymanagementapi');

class Users {
  constructor() {
    this.apiGatewayManagementApiClient = new ApiGatewayManagementApiClient({
      apiVersion: '2018-11-29',
      endpoint: process.env.API_ENDPOINT,
    });
  }

  async sendMessage(connectionId, message) {
    const command = new PostToConnectionCommand({
      ConnectionId: connectionId,
      Data: JSON.stringify(message),
    });

    try {
      await this.apiGatewayManagementApiClient.send(command);
    } catch (error) {
      console.error('Error sending message to user:', error);
      throw error;
    }
  }
}

module.exports = new Users();
