const commando = require('discord.js-commando');

module.exports = class hardmoddersGuideCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: '3dshardmodders',
            aliases: ['hardmodders', '3dsmodders', '3dsmods'],
            group: 'links',
            memberName: '3dshardmodders',
            description: 'A link to verified hardmodders for Nintendo 3DS',
            guildOnly: false
        });
    }

    async run(msg) {
        await msg.say("The 3DS scene has verified and trusted hardmodders globally! You can contact them through private messaging on GBAtemp. Find their names here: https://gbatemp.net/threads/list-of-hardmod-installers-by-region.414224/");
    }
};