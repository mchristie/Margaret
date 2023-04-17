
const Socket = new class {
    endpoint = 'wss://bla3zyhdh5.execute-api.eu-west-1.amazonaws.com/production?Auth=hello';
    socket = null;
    callbacks = [];

    connect() {
        return new Promise((resolve, reject) => {
            this.ws = new WebSocket(this.endpoint);

            this.ws.addEventListener('open', () => {
                console.log('Connected to websocket');
                resolve();
            });

            this.ws.addEventListener('message', (message) => {
                const data = JSON.parse(message.data)
                console.log('Event: ', data);
                if (data?.event) {
                    this.callbacks.forEach(callback => callback(data.event, data.data));
                }
            });
        });
    }


    async send(payload) {
        console.log('Sending payload', payload);
        await this.ws.send(JSON.stringify(payload));
    }

    listen(callback) {
        if (this.callbacks.indexOf(callback) === -1) {
            this.callbacks.push(callback);
        }
    }

    removeListener(callback) {
        const index = this.callbacks.indexOf(callback);
        if (index !== -1) {
            this.callbacks.splice(index, 1);
        }
    }
}()

export default Socket;
