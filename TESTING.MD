# Testing

This document gives instructions for developers to utilize the automated tests.

The automated tests utilize Mocha, Supertest, and Chai.  

## Setup

It is recommended that you utilize NVM to manage your Node versions for this project.  Once you do, you can utilize `nvm use` to set the Node version specified by `.nvmrc`.  From there, install the packages using `npm install`.

When developing locally, it is required to follow the instructions in [README.MD](README.md) to set up the Backblaze B2 bucket, the Cloudflare Application Key and Token, and the basic setup required to test Workers in cloudflare.

This also includes setting up the wrangler.jsonc in the top-level of this repo. When setting `CACHE_CONTROL` within wrangler.jsonc, it is reccomended to use a small `max-age` value (e.g. 1000) so the test can be run repeatedly, while verifying that the first test gets an uncached hit.

After this is done:

```bash
# copy the .dev.vars.example to .dev.vars
cp test/.dev.vars.example test/.dev.vars
```
Configure the value within `test/.dev.vars` as directed within the comments in the file.

## Running the automated tests
After following the instructions above:

1. If working locally, start development server first
   - This must be done in a separate shell, to keep the server running.

```bash

npm run dev
```

2. Run the tests after installing the dependencies.

```bash
npm install
npm test
```

## Understanding and using the results

If the tests pass, congratulations! :tada:

Otherwise, please refer to the setup and/or fix the code.

If you are interested in submitting a PR, it is reccomended that you paste the (passing) test results with your submission, e.g. in a comment.
