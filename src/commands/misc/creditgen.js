/*
 *   This file is part of discord-self-bot
 *   Copyright (C) 2017-2018 Favna
 *
 *   This program is free software: you can redistribute it and/or modify
 *   it under the terms of the GNU General Public License as published by
 *   the Free Software Foundation, version 3 of the License
 *
 *   This program is distributed in the hope that it will be useful,
 *   but WITHOUT ANY WARRANTY; without even the implied warranty of
 *   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *   GNU General Public License for more details.
 *
 *   You should have received a copy of the GNU General Public License
 *   along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 *   Additional Terms 7.b and 7.c of GPLv3 apply to this file:
 *       * Requiring preservation of specified reasonable legal notices or
 *         author attributions in that material or in the Appropriate Legal
 *         Notices displayed by works containing it.
 *       * Prohibiting misrepresentation of the origin of that material,
 *         or requiring that modified versions of such material be marked in
 *         reasonable ways as different from the original version.
 */

const Discord = require('discord.js'),
	card = require('creditcardutils'),
	commando = require('discord.js-commando'),
	{oneLine, stripIndents} = require('common-tags'),
	{capitalizeFirstLetter, deleteCommandMessages, momentFormat} = require('../../util.js');

module.exports = class creditgenCommand extends commando.Command {
	constructor (client) {
		super(client, {
			'name': 'creditgen',
			'memberName': 'creditgen',
			'group': 'misc',
			'aliases': ['cg'],
			'description': 'Generate a valid credit card number for those pesky sites that ask for one',
			'format': 'CreditcardNetwork',
			'examples': ['creditgen'],
			'guildOnly': false,
			'args': [
				{
					'key': 'network',
					'prompt': 'What credit card network do you want?',
					'type': 'string',
					'validate': (net) => {
						const validNets = ['visa', 'mastercard', 'amex'];

						if (validNets.includes(net.toLowerCase())) {
							return true;
						}

						return `Has to be one of ${validNets.join(', ')}`;
					},
					'default': 'visa'
				}
			]
		});
	}

	generateAmexNumber () {
		const amexDigits = [3];
		let amexDigitSum = 3,
			lastDigit = 10 - amexDigitSum % 10, // eslint-disable-line no-mixed-operators
			randomDigit = Math.floor(Math.random() * 2);

		if (randomDigit === 0) {
			randomDigit = 4;
		}
		if (randomDigit === 1) {
			randomDigit = 7;
		}
		amexDigits.push(randomDigit);
		randomDigit *= 2;
		if (randomDigit > 9) {
			randomDigit -= 9;
		}
		amexDigitSum += randomDigit;

		for (let i = 0; i < 12; i += 1) {
			randomDigit = Math.floor(Math.random() * 10);
			amexDigits.push(randomDigit);
			if (i % 2 === 1) {
				randomDigit *= 2;
				if (randomDigit > 9) {
					randomDigit -= 9;
				}
			}
			amexDigitSum += randomDigit;
		}

		if (amexDigitSum % 10 === 0) {
			lastDigit = 0;
		}
		amexDigits.push(lastDigit);

		return amexDigits.join('');
	}

	generateMastercardNumber () {
		const masterCardDigits = [5];
		let masterCardDigSum = 1, // eslint-disable-line sort-vars
			lastDigit = 10 - masterCardDigSum % 10, // eslint-disable-line sort-vars, no-mixed-operators
			randomDigit = Math.floor(Math.random() * 5) + 1;

		masterCardDigits.push(randomDigit);
		masterCardDigSum += randomDigit;

		for (let i = 0; i < 13; i += 1) {
			randomDigit = Math.floor(Math.random() * 10);
			masterCardDigits.push(randomDigit);
			if (i % 2 === 0) {
				randomDigit *= 2;
				if (randomDigit > 9) {
					randomDigit -= 9;
				}
			}
			masterCardDigSum += randomDigit;
		}

		if (masterCardDigSum % 10 === 0) {
			lastDigit = 0;
		}
		masterCardDigits.push(lastDigit);

		return masterCardDigits.join('');
	}

	generateVisaNumber () {
		const visaDigits = [4];
		let visaDigSum = 8,
			lastDigit = 10 - visaDigSum % 10; // eslint-disable-line sort-vars, no-mixed-operators

		for (let i = 0; i < 14; i += 1) {
			let randomDigit = Math.floor(Math.random() * 10);

			visaDigits.push(randomDigit);
			if (i % 2 === 1) {
				randomDigit *= 2;
				if (randomDigit > 9) {
					randomDigit -= 9;
				}
			}
			visaDigSum += randomDigit;
		}


		if (visaDigSum % 10 === 0) {
			lastDigit = 0;
		}
		visaDigits.push(lastDigit);

		return visaDigits.join('');
	}

	randomizeAddress () {
		const addressList = [
				'Cedar Lane', 'Franklin Court', 'Andover Court', 'Country Club Road', 'Highland Drive', 'Crescent Street',
				'Linden Avenue', 'King Street', 'Ann Street', 'Jefferson Avenue', 'Maiden Lane', 'Forest Street', 'Arlington Avenue',
				'Franklin Avenue', 'Laurel Lane', 'Rose Street', 'White Street', 'Warren Avenue', 'Briarwood Drive', 'Madison Avenue',
				'Hanover Court', 'Windsor Drive', 'Summit Avenue', 'Charles Street', 'Cedar Avenue', 'John Street', 'River Street',
				'Grand Avenue', 'Route 1', 'Devon Court', 'Monroe Street', 'Woodland Drive', 'Garfield Avenue', 'Main Street',
				'Essex Court', 'Front Street North', 'Williams Street', 'Orchard Avenue', 'Willow Avenue', 'Laurel Drive',
				'Pleasant Street', 'Atlantic Avenue', 'Fairway Drive', 'Clay Street', 'Olive Street', 'Route 30',
				'Cottage Street', 'Broad Street', 'Court Street', 'Heather Lane'
			],
			curAddress = Math.floor(Math.random() * addressList.length);

		return addressList[curAddress];
	}

	randomizeCountry () {
		const countryList = [
				'Australia', 'Austria', 'Belgium', 'Brazil', 'Canada', 'China', 'Denmark',
				'Finland', 'France', 'Germany', 'Ireland', 'Italy', 'Japan', 'Luxembourg',
				'Netherlands', 'New Zealand', 'Norway', 'Saudi Arabia', 'Sweden',
				'Switzerland', 'United Kingdom', 'United States'
			],
			curCountry = Math.floor(Math.random() * countryList.length);

		return countryList[curCountry];
	}

	randomizeExpire () {
		const curMonth = new Date().getMonth() + 1,
			curYear = new Date().getFullYear(),
			randomizedYear = Math.floor(Math.random() * 7) + curYear;

		let randomizedMonth = Math.floor(Math.random() * 12) + 1;

		if (randomizedYear === curYear) {
			const monthsToEnd = 12 - curMonth;

			randomizedMonth = Math.floor(Math.random() * monthsToEnd + 1) + curMonth; // eslint-disable-line no-mixed-operators
		}

		if (randomizedYear === curYear + 7) {
			randomizedMonth = Math.floor(Math.random() * (curMonth - 1) + 1); // eslint-disable-line no-mixed-operators
		}

		if (randomizedMonth < 10) {
			randomizedMonth = `0${randomizedMonth}`;
		}

		return `${randomizedMonth}/${randomizedYear}`;
	}

	randomizeFirstName () {
		const nameList = [
				'Ashley', 'Chloe', 'Katherine', 'Elizabeth', 'Isabella', 'Sophia', 'Emily', 'Emma',
				'Madison', 'Olivia', 'Abigail', 'Mia', 'Brianna', 'James', 'Christopher', 'Jackson',
				'Jayden', 'Etha', 'Tyler', 'Aiden', 'Joseph', 'Noah', 'Matthew', 'Jose', 'Jes',
				'William', 'Landon', 'Hunter', 'David', 'Andrew', 'Gabriel', 'Joshua', 'Daniel',
				'Anthony', 'Elijah', 'Michael', 'Ryan', 'Ava', 'Anna', 'Hannah', 'Alyssa',
				'Addison', 'Brooklyn', 'Natalie', 'Samantha', 'Julia', 'Grace', 'Alexis'
			],
			curFirstName = Math.floor(Math.random() * nameList.length); // eslint-disable-line sort-vars

		return nameList[curFirstName];
	}

	randomizeSecondName () {
		const secondNameList = [
				'Garcia', 'Martinez', 'Robinson', 'Clark', 'Rodriguez', 'Lewis', 'Lee', 'Walker', 'Hall',
				'Allen', 'Young', 'Hernandez', 'King', 'Wright', 'Lopez', 'Hill', 'Scott', 'Green',
				'Adams', 'Baker', 'Gonzalez', 'Nelson', 'Carter', 'Mitchell', 'Perez', 'Roberts',
				'Turner', 'Phillips', 'Campbell', 'Parker', 'Evans', 'Edwards', 'Collins',
				'Smith', 'Johnson', 'Williams', 'Jones', 'Brown', 'Davis', 'Miller',
				'Wilson', 'Moore', 'Taylor', 'Anderson', 'Thomas', 'Jackson',
				'White', 'Harris', 'Martin', 'Thompson'
			],
			curSecondName = Math.floor(Math.random() * secondNameList.length); // eslint-disable-line sort-vars

		return secondNameList[curSecondName];
	}

	run (msg, args) {
		/*  eslint-disable no-nested-ternary*/
		const cardNum = args.network === 'visa'
				? this.generateVisaNumber()
				: args.network === 'mastercard'
					? this.generateMastercardNumber()
					: this.generateAmexNumber(),
			/*  eslint-enable no-nested-ternary*/
			embed = new Discord.MessageEmbed(),
			info = stripIndents `
			**Issuing network**: ${capitalizeFirstLetter(args.network)}
			**Card Number**: ${card.formatCardNumber(cardNum)}
			**Name**: ${this.randomizeFirstName()} ${this.randomizeSecondName()}
			**Address**: ${this.randomizeAddress()} ${Math.floor(Math.random() * 150) + 1}
			**Country**: ${this.randomizeCountry()}
			**CVV**: ${Math.floor(Math.random() * 900) + 100}
			**Limit**: ${Math.floor(Math.random() * 4901) + 100}$
			**Exp**: ${this.randomizeExpire()}`;

		embed
			.setColor(msg.member !== null ? msg.member.displayHexColor : '#FF0000')
			.setDescription(info)
			/*  eslint-disable no-nested-ternary*/
			.setThumbnail(args.network === 'visa'
				? 'https://i.imgur.com/a7RQu01.png'
				: args.network === 'mastercard'
					? 'https://i.imgur.com/oCOOUn0.png'
					: 'https://i.imgur.com/mETGJCm.png')
			/*  eslint-enable no-nested-ternary*/
			.setFooter(oneLine(momentFormat(new Date(), this.client)));

		deleteCommandMessages(msg, this.client);

		return msg.embed(embed);
	}
};