addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event));
});

async function getValueFromKV(key) {
  let value = await kv_namespace.get(key);
  return value;
}

async function authorizeAccount() {
  authValue = await getValueFromKV("AUTH_HEADER");
  authHeader = {
    Authorization: authValue,
  };
  const account = await fetch(
    "https://api.backblazeb2.com/b2api/v2/b2_authorize_account",
    {
      headers: authHeader,
    }
  ).then((res) => res.json());
  //https://www.backblaze.com/b2/docs/b2_authorize_account.html
  //Note, the auth will be valid for 24 hours.  right now this is called every time, on next update should be stored in KV and ideally cron'd
  return account;
}

async function serveAsset(event) {
  const url = new URL(event.request.url);

  //First determine if the cache has the object already
  const cache = caches.default;
  let response = await cache.match(event.request);

  if (!response) {
    //get api url and auth from b2
    auth = await authorizeAccount();

    //Set target URL
    const url = new URL(event.request.url);
    //Bucket name comes from KV
    bucketName = await getValueFromKV("BUCKET_NAME");
    //Request URL to B2 must contain the download URL returned from authorize account, then the path /file/{bucketname}/{pathname}
    requestURL = new URL(
      auth.downloadUrl + "/file/" + bucketName + url.pathname
    );
    params = { b2CacheControl: "public,max-age=86400" };
    requestURL.search = new URLSearchParams(params).toString();
    requestHeaders = {
      Authorization: auth.authorizationToken,
    };
    response = await fetch(requestURL, {
      headers: requestHeaders,
    });

    response = new Response(response.body, response);
    response.headers.set("Cache-Control", "public,max-age=86400");

    event.waitUntil(cache.put(event.request, response.clone()));
  }
  return response;
}

async function handleRequest(event) {
  let response = await serveAsset(event);
  if (response.status > 399) {
    response = new Response(response.statusText, { status: response.status });
  }
  return response;
}
