const test = require('tape')
const discordSelfBot = require('../discordSelfBot.js')

const token = process.env.DISCORD_TOKEN || require('../auth.json').token;

test('connect & disconnect', (t) => {
    t.timeoutAfter(15000);
    t.ok(token, 'discord token should be set');

    const bot = new discordSelfBot(token);
    t.false(bot.isReady, 'bot should not be ready');
    bot.init();
    // wait for it to be ready
    const si = setInterval(() => {
        if (bot.isReady) {
            bot.deinit()
            clearInterval(si);
            t.end();
        }
    }, 5000);
});