const commando = require('discord.js-commando');

module.exports = class multiSenderCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'multi',
            group: 'misc',
            aliases: ['sender'],
            memberName: 'multisender',
            description: 'Send a message to multiple servers',
            examples: ['multi 123 This is my message', 'sender 12 this is my message'],
            guildOnly: false,

            args: [{
                key: 'input',
                prompt: 'To what servers should we send the message (1 for Sky Tower, 2 for Populous Gaming and 3 for ChaosGamez)',
                type: 'string'
            }]
        });
    }

    async run(msg, args) {
        let servers = args.input.slice(0, 3).split('');
        let multiMessage = args.input.slice(4);
        console.log(servers)

        for (let index in servers) {
            multiMessage.slice(0, 4) !== 'http' ? multiMessage = `${args.input.slice(4, 5).toUpperCase()}${args.input.slice(5)}` : null
            msg.attachments.first() !== undefined && msg.attachments.first().url !== undefined ? multiMessage += `\n${msg.attachments.first().url}` : null
            switch (servers[index]) {
                case '1':
                    msg.client.channels.get('199537212348432384').send(multiMessage);
                    break;
                case '2':
                    msg.client.channels.get('152464629753315328').send(multiMessage);
                    break;
                case '3':
                    msg.client.channels.get('210739929758695425').send(multiMessage);
                    break;
                default:
                    return;
            }
        }
    };
};