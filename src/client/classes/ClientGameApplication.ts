import {GameApplication} from '../../classes/GameApplication';
import {WebsocketConnection} from '../../server/classes/WebsocketConnection';
import {w3cwebsocket} from 'websocket';
import {ISerializedGameObject} from '../../interfaces/ISerializedGameObject';
import {GameObject} from '../../classes/GameObject';

/**
 * The client game application will handle rendering via PIXI.js
 */
export class ClientGameApplication extends GameApplication {
	private connection: WebsocketConnection;

	async joinServer(url: string) {
		this.connection = new WebsocketConnection(new w3cwebsocket('ws://localhost:6969'));
		this.connection.on('message', (msg: { id: string, data: any }) => {
			console.log('messageId', msg.id);
			switch (msg.id) {
				case 'map': {
					msg.data.forEach((data: ISerializedGameObject) => {
						const gameObj = GameObject.deserialize(data);
						this.world.addChild(gameObj);
					});
					break;
				}
				case 'propertyupdates': {
					(msg.data as { gameObject: string, properties: { key: string, value: any }[] }[]).forEach(((data) => {
						const gameObj = this.world.findChild(true, (go) => go.id === data.gameObject);
						data.properties.forEach((prop) => {
							(gameObj as any)[prop.key] = prop.value;
						});
					}));
					break;
				}
			}
		});
	}
}
