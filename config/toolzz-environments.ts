import environments from './toolzz-environments.json';

export class ToolzzEnvironments {
	static readonly api = {
		prod: environments.api.prod,
		homol: environments.api.homol,
	};

	static readonly core = {
		prod: environments.core.prod,
		release: environments.core.release,
		homol: environments.core.homol,
	};

	static readonly legacy = {
		prod: environments.legacy.prod,
		release: environments.legacy.release,
		homol: environments.legacy.homol,
	};
}
