import {ClientGameApplication} from './client/classes/ClientGameApplication';

const app = new ClientGameApplication();
app.joinServer('ws://localhost:6969');

(window as any).app = app;

const circularReplacer = () => {

	// Creating new WeakSet to keep
	// track of previously seen objects
	const seen = new WeakSet();

	return (key: string, value: any) => {

		// If type of value is an
		// object or value is null
		if (typeof(value) === "object"
			&& value !== null) {

			// If it has been seen before
			if (seen.has(value)) {
				return;
			}

			// Add current value to the set
			seen.add(value);
		}

		// return the value
		return value;
	};
};

setInterval(() => {
	document.body.innerText = JSON.stringify(app.world.children[0], circularReplacer(), 2);
}, 100);
