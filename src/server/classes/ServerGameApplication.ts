import {GameApplication} from '../../classes/GameApplication';
import {server as WebsocketServer, request as WebsocketRequest} from 'websocket';
import {createServer, Server as HttpServer} from 'http';
import {WebsocketConnection} from './WebsocketConnection';
import {IServerGameApplicationOptions} from '../../interfaces/IServerGameApplicationOptions';

export class ServerGameApplication extends GameApplication {
	private websocketServer: WebsocketServer;
	private http: HttpServer;
	private connections: WebsocketConnection[] = [];
	public options: IServerGameApplicationOptions;

	constructor(options?: Partial<IServerGameApplicationOptions>) {
		super(Object.assign({}, ServerGameApplication.defaultOptions, options || {}));
	}

	async start() {
		this.http = createServer();
		this.websocketServer = new WebsocketServer({
			httpServer: this.http,
		});
		this.websocketServer.on('request', this.onWebSocketServerRequest);
		await this.http.listen(6969);

		setInterval(this.update, 1000 / this.options.ticksPerSecond);
	}

	update = () => {
		if (this.world.pendingPropertyUpdates.length > 0) {
			this.connections.forEach(c => c.sendUTF(JSON.stringify({
					id: 'propertyupdates',
					data: this.world.pendingPropertyUpdates.map(ppu => {
						return {
							gameObject: ppu.gameObject.id,
							properties: ppu.properties.map(p => ({key: p, value: (ppu.gameObject as any)[p]}))
						};
					})
				}))
			);
		}
		this.world.pendingPropertyUpdates.length = 0;
	};

	onWebSocketServerRequest = (request: WebsocketRequest) => {
		const connection = new WebsocketConnection(request.accept());
		this.connections.push(connection);
		const replicatedObjects = this.world.getChildren(true, (gameObject => gameObject.replicates));
		connection.sendUTF(JSON.stringify({id: 'map', data: replicatedObjects.map(ro => ro.serialize())}));
	};

	static defaultOptions: IServerGameApplicationOptions = {
		ticksPerSecond: 15,
	};
}
