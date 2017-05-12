const commando = require('discord.js-commando');
const Discord = require("discord.js");

module.exports = class DebugCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'cysource',
            aliases: ['cysrc', 'source'],
            group: 'links',
            memberName: 'cysource',
            description: 'Gets the link to a cydia source using the Cydia Share URL API',
            examples: ['cysource <repo_url>'],
            guildOnly: false,

            args: [{
                key: 'repo',
                prompt: 'What is the repo URL?',
                type: 'string'
            }]
        });
    }

    async run(msg, args) {
        let sourceURL = args.repo;
        await msg.say(`To add this repo directly to cydia click the following URL: https://cydia.saurik.com/api/share#?source=${sourceURL}`);
    }

};