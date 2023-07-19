type BasicAuthType = `Basic ${string}`
type B2DownloadUrl = URL
type AuthorizationToken = string
type Account = {
    downloadUrl: B2DownloadUrl,
    authorizationToken: AuthorizationToken
}
