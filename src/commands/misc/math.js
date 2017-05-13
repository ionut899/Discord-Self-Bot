const scalc = require('scalc');
const commando = require('discord.js-commando');

module.exports = class mathCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'math',
            aliases: ['calc'],
            group: 'misc',
            memberName: 'math',
            description: 'Calculate anything with scalc',
            examples: ['math -1 + -5 = -6', 'math -10 - abs(-3) + 2^5 = 18'],
            guildOnly: false,

            args: [{
                key: 'equation',
                prompt: 'What is the equation to solve?',
                type: 'string'
            }]
        });
    }

    async run(msg, args) {
        let toCalc = args.equation;
        msg.delete();
        await msg.say(`\`The answer to ${toCalc} is ${scalc(toCalc)}\``)
    }
};