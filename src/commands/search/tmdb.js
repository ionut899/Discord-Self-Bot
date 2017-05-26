const Discord = require("discord.js");
const commando = require('discord.js-commando');
const auth = require('../../auth.json');
const tmdb = require('moviedb')(auth.TheMovieDBV3ApiKey);
const moment = require('moment');

module.exports = class movieCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'movie',
            group: 'search',
            aliases: ['tmdb'],
            memberName: 'movie',
            description: 'Find movie info on omdb',
            examples: ['movie Ocean\'s Eleven 2001', 'tmdb Ocean\'s Eleven 2001'],
            guildOnly: false,

            args: [{
                key: 'name',
                prompt: 'Please supply movie title',
                type: 'string'
            }]
        });
    }

    async run(msg, args) {
        tmdb.searchMovie({
            query: args.name
        }, async(nameErr, nameRes) => {
            if (nameErr) return console.error(nameErr);

            var movieID = nameRes.results[0].id;
            tmdb.movieInfo({
                id: movieID
            }, (idErr, idRes) => {
                let movieEmbed = new Discord.RichEmbed();
                movieEmbed
                    .setImage(`http://image.tmdb.org/t/p/w640${idRes.backdrop_path}`)
                    .setColor('#00D474')
                    .addField('Title', `[${idRes.title}](https://www.themoviedb.org/movie/${idRes.id})`, true)
                    .addField('Release Date', moment(new Date(idRes.release_date)).format('MMMM Do YYYY'), true)
                    .addField('Runtime', `${idRes.runtime} minutes`, true)
                    .addField('User Score', idRes.vote_average, true)
                    .addField('Genres', idRes.genres.map(n => n.name), true)
                    .addField('Production Companies', idRes.production_companies.length === 0 ? idRes.production_companies.map(n => n.name) : 'Unavailable on TheMovieDB', true)
                    .addField('Status', idRes.status, true)
                    .addField('Collection', idRes.belongs_to_collection !== null ? idRes.belongs_to_collection.name : 'none', true)
                    .addField('Home Page', idRes.homepage !== '' ? `[Click Here](idRes.homepage)` : 'none', true)
                    .addField('IMDB Page', idRes.imdb_id_id !== '' ? `[Click Here](http://www.imdb.com/title/${idRes.imdb_id})` : 'none', true)
                    .addField('Description', idRes.overview);
                msg.embed(movieEmbed);
            })
        });
    };
};