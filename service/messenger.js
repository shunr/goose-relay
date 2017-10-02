const login = require('facebook-chat-api');
const slack = require('./slack');
const conf = require('../config.json');

const THREAD_ID = conf.messenger.threadId;

const AUTH = {
  email: conf.messenger.email,
  password: conf.messenger.password
};

let mod = module.exports = {};
let api;

mod.init = () => {
  let promise = new Promise((resolve, reject) => {
    login(AUTH, (err, obj) => {
      if (err) {
        reject(console.error(err));
      } else {
        api = obj;
        resolve();
      }
    });
  });
  return promise;
};

mod.listen = (callback) => {
  api.listen((err, message) => {
    if (err || !message) return;
    if (message.type != 'message' || message.threadID != THREAD_ID) return;
    api.getUserInfo(message.senderID, (err, obj) => {
      if (!err && obj) {
        console.log(message.body);
        callback(message.body, obj[message.senderID].name, obj[message.senderID].thumbSrc);
      }
    });
  });
};

mod.sendMessage = (message, name) => {
  if (api) api.sendMessage('[SLACK] ' + name + ': ' + message, THREAD_ID);
};