const commando = require('discord.js-commando');

module.exports = class idleCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'idle',
            group: 'status',
            aliases: ['away', 'orange'],
            memberName: 'idle',
            description: 'Set your status to idle',
            examples: ['idle', 'away'],
            guildOnly: false
        });
    }

    async run(msg) {
        msg.author.setStatus('idle')
            .then(msg.reply('Status set to idle'))
            .catch((e) => console.error(e));
    };
};