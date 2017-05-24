const commando = require('discord.js-commando');

module.exports = class dndCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'online',
            group: 'status',
            aliases: ['here', 'green'],
            memberName: 'online',
            description: 'Set your status to online',
            examples: ['online', 'here'],
            guildOnly: false
        });
    }

    async run(msg) {
        msg.author.setStatus('online')
            .then(msg.reply('Status set to online'))
            .catch((e) => console.error(e));
    };
};