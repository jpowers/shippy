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

exports.buyLabel = (shipmentId, rateId) => {
  console.log("BUY ", shipmentId, rateId);
  return api.Shipment.retrieve(shipmentId).then(s => {
    return s.buy(rateId);
  });
};

exports.updateAddress = (addrId, name, phone) => {
  return api.Address.retrieve(addrId).then(address => {
    console.log('ADDRESS ', address)
    address.name = name;
    address.phone = phone;
    return new api.Address({
      street1: address.street1,
      name: name,
      phone: phone,
      //street2: 'FLOOR 5',
      city: address.city,
      state: address.stateAbbr,
      zip: address.postalCode,
      country: address.countryAbbr
  })
    //return address.save();
  });  
};

exports.processQuote = (to, from, weight) => {
  //console.log(to,from,weight);
  const toAddress = new api.Address({
    street1: `${to.streetNumber} ${to.streetAbbr}`,
    name: to.name,
    phone: to.phone,
    //street2: 'FLOOR 5',
    city: to.city,
    state: to.stateAbbr,
    zip: to.postalCode,
    country: to.countryAbbr
  });
  const fromAddress = new api.Address({
    street1: `${from.streetNumber} ${from.streetAbbr}`,
    name: 'Vermonster',
    phone: '6174822020',
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
