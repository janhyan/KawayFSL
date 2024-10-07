const AWS = require('aws-sdk');
const jwt = require('jsonwebtoken');
const jwkToPem = require('jwk-to-pem');

const cognito = new AWS.CognitoIdentityServiceProvider({ region: 'ap-northeast-1' });
const userPoolId = 'ap-northeast-1_OGlyXCemj';

let cachedKeys;

const getPublicKeys = async () => {
  if (!cachedKeys) {
    const { Keys } = await cognito.listUserPoolClients({
      UserPoolId: userPoolId
    }).promise();

    cachedKeys = Keys.reduce((agg, current) => {
      const jwk = { kty: current.kty, n: current.n, e: current.e };
      const key = jwkToPem(jwk);
      agg[current.kid] = { instance: current, key };
      return agg;
    }, {});
  }
  return cachedKeys;
};

const isTokenValid = async (token) => {
  try {
    const publicKeys = await getPublicKeys();
    const tokenSections = (token || '').split('.');
    const headerJSON = Buffer.from(tokenSections[0], 'base64').toString('utf8');
    const { kid } = JSON.parse(headerJSON);

    const key = publicKeys[kid];
    if (key === undefined) {
      throw new Error('Claim made for unknown kid');
    }

    const claim = await jwt.verify(token, key.key, { algorithms: ['RS256'] });
    if (claim['cognito:groups'].includes('VerifiedUsers') && claim.token_use === 'id') {
      return true;
    }
    return false;
  } catch (error) {
    console.error(error);
    return false;
  }
};

exports.handler = async (event) => {
  const request = event.Records[0].cf.request;
  const headers = request.headers;

  if (headers.authorization && headers.authorization[0].value) {
    const token = headers.authorization[0].value.split(' ')[1];
    const isValid = await isTokenValid(token);

    if (isValid) {
      return request;
    }
  }

  // Return a 401 Unauthorized response if the token is not valid
  return {
    status: '401',
    statusDescription: 'Unauthorized',
    body: 'Unauthorized',
    headers: {
      'www-authenticate': [{ key: 'WWW-Authenticate', value: 'Bearer' }],
      'content-type': [{ key: 'Content-Type', value: 'text/plain' }]
    }
  };
};