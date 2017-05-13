const Discord = require("discord.js");
const commando = require('discord.js-commando');
const superagent = require('superagent');
const querystring = require('querystring');
const auth = require('../../auth.json');
const googleapikey = auth.googleapikey;
const imageEngineKey = auth.imageEngineKey;

module.exports = class imageCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'image',
            group: 'search',
            aliases: ['img'],
            memberName: 'image',
            description: 'Find something through Google Images',
            examples: ['img Pyrrha Nikos', 'image Pyrrha Nikos'],
            guildOnly: false,

            args: [{
                key: 'query',
                prompt: 'What do you want to find images of?',
                type: 'string'
            }]
        });
    }

    async run(msg, args) {
        const query = args.query //is basically the search sent by you
            .replace(/(who|what|when|where) ?(was|is|were|are) ?/gi, '')
            .split(' ')
            .map(x => encodeURIComponent(x))
            .join('+');
        let safe = msg.channel.name.includes('nsfw') ? 'off' : 'medium';
        let QUERY_PARAMS = {
            searchType: 'image',
            key: googleapikey,
            cx: imageEngineKey,
            safe
        };
        return superagent.get(`https://www.googleapis.com/customsearch/v1?${querystring.stringify(QUERY_PARAMS)}&q=${encodeURI(query)}`)
            .then((res) => msg.edit(res.body.items[0].link))
            .catch(() =>
                superagent.get(`https://www.google.com/search?tbm=isch&gs_l=img&safe=${safe}&q=${encodeURI(query)}`)
                .then((res) => {
                    const $ = cheerio.load(res.text);
                    const result = $('.images_table').find('img').first().attr('src');
                    return result !== undefined ? msg.edit(result) : msg.edit('**Something went wrong with the result, perhaps only nsfw results were found outside of an nsfw channel**');
                })
            ).catch((err) => {
                msg.edit('**No Results Found**');
                console.error(err);
            });
    }
};