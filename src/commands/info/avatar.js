const commando = require('discord.js-commando');
const Discord = require("discord.js");

module.exports = class AvatarCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'avatar',
            aliases: ['ava'],
            group: 'info',
            memberName: 'avatar',
            description: 'Gets the avatar from a user',
            examples: ['avatar @Favna#2846', 'avatar Favna'],
            guildOnly: false,

            args: [{
                key: 'member',
                label: 'user',
                prompt: 'What user would you like to get the avatar from?',
                type: 'member'
            }]
        });
    }

    async run(msg, args) {
        const member = args.member;
        const user = member.user;
        await msg.say(user.displayAvatarURL);
    }
};