addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function getValueFromKV(key) {
  let value = await kv_namespace.get(key);
  return value;
}

async function handleRequest(request) {
  
  const url = new URL(request.url);
  const { pathname } = url;
  baseURL = await getValueFromKV('ENDPOINT')
  requestURL = baseURL + url.pathname
  response = await fetch(requestURL)
  contentType = response.headers.get('Content-Type')
  // Reconstruct the Response object to make its headers mutable.
  response = new Response(response.body, response)
  response.headers.set("Cache-Control", "max-age=1500")

  return response
}
