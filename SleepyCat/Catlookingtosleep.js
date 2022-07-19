(function (cjs, an) {

var p; // shortcut to reference prototypes
var lib={};var ss={};var img={};
lib.ssMetadata = [
		{name:"Catlookingtosleep_atlas_1", frames: [[829,626,244,118],[448,320,273,127],[1108,571,364,299],[0,626,369,294],[1474,571,364,299],[1407,228,323,341],[0,320,446,110],[371,626,456,179],[1407,0,568,226],[371,807,495,83],[0,484,1106,140],[723,0,361,482],[0,0,721,318],[1108,452,174,62],[1086,0,319,450]]},
		{name:"Catlookingtosleep_atlas_2", frames: [[0,414,1442,314],[0,1046,771,541],[773,1046,779,473],[0,0,1288,412],[0,1589,1078,329],[0,730,1442,314],[1080,1521,878,329],[1444,0,499,474],[1554,476,452,521]]},
		{name:"Catlookingtosleep_atlas_3", frames: [[0,0,1316,971],[0,973,1477,808]]},
		{name:"Catlookingtosleep_atlas_4", frames: [[0,0,1309,895],[0,897,1553,539],[0,1438,1712,423]]},
		{name:"Catlookingtosleep_atlas_5", frames: [[0,1499,1253,430],[0,0,638,1116],[0,1118,1755,379],[640,0,773,814]]},
		{name:"Catlookingtosleep_atlas_6", frames: [[0,0,1706,993]]},
		{name:"Catlookingtosleep_atlas_7", frames: [[0,0,1536,1078]]}
];


(lib.AnMovieClip = function(){
	this.actionFrames = [];
	this.ignorePause = false;
	this.currentSoundStreamInMovieclip;
	this.soundStreamDuration = new Map();
	this.streamSoundSymbolsList = [];

	this.gotoAndPlayForStreamSoundSync = function(positionOrLabel){
		cjs.MovieClip.prototype.gotoAndPlay.call(this,positionOrLabel);
	}
	this.gotoAndPlay = function(positionOrLabel){
		this.clearAllSoundStreams();
		var pos = this.timeline.resolve(positionOrLabel);
		if (pos != null) { this.startStreamSoundsForTargetedFrame(pos); }
		cjs.MovieClip.prototype.gotoAndPlay.call(this,positionOrLabel);
	}
	this.play = function(){
		this.clearAllSoundStreams();
		this.startStreamSoundsForTargetedFrame(this.currentFrame);
		cjs.MovieClip.prototype.play.call(this);
	}
	this.gotoAndStop = function(positionOrLabel){
		cjs.MovieClip.prototype.gotoAndStop.call(this,positionOrLabel);
		this.clearAllSoundStreams();
	}
	this.stop = function(){
		cjs.MovieClip.prototype.stop.call(this);
		this.clearAllSoundStreams();
	}
	this.startStreamSoundsForTargetedFrame = function(targetFrame){
		for(var index=0; index<this.streamSoundSymbolsList.length; index++){
			if(index <= targetFrame && this.streamSoundSymbolsList[index] != undefined){
				for(var i=0; i<this.streamSoundSymbolsList[index].length; i++){
					var sound = this.streamSoundSymbolsList[index][i];
					if(sound.endFrame > targetFrame){
						var targetPosition = Math.abs((((targetFrame - sound.startFrame)/lib.properties.fps) * 1000));
						var instance = playSound(sound.id);
						var remainingLoop = 0;
						if(sound.offset){
							targetPosition = targetPosition + sound.offset;
						}
						else if(sound.loop > 1){
							var loop = targetPosition /instance.duration;
							remainingLoop = Math.floor(sound.loop - loop);
							if(targetPosition == 0){ remainingLoop -= 1; }
							targetPosition = targetPosition % instance.duration;
						}
						instance.loop = remainingLoop;
						instance.position = Math.round(targetPosition);
						this.InsertIntoSoundStreamData(instance, sound.startFrame, sound.endFrame, sound.loop , sound.offset);
					}
				}
			}
		}
	}
	this.InsertIntoSoundStreamData = function(soundInstance, startIndex, endIndex, loopValue, offsetValue){ 
 		this.soundStreamDuration.set({instance:soundInstance}, {start: startIndex, end:endIndex, loop:loopValue, offset:offsetValue});
	}
	this.clearAllSoundStreams = function(){
		this.soundStreamDuration.forEach(function(value,key){
			key.instance.stop();
		});
 		this.soundStreamDuration.clear();
		this.currentSoundStreamInMovieclip = undefined;
	}
	this.stopSoundStreams = function(currentFrame){
		if(this.soundStreamDuration.size > 0){
			var _this = this;
			this.soundStreamDuration.forEach(function(value,key,arr){
				if((value.end) == currentFrame){
					key.instance.stop();
					if(_this.currentSoundStreamInMovieclip == key) { _this.currentSoundStreamInMovieclip = undefined; }
					arr.delete(key);
				}
			});
		}
	}

	this.computeCurrentSoundStreamInstance = function(currentFrame){
		if(this.currentSoundStreamInMovieclip == undefined){
			var _this = this;
			if(this.soundStreamDuration.size > 0){
				var maxDuration = 0;
				this.soundStreamDuration.forEach(function(value,key){
					if(value.end > maxDuration){
						maxDuration = value.end;
						_this.currentSoundStreamInMovieclip = key;
					}
				});
			}
		}
	}
	this.getDesiredFrame = function(currentFrame, calculatedDesiredFrame){
		for(var frameIndex in this.actionFrames){
			if((frameIndex > currentFrame) && (frameIndex < calculatedDesiredFrame)){
				return frameIndex;
			}
		}
		return calculatedDesiredFrame;
	}

	this.syncStreamSounds = function(){
		this.stopSoundStreams(this.currentFrame);
		this.computeCurrentSoundStreamInstance(this.currentFrame);
		if(this.currentSoundStreamInMovieclip != undefined){
			var soundInstance = this.currentSoundStreamInMovieclip.instance;
			if(soundInstance.position != 0){
				var soundValue = this.soundStreamDuration.get(this.currentSoundStreamInMovieclip);
				var soundPosition = (soundValue.offset?(soundInstance.position - soundValue.offset): soundInstance.position);
				var calculatedDesiredFrame = (soundValue.start)+((soundPosition/1000) * lib.properties.fps);
				if(soundValue.loop > 1){
					calculatedDesiredFrame +=(((((soundValue.loop - soundInstance.loop -1)*soundInstance.duration)) / 1000) * lib.properties.fps);
				}
				calculatedDesiredFrame = Math.floor(calculatedDesiredFrame);
				var deltaFrame = calculatedDesiredFrame - this.currentFrame;
				if((deltaFrame >= 0) && this.ignorePause){
					cjs.MovieClip.prototype.play.call(this);
					this.ignorePause = false;
				}
				else if(deltaFrame >= 2){
					this.gotoAndPlayForStreamSoundSync(this.getDesiredFrame(this.currentFrame,calculatedDesiredFrame));
				}
				else if(deltaFrame <= -2){
					cjs.MovieClip.prototype.stop.call(this);
					this.ignorePause = true;
				}
			}
		}
	}
}).prototype = p = new cjs.MovieClip();
// symbols:



(lib.CachedBmp_43 = function() {
	this.initialize(img.CachedBmp_43);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,2070,1263);


(lib.CachedBmp_37 = function() {
	this.initialize(ss["Catlookingtosleep_atlas_2"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_36 = function() {
	this.initialize(ss["Catlookingtosleep_atlas_3"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_35 = function() {
	this.initialize(ss["Catlookingtosleep_atlas_2"]);
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_34 = function() {
	this.initialize(ss["Catlookingtosleep_atlas_1"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_33 = function() {
	this.initialize(ss["Catlookingtosleep_atlas_1"]);
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_32 = function() {
	this.initialize(ss["Catlookingtosleep_atlas_1"]);
	this.gotoAndStop(2);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_31 = function() {
	this.initialize(ss["Catlookingtosleep_atlas_1"]);
	this.gotoAndStop(3);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_30 = function() {
	this.initialize(ss["Catlookingtosleep_atlas_1"]);
	this.gotoAndStop(4);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_29 = function() {
	this.initialize(ss["Catlookingtosleep_atlas_1"]);
	this.gotoAndStop(5);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_28 = function() {
	this.initialize(img.CachedBmp_28);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,2747,1896);


(lib.CachedBmp_27 = function() {
	this.initialize(ss["Catlookingtosleep_atlas_5"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_39 = function() {
	this.initialize(ss["Catlookingtosleep_atlas_7"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_25 = function() {
	this.initialize(ss["Catlookingtosleep_atlas_1"]);
	this.gotoAndStop(6);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_24 = function() {
	this.initialize(ss["Catlookingtosleep_atlas_2"]);
	this.gotoAndStop(2);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_23 = function() {
	this.initialize(ss["Catlookingtosleep_atlas_4"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_22 = function() {
	this.initialize(ss["Catlookingtosleep_atlas_1"]);
	this.gotoAndStop(7);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_21 = function() {
	this.initialize(ss["Catlookingtosleep_atlas_2"]);
	this.gotoAndStop(3);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_20 = function() {
	this.initialize(ss["Catlookingtosleep_atlas_1"]);
	this.gotoAndStop(8);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_19 = function() {
	this.initialize(ss["Catlookingtosleep_atlas_1"]);
	this.gotoAndStop(9);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_18 = function() {
	this.initialize(ss["Catlookingtosleep_atlas_5"]);
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_17 = function() {
	this.initialize(ss["Catlookingtosleep_atlas_4"]);
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_16 = function() {
	this.initialize(ss["Catlookingtosleep_atlas_1"]);
	this.gotoAndStop(10);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_15 = function() {
	this.initialize(ss["Catlookingtosleep_atlas_3"]);
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_44 = function() {
	this.initialize(ss["Catlookingtosleep_atlas_2"]);
	this.gotoAndStop(4);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_13 = function() {
	this.initialize(ss["Catlookingtosleep_atlas_6"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_40 = function() {
	this.initialize(ss["Catlookingtosleep_atlas_2"]);
	this.gotoAndStop(5);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_11 = function() {
	this.initialize(ss["Catlookingtosleep_atlas_1"]);
	this.gotoAndStop(11);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_10 = function() {
	this.initialize(ss["Catlookingtosleep_atlas_2"]);
	this.gotoAndStop(6);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_9 = function() {
	this.initialize(ss["Catlookingtosleep_atlas_1"]);
	this.gotoAndStop(12);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_8 = function() {
	this.initialize(ss["Catlookingtosleep_atlas_2"]);
	this.gotoAndStop(7);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_7 = function() {
	this.initialize(ss["Catlookingtosleep_atlas_1"]);
	this.gotoAndStop(13);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_6 = function() {
	this.initialize(ss["Catlookingtosleep_atlas_2"]);
	this.gotoAndStop(8);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_5 = function() {
	this.initialize(ss["Catlookingtosleep_atlas_1"]);
	this.gotoAndStop(14);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_4 = function() {
	this.initialize(img.CachedBmp_4);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,2166,1202);


(lib.CachedBmp_3 = function() {
	this.initialize(ss["Catlookingtosleep_atlas_5"]);
	this.gotoAndStop(2);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_2 = function() {
	this.initialize(ss["Catlookingtosleep_atlas_5"]);
	this.gotoAndStop(3);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_1 = function() {
	this.initialize(ss["Catlookingtosleep_atlas_4"]);
	this.gotoAndStop(2);
}).prototype = p = new cjs.Sprite();
// helper functions:

function mc_symbol_clone() {
	var clone = this._cloneProps(new this.constructor(this.mode, this.startPosition, this.loop, this.reversed));
	clone.gotoAndStop(this.currentFrame);
	clone.paused = this.paused;
	clone.framerate = this.framerate;
	return clone;
}

function getMCSymbolPrototype(symbol, nominalBounds, frameBounds) {
	var prototype = cjs.extend(symbol, cjs.MovieClip);
	prototype.clone = mc_symbol_clone;
	prototype.nominalBounds = nominalBounds;
	prototype.frameBounds = frameBounds;
	return prototype;
	}


(lib.wallfacingus = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#A48A7B").s().p("AkdKdIAAhgID1AAIAABggAApG3IAAhzID1AAIAABzgAkdE6IAAhuID1AAIAABugAkdDCIAAhgID1AAIAABggAApgjIAAhyID1AAIAABygAkdifIAAhyID1AAIAABygAkdkbIAAhOID1AAIAABOgAApnZIAAhdID1AAIAABdgAkdpAIAAhcID1AAIAABcg");
	this.shape.setTransform(29.6,67.925);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#7B6A58").s().p("AgeJqIAAhhIE8AAIAABhgAkdH/IAAhyID1AAIAABygAkcGDIAAhyIE7AAIAABygAgeCPIAAhgIE8AAIAABggAkdAlIAAhxID1AAIAABxgAkchWIAAhyIE7AAIAABygAgelOIAAhOIE8AAIAABOgAkdmmIAAhcID1AAIAABcgAkcoMIAAhdIE7AAIAABdg");
	this.shape_1.setTransform(29.575,73.05);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#634E42").s().p("AidJoIAAhyIE7AAIAABygAidFwIAAhuIE7AAIAABugAidCOIAAhzIE7AAIAABzgAidhqIAAhyIE7AAIAABygAidk9IAAhdIE7AAIAABdgAidoKIAAhdIE7AAIAABdg");
	this.shape_2.setTransform(42.325,62.6);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#1D1D1B").s().p("AknKnIAAjwIABAAIAAhzIgBAAIAAlnIABAAIAAhyIgBAAIAAlEIABAAIAAhdIgBAAIAAhwIJOAAIAABmIABAAIAABxIgBAAIAAEwIABAAIAACGIgBAAIAAFTIABAAIAACHIgBAAIAADmgAgeKdIE7AAIAAhgIk7AAgAkdKdID1AAIAAhgIj1AAgAgeIzIE7AAIAAhyIk7AAgAkdIzID1AAIAAhyIj1AAgAApG3ID1AAIAAhzIj1AAgAkcG3IE7AAIAAhzIk7AAgAgeE6IE7AAIAAhuIk7AAgAkdE6ID1AAIAAhuIj1AAgAgeDCIE7AAIAAhgIk7AAgAkdDCID1AAIAAhgIj1AAgAgeBYIE7AAIAAhxIk7AAgAkdBYID1AAIAAhxIj1AAgAApgjID1AAIAAhyIj1AAgAkcgjIE7AAIAAhyIk7AAgAgeifIE7AAIAAhyIk7AAgAkdifID1AAIAAhyIj1AAgAgekbIE7AAIAAhOIk7AAgAkdkbID1AAIAAhOIj1AAgAgelzIE7AAIAAhcIk7AAgAkdlzID1AAIAAhcIj1AAgAApnZID1AAIAAhdIj1AAgAkcnZIE7AAIAAhdIk7AAgAgepAIE7AAIAAhcIk7AAgAkdpAID1AAIAAhcIj1AAg");
	this.shape_3.setTransform(29.6,67.925);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_3},{t:this.shape_2},{t:this.shape_1},{t:this.shape}]}).wait(15));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,59.2,135.9);


(lib.wall12 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_36();
	this.instance.setTransform(-0.45,-0.45,0.0608,0.0608);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-0.4,-0.4,80,59);


(lib.Tween17 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_35();
	this.instance.setTransform(-74.6,-52.35,0.1936,0.1936);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-74.6,-52.3,149.3,104.69999999999999);


(lib.Tween6 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#666666").ss(1,1,1).p("Aj+hZQAXARAhAfQBBA9AtBGQAjgfA7gfQB4g8CBAE");
	this.shape.setTransform(-0.016,0.0456,1.2303,1.9524);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-32.4,-18.4,64.8,36.9);


(lib.Tween5 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#666666").ss(1,1,1).p("Aj+hZQAXARAhAfQBBA9AtBGQAjgfA7gfQB4g8CBAE");
	this.shape.setTransform(0.025,0);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-26.5,-9.9,53.1,19.9);


(lib.Tween4 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_34();
	this.instance.setTransform(-60.9,-29.45,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-60.9,-29.4,122,59);


(lib.Tween3 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_33();
	this.instance.setTransform(-68.2,-31.6,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-68.2,-31.6,136.5,63.5);


(lib.Tween13 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_32();
	this.instance.setTransform(-50.25,-41.2,0.2759,0.2759);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-50.2,-41.2,100.4,82.5);


(lib.Tween12 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_31();
	this.instance.setTransform(-51,-40.5,0.2759,0.2759);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-51,-40.5,101.8,81.1);


(lib.Tween11 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_30();
	this.instance.setTransform(-50.2,-41.2,0.2759,0.2759);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-50.2,-41.2,100.5,82.5);


(lib.table_cup12 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_29();
	this.instance.setTransform(-0.25,-0.25,0.1736,0.1736);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-0.2,-0.2,56.1,59.2);


(lib.Symbol1 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#E6EBEF").s().p("AD6DoQhHgKhHgfIg6gdQkiBEjehsQhFgig2gwIgpgoQi8g2gmhhQgMgfAEgeIAHgZQA5BzB6AdQA9APAygJQAIAsCIA5QBEAeBCAUQCyAfBjgMQAxgGANgNQAqAvB4AFQA8ACA0gHQB7ggA4g0QAhggADggIAAgHQB6AaBqhmQAhggAcgqIAVgiQAnChiHBdQhEAvhLAPQhzCWiyAAQgiAAglgGg");
	this.shape.setTransform(86.1507,59.0037);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#FFFFFF").s().p("ADZFhQh5gFgpgvQgOANgwAGQhjAMizgfQhCgUhEgeQiHg6gIgsQgyAJg9gPQh7gdg4hyQgDgXAagYQA0gxCQgFQAjguA9gYQB7gxCBBsIAKgKQAQgIAdAKQAYgoA2gjQBthECZAdQAUgnA3ghQBshDCpAeIAYAGQAdAJAaASQBUA3AZBzIAgADQAmAEAgAMQBlAlAABcIgVAiQgcAqghAgQhqBmh5gaIAAAHQgDAggiAhQg3A0h7AgQgmAFgrAAIgfAAg");
	this.shape_1.setTransform(86.1095,35.3296);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Symbol1, new cjs.Rectangle(0,0,172.3,82.8), null);


(lib.SUNRAY = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#F5EACE").s().p("AsqHqIPOvwIKHAAIoUQNg");
	this.shape.setTransform(81.1,51.9);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.SUNRAY, new cjs.Rectangle(0,0,162.2,103.8), null);


(lib.startButton = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// button_looks
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#999999").ss(1,1,1).p("Am0kcINpAAQBlAABHBMQBHBLAABqIAAA4QAABqhHBLQhHBLhlAAItpAAQhlAAhHhLQg+hCgIhaQgBgNAAgMIAAg4QAAhqBHhLQBHhMBlAAg");
	this.shape.setTransform(0.3,-5.45);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#FFE1DB").s().p("AhICfQgegagOgIQgqgYAAghQAAghAqgXQApgXA7AAQA6AAApAXQAqAXAAAhQAAAhgqAYIgvAiQghAXgXAAQgXAAgdgXgACQACQgWgCgHgXQgHgWANgdQANgcAZgSQAZgRAWADQAWADAGAXQAHAWgNAdQgNAcgZARQgVAOgTAAIgGAAgAi+gRQgYgQgNgZQgNgaAGgUQAHgUAWgEQAWgDAZAQQAZAPAMAaQANAagHAUQgGAVgWADIgHAAQgTAAgVgNgAgtg1QgQgVAAgfQAAggAQgWQAQgVAXgBQAWABAQAVQAQAWAAAgQAAAfgQAVQgQAXgWAAQgXAAgQgXg");
	this.shape_1.setTransform(-0.139,-5.95);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#E9F6FD").s().p("Am0EdQhlAAhHhLQg/hCgHhaIgBgaIAAg3QAAhrBHhKQBHhMBlAAINpAAQBlAABHBMQBHBKAABrIAAA3QAABqhHBMQhHBLhlAAgAh5AHQgpAXAAAhQAAAhApAYQAOAIAeAaQAdAXAYAAQAYAAAfgXIAwgiQApgYAAghQAAghgpgXQgpgXg7AAQg6AAgqAXgACbh9QgZASgNAcQgNAdAHAWQAHAXAVADQAWACAZgRQAZgRANgcQAMgdgGgWQgHgXgWgDIgHgBQgTAAgUAPgAjRiFQgXAEgGAUQgGAUAMAaQAOAZAYAQQAZAQAWgDQAWgDAGgVQAHgUgNgaQgMgagZgPQgVgNgSAAIgIAAgAgyikQgQAWAAAgQAAAfAQAVQAQAXAYAAQAVAAARgXQAQgVAAgfQAAgggQgWQgRgVgVgBQgYABgQAVg");
	this.shape_2.setTransform(0.3,-5.45);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#F1C2D4").s().p("AhICgQgegbgOgIQgqgYAAggQAAgiAqgXQApgXA7AAQA6AAApAXQAqAXAAAiQAAAggqAYIgvAjQghAWgXgBQgXABgdgWgACQACQgWgCgHgXQgHgWANgdQANgcAZgSQAZgRAWADQAWADAGAXQAHAWgNAdQgNAcgZASQgVANgTAAIgGAAgAi+gRQgYgQgNgZQgNgaAGgUQAHgUAWgEQAWgDAZAQQAZAPAMAaQANAagHAUQgGAVgWADIgHAAQgTAAgVgNgAgtg1QgQgVAAggQAAgeAQgXQAQgWAXAAQAWAAAQAWQAQAXAAAeQAAAggQAVQgQAXgWAAQgXAAgQgXg");
	this.shape_3.setTransform(0.861,-6.95);

	this.shape_4 = new cjs.Shape();
	this.shape_4.graphics.f("#E9F6FD").s().p("Am0EdQhlAAhHhLQg+hDgIhZIgBgaIAAg3QAAhrBHhKQBHhMBlAAINpAAQBlAABHBMQBHBKAABrIAAA3QAABqhHBMQhHBLhlAAgAh5AHQgpAXAAAiQAAAgApAYQAOAIAeAbQAdAWAYgBQAYABAfgWIAwgjQApgYAAggQAAgigpgXQgqgXg5AAQg7AAgqAXgACah9QgYASgNAcQgNAdAHAWQAGAXAWADQAWACAZgQQAZgSANgcQAMgdgGgWQgGgXgXgDIgHgBQgTAAgVAPgAjRiFQgXAEgGAUQgGAUAMAaQANAZAZAQQAZAQAWgDQAWgDAGgVQAHgUgNgaQgMgagZgPQgVgNgSAAIgIAAgAgyikQgPAXAAAeQAAAgAPAVQARAXAXAAQAVAAAQgXQAQgVABggQgBgegQgXQgQgWgVAAQgXAAgRAWg");
	this.shape_4.setTransform(1.3,-6.45);

	this.shape_5 = new cjs.Shape();
	this.shape_5.graphics.f("#F3C4DF").s().p("Am0EdQhlAAhHhLQg+hCgIhaIgBgaIAAg3QAAhrBHhKQBHhMBlAAINpAAQBlAABHBMQBHBKAABrIAAA3QAABqhHBMQhHBLhlAAgAh5AHQgpAXAAAhQAAAhApAYQAOAIAeAaQAdAXAYAAQAYAAAfgXIAwgiQApgYAAghQAAghgpgXQgqgXg5AAQg7AAgqAXgACah9QgYASgNAcQgNAdAHAWQAGAXAWADQAWACAZgRQAZgRANgcQAMgdgGgWQgGgXgXgDIgHgBQgTAAgVAPgAjRiFQgXAEgGAUQgGAUAMAaQANAZAZAQQAZAQAWgDQAWgDAGgVQAHgUgNgaQgMgagZgPQgVgNgSAAIgIAAgAgyikQgPAWAAAgQAAAfAPAVQARAXAXAAQAVAAAQgXQAQgVABgfQgBgggQgWQgQgVgVgBQgXABgRAVg");
	this.shape_5.setTransform(1.3,-5.45);

	this.shape_6 = new cjs.Shape();
	this.shape_6.graphics.f("#D3A4D2").s().p("AhICfQgegagOgIQgqgYAAghQAAghAqgXQApgXA7AAQA6AAApAXQAqAXAAAhQAAAhgqAYIgvAiQghAXgXAAQgXAAgdgXgACQACQgWgCgHgXQgHgWANgdQANgcAZgSQAZgRAWADQAWADAGAXQAHAWgNAdQgNAcgZARQgVAOgTAAIgGAAgAi+gRQgYgQgNgZQgNgaAGgUQAHgUAWgEQAWgDAZAQQAZAPAMAaQANAagHAUQgGAVgWADIgHAAQgTAAgVgNgAgtg1QgQgVAAgfQAAggAQgWQAQgVAXgBQAWABAQAVQAQAWAAAgQAAAfgQAVQgQAXgWAAQgXAAgQgXg");
	this.shape_6.setTransform(0.861,-5.95);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_2},{t:this.shape_1},{t:this.shape,p:{x:0.3,y:-5.45}}]}).to({state:[{t:this.shape_4},{t:this.shape_3},{t:this.shape,p:{x:1.3,y:-6.45}}]},1).to({state:[{t:this.shape_6},{t:this.shape_5},{t:this.shape,p:{x:1.3,y:-5.45}}]},1).wait(2));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-68.7,-35.9,139,60);


(lib.Symbol20 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#FDE9B1").s().p("AgYANIgagXIAkgFIAOggIAPAfIAjAFIgZAYIAGAjIgfgQIgeAQg");
	this.shape.setTransform(3.35,4.825,0.6634,1);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Symbol20, new cjs.Rectangle(0,0,6.7,9.7), null);


(lib.Symbol19 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#FDE9B1").s().p("AgYANIgagXIAkgFIAOggIAPAfIAjAFIgZAYIAGAjIgfgQIgeAQg");
	this.shape.setTransform(3.35,4.825,0.6634,1);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Symbol19, new cjs.Rectangle(0,0,6.7,9.7), null);


(lib.Symbol18 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#FDE9B1").s().p("AgYANIgagXIAkgFIAOggIAPAfIAjAFIgZAYIAGAjIgfgQIgeAQg");
	this.shape.setTransform(3.35,4.825,0.6634,1);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Symbol18, new cjs.Rectangle(0,0,6.7,9.7), null);


(lib.Symbol17 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#FDE9B1").s().p("AgYANIgagXIAkgFIAOggIAPAfIAjAFIgZAYIAGAjIgfgQIgeAQg");
	this.shape.setTransform(3.35,4.825,0.6634,1);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Symbol17, new cjs.Rectangle(0,0,6.7,9.7), null);


(lib.Symbol16 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#FDE9B1").s().p("AgYANIgagXIAkgFIAOggIAPAfIAjAFIgZAYIAGAjIgfgQIgeAQg");
	this.shape.setTransform(3.35,4.825,0.6634,1);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Symbol16, new cjs.Rectangle(0,0,6.7,9.7), null);


(lib.Symbol13 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#FDE9B1").s().p("AgYANIgagXIAkgFIAOggIAPAfIAjAFIgZAYIAGAjIgfgQIgeAQg");
	this.shape.setTransform(3.35,4.825,0.6634,1);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Symbol13, new cjs.Rectangle(0,0,6.7,9.7), null);


(lib.Symbol12 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#FDE9B1").s().p("AgYANIgagXIAkgFIAOggIAPAfIAjAFIgZAYIAGAjIgfgQIgeAQg");
	this.shape.setTransform(3.35,4.825,0.6634,1);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Symbol12, new cjs.Rectangle(0,0,6.7,9.7), null);


(lib.Symbol11 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#FDE9B1").s().p("AgYANIgagXIAkgFIAOggIAPAfIAjAFIgZAYIAGAjIgfgQIgeAQg");
	this.shape.setTransform(3.35,4.825,0.6634,1);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Symbol11, new cjs.Rectangle(0,0,6.7,9.7), null);


(lib.shadows12 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#C6C6C6").s().p("AkKAdQhugMAAgRQAAgHAegIQA1gNBzgIQBQgEBiAAQCdAABuAMQBvAMAAAQQAAARhvAMQhvAMicAAQibAAhvgMg");
	this.shape.setTransform(90.45,9.35);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#B0B0B0").s().p("AkKAdQhugMgBgRQABgQBugMQBvgMCbAAQCcAABvAMQBuAMAAAQQAAAJgdAHQhzAHg1ANQhaAFhaAAQibAAhvgMg");
	this.shape_1.setTransform(37.75,4.125);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,128.2,13.5);


(lib.shadow4 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#C6C6C6").s().p("Ah1DXQjEg0h5iEQgxg0gXg1QgWgyAIggQARhADAgSQDIgTDPA3QDJA1B/BoQByBegSBDQgIAfg8AdQg9AehaASQhjAUheAAQhzAAhugdg");
	this.shape.setTransform(52.2638,24.3725);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,104.6,48.8);


(lib.Symbol10 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#1D1D1B").p("ABMgrIg6AFIgYAXIgXAMQggASgPAQIgIAMICugOQgCgSgGgcg");
	this.shape.setTransform(8.5461,38.4007);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#8AB9E4").s().p("AhOAfQAOgPAhgSIAWgMIAYgYIA7gEIAFAZIAJAuIivAOg");
	this.shape_1.setTransform(8.775,38.375);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f().s("#1D1D1B").p("AARCaIAygEIgDgKQABhKgXg9IgXgtIAEhdIARg5IhGAIQAKAEAIAAQgOATgVAZIgTAWQAHAPAQBSQAFALAEAdQARAkAdBfIgqAcIAAAFIAXgMg");
	this.shape_2.setTransform(8.615,19.128);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#FACCB1").s().p("AgeC5IAqgcQgdhfgRgkQgEgdgEgLQgRhSgHgPIATgWQAVgZAOgTQgIAAgKgEIBGgIIgRA5IgDBdIAWAtQAXA9AABKIACAKIgyAEIgYAXIgXAMg");
	this.shape_3.setTransform(8.6,19.025);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_3},{t:this.shape_2},{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Symbol10, new cjs.Rectangle(-1,-1,19.6,44.7), null);


(lib.Symbol9 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#1D1D1B").p("AAYgkIgaAVQgwATgWASIgMAPICvAAQgBgTgEgcIgDgag");
	this.shape.setTransform(8.5183,43.775);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#8AB9E4").s().p("AhXAlIAMgPQAXgSAwgTIAagVIA6AAIAEAaIAEAvg");
	this.shape_1.setTransform(8.8,43.775);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f().s("#1D1D1B").p("AAmAqQgEgegFgLQgQhRgHgPIATgWQAVgZAOgTQgIAAgKgEQgJgDgFgDQgigUgbgIIgeBgQgBAVANAmIAjD1IA6AAQgBgIgBgBQAEhbgGg7g");
	this.shape_2.setTransform(12.6307,19.9944);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#FACCB1").s().p("AgNDJIgkj2QgNgmABgVIAehgQAbAIAiAUQAGADAIADQALAEAHAAQgNATgWAaIgTAVQAIAPAQBSQAFALADAdQAGA7gDBbIABAKg");
	this.shape_3.setTransform(12.3964,20.05);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_3},{t:this.shape_2},{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Symbol9, new cjs.Rectangle(-1.1,-1,20.700000000000003,49.5), null);


(lib.Symbol8 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#1D1D1B").p("AAbglQgOg6gPgTQgrAAgQABIBiDdIAbg4QgOgogXgxg");
	this.shape.setTransform(6.2258,11.5144);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#FACCB1").s().p("Ag+htQAQgCArAAQAPATAOA7QAXAwAOApIgbA4g");
	this.shape_1.setTransform(6.325,11.175);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Symbol8, new cjs.Rectangle(-1,-1,14.7,24.6), null);


(lib.Symbol7 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#1D1D1B").ss(1,0,1).p("ADqAnQAAgig8hBIg8g7QgPggg7gxIg3grQg+gfhPAMIhCATIgeAjQgEAcARBCQAIAiAJAcIAsgDQgbgFABgEQABgDAVgBQAYgCAkAAIAyABQAfA4AVACQAKABAEgLIgBAVIhlDLQAHAUAYAEQAMACALgCIAIABQAbAIAiAUQAPAJARABQAeACAjgUQASgKAMgKQAJgLA0AEQAbACAYAEQgBgXgKhTQgJhQAAgCg");
	this.shape.setTransform(25.3944,26.6277);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#F4A29D").s().p("AAvEKQgRgBgPgJQgigUgbgIIgIgBQgLACgMgCQgYgEgHgUIBljLIABgVQgEALgKgBQgVgCgfg4IgygBQgkAAgYACQgVABgBADQgBAEAbAFIgsADQgJgcgIgiQgRhCAEgcIAegjIBCgTQBPgMA+AfIA3ArQA7AxAPAgIA8A7QA8BBAAAiIAJBSQAKBTABAXQgYgEgbgCQg0gEgJALQgMAKgSAKQghASgcAAIgEAAg");
	this.shape_1.setTransform(25.3944,26.6277);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Symbol7, new cjs.Rectangle(-1,-1,52.8,55.3), null);


(lib.Symbol6 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#1D1D1B").ss(0.8,0,1).p("AiihFQAMACANARQgOAKgKASQATgLATgCQAAAbgBA1QAAARAEAKQAGAQANACIACg9QAQAQAIAXQAHAWgDAWQARgKAKgXQAHgOAHgdQAYAbAcASQgJgTAEgVQAKABAOAIQAIAEAQAJQAUAJAbADQARACAigBQgNgHgNgXQgOgagKgIQgRgJgHgFQgFgFgKgSQgagygygbQgOgHgKgCQgYgEgbAQQgSAMgWAXIgtgFIgCAA");
	this.shape.setTransform(16.525,11.26);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#693C11").s().p("AhLBEQgIgXgQgQIgCA9QgNgCgGgQQgEgKAAgRIABhQQgTACgTALQAKgSAOgKQgNgRgMgCIAtAFQAWgXASgMQAbgQAYAEQAKACAOAHQAyAbAaAyQAKASAFAFQAHAFARAJQAKAIAOAaQANAXANAHQgiABgRgCQgbgDgUgJIgYgNQgOgIgKgBQgEAVAJATQgcgSgYgbQgHAdgHAOQgKAXgRAKQADgWgHgWg");
	this.shape_1.setTransform(16.525,11.26);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Symbol6, new cjs.Rectangle(-1,-1,34.8,24.5), null);


(lib.Symbol5 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_24();
	this.instance.setTransform(-0.4,-0.4,0.4554,0.4554);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Symbol5, new cjs.Rectangle(-0.4,-0.4,354.79999999999995,215.5), null);


(lib.runningcat_static = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_20();
	this.instance.setTransform(-0.45,-0.5,0.2885,0.2885);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-0.4,-0.5,163.8,65.2);


(lib.restart = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_19();
	this.instance.setTransform(0,0,0.2101,0.2101);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,104,17.5);


(lib.lightpool = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#F5EACE").s().p("AmEB9Qigg0AAhJQAAhICgg0QChgzDjgBQDjABChAzQChA0AABIQAABJihA0QihAzjjAAQjjAAihgzg");
	this.shape.setTransform(54.9,17.65);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,109.8,35.3);


(lib.grass = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#79C089").s().p("A16CUIAAjxQBQgQBxgPQDigdCoAHQCoAHCvBLQBYAmA2AjQDuALEMAAQIZACCXgwQCYgwDQgPQBpgHBKADIAADxg");
	this.shape.setTransform(356.2355,38.818,2.5396,2.6161);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,712.5,77.7);


(lib.girlskirt3 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_18();
	this.instance.setTransform(-0.45,-0.45,0.1217,0.1217);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-0.4,-0.4,77.60000000000001,135.8);


(lib.garden_bg = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_17();
	this.instance.setTransform(0,-0.1,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,-0.1,776.5,269.5);


(lib.chair12 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_11();
	this.instance.setTransform(-0.25,-0.25,0.1571,0.1571);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-0.2,-0.2,56.7,75.7);


(lib.catrunning5 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// front_legs
	this.instance = new lib.CachedBmp_9();
	this.instance.setTransform(14.6,0.45,0.1866,0.1866);

	this.instance_1 = new lib.CachedBmp_10();
	this.instance_1.setTransform(-0.45,-0.5,0.1866,0.1866);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance_1}]},7).wait(4));

	// hind_legs
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#1D1D1B").p("Ag7haIAKASQALATAKADQgMA0gTAUQgPAAgPAFQgeAJACAWIACARQAKARAogEIAegBQAfgGAFgUIAVgYQAYgZAJAAIAcgYQAdgfAFgdQh1AGg7gYg");
	this.shape.setTransform(57.8229,54.8206,0.8152,0.9698);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#D7C1A8").s().p("AhyBMIgDgRQgCgWAegJQAPgFAQAAQATgUAMg0QgLgDgLgTIgJgSQA6AYB2gGQgFAdgdAfIgdAYQgJAAgXAZIgWAYQgEAUgfAGIgeABIgPABQgbAAgIgOg");
	this.shape_1.setTransform(57.7826,54.6913,0.8152,0.9698);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1,p:{scaleX:0.8152,scaleY:0.9698,rotation:0,x:57.7826,y:54.6913}},{t:this.shape,p:{scaleX:0.8152,scaleY:0.9698,rotation:0,x:57.8229,y:54.8206}}]}).to({state:[{t:this.shape_1,p:{scaleX:1.2317,scaleY:1.4339,rotation:14.9987,x:40.6215,y:41.9189}},{t:this.shape,p:{scaleX:1.2317,scaleY:1.4339,rotation:14.9987,x:40.6309,y:42.1194}}]},7).wait(4));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-0.4,-0.5,163.8,64.9);


(lib.catrightfoot = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#1D1D1B").p("Ag5hsIAQgLQATgMATgGQA7gSAdAvIgzCwIAKATQAGAYgQATQgHAFgMADQgWAHgXgEQgMgKgNgNQgagcgDgUg");
	this.shape.setTransform(8.5179,14.2518);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#D7C1A8").s().p("AgeCNQgMgKgNgNQgagcgDgUIAbiyIAQgLQATgMATgGQA7gSAdAvIgyCwIAJATQAHAYgQATQgIAFgMADQgNAFgNAAQgJAAgKgCg");
	this.shape_1.setTransform(8.5,14.2518);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.catrightfoot, new cjs.Rectangle(-1,-1.4,19,31.4), null);


(lib.catleftfoot = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#1D1D1B").p("AggDIQgHhEgKhHQgWiNgUgNQgegTgHgmQgIgrAtgOIAkgCQAnAFAQAgICBFmQgeALgkAHQhGAOgZgSg");
	this.shape.setTransform(13.0352,20.9929);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#D7C1A8").s().p("AgfDIQgHhEgLhHQgWiNgUgNQgegTgHgmQgIgrAtgOIAkgCQAnAFAQAgICCFmQgfALgjAHQggAGgWAAQgbAAgOgKg");
	this.shape_1.setTransform(12.9646,20.9936);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.catleftfoot, new cjs.Rectangle(-1,-1,28,44), null);


(lib.Tween10 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#1D1D1B").p("AEwgSQABABAaAdQAZAfAFAGQALAPAHAQIgSBEQgkAigQgcIgJgiIg1g1IALgGQACAAADABQAFABAFAAQAGAAgTgjQgTghAQgJQAPgIAPACQAPACACAAgAkChRIgeBEQgNAUghgEIgdgHQgbgaAXgKQALgGARAAQgMgjACgrIAEgkIAIAIQAZAMA2A7g");
	this.shape.setTransform(0.0466,-0.2685);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#D7C1A8").s().p("AE1CXIgJgiIg1g1IALgGIAFABIAKABQAGAAgTgjQgTghAQgJQAQgIAOACIARADQACAAAZAeIAeAkQALAPAHAQIgSBEQgUATgNAAQgMAAgHgNgAlOAAIgdgHQgbgaAXgKQALgGARAAQgMgjACgrIAEgkIAIAIQAZAMA2A7IgeBEQgLARgYAAIgLgBg");
	this.shape_1.setTransform(0.0336,0.0073);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-41.4,-17.4,80.3,34.8);


(lib.Tween9 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#1D1D1B").ss(0.8,1).p("AAhgcQgMgBgMAAQgiAAgLAKAAlgEQgIAFgJAGQgVAQgEAH");
	this.shape.setTransform(-43.275,-5.475);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f().s("#1D1D1B").p("AjAi3QA8AFAdAQIBxADQB6AJAvAeQAGgSANgaQAYg0AbguQBYiQBVgQIANApQAEAwgoAlQgEAQgLAUQgXApgjAVIgjBJQgkBPADAcIATBFQAHAkgBAfQAAACAAABAlIi/QAXgCAbAJIAjggIAAAgIAzABAjNB2QgUgCgOgFQgEAVgGAXQgBAEgBAFQgOA3gPAPQgKAOgQAJQgfASgVgZIAIgTQAKgTALgDIgqi3IAEgaQgLgGgKgJQgWgRgBgNQgMgEgGgJQgBgCgBgBQgFgJADgNQADgTATgZIgRgzIAVgGQAYgEAQANIAJgHQANgIARgBQADAZAUASQATARAbAAQAYAAATgOQATgPAFgXAADDnIh5gfIiCgpAEZCPIAAADAEbB6IADAJIgFAMIgCADIgHBzQgBBlhWAzQghAUgggRIAfgtIgYhKIgrgXIgEgCIgHgBIgDAAAAEDnIANAHIAFAHIAQAKIAjAQAAEDnIgBAAIgXgIAAPDrIgLgEABUESIgBAAIgKgD");
	this.shape_1.setTransform(3.4247,-0.0002);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#908378").s().p("AgtAZQgTgRgDgZQAWgBAbAIIAiggIAAAgIA0ACQgGAVgSAPQgTAPgYAAQgaAAgUgSg");
	this.shape_2.setTransform(-22.65,-17.475);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#D7C1A8").s().p("AB4GgIAfguIgYhKIgrgXIgEgCIADACIgKgCIAHAAIgHAAIgjgQIgQgLIgFgGIgCgDIgLgEIgBAAIgXgJIgJgCQg+gTgbgBIiCgpIgBgEIAKgsQAOAFAUACQgUgCgOgFIgKAsIgCAIQgOA4gPAPQgKANgQAJQgfATgVgZIAIgTQAKgTALgEIgqi2QAGAJACgBQAMgHgUgBIAEgaQgLgGgKgJQgWgSgBgNQgMgDgGgKIgCgCQgFgKACgMQAEgTATgaIgRgyIAVgHQAYgEAQANIAJgHQANgHARgCQADAaAUARQATASAbAAQAYAAATgPQATgPAFgWQA8AFAdAQIBxADQB6AIAvAeQAGgRANgaQAYg1AbgtQBYiRBVgPIANAoQAEAwgoAlQgEAQgLAVQgXAogjAVIgjBJQgkBPADAdIATBEQAHAkgBAgIAAADIAAAAIADAJIgFANIgCACIgHB0QgBBlhWAyQgSALgSAAQgPAAgOgHgABGEOIgggPIAjAQgAEXCRIACgCIAAACIgCAAg");
	this.shape_3.setTransform(3.4247,0.0353);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_3},{t:this.shape_2},{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-47.9,-43.3,95.9,86.69999999999999);


(lib.Tween8 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_8();
	this.instance.setTransform(-47.3,-44.15,0.1898,0.1898);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-47.3,-44.1,94.69999999999999,89.9);


(lib.catface1 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#1D1D1B").ss(0.6,1).p("AgZg/IAHAKQAHALABAHAgZgTQgkAMgDgBAgZgeQgtACgFgCAAmAJIAOAaQAPAaADADAAWAJIAJAbQALAaADACAAfgNIATABQAUABAGAH");
	this.shape.setTransform(7.575,15.5);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f().s("#1D1D1B").ss(0.6,1,1).p("AgXgOIAVAIQAUAJAGAM");
	this.shape_1.setTransform(14.6,1.45);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#1D1D1B").s().p("AgFgGIAMALIgMACQgCgHACgGg");
	this.shape_2.setTransform(7.0125,14.85);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_2},{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-1,-1,19,23.9);


(lib.cateyes = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// closed
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#1D1D1B").ss(0.6,1).p("AhhgaQAwAQAWASAAlAXQAkgOAZAS");
	this.shape.setTransform(11.35,3.025);
	this.shape._off = true;

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(10).to({_off:false},0).wait(10));

	// open
	this.instance = new lib.CachedBmp_7();
	this.instance.setTransform(-0.65,-0.45,0.1295,0.1295);

	this.timeline.addTween(cjs.Tween.get(this.instance).to({_off:true},10).wait(10));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-0.6,-0.7,22.700000000000003,8.299999999999999);


(lib.cat3 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_6();
	this.instance.setTransform(-0.45,-0.95,0.1898,0.1898);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-0.4,-0.9,85.80000000000001,98.80000000000001);


(lib.cat2 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_5();
	this.instance.setTransform(4.35,-19.05,0.1176,0.1176);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(4.4,-19,37.5,52.9);


(lib.sunrays = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.SUNRAY();
	this.instance.setTransform(81.1,51.9,1,1,0,0,0,81.1,51.9);
	this.instance.alpha = 0.4297;

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,162.2,103.8);


(lib.stars_ = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// eighth
	this.instance = new lib.Symbol20();
	this.instance.setTransform(137.25,-16.7,1,1,0,0,0,3.4,4.8);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1).to({regX:3.3,x:127,y:-8.9},0).wait(1).to({x:119.25,y:-2.5},0).wait(1).to({x:112.8,y:3.25},0).wait(1).to({x:107.15,y:8.5},0).wait(1).to({x:102.05,y:13.6},0).wait(1).to({x:97.4,y:18.5},0).wait(1).to({x:93.05,y:23.3},0).wait(1).to({x:89,y:28},0).wait(1).to({x:85.2,y:32.65},0).wait(1).to({x:81.55,y:37.25},0).wait(1).to({x:78.1,y:41.85},0).wait(1).to({x:74.8,y:46.5},0).wait(1).to({x:71.6,y:51.15},0).wait(1).to({x:68.55,y:55.85},0).wait(1).to({x:65.55,y:60.65},0).wait(1).to({x:62.7,y:65.5},0).wait(1).to({x:59.9,y:70.4},0).wait(1).to({x:57.15,y:75.5},0).wait(1).to({x:54.5,y:80.7},0).wait(1).to({x:51.9,y:86.1},0).wait(1).to({x:49.35,y:91.7},0).wait(1).to({x:46.8,y:97.55},0).wait(1).to({x:44.3,y:103.75},0).wait(1).to({x:41.85,y:110.3},0).wait(1).to({x:39.35,y:117.35},0).wait(1).to({x:36.9,y:125.1},0).wait(1).to({x:34.35,y:133.8},0).wait(1).to({x:31.7,y:144.05},0).wait(1).to({x:28.8,y:157.3},0).to({_off:true},1).wait(5));

	// seventh
	this.instance_1 = new lib.Symbol19();
	this.instance_1.setTransform(99.3,-37.55,1,1,0,0,0,3.4,4.8);

	this.timeline.addTween(cjs.Tween.get(this.instance_1).wait(1).to({regX:3.3,x:94.6,y:-32.9},0).wait(1).to({x:91.35,y:-29.45},0).wait(1).to({x:88.7,y:-26.55},0).wait(1).to({x:86.4,y:-24},0).wait(1).to({x:84.45,y:-21.7},0).wait(1).to({x:82.65,y:-19.6},0).wait(1).to({x:81,y:-17.6},0).wait(1).to({x:79.5,y:-15.7},0).wait(1).to({x:78.1,y:-13.9},0).wait(1).to({x:76.8,y:-12.2},0).wait(1).to({x:75.6,y:-10.55},0).wait(1).to({x:74.5,y:-8.95},0).wait(1).to({x:73.4,y:-7.4},0).wait(1).to({x:72.4,y:-5.9},0).wait(1).to({x:71.5,y:-4.4},0).wait(1).to({x:70.6,y:-2.95},0).wait(1).to({x:69.75,y:-1.5},0).wait(1).to({x:68.95,y:-0.1},0).wait(1).to({x:68.2,y:1.3},0).wait(1).to({x:67.5,y:2.65},0).wait(1).to({x:66.85,y:4.05},0).wait(1).to({x:66.2,y:5.35},0).wait(1).to({x:65.65,y:6.75},0).wait(1).to({x:65.1,y:8.1},0).wait(1).to({x:64.6,y:9.5},0).wait(1).to({x:64.15,y:10.9},0).wait(1).to({x:63.75,y:12.3},0).wait(1).to({x:63.4,y:13.75},0).wait(1).to({x:63.1,y:15.25},0).wait(1).to({x:62.9,y:16.8},0).wait(1).to({x:62.75,y:18.45},0).wait(1).to({x:62.7,y:20.25},0).wait(1).to({x:62.8,y:22.3},0).wait(1).to({x:63.25,y:24.9},0).wait(1));

	// sixth
	this.instance_2 = new lib.Symbol18();
	this.instance_2.setTransform(180.75,9.3,1,1,0,0,0,3.4,4.8);

	this.timeline.addTween(cjs.Tween.get(this.instance_2).wait(1).to({regX:3.3,x:179.55,y:10.05},0).wait(1).to({x:178.45,y:10.8},0).wait(1).to({x:177.35,y:11.55},0).wait(1).to({x:176.25,y:12.35},0).wait(1).to({x:175.15,y:13.1},0).wait(1).to({x:174.05,y:13.85},0).wait(1).to({x:172.95,y:14.65},0).wait(1).to({x:171.85,y:15.4},0).wait(1).to({x:170.75,y:16.15},0).wait(1).to({x:169.65,y:16.9},0).wait(1).to({x:168.55,y:17.7},0).wait(1).to({x:167.45,y:18.45},0).wait(1).to({x:166.35,y:19.2},0).wait(1).to({x:165.25,y:20},0).wait(1).to({x:164.15,y:20.75},0).wait(1).to({x:163.05,y:21.5},0).wait(1).to({x:162,y:22.3},0).wait(1).to({x:160.9,y:23.05},0).wait(1).to({x:159.8,y:23.8},0).wait(1).to({x:158.7,y:24.55},0).wait(1).to({x:157.6,y:25.35},0).wait(1).to({x:156.5,y:26.1},0).wait(1).to({x:155.4,y:26.85},0).wait(1).to({x:154.3,y:27.65},0).wait(1).to({x:153.2,y:28.4},0).wait(1).to({x:152.1,y:29.15},0).wait(1).to({x:151,y:29.9},0).wait(1).to({x:149.9,y:30.7},0).wait(1).to({x:148.8,y:31.45},0).wait(1).to({x:147.7,y:32.2},0).wait(1).to({x:146.6,y:33},0).wait(1).to({x:145.5,y:33.75},0).wait(1).to({x:144.4,y:34.5},0).wait(1).to({x:143.35,y:35.3},0).wait(1));

	// fifth
	this.instance_3 = new lib.Symbol17();
	this.instance_3.setTransform(153.3,-43.5,1,1,0,0,0,3.4,4.8);

	this.timeline.addTween(cjs.Tween.get(this.instance_3).wait(1).to({regX:3.3,x:151.25,y:-40.75},0).wait(1).to({x:149.35,y:-38.05},0).wait(1).to({x:147.45,y:-35.35},0).wait(1).to({x:145.55,y:-32.65},0).wait(1).to({x:143.65,y:-29.9},0).wait(1).to({x:141.75,y:-27.2},0).wait(1).to({x:139.85,y:-24.5},0).wait(1).to({x:137.95,y:-21.8},0).wait(1).to({x:136.05,y:-19.05},0).wait(1).to({x:134.15,y:-16.35},0).wait(1).to({x:132.25,y:-13.65},0).wait(1).to({x:130.3,y:-10.95},0).wait(1).to({x:128.4,y:-8.2},0).wait(1).to({x:126.5,y:-5.5},0).wait(1).to({x:124.6,y:-2.8},0).wait(1).to({x:122.7,y:-0.1},0).wait(1).to({x:120.8,y:2.6},0).wait(1).to({x:118.9,y:5.3},0).wait(1).to({x:117,y:8},0).wait(1).to({x:115.1,y:10.7},0).wait(1).to({x:113.2,y:13.4},0).wait(1).to({x:111.3,y:16.15},0).wait(1).to({x:109.35,y:18.85},0).wait(1).to({x:107.45,y:21.55},0).wait(1).to({x:105.55,y:24.25},0).wait(1).to({x:103.65,y:27},0).wait(1).to({x:101.75,y:29.7},0).wait(1).to({x:99.85,y:32.4},0).wait(1).to({x:97.95,y:35.1},0).wait(1).to({x:96.05,y:37.85},0).wait(1).to({x:94.15,y:40.55},0).wait(1).to({x:92.25,y:43.25},0).wait(1).to({x:90.35,y:45.95},0).wait(1).to({x:88.45,y:48.7},0).wait(1));

	// fourth
	this.instance_4 = new lib.Symbol16();
	this.instance_4.setTransform(60.3,-9.3,1,1,0,0,0,3.4,4.8);

	this.timeline.addTween(cjs.Tween.get(this.instance_4).wait(1).to({regX:3.3,x:57.45,y:-5.65},0).wait(1).to({x:55.4,y:-2.75},0).wait(1).to({x:53.7,y:-0.15},0).wait(1).to({x:52.2,y:2.15},0).wait(1).to({x:50.9,y:4.35},0).wait(1).to({x:49.7,y:6.4},0).wait(1).to({x:48.6,y:8.4},0).wait(1).to({x:47.6,y:10.35},0).wait(1).to({x:46.6,y:12.25},0).wait(1).to({x:45.7,y:14.15},0).wait(1).to({x:44.85,y:16},0).wait(1).to({x:44.05,y:17.8},0).wait(1).to({x:43.3,y:19.6},0).wait(1).to({x:42.55,y:21.4},0).wait(1).to({x:41.85,y:23.25},0).wait(1).to({x:41.15,y:25.05},0).wait(1).to({x:40.55,y:26.85},0).wait(1).to({x:39.9,y:28.7},0).wait(1).to({x:39.3,y:30.55},0).wait(1).to({x:38.75,y:32.45},0).wait(1).to({x:38.2,y:34.35},0).wait(1).to({x:37.65,y:36.3},0).wait(1).to({x:37.15,y:38.3},0).wait(1).to({x:36.65,y:40.35},0).wait(1).to({x:36.15,y:42.45},0).wait(1).to({x:35.7,y:44.65},0).wait(1).to({x:35.25,y:46.95},0).wait(1).to({x:34.85,y:49.35},0).wait(1).to({x:34.4,y:51.85},0).wait(1).to({x:34.05,y:54.6},0).wait(1).to({x:33.65,y:57.6},0).wait(1).to({x:33.3,y:60.95},0).wait(1).to({x:33,y:64.85},0).wait(1).to({x:32.75,y:69.9},0).wait(1));

	// third
	this.instance_5 = new lib.Symbol13();
	this.instance_5.setTransform(157.3,44.65,1,1,0,0,0,3.4,4.8);

	this.timeline.addTween(cjs.Tween.get(this.instance_5).wait(1).to({regX:3.3,x:156.7,y:49.4},0).wait(1).to({x:156.1,y:54.15},0).wait(1).to({x:155.45,y:58.75},0).wait(1).to({x:154.65,y:63.25},0).wait(1).to({x:153.8,y:67.65},0).wait(1).to({x:152.8,y:72},0).wait(1).to({x:151.75,y:76.2},0).wait(1).to({x:150.6,y:80.35},0).wait(1).to({x:149.35,y:84.4},0).wait(1).to({x:148,y:88.35},0).wait(1).to({x:146.55,y:92.2},0).wait(1).to({x:145,y:95.95},0).wait(1).to({x:143.4,y:99.65},0).wait(1).to({x:141.65,y:103.2},0).wait(1).to({x:139.8,y:106.7},0).wait(1).to({x:137.9,y:110.05},0).wait(1).to({x:135.85,y:113.35},0).wait(1).to({x:133.75,y:116.55},0).wait(1).to({x:131.55,y:119.65},0).wait(1).to({x:129.25,y:122.7},0).wait(1).to({x:126.85,y:125.6},0).wait(1).to({x:124.3,y:128.45},0).wait(1).to({x:121.75,y:131.15},0).wait(1).to({x:119.05,y:133.8},0).wait(1).to({x:116.25,y:136.35},0).wait(1).to({x:113.35,y:138.8},0).wait(1).to({x:110.35,y:141.15},0).wait(1).to({x:107.3,y:143.45},0).wait(1).to({x:104.1,y:145.6},0).wait(1).to({x:100.85,y:147.7},0).wait(1).to({x:97.45,y:149.65},0).wait(1).to({x:94,y:151.55},0).wait(1).to({x:90.45,y:153.35},0).wait(1).to({x:86.8,y:155.1},0).wait(1));

	// second
	this.instance_6 = new lib.Symbol12();
	this.instance_6.setTransform(117.4,-21.15,1,1,0,0,0,3.4,4.8);

	this.timeline.addTween(cjs.Tween.get(this.instance_6).wait(1).to({regX:3.3,x:117.55,y:-16.65},0).wait(1).to({x:117.75,y:-12.2},0).wait(1).to({x:117.85,y:-7.75},0).wait(1).to({x:117.95,y:-3.3},0).wait(1).to({y:1.1},0).wait(1).to({x:117.85,y:5.45},0).wait(1).to({x:117.75,y:9.85},0).wait(1).to({x:117.55,y:14.2},0).wait(1).to({x:117.3,y:18.55},0).wait(1).to({x:117,y:22.85},0).wait(1).to({x:116.6,y:27.15},0).wait(1).to({x:116.15,y:31.45},0).wait(1).to({x:115.65,y:35.75},0).wait(1).to({x:115.1,y:40},0).wait(1).to({x:114.45,y:44.25},0).wait(1).to({x:113.75,y:48.45},0).wait(1).to({x:113,y:52.65},0).wait(1).to({x:112.2,y:56.85},0).wait(1).to({x:111.3,y:61},0).wait(1).to({x:110.35,y:65.2},0).wait(1).to({x:109.35,y:69.3},0).wait(1).to({x:108.25,y:73.45},0).wait(1).to({x:107.1,y:77.55},0).wait(1).to({x:105.9,y:81.65},0).wait(1).to({x:104.65,y:85.7},0).wait(1).to({x:103.3,y:89.75},0).wait(1).to({x:101.9,y:93.8},0).wait(1).to({x:100.45,y:97.8},0).wait(1).to({x:98.9,y:101.85},0).wait(1).to({x:97.3,y:105.8},0).wait(1).to({x:95.65,y:109.8},0).wait(1).to({x:93.95,y:113.75},0).wait(1).to({x:92.15,y:117.7},0).wait(1).to({x:90.35,y:121.65},0).wait(1));

	// firstStar
	this.instance_7 = new lib.Symbol11();
	this.instance_7.setTransform(157.3,-9.25,1,1,0,0,0,3.4,4.8);

	this.timeline.addTween(cjs.Tween.get(this.instance_7).wait(1).to({regX:3.3,x:148.5,y:-5.7},0).wait(1).to({x:140.1,y:-2.15},0).wait(1).to({x:131.9,y:1.45},0).wait(1).to({x:123.95,y:5},0).wait(1).to({x:116.2,y:8.7},0).wait(1).to({x:108.75,y:12.45},0).wait(1).to({x:101.5,y:16.25},0).wait(1).to({x:94.5,y:20.1},0).wait(1).to({x:87.7,y:24},0).wait(1).to({x:81.2,y:27.95},0).wait(1).to({x:74.85,y:31.95},0).wait(1).to({x:68.8,y:36},0).wait(1).to({x:63,y:40.1},0).wait(1).to({x:57.4,y:44.25},0).wait(1).to({x:52.05,y:48.45},0).wait(1).to({x:46.9,y:52.7},0).wait(1).to({x:42,y:56.95},0).wait(1).to({x:37.35,y:61.3},0).wait(1).to({x:32.95,y:65.7},0).wait(1).to({x:28.75,y:70.15},0).wait(1).to({x:24.8,y:74.65},0).wait(1).to({x:21.1,y:79.2},0).wait(1).to({x:17.6,y:83.8},0).wait(1).to({x:14.4,y:88.4},0).wait(1).to({x:11.35,y:93.1},0).wait(1).to({x:8.6,y:97.85},0).wait(1).to({x:6.05,y:102.65},0).wait(1).to({x:3.75,y:107.5},0).wait(1).to({x:1.75,y:112.4},0).wait(1).to({x:-0.1,y:117.35},0).wait(1).to({x:-1.7,y:122.35},0).wait(1).to({x:-3.05,y:127.4},0).wait(1).to({x:-4.2,y:132.5},0).wait(1).to({x:-5.1,y:137.65},0).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-8.4,-48.3,192.5,210.5);


(lib.scene5 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// catrunning
	this.instance = new lib.catrunning5("synched",0);
	this.instance.setTransform(817.45,354.25,2.4548,2.6796,0,0,0,81.9,32.9);

	this.timeline.addTween(cjs.Tween.get(this.instance).to({x:-143.45,startPosition:6},39).wait(1));

	// background
	this.instance_1 = new lib.wall12("synched",0);
	this.instance_1.setTransform(323.8,391.5,8.2184,6.7381,0,0,0,39.4,58.1);

	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#1D1D1B").ss(1,1,1).p("EgyJgGtMBkTAAAIAANbMhkTAAAg");
	this.shape.setTransform(324.125,435.75);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#D7C1A8").s().p("EgyJAGuIAAtbMBkTAAAIAANbg");
	this.shape_1.setTransform(324.125,435.75);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape},{t:this.instance_1}]}).wait(40));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-308.6,-3,1291,482.8);


(lib.girl12 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// head
	this.instance = new lib.Symbol6();
	this.instance.setTransform(19.6,51.5,1,1,0,0,0,19.6,51.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1).to({regX:16.5,regY:11.3,scaleY:1.0032,x:16.5,y:11.05},0).wait(1).to({scaleY:1.0064,y:10.7},0).wait(1).to({scaleY:1.0096,y:10.4},0).wait(1).to({scaleY:1.0128,y:10.15},0).wait(1).to({scaleY:1.016,y:9.85},0).wait(1).to({scaleY:1.0192,y:9.5},0).wait(1).to({scaleY:1.0224,y:9.2},0).wait(1).to({scaleY:1.0256,y:8.95},0).wait(1).to({scaleY:1.0288,y:8.65},0).wait(1).to({scaleX:0.9971,scaleY:1.0386,skewY:-1.1717,x:15.1,y:8.05},0).wait(1).to({scaleX:0.9941,scaleY:1.0483,skewY:-2.3435,x:13.75,y:7.55},0).wait(1).to({scaleX:0.9911,scaleY:1.0581,skewY:-3.5152,x:12.3,y:6.95},0).wait(1).to({scaleX:0.9882,scaleY:1.0679,skewY:-4.6869,x:10.9,y:6.35},0).wait(1));

	// body
	this.instance_1 = new lib.Symbol7();
	this.instance_1.setTransform(34.1,43.7,1,1,0,0,0,25.4,26.6);

	this.timeline.addTween(cjs.Tween.get(this.instance_1).wait(1).to({scaleY:1.0032,y:43.5},0).wait(1).to({scaleY:1.0064,y:43.25},0).wait(1).to({scaleY:1.0096,y:43.05},0).wait(1).to({scaleY:1.0128,y:42.85},0).wait(1).to({scaleY:1.016,y:42.6},0).wait(1).to({scaleY:1.0192,y:42.45},0).wait(1).to({scaleY:1.0224,y:42.25},0).wait(1).to({scaleY:1.0256,y:42.05},0).wait(1).to({scaleY:1.0288,y:41.8},0).wait(1).to({scaleX:0.9971,scaleY:1.0386,skewY:-1.1717,x:32.85,y:41.25},0).wait(1).to({scaleX:0.9941,scaleY:1.0483,skewY:-2.3435,x:31.7,y:40.6},0).wait(1).to({scaleX:0.9911,scaleY:1.0581,skewY:-3.5152,x:30.55,y:40},0).wait(1).to({scaleX:0.9882,scaleY:1.0679,skewY:-4.6869,x:29.3,y:39.35},0).wait(1));

	// arm
	this.instance_2 = new lib.Symbol8();
	this.instance_2.setTransform(21.9,48.2,1,1,0,0,0,6.2,11.5);

	this.timeline.addTween(cjs.Tween.get(this.instance_2).wait(1).to({scaleY:1.0032,y:48},0).wait(1).to({scaleY:1.0064,y:47.8},0).wait(1).to({scaleY:1.0096,y:47.6},0).wait(1).to({scaleY:1.0128,y:47.45},0).wait(1).to({scaleY:1.016,y:47.25},0).wait(1).to({scaleY:1.0192,y:47.05},0).wait(1).to({scaleY:1.0224,y:46.9},0).wait(1).to({scaleY:1.0256,y:46.7},0).wait(1).to({scaleY:1.0288,y:46.55},0).wait(1).to({scaleX:0.9971,scaleY:1.0386,skewY:-1.1717,x:20.7,y:46.15},0).wait(1).to({scaleX:0.9941,scaleY:1.0483,skewY:-2.3435,x:19.5,y:45.8},0).wait(1).to({scaleX:0.9911,scaleY:1.0581,skewY:-3.5152,x:18.35,y:45.45},0).wait(1).to({scaleX:0.9882,scaleY:1.0679,skewY:-4.6869,x:17.1,y:45.15},0).wait(1));

	// leftleg
	this.instance_3 = new lib.Symbol9();
	this.instance_3.setTransform(26.9,86.15,1,1,0,0,0,9.2,23.7);

	this.timeline.addTween(cjs.Tween.get(this.instance_3).wait(1).to({scaleY:1.0032,y:86.1},0).wait(1).to({scaleY:1.0064,y:86},0).wait(1).to({scaleY:1.0096,y:85.95},0).wait(1).to({scaleY:1.0128,y:85.85},0).wait(1).to({scaleY:1.016,y:85.8},0).wait(1).to({scaleY:1.0192,y:85.7},0).wait(1).to({scaleY:1.0224},0).wait(1).to({scaleY:1.0256,y:85.6},0).wait(1).to({scaleY:1.0288,y:85.55},0).wait(1).to({scaleX:0.9971,scaleY:1.0386,skewY:-1.1717,x:25.65,y:85.45},0).wait(1).to({scaleX:0.9941,scaleY:1.0483,skewY:-2.3435,x:24.5},0).wait(1).to({scaleX:0.9911,scaleY:1.0581,skewY:-3.5152,x:23.3,y:85.35},0).wait(1).to({scaleX:0.9882,scaleY:1.0679,skewY:-4.6869,x:22.1,y:85.25},0).wait(1));

	// rightleg
	this.instance_4 = new lib.Symbol10();
	this.instance_4.setTransform(37.5,86.4,1,1,0,0,0,8.5,21.4);

	this.timeline.addTween(cjs.Tween.get(this.instance_4).wait(1).to({regY:21.3,scaleY:1.0032,y:86.2},0).wait(1).to({scaleY:1.0064,y:86.15},0).wait(1).to({scaleY:1.0096,y:86.05},0).wait(1).to({scaleY:1.0128,y:86},0).wait(1).to({scaleY:1.016,y:85.95},0).wait(1).to({scaleY:1.0192,y:85.85},0).wait(1).to({scaleY:1.0224},0).wait(1).to({scaleY:1.0256,y:85.75},0).wait(1).to({scaleY:1.0288,y:85.65},0).wait(1).to({scaleX:0.9971,scaleY:1.0386,skewY:-1.1717,x:36.25,y:85.5},0).wait(1).to({scaleX:0.9941,scaleY:1.0483,skewY:-2.3435,x:35.1,y:85.3},0).wait(1).to({scaleX:0.9911,scaleY:1.0581,skewY:-3.5152,x:33.9,y:85.1},0).wait(1).to({scaleX:0.9882,scaleY:1.0679,skewY:-4.6869,x:32.7,y:84.85},0).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-6.2,-6.3,66.7,118.8);


(lib.cloud3 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.Symbol1();
	this.instance.setTransform(108.2,-4.6,1,1,0,0,0,94.2,41.4);

	this.timeline.addTween(cjs.Tween.get(this.instance).to({x:-8.85,y:66.4},59).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-103,-46,289.3,153.8);


(lib.cloud2 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// movement
	this.instance = new lib.Tween4("synched",0);
	this.instance.setTransform(-321.2,45.45);

	this.timeline.addTween(cjs.Tween.get(this.instance).to({x:144.95,y:50.45},45).to({x:-153.1,y:137.45},54).wait(16));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-382.1,16,588.2,151);


(lib.cloud1 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// movement
	this.instance = new lib.Tween3();
	this.instance.setTransform(68.2,31.65);

	this.timeline.addTween(cjs.Tween.get(this.instance).to({x:56.2,y:35.65,mode:"synched",startPosition:0},59).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-12,0.1,148.5,67.5);


(lib.catwalkingaway4 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// legsinfront
	this.instance = new lib.Tween8("synched",0);
	this.instance.setTransform(46.95,43.6);

	this.instance_1 = new lib.Tween9("synched",0);
	this.instance_1.setTransform(46.95,42.3);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance_1}]},7).wait(4));
	this.timeline.addTween(cjs.Tween.get(this.instance).to({_off:true,y:42.3},7).wait(4));

	// legsbehind
	this.instance_2 = new lib.Tween10("synched",0);
	this.instance_2.setTransform(47.8,60.75);
	this.instance_2._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_2).wait(7).to({_off:false},0).wait(4));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-1,-1.6,95.9,91);


(lib.catlying1 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// breathing
	this.instance = new lib.Symbol5();
	this.instance.setTransform(27,16.2,1,1.0978,0,0,0,176.8,106.7);
	this.instance._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(11).to({_off:false},0).wait(1).to({regX:177,regY:107.3,scaleY:1.1067,x:27.2,y:16.9},0).wait(1).to({scaleY:1.1156},0).wait(1).to({scaleY:1.1055,y:16.85},0).wait(1).to({scaleY:1.0953,y:16.9},0).wait(1).to({scaleY:1.0852,y:16.85},0).wait(1).to({scaleY:1.075},0).wait(1).to({scaleY:1.0649},0).wait(1).to({scaleY:1.0548,y:16.8},0).wait(1).to({scaleY:1.0446,y:16.85},0).wait(1).to({scaleY:1.0345},0).wait(1).to({scaleY:1.0243,y:16.8},0).wait(1).to({scaleY:1.0142},0).wait(1).to({scaleY:1.004,y:16.85},0).to({_off:true},1).wait(5));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-150.2,-103.2,354.79999999999995,240.3);


(lib.catasleepmotion = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.Tween17("synched",0);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-74.6,-52.3,149.3,104.69999999999999);


(lib.catalmostjump = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// tailup
	this.instance = new lib.Tween11("synched",0);
	this.instance.setTransform(49.55,40.7);

	this.instance_1 = new lib.Tween12("synched",0);
	this.instance_1.setTransform(50.35,41.4);
	this.instance_1._off = true;

	this.instance_2 = new lib.Tween13("synched",0);
	this.instance_2.setTransform(49.6,40.75);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance_1}]},7).to({state:[{t:this.instance_2}]},7).wait(1));
	this.timeline.addTween(cjs.Tween.get(this.instance).to({_off:true,x:50.35,y:41.4},7).wait(8));
	this.timeline.addTween(cjs.Tween.get(this.instance_1).to({_off:false},7).to({_off:true,x:49.6,y:40.75},7).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-1.3,-0.5,102.5,83.1);


(lib.bird = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.Tween5("synched",0);
	this.instance.setTransform(25.5,8.95);

	this.instance_1 = new lib.Tween6("synched",0);
	this.instance_1.setTransform(25.55,8.9);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance_1}]},10).wait(10));
	this.timeline.addTween(cjs.Tween.get(this.instance).to({_off:true,x:25.55,y:8.9},10).wait(10));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-6.8,-9.5,64.8,36.9);


(lib.amazedSCENE = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// cat
	this.instance = new lib.cateyes("synched",0);
	this.instance.setTransform(33.1,25.8,1,1,0,0,0,10.6,3.5);

	this.instance_1 = new lib.CachedBmp_2();
	this.instance_1.setTransform(0,0.05,0.1295,0.1295);

	this.instance_2 = new lib.CachedBmp_1();
	this.instance_2.setTransform(-55.85,80.2,0.1295,0.1295);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_2},{t:this.instance_1},{t:this.instance}]}).wait(25));

	// background
	this.instance_3 = new lib.CachedBmp_3();
	this.instance_3.setTransform(-53.75,31.9,0.1295,0.1295);

	this.instance_4 = new lib.grass("synched",0);
	this.instance_4.setTransform(51.15,60.9,0.3195,0.5348,0,0,0,356.2,38.9);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_4},{t:this.instance_3}]}).wait(25));

	// sky
	this.instance_5 = new lib.CachedBmp_4();
	this.instance_5.setTransform(-92.25,-72.15,0.1295,0.1295);

	this.timeline.addTween(cjs.Tween.get(this.instance_5).wait(25));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-92.2,-72.1,280.6,207.1);


(lib.Tween22 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.bird();
	this.instance.setTransform(23.25,16.65,0.8255,0.7486,0,0,180,25.5,9);

	this.instance_1 = new lib.bird();
	this.instance_1.setTransform(-12.4,-14.35,1.2529,1,0,0,180,25.6,9);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_1},{t:this.instance}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-44.9,-23.8,89.6,47.400000000000006);


(lib.Tween21 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.bird();
	this.instance.setTransform(-19.15,16.65,0.8255,0.7486,0,0,180,25.5,9);

	this.instance_1 = new lib.bird();
	this.instance_1.setTransform(8.2,-14.35,1.2529,1,0,0,180,25.6,9);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_1},{t:this.instance}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-40.6,-23.8,81.5,47.400000000000006);


(lib.Tween19 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.bird();
	this.instance.setTransform(9.05,39.3,0.8255,0.7486,0,0,180,25.5,9);

	this.instance_1 = new lib.bird();
	this.instance_1.setTransform(-0.1,-37,1.2529,1,0,0,180,25.6,9);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_1},{t:this.instance}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-32.6,-46.5,65.2,92.8);


(lib.Symbol3 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.bird();
	this.instance.setTransform(145.2,97.3,1,1,0,0,0,25.5,9);

	this.instance_1 = new lib.bird();
	this.instance_1.setTransform(21.05,26.3,0.8222,0.8337,0,0,0,25.6,8.9);

	this.instance_2 = new lib.bird();
	this.instance_2.setTransform(125.35,9,1,1,0,0,0,25.5,9);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_2},{t:this.instance_1},{t:this.instance}]}).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Symbol3, new cjs.Rectangle(-0.4,-0.5,171.70000000000002,107.2), null);


