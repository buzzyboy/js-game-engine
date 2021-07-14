import {GameObject} from './GameObject';

export class World extends GameObject {
	public pendingPropertyUpdates: IPendingPropertyUpdate[] = [];

	constructor() {
		super();
	}

	public markAsModified(gameObject: GameObject, properties: string | string[]) {
		properties = Array.isArray(properties) ? properties : [properties];
		let propertyUpdate = this.pendingPropertyUpdates.find(x => x.gameObject === gameObject);
		if (!propertyUpdate) {
			propertyUpdate = {
				gameObject,
				properties: [],
			};
			this.pendingPropertyUpdates.push(propertyUpdate);
		}
		properties.forEach(p => {
			if (propertyUpdate.properties.indexOf(p) < 0) {
				propertyUpdate.properties.push(p)
			}
		});
	}
}

interface IPendingPropertyUpdate {
	gameObject: GameObject;
	properties: string[];
}
