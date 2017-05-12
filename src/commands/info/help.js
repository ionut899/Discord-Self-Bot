const commando = require('discord.js-commando');
const Discord = require("discord.js");

module.exports = class CommandInfoCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'coms',
            group: 'info',
            memberName: 'coms',
            description: 'Gets selfbot command info',
            guildOnly: false
        });
    }

    async run(msg) {
        let helpEmbed = new Discord.RichEmbed();
        let prefix = msg.guild.commandPrefix;

        let search = [`${prefix}google <query>`, `${prefix}image <query>`, `${prefix}youtube <query>`, `${prefix}urban <word>`, `${prefix}define <word>`, `${prefix}anime <query>`, `>>MovieTitle,Year<<`, `<<CydiaPackage>>`];
        let info = [`${prefix}userinfo <@User>`, `${prefix}avatar <@User>`, `${prefix}debug <listchannels/listroles>`, `${prefix}valsofembed`];
        let links = [`${prefix}3dsguide`, `${prefix}wiiuguide`, `${prefix}3dshardmodders`, `${prefix}tvos`, `${prefix}botwmap`];
        let reactions = [`${prefix}opinion`, `${prefix}cp`, `${prefix}cry`];
        let nsfw = [`${prefix}r34`, `${prefix}e621`, `${prefix}gelbooru`, `${prefix}paheal`];
        let store = [`${prefix}edit`, `${prefix}delete`, `${prefix}clear`, `${prefix}check`, ];
        let misc = [`${prefix}calc`, `${prefix}embed`, `${prefix}quote <messageID>`, `${prefix}ping`];

        helpEmbed
            .setTitle("--My commands--")
            .addField("Misc", misc, true)
            .addField("Store", store, true)
            .addField("Reactions", reactions, true)
            .addField("Links", links, true)
            .addField("Info", info, true)
            .addField("NSFW", nsfw, true)
            .addField("Search", search, true)
            .setColor("#FF0000")
            .setFooter("A selfbot by Favna", "https://i.imgur.com/Ylv4Hdz.jpg")
            .setAuthor("PyrrhaBot", "http://i.imgur.com/4U9oMS0.png");
        await msg.embed(helpEmbed);
    }
};