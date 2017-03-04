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

// import the discord.js and npm modules
const Discord = require("discord.js");
const settings = require("./auth.json");
const delimiter = settings.prefix;
const client = new Discord.Client();
const youtube = new YouTube();

var deathCount = parseInt(3);

// Getting keys
client.login(settings.token);
youtube.setKey(settings.googleapikey);
googleapikey = settings.googleapikey;
imageEngineKey = settings.imageEngineKey;
searchEngineKey = settings.searchEngineKey;

client.on("ready", () => {
    console.log("Hello Again!");
});

client.on("message", msg => {



    if (msg.author.id === "112001393140723712") {
        if (msg.content.startsWith(delimiter + "valsofembed")) {
            var valsOfEmbed = new Discord.RichEmbed();
            valsOfEmbed.setAuthor("This is the author", "https://i.imgur.com/cgr5eSk.png");
            valsOfEmbed.setColor("#ffffff");
            valsOfEmbed.setDescription("This is the description");
            valsOfEmbed.setFooter("This is the footer", "https://i.imgur.com/kPNjOuJ.png");
            valsOfEmbed.setImage("https://i.imgur.com/l32vg3M.png");
            valsOfEmbed.setThumbnail("https://i.imgur.com/IQVvBcn.png")
            valsOfEmbed.setTimestamp();
            valsOfEmbed.setTitle("This is the title");
            valsOfEmbed.setURL("https://www.google.com");
            valsOfEmbed.addField("FieldName", "FieldValue", true)
            msg.edit({
                embed: valsOfEmbed
            });
        }

        if (msg.content.startsWith(delimiter + "death")) {
            deathCount += 1;
            let deathCountEmbed = new Discord.RichEmbed();
            deathCountEmbed.setColor("#5f93e2");
            deathCountEmbed.addField("Breath of The Wild Deathcount:", `${deathCount} | ${msg.content.slice(9)}`)
            deathCountEmbed.setFooter("We all know Favna is a total scrub", "https://i.imgur.com/eqxqyFp.png")
            msg.edit({
                embed: deathCountEmbed
            });
        }


        if (msg.content.startsWith(delimiter + "help")) {
            var helpEmbed = new Discord.RichEmbed();

            var commands = ["-----------------",
                `${delimiter}google <query>`, `${delimiter}image <query>`, `${delimiter}youtube <query>`, `${delimiter}urban <word>`, `${delimiter}userinfo <@User>`, `${delimiter}define <word>`, `${delimiter}anime <anime>`, `${delimiter}avatar <user>`,
                "-----------------",
                `${delimiter}3dsguide`, `${delimiter}3dshardmodders`, `${delimiter}tvos`, `${delimiter}opinion`,
                "-----------------",
                `${delimiter}calc`, `${delimiter}embed`, `${delimiter}debug <listchannels/listroles>`,
                "-----------------",
                `${delimiter}r34`, `${delimiter}e621`, `${delimiter}gelbooru`, `${delimiter}paheal`
            ];

            var info = [`-----------------`,
                "Find something on google based on a query", "Find an image on google based on a query", "Find a video on youtube based on a query", "Define a word with Urban Dictionary", "Shows the userinfo of a mentioned user", "Gives definitions of a word", "Gives info of an anime", "Show the avatar of a user",
                "-----------------",
                "The 3DS hacking guide to follow", "List of trusted 3DS hardmodders", "Shows how to block OTA updates", "Shows your opinion gif",
                "-----------------",
                "Make a calculation given required parameters", "Creates a customized richEmbed", "List all channels or roles and their IDs",
                "-----------------",
                "Find NSFW image on <https://rule34.xxx>", "Find NSFW image on <https://e621.net>", "Find NSFW image on <https://gelbooru.com>", "Find NSFW image on <https://rule34.paheal.net>"
            ];

            helpEmbed.setTitle("--My commands--");
            helpEmbed.addField("Command", commands, true);
            helpEmbed.addField("This does", info, true);
            helpEmbed.setColor("#c61530");
            helpEmbed.setFooter("A selfbot by Favna", "https://i.imgur.com/Ylv4Hdz.jpg");
            helpEmbed.setAuthor("PyrrhaBot", "http://i.imgur.com/4U9oMS0.png")
            msg.edit({
                embed: helpEmbed
            });
        }


        /**
         * Search Engine
         */

        // Google Regular Search
        if (msg.content.startsWith(delimiter + "google")) {
            let searchQuery = msg.content.slice(8);
            let safe = 'high';
            let QUERY_PARAMS = {
                key: googleapikey,
                cx: searchEngineKey,
                safe,
                q: encodeURI(searchQuery),
            };

            msg.edit('`Searching...`').then(() => {
                return superagent.get(`https://www.googleapis.com/customsearch/v1?${querystring.stringify(QUERY_PARAMS)}`)
                    .then((res) => {
                        if (res.body.queries.request[0].totalResults === '0') return Promise.reject(new Error('NO RESULTS'));
                        return msg.edit(res.body.items[0].link);
                    })
                    .catch(() => {
                        const SEARCH_URL = `https://www.google.com/search?safe=${safe}&q=${encodeURI(searchQuery)}`;
                        return superagent.get(SEARCH_URL).then((res) => {
                            const $ = cheerio.load(res.text);
                            let href = $('.r').first().find('a').first().attr('href');
                            if (!href) return Promise.reject(new Error('NO RESULTS'));
                            href = querystring.parse(href.replace('/url?', ''));
                            return msg.edit(href.q);
                        })
                    })
                    .catch((err) => {
                        console.error(err);
                        msg.edit('**No Results Found!**');
                    });
            });
        }

        // Google Image search
        if (msg.content.startsWith(delimiter + "image")) {
            let imageQuery = msg.content.slice(7);
            let safe = 'high'
            let QUERY_PARAMS = {
                searchType: 'image',
                key: googleapikey,
                cx: imageEngineKey,
                safe,
                q: encodeURI(imageQuery),
            };

            msg.edit('**Searching...**').then(() => {
                return superagent.get(`https://www.googleapis.com/customsearch/v1?${querystring.stringify(QUERY_PARAMS)}`)
                    .then((res) => msg.edit(res.body.items[0].link))
                    .catch(() =>
                        superagent.get(`https://www.google.com/search?tbm=isch&gs_l=img&safe=${safe}&q=${encodeURI(message.content)}`)
                        .then((res) => {
                            const $ = cheerio.load(res.text);
                            const result = $('.images_table').find('img').first().attr('src');
                            return msg.edit(result);
                        })
                    ).catch((err) => {
                        client.error(err);
                        msg.edit('**No Results Found**');
                    });
            });
        }

        // Youtube Search
        if (msg.content.startsWith(delimiter + "youtube")) {
            let query = msg.content.slice(9);
            msg.edit('**Searching...**').then(() => {
                youtube.search(query, 1, function (error, result) {
                    if (error) {
                        msg.edit("An error occurred, please contact <@112001393140723712>");
                    } else {
                        console.log(result.items);

                        if (!result || !result.items || result.items.length < 1) {
                            msg.edit("No Results found");
                        } else {
                            if (result.items[0].id.kind === 'youtube#channel') {
                                msg.edit(`I found a channel!\nhttps://www.youtube.com/channel/${result.items[0].id.channelId}`);
                            }
                            if (result.items[0].id.kind === 'youtube#video') {
                                msg.edit(`I found a video!\nVideo: https://www.youtube.com/watch?v=${result.items[0].id.videoId}`);
                            }
                            if (result.items[0].id.kind === 'youtube#playlist') {
                                msg.edit(`I found a playlist!\nhttps://www.youtube.com/playlist?list=${result.items[0].id.playlistId}`)
                            }
                            if (result.items[0].id.kind !== 'youtube#channel' && result.items[0].id.kind !== 'youtube#video' && result.items[0].id.kind !== 'youtube#playlist') {
                                msg.edit(`Something went wrong as I did not find a channel, playlist, or video. I ***DID*** find something though! Contact <@112001393140723712> to get this fixed!`)
                            }
                        }
                    }
                });
            });
        }

        // Urban Dictionary search
        if (msg.content.startsWith(delimiter + "urban")) {
            var urbanQuery = urban(msg.content.slice(7));

            msg.edit('**Opening Dictionary...**').then(() => {
                urbanQuery.first(function (json) {
                    if (json == undefined) {
                        msg.edit('**No Results Found!**');
                        return;
                    }
                    var urbanEmbed = new Discord.RichEmbed;
                    var urbanWord = json.word;
                    var urbanDefiniton = json.definition;
                    var urbanExample = json.example;
                    var urbanLink = json.permalink;

                    //Adding data to rich embed
                    urbanEmbed.setAuthor(`Urban Search - ${urbanWord}`, `https://i.imgur.com/miYLsGw.jpg`);
                    urbanEmbed.setColor("#E86121");
                    urbanEmbed.setFooter(`${urbanWord} defined by PyrrhaBot`, "http://i.imgur.com/4U9oMS0.png");

                    //Adding fields to rich embed
                    urbanEmbed.addField("Definition", urbanDefiniton, false);
                    urbanEmbed.addField("Example", urbanExample, false);
                    urbanEmbed.addField("Permalink", urbanLink, false);

                    msg.edit({
                        embed: urbanEmbed
                    });
                });
            });
        }

        // Userinfo of a user
        if (msg.content.startsWith(delimiter + "userinfo")) {
            userInfo(msg);
        }

        // Word define
        if (msg.content.startsWith(delimiter + "define")) {
            let args = msg.content.split(' ').slice(1);
            let word = args.join(' ');
            let defineEmbed = new Discord.RichEmbed();

            msg.edit('**Opening Dictionary...**').then(() => {
                superagent.get(`https://glosbe.com/gapi/translate?from=en&dest=en&format=json&phrase=${word}`)
                    .then((res) => res.body)
                    .then((res) => {
                        if (res.tuc == undefined) {
                            msg.edit('**No results found!**')
                            return;
                        }
                        const final = [`**Definitions for __${word}__:**`];
                        for (let [index, item] of Object.entries(res.tuc.filter(t => t.meanings)[0].meanings.slice(0, 5))) {

                            item = item.text
                                .replace(/\[(\w+)[^\]]*](.*?)\[\/\1]/g, '_')
                                .replace(/<i>|<\/i>/g, '');
                            final.push(`**${(parseInt(index) + 1)}:** ${item}`);
                        }
                        defineEmbed.setColor("#6984C4");
                        defineEmbed.setDescription(final);
                        defineEmbed.setFooter("PyrrhaBot", "http://i.imgur.com/4U9oMS0.png")
                        msg.edit({
                            embed: defineEmbed
                        });
                    })
                    .catch((err) => {
                        console.error(err);
                        msg.edit('**No results found!**');
                    });
            });
        }

        // MyAnimeList Searching
        if (msg.content.startsWith(delimiter + "anime")) {
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
                            animeEmbed.addField("\u200b", "\u200b", true);
                        };


                        if (synopsis.length >= 1024) {
                            animeEmbed.addField("Synposis", `The synopsis for this anime exceeds the maximum length, check the full synopsis on myanimelist.\nSynopsis Snippet:\n${synopsis.slice(0,500)}`, false);
                        } else {
                            animeEmbed.addField("Synposis", synopsis, false);
                        };

                        animeEmbed.addField("Score", score, true);
                        animeEmbed.addField("Episodes", episodeCount, true);
                        animeEmbed.addField("Status", status, true);
                        animeEmbed.addField("URL", animeUrl, true);

                        msg.edit({
                            embed: animeEmbed
                        });
                    })
                    .catch((err) => {
                        console.error(err);
                        msg.edit("**No results found!**")
                    });
            });
        }

        if (msg.content.startsWith(delimiter + "avatar")) {
            var mentionedUser = msg.mentions.users.first();
            if (!mentionedUser) {
                mentionedUser = msg.author;
            }
            msg.edit(mentionedUser.avatarURL);
        }


        /**
         * Storage
         */

        if (msg.content.startsWith(delimiter + "3dsguide")) {
            msg.edit("For the one stop guide to hacking your 3DS up to firmware 11.2 go to, read, follow and learn from https://3ds.guide");
        }

        if (msg.content.startsWith(delimiter + "3dshardmodders")) {
            msg.edit("The 3DS scene has verified and trusted hardmodders globally! You can contact them through private messaging on GBAtemp. Find their names here: https://gbatemp.net/threads/list-of-hardmod-installers-by-region.414224/");
        }

        if (msg.content.startsWith(delimiter + "tvos")) {
            msg.edit("If you want to block getting OTA updates on your iOS device install the tvOS beta profile. To download open this link in Safari: https://hikay.github.io/app/NOOTA.mobileconfig")
        }

        if (msg.content.startsWith(delimiter + "opinion")) {
            msg.channel.sendFile("./discordselfbot/images/opinion.gif");
        }

        /**
         * Custom
         */

        if (msg.content.startsWith(delimiter + "embed")) {
            embed(msg);
        }

        if (msg.content.startsWith(delimiter + "cal")) {
            let toCalc = msg.content.slice(7);
            msg.edit('**Calculating...**').then(() => {
                let result = scalc(toCalc);
                msg.edit(`**The answer to ${toCalc} is ${result}**`)
            });
        }

        /**
         * Debugging
         */
        if (msg.content.startsWith(delimiter + "debug")) {
            debug(msg);
        }

        /**
         * NSFW Searching
         */

        if (msg.content.startsWith(delimiter + "r34")) {
            let rule34Tags = msg.content.slice(7).split(" ");
            if (rule34Tags[0] === '') {
                msg.edit("You forgot to supply tags");
                return;
            }

            booru.search("r34", rule34Tags, 100)
                .then(booru.commonfy)
                .then(images => {
                    let min = Math.ceil(0);
                    let max = Math.floor(images.length);
                    let i = Math.floor(Math.random() * (max - min)) + min;

                    // Show juicy NSFW image
                    msg.edit(`Score: ${images[i].common.score}\nImage: ${images[i].common.file_url}`);
                })
                .catch(err => {
                    if (err.name === 'booruError') {
                        console.log(err.message);
                    } else {
                        console.log(err);
                    }
                })
        }

        if (msg.content.startsWith(delimiter + "e621")) {
            let e621Tags = msg.content.slice(8).split(" ");
            if (e621Tags[0] === '') {
                msg.edit("You forgot to supply tags");
                return;
            }

            booru.search("e621", e621Tags, 100)
                .then(booru.commonfy)
                .then(images => {
                    let min = Math.ceil(0);
                    let max = Math.floor(images.length);
                    let i = Math.floor(Math.random() * (max - min)) + min;

                    // Show juicy NSFW image
                    msg.edit(`Score: ${images[i].common.score}\nImage: ${images[i].common.file_url}`);
                })
                .catch(err => {
                    if (err.name === 'booruError') {
                        console.log(err.message);
                    } else {
                        console.log(err);
                    }
                })
        }

        if (msg.content.startsWith(delimiter + "gelbooru")) {
            let gelbooruTags = msg.content.slice(12).split(" ");
            if (gelbooruTags[0] === '') {
                msg.edit("You forgot to supply tags");
                return;
            }

            booru.search("gelbooru", gelbooruTags, 100)
                .then(booru.commonfy)
                .then(images => {
                    let min = Math.ceil(0);
                    let max = Math.floor(images.length);
                    let i = Math.floor(Math.random() * (max - min)) + min;

                    // Show juicy NSFW image
                    msg.edit(`Score: ${images[i].common.score}\nImage: ${images[i].common.file_url}`);
                })
                .catch(err => {
                    if (err.name === 'booruError') {
                        console.log(err.message);
                    } else {
                        console.log(err);
                    }
                })
        }

        if (msg.content.startsWith(delimiter + "paheal")) {
            let rule34paheal = msg.content.slice(10).split(" ");
            if (rule34paheal[0] === '') {
                msg.edit("You forgot to supply tags");
                return;
            }

            booru.search("paheal", rule34paheal, 100)
                .then(booru.commonfy)
                .then(images => {
                    let min = Math.ceil(0);
                    let max = Math.floor(images.length);
                    let i = Math.floor(Math.random() * (max - min)) + min;

                    // Show juicy NSFW image
                    msg.edit(`Score: ${images[i].common.score}\nImage: ${images[i].common.file_url}`);
                })
                .catch(err => {
                    if (err.name === 'booruError') {
                        console.log(err.message);
                    } else {
                        console.log(err);
                    }
                })
        }
    }
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

