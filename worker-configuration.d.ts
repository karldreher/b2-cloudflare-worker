interface Env {
	/**
	 * The Authorization header for the B2 bucket.  This is a **secret** which is a
	 * Base64 encoded keyID:applicationKey pair, prepended with "Basic ".
	 *
	 * @example
	 * ```
	 * Basic dXNlcm5hbWU6cGFzc3dvcmQK
	 * ```
	 */
	AUTH_HEADER: BasicAuthType;
	/**
	 * Cloudflare B2 Bucket name which you wish to proxy.
	 * It is intended that this is a Private bucket.
	 * This is not necessarily, but can be, a secret.
	 *
	 * @example
	 * ```
	 * my-cool-bucket
	 * ```
	 */
	BUCKET_NAME: string;
	/**
	 * Cache-control value which influences how this proxy caches content.
	 * It is also passed to Backblaze B2.
	 * Typically, you want this to be very large in using this proxy.
	 * @example
	 * ```
	 * public,max-age=172800
	 * ```
	 *
	 */
	CACHE_CONTROL: string
}
