const Discord = require("discord.js");
const commando = require('discord.js-commando');
const moment = require('moment');
const omdb = require('omdb');

module.exports = class movieCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'movie',
            group: 'search',
            aliases: ['omdb'],
            // patterns: [/\>\>\s*([\w\ `~\!\@\#\$\%\^\&\*\(\)\-\_\=\+\{\}\\\|\;\:\'\"\,\<\.\>\/\?]+)\S*\s*\<\</gi],
            memberName: 'omdb',
            description: 'Find movie info on omdb',
            examples: ['movie Ocean\'s Eleven,2001', 'omdb Ocean\'s Eleven,2001' /*, '>>Ocean\'s Eleven,2001<<'*/ ],
            guildOnly: false,

            args: [{
                key: 'movieData',
                prompt: 'Please supply movie title and year delimited wiht a ,',
                type: 'string'
            }]
        });
    }

    async run(msg, args) {
        var movieData = args.movieData.split(',');
        // console.log(msg.patternMatches);

        let omdbEmbed = new Discord.RichEmbed();
        // let startMarks = msg.content.indexOf(">>"); 
        // let endMarks = msg.content.indexOf("<<"); 
        // startMarks !== -1 ? movieData = msg.content.slice(startMarks + 2, endMarks).split(',') : null;

        omdbEmbed
            .setColor("#c61530")
            .setFooter(`A selfbot by Favna | ${moment(new Date()).format('MMMM Do YYYY HH:mm')}`, "https://i.imgur.com/Ylv4Hdz.jpg");
        omdb.get({
            title: movieData[0],
            year: movieData[1]
        }, true, async function (err, movie) {
            if (err) {
                // When an error occurs log it and cancel
                await console.error(err);
            }
            if (!movie) {
                // When no movie is found tell the user and cancel
                await msg.reply(`No movie or serie found!\nOriginal Message: ${msg.content}`);
            }

            omdbEmbed.setAuthor(`${movie.title} info from OMDb`, 'https://i.imgur.com/xhpROOr.png')

            // Sometimes there is no poster in which case the property is null. If there is a poster we use it as image
            movie.poster !== null ? omdbEmbed.setImage(movie.poster) : null;

            omdbEmbed
                .addField("Title", movie.title, true)
                .addField("First aired", moment(movie.released).format("MMMM Do YYYY"), true);

            // For future movies there may not yet be a rating
            movie.rated !== null ? omdbEmbed.addField("Rating", movie.rated, true) : omdbEmbed.addField("Rating", "Not yet rated", true);
            omdbEmbed
                .addField("Genre(s)", movie.genres.join(', '), true)
                .addField("Type", movie.type, true);

            // If the director is null we write none
            movie.director !== null ? omdbEmbed.addField("Director", movie.director, true) : omdbEmbed.addField("Director", "none", true);

            // For unreleased movies there is no IMDB rating
            movie.imdb.rating !== null ? omdbEmbed.addField("IMDB Rating", movie.imdb.rating, true) : omdbEmbed.addField("IMDB Rating", "No score yet", true);

            // Sometimes there is no rotten tomatoes rating, in which case we leave this out
            movie.tomato !== undefined ? omdbEmbed.addField("Rotten Tomatoes", movie.tomato, true) : omdbEmbed.addField("Rotten Tomatoes", "Not available on OMDb", true);

            // Sometimes there is no Metacritic rating, in which case we leave this out
            movie.metacritic !== null ? omdbEmbed.addField("Metacritic", movie.metacritic, true) : omdbEmbed.addField("Metacritic", "Not available on OMDb", true);

            omdbEmbed.addField("Plot", movie.plot, false);

            await msg.embed(omdbEmbed);
        });

    };
};