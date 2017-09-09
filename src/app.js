const discordSelfBot = require('./discordSelfBot.js');
const keys = require('./auth.json');

function start() {
    (new discordSelfBot(keys.token).init());
}

start();