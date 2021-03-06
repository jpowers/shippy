//FedEx Overnight
//FedEx 2 Day
//Fedex Saver (3 day)
//FedEx Ground $9.33
//USPS
exports.serviceLookup = (service) => {
  switch (service) {
    case 'STANDARD_OVERNIGHT':
      return 'FedEx Overnight';
    case 'FEDEX_2_DAY':
      return 'FedEx 2 Day';
    case 'FEDEX_EXPRESS_SAVER':
      return 'FedEx Saver (3 Day)';
    case 'FEDEX_GROUND':
      return 'FedEx Ground';
    case 'First':
      return 'USPS First (2 day)';
    default:
      console.log('Service "%s" not used', service);
    return '';
  }
};

exports.availibleRates = (rates) => {
  let count = 1;
  return rates.reduce((allRates, rate) => {
    if (exports.serviceLookup(rate.service)) {
      allRates.push({
        id: rate.id,
        formated: `${count}\) ${exports.serviceLookup(rate.service)}: \$${rate.list_rate}`,
        service: exports.serviceLookup(rate.service)
      });
      count++;
    }
    return allRates;
  }, []);
};
