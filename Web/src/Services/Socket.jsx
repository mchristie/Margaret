
const Socket = new class {
    endpoint = 'wss://bla3zyhdh5.execute-api.eu-west-1.amazonaws.com/production?Auth=hello';
    socket = null;
    callbacks = {
        open: [],
        message: [],
        close: [],
    };

    connect() {
        this.ws = new WebSocket(this.endpoint);

        this.ws.addEventListener('open', () => {
            this.triggerCallbacks('open');
        });

        this.ws.addEventListener('close', () => {
            this.triggerCallbacks('close');
        });

        this.ws.addEventListener('message', (message) => {
            const data = JSON.parse(message.data)
            console.log('Event: ', data);
            this.triggerCallbacks('message', data.event, data.data);
        });
    }

    async send(payload) {
        console.log('Sending payload', payload);
        await this.ws.send(JSON.stringify(payload));
    }

    onOpen(callback) {
        return this.addCallback('open', callback);
    }

    onClose(callback) {
        return this.addCallback('close', callback);
    }

    onMessage(callback) {
        return this.addCallback('message', callback);
    }

    triggerCallbacks(event, ...args) {
        this.callbacks[event].forEach((callback) => {
            callback(...args);
        });
    }

    addCallback(event, callback) {
        // Remove it first, prevent duplicates
        this.removeCallback(event, callback);
        this.callbacks[event].push(callback);
        return () => this.removeCallback(event, callback);
    }

    removeCallback(event, callback) {
        const index = this.callbacks[event].indexOf(callback);
        if (index !== -1) {
            this.callbacks[event].splice(index, 1);
        }
    }
}()

export default Socket;
