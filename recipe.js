var AlexaSkill = require('./AlexaSkill')
module.exports.TEACHER_STUFF_KEY = 'TEACHER_STUFF_KEY'

module.exports.optionsBuilder = function (Fname, Lname) {

    return {
        host: 'moonlight.cs.sonoma.edu',
        path: '/api/v1/directory/person/?search=' + Fname + '+' + Lname
    }
}; 



module.exports.callbackBuilder = function(alexa_response) {
    return function(moonlight_response) {
        var str = '';
        var result = {};
        var cardTitle = "SSU teacher room number";
            

        moonlight_response.on('data', function (chunk) {
            str += chunk;
        });
        

        moonlight_response.on('end', function() {
            var result = JSON.parse(str)
            if(result.length === 0){
                var wrongName = {
                    speech:  'I am sorry SSU moonlight does not recognise this name.',
                    type: AlexaSkill.speechOutputType.PLAIN_TEXT
                }
            alexa_response.tellWithCard(wrongName, cardTitle, wrongName.speech);
            }
            else {
            repromptOutput = {
                speech:'I\'m sorry i did not understand you I have info about',
                type: AlexaSkill.speechOutputType.PLAIN_TEXT
            };

            speechOutput = {
                    speech: 'I have info about' + 'name' + ',' 'room' + ',' 'email' + 'which would you like to hear',
                    type: AlexaSkill.speechOutputType.PLAIN_TEXT
                };
            alexa_response.session(TEACHER_STUFF_KEY,result)
            // ask needs reprompt 
            alexa_response.ask(speechOutput,repromptOutput )
        }
        });
    };
};
