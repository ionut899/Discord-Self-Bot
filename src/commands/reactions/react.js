const Discord = require("discord.js");
const commando = require('discord.js-commando');
const path = require('path');

module.exports = class reactCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'react',
            group: 'reactions',
            memberName: 'react',
            description: 'React with an image',
            examples: ['react cry'],
            guildOnly: false,

            args: [{
                key: 'image',
                prompt: 'What image do you want to react with?',
                type: 'string'
            }]
        });
    }

    async run(msg, args) {
        const image = args.image;
        await msg.channel.send({
            file: path.join(__dirname, `/images/${image}.jpg`)
        });
        await msg.delete();
    }
};