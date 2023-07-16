async function authorizeAccount(auth: BasicAuthType): Promise<Account> {
    const getAccount = await fetch(
        "https://api.backblazeb2.com/b2api/v2/b2_authorize_account",
        {
            headers: {
                Authorization: auth,
            },
        }
    )
    //todo better typing https://www.backblaze.com/apidocs/b2-authorize-account
    const j = await getAccount.json() as any;
    //https://www.backblaze.com/b2/docs/b2_authorize_account.html
    //Note, the auth will be valid for 24 hours.  right now this is called every time, on next update should be stored in KV and ideally cron'd
    const account = { downloadUrl: j.downloadUrl, authorizationToken: j.authorizationToken } as Account
    return account;
}

export { authorizeAccount }
