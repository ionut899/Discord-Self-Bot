// Copyright (C) 2017 110Percent
// 
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as
// published by the Free Software Foundation, either version 3 of the
// License, or (at your option) any later version.
// 
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
// 
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.
//
// For source to Beheeyem see: https://github.com/110Percent

const path = require('path');
const typeMatchups = require(path.join(__dirname, 'data/typechart.js')).BattleTypeChart;
const commando = require('discord.js-commando');
const Discord = require("discord.js");

module.exports = class typeCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'type',
            group: 'pokedex',
            aliases: ['matchup', 'weakness', 'advantage'],
            memberName: 'type',
            description: 'Get type matchup for a given type or type combination',
            examples: ['type {type1} {type2}', 'type Dragon Flying'],
            guildOnly: false,

            args: [{
                key: 'type',
                prompt: 'Get info on which type?',
                type: 'string',
                label: 'Type matchup to check'
            }]
        });
    }

    async run(msg, args) {
        var defMulti = {
            "Bug": 1,
            "Dark": 1,
            "Dragon": 1,
            "Electric": 1,
            "Fairy": 1,
            "Fighting": 1,
            "Fire": 1,
            "Flying": 1,
            "Ghost": 1,
            "Grass": 1,
            "Ground": 1,
            "Ice": 1,
            "Normal": 1,
            "Poison": 1,
            "Psychic": 1,
            "Rock": 1,
            "Steel": 1,
            "Water": 1
        };
        var atkMulti = {
            "Bug": 1,
            "Dark": 1,
            "Dragon": 1,
            "Electric": 1,
            "Fairy": 1,
            "Fighting": 1,
            "Fire": 1,
            "Flying": 1,
            "Ghost": 1,
            "Grass": 1,
            "Ground": 1,
            "Ice": 1,
            "Normal": 1,
            "Poison": 1,
            "Psychic": 1,
            "Rock": 1,
            "Steel": 1,
            "Water": 1
        };
        var vulnCheck = false;
        var normalCheck = false;
        var resistCheck = false;
        var noCheck = false;
        var vulnTypes = [];
        var normalTypes = [];
        var resistTypes = [];
        var noTypes = [];
        var vulnDisplay = [];
        var vulnRaw = [];
        var normalRaw = [];
        var resistRaw = [];
        var noRaw = [];
        var atkVulnCheck = false;
        var atkNormalCheck = false;
        var atkResistCheck = false;
        var atkNoCheck = false;
        var atkVulnTypes = [];
        var atkNormalTypes = [];
        var atkResistTypes = [];
        var atkNoTypes = [];
        var atkVulnRaw = [];
        var atkNormalRaw = [];
        var atkResistRaw = [];
        var atkNoRaw = [];
        var vulnDisplay = [];
        var atkVulnDisplay = [];
        var displayTypes = [];

        for (var z = 0; z < args.type.split(" ").length; z++) {
            var argsSplit = args.type.split(" ")[z];
            if (Object.keys(typeMatchups).map(c => c.toLowerCase()).indexOf(argsSplit.toLowerCase()) != -1) {
                var toType = capitalizeFirstLetter(argsSplit);
                displayTypes.push(toType);
                var dTaken = typeMatchups[toType].damageTaken;
                var toMatch;
                for (toMatch in dTaken) {
                    if (defMulti[toMatch]) {
                        if (dTaken[toMatch] == 1) {
                            defMulti[toMatch] *= 2;
                        } else if (dTaken[toMatch] == 2) {
                            defMulti[toMatch] *= 0.5;
                        } else if (dTaken[toMatch] == 3) {
                            defMulti[toMatch] = 0;
                        }
                    }
                }
                for (toMatch in typeMatchups) {
                    if (atkMulti[toMatch]) {
                        if (typeMatchups[toMatch].damageTaken[toType] == 1) {
                            atkMulti[toMatch] *= 2;
                        } else if (typeMatchups[toMatch].damageTaken[toType] == 2) {
                            atkMulti[toMatch] *= 0.5;
                        } else if (typeMatchups[toMatch].damageTaken[toType] == 3) {
                            atkMulti[toMatch] *= 0;
                        }
                    }
                }
                for (var i = 0; i < Object.keys(defMulti).length; i++) {
                    if (defMulti[Object.keys(defMulti)[i]] > 1) {
                        vulnCheck = true;
                        break;
                    }
                }
                for (var i = 0; i < Object.keys(defMulti).length; i++) {
                    if (defMulti[Object.keys(defMulti)[i]] == 1) {
                        normalCheck = true;
                        break;
                    }
                }
                for (var i = 0; i < Object.keys(defMulti).length; i++) {
                    if (defMulti[Object.keys(defMulti)[i]] > 0 && defMulti[Object.keys(defMulti)[i]] < 1) {
                        resistCheck = true;
                        break;
                    }
                }
                for (var i = 0; i < Object.keys(defMulti).length; i++) {
                    if (defMulti[Object.keys(defMulti)[i]] == 0) {
                        noCheck = true;
                        break;
                    }
                }
                for (var i = 0; i < Object.keys(atkMulti).length; i++) {
                    if (atkMulti[Object.keys(atkMulti)[i]] > 1) {
                        atkVulnCheck = true;
                        break;
                    }
                }
                for (var i = 0; i < Object.keys(atkMulti).length; i++) {
                    if (atkMulti[Object.keys(atkMulti)[i]] == 1) {
                        atkNormalCheck = true;
                        break;
                    }
                }
                for (var i = 0; i < Object.keys(atkMulti).length; i++) {
                    if (atkMulti[Object.keys(atkMulti)[i]] > 0 && atkMulti[Object.keys(atkMulti)[i]] < 1) {
                        atkResistCheck = true;
                        break;
                    }
                }
                for (var i = 0; i < Object.keys(atkMulti).length; i++) {
                    if (atkMulti[Object.keys(atkMulti)[i]] == 0) {
                        atkNoCheck = true;
                        break;
                    }
                }
            }

        }
        if (vulnCheck) {
            for (var i = 0; i < Object.keys(defMulti).length; i++) {
                if (defMulti[Object.keys(defMulti)[i]] > 1 && vulnRaw.indexOf(Object.keys(defMulti)[i]) == -1) {
                    vulnTypes.push(`${Object.keys(defMulti)[i]} (x${defMulti[Object.keys(defMulti)[i]]})`);
                    vulnRaw.push(Object.keys(defMulti)[i]);
                }
            }
            vulnDisplay[0] = `Vulnerable to: ${vulnTypes.join(", ")}`;
        }
        if (normalCheck) {
            for (var i = 0; i < Object.keys(defMulti).length; i++) {
                if (defMulti[Object.keys(defMulti)[i]] == 1 && normalRaw.indexOf(Object.keys(defMulti)[i]) == -1) {
                    normalTypes.push(Object.keys(defMulti)[i]);
                    normalRaw.push(Object.keys(defMulti)[i]);
                }
            }
            vulnDisplay[1] = `Takes normal damage from: ${normalTypes.join(", ")}`;
        }
        if (resistCheck) {
            for (var i = 0; i < Object.keys(defMulti).length; i++) {
                if (defMulti[Object.keys(defMulti)[i]] > 0 && defMulti[Object.keys(defMulti)[i]] < 1 && resistRaw.indexOf(Object.keys(defMulti)[i]) == -1) {
                    resistTypes.push(Object.keys(defMulti)[i] + " (x" + defMulti[Object.keys(defMulti)[i]] + ")");
                    resistRaw.push(Object.keys(defMulti)[i]);
                }
            }
            vulnDisplay[2] = `Resists: ${resistTypes.join(", ")}`;
        }
        if (noCheck) {
            for (var i = 0; i < Object.keys(defMulti).length; i++) {
                if (defMulti[Object.keys(defMulti)[i]] == 0 && noRaw.indexOf(Object.keys(defMulti)[i]) == -1) {
                    noTypes.push(Object.keys(defMulti)[i]);
                    noRaw.push(Object.keys(defMulti)[i]);
                }
            }
            vulnDisplay[3] = `Not affected by: ${noTypes.join(", ")}`;
        }

        if (atkVulnCheck) {
            for (var i = 0; i < Object.keys(atkMulti).length; i++) {
                if (atkMulti[Object.keys(atkMulti)[i]] > 1 && atkVulnRaw.indexOf(Object.keys(atkMulti)[i]) == -1) {
                    atkVulnTypes.push(Object.keys(atkMulti)[i] + " (x" + atkMulti[Object.keys(atkMulti)[i]] + ")");
                    atkVulnRaw.push(Object.keys(atkMulti)[i]);
                }
            }
            atkVulnDisplay[0] = `Supereffective against: ${atkVulnTypes.join(", ")}`;
        }
        if (atkNormalCheck) {
            for (var i = 0; i < Object.keys(atkMulti).length; i++) {
                if (atkMulti[Object.keys(atkMulti)[i]] == 1 && atkNormalRaw.indexOf(Object.keys(atkMulti)[i]) == -1) {
                    atkNormalTypes.push(Object.keys(atkMulti)[i]);
                    atkNormalRaw.push(Object.keys(atkMulti)[i]);
                }
            }
            atkVulnDisplay[1] = `Deals normal damage to: ${atkNormalTypes.join(", ")}`;
        }
        if (atkResistCheck) {
            for (var i = 0; i < Object.keys(atkMulti).length; i++) {
                if (atkMulti[Object.keys(atkMulti)[i]] > 0 && atkMulti[Object.keys(atkMulti)[i]] < 1 && atkResistRaw.indexOf(Object.keys(atkMulti)[i]) == -1) {
                    atkResistTypes.push(Object.keys(atkMulti)[i] + " (x" + atkMulti[Object.keys(atkMulti)[i]] + ")");
                    atkResistRaw.push(Object.keys(atkMulti)[i]);
                }
            }
            atkVulnDisplay[2] = `Not very effective against: ${atkResistTypes.join(", ")}`;
        }
        if (atkNoCheck) {
            for (var i = 0; i < Object.keys(atkMulti).length; i++) {
                if (atkMulti[Object.keys(atkMulti)[i]] == 0 && atkNoRaw.indexOf(Object.keys(atkMulti)[i]) == -1) {
                    atkNoTypes.push(Object.keys(atkMulti)[i]);
                    atkNoRaw.push(Object.keys(atkMulti)[i]);
                }
            }
            atkVulnDisplay[3] = `Doesn't affect: ${atkNoTypes.join(", ")}`;
        }

        const typeEmbed = new Discord.MessageEmbed();
        typeEmbed
            .setColor('#FF0000')
            .setAuthor(`Type effectiveness for ${displayTypes.join(', ')}`)
            .addField('Offense', atkVulnDisplay.join('\n\n'))
            .addField('Defense', vulnDisplay.join('\n\n'))

        msg.embed(typeEmbed);
    };
};

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}