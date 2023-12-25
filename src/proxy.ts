import * as b2 from './b2'
import {ExecutionContext,Request,CacheStorage} from '@cloudflare/workers-types'
export default {

	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		const url = new URL(request.url);
		if (url.pathname == "/"){
			// Mostly for testing, but prevents garbage requests from going to B2
			return new Response("ok",{status:200})
		}
		//First determine if the cache has the object already
		let cache = caches as CacheStorage
		let response = await cache.default.match(request) as Response;
		if (!response) {
			const account = await b2.authorizeAccount(env.AUTH_HEADER)
			//If the authorize account call results in 401, this can only mean the AUTH_HEADER is incorrect. 
			if (account.status == 401){
				return new Response("Error: AUTH_HEADER is not correctly set",{status:401})
			}
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
			// Send request to Backblaze based on authorized account and configured params
			let b2Response = await fetch(requestURL, {
				headers: requestHeaders,
			});
			let response = new Response(b2Response.body, b2Response);
			response.headers.set("Cache-Control", env.CACHE_CONTROL);
			await cache.default.put(request, response.clone())
			if (response) {
				return response
			}
			else {
				// If there is no response, assume upstream issue
				// It should be extremely rare that this condition occurs.
				return new Response(null,{status:504})
			}
		}
		// Respond from cache in the event that it was found.
		return response

	},
};
