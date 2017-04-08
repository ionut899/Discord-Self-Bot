const Commando = require('discord.js-commando');
const Discord = require("discord.js");

module.exports = class quote extends Commando.Command {
	constructor(client) {
		super(client, {
			name: 'quote',
			group: 'misc',
			memberName: 'quote',
			description: 'Get IPSW info and download link.',
			examples: ['`/ipsw iPhone1,1 1.0`'],
			promptLimit:0,
			args: [
				{
					key: 'channel',
					label: 'Channel',
					prompt: 'Channel',
					type: 'string',
					infinite: false
				},
				{
					key: 'message',
					label: 'Message',
					prompt: 'Message ',
					type: 'string',
					infinite: false
				},
				{
					key: 'content',
					label: 'content',
					prompt: 'Comment',
					type: 'string',
					default: '',
					wait:0,
					infinite: true,
					
				},
			]
		});
	}
	async run(msg, args) {
		msg.delete();
		const chan = this.client.channels.get(args.channel);
		if(chan !== undefined) {
			this.client.channels.get(args.channel).fetchMessages({limit:1,around:args.message}).then(msgs => {
				const tmp = msgs.first();
				const emb = new Discord.RichEmbed();
				emb.setAuthor(tmp.member.displayName, tmp.author.displayAvatarURL)
				.setFooter(new Date(tmp.createdTimestamp).toUTCString())
				.addField('Message', `${tmp.content}`)
				msg.channel.sendMessage(`${args.content}`,{embed:emb})
			}).catch(function(error){
				msg.reply('Message not found.').then(msgs => msgs.delete(10000));
			});
		} else {
			msg.reply('Channel Not Found').then(msgs => msgs.delete(10000));
		}
	}
};