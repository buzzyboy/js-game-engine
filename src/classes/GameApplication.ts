import {World} from './World';
import {IGameApplicationOptions} from '../interfaces/IGameApplicationOptions';
import {ApplicationRole} from '../enums/ApplicationRole';

/**
 * The base game application. This code is shared between a Client and Server game application
 */
export class GameApplication {
	static role: ApplicationRole = ApplicationRole.client;
	public world: World;
	public options: IGameApplicationOptions;

	constructor(options?: IGameApplicationOptions) {
		this.options = Object.assign(GameApplication.defaultOptions, options || {});
		this.world = new World();
		this.world.world = this.world;
	}

	static defaultOptions: IGameApplicationOptions = {};
}