(lib.sunnywallSCENE = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// stars
	this.instance = new lib.stars_("synched",0);
	this.instance.setTransform(127.15,-67.1,1,1,0,0,0,87.8,56.9);
	this.instance._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(47).to({_off:false},0).to({startPosition:26},26).to({_off:true},1).wait(16));

	// sunpool
	this.instance_1 = new lib.lightpool("synched",0);
	this.instance_1.setTransform(75.3,20.9,0.1248,0.221,0,0,0,54.9,17.7);
	this.instance_1._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_1).wait(35).to({_off:false},0).to({regX:55.4,scaleX:1.1549,scaleY:1.1079,x:75.85},12).to({startPosition:0},26).to({_off:true},1).wait(16));

	// sunray
	this.instance_2 = new lib.sunrays("synched",0);
	this.instance_2.setTransform(244.95,-279.35,1.1559,1.5376,0,0,0,119.5,-0.5);
	this.instance_2._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_2).wait(14).to({_off:false},0).to({regY:-0.6,scaleX:2.0257,scaleY:3.2658,x:209,y:-279.55},27).to({startPosition:0},32).to({_off:true},1).wait(16));

	// wall
	this.instance_3 = new lib.CachedBmp_27();
	this.instance_3.setTransform(-0.45,-1.05,0.1412,0.1412);

	this.timeline.addTween(cjs.Tween.get(this.instance_3).wait(73).to({_off:true},1).wait(16));

	// background
	this.instance_4 = new lib.CachedBmp_28();
	this.instance_4.setTransform(-104.55,-174.65,0.1412,0.1412);

	this.timeline.addTween(cjs.Tween.get(this.instance_4).wait(73).to({_off:true},1).wait(16));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-104.5,-278.6,400,371.6);


