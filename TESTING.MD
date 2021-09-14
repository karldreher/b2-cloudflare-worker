# Testing

This document gives instructions for developers to utilize the automated tests.  

The automated tests utilize Mocha, Supertest, and Chai.  Because of that, they also require Node.js be installed.  (The project itself is raw Javascript and does not require Node.)

## Setup
Some manual setup is required (right now) to run the test automation.

It is required to follow the instructions in [README.MD](README.md) to set up the Backblaze B2 bucket, the Application Key, and the basic setup required to test Workers in cloudflare.  This also includes setting up the wrangler.toml in the top-level of this repo. 

After this is done: 

```bash
# copy the test.env.example to test.env
cp test/test.env.example test/test.env
```
Configure the values within `test/test.env` as directed within the comments in the file.

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

If you are interested in submitting a PR, it is reccomended that you paste the (passing) test results with your submission, e.g. in a comment.  This is a workaround until CI tests become more viable.
