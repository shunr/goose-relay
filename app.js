const messenger = require('./service/messenger');
const slack = require('./service/slack');

let app = module.exports = {};

app.init = () => {
  Promise.all([messenger.init(), slack.init()]).then(() => {
    messenger.listen(slack.sendMessage);
    slack.listen(messenger.sendMessage);
  });
};

app.init();