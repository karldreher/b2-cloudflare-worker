import handleProxy from './proxy';

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		return handleProxy.fetch(request, env, ctx);
	},
};
