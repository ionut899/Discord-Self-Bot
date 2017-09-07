# Discord-Self-Bot #

This it the source for Favna's Discord-Self-Bot. The owner of this bot is Favna. This code of this bot has been made publicly available under the GNU Licence.

### Getting started ###

## NOTE: The information below is outdated and using these will require pre-existing NodeJS knowledge to run it. I am working on getting the wiki on this repository set up for proper noob friendly installation instructions.

---

First of all you need to install [node.js](https://nodejs.org/en/). You can [download it here](https://nodejs.org/en/download/). Once you have node.js set up clone this repository with `git clone`. After cloning this repository run `npm install` in the project root to install all dependancies.

### Requirements for hosting this code ###

You have to create a file `auth.json` in the `src` folder. This file has to have a series of variables for the bot to function properly. The required variables are as follows. A template file has been included in the folder to base it on.

  - token: Your bot or user token

  - googleapikey: A Google API Key. Enable Custom Search engine and Youtube Data API

  - imageEngineKey: Google Custom Search Engine key (can be the same as searchEngineKey but not recommended)

  - searchEngineKey: Google Custom Search Engine key (can be the same as imageEngineKey but not recommended)

  - ownerID: Your user ID

  - oxrAppID: An API key created on Open-Exchange-Rates

  - TheMovieDBV3ApiKey: Your API key created on The Movie DB

  - webhooktoken: A token from a webhook for the notifier (last part of a webhook URL)

  - webhookID: The ID of a webhook (also present in URL of a webhook)
