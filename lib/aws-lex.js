const AWS = require('aws-sdk');
AWS.config.update({
  "region": 'us-east-1',
  "accessKeyId": process.env.AWS_ACCESS_KEY_ID,
  "secretAccessKey": process.env.AWS_SECRET_ACCESS_KEY,
});

//https://channels.lex.us-east-1.amazonaws.com/twilio-sms/webhook/b434a7c3-0cb9-4f9d-b7fe-eb81268fa714
const lexruntime = new AWS.LexRuntime();

const postText = (params) => {
  return new Promise((resolve, reject) => {
    lexruntime.postText(params, function(err, data) {
      if (err) reject(err); // an error occurred
      else resolve(data);           // successful response
    });
  });
};

module.exports = (userId, message, session) => {
  const lexParams = {
    botAlias: '$LATEST', /* required */
    botName: 'Shippy', /* required */
    userId: userId, /* required */
    inputText: message
  };
  console.log("SESSION: ", session);
  if (session !== undefined) {
    lexParams.sessionAttributes = session;
  }
  return postText(lexParams);
};
