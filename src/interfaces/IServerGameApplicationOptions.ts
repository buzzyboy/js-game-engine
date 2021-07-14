import {IGameApplicationOptions} from './IGameApplicationOptions';

export interface IServerGameApplicationOptions extends IGameApplicationOptions {
	ticksPerSecond: number;
}
