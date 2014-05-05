
function AudioPlayer ( options ) {
	this.setOptions(options);
	if (options.el) {
    this.setElements(options.el);
  }
  this.initialize();
}

AudioPlayer.prototype.initialize = function () {
	_this = this
	this.songs.forEach(function ( elem ) {

		var el = document.createElement("li");

		var title = document.createElement("p");
		var duration = document.createElement("p");
		var n = document.createTextNode(elem.name);
		var d = document.createTextNode(elem.duration);
		title.appendChild(n);
		duration.appendChild(d);
		duration.setAttribute('class', 'duration')

		el.setAttribute("class", "song")
		el.appendChild(title)
		el.appendChild(duration)
    _this.$playlist.get(0).appendChild(el);
	})
	this.goToSong(0)
	this.audioPlayer.volume = 1
	this.$progressContainer.find('.progress-slider .progress-inner').css('width', this.$progressContainer.width() + "px")
};

AudioPlayer.prototype.setOptions = function ( options ) {
	var key, value, results;
    results = [];
    for (key in options) {
      value = options[key];
      results.push(this[key] = value);
    }
  return results;
};

AudioPlayer.prototype.setElements = function ( el ) {
	this.el = el;
  this.$el = $(this.el);
  this.$progressBar = this.$el.find('[data-audio-el="progressBar"]');
  this.$togglePlayPause = this.$el.find('[data-audio-el="togglePlayPause"]');
  this.$volume = this.$el.find('[data-audio-el="volume"]');
  this.audioPlayer = this.$el.find('#audioPlayer').get(0);
  this.$elapsedTime = this.$el.find('[data-audio-el="elapsedTime"]')
  this.$durationTime = this.$el.find('[data-audio-el="durationTime"]')
  this.$progressContainer = this.$el.find('[data-audio-el="progressContainer"]');
  this.$playlist = this.$el.find('[data-audio-el="playlist"]');
  this.$togglePlaylist = this.$el.find('[data-audio-el="togglePlaylist"]');
  this.$nextSong = this.$el.find('[data-audio-el="nextSong"]');
  this.$prevSong = this.$el.find('[data-audio-el="previousSong"]');
  this.$displayTitle = this.$el.find('[data-audio-el="title"]');

  this.isPlaying = false;
  this.bindEvents();
}

AudioPlayer.prototype.bindEvents = function () {
	this.$togglePlayPause.on("click", $.proxy(this, "togglePlayPause"));
	this.audioPlayer.addEventListener("timeupdate", this);
	this.audioPlayer.addEventListener("ended", this);
	window.addEventListener('resize', this);
	this.$progressContainer.on("mouseup", $.proxy(this, "seek"));
	this.$nextSong.on("click", $.proxy(this, "nextSong"));
	this.$prevSong.on("click", $.proxy(this, "previousSong"));
	this.$volume.on("click", $.proxy(this, "toggleVolume"));
	this.$togglePlaylist.on("click", $.proxy(this, "togglePlaylistView"));
	_this = this
	
	$('body').on('click', '[data-audio-el="playlist"] .song', function () {
		_this.goToSong($(this).index())
	});
	
};

AudioPlayer.prototype.toggleVolume = function () {
	switch(this.audioPlayer.volume) {
		case 1:
			this.audioPlayer.volume = 0
			this.$volume.addClass('mute').removeClass('low')
			break;

		case 0:
			this.audioPlayer.volume = 0.5
			this.$volume.addClass('low').removeClass('mute')
			break;

		case 0.5:
			this.audioPlayer.volume = 1
			this.$volume.removeClass('low').removeClass("mute")
			break;
		default:

	}

}

AudioPlayer.prototype.togglePlaylistView = function () {
	this.$playlist.toggleClass('visible')

}

AudioPlayer.prototype.togglePlayPause = function () {
	if (this.isPlaying) {
		this.audioPlayer.pause();
		this.$togglePlayPause.removeClass('paused')
		this.isPlaying = false;
	} else {
		this.audioPlayer.play();
		this.$togglePlayPause.addClass('paused')
		this.isPlaying = true;
	}
};

AudioPlayer.prototype.seek = function( e ) {
  var duration, offset, percent, seekTo, playerOffset;
  playerOffset = this.$progressContainer.offset(); 
  offset = e.pageX - playerOffset.left;
  percent = ( offset - 7 ) / this.$progressContainer.width();
  duration = this.audioPlayer.duration;
  seekTo = duration * percent;
  this.audioPlayer.currentTime = parseInt(seekTo, 10);
};

AudioPlayer.prototype.handleEvent = function(event) {
  if (event.type === "timeupdate") {
    this.updateProgress(this.percentComplete());
    this.updateTime(this.timeComplete());
  } else if (event.type === "ended") {
  	this.nextSong();
  } else if (event.type === 'resize') {
  	this.adjustPlayerSize( event );
  }
};

