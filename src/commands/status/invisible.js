const commando = require('discord.js-commando');

module.exports = class dndCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'invisible',
            group: 'status',
            aliases: ['invis', 'offline', 'grey', 'gray'],
            memberName: 'invisible',
            description: 'Set your status to invisible',
            examples: ['invis', 'invisible'],
            guildOnly: false
        });
    }

    async run(msg) {
        msg.author.setStatus('invisible')
            .then(msg.reply('Status set to invisible'))
            .catch((e) => console.error(e));
    };
};