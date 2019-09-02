const ClientOAuth2 = require('client-oauth2')


const discordAuth = new ClientOAuth2({
    clientId: '617436016143499284',
    authorizationUri: 'https://discordapp.com/api/oauth2/authorize',
    redirectUri: 'http://localhost:3000/authorize',
    state: 'totally_secure',
    scopes: ['identify'],
})

const discordAuthCallback = (uri) => discordAuth.token.getToken(uri)

export default {
    "auth": discordAuth,
    "callback": discordAuthCallback,
}