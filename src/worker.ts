import handleProxy from './proxy';
import {Request,ExecutionContext} from '@cloudflare/workers-types'

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		return handleProxy.fetch(request, env, ctx);
	},
};
