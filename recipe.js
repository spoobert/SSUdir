var AlexaSkill = require('./AlexaSkill')
var TEACHER_STUFF_KEY = 'TEACHER_STUFF_KEY'
module.exports.TEACHER_STUFF_KEY = TEACHER_STUFF_KEY

module.exports.optionsBuilder = function(Fname, Lname) {

    return {
        host: 'moonlight.cs.sonoma.edu',
        path: '/api/v1/directory/person/?search=' + Fname + '+' + Lname
    }
};



module.exports.callbackBuilder = function(alexa_response, session) {
    return function(moonlight_response) {
        var str = '';
        var result = {};
        var cardTitle = "SSU teacher room number";


            moonlight_response.on('data', function(chunk) {
            str += chunk;
        });


        moonlight_response.on('end', function() {
            var result = JSON.parse(str)
            if (result.length === 0) {
                var wrongName = {
                    speech: 'I am sorry SSU Moonlight was not able to locate anyone by that name, please try again.',
                    type: AlexaSkill.speechOutputType.PLAIN_TEXT
                }
                alexa_response.tellWithCard(wrongName, cardTitle, wrongName.speech);
            } else {
                var repromptOutput = {
                    speech: 'I\'m sorry I did not understand you I have info about',
                    type: AlexaSkill.speechOutputType.PLAIN_TEXT
                }

                var speechOutput = {
                    speech: 'I have located ' + result[0].name + ' say office, phone, or email to hear the answer.',

                    type: AlexaSkill.speechOutputType.PLAIN_TEXT
                };
                session.attributes.TEACHER_STUFF_KEY = result                    // ask needs reprompt 
                alexa_response.ask(speechOutput, repromptOutput)
            }
        });
    };
};