(lib.sky_bg = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// clouds
	this.instance = new lib.cloud2();
	this.instance.setTransform(613.35,488.45,1,1,0,0,0,60.9,29.4);

	this.instance_1 = new lib.cloud1();
	this.instance_1.setTransform(555.4,425.8,1,1,0,0,0,68.2,31.7);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_1},{t:this.instance}]}).to({state:[]},1).wait(73));

	// button
	this.instance_2 = new lib.CachedBmp_25();
	this.instance_2.setTransform(669.05,657.1,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance_2).to({_off:true},1).wait(73));

	// sky_bg
	this.instance_3 = new lib.garden_bg("synched",0);
	this.instance_3.setTransform(730.85,716.05,1,1,0,0,0,388.2,134.8);

	this.instance_4 = new lib.CachedBmp_39();
	this.instance_4.setTransform(339.3,369.1,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_4},{t:this.instance_3}]}).to({state:[]},1).wait(73));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,1119.2,908.1);


(lib.scene3 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// girl
	this.instance = new lib.girlskirt3("synched",0);
	this.instance.setTransform(499.55,278.2,3.6378,4.1093,0,0,0,38.4,67.7);

	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#1D1D1B").ss(1,1,1).p("Egx+gldIgCgEMBj3AAEEAx7AePIAGG/It6AU");
	this.shape.setTransform(320.1,314);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape},{t:this.instance}]}).wait(36));

	// cat3
	this.instance_1 = new lib.cat3("synched",0);
	this.instance_1.setTransform(293.25,363.85,2.5131,2.6346,0,0,0,42.6,48.8);

	this.instance_2 = new lib.catwalkingaway4("synched",0);
	this.instance_2.setTransform(261.25,363.9,2.513,2.6346,9.6999,0,0,42.6,48.8);
	this.instance_2._off = true;

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_1}]}).to({state:[{t:this.instance_2}]},12).to({state:[{t:this.instance_2}]},23).wait(1));
	this.timeline.addTween(cjs.Tween.get(this.instance_2).wait(12).to({_off:false},0).to({x:-46.75,y:86.45,startPosition:1},23).wait(1));

	// cat_shadow
	this.instance_3 = new lib.shadow4("synched",0);
	this.instance_3.setTransform(282.9,469.5,2.0909,3.5031,0,0,0,52.2,24.4);

	this.timeline.addTween(cjs.Tween.get(this.instance_3).wait(12).to({regX:52.4,regY:24.5,scaleX:2.4149,scaleY:2.9262,x:265.4,y:440.45},0).to({x:-55.55,y:160.5},23).wait(1));

	// background
	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#79C089").s().p("EAiGAkjMgsjgmrI5A2KIu1stIAABBIgygrQgrglgugnMBmOAAEICtDKIgKGoMgCfA6eIgEHDIuJAUg");
	this.shape_1.setTransform(283,312.05);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#CBBCAF").s().p("EgrAAlWMAAAhJ0IAAhBIO0MuIZBWKMAsjAmqIBpBdg");
	this.shape_2.setTransform(236.425,315.225);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_2},{t:this.shape_1}]}).wait(36));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-182.1,-60.4,823.3000000000001,616.6);


