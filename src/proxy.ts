import * as b2 from './b2'
export default {

	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		const url = new URL(request.url);
		//First determine if the cache has the object already
		const cache = caches.default
		let response = await cache.match(request);
		if (!response) {
			const account = await b2.authorizeAccount(env.AUTH_HEADER)
			//Bucket name comes from environment variable
			//Request URL to B2 must contain the download URL returned from authorize account, then the path /file/{bucketname}/{pathname}
			const requestURL = new URL(
				account.downloadUrl + "/file/" + env.BUCKET_NAME + url.pathname
			);
			const params = { b2CacheControl: env.CACHE_CONTROL };
			requestURL.search = new URLSearchParams(params).toString();
			const requestHeaders = {
				Authorization: account.authorizationToken,
			};
			let response = await fetch(requestURL, {
				headers: requestHeaders,
			});
			response = new Response(response.body, response);
			response.headers.set("Cache-Control", env.CACHE_CONTROL);
			await cache.put(request, response.clone())
			if (response) {
				return response
			}
			else {
				return new Response(null)
			}
		}
		// Catches and appropriately responds with 404 in case this response is received from upstream.
		return response

	},
};
