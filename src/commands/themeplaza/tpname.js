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

const Discord = require("discord.js");
const commando = require('discord.js-commando');
const moment = require('moment');
const request = require("request");
const cheerio = require('cheerio');
const path = require('path');
const mdobj = require(path.join(__dirname, 'metadata.js')).MetaDataObject;

module.exports = class themeNameCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'tpname',
            group: 'themeplaza',
            aliases: ['themename', 'name', 'tname'],
            memberName: 'tpname',
            description: 'Get info from a theme on themeplaza based on name',
            examples: ['tname megaman', 'name megaman'],
            guildOnly: false,

            args: [{
                key: 'themeName',
                prompt: 'Name of the theme?',
                type: 'string'
            }]
        });
    }

    async run(msg, args) {
        let searchURL = `https://themeplaza.eu/themes?query=${args.themeName}&sort=newest`
        request({
                uri: searchURL,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.111 Safari/537.36'
                }
            },
            async function (err, resp, body) {
                if (!err && resp.statusCode == 200) {
                    let $ = cheerio.load(body);
                    var themeID = $('div.theme-grid.row.justify-content-center > div:nth-child(1) > div > div.card-header > a').attr('href').slice(6);
                    var themeURL = `https://themeplaza.eu/api/v0/theme_lookup?item_id=${themeID}`;

                    request({
                            uri: themeURL,
                            headers: {
                                'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.111 Safari/537.36'
                            }
                        },
                        async function (err, resp, body) {
                            if (!err && resp.statusCode == 200) {
                                let $ = cheerio.load(body);
                                const themeEmbed = new Discord.RichEmbed();

                                var themeData = JSON.parse($('body').text())
                                themeEmbed
                                    .setColor('#FF0000')
                                    .setTitle(themeData.title)
                                    .setURL(`https://themeplaza.eu/item/${args.themeID}`)
                                    .setThumbnail(`https://themeplaza.eu/download/${args.themeID}/qr`)
                                    .setDescription(themeData.description)
                                    .addField('Uploader', themeData.author, true)
                                    .addField('Upload Date', moment(themeData.upload_data).format('MMMM Do YYYY'), true)
                                    .addField('Amount of downloads', `${themeData.download_count}`, true)
                                    .addField('Amount of likes', `${themeData.likes}`, true)
                                    .addField('NSFW Level', mdobj.nsfw[themeData.nsfw], true)
                                    .addField('Custom BGM', mdobj.bgm[themeData.metadata.enable_bgm] !== undefined ? mdobj.bgm[themeData.metadata.enable_bgm] : mdobj.bgm[2], true)
                                    .addField('Top Screen Draw Type', mdobj.top_draw_type[themeData.metadata.top_draw_type], true)
                                    .addField('Top Scroll', mdobj.top_frame_type[themeData.metadata.top_frame_type] !== undefined ? mdobj.top_frame_type[themeData.metadata.top_frame_type] : mdobj.top_frame_type[1], true)
                                    .addField('Bottom Screen Draw Type', mdobj.bottom_draw_type[themeData.metadata.bottom_draw_type], true)
                                    .addField('Bottom Scroll', mdobj.bottom_frame_type[themeData.metadata.bottom_frame_type] ? mdobj.bottom_frame_type[themeData.metadata.bottom_frame_type] : mdobj.bottom_frame_type[1], true)
                                    .addField('Custom Cursor', mdobj.custom_cursor[themeData.metadata.custom_cursor], true)
                                    .addField('Custom Folder Icon', mdobj.custom_folder[themeData.metadata.custom_folder], true)
                                    .addField('Custom  Cart Icon', mdobj.custom_cart[themeData.metadata.custom_cart], true)
                                    .addField('Custom SFX', mdobj.custom_sfx[themeData.metadata.custom_sfx], true)
                                    .addField('Custom BGM', themeData.metadata.enable_bgm === 1 ? themeData.metadata.bgm_info : 'None', false)
                                    .addField('Tags', themeData.tags.join(', '), false);

                                themeData.nsfw === '0' ? themeEmbed.setImage(`https://themeplaza.eu/download/${args.themeID}/preview`) : null
                                msg.channel.nsfw ? themeEmbed.setImage(`https://themeplaza.eu/download/${args.themeID}/preview`) : null
                                
                                await msg.embed(themeEmbed, `https://themeplaza.eu/item/${themeID}`);
                            } else {
                                console.error(err);
                                await msg.reply('An error occured, probably means the theme does not exist.');
                            }
                        });
                }
            }
        )
    };
};