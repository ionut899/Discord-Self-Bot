const commando = require('discord.js-commando');
const Discord = require("discord.js");

module.exports = class debugCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'debug',
            aliases: ['bug'],
            group: 'info',
            memberName: 'debug',
            description: 'Gets channel or rolenames and their IDs',
            examples: ['debug listchannels', 'debug lisroles'],
            guildOnly: true,

            args: [{
                key: 'buggerType',
                prompt: 'Do you want to debug `channels` or `roles`?',
                type: 'string'
            }]
        });
    }

    async run(msg, args) {
        let bugger = args.buggerType

        let debugEmbed = new Discord.RichEmbed();
        debugEmbed.setColor("#FF0000")
        debugEmbed.setTitle(`The ${bugger.slice(4)} on this server are as follows`);

        if (bugger === "channels") {
            let channelNames = msg.guild.channels.filter(function (textFilter) {
                return textFilter.type === 'text';
            }).map(cn => cn.name);
            let channelIDs = msg.guild.channels.filter(function (textFilter) {
                return textFilter.type === 'text';
            }).map(cid => cid.id);

            debugEmbed.addField("Channel name", channelNames, true);
            debugEmbed.addBlankField(true);
            debugEmbed.addField("channel ID", channelIDs, true);

        } else if (bugger === "roles") {
            let roleIDs = msg.guild.roles.map(rid => rid.id);
            let roleNames = msg.guild.roles.map(rn => rn.name).slice(1);
            roleNames.unshift("Everyone");
            debugEmbed.addField("Role name", roleNames, true);
            debugEmbed.addBlankField(true);
            debugEmbed.addField("Role ID", roleIDs, true);
        } else {
            msg.reply('That is not a valid debugger option. Either `channels` or `roles`')
        };
        msg.embed(debugEmbed);
    };
};