AudioPlayer.prototype.adjustPlayerSize = function( event ) {
	this.$progressContainer.find('.progress-slider .progress-inner').css('width', this.$progressContainer.width() + "px")
}
AudioPlayer.prototype.percentComplete = function() {
  var number;
  number = ~~((this.audioPlayer.currentTime / this.audioPlayer.duration) * 10000);
  return number / 10000;
};

AudioPlayer.prototype.timeComplete = function () {
	var number; 
	number = Math.ceil(this.audioPlayer.currentTime);
	return number;
}

AudioPlayer.prototype.updateTime = function( timeComplete ) {
	var m, s;
	m = Math.floor(timeComplete / 60) || "0";
	s = timeComplete % 60
	
	if (s < 10)
		s = "0" + s

	this.$elapsedTime.html(m + ":" + s);
};

AudioPlayer.prototype.updateProgress = function ( percentComplete ) {
  this.$progressBar.css({
    width: "" + (percentComplete * 100) + "%"
  });
};

AudioPlayer.prototype.goToSong = function ( index ) {

	var wasPlaying = this.isPlaying;
	this.currentSong = index;
  this.$progressBar.css({
    width: 0
  });

  while (this.audioPlayer.firstChild) {
    this.audioPlayer.removeChild(this.audioPlayer.firstChild);
  }

  for (i = 0; i < this.songs[index].srcs.length; i++) {
  	var source = this.songs[index].srcs[i]
    sourceEl = document.createElement("source");
    sourceEl.setAttribute("src", source.src);
    sourceEl.setAttribute("type", source.type);
    this.audioPlayer.appendChild(sourceEl);
  }

  this.audioPlayer.load();

  if (this.isPlaying) {
    this.audioPlayer.play();
    this.isPlaying = true;
  }

  this.$displayTitle.text(this.songs[index].name)
  this.$elapsedTime.text("0:00")
  this.$durationTime.text(this.songs[index].duration)
};

AudioPlayer.prototype.nextSong = function() {
  if (this.currentSong === this.songs.length - 1) {
    return this.goToSong(0);
  } else {
    return this.goToSong(this.currentSong + 1);
  }
};

AudioPlayer.prototype.previousSong = function() {
  if (this.currentSong === 0) {
    return this.goToSong(this.songs.length - 1);
  } else {
    return this.goToSong(this.currentSong - 1);
  }
};

$(document).ready(function () {
	var audioPlayer = new AudioPlayer ({
	  el: document.getElementById("audio-player"),
	  songs: [
	    {
	      name: "Sun & Moon Walls (Mass Effect Mashup)",
	      duration: "7:02",
	      srcs: [
	        {
	          src: "media/Sun & Moon Walls (Mass Effect Mashup).mp3",
	          type: "audio/mp3"
	        },
	        {
	          src: "media/Sun & Moon Walls (Mass Effect Mashup).0gg",
	          type: "audio/ogg"
	        }
	      ]
	    },
	    {
	      name: "Swoon The World (Mass Effect Mashup)",
	      duration: "7:09",
	      srcs: [
	        {
	          src: "media/Swoon-The-World-Mass-Effect-Mashup.mp3",
	          type: "audio/mp3"
	        },
	        {
	          src: "media/Swoon-The-World-Mass-Effect-Mashup.ogg",
	          type: "audio/ogg"
	        }
	      ]
	    },
	    {
	      name: "Sweet Quasar (Mass Effect Mashup)",
	      duration: "6:29",
	      srcs: [
	        {
	          src: "media/Sweet Quasar (Mass Effect Mashup).mp3",
	          type: "audio/mp3"
	        },
	        {
	          src: "media/Sweet Quasar (Mass Effect Mashup).ogg",
	          type: "audio/ogg"
	        }
	      ]
	    },
	    {
	      name: "Monster Bullet - Michael Woods vs Lady Gaga (Mass Effect Mashup)",
	      duration: "5:48",
	      srcs: [
	        {
	          src: "media/Monster Bullet - Michael Woods vs Lady Gaga (Mass Effect Mashup).mp3",
	          type: "audio/mp3"
	        },
	        {
	          src: "media/Monster Bullet - Michael Woods vs Lady Gaga (Mass Effect Mashup).ogg",
	          type: "audio/ogg"
	        }
	      ]
	    },

	    // {
	    //   image: "images/sunhawk-small-2@2x.jpg",
	    //   name: "Sunhawk - Shotgun Love",
	    //   srcs: [
	    //     {
	    //       src: "ShotgunLove.mp3",
	    //       type: "audio/mp3"
	    //     }, {
	    //       src: "ShotgunLove.m4a",
	    //       type: "audio/mp4"
	    //     }, {
	    //       src: "ShotgunLove.ogg",
	    //       type: "audio/ogg"
	    //     }
	    //   ]
	    // }
	  ]
	});
});