function debug(msg) {
    var debugarg = msg.content.slice(9);
    console.log(debugarg);
    if (debugarg === "listchannels") {
        var channelsDebugEmbed = new Discord.RichEmbed();
        var channelNames = msg.guild.channels.map(cn => cn.name);
        var channelIDs = msg.guild.channels.map(cid => cid.id);
        channelsDebugEmbed.setTitle("The channels on this server are as follows");
        channelsDebugEmbed.addField("Channel name", channelNames, true);
        channelsDebugEmbed.addField("\u200b", "\u200b", true);
        channelsDebugEmbed.addField("channel ID", channelIDs, true);
        channelsDebugEmbed.setColor("#00e5ee");
        msg.edit({
            embed: channelsDebugEmbed
        });
    }

    if (debugarg === "listroles") {
        var rolesDebugEmbed = new Discord.RichEmbed();
        var roleIDs = msg.guild.roles.map(rid => rid.id);
        var roleNames = msg.guild.roles.map(rn => rn.name)
            .slice(1);
        roleNames.unshift("Everyone");
        rolesDebugEmbed.setTitle("The roles on this server are as follows");
        rolesDebugEmbed.addField("Role name", roleNames, true);
        rolesDebugEmbed.addField("\u200b", "\u200b", true);
        rolesDebugEmbed.addField("Role ID", roleIDs, true);
        rolesDebugEmbed.setColor("#d82f2f");
        msg.edit({
            embed: rolesDebugEmbed
        });
    }
}