(lib.SCENE1 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// CAT2JUMP
	this.instance = new lib.cat2("synched",0);
	this.instance.setTransform(391.15,237.3,2.027,2.75,0,0,0,23.2,7.5);
	this.instance._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(14).to({_off:false},0).to({scaleX:2.2123,scaleY:2.9013,x:370.1,y:291.3},7).to({regY:7.6,scaleX:2.864,scaleY:3.4298,x:356.2,y:318.65},6).to({regX:23.3,scaleX:3.5107,scaleY:3.8455,x:339.3,y:346.9},9).to({scaleX:4.0431,scaleY:4.252,x:246.85,y:453.9},26).to({_off:true},1).wait(8));

	// chair
	this.instance_1 = new lib.catface1("synched",0);
	this.instance_1.setTransform(386.3,204.25,2.4117,2.2018,0,0,0,8.6,11);

	this.instance_2 = new lib.chair12("synched",0);
	this.instance_2.setTransform(436.15,215.1,2.8861,3.1824,0,0,0,28.1,37.8);

	this.instance_3 = new lib.catlying1("synched",11);
	this.instance_3.setTransform(446,204,0.4063,0.4031,0,0,0,27.3,16.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_3},{t:this.instance_2},{t:this.instance_1}]}).to({state:[{t:this.instance_2}]},14).to({state:[{t:this.instance_2}]},48).to({state:[]},1).wait(8));

	// girl
	this.instance_4 = new lib.girl12("synched",0,false);
	this.instance_4.setTransform(324.3,162.05,2.3131,2.8909,0,0,0,29.9,55);

	this.timeline.addTween(cjs.Tween.get(this.instance_4).wait(62).to({startPosition:13},0).to({_off:true},1).wait(8));

	// background
	this.instance_5 = new lib.CachedBmp_22();
	this.instance_5.setTransform(17.95,105.25,0.5,0.5);

	this.instance_6 = new lib.table_cup12("synched",0);
	this.instance_6.setTransform(280.3,208.1,2.7975,2.5992,0,0,0,27.8,29.4);

	this.instance_7 = new lib.shadows12("synched",0);
	this.instance_7.setTransform(339.25,311.35,2.4177,5.6772,0,0,0,64.2,7.2);

	this.instance_8 = new lib.CachedBmp_21();
	this.instance_8.setTransform(15.55,187.45,0.5,0.5);

	this.instance_9 = new lib.wall12("synched",0);
	this.instance_9.setTransform(470.5,116.3,4.7215,2.4458,0,0,0,39.6,29.2);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_9},{t:this.instance_8},{t:this.instance_7},{t:this.instance_6},{t:this.instance_5}]}).to({state:[{t:this.instance_9},{t:this.instance_8},{t:this.instance_7},{t:this.instance_6},{t:this.instance_5}]},62).to({state:[]},1).wait(8));

	// sky
	this.instance_10 = new lib.CachedBmp_23();
	this.instance_10.setTransform(1.85,-200.8,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance_10).wait(62).to({_off:true},1).wait(8));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,-200.8,659.6,766.4000000000001);


