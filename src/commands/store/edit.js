const commando = require('discord.js-commando');
module.exports = class deleteCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'edit',
            group: 'store',
            memberName: 'edit',
            description: 'Edits a message using message store',
            guildOnly: false,
        });
    }

    async run(msg) {
        msg.delete();
        // Purposedly left empty. This is only a dummy file to add the command to registry
    };
};