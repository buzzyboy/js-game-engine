import {World} from './World';
import {v4} from 'uuid';
import {GameObject as GameObjectDecorator} from '../decorators/GameObject.decorator';
import {metadataStorage} from './MetadataStorage';
import {ISerializedGameObject} from '../interfaces/ISerializedGameObject';

@GameObjectDecorator()
export class GameObject {
	world: World;
	children: GameObject[] = [];
	replicates = false;
	id: string;
	__gameObjectName__: string;
	__replicatedProperties__?: string[];

	constructor() {
		this.id = v4();
	}

	update(delta: number) {
	}

	addChild(child: GameObject) {
		child.world = this.world;
		this.children.push(child);
	}

	serialize(): ISerializedGameObject {
		return {
			name: this.__gameObjectName__,
			properties: [...this.__replicatedProperties__, 'id']?.map(rp => ({
				key: rp,
				value: (this as any)[rp],
			})),
		};
	}

	static deserialize(serialized: ISerializedGameObject): GameObject {
		const obj = GameObject.constructFromName(serialized.name);
		serialized.properties.forEach((keyValue: { key: string, value: any }) => {
			(obj as any)[keyValue.key] = keyValue.value;
		});
		return obj;
	}

	static constructFromName<T extends GameObject>(name: string): T {
		const metadata = metadataStorage.gameObjects.find(x => x.name === name);
		if (!metadata) {
			throw new Error(`No game object with name ${name} was found`);
		}
		return new metadata.constructor() as T;
	}

	getChildren(recursive = false, filter?: (gameObject: GameObject) => boolean): GameObject[] {
		const children: GameObject[] = [];
		this.children.forEach(gameObj => {
			if (filter && !filter(gameObj)) {
				return;
			}
			children.push(gameObj);
			if (recursive) {
				children.push(...gameObj.getChildren(recursive, filter));
			}
		});
		return children;
	}

	findChild(recursive = false, filter: (gameObject: GameObject) => boolean): GameObject | undefined {
		for (let i = 0; i < this.children.length; i++) {
			const child = this.children[i];
			if (filter(child)) {
				return child;
			}
		}
	}
}
