const layout = {
  'ping:bot-step': {
    text: "🌫 <b>Handlebarsjs Syntax is here</b>",
    buttons: {
        "🚥 Some button": "goto:some_another_step"
    }
   },
  'some_another_step:bot-step': {
    text: "🌫 <b>Another step</b>",
    buttons: {
        "🚥 Go to ping": "goto:ping"
    }
  }
};

const app = function(config){ return function(tanos){
    const $ = {};
    return $;
  }
}

module.exports = { app, layout }