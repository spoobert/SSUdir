'use strict';

//######## Whenever you first creat a module node.js throws a generic module.exports = {}; in the file  it makes a blank object 
// so what node.js does is it looks inside the module.exports object and see's whatever is inside of it.  

//common practice to name the variable the same as the module.  
var AlexaSkill = require('./AlexaSkill'),
    recipes = require('./recipes'),
    http = require('http');


var APP_ID = 'amzn1.ask.skill.63621c63-b779-40cf-b258-e73b00fabaa6'; //OPTIONAL: replace with 'amzn1.echo-sdk-ams.app.[your-unique-value-here]';

var HowTo = function () {
    AlexaSkill.call(this, APP_ID);
};

// Extend AlexaSkill
HowTo.prototype = Object.create(AlexaSkill.prototype);
HowTo.prototype.constructor = HowTo;

HowTo.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    var speechText = "Welcome to the Darwin Hall Faculty Directory. You can ask me a question like, what's George Le dean's office phone number? ... Now, what can I help you with.";
    // If the user either does not reply to the welcome message or says something that is not
    // understood, they will be prompted again with this text.
    var repromptText = "For instructions on what you can say, please say help me.";
    response.ask(speechText, repromptText);
};

HowTo.prototype.intentHandlers = {
    "RecipeIntent": function (intent, session, response) {
        var itemSlot = intent.slots.Bloop,
            itemName;
        if (itemSlot && itemSlot.value){
            itemName = itemSlot.value.toLowerCase();
        }
        var cardTitle = "Information for " + itemName,
          recipe = recipes[itemName],
            speechOutput,
            repromptOutput;
        if (recipe) {
            speechOutput = {
                speech: recipe,
                type: AlexaSkill.speechOutputType.PLAIN_TEXT
            };
            response.tellWithCard(speechOutput, cardTitle, recipe);
        } else {
            var speech;
            if (itemName) {
                speech = "I'm sorry, I currently do not know that answer. What else can I help you with?";
            } else {
                speech = "I'm sorry, I currently do not know that. What else can I help you with?";
            }
            speechOutput = {
                speech: speech,
                type: AlexaSkill.speechOutputType.PLAIN_TEXT
            };
            repromptOutput = {
                speech: "Is there anything else I can help you with?",
                type: AlexaSkill.speechOutputType.PLAIN_TEXT
            };
            response.ask(speechOutput, repromptOutput);
        }
    },

    "AMAZON.StopIntent": function (intent, session, response) {
        var speechOutput = "Goodbye, and thanks for using the Darwin Hall Directory!";
        response.tell(speechOutput);
    },
	
	"AMAZON.PreviousIntent": function (intent, session, response) {
        var speechOutput = "What can I assist you with?";
        response.tell(speechOutput);
	},

    "AMAZON.CancelIntent": function (intent, session, response) {
        var speechOutput = "Goodbye";
        response.tell(speechOutput);
    },

    "AMAZON.HelpIntent": function (intent, session, response) {
        var speechText = "You can ask questions like, who is Tia Watts, or, you can say exit... Now, what can I help you with?";
        var repromptText = "You can ask me things like, what is Glenn Carter's email address, or you can say exit... Now, what can I help you out with?";
        var speechOutput = {
            speech: speechText,
            type: AlexaSkill.speechOutputType.PLAIN_TEXT
        };
        var repromptOutput = {
            speech: repromptText,
            type: AlexaSkill.speechOutputType.PLAIN_TEXT
        };
        response.ask(speechOutput, repromptOutput);
    }
};

exports.handler = function (event, context) {
    var howTo = new HowTo();
    howTo.execute(event, context);
};



 /*



callback = function(response) {
    var str = '';
    var result = {};

    response.on('data', function (chunk) {
        str += chunk;
    });

    response.on('end', function() {
        result = JSON.parse(str);
        console.log(result[1].name)
    });
}

http.request(options, callback).end();

        */