function userInfo(msg) {
    let userInfoEmbed = new Discord.RichEmbed;
    let user = msg.mentions.users.first();
    if (!user) {
        user = msg.author;
    }
    //Variables for the embed
    let userGuildMember = msg.guild.member(user);

    let userID = user.id;
    let userName = user.username;
    let userDiscriminator = user.discriminator;
    let userAvatar = user.avatarURL;

    let userNickname = userGuildMember.nickname;
    let userStatus = user.presence.status;
    let userRoles = userGuildMember.roles.map(r => r.name).slice(1);
    let userRoleColor = userGuildMember.highestRole.hexColor;

    let userCreateDate = moment(user.createdAt).format('MMMM Do YYYY')
    let userJoinedDate = moment(userGuildMember.joinedAt).format('MMMM Do YYYY')

    if (userNickname == null) {
        userNickname = "No Nickname";
    }

    //Adding data to rich embed
    userInfoEmbed.setAuthor(`${userName}` + "#" + `${userDiscriminator}`, `${userAvatar}`);
    userInfoEmbed.setColor("#58fc91");
    userInfoEmbed.setImage(userAvatar);
    userInfoEmbed.setFooter(`has ${userRoles.length} role(s)`, userAvatar);

    //First row
    userInfoEmbed.addField("ID", userID, true);
    userInfoEmbed.addField("Discriminator", userDiscriminator, true);
    userInfoEmbed.addField("Status", userStatus, true);

    //Second row
    userInfoEmbed.addField("Name", userName, true);
    userInfoEmbed.addField("Color", userRoleColor, true);
    userInfoEmbed.addField("Nickname", userNickname, true);


    //Third Row
    if (userRoles.length >= 1) {
        userInfoEmbed.addField("Roles", userRoles, true);
    } else {
        userInfoEmbed.addField("Roles", "No roles", true);
    }

    //Fourth row
    userInfoEmbed.addField("Created at", userCreateDate, true);
    userInfoEmbed.addField("Joined at", userJoinedDate, true);
    msg.edit({
        embed: userInfoEmbed
    });
}