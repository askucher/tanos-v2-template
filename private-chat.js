const layout = {
    'main:bot-step': {
      text: "🌫 <b>Main is invoked when you enter the chat</b>",
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