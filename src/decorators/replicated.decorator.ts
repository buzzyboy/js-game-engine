import {GameObject} from '../classes/GameObject';

/**
 * Replicated properties will be synced from server and client
 */
export function replicated(): PropertyDecorator {
	return (target: typeof GameObject, propertyKey: string) => {
		const transformedPropertyKey = transformPropertyKey(propertyKey);
		Object.defineProperty(target, propertyKey, {
			get() {
				return this[transformedPropertyKey];
			},
			set(this: GameObject, v: any) {
				if (v === (this as any)[transformedPropertyKey]) {
					// No change
					return;
				}
				(this as any)[transformedPropertyKey] = v;
				if (this.replicates) {
					this.world.markAsModified(this, propertyKey);
				}
			}
		});
		const prototype = target.constructor.prototype;
		if (!prototype.__replicatedProperties__) {
			prototype.__replicatedProperties__ = [];
		}
		prototype.__replicatedProperties__.push(propertyKey);
	};
}


function transformPropertyKey(propertyKey: string) {
	return `__${propertyKey}__`;
}
