// Require dependancies
const superagent = require('superagent');
const cheerio = require('cheerio');
const querystring = require('querystring');
const booru = require('booru');
const request = require("request");
const moment = require('moment');
const urban = require('urban');
const YouTube = require('youtube-node');
const scalc = require('scalc');
const malware = require('malapi').Anime;
const ordinal = require('ordinal').english;
const countdown = require('countdown');
const cydia = require('cydia-api-node');
const omdb = require('omdb');

// import the discord.js and npm modules
const Discord = require("discord.js");
const auth = require("./auth.json");
const delimiter = auth.prefix;
const client = new Discord.Client();
const youtube = new YouTube();
const cydiaRegex = /\<\<\s*([\w\ `~\!\@\#\$\%\^\&\*\(\)\-\_\=\+\{\}\\\|\;\:\'\"\,\<\.\>\/\?]+)\S*\s*\>\>/gi;
const omdbRegex = /\>\>\s*([\w\ `~\!\@\#\$\%\^\&\*\(\)\-\_\=\+\{\}\\\|\;\:\'\"\,\<\.\>\/\?]+)\S*\s*\<\</gi;

var messageStore = [];

// Getting keys
client.login(auth.token);
youtube.setKey(auth.googleapikey);
youtube.addParam('type', 'video');
youtube.addParam('relevanceLanguage', 'en');
youtube.addParam('safeSearch', 'moderate');
youtube.addParam('regionCode', 'NL');
const googleapikey = auth.googleapikey;
const imageEngineKey = auth.imageEngineKey;
const searchEngineKey = auth.searchEngineKey;
const ownerID = auth.ownerID;
const messageStoreChannelID = auth.storeChannel;

client.on("message", msg => {
    if (msg.author.id !== ownerID) return;
    if (msg.author.id === ownerID && msg.channel.id !== messageStoreChannelID) {
        const content = msg.content.toLowerCase();
        const args = msg.content.split(' ').slice(1);
        const storeChannel = client.channels.get(messageStoreChannelID);

        let currentStoreSize = messageStore.length;
        if (currentStoreSize === 10) {
            messageStore.pop();
            for (let ID in messageStore) {
                messageStore[ID].id = messageStore[ID].id + 1
            }
            messageStore.unshift({
                id: 1,
                message: msg
            });
        } else {
            for (let ID in messageStore) {
                messageStore[ID].id = messageStore[ID].id + 1
            }
            messageStore.unshift({
                id: 1,
                message: msg
            });
        };

        if (content.startsWith(delimiter + "edit")) {
            messageStore.shift();
            msg.delete();

            let indicator = args.slice(0, 1).toString();
            let newContent = args.slice(1).join(' ');
            if (!indicator.match(/[0-9]+/)) {
                return client.channels.get(messageStoreChannelID).send(`You forgot an indicator ID\nContent of message: ${msg.content}\nTime of command: ${moment(new Date).format('MMMM Do YYYY | HH:mm:ss')}`);
            };
            messageStore[indicator.toString()].message.edit(newContent);
        };

        if (content.startsWith(delimiter + "delete")) {
            messageStore.shift();
            msg.delete();

            let indicator = args.slice(0, 1).toString();
            if (!indicator.match(/[0-9]+/)) {
                return client.channels.get(messageStoreChannelID).send(`You forgot an indicator ID\nContent of message: ${msg.content}\nTime of command: ${moment(new Date).format('MMMM Do YYYY | HH:mm:ss')}`);
            };
            messageStore[indicator].message.delete();
        };

        if (content.startsWith(delimiter + "clear")) {
            msg.delete();
            messageStore = [];
        };

        if (content.startsWith(delimiter + "check")) {
            messageStore.shift();
            msg.delete();

            let storeEmbed = new Discord.RichEmbed();

            storeEmbed.setColor('#FF0000');
            storeEmbed.setFooter(`Store log from ${moment(new Date).format('MMMM Do YYYY | HH:mm:ss')}`);
            messageStore.length === 0 ? storeEmbed.addField('Location in store', '0', true) : storeEmbed.addField('Location in store', positionFormatter(messageStore.length), true);
            messageStore.length === 0 ? storeEmbed.addField('Content of message', 'none', true) : storeEmbed.addField('Content of message', messageStore.map(mcont => mcont.message.content), true);
            storeChannel.send({
                embed: storeEmbed
            });
        };

        // Cydia Tweak Search
        if (cydiaRegex.test(content)) {
            let cydiaEmbed = new Discord.RichEmbed();
            let startMarks = content.indexOf("<<");
            let endMarks = content.indexOf(">>");
            let cydiaQuery = msg.content.slice(startMarks + 2, endMarks);

            let preMarksText = msg.content.slice(0, startMarks);
            let postMarksText = msg.content.slice(endMarks + 2);

            cydiaEmbed.setColor("#5D2E1F");
            cydiaEmbed.setAuthor("Tweak Info", "http://i.imgur.com/OPZfdht.png");
            cydiaEmbed.setFooter("A selfbot by Favna", "https://i.imgur.com/Ylv4Hdz.jpg");

            msg.edit("**Searching cydia package...**").then(() => {
                cydia.getAllInfo(cydiaQuery).then((pkginfo) => {
                    if (pkginfo === false) {
                        msg.edit(`**Tweak/Theme \`${cydiaQuery}\` not found!**\nOriginal Message: ${msg.content}`);
                        return;
                    }
                    let pkgPrice = pkginfo.price === 0 ? "Free" : pkginfo.price;
                    let pkgDisplayName = pkginfo.display;
                    let pkgName = pkginfo.name;
                    let pkgSummary = pkginfo.summary;
                    let pkgVersion = pkginfo.version;
                    let pkgSection = pkginfo.section;
                    let pkgRepoName = pkginfo.reponame;
                    let pkgRepoLink = pkginfo.repolink;

                    cydiaEmbed.addField("Display Name", pkgDisplayName, true);
                    cydiaEmbed.addField("Package Name", pkgName, true);
                    cydiaEmbed.addField("Description", pkgSummary, true);
                    cydiaEmbed.addField("Version", pkgVersion, true);
                    cydiaEmbed.addField("Section", pkgSection, true);
                    cydiaEmbed.addField("Price", pkgPrice, true);
                    cydiaEmbed.addField("Link", `[Click Here](http://cydia.saurik.com/package/${pkgName})`, true);
                    cydiaEmbed.addField("Repo", `[${pkgRepoName}](https://cydia.saurik.com/api/share#?source=${pkgRepoLink})`, true);


                    msg.edit(preMarksText + cydiaQuery + postMarksText, {
                        embed: cydiaEmbed
                    });

                });
            });
        }

        if (content.startsWith(delimiter + 'emojis')) {
            let guildData = client.guilds.get(args[0])
            let guildMojis = guildData.emojis;
            let guildMojiNames = guildMojis.map(gmoji => gmoji.name);
            let emojisSetOne = [];
            let emojisSetTwo = [];
            let emojisSetThree = [];
            let emojisEmbed = new Discord.RichEmbed();
            for (i = 0; i < guildMojiNames.length; i++) {

                if (emojisSetOne.toString().length <= 900) {
                    emojisSetOne.push(`\`:${guildMojiNames[i]}:\` for ${guildMojis.find('name', guildMojiNames[i])}`)
                } else if (emojisSetTwo.toString().length <= 900) {
                    emojisSetTwo.push(`\`:${guildMojiNames[i]}:\` for ${guildMojis.find('name', guildMojiNames[i])}`)
                } else {
                    emojisSetThree.push(`\`:${guildMojiNames[i]}:\` for ${guildMojis.find('name', guildMojiNames[i])}`)
                }
            }
            emojisEmbed
                .setColor('#FF0000')
                .setFooter(`A Selfbot by Favna | Command issued at ${moment(new Date()).format('MMMM Do YYYY HH:mm:ss')}`, 'http://i.imgur.com/4U9oMS0.png')
                .setDescription(`Emojis from the server \`${guildData.name}\``);
            emojisSetOne.length !== 0 ? emojisEmbed.addField('\u200b', emojisSetOne, true) : emojisEmbed.addField('This server has no custom emojis', 'Although they should totally get some', true);
            emojisSetTwo.length !== 0 ? emojisEmbed.addField('\u200b', emojisSetTwo, true) : null;
            emojisSetThree.length !== 0 ? emojisEmbed.addField('\u200b', emojisSetThree, true) : null;

            if (args[1] === 'this') {
                msg.edit(args.slice(2).join(' '), {
                    embed: emojisEmbed
                });
            } else {
                msg.delete();
                storeChannel.send(args.slice(1).join(' '), {
                    embed: emojisEmbed
                });
            }
        }

        // OMDB Movie Search
        if (omdbRegex.test(content)) {
            movieSearch(msg);
        }

        // Search Engines
        // Google Regular Search
        if (content.startsWith(delimiter + "google")) {
            let searchQuery = msg.content.slice(10);
            msg.edit('**Searching...**').then(() => {
                const query = args.join(' ') //is basically the search sent by you
                    .replace(/(who|what|when|where) ?(was|is|were|are) ?/gi, '')
                    .split(' ')
                    .map(x => encodeURIComponent(x))
                    .join('+');

                const QUERY_PARAMS = {
                    key: googleapikey,
                    limit: 1,
                    indent: true,
                    query,
                };
                return superagent.get(`https://kgsearch.googleapis.com/v1/entities:search?${querystring.stringify(QUERY_PARAMS)}`)
                    .then((res) => {
                        let result = res.body.itemListElement[0];
                        if (!result || !result.result || !result.result.detailedDescription) return Promise.reject('NO RESULT');
                        result = result.result;
                        let types = result['@type'].map(t => t.replace(/([a-z])([A-Z])/g, '$1 $2'));
                        if (types.length > 1) types = types.filter(t => t !== 'Thing');
                        const title = `${result.name} ${types.length === 0 ? '' : `(${types.join(', ')})`}`;
                        const LEARN_MORE_URL = result.detailedDescription.url.replace(/\(/, '%28').replace(/\)/, '%29');
                        const description = `${result.detailedDescription.articleBody} [Learn More...](${LEARN_MORE_URL})`;
                        return msg.edit(result.detailedDescription.url, title, description);
                    })
                    .catch((knowledgeErr) => {
                        let safe = 'high';
                        let QUERY_PARAMS = {
                            key: googleapikey,
                            cx: searchEngineKey,
                            safe,
                            q: encodeURI(query),
                        };
                        return superagent.get(`https://www.googleapis.com/customsearch/v1?${querystring.stringify(QUERY_PARAMS)}`)
                            .then((res) => {
                                if (res.body.queries.request[0].totalResults === '0') return Promise.reject(new Error('NO RESULTS'));
                                return msg.edit(res.body.items[0].link);
                            })
                            .catch(() => {
                                const SEARCH_URL = `https://www.google.com/search?safe=${safe}&q=${encodeURI(query)}`;
                                return superagent.get(SEARCH_URL).then((res) => {
                                    const $ = cheerio.load(res.text);
                                    let href = $('.r').first().find('a').first().attr('href');
                                    if (!href) return Promise.reject(new Error('NO RESULTS'));
                                    href = querystring.parse(href.replace('/url?', ''));
                                    return msg.edit(href.q);
                                })
                            })
                            .catch((searchErr) => {
                                msg.edit('**No Results Found!**');
                                console.error(`A regular search error occured!\n================================\n${searchErr}`);
                            });
                    })
            })
        }

        // Google Image search
        if (content.startsWith(delimiter + "image")) {
            const imageQuery = args.join(' ') //is basically the search sent by you
                .replace(/(who|what|when|where) ?(was|is|were|are) ?/gi, '')
                .split(' ')
                .map(x => encodeURIComponent(x))
                .join('+');
            let safe = msg.channel.name.includes('hentai') ? 'off' : 'medium';
            let QUERY_PARAMS = {
                searchType: 'image',
                key: googleapikey,
                cx: imageEngineKey,
                safe
            };

            msg.edit('**Searching...**').then(() => {
                return superagent.get(`https://www.googleapis.com/customsearch/v1?${querystring.stringify(QUERY_PARAMS)}&q=${encodeURI(imageQuery)}`)
                    .then((res) => msg.edit(res.body.items[0].link))
                    .catch(() =>
                        superagent.get(`https://www.google.com/search?tbm=isch&gs_l=img&safe=${safe}&q=${encodeURI(imageQuery)}`)
                        .then((res) => {
                            const $ = cheerio.load(res.text);
                            const result = $('.images_table').find('img').first().attr('src');
                            return result !== undefined ? botMessage.edit(result) : botMessage.edit('**Something went wrong with the result, perhaps only nsfw results were found outside of an nsfw channel**');
                        })
                    ).catch((err) => {
                        msg.edit('**No Results Found**');
                        console.error(err);
                    });
            });
        }

        // Youtube Search
        if (content.startsWith(delimiter + "youtube") || content.startsWith(delimiter + "yt")) {
            var youtubeEmbed = new Discord.RichEmbed();
            youtubeEmbed.setColor("#ff0000");

            msg.edit('**Searching while prioritizing videos..**').then(() => {
                youtube.search(args.join(' '), 1, function (error, result) {
                    if (error) {
                        msg.edit("An error occurred, please contact <@112001393140723712>");
                    } else {
                        if (!result || !result.items || result.items.length < 1) {
                            msg.edit("No Results found");
                        } else {
                            youtubeEmbed.setAuthor(`Youtube Search Result for: ${args.join(' ')}`, 'https://i.imgur.com/BPFqnxz.png');
                            youtubeEmbed.setImage(result.items[0].snippet.thumbnails.high.url);
                            youtubeEmbed.setURL(`https://www.youtube.com/watch?v=${result.items[0].id.videoId}`)
                            youtubeEmbed.addField('Title', result.items[0].snippet.title, true);
                            youtubeEmbed.addField('URL', `[Click Here](https://www.youtube.com/watch?v=${result.items[0].id.videoId})`, true)
                            youtubeEmbed.addField('Channel', `[${result.items[0].snippet.channelTitle}](https://www.youtube.com/channel/${result.items[0].snippet.channelId})`, true);
                            youtubeEmbed.addField('Published Date', moment(result.items[0].snippet.publishedAt).format('MMMM Do YYYY'), true);
                            result.items[0].snippet.description !== '' ? youtubeEmbed.addField('Description', result.items[0].snippet.description, false) : youtubeEmbed.addField('Description', 'No description', false);

                            return msg.edit(`https://www.youtube.com/watch?v=${result.items[0].id.videoId}`, {
                                embed: youtubeEmbed
                            });
                        }
                    }
                });
            });
        }

        // Urban Dictionary search
        if (content.startsWith(delimiter + "urban")) {
            let urbanQuery = urban(args.join(' '));
            let urbanEmbed = new Discord.RichEmbed;

            msg.edit('**Opening Dictionary...**').then(() => {
                urbanQuery.first(function (json) {
                    if (json == undefined) {
                        return msg.edit(`**No Results Found!**\nOriginal Message: ${msg.content.slice(9)}`);
                    }


                    urbanEmbed.setAuthor(`Urban Search - ${json.word}`, `https://i.imgur.com/miYLsGw.jpg`).setColor("#E86121").setFooter(`${json.word} defined by PyrrhaBot`, "http://i.imgur.com/4U9oMS0.png");
                    urbanEmbed.addField("Definition", json.definition, false);
                    urbanEmbed.addField("Example", json.example, false);
                    urbanEmbed.addField("Permalink", json.permalink, false);

                    msg.edit(args.join(' '), {
                        embed: urbanEmbed
                    });
                });
            });
        }

        // Userinfo of a user
        if (content.startsWith(delimiter + "userinfo")) {
            userInfo(msg);
        }

        // Word define
        if (content.startsWith(delimiter + "define")) {
            let defineQuery = msg.content.slice(10);
            let defineEmbed = new Discord.RichEmbed();

            msg.edit('**Opening Dictionary...**').then(() => {
                superagent.get(`https://glosbe.com/gapi/translate?from=en&dest=en&format=json&phrase=${defineQuery}`)
                    .then((res) => res.body)
                    .then((res) => {
                        if (res.tuc == undefined) {
                            msg.edit(`**No results found!**\nOriginal Message: ${msg.content.slice(10)}`)
                            return;
                        }
                        const final = [`**Definitions for __${defineQuery}__:**`];
                        for (let [index, item] of Object.entries(res.tuc.filter(t => t.meanings)[0].meanings.slice(0, 5))) {

                            item = item.text
                                .replace(/\[(\w+)[^\]]*](.*?)\[\/\1]/g, '_')
                                .replace(/<i>|<\/i>/g, '');
                            final.push(`**${(parseInt(index) + 1)}:** ${item}`);
                        }
                        defineEmbed.setColor("#6984C4");
                        defineEmbed.setDescription(final);
                        defineEmbed.setFooter("PyrrhaBot", "http://i.imgur.com/4U9oMS0.png")
                        msg.edit(msg.content.slice(10), {
                            embed: defineEmbed
                        });
                    })
                    .catch((err) => {
                        console.error(err);
                        msg.edit(`**No results found!**\nOriginal Message: ${msg.content.slice(10)}`)
                    });
            });
        }

        // MyAnimeList Searching
        if (content.startsWith(delimiter + "anime")) {
            let animeQuery = msg.content.slice(7);
            let animeEmbed = new Discord.RichEmbed();

            msg.edit('**Searching...**').then(() => {
                malware.fromName(animeQuery).then(anime => {
                        let japName = anime.alternativeTitles.japanese;
                        let engName = anime.alternativeTitles.english;
                        let score = anime.statistics.score.value;
                        let type = anime.type;
                        var episodeCount = anime.episodes;
                        let status = anime.status;
                        let synopsis = anime.synopsis;
                        let image = anime.image;
                        let animeUrl = `https://myanimelist.net/anime/${anime.id}`;

                        animeEmbed.setAuthor(animeQuery, "https://myanimelist.cdn-dena.com/img/sp/icon/apple-touch-icon-256.png");
                        animeEmbed.setColor("#448f86");
                        animeEmbed.setImage(image);
                        animeEmbed.setFooter("Anime info by PyrrhaBot", "http://i.imgur.com/4U9oMS0.png");
                        animeEmbed.setTimestamp();
                        animeEmbed.setURL(animeUrl);

                        if (japName != null) {
                            animeEmbed.addField("Japanese name", japName, true);
                        } else {
                            animeEmbed.addField("Japanese name", "None", true);
                        };

                        if (engName != null) {
                            animeEmbed.addField("English name", engName, true);
                        } else {
                            animeEmbed.addField("English name", "None", true);
                            animeEmbed.addBlankField(true);
                        };


                        if (synopsis.length >= 1024) {
                            animeEmbed.addField("Synposis", `The synopsis for this anime exceeds the maximum length, check the full synopsis on myanimelist.\nSynopsis Snippet:\n${synopsis.slice(0,500)}`, false);
                        } else {
                            animeEmbed.addField("Synposis", synopsis, false);
                        };

                        score !== "" ? animeEmbed.addField("Score", score, true) : animeEmbed.addField("Score", 'Score unknown', true)
                        animeEmbed.addField("Episodes", episodeCount, true);
                        animeEmbed.addField("Status", status, true);
                        animeEmbed.addField("URL", animeUrl, true);

                        msg.edit(msg.content.slice(9), {
                            embed: animeEmbed
                        });
                    })
                    .catch((err) => {
                        console.error(err);
                        msg.edit(`**No results found!**\nOriginal Message: ${msg.content.slice(9)}`)
                    });
            });
        }

        if (content.startsWith(delimiter + 'gs')) {
            gameSearch(msg, args);
        };
 

        if (content.startsWith(delimiter + "opinion")) {
            msg.channel.send({
                file: "./pyrrha/images/opinion.gif"
            });
            msg.delete();
        }

        if (content.startsWith(delimiter + "cp")) {
            msg.channel.send({
                file: "./pyrrha/images/cp.jpg"
            });
            msg.delete();
        }

        if (content.startsWith(delimiter + "cry")) {
            msg.channel.send({
                file: "./pyrrha/images/pyrrha_cry.jpg"
            });
            msg.delete();
        }

        // Custom stuff
        if (content.startsWith(delimiter + "embed")) {
            embed(msg);
        }

        if (content.startsWith(delimiter + "calc")) {
            let toCalc = msg.content.slice(8);
            msg.edit('**Calculating...**').then(() => {
                let result = scalc(toCalc);
                msg.edit(`\`The answer to ${toCalc} is ${result}\``)
            });
        }

        // NSFW
        if (content.startsWith(delimiter + "r34")) {
            if (args.length === 0) {
                msg.edit("You forgot to supply tags");
                return;
            };

            booru.search("r34", args, {
                    limit: 1,
                    random: true
                })
                .then(booru.commonfy)
                .then(images => {
                    // Show juicy NSFW image
                    for (let image of images) {
                        msg.edit(`Score: ${image.common.score}\nImage: ${image.common.file_url}`);
                    }
                })
                .catch(err => {
                    if (err.name === 'booruError') {
                        console.log(err.message);
                    } else {
                        console.log(err);
                    };
                });
        }

        if (content.startsWith(delimiter + "e621")) {
            if (args.length === 0) {
                msg.edit("You forgot to supply tags");
                return;
            };

            booru.search("e621", args, {
                    limit: 1,
                    random: true
                })
                .then(booru.commonfy)
                .then(images => {
                    // Show juicy NSFW image
                    for (let image of images) {
                        msg.edit(`Score: ${image.common.score}\nImage: ${image.common.file_url}`);
                    }
                })
                .catch(err => {
                    if (err.name === 'booruError') {
                        console.log(err.message);
                    } else {
                        console.log(err);
                    };
                });
        }

        if (content.startsWith(delimiter + "gelbooru")) {
            if (args.length === 0) {
                msg.edit("You forgot to supply tags");
                return;
            };

            booru.search("gelbooru", args, {
                    limit: 1,
                    random: true
                })
                .then(booru.commonfy)
                .then(images => {
                    // Show juicy NSFW image
                    for (let image of images) {
                        msg.edit(`Score: ${image.common.score}\nImage: ${image.common.file_url}`);
                    };
                })
                .catch(err => {
                    if (err.name === 'booruError') {
                        console.log(err.message);
                    } else {
                        console.log(err);
                    };
                });
        }

        if (content.startsWith(delimiter + "paheal")) {
            if (args.length === 0) {
                msg.edit("You forgot to supply tags");
                return;
            };

            booru.search("paheal", args, {
                    limit: 1,
                    random: true
                })
                .then(booru.commonfy)
                .then(images => {
                    // Show juicy NSFW image
                    for (let image of images) {
                        msg.edit(`Score: ${image.common.score}\nImage: ${image.common.file_url}`);
                    };
                })
                .catch(err => {
                    if (err.name === 'booruError') {
                        console.log(err.message);
                    } else {
                        console.log(err);
                    };
                });
        };
    };
});

function embed(msg) {
    let paramString = msg.content.slice(9);
    let customEmbed = new Discord.RichEmbed();

    let fields = paramString.split(',');
    fields.forEach(field => {
        let chunks = field.split(':');
        let header = chunks[0];
        let values = chunks[1].split(';');
        customEmbed.addField(header, values.join('\n'), true);
    });

    customEmbed.setColor("#e52431");
    customEmbed.setFooter("A selfbot by Favna", "https://i.imgur.com/Ylv4Hdz.jpg");
    customEmbed.setAuthor("PyrrhaBot", "http://i.imgur.com/4U9oMS0.png")

    msg.edit({
        embed: customEmbed
    });

}
function positionFormatter(length) {
    let numbers = [];
    for (let i = 0; i < length; i++) {
        numbers.push(i)
    }
    return numbers;
};

function gameSearch(msg, args) {
    let searchURL = `http://www.mobygames.com/search/quick?q=${args.join('+')}&p=-1&search=Go&sFilter=1&sG=on`;

    msg.channel.send('***Looking for data about that game...***').then((gameResponse) => {
        request({
            uri: searchURL,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.111 Safari/537.36'
            }
        }, function (err, resp, body) {
            if (!err && resp.statusCode == 200) {
                let $ = cheerio.load(body);
                var pageLink = $('#searchResults > div > div:nth-child(2) > div > div.searchData > div.searchTitle > a').attr('href');
                request({
                        uri: `http://www.mobygames.com${pageLink}`,
                        headers: {
                            'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.111 Safari/537.36'
                        }
                    },
                    function (err, resp, body) {
                        if (!err && resp.statusCode == 200) {
                            let $ = cheerio.load(body);
                            const gameName = $('.niceHeaderTitle > a').text();
                            var boxArt = `http://www.mobygames.com${$('#coreGameCover > a > img').attr('src')}`;
                            const publisher = $('#coreGameRelease > div:contains("Published by")').next().children().text();
                            const developer = $('#coreGameRelease > div:contains("Developed by")').next().children().text();
                            const releaseDate = $('#coreGameRelease > div:contains("Released")').next().children().text();
                            const platforms = $('#coreGameRelease > div:contains("Platforms")').next().children().text() === '' ? $('#coreGameRelease > div:contains("Platform")').next().children().text() : ($('#coreGameRelease > div:contains("Platforms")').next().text()).split(',').join(', ');

                            const ESRBRating = $('#coreGameGenre > div > div:contains("ESRB Rating")').next().children().text();
                            const genre = ($('#coreGameGenre > div > div:contains("Genre")').next().text() + ',' + $('#coreGameGenre > div > div:contains("Gameplay")').next().text()).split(',').join(', ');
                            const setting = $('#coreGameGenre > div > div:contains("Setting")').next().children().text();
                            var rating = '';
                            if ($('.scoreHi:nth-child(1)').first().text() === '' && $('.scoreLow:nth-child(1)').first().text() === '') {
                                rating = $('.scoreMed:nth-child(1)').first().text();
                            } else if ($('.scoreHi:nth-child(1)').first().text() === '' && $('.scoreMed:nth-child(1)').first().text() === '') {
                                rating = $('.scoreLow:nth-child(1)').first().text();
                            } else {
                                rating = $('.scoreHi:nth-child(1)').first().text();
                            }
                            var description = "Potentially truncated due to maximum allowed length:\n";
                            var descCombined = "";
                            if ($('blockquote').length === 1) {
                                descCombined = $('blockquote').text();
                            } else {
                                $('#ctrq').each(function () {
                                    var $set = [];
                                    var nxt = this.nextSibling;
                                    while (nxt) {
                                        if (!$(nxt).is('.sideBarLinks')) {
                                            $set.push(nxt);
                                            nxt = nxt.nextSibling;
                                        } else break;
                                    }

                                    for (let i = 0; i < $set.length; i++) {
                                        if ($set[i].data !== undefined) {
                                            descCombined = descCombined + $set[i].data;
                                        }
                                    }
                                });
                            }
                            description += descCombined.slice(0, 970);

                            const gameEmbed = new Discord.RichEmbed();
                            gameEmbed.setColor('#FF0000').setAuthor(gameName, 'https://i.imgur.com/oHwE0nC.png').setImage(boxArt).setFooter(`Game info pulled from mobygames | ${moment(new Date).format('MMMM Do Do YYYY | HH:mm')}`, 'http://i.imgur.com/qPuIzb2.png');
                            gameEmbed.addField('Game Name', gameName, false);
                            releaseDate !== '' ? gameEmbed.addField('Release Date', releaseDate, true) : gameEmbed.addField('Release Date', 'Release Date unknown', true)
                            rating !== '' ? gameEmbed.addField('Rating', rating, true) : gameEmbed.addField('Rating', "No rating available", true);
                            setting !== '' ? gameEmbed.addField('Setting', setting, true) : gameEmbed.addField('Setting', 'No setting specified', true)
                            genre !== '' ? gameEmbed.addField('Genre(s)', genre, true) : gameEmbed.addField('Genre(s)', 'Genre(s) unknown', true);
                            platforms !== '' ? gameEmbed.addField('Platform(s)', platforms, true) : gameEmbed.addField('Platform(s)', 'Platforms unknown', true);
                            developer !== '' ? gameEmbed.addField('Developer', developer, true) : gameEmbed.addField('Developer', 'Developer unknown', true);
                            publisher !== '' ? gameEmbed.addField('Publisher', publisher, true) : gameEmbed.addField('Publisher', 'Publisher unknown', true);
                            ESRBRating !== '' ? gameEmbed.addField('ESRB Rating', ESRBRating, true) : gameEmbed.addField('ESRB Rating', 'ESRB Rating unknown', true);
                            gameEmbed.addField('Description', description, false);

                            gameResponse.edit({
                                embed: gameEmbed
                            });
                        } else {
                            console.error(err);
                            gameResponse.delete();
                            return msg.reply('An error occured while getting the game\'s info')
                        }
                    });
            } else {
                console.error(err);
                gameResponse.delete();
                return msg.reply('An error occured while fetching search results');
            }
        });
    });
}