(lib.floorStreet = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// walltouch
	this.instance = new lib.runningcat_static("synched",0);
	this.instance.setTransform(253.95,-72.15,1.434,1.7332,44.9979,0,0,81.9,32);
	this.instance._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(35).to({_off:false},0).wait(10));

	// prejump
	this.instance_1 = new lib.catalmostjump("synched",0);
	this.instance_1.setTransform(358.6,-39.05,1.7014,1.812,0,0,0,51.5,40.7);
	this.instance_1._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_1).wait(19).to({_off:false},0).to({_off:true},16).wait(10));

	// catcomingIn
	this.instance_2 = new lib.catrunning5("synched",0);
	this.instance_2.setTransform(762.75,-24.4,1.9285,1.6552,0,0,0,81.9,31.7);

	this.timeline.addTween(cjs.Tween.get(this.instance_2).to({scaleX:1.6472,x:382.25,startPosition:7},18).to({_off:true},1).wait(26));

	// background
	this.instance_3 = new lib.wallfacingus("synched",0);
	this.instance_3.setTransform(79.45,-147.45,2.5895,2.6672,0,0,0,29.7,67.8);

	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#1D1D1B").ss(1,1,1).p("EgyOgHCMBkdAAAIAAOFMhkdAAAg");
	this.shape.setTransform(321.475,45.075);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#999999").s().p("EgyOAHDIAAuFMBkdAAAIAAOFg");
	this.shape_1.setTransform(321.475,45.075);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape},{t:this.instance_3}]}).wait(45));

	// background_nature
	this.instance_4 = new lib.CachedBmp_16();
	this.instance_4.setTransform(35.35,-68.1,0.5,0.5);

	this.instance_5 = new lib.grass("synched",0);
	this.instance_5.setTransform(294.05,-38.8,1,1,0,0,0,356.2,38.8);

	this.instance_6 = new lib.CachedBmp_15();
	this.instance_6.setTransform(-73.1,-390.85,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_6},{t:this.instance_5},{t:this.instance_4}]}).wait(45));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-73.1,-390.8,965.5,482);


