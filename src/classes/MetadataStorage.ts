import {IGameObjectMetadata} from '../interfaces/IGameObjectMetadata';

export class MetadataStorage {
	gameObjects: IGameObjectMetadata[] = [];
}

export const metadataStorage = new MetadataStorage();
