
var converter = require('number-to-words');

(function() {
	'use strict';
	function Speech() {
		this.voices = [];
		this.voiceID = 3;
		this.dynamicPhraseGenerator = {};
	}


	var p = Speech.prototype;

	p.init = function init(){
		this.voices = window.speechSynthesis.getVoices();
		console.log(this.voices);
		// console.log(this.voices.map(function (voice) {
		// 	return voice.name
		// }));
	};

	p.say = function say(msgString){
		var _this = this;
		var compiledString = msgString.replace(/_(\w+)\(()\)/, function () {
			let tokens = arguments
			console.log(tokens);
			return _this.inject(tokens[1], [].slice.call(tokens,2));
		}).replace(/\d\d*/g, function (match, p1) {
			return converter.toWords(Number(match));
		});
		this.speakThis(compiledString)
	};

	p.speakThis = function speakThis(msgText, vID){
		this.voices = window.speechSynthesis.getVoices();
		var utterance = new SpeechSynthesisUtterance(msgText);
		utterance.voice = this.voices[vID || this.voiceID];
		utterance.lang='en-US';
		utterance.onend = function () {
			// TODO: onend

		}
		console.log("speak:", utterance);
		window.speechSynthesis.cancel();
		window.speechSynthesis.speak(utterance);
	};

	// register callback
	p.addDynamicPhrase = function addDynamicPhrase(hookName, callback){
		this.dynamicPhraseGenerator[hookName] = callback;
	};

	// use callback to make dynamic content
	p.inject = function inject(hookName, args){
		console.log(this.dynamicPhraseGenerator);
		if(! this.dynamicPhraseGenerator.hasOwnProperty(hookName)) return "";

		return this.dynamicPhraseGenerator[hookName](this, args);
	};

	module.exports = Speech;

}());