(lib.finale = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// catasleep
	this.instance = new lib.catasleepmotion("synched",0);
	this.instance.setTransform(-50.85,93.5,1.948,1.6682,0,0,0,0,0.1);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1).to({regY:0,scaleY:1.6731,y:93.3495},0).wait(1).to({scaleY:1.6781,y:93.349},0).wait(1).to({scaleY:1.6831,y:93.3485},0).wait(1).to({scaleY:1.688,y:93.348},0).wait(1).to({scaleY:1.693,y:93.3475},0).wait(1).to({scaleY:1.6979,y:93.347},0).wait(1).to({scaleY:1.7029,y:93.3465},0).wait(1).to({scaleY:1.7079,y:93.346},0).wait(1).to({scaleY:1.7128,y:93.3455},0).wait(1).to({scaleY:1.7178,y:93.345},0).wait(1).to({scaleY:1.7227,y:93.3445},0).wait(1).to({scaleY:1.7277,y:93.344},0).wait(1).to({scaleY:1.7327,y:93.3436},0).wait(1).to({scaleY:1.7376,y:93.3431},0).wait(1).to({scaleY:1.7426,y:93.3426},0).wait(1).to({scaleY:1.7476,y:93.3421},0).wait(1).to({scaleY:1.7525,y:93.3416},0).wait(1).to({scaleY:1.7575,y:93.3411},0).wait(1).to({scaleY:1.7624,y:93.3406},0).wait(1).to({scaleY:1.7674,y:93.3401},0).wait(1).to({scaleY:1.7724,y:93.3396},0).wait(1).to({scaleY:1.7773,y:93.3391},0).wait(1).to({scaleY:1.7823,y:93.3386},0).wait(1).to({scaleY:1.7872,y:93.3381},0).wait(1).to({scaleY:1.7922,y:93.3376},0).wait(1).to({scaleY:1.7972,y:93.3371},0).wait(1).to({scaleY:1.8021,y:93.3366},0).wait(1).to({scaleY:1.8071,y:93.3361},0).wait(1).to({scaleY:1.812,y:93.3356},0).wait(1).to({scaleY:1.817,y:93.3351},0).wait(1).to({scaleY:1.822,y:93.3346},0).wait(1).to({scaleY:1.8269,y:93.3341},0).wait(1).to({scaleY:1.8199,y:93.3348},0).wait(1).to({scaleY:1.8129,y:93.3355},0).wait(1).to({scaleY:1.8058,y:93.3362},0).wait(1).to({scaleY:1.7988,y:93.3369},0).wait(1).to({scaleY:1.7918,y:93.3376},0).wait(1).to({scaleY:1.7848,y:93.3383},0).wait(1).to({scaleY:1.7777,y:93.339},0).wait(1).to({scaleY:1.7707,y:93.3397},0).wait(1).to({scaleY:1.7637,y:93.3404},0).wait(1).to({scaleY:1.7566,y:93.3412},0).wait(1).to({scaleY:1.7496,y:93.3419},0).wait(1).to({scaleY:1.7426,y:93.3426},0).wait(1).to({scaleY:1.7356,y:93.3433},0).wait(1).to({scaleY:1.7285,y:93.344},0).wait(1).to({scaleY:1.7215,y:93.3447},0).wait(1).to({scaleY:1.7145,y:93.3454},0).wait(1).to({scaleY:1.7074,y:93.3461},0).wait(1).to({scaleY:1.7004,y:93.3468},0).wait(1).to({scaleY:1.6934,y:93.3475},0).wait(1).to({scaleY:1.6864,y:93.3482},0).wait(1).to({scaleY:1.6793,y:93.3489},0).wait(1).to({scaleY:1.6723,y:93.3496},0).wait(1).to({scaleY:1.6653,y:93.3503},0).wait(1).to({scaleY:1.6583,y:93.351},0).wait(1).to({scaleY:1.6512,y:93.3517},0).wait(1).to({scaleY:1.6442,y:93.3524},0).wait(1).to({scaleY:1.6372,y:93.3531},0).wait(1).to({scaleY:1.6301,y:93.3538},0).wait(1).to({scaleY:1.6231,y:93.3545},0).wait(1).to({scaleY:1.6249,y:93.3543},0).wait(1).to({scaleY:1.6267,y:93.3542},0).wait(1).to({scaleY:1.6284,y:93.354},0).wait(1).to({scaleY:1.6302,y:93.3538},0).wait(1).to({scaleY:1.632,y:93.3536},0).wait(1).to({scaleY:1.6338,y:93.3534},0).wait(1).to({scaleY:1.6355,y:93.3533},0).wait(1).to({scaleY:1.6373,y:93.3531},0).wait(1).to({scaleY:1.6391,y:93.3529},0).wait(1).to({scaleY:1.6409,y:93.3527},0).wait(1).to({scaleY:1.6426,y:93.3526},0).wait(1).to({scaleY:1.6444,y:93.3524},0).wait(1).to({scaleY:1.6462,y:93.3522},0).wait(1).to({scaleY:1.648,y:93.352},0).wait(1).to({scaleY:1.6498,y:93.3518},0).wait(1).to({scaleY:1.6515,y:93.3517},0).wait(1).to({scaleY:1.6533,y:93.3515},0).wait(1).to({scaleY:1.6551,y:93.3513},0).wait(1).to({scaleY:1.6569,y:93.3511},0).wait(1).to({scaleY:1.6586,y:93.351},0).wait(1).to({scaleY:1.6604,y:93.3508},0).wait(1).to({scaleY:1.6622,y:93.3506},0).wait(1).to({scaleY:1.664,y:93.3504},0).wait(1).to({scaleY:1.6657,y:93.3502},0).wait(1).to({scaleY:1.6675,y:93.3501},0).wait(1).to({scaleY:1.6693,y:93.3499},0).wait(1).to({scaleY:1.6711,y:93.3497},0).wait(1).to({scaleY:1.6728,y:93.3495},0).wait(1).to({scaleY:1.6746,y:93.3494},0).wait(1).to({scaleY:1.6764,y:93.3492},0).wait(1).to({scaleY:1.6782,y:93.349},0).wait(1).to({scaleY:1.6799,y:93.3488},0).wait(1).to({scaleY:1.6817,y:93.3486},0).wait(1).to({scaleY:1.6835,y:93.3485},0).wait(1).to({scaleY:1.6853,y:93.3483},0).wait(1).to({scaleY:1.6871,y:93.3481},0).wait(1).to({scaleY:1.6888,y:93.3479},0).wait(1).to({scaleY:1.6906,y:93.3478},0).wait(1).to({scaleY:1.6924,y:93.3476},0).wait(1).to({scaleY:1.6942,y:93.3474},0).wait(1).to({scaleY:1.6959,y:93.3472},0).wait(1).to({scaleY:1.6977,y:93.347},0).wait(1).to({scaleY:1.6995,y:93.3469},0).wait(1).to({scaleY:1.7013,y:93.3467},0).wait(1).to({scaleY:1.703,y:93.3465},0).wait(1).to({scaleY:1.7048,y:93.3463},0).wait(1).to({scaleY:1.7066,y:93.3462},0).wait(1).to({scaleY:1.7084,y:93.346},0).wait(1).to({scaleY:1.7101,y:93.3458},0).to({_off:true},1).wait(16));

	// sunpool
	this.instance_1 = new lib.lightpool("synched",0);
	this.instance_1.setTransform(-69,122.55,0.5295,0.62,0,0,0,54.8,17.8);
	this.instance_1._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_1).wait(32).to({_off:false},0).to({regX:54.4,regY:18,scaleX:3.8111,scaleY:2.8186,x:-78.25,y:141},71).to({startPosition:0},7).to({_off:true},1).wait(16));

	// wall
	this.instance_2 = new lib.CachedBmp_40();
	this.instance_2.setTransform(-296.5,93,0.3772,0.3772);

	this.timeline.addTween(cjs.Tween.get(this.instance_2).wait(110).to({_off:true},1).wait(16));

	// birds
	this.instance_3 = new lib.Tween22("synched",0);
	this.instance_3.setTransform(-241.35,-121.4,0.6704,0.5472);

	this.instance_4 = new lib.Tween21("synched",0);
	this.instance_4.setTransform(-73.95,-60.3,0.7503,0.5794,0,0,0,0,-0.1);
	this.instance_4._off = true;

	this.instance_5 = new lib.Tween19("synched",0);
	this.instance_5.setTransform(-25.5,-59.55,0.6578,0.6551,0,0,0,0,-0.1);
	this.instance_5._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_3).to({_off:true,regY:-0.1,scaleX:0.7503,scaleY:0.5794,x:-73.95,y:-60.3},32).wait(95));
	this.timeline.addTween(cjs.Tween.get(this.instance_4).to({_off:false},32).to({_off:true,scaleX:0.6578,scaleY:0.6551,x:-25.5,y:-59.55},30).wait(65));
	this.timeline.addTween(cjs.Tween.get(this.instance_5).wait(32).to({_off:false},30).to({regX:0.1,scaleX:0.9677,scaleY:0.9674,x:243.9,y:-95.8},48).to({_off:true},1).wait(16));

	// clouds
	this.instance_6 = new lib.cloud1("synched",15);
	this.instance_6.setTransform(58.65,-102.55,0.6624,0.5703,0,0,0,68.2,31.7);

	this.instance_7 = new lib.cloud2("synched",15);
	this.instance_7.setTransform(-219.55,-21.9,0.6147,0.4873,0,0,0,60.9,29.4);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_7,p:{regX:60.9,x:-219.55,startPosition:15}},{t:this.instance_6,p:{startPosition:15}}]}).to({state:[{t:this.instance_7,p:{regX:61,x:-219.5,startPosition:10}},{t:this.instance_6,p:{startPosition:5}}]},110).to({state:[]},1).to({state:[{t:this.instance_7,p:{regX:61,x:-219.5,startPosition:17}},{t:this.instance_6,p:{startPosition:12}}]},6).wait(10));

	// sunray
	this.instance_8 = new lib.sunrays("synched",0);
	this.instance_8.setTransform(350.35,-208.9,1,1,0,0,0,81.1,51.9);
	this.instance_8._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_8).wait(32).to({_off:false},0).to({regX:80.8,regY:51.5,scaleX:8.098,scaleY:8.5867,x:269.5,y:-212.3},72).to({startPosition:0},6).to({_off:true},1).wait(6).to({_off:false},0).wait(10));

	// background
	this.instance_9 = new lib.CachedBmp_44();
	this.instance_9.setTransform(-299,24.75,0.3772,0.3772);

	this.instance_10 = new lib.grass("synched",0);
	this.instance_10.setTransform(39.25,177.45,1,1.3505,0,0,0,356.2,38.9);

	this.instance_11 = new lib.CachedBmp_13();
	this.instance_11.setTransform(-350.95,-153.85,0.3772,0.3772);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_11},{t:this.instance_10},{t:this.instance_9}]}).to({state:[{t:this.instance_11},{t:this.instance_10},{t:this.instance_9}]},110).to({state:[]},1).to({state:[{t:this.instance_11},{t:this.instance_10},{t:this.instance_9}]},6).wait(10));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-491.8,-654.5,1420.5,891.3);


