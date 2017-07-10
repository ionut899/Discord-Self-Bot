const commando = require('discord.js-commando');
module.exports = class checkCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'check',
            group: 'store',
            memberName: 'check',
            description: 'Checks current message store - outputs to <#299694375682703361>',
            guildOnly: false,
        });
    }

    async run(msg) {
        msg.delete();
        // Purposedly left empty. This is only a dummy file to add the command to registry
    };
};