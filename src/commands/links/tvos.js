const commando = require('discord.js-commando');

module.exports = class tvOSCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'tvos',
            aliases: ['blockupdates'],
            group: 'links',
            memberName: 'tvos',
            description: 'A link to download a tvos beta profile to block iOS updates',
            guildOnly: false
        });
    }

    async run(msg) {
        await msg.say("If you want to block getting OTA updates on your iOS device install the tvOS beta profile. To download open this link in Safari: https://hikay.github.io/app/NOOTA.mobileconfig")
    };
};