(lib.finalButtonSCENE = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// skyline
	this.instance = new lib.cloud1();
	this.instance.setTransform(180.7,87.75,1,1,0,0,0,84.8,59.4);

	this.instance_1 = new lib.cloud3();
	this.instance_1.setTransform(665.25,125.05,1,1,0,0,0,86.2,41.4);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_1},{t:this.instance}]}).to({state:[]},1).wait(59));

	// grass_button
	this.instance_2 = new lib.restart("synched",0);
	this.instance_2.setTransform(376.5,298.6,1.9231,2.3793,0,0,0,52.1,8.8);

	this.instance_3 = new lib.garden_bg("synched",0);
	this.instance_3.setTransform(361.2,343.2,0.9176,1,0,0,0,388.2,134.8);

	this.instance_4 = new lib.grass("synched",0);
	this.instance_4.setTransform(356.2,438.4,1,1.3093,0,0,0,356.2,38.9);

	this.shape = new cjs.Shape();
	this.shape.graphics.f("#CBE9FA").s().p("Eg3mAlvMAAAhLdMBvNAAAMAAABLdg");
	this.shape.setTransform(356.575,241.475);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape},{t:this.instance_4},{t:this.instance_3},{t:this.instance_2}]}).to({state:[]},1).wait(59));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,765.4,489.1);


(lib.wallclimbfail = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// birds
	this.instance = new lib.Symbol3();
	this.instance.setTransform(202.2,-76.55,1,1,0,0,0,85.4,53.1);

	this.timeline.addTween(cjs.Tween.get(this.instance).to({x:-267.7,y:-31.25},57).wait(1));

	// topleg
	this.instance_1 = new lib.catrightfoot();
	this.instance_1.setTransform(-118.4,96.05,2.1513,2.9127,59.9985,0,0,8.7,14.2);

	this.timeline.addTween(cjs.Tween.get(this.instance_1).to({x:-103.1},22).to({x:-137.3},17).wait(19));

	// wall
	this.instance_2 = new lib.CachedBmp_37();
	this.instance_2.setTransform(-296.4,93.1,0.3772,0.3772);

	this.timeline.addTween(cjs.Tween.get(this.instance_2).wait(58));

	// legs
	this.instance_3 = new lib.catleftfoot();
	this.instance_3.setTransform(54.6,56,2.3923,2.4893,29.9993,0,0,13.2,21);

	this.timeline.addTween(cjs.Tween.get(this.instance_3).to({regX:13.1,rotation:34.0216,x:54.95,y:56.1},25).to({regX:13.2,rotation:-10.9777,x:55.25,y:56},25).wait(8));

	// background
	this.instance_4 = new lib.CachedBmp_43();
	this.instance_4.setTransform(-430,-218.65,0.3772,0.3772);

	this.timeline.addTween(cjs.Tween.get(this.instance_4).wait(58));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-430,-218.6,780.8,476.29999999999995);


