const config = require('./test.env')
const request = require("supertest")(config.endpoint);
const expect = require("chai").expect;
const toml = require('toml');
const fs = require('fs')

function delay(interval) 
{
   return it('Wait before continuing', done => 
   {
      setTimeout(() => done(), interval)

   }).timeout(interval + 100)
}

describe("Request a valid file", function () {
    it("Gets 200 response", async function () {
        const response = await request.get(config.filename);
        expect(response.status).to.eql(200);
    });

    delay(5000)
   
    describe("Repeat the request", function () {
        it('Response gets a cache hit', async function () {
            const response = await request.get(config.filename);
            expect(response.status).to.eql(200);
            expect(response.headers['cf-cache-status']).to.equal('HIT');
        });
        it('Response cache-control matches the configured value in wrangler.toml', async function () {
            const response = await request.get(config.filename);
            expect(response.status).to.eql(200);
            //TODO this needs to pull from the wrangler.toml file, not done yet.
            cacheControlValue = toml.parse(fs.readFileSync('./wrangler.toml')).vars.CACHE_CONTROL
            expect(response.headers['cache-control']).to.equal(cacheControlValue);
        });
    });


});
describe("Request an non-existing file from the bucket", function () {
    it('Returns 404 on an invalid request', async function () {
        const response = await request.get(config.invalidfile);
        expect(response.status).to.eql(404);
    });
    
});
