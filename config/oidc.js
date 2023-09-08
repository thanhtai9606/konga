var _ = require('lodash');
const auth_issuer = 'https://keycloak-uat.becamex.com.vn/realms/becamexidc/protocol/openid-connect';
module.exports = {
    issuer: auth_issuer,
    authorizationURL: auth_issuer + '/auth',
    tokenURL: auth_issuer + '/token',
    userInfoURL: auth_issuer + '/userinfo',
    clientID: 'Kong_App',
    clientSecret: 'FFTNAKSNJVQwkNVV3sznsTxZzq6zLz5R',
    callbackURL: 'http://localhost:1337/auth/callback',
};
