# b2-cloudflare-worker

The purpose of this project is to provide a Cloudflare worker which **reads** from a private Backblaze B2 bucket, to provide an easy way to utilize Cloudflare as a CDN for any kind of **static** content.

The service is deployed as a Cloudflare Worker and uses environment variables for parameters.

## Running the development server

Requires Wrangler.

```bash
wrangler dev
```
See note about [Environment Variables in Development Environment](###Environment-Variables-in-Development-Environment) below.  


## Environment Variables

The application expects to receive environment variables from Cloudflare to set the environment.  The variables are described below.  

| Name          | Description                                                                                                                                          | Example Value                    |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------- |
| `AUTH_HEADER` | This is a user:password pair, base64 encoded. The word "Basic" and a space must prepend the entry. See below for instructions on getting this value. | `Basic dXNlcm5hbWU6cGFzc3dvcmQK` |
| `BUCKET_NAME` | The name of the bucket in Backblaze B2.                                                                                                              | `my-cool-bucket`                 |
`CACHE_CONTROL` | The time that cache should be valid for the files in the bucket.  This affects both the B2 cache as well as Cloudflare.  It is reccomended to set this within wrangler.toml. | "public,max-age=172800"

See more details about setting these values in a production deployment in [Deployment](##Deployment).

### Environment Variables in Development Environment
When using variables in conjunction with `wrangler dev`, they *must* be set according to the following.  

```toml
[vars]
BUCKET_NAME = "my-cool-bucket"
AUTH_HEADER = "Basic dXNlcm5hbWU6cGFzc3dvcmQK"
CACHE_CONTROL = "public,max-age=172800" #This should be here anyway, it is included for completeness.
```

**Excercise caution** doing this with `AUTH_HEADER`, as you should only keep this variable there while conducting development.  **Only** set the variables using `wrangler secret` or through the Cloudflare console.


## Deployment

### Generating the authorization value

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

Use the contents of `$VALUE` (including "Basic ") as generated following the steps above, within the environment variable `AUTH_HEADER`.  This can be done through the Cloudflare console or using wrangler:

```bash
wrangler secret put AUTH_HEADER
```

Both the username:password pair and authorization value should be treated as a **secret**. Within Backblaze it is not possible to change or view the keys after creation, they must be regenerated as new keys!

### Setting the bucket name

The bucket name of the B2 bucket needs to be expressed with the environment variable `BUCKET_NAME`.  
This can be done through the Cloudflare console or using wrangler:
```bash
wrangler secret put BUCKET_NAME
```

If the bucket name is not considered secret (or if your deployment is appropriately protected) you can put this in your wrangler.toml:
```toml
[vars]
BUCKET_NAME = "my-cool-bucket"
```
### Cache-control

The environment variable `CACHE_CONTROL` **must** be in your wrangler.toml:
```toml
[vars]
CACHE_CONTROL = "public,max-age=172800"
```

`max-age` can be a fairly high value if your content does not change often.  The value is in seconds.

### Deploying the worker

```bash
wrangler publish
```

### Usage

Utilize the worker's endpoint to access your files in your private bucket!
This can be done in the browser, through a shell program, or anything that uses HTTPS.  
The worker handles the middleware between your browser, the Cloudflare cache, and the B2 bucket.

```bash
curl my-secret-bucket.example.workers.dev/pictures-of-cats/fatkitty.jpg
```

## Testing
See [TESTING.MD](TESTING.MD).
