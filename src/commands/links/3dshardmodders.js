// Copyright (C) 2017 Favna
// 
// This file is part of PyrrhaBot.
// 
// PyrrhaBot is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
// 
// PyrrhaBot is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
// 
// You should have received a copy of the GNU General Public License
// along with PyrrhaBot.  If not, see <http://www.gnu.org/licenses/>.
// 

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