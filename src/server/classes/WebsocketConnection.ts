import {connection as Connection, IMessage, IMessageEvent, w3cwebsocket} from 'websocket';
import {TinyEmitter} from 'tiny-emitter';

export class WebsocketConnection extends TinyEmitter {
	constructor(protected connection: Connection | w3cwebsocket) {
		super();

		if (Connection && connection instanceof Connection) {
			connection.on('message', this.onMessage);
			connection.on('close', this.onClose);
			connection.on('error', (error) => {
				console.error(error);
			});
		} else if (connection instanceof WebSocket) {
			connection.onmessage = this.onMessageEvent;
			connection.onopen = () => {
				console.log('connection opened');
			};
			connection.onerror = (error: any) => {
				console.error(error);
			};
			connection.onclose = (event: any) => {
				console.log('connection closed');
			};
		}
	}

	sendUTF(message: string) {
		this.connection.send(message);
	}

	onMessage = (message: IMessage) => {
		this.emit('message');
	};

	onMessageEvent = (message: IMessageEvent) => {
		const msg = JSON.parse(message.data as string);
		this.emit('message', {id: msg.id, data: msg.data});
	};

	onClose = (reasonCode: number, message: string) => {
		this.emit('close', {reasonCode, message});
	};
}
