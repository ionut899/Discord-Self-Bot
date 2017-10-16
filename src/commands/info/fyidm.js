const Discord = require("discord.js");
const commando = require('discord.js-commando');
const moment = require('moment');

module.exports = class fyidmCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'fyidm',
            group: 'info',
            aliases: ['dm', 'discmatch', 'dmatch'],
            memberName: 'fyidm',
            description: 'Returns a list of users who have the same discriminator (the 4 digits after the username) as you. fyidm is short for "Find your ID Mate"',
            examples: ['fyidm'],
            guildOnly: false
        });
    }

    async run(msg, args) {
        const fyidmEmbed = new Discord.RichEmbed();

        var discrimMatches = msg.client.users.filter(u => u.discriminator === msg.author.discriminator);
        discrimMatches.delete(msg.author.id);
        var matchEntries = discrimMatches.entries()

        fyidmEmbed
            .setColor('#FF0000')
            .setTitle('Uses with matching discriminator')
            .setFooter(`Discriminator match checked on ${moment().format('MMMM Do YYYY HH:mm:ss')}`);

        for (let i = 0; i < discrimMatches.size; i++) {
            var match = matchEntries.next().value[1];
            if (discrimMatches.size <= 8) {
                fyidmEmbed.addField('Username', match.username, true)
                fyidmEmbed.addField('Discriminator', match.discriminator, true)
                fyidmEmbed.addField('UserID', match.id, true)
            } else {
                fyidmEmbed.addField('Username || Discriminator || UserID', `${match.username} || ${match.discriminator} || ${match.id}`, false);
            }
        }

        msg.embed(fyidmEmbed);
    };
};