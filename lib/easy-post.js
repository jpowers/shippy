const addressValidator = require('address-validator');
const Easypost = require('@easypost/api');
const api = new Easypost(process.env.EASY_POST_KEY);

exports.validateAddress = (address) => {
  return new Promise((resolve, reject) => {
    addressValidator.validate(address, addressValidator.match.streetAddress, (err, exact, inexact) => {
      if (err) {
        reject(err); // an error occurred
      } else {
        resolve({'inexact': inexact, 'exact': exact});
      }
    });
  });
};

exports.processQuote = (to, from, weight) => {
  //console.log(to,from,weight);
  const toAddress = new api.Address({
    company: 'Vermonster',
    street1: `${to.streetNumber} ${to.streetAbbr}`,
    //street2: 'FLOOR 5',
    city: to.city,
    state: to.stateAbbr,
    zip: to.postalCode,
    country: to.countryAbbr
  });
  const fromAddress = new api.Address({
    company: 'Vermonster',
    street1: `${from.streetNumber} ${from.streetAbbr}`,
    //street2: ,
    city: from.city,
    state: from.stateAbbr,
    zip: from.postalCode,
    country: from.countryAbbr
  });
  const parcel = new api.Parcel({
    weight: weight
  });
  const shipment = new api.Shipment({
    to_address: toAddress,
    from_address: fromAddress,
    parcel: parcel
  });
  return shipment.save();
};