function movieSearch(msg) {
    let omdbEmbed = new Discord.RichEmbed();
    let startMarks = msg.content.indexOf(">>"); // Get the position of the opening >>
    let endMarks = msg.content.indexOf("<<"); // Get the position of the closing <<
    let omdbQuery = msg.content.slice(startMarks + 2, endMarks).split(','); // Get the content between the>> <<

    let preMarksText = msg.content.slice(0, startMarks);
    let postMarksText = msg.content.slice(endMarks + 2);
    omdbEmbed.setColor("#c61530");

    // Set the footer of the embed including a custom formatted time stamp using MomentJS
    omdbEmbed.setFooter(`A selfbot by Favna | ${moment(new Date()).format('MMMM Do YYYY HH:mm')}`, "https://i.imgur.com/Ylv4Hdz.jpg");
    msg.edit('**Searching OMDb...**').then(() => {
        omdb.get({
            title: omdbQuery[0],
            year: omdbQuery[1]
        }, true, function (err, movie) {
            if (err) {
                // When an error occurs log it and cancel
                return console.error(err);
            }
            if (!movie) {
                // When no movie is found tell the user and cancel
                return msg.edit(`No movie or serie found!\nOriginal Message: ${msg.content}`);
            }

            omdbEmbed.setAuthor(`${movie.title} info from OMDb`, 'https://i.imgur.com/xhpROOr.png')

            // Sometimes there is no poster in which case the property is null. If there is a poster we use it as image
            movie.poster !== null ? omdbEmbed.setImage(movie.poster) : null;

            omdbEmbed.addField("Title", movie.title, true);
            omdbEmbed.addField("First aired", moment(movie.released).format("MMMM Do YYYY"), true);

            // For future movies there may not yet be a rating
            movie.rated !== null ? omdbEmbed.addField("Rating", movie.rated, true) : omdbEmbed.addField("Rating", "Not yet rated", true);
            omdbEmbed.addField("Genre(s)", movie.genres.join(', '), true);
            omdbEmbed.addField("Type", movie.type, true);

            // If the director is null we write none
            movie.director !== null ? omdbEmbed.addField("Director", movie.director, true) : omdbEmbed.addField("Director", "none", true);

            // For unreleased movies there is no IMDB rating
            movie.imdb.rating !== null ? omdbEmbed.addField("IMDB Rating", movie.imdb.rating, true) : omdbEmbed.addField("IMDB Rating", "No score yet", true);

            // Sometimes there is no rotten tomatoes rating, in which case we leave this out
            movie.tomato !== undefined ? omdbEmbed.addField("Rotten Tomatoes", movie.tomato, true) : omdbEmbed.addField("Rotten Tomatoes", "Not available on OMDb", true);

            // Sometimes there is no Metacritic rating, in which case we leave this out
            movie.metacritic !== null ? omdbEmbed.addField("Metacritic", movie.metacritic, true) : omdbEmbed.addField("Metacritic", "Not available on OMDb", true);

            omdbEmbed.addField("Plot", movie.plot, false);

            msg.edit(preMarksText + omdbQuery + postMarksText, {
                embed: omdbEmbed
            });
        });
    });
};