const zalgo = require('zalgotxt');
const commando = require('discord.js-commando');

module.exports = class eightBallCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'zalgo',
            group: 'misc',
            aliases: ['fukup'],
            memberName: 'zalgo',
            description: 'Fuck up text using Zalgo',
            examples: ['zalgo HE COMES'],
            guildOnly: false,

            args: [{
                key: 'txt',
                prompt: 'What should I zalgolize?',
                type: 'string'
            }]
        });
    }

    async run(msg, args) {
        msg.delete();
        msg.say(zalgo(args.txt));
    };
};