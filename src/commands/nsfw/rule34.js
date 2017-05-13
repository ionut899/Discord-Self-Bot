const Discord = require("discord.js");
const commando = require('discord.js-commando');
const booru = require('booru');

module.exports = class mathCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'rule34',
            group: 'nsfw',
            aliases: ['r34'],
            memberName: 'rule34',
            description: 'Find NSFW Content on Rule34',
            examples: ['rule34 Pyrrha Nikos'],
            guildOnly: false,

            args: [{
                key: 'nsfwtags',
                prompt: 'What do you want to find NSFW for?',
                type: 'string'
            }]
        });
    }

    async run(msg, args) {

        booru.search("r34", args.nsfwtags.split(' '), {
                limit: 1,
                random: true
            })
            .then(booru.commonfy)
            .then(images => {
                // Show juicy NSFW image
                for (let image of images) {
                    msg.edit(`Score: ${images[0].common.score}\nImage: ${images[0].common.file_url}`);
                };
            }).catch(err => {
                if (err.name === 'booruError') {
                    return console.error(err.message);
                } else {
                    return console.error(err);
                };
            });
    }
};