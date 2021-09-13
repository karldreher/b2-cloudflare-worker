const config = require('./test.env')
const request = require("supertest")(config.endpoint);
const expect = require("chai").expect;

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
    
    it('Repeats the request and gets a cache hit', async function () {
        const response = await request.get(config.filename);
        expect(response.status).to.eql(200);
        expect(response.headers['cf-cache-status']).to.equal('HIT');
    });


});
describe("Request an non-existing file from the bucket", function () {
    it('Returns 404 on an invalid request', async function () {
        const response = await request.get(config.invalidfile);
        expect(response.status).to.eql(404);
    });
    
});
