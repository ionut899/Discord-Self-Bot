const commando = require('discord.js-commando');
module.exports = class clearCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'clear',
            group: 'store',
            memberName: 'clear',
            description: 'Clears the message storage',
            guildOnly: false,
        });
    }

    async run(msg) {
        msg.delete();
        // Purposedly left empty. This is only a dummy file to add the command to registry
    };
};