// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

var formatDate = require('./lib/formatDate');
var HSVtoRGB = require('./lib/HSVtoRGB');
const {ipcRenderer} = require('electron')

const profile = require('./profile');

var clockmode = "clock"
;(function() {
	'use strict'
	// var canvas = document.querySelector("#main-canvas")
	// var ctx = canvas.getContext("2d")
	// var startTime = Date.now();
	var startTime = new Date(profile.alarms[0].time)
	console.log(startTime);
	var titleText = profile.alarms[0].name

	var bgHue = Math.random();
	var hueCycle = 60*60*1000; // millisecond
	if(isRainbow(profile.defaultStyle)){
		hueCycle = profile.defaultStyle["background-color"].interval || hueCycle;
	}
	// var hueCycle = 10*1000; // millisecond


	var elem = {
		time: document.querySelector("#time"),
		title: document.querySelector("#title"),
		container: document.querySelector("#main-container")
	}
	ipcRenderer.on('clockmode', function (event, arg) {
		clockmode = arg.mode;
	})
	render()

	function render() {
		// ctx.save()
		// ctx.clearRect(0,0,100,100)
		// drawTime()
		if(clockmode=="clock"){
			elem.time.innerText = formatDate(new Date(), "HH::mm")//getFormattedTime(Date.now() - startTime)
		}else{
			elem.time.innerText = getFormattedTime(Math.abs(Date.now() - startTime))
		}
		elem.title.innerText = titleText

		if(isRainbow(profile.defaultStyle)){
			console.log("HI");
			updateBGColor(profile.defaultStyle)
		}
		// ctx.restore()

		window.requestAnimationFrame(render)
	}

	function drawTime(){
		ctx.textAlign="center"
		ctx.fillText(titleText, 50, 30)
		ctx.textBaseline="middle"
		ctx.font="18px Arial"
		// ctx.fillText(getFormattedTime(Date.now() - startTime), 50, 50)
		ctx.restore()
	}

	function updateBGColor(rainbowStyle) {
		let colorDef = rainbowStyle["background-color"];
		console.log(colorDef);
		let sat = colorDef.saturation || 1;
		let val = colorDef.value || 1;
		let opacity = colorDef.alpha || 1;
		bgHue = (Date.now() % hueCycle) / hueCycle
		console.log(bgHue);
		var color = HSVtoRGB(bgHue, sat, val) // or 0.64, 0.93
		elem.container.style.backgroundColor = "rgba(" + color.r + "," + color.g + "," + color.b + "," + opacity + ")"
	}

	function getFormattedTime(millisec) {
		return timeString(millisec)
	}


	function timeString(millisec) {
		// console.log(millisec);
		var now = new Date(millisec);
		// console.log(now);
		var years = now.getUTCFullYear() - 1970
		var months = now.getUTCMonth()
		var days = now.getUTCDate() - 1
		var hours = now.getUTCHours()
		var minutes = now.getUTCMinutes()
		var seconds = now.getUTCSeconds()
		var milliseconds = now.getUTCMilliseconds()
		var timeString = ""
			+ (months>0? months + "m " : "")
			+ (days >0? days + "d " : "")
			+ (hours>0? zeroPad( hours ) + ":" : "")
			+ zeroPad( minutes )
			+ (days  <=0? ":" + zeroPad( seconds ) : "")
			+ (hours <=0? "." + doubleZeroPad( milliseconds ): "")
			+ "";
		return timeString;
	}

	function isRainbow(style) {
		return style["background-color"].hasOwnProperty("type") && style['background-color'].type == "rainbow";
	}

	function zeroPad (num) {
		if(num>=10){
			return ""+num;
		}else{
			return "0"+num;
		}
	}

	function doubleZeroPad (num) {
		if(num>=100){
			return ""+num;
		}else if(num>=10){
			return "0"+num;
		}else{
			return "00"+num;
		}
	}

}())
