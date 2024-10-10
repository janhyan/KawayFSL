const {
  CognitoIdentityProviderClient
} = require("@aws-sdk/client-cognito-identity-provider");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const jwkToPem = require("jwk-to-pem");

const cognito = new CognitoIdentityProviderClient({ region: "ap-northeast-1" });
const userPoolId = "ap-northeast-";
const jwksUrl = `https://cognito-idp.ap-northeast-1.amazonaws.com/${userPoolId}/.well-known/jwks.json`;

let cachedKeys;

const getPublicKeys = async () => {
  if (!cachedKeys) {
    // Fetch the keys from the well-known JWKs URL
    const { data } = await axios.get(jwksUrl);
    const { keys } = data;

    // Transform the JWKs into PEM format and cache them
    cachedKeys = keys.reduce((agg, current) => {
      const pem = jwkToPem(current);
      agg[current.kid] = { instance: current, key: pem };
      return agg;
    }, {});
  }
  return cachedKeys;
};

const isTokenValid = async (token) => {
  try {
    const publicKeys = await getPublicKeys();
    const tokenSections = (token || "").split(".");
    const headerJSON = Buffer.from(tokenSections[0], "base64").toString("utf8");
    const { kid } = JSON.parse(headerJSON);

    const key = publicKeys[kid];
    if (!key) {
      throw new Error("Claim made for unknown kid");
    }

    const claim = jwt.verify(token, key.key, { algorithms: ["RS256"] });

    // Check if 'cognito:groups' is defined before calling .includes()
    if (
      claim["cognito:groups"] &&
      claim["cognito:groups"].includes("VerifiedUsers") &&
      claim.token_use === "id"
    ) {
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

  // Handle preflight OPTIONS request
  if (request.method === "OPTIONS") {
    return {
      status: "200",
      statusDescription: "OK",
      headers: {
        "access-control-allow-origin": [
          { key: "Access-Control-Allow-Origin", value: "*" },
        ],
        "access-control-allow-methods": [
          { key: "Access-Control-Allow-Methods", value: "GET, OPTIONS" },
        ],
        "access-control-allow-headers": [
          {
            key: "Access-Control-Allow-Headers",
            value: "Authorization, Content-Type",
          },
        ],
        "access-control-max-age": [
          { key: "Access-Control-Max-Age", value: "3600" },
        ],
      },
    };
  }

  if (headers.authorization && headers.authorization[0].value) {
    const token = headers.authorization[0].value.split(" ")[1];
    const isValid = await isTokenValid(token);

    console.log(token);

    if (isValid) {
      return request;
    }
  }

  // Return a 401 Unauthorized response if the token is not valid
  return {
    status: "401",
    statusDescription: "Unauthorized",
    body: "Unauthorized",
    headers: {
      "www-authenticate": [{ key: "WWW-Authenticate", value: "Bearer" }],
      "content-type": [{ key: "Content-Type", value: "text/plain" }],
    },
  };
};
