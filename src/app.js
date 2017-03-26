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
const settings = require("./auth.json");
const delimiter = settings.prefix;
const client = new Discord.Client();
const youtube = new YouTube();
const cydiaRegex = /\<\<\s*([\w\ `~\!\@\#\$\%\^\&\*\(\)\-\_\=\+\{\}\\\|\;\:\'\"\,\<\.\>\/\?]+)\S*\s*\>\>/gi;
const omdbRegex = /\>\>\s*([\w\ `~\!\@\#\$\%\^\&\*\(\)\-\_\=\+\{\}\\\|\;\:\'\"\,\<\.\>\/\?]+)\S*\s*\<\</gi;

var deathCount = parseInt(30);

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
    if (msg.author.id !== "112001393140723712") return;

    if (msg.author.id === "112001393140723712") {
        var content = msg.content.toLowerCase();

        if (content.startsWith(delimiter + "valsofembed")) {

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
            msg.edit(msg.content.slice(15), {
                embed: valsOfEmbed
            });
        }

        if (content.startsWith(delimiter + "death")) {
            deathCount += 1;
            let deathCountEmbed = new Discord.RichEmbed();
            deathCountEmbed.setColor("#5f93e2");
            deathCountEmbed.addField("Breath of The Wild Deathcount:", `${deathCount} | ${msg.content.slice(9)}`)
            deathCountEmbed.setFooter("We all know Favna is a total scrub", "https://i.imgur.com/eqxqyFp.png")
            msg.edit({
                embed: deathCountEmbed
            });
        }

        // Breath of the Wild Interactive map
        if (content.startsWith(delimiter + "botwmap")) {
            msg.edit("For an interactive map for The Legend of Zelda: Breath of The Wild map follow this url: https://www.zeldadungeon.net/breath-of-the-wild-interactive-map/")
        }

        // Transform URL to cydia share URL
        if (content.startsWith(delimiter + "cysource")) {
            let cysource = msg.content.slice(12);
            msg.edit(`To add this repo directly to cydia click the following URL: https://cydia.saurik.com/api/share#?source=${cysource}`);

        }
        // Transform source URL and package name to cydia share URL
        if (content.startsWith(delimiter + "cypkg")) {
            let input = msg.content.split(' ').slice(1);
            msg.edit(`To find this package on Cydia follow this URL: https://cydia.saurik.com/api/share#?source=${input[0]}/&package=${input[1]}`);
        }

        // Cydia Tweak Search
        if (cydiaRegex.test(content)) {
            let cydiaEmbed = new Discord.RichEmbed();
            let startMarks = content.indexOf("<<");
            let endMarks = content.indexOf(">>");
            let cydiaQuery = msg.content.slice(startMarks + 2, endMarks);

            cydiaEmbed.setColor("#5D2E1F");
            cydiaEmbed.setAuthor("Tweak Info", "http://i.imgur.com/OPZfdht.png");
            cydiaEmbed.setFooter("A selfbot by Favna", "https://i.imgur.com/Ylv4Hdz.jpg");

            msg.edit("**Searching cydia package...**").then(() => {
                cydia.getAllInfo(cydiaQuery).then((pkginfo) => {
                    if (pkginfo === false) {
                        msg.edit(`**Tweak/Theme \`${cydiaQuery}\` not found!**`);
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

                    msg.edit(msg.content.slice(0, startMarks) + msg.content.slice(endMarks + 3), {
                        embed: cydiaEmbed
                    });
                });
            });
        }

        // OMDB Movie Search
        if (omdbRegex.test(content)) {
            let omdbEmbed = new Discord.RichEmbed();
            let startMarks = content.indexOf(">>"); // Get the position of the opening {{
            let endMarks = content.indexOf("<<"); // Get the position of the closing }}
            let omdbQuery = msg.content.slice(startMarks + 2, endMarks); // Get the content between the {{ }}
            omdbEmbed.setColor("#c61530");

            // Set the footer of the embed including a custom formatted time stamp using MomentJS
            omdbEmbed.setFooter(`A selfbot by Favna | ${moment(new Date()).format('MMMM Do YYYY HH:mm')}`, "https://i.imgur.com/Ylv4Hdz.jpg");

            msg.channel.sendMessage('**Searching OMDb...**').then((msg) => {
                omdb.get(omdbQuery, function (err, movie) {
                    if (err) {
                        // When an error occurs log it and cancel
                        return console.error(err);
                    }
                    if (!movie) {
                        // When no movie is found tell the user and cancel
                        return msg.edit('No movie or serie found!');
                    }

                    // Sometimes there is no poster in which case the property is null.
                    // If there is a poster we use it as image and as thumbnail for the author, otherwise just set the author with text only.
                    movie.poster !== null ? omdbEmbed.setImage(movie.poster) && omdbEmbed.setAuthor(`${movie.title} info from OMDb`, movie.poster) : omdbEmbed.setAuthor(`${movie.title} info from OMDb`);

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

                    msg.edit(msg.content.slice(0, startMarks) + msg.content.slice(endMarks + 3), {
                        embed: omdbEmbed
                    });
                });
            });
        }

        if (content.startsWith(delimiter + "help")) {
            var helpEmbed = new Discord.RichEmbed();

            var cmdsPart1 = [`${delimiter}google <query>`, `${delimiter}image <query>`, `${delimiter}youtube <query>`, `${delimiter}urban <word>`, `${delimiter}userinfo <@User>`, `${delimiter}define <word>`, `${delimiter}anime <anime>`, `${delimiter}avatar <user>`,
                "-----------------",
                `${delimiter}3dsguide`, `${delimiter}wiiuguide`, `${delimiter}3dshardmodders`, `${delimiter}tvos`, `${delimiter}opinion`, `${delimiter}botwmap`, `${delimiter}death <reason>`
            ];

            let cmdsPart2 = [`${delimiter}cysource`, `${delimiter}cypkg`, `${delimiter}cyfind or $$name$$`,
                "-----------------",
                `${delimiter}calc`, `${delimiter}embed`, `${delimiter}debug <listchannels/listroles>`, `${delimiter}valsofembed`,
                "-----------------",
                `${delimiter}r34`, `${delimiter}e621`, `${delimiter}gelbooru`, `${delimiter}paheal`
            ];

            var infoPart1 = ["Find something on google based on a query", "Find an image on google based on a query", "Find a video on youtube based on a query", "Define a word with Urban Dictionary", "Shows the userinfo of a mentioned user", "Gives definitions of a word", "Gives info of an anime", "Show the avatar of a user",
                "-----------------",
                "The 3DS hacking guide to follow", "The WiiU hacking guide to follow", "List of trusted 3DS hardmodders", "Shows how to block OTA updates", "Shows your opinion gif", "Interactive Breath of the Wild map", "Increase death count by 1 with a reason"
            ];

            let infoPart2 = ["Transforms a URL into a Cydia share URL", "Transforms a package name into a cydia share url", "Find a package on Cydia",
                "-----------------",
                "Make a calculation given required parameters", "Creates a customized richEmbed", "List all channels or roles and their IDs", "Shows the layout of rich embeds",
                "-----------------",
                "Find NSFW image on [rule34](https://rule34.xxx)", "Find NSFW image on [e621](https://e621.net)", "Find NSFW image on [gelbooru](https://gelbooru.com)", "Find NSFW image on [rule34-paheal](https://rule34.paheal.net)"
            ];

            helpEmbed.setTitle("--My commands--");
            helpEmbed.addField("Command", cmdsPart1, true);
            helpEmbed.addField("This does", infoPart1, true);
            helpEmbed.addField("\u200b", cmdsPart2, true);
            helpEmbed.addField("\u200b", infoPart2, true);
            helpEmbed.setColor("#c61530");
            helpEmbed.setFooter("A selfbot by Favna", "https://i.imgur.com/Ylv4Hdz.jpg");
            helpEmbed.setAuthor("PyrrhaBot", "http://i.imgur.com/4U9oMS0.png")
            msg.edit(msg.content.slice(8), {
                embed: helpEmbed
            });
        }

        // Search Engines
        // Google Regular Search
        if (content.startsWith(delimiter + "google")) {
            let searchQuery = msg.content.slice(10);
            msg.edit('**Searching...**').then(() => {
                const query = searchQuery //is basically the search sent by you
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
            let imageQuery = msg.content.slice(9);
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
                            return msg.edit(result);
                        })
                    ).catch((err) => {
                        msg.edit('**No Results Found**');
                        console.error(err);
                    });
            });
        }

        // Youtube Search
        if (content.startsWith(delimiter + "youtube") || content.startsWith(delimiter + "yt")) {
            let youtubeQuery = content.slice(3, 5) === 'yt' ? msg.content.slice(6) : msg.content.slice(11);


            msg.edit('**Searching while prioritizing videos..**').then(() => {
                youtube.search(youtubeQuery, 50, function (error, result) {
                    if (error) {
                        msg.edit("An error occurred, please contact <@112001393140723712>");
                    } else {
                        if (!result || !result.items || result.items.length < 1) {
                            msg.edit("No Results found");
                        } else {
                            for (let i = 0; i < result.items.length; i++) {
                                if (result.items[i].id.kind === 'youtube#video') {
                                    msg.edit(`Video: https://www.youtube.com/watch?v=${result.items[i].id.videoId}`);
                                    return;
                                }
                            }

                            for (let i = 0; i < result.items.length; i++) {
                                if (result.items[i].id.kind === 'youtube#channel') {
                                    msg.edit(`Channel: https://www.youtube.com/channel/${result.items[i].id.channelId}`);
                                    return;
                                }
                            }

                            for (let i = 0; i < result.items.length; i++) {
                                if (result.items[i].id.kind === 'youtube#playlist') {
                                    msg.edit(`Playlist: https://www.youtube.com/playlist?list=${result.items[i].id.playlistId}`);
                                    return;
                                }
                            }
                        }
                    }
                });
            });
        }

        // Urban Dictionary search
        if (content.startsWith(delimiter + "urban")) {
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

                    msg.edit(msg.content.slice(9), {
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
                            msg.edit('**No results found!**')
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
                        msg.edit('**No results found!**');
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

                        msg.edit(msg.content.slice(9), {
                            embed: animeEmbed
                        });
                    })
                    .catch((err) => {
                        console.error(err);
                        msg.edit("**No results found!**")
                    });
            });
        }

        if (content.startsWith(delimiter + "avatar")) {
            var mentionedUser = msg.mentions.users.first();
            if (!mentionedUser) {
                mentionedUser = msg.author;
            }
            msg.edit(mentionedUser.displayAvatarURL);
        }


        // Storage
        if (content.startsWith(delimiter + "3dsguide")) {
            let plaiGuideEmbed = new Discord.RichEmbed();

            plaiGuideEmbed.setColor("#CF010E");
            plaiGuideEmbed.setTitle("A one stop guide for (New) Nintendo 3DS (XL)");
            plaiGuideEmbed.setDescription("Want to get Custom Firmware on your Nintendo 3DS? Need instructions on how to set up Arm9loaderhax, Luma3DS and other homebrew? Follow this guide");
            plaiGuideEmbed.addField("\u200b", "https://3ds.guide");
            plaiGuideEmbed.setFooter("Nintendo 3DS Guide provided by Favna's selfbot", "http://i.imgur.com/4U9oMS0.png");
            plaiGuideEmbed.setThumbnail("https://s-media-cache-ak0.pinimg.com/736x/6d/75/88/6d7588481517a4c959bab8e3df39c92a.jpg")
            msg.edit(msg.content.slice(12), {
                embed: plaiGuideEmbed
            });
        }

        if (content.startsWith(delimiter + "wiiuguide")) {
            let wiiuguideEmbed = new Discord.RichEmbed();

            wiiuguideEmbed.setColor("#00ACCA");
            wiiuguideEmbed.setTitle("A one stop guide for Wii U");
            wiiuguideEmbed.setDescription("Want to run game backups on your WiiU? Need instructions on how to set up haxchi, mocha and rednand? Follow this guide");
            wiiuguideEmbed.addField("\u200b", "https://wiiu.guide");
            wiiuguideEmbed.setFooter("Nintendo WiiU Guide provided by Favna's selfbot", "http://i.imgur.com/4U9oMS0.png");
            wiiuguideEmbed.setThumbnail("http://i68.tinypic.com/2zizozn.png")
            msg.edit(msg.content.slice(13), {
                embed: wiiuguideEmbed
            });
        }

        if (content.startsWith(delimiter + "3dshardmodders")) {
            msg.edit("The 3DS scene has verified and trusted hardmodders globally! You can contact them through private messaging on GBAtemp. Find their names here: https://gbatemp.net/threads/list-of-hardmod-installers-by-region.414224/");
        }

        if (content.startsWith(delimiter + "tvos")) {
            msg.edit("If you want to block getting OTA updates on your iOS device install the tvOS beta profile. To download open this link in Safari: https://hikay.github.io/app/NOOTA.mobileconfig")
        }

        if (content.startsWith(delimiter + "opinion")) {
            msg.channel.sendFile("./pyrrhabot/images/opinion.gif");
            msg.delete();
        }

        if (content.startsWith(delimiter + "cp")) {
            msg.channel.sendFile("./pyrrhabot/images/cp.jpg");
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

        // Debugging
        if (content.startsWith(delimiter + "debug")) {
            debug(msg);
        }

        // NSFW
        if (content.startsWith(delimiter + "r34")) {
            let rule34Tags = msg.content.slice(7).split(" ");
            if (rule34Tags[0] === '') {
                msg.edit("You forgot to supply tags");
                return;
            };

            booru.search("r34", rule34Tags, {
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
            let e621Tags = msg.content.slice(8).split(" ");
            if (e621Tags[0] === '') {
                msg.edit("You forgot to supply tags");
                return;
            };

            booru.search("e621", e621Tags, {
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
            let gelbooruTags = msg.content.slice(12).split(" ");
            if (gelbooruTags[0] === '') {
                msg.edit("You forgot to supply tags");
                return;
            };

            booru.search("gelbooru", gelbooruTags, {
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
            let rule34paheal = msg.content.slice(10).split(" ");
            if (rule34paheal[0] === '') {
                msg.edit("You forgot to supply tags");
                return;
            };

            booru.search("paheal", rule34paheal, {
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
    if (msg.channel.type !== 'dm' && msg.channel.type !== 'group') {
        let userGuildMember = msg.guild.member(user);
        var userNickname = userGuildMember.nickname === null ? "No Nickname" : userGuildMember.nickname;
        var userRoles = userGuildMember.roles.map(r => r.name).slice(1).length >= 1 ? userGuildMember.roles.map(r => r.name).slice(1) : "No Roles";
        var userRoleColor = userGuildMember.highestRole.hexColor;
        var userJoinedDate = moment(userGuildMember.joinedAt).format('MMMM Do YYYY');
    };

    let userID = user.id;
    let userName = user.username;
    let userDiscriminator = user.discriminator;
    let userAvatar = user.displayAvatarURL;
    let userStatus = user.presence.status;
    let userCreateDate = moment(user.createdAt).format('MMMM Do YYYY')

    //Adding data to rich embed
    userInfoEmbed.setAuthor(`${userName}` + "#" + `${userDiscriminator}`, `${userAvatar}`);
    userInfoEmbed.setColor("#d43939");
    userInfoEmbed.setImage(userAvatar);
    msg.channel.type !== 'dm' && msg.channel.type !== 'group' ? userInfoEmbed.setFooter(`has ${userRoles.length} role(s)`, userAvatar) : userInfoEmbed.setFooter(`${userName}'s info requested by Favna`, userAvatar)

    //First row
    userInfoEmbed.addField("ID", userID, true);
    userInfoEmbed.addField("Discriminator", userDiscriminator, true);
    userInfoEmbed.addField("Status", userStatus, true);

    //Second row
    userInfoEmbed.addField("Name", userName, true);
    msg.channel.type !== 'dm' && msg.channel.type !== 'group' ? userInfoEmbed.addField("Color", userRoleColor, true) : null;

    msg.channel.type !== 'dm' && msg.channel.type !== 'group' ? userInfoEmbed.addField("Nickname", userNickname, true) : null;

    //Third Row
    msg.channel.type !== 'dm' && msg.channel.type !== 'group' ? userInfoEmbed.addField("Roles", userRoles, true) : null

    //Fourth row
    userInfoEmbed.addField("Created at", userCreateDate, true);
    msg.channel.type !== 'dm' && msg.channel.type !== 'group' ? userInfoEmbed.addField("Joined at", userJoinedDate, true) : null
    msg.edit({
        embed: userInfoEmbed
    });
}