const commando = require('discord.js-commando');

module.exports = class breathOfTheWildMapCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'botwmap',
            aliases: ['zeldamap'],
            group: 'links',
            memberName: 'botwmap',
            description: 'A link to the interactive The Legend of Zelda: Breath of The Wild map',
            guildOnly: false
        });
    }

    async run(msg) {
        await msg.say("For an interactive map for The Legend of Zelda: Breath of The Wild map follow this url: https://www.zeldadungeon.net/breath-of-the-wild-interactive-map/")
    };
};