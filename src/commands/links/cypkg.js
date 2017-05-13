const commando = require('discord.js-commando');
const Discord = require("discord.js");

module.exports = class cydiaPackageCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'cypkg',
            aliases: ['pkg'],
            group: 'links',
            memberName: 'cypkg',
            description: 'Gets the link to a cydia package using the Cydia Share URL API',
            examples: ['cypkg <repo_url> <package_name>'],
            guildOnly: false,

            args: [{
                    key: 'repo',
                    prompt: 'What is the repo URL?',
                    type: 'string'
                },
                {
                    key: 'package',
                    prompt: 'And what is the package name?',
                    type: 'string'
                }
            ]
        });
    }

    async run(msg, args) {
        const sourceURL = args.repo;
        const packageName = args.package;
        await msg.say(`To find this package on Cydia follow this URL: https://cydia.saurik.com/api/share#?source=${sourceURL}/&package=${packageName}`);
    };
};