// stage content:
(lib.Catlookingtosleep = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	this.actionFrames = [0,15,100,188,279,306,307,479];
	this.streamSoundSymbolsList[0] = [{id:"mixkitmorningsoundswavwav",startFrame:0,endFrame:100,loop:1,offset:0}];
	this.streamSoundSymbolsList[15] = [{id:"mixkitangrycartoonkittymeowwavwav",startFrame:15,endFrame:279,loop:1,offset:0}];
	this.streamSoundSymbolsList[100] = [{id:"Bossanovabeatmusicloop",startFrame:100,endFrame:188,loop:1,offset:0}];
	this.streamSoundSymbolsList[188] = [{id:"Angelicchoirintrologo",startFrame:188,endFrame:306,loop:1,offset:0}];
	this.streamSoundSymbolsList[279] = [{id:"mixkitgaspwavwav",startFrame:279,endFrame:307,loop:1,offset:0}];
	this.streamSoundSymbolsList[306] = [{id:"mixkitmorningsoundswavwav",startFrame:306,endFrame:480,loop:1,offset:0}];
	this.streamSoundSymbolsList[307] = [{id:"Catmeowsandpurringsound",startFrame:307,endFrame:465,loop:1,offset:0}];
	// timeline functions:
	this.frame_0 = function() {
		this.clearAllSoundStreams();
		 
		var soundInstance = playSound("mixkitmorningsoundswavwav",0);
		this.InsertIntoSoundStreamData(soundInstance,0,100,1);
		var self= this;
		self.stop();
		
		self.begin.addEventListener("click",startPlaying);
		
		function startPlaying(){
			self.gotoAndPlay(2);
		}
		createjs.Sound.registerSound("C:\Users\97258\Desktop\לימודים\שנה א'- סמסטר ב'\מבוא לתכנות,אינטראקציה ואנימציה\sounds_Storyboard\mixkit-morningsounds wav.wav","morningsounds");
		createjs.Sound.play("morningsounds");
	}
	this.frame_15 = function() {
		var soundInstance = playSound("mixkitangrycartoonkittymeowwavwav",0);
		this.InsertIntoSoundStreamData(soundInstance,15,279,1);
		createjs.Sound.registerSound("C:\Users\97258\Desktop\לימודים\שנה א'- סמסטר ב'\מבוא לתכנות,אינטראקציה ואנימציה\sounds_Storyboard\mixkit-angry-cartoon-kitty-meow-wav.wav","mixkit-angry-cartoon-kitty-meow-wav.wav");
		createjs.Sound.play("mixkit-angry-cartoon-kitty-meow-wav.wav");
	}
	this.frame_100 = function() {
		var soundInstance = playSound("Bossanovabeatmusicloop",0);
		this.InsertIntoSoundStreamData(soundInstance,100,188,1);
		createjs.Sound.registerSound("C:\Users\97258\Desktop\לימודים\שנה א'- סמסטר ב'\מבוא לתכנות,אינטראקציה ואנימציה\Storyboard2\plswork2\sounds\Bossanovabeatmusicloop.mp3","Bossanovabeatmusicloop.mp3");
		
		createjs.Sound.play("Bossanovabeatmusicloop.mp3");
	}
	this.frame_188 = function() {
		var soundInstance = playSound("Angelicchoirintrologo",0);
		this.InsertIntoSoundStreamData(soundInstance,188,306,1);
		createjs.Sound.registerSound("C:\Users\97258\Desktop\לימודים\שנה א'- סמסטר ב'\מבוא לתכנות,אינטראקציה ואנימציה\sounds_Storyboard\Angelic-choir-intro-logo\Angelic-choir-intro-logo.mp3","Angelic-choir-intro-logo.mp3");
		createjs.Sound.play("Angelic-choir-intro-logo.mp3");
	}
	this.frame_279 = function() {
		var soundInstance = playSound("mixkitgaspwavwav",0);
		this.InsertIntoSoundStreamData(soundInstance,279,307,1);
		createjs.Sound.registerSound("C:\Users\97258\Desktop\לימודים\שנה א'- סמסטר ב'\מבוא לתכנות,אינטראקציה ואנימציה\sounds_Storyboard\mixkit-gasp wav.wav","mixkit-gasp wav.wav");
		createjs.Sound.play("mixkit-gasp wav.wav");
	}
	this.frame_306 = function() {
		var soundInstance = playSound("mixkitmorningsoundswavwav",0);
		this.InsertIntoSoundStreamData(soundInstance,306,480,1);
		createjs.Sound.registerSound("C:\Users\97258\Desktop\לימודים\שנה א'- סמסטר ב'\מבוא לתכנות,אינטראקציה ואנימציה\sounds_Storyboard\mixkit-morningsounds wav.wav","morningsounds");
		createjs.Sound.play("morningsounds");
	}
	this.frame_307 = function() {
		var soundInstance = playSound("Catmeowsandpurringsound",0);
		this.InsertIntoSoundStreamData(soundInstance,307,465,1);
		createjs.Sound.registerSound("C:\Users\97258\Desktop\לימודים\שנה א'- סמסטר ב'\מבוא לתכנות,אינטראקציה ואנימציה\sounds_Storyboard\Cat-meows-and-purring-sound\Cat-meows-and-purring-sound.mp3","Cat-meows-and-purring-sound.mp3");
		createjs.Sound.play("Cat-meows-and-purring-sound.mp3");
	}
	this.frame_479 = function() {
		var self= this;
		self.stop();
		self.restart.addEventListener("click",playAgain);
		
		function playAgain(){
			self.gotoAndPlay(2);
		}
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(15).call(this.frame_15).wait(85).call(this.frame_100).wait(88).call(this.frame_188).wait(91).call(this.frame_279).wait(27).call(this.frame_306).wait(1).call(this.frame_307).wait(172).call(this.frame_479).wait(1));

	// finale
	this.instance = new lib.finale("synched",0);
	this.instance.setTransform(298.75,403,1.0963,1.3256,0,0,0,-24.1,152.6);
	this.instance._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(368).to({_off:false},0).to({_off:true},111).wait(1));

	// jumpwall
	this.instance_1 = new lib.wallclimbfail("synched",0);
	this.instance_1.setTransform(301.65,403,1.1111,1.3256,0,0,0,-24.1,152.6);
	this.instance_1._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_1).wait(307).to({_off:false},0).to({_off:true},61).wait(112));

	// shockedcat
	this.instance_2 = new lib.amazedSCENE("synched",0);
	this.instance_2.setTransform(340.2,254.75,3.8595,3.5458,0,0,0,60,53.2);
	this.instance_2._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_2).wait(259).to({_off:false},0).to({_off:true},48).wait(173));

	// sunnywall
	this.instance_3 = new lib.sunnywallSCENE("synched",0);
	this.instance_3.setTransform(-0.85,399.8,3.5417,2.6937,0,0,0,-0.1,29.4);
	this.instance_3._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_3).wait(185).to({_off:false},0).to({_off:true},74).wait(221));

	// fifth
	this.instance_4 = new lib.floorStreet("synched",0);
	this.instance_4.setTransform(319.4,435.7,1,1,0,0,0,321.4,45.1);
	this.instance_4._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_4).wait(140).to({_off:false},0).to({_off:true},45).wait(295));

	// fourth
	this.instance_5 = new lib.scene5("synched",0);
	this.instance_5.setTransform(320.7,239.25,1,1,0,0,0,324.8,238);
	this.instance_5._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_5).wait(100).to({_off:false},0).to({_off:true},40).wait(340));

	// third
	this.instance_6 = new lib.scene3("synched",0);
	this.instance_6.setTransform(327.9,203.9,1,1,0,0,0,328.1,277.1);
	this.instance_6._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_6).wait(64).to({_off:false},0).to({_off:true},36).wait(380));

	// first_second
	this.instance_7 = new lib.SCENE1("synched",0);
	this.instance_7.setTransform(312.6,283.8,1,1,0,0,0,329.1,196.2);
	this.instance_7._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_7).wait(1).to({_off:false},0).to({_off:true},63).wait(416));

	// buttonPLAY
	this.begin = new lib.startButton();
	this.begin.name = "begin";
	this.begin.setTransform(328.65,256.5,1.125,1.5097,0,0,0,0.1,0.4);
	new cjs.ButtonHelper(this.begin, 0, 1, 2, false, new lib.startButton(), 3);

	this.instance_8 = new lib.sky_bg("synched",0,false);
	this.instance_8.setTransform(87.8,60.1,1,1,0,0,0,540.5,430);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_8},{t:this.begin}]}).to({state:[]},1).wait(479));

	// final_button_bg
	this.restart = new lib.startButton();
	this.restart.name = "restart";
	this.restart.setTransform(301.7,242.7,1,1.5965);
	new cjs.ButtonHelper(this.restart, 0, 1, 2, false, new lib.startButton(), 3);

	this.instance_9 = new lib.finalButtonSCENE("synched",0);
	this.instance_9.setTransform(291.6,245.35,1,1,0,0,0,358.8,244.6);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.instance_9},{t:this.restart}]},479).wait(1));

	this._renderFirstFrame();

}).prototype = p = new lib.AnMovieClip();
p.nominalBounds = new cjs.Rectangle(-50.7,-426.9,1394,1080.1);
// library properties:
lib.properties = {
	id: '9644F3D3984CB848A186BE09F7C24A1F',
	width: 640,
	height: 480,
	fps: 24,
	color: "#FFFFFF",
	opacity: 1.00,
	manifest: [
		{src:"images/CachedBmp_43.png", id:"CachedBmp_43"},
		{src:"images/CachedBmp_28.png", id:"CachedBmp_28"},
		{src:"images/CachedBmp_4.png", id:"CachedBmp_4"},
		{src:"images/Catlookingtosleep_atlas_1.png", id:"Catlookingtosleep_atlas_1"},
		{src:"images/Catlookingtosleep_atlas_2.png", id:"Catlookingtosleep_atlas_2"},
		{src:"images/Catlookingtosleep_atlas_3.png", id:"Catlookingtosleep_atlas_3"},
		{src:"images/Catlookingtosleep_atlas_4.png", id:"Catlookingtosleep_atlas_4"},
		{src:"images/Catlookingtosleep_atlas_5.png", id:"Catlookingtosleep_atlas_5"},
		{src:"images/Catlookingtosleep_atlas_6.png", id:"Catlookingtosleep_atlas_6"},
		{src:"images/Catlookingtosleep_atlas_7.png", id:"Catlookingtosleep_atlas_7"},
		{src:"sounds/Angelicchoirintrologo.mp3", id:"Angelicchoirintrologo"},
		{src:"sounds/Bossanovabeatmusicloop.mp3", id:"Bossanovabeatmusicloop"},
		{src:"sounds/Catmeowsandpurringsound.mp3", id:"Catmeowsandpurringsound"},
		{src:"sounds/mixkitangrycartoonkittymeowwavwav.mp3", id:"mixkitangrycartoonkittymeowwavwav"},
		{src:"sounds/mixkitgaspwavwav.mp3", id:"mixkitgaspwavwav"},
		{src:"sounds/mixkitmorningsoundswavwav.mp3", id:"mixkitmorningsoundswavwav"}
	],
	preloads: []
};



// bootstrap callback support:

(lib.Stage = function(canvas) {
	createjs.Stage.call(this, canvas);
}).prototype = p = new createjs.Stage();

p.setAutoPlay = function(autoPlay) {
	this.tickEnabled = autoPlay;
}
p.play = function() { this.tickEnabled = true; this.getChildAt(0).gotoAndPlay(this.getTimelinePosition()) }
p.stop = function(ms) { if(ms) this.seek(ms); this.tickEnabled = false; }
p.seek = function(ms) { this.tickEnabled = true; this.getChildAt(0).gotoAndStop(lib.properties.fps * ms / 1000); }
p.getDuration = function() { return this.getChildAt(0).totalFrames / lib.properties.fps * 1000; }

p.getTimelinePosition = function() { return this.getChildAt(0).currentFrame / lib.properties.fps * 1000; }

an.bootcompsLoaded = an.bootcompsLoaded || [];
if(!an.bootstrapListeners) {
	an.bootstrapListeners=[];
}

an.bootstrapCallback=function(fnCallback) {
	an.bootstrapListeners.push(fnCallback);
	if(an.bootcompsLoaded.length > 0) {
		for(var i=0; i<an.bootcompsLoaded.length; ++i) {
			fnCallback(an.bootcompsLoaded[i]);
		}
	}
};

an.compositions = an.compositions || {};
an.compositions['9644F3D3984CB848A186BE09F7C24A1F'] = {
	getStage: function() { return exportRoot.stage; },
	getLibrary: function() { return lib; },
	getSpriteSheet: function() { return ss; },
	getImages: function() { return img; }
};

an.compositionLoaded = function(id) {
	an.bootcompsLoaded.push(id);
	for(var j=0; j<an.bootstrapListeners.length; j++) {
		an.bootstrapListeners[j](id);
	}
}

an.getComposition = function(id) {
	return an.compositions[id];
}


an.makeResponsive = function(isResp, respDim, isScale, scaleType, domContainers) {		
	var lastW, lastH, lastS=1;		
	window.addEventListener('resize', resizeCanvas);		
	resizeCanvas();		
	function resizeCanvas() {			
		var w = lib.properties.width, h = lib.properties.height;			
		var iw = window.innerWidth, ih=window.innerHeight;			
		var pRatio = window.devicePixelRatio || 1, xRatio=iw/w, yRatio=ih/h, sRatio=1;			
		if(isResp) {                
			if((respDim=='width'&&lastW==iw) || (respDim=='height'&&lastH==ih)) {                    
				sRatio = lastS;                
			}				
			else if(!isScale) {					
				if(iw<w || ih<h)						
					sRatio = Math.min(xRatio, yRatio);				
			}				
			else if(scaleType==1) {					
				sRatio = Math.min(xRatio, yRatio);				
			}				
			else if(scaleType==2) {					
				sRatio = Math.max(xRatio, yRatio);				
			}			
		}
		domContainers[0].width = w * pRatio * sRatio;			
		domContainers[0].height = h * pRatio * sRatio;
		domContainers.forEach(function(container) {				
			container.style.width = w * sRatio + 'px';				
			container.style.height = h * sRatio + 'px';			
		});
		stage.scaleX = pRatio*sRatio;			
		stage.scaleY = pRatio*sRatio;
		lastW = iw; lastH = ih; lastS = sRatio;            
		stage.tickOnUpdate = false;            
		stage.update();            
		stage.tickOnUpdate = true;		
	}
}
an.handleSoundStreamOnTick = function(event) {
	if(!event.paused){
		var stageChild = stage.getChildAt(0);
		if(!stageChild.paused || stageChild.ignorePause){
			stageChild.syncStreamSounds();
		}
	}
}
an.handleFilterCache = function(event) {
	if(!event.paused){
		var target = event.target;
		if(target){
			if(target.filterCacheList){
				for(var index = 0; index < target.filterCacheList.length ; index++){
					var cacheInst = target.filterCacheList[index];
					if((cacheInst.startFrame <= target.currentFrame) && (target.currentFrame <= cacheInst.endFrame)){
						cacheInst.instance.cache(cacheInst.x, cacheInst.y, cacheInst.w, cacheInst.h);
					}
				}
			}
		}
	}
}


})(createjs = createjs||{}, AdobeAn = AdobeAn||{});
var createjs, AdobeAn;