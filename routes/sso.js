// This is /routes/sso.js
var saml = require('express-saml2');
var express = require('express');
var router = express.Router();
var ServiceProvider = saml.ServiceProvider;
var IdentityProvider = saml.IdentityProvider;

// Configure your endpoint for IdP-initiated / SP-initiated SSO
var sp = ServiceProvider('./metadata_sp.xml');
var idp = IdentityProvider('./onelogin_metadata_487043.xml');

// Release the metadata publicly
router.get('/metadata', function(req, res, next) {
	res.header('Content-Type','text/xml').send(sp.getMetadata());
});

// Access URL for implementing SP-init SSO
router.get('/spinitsso-redirect', function(req, res) {
	sp.sendLoginRequest(idp,'redirect',function(url) {
		res.redirect(url);
	});
});

// If your application only supports IdP-initiated SSO, just make this route is enough
// This is the assertion service url where SAML Response is sent to
router.post('/acs', function(req, res, next) {
	sp.parseLoginResponse(idp, 'post', req, function(parseResult) {
		res.send('Validate the SAML Response successfully !');
	});
});

module.exports = router;