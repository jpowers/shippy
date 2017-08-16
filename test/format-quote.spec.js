require('dotenv').load();
const expect = require('chai').expect;
const formatQuote = require('../lib/format-quote');

describe('get rates', function() {
  const rates = formatQuote([
    { service: 'STANDARD_OVERNIGHT', list_rate: 10.0 },
    { service: 'FEDEX_2_DAY', list_rate: 5.0 },
    { service: 'FOO', list_rate: 5.0 }
  ]);

  it('have 2 rates', function() {
    console.log('RATES ', rates);
    expect(rates.length).to.equal(2);
  });
});
