const predict = require('eightball');
const Discord = require("discord.js");
const commando = require('discord.js-commando');

module.exports = class eightBallCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: '8ball',
            group: 'misc',
            aliases: ['eightball'],
            memberName: '8ball',
            description: 'Roll a magic 8ball',
            examples: ['8ball Is Favna a genius coder?', 'eightball Is Pyrrha best waifu?'],
            guildOnly: false,

            args: [{
                key: 'question',
                prompt: '8ball what?',
                type: 'string'
            }]
        });
    }

    async run(msg, args) {
        let eightBallEmbed = new Discord.RichEmbed();
        eightBallEmbed
            .setColor('#71CD40')
            .addField(':question: Question', args.question, false)
            .addField(':8ball: 8ball', predict(), false)
        msg.embed(eightBallEmbed)
    };
};