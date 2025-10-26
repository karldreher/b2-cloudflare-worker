async function authorizeAccount(auth: BasicAuthType): Promise<Account> {
    const getAccount = await fetch(
        "https://api.backblazeb2.com/b2api/v4/b2_authorize_account",
        {
            headers: {
                Authorization: auth,
            },
        }
    )
    if (getAccount.status == 401){
        return { downloadUrl: null, authorizationToken: "none", status: getAccount.status } as Account
    }
    const j = await getAccount.json() as B2AuthResponse;
    //https://www.backblaze.com/b2/docs/b2_authorize_account.html
    const account = { downloadUrl: j.downloadUrl, authorizationToken: j.authorizationToken, status: getAccount.status } as Account
    return account;
}

export { authorizeAccount }
