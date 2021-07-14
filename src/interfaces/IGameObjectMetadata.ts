import {GameObject} from '../classes/GameObject';

export interface IGameObjectMetadata {
	name: string;
	constructor: new () => GameObject;
}
