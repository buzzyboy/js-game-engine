import {metadataStorage} from '../classes/MetadataStorage';
import {GameObject as GameObjectConstructor} from '../classes/GameObject';

export function GameObject(nameOverride?: string): ClassDecorator {
	return (target) => {
		const name = nameOverride || target.name;
		if (metadataStorage.gameObjects.find(x => x.name === name)) {
			throw new Error(`GameObjects must have unique names. ${name} is already registered with @GameObject decorator`);
		}
		metadataStorage.gameObjects.push({
			name,
			constructor: target as unknown as new () => GameObjectConstructor,
		});

		target.prototype.__gameObjectName__ = name;
	};
}
