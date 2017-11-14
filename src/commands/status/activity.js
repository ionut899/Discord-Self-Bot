// Copyright (C) 2017 Favna
// 
// This file is part of Discord-Self-Bot.
// 
// Discord-Self-Bot is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
// 
// Discord-Self-Bot is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
// 
// You should have received a copy of the GNU General Public License
// along with Discord-Self-Bot.  If not, see <http://www.gnu.org/licenses/>.
// 

const commando = require('discord.js-commando');
const data = require('../../data.json');
const validTypes = ["PLAYING", "STREAMING", "WATCHING", "LISTENING"];

module.exports = class activityCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'activity',
            group: 'status',
            aliases: ['act'],
            memberName: 'activity',
            description: 'Sets your RichPresence data',
            examples: ['activity {name} {type} {details} {state} {starttime} {endtime} {largeimage} {smallimage} {largetext} {smalltext} {partycurrent} {partymax} {url}', 'activity '],
            guildOnly: false,
            argsSingleQuotes: true,

            args: [{
                    key: 'name',
                    prompt: 'Name of the activity?',
                    type: 'string',
                    label: 'Name of the activity to set'
                },
                {
                    key: 'type',
                    prompt: 'Type of the activity?',
                    type: 'string',
                    label: 'Type of the activity to set',
                    parse: type => {
                        return type.toUpperCase();
                    },
                    validate: type => {
                        if (validTypes.includes(type.toUpperCase())) {
                            return true;
                        }
                        return 'Type has to be one of: "PLAYING", "STREAMING", "WATCHING" or "LISTENING"'
                    }
                },
                {
                    key: 'details',
                    prompt: 'Details of activity?',
                    type: 'string',
                    label: 'Details of the activity to set'
                },
                {
                    key: 'state',
                    prompt: 'State of the activity?',
                    type: 'string',
                    label: 'State of the activity to set'
                },
                {
                    key: 'starttime',
                    prompt: 'Start timestamp to use? ("none" to skip)',
                    type: 'string',
                    label: 'Start time to use for the activity (set "none" if skipping)',
                },
                {
                    key: 'endtime',
                    prompt: 'End timestamp to use? ("none" to skip)',
                    type: 'string',
                    label: 'End time to use for the activity (set "none" if skipping)',
                },
                {
                    key: 'largeimage',
                    prompt: 'Large Image ID to set?',
                    type: 'string',
                    label: 'the Large Image to use for the activity',
                    validate: limgid => {
                        if (limgid.length == 18) {
                            return true;
                        }
                        return 'Large Image ID is 18 digits long'
                    }
                },
                {
                    key: 'smallimage',
                    prompt: 'Small Image ID to set?',
                    type: 'string',
                    label: 'the Small Image to use for the activity',
                    validate: simgid => {
                        if (simgid.length == 18) {
                            return true;
                        }
                        return 'Small Image ID is 18 digits long'
                    }
                },
                {
                    key: 'largetext',
                    prompt: 'The large text to set? ("none" to skip)',
                    type: 'string',
                    label: 'The Large Image Text to use for the activity (set "none" if skipping)',
                },
                {
                    key: 'smalltext',
                    prompt: 'The small text to set? ("none" to skip)',
                    type: 'string',
                    label: 'The Small Image Text to use for the activity (set "none" if skipping)',
                },
                {
                    key: 'partycurrent',
                    prompt: 'Current members in the party? ("0" to skip)',
                    type: 'integer',
                    label: 'The current amount of party members for the activity (set "0" if skipping)',
                },
                {
                    key: 'partymax',
                    prompt: 'Maximum members in the party? ("0" to skip)',
                    type: 'integer',
                    label: 'The maximum amount of party members for the activity (set "0" if skipping)',
                },
                {
                    key: 'url',
                    prompt: 'The URL to set if type=STREAMING ("none" to skip)',
                    type: 'string',
                    label: 'The url to use for the activity (set "none" if skipping)',
                }
            ]
        });
    }

    async run(msg, args) {
        this.client.user.setPresence({
            activity: {
                application: data.richpresenceData.application,
                name: args.name,
                type: args.type,
                url: args.url !== 'none' ? args.url : null,
                details: args.details,
                state: args.state,
                timestamps: {
                    start: args.starttime !== 'none' ? parseInt(args.starttime) : Date.now(),
                    end: args.endtime !== 'none' ? parseInt(args.endtime) : Date.now() + 86400
                },
                assets: {
                    largeImage: args.largeimage,
                    smallImage: args.smallimage,
                    largeText: args.largetext !== 'none' ? args.largetext : null,
                    smallText: args.smalltext !== 'none' ? args.smalltext : null
                },
                party: {
                    size: [args.partycurrent, args.partymax]
                },

            }
        });
    };
};