const commando = require('discord.js-commando');
module.exports = class clearCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'check',
            group: 'store',
            memberName: 'check',
            description: 'Checks current message store - outputs to #private-bot-logs',
            guildOnly: false,
        });
    }

    async run(msg) {
        msg.delete();
        // Stubbed. This is only a dummy file to add the command to registry
    };
};