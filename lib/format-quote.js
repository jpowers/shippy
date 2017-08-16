
serviceMap = (service) => {
  switch (service) {
    case 'STANDARD_OVERNIGHT':
      return 'FedEx Overnight';
    case 'FEDEX_2_DAY':
      return 'FedEx 2 Day';
    case 'FEDEX_EXPRESS_SAVER':
      return 'FedEx Saver (3 Day)';
    case 'FEDEX_GROUND':
      return 'FedEx Ground';
    default:
      console.log('Service "%s" not used', service);
    return '';
  }
};


//FedEx Overnight
//FedEx 2 Day
//Fedex Saver (3 day)
//FedEx Ground $9.33
//USPS
module.exports = (rates) => {
  let count = 1;
  return rates.reduce((allRates, rate) => {
    if (serviceMap(rate.service)) {
      allRates.push(`${count}\) ${serviceMap(rate.service)}: \$${rate.list_rate}`);
      count++;
    }
    return allRates;
  }, []);
}
