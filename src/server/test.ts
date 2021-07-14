import {ServerGameApplication} from './classes/ServerGameApplication';
import {GameObject} from '../classes/GameObject';
import {replicated} from '../decorators/replicated.decorator';

const app = new ServerGameApplication();
const world = app.world;

class TestGameObject extends GameObject {
	@replicated()
	test = 5;

	constructor() {
		super();

		this.replicates = true;
		setInterval(() => {
			this.test = Math.floor(Math.random() * 5);
		}, 1000);
	}
}

const go = new TestGameObject();

world.addChild(go);

app.start();
