const SlackBot = require('slackbots');
const request = require('request');

const conf = require('../config.json');

const SLACK_TOKEN = conf.slack.slackToken;
const CHANNEL_ID = conf.slack.channelId;
const CHANNEL_NAME = conf.slack.channelName;

const bot = new SlackBot({
  token: SLACK_TOKEN,
  name: 'Messenger'
});

let mod = module.exports = {};

mod.sendMessage = (message, name, image) => {
  var params = {
    username: name,
    icon_url: image
  };
  bot.postMessageToChannel(CHANNEL_NAME, message, params);
};

mod.init = () => {
  let promise = new Promise((resolve, reject) => {
    bot.on('start', resolve);
  });
  return promise;
};

mod.listen = (callback) => {
  bot.on('message', (message) => {
    if (message.type == 'message' && message.channel == CHANNEL_ID && !message.hidden && message.subtype != 'bot_message') {
      request({
        method: 'POST',
        url: 'https://slack.com/api/users.info',
        qs: {
          token: SLACK_TOKEN,
          user: message.user
        }
      }, (error, response, bodyString) => {
        let body = JSON.parse(bodyString);
        if (!error && body.ok && body.user) {
          console.log(message.text);
          callback(message.text, body.user.real_name);
        } else {
          callback(message.text, 'Unknown');
        }        
      });
    }
  });
};