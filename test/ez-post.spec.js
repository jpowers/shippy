require('dotenv').load();
const expect = require('chai').expect;
const ep = require('../lib/easy-post');

describe('get rates', function() {
  before(function() {
  });

  it('should be valid rates', function() {
    this.timeout(15000);
    const from = '75 broad st boston ma';
    const to = '218 school st somerville ma';
    const weight = 2;
    return Promise.all([ep.validateAddress(from), ep.validateAddress(to)])
    .then(([fromA, toA]) => ep.processQuote(toA.exact[0], fromA.exact[0], weight))
    .then((shipment) => {
      //console.log(shipment.rates);
      expect(shipment.rates).to.be.a('array');
    });
  });
});
