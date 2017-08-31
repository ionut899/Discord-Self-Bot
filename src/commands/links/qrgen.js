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
const qr = require('qrcode');
const imgur = require('imgur');

module.exports = class qrgenCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'qrgen',
            aliases: ['qr'],
            group: 'links',
            memberName: 'qrgen',
            description: 'Generates a QR code from a given string',
            examples: ['qr https://www.google.com'],
            guildOnly: false,

            args: [{
                key: 'qrurl',
                prompt: 'String (URL) to make a QR code for?',
                type: 'string'
            }]
        });
    }

    async run(msg, args) {
        qr.toDataURL(args.qrurl, {
            errorCorrectionLevel: 'M'
        }, function (err, url) {
            if (err) throw err;
            imgur.uploadBase64(url.slice(22))
                .then(function (json) {
                    msg.edit(`QR Code for this file: ${json.data.link}`)
                })
                .catch(function (err) {
                    console.error(err.message);
                });
        });
    };
};