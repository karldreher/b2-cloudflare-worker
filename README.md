# b2-cloudflare-worker

The purpose of this project is to provide a Cloudflare worker which **reads** from a private Backblaze B2 bucket, to provide an easy way to utilize Cloudflare as a CDN for any kind of **static** content.

The service is deployed as a Cloudflare Worker and uses a Cloudflare KV store for parameters.

## Running the development server

Requires Wrangler.

```bash
wrangler dev
```

## KV

The application expects to interact with a Cloudflare KV store with several values defined:

| Name          | Description                                                                                         | Example Value                             |
| ------------- | --------------------------------------------------------------------------------------------------- | ----------------------------------------- |
| `AUTH_HEADER` | This is a user:password pair, base64 encoded.  The word "Basic" and a space must prepend the entry. | `Basic dXNlcm5hbWU6cGFzc3dvcmQK`          |
| `ENDPOINT`    | The URL for files in the bucket, either the "S3" or "Freindly" URL.  The value should **omit** the slash.     | `https://s3.us-west-002.backblazeb2.com` |


The namespace can be named as desired, but wrangler.toml must have `binding = "kv_namespace"` as demonstrated in the example; `kv_namespace` is how the KV is accessed by the script. (according to the values of `id` and `preview_id`)

## Generating the authorization value

1. Within Backblaze, add an application key for your bucket.
2. Select the appropriate bucket (not "All" unless you know what you're doing)
3. Select "Read Only"
4. Provide a duration less than 1000 days in the future, specified in seconds. Since this will need to rotate, it is reccomended (for this application's purpose) a maximum value of `86399999`.

Upon creating the app key, use the **values** for `keyID` and `applicationKey` by Backblaze to generate the base-64 encoded Basic authorization header: 
```bash
$ AUTH=$(echo keyID:applicationKey | base64) 
$ VALUE="Basic $AUTH"
$ echo $VALUE
Basic dXNlcm5hbWU6cGFzc3dvcmQK
```
Use the contents of `$VALUE` (including "Basic ") as generated following the steps above, within the KV store value `AUTH_HEADER`

Both the username:password pair and authorization value should be treated as a **secret**.  Within Backblaze it is not possible to change or view the keys after creation, they must be regenerated as new keys!

## Deployment

### Bootstrapping the KV

You can use Wrangler and the supplied `./tools/init-kv.json` to initiate the KV with "placeholder" values.  It is still necessary to create the KV store (store**s** if you utilize a preview environment), then specify them by namespace with `wrangler` to instantiate them: 

```bash
wrangler kv:bulk put --namespace 12345678910 ./tools/init-kv.json
```

### Deploying the worker
```bash
wrangler publish
```
More TBD..