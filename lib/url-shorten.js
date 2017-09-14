const GoogleUrl = require( 'google-url' );
const googleUrl = new GoogleUrl( { key: process.env.GOOGLE_API_TOKEN });
module.exports = (shipment) => {
  return new Promise((resolve, reject) => {
    googleUrl.shorten(shipment.postage_label.label_url, ( err, shortUrl ) => {
    // shouldrtUrl should be http://goo.gl/BzpZ54 
      if (err) {
        reject(err);
      } else {
        resolve(shortUrl);
      }
    });
  });
}
