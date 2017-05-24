const commando = require('discord.js-commando');

module.exports = class dndCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'dnd',
            group: 'status',
            aliases: ['busy', 'red'],
            memberName: 'dnd',
            description: 'Set your status to Do Not Disturb',
            examples: ['dnd', 'busy'],
            guildOnly: false
        });
    }

    async run(msg) {
        msg.author.setStatus('dnd')
            .then(msg.reply('Status set to do not disturb'))
            .catch((e) => console.error(e));
    };
};