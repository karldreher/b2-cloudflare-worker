type BasicAuthType = `Basic ${string}`
type B2DownloadUrl = URL
type AuthorizationToken = string
/**
 * @prop downloadUrl: The download URL for the bucket, obtained from b2_authorize_account
 * @prop authorizationToken: The 24-hour token from b2_authorize_account.  
 * @prop status: The HTTP status from b2_authorize_account API.
 */
type Account = {
    downloadUrl: B2DownloadUrl| null,
    authorizationToken: AuthorizationToken,
    status: number
}
type B2AuthResponse = {
    apiInfo?: {
        storageApi?: {
            downloadUrl?: B2DownloadUrl
        }
    },
    authorizationToken?: string
}
