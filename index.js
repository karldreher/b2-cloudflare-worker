addEventListener('fetch', event => {
  event.respondWith(handleRequest(event))
})

async function getValueFromKV(key) {
  let value = await kv_namespace.get(key);
  return value;
}

async function serveAsset(event) {
  const url = new URL(event.request.url)
  const cache = caches.default
  let response = await cache.match(event.request)
  if (!response) {
    //Set target URL
    baseURL = await getValueFromKV('ENDPOINT')
    const url = new URL(event.request.url);
    requestURL = baseURL + url.pathname

    response = await fetch(requestURL)
    console.log(new Map(response.headers))

    response = new Response(response.body, response)
    response.headers.set("Cache-Control", "public,max-age=86400")

    event.waitUntil(cache.put(event.request, response.clone()))
  }
  return response
}


async function handleRequest(event) {
  let response = await serveAsset(event)
  if (response.status > 399) {
    response = new Response(response.statusText, { status: response.status })
  }
  return response
}
