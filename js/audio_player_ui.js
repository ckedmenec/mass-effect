(function() {

  this.AudioPlayerUI = (function() {

    AudioPlayerUI.prototype.transitionEvents = ["transitionend", "webkitTransitionEnd", "MSTransitionEnd", "oTransitionEnd"];

    function AudioPlayerUI(options) {
      if (options == null) {
        options = {};
      }
      this.setOptions(options);
      this.audioPlayer = new AudioPlayer({
        ui: this
      });
      this._createAudioEl();
      this._createImageEl();
      if (options.el) {
        this.setEl(options.el);
      }
      this.goToSong(0);
    }

    AudioPlayerUI.prototype.setOptions = function(options) {
      var key, value, _results;
      _results = [];
      for (key in options) {
        value = options[key];
        _results.push(this[key] = value);
      }
      return _results;
    };

    AudioPlayerUI.prototype.setEl = function(el) {
      this._unbindEvents();
      this.el = el;
      this.$el = $(this.el);
      this.$el.append(this.audioEl);
      this.$imageContainer = this.$el.find(".audio-player-image");
      this.$imageContainer.append(this.image);
      this.$progressContainer = this.$el.find(".audio-player-progress");
      this.$progressBar = this.$el.find(".audio-player-progress-bar");
      this.$button = this.$el.find(".audio-player-place-pause-button");
      this.$backButton = this.$el.find(".icon-backward");
      this.$nextButton = this.$el.find(".icon-forward");
      this.$name = this.$el.find(".audio-player-song-name");
      return this._bindEvents();
    };

    AudioPlayerUI.prototype.togglePlayPause = function() {
      if (this.audioPlayer.isPlaying()) {
        return this.audioPlayer.pause();
      } else {
        return this.audioPlayer.play();
      }
    };

    AudioPlayerUI.prototype.goToSong = function(index) {
      var wasPlaying;
      this.currentSong = index;
      wasPlaying = this.audioPlayer.isPlaying();
      this._updateSourceAttributes(index);
      this._updateImageAttributes(index);
      this.$name[0].innerHTML = this.songs[index].name;
      this.audioPlayer.setEl(this.audioEl);
      this.$progressBar.css({
        width: 0
      });
      this.audioPlayer.load();
      if (wasPlaying) {
        return this.audioPlayer.play();
      }
    };

    AudioPlayerUI.prototype.nextSong = function() {
      if (this.currentSong === this.songs.length - 1) {
        return this.goToSong(0);
      } else {
        return this.goToSong(this.currentSong + 1);
      }
    };

    AudioPlayerUI.prototype.previousSong = function() {
      if (this.currentSong === 0) {
        return this.goToSong(this.songs.length - 1);
      } else {
        return this.goToSong(this.currentSong - 1);
      }
    };

    AudioPlayerUI.prototype.seek = function(e) {
      var duration, offset, percent, seekTo, _ref;
      if (offset = e.offsetX || ((_ref = e.originalEvent) != null ? _ref.layerX : void 0)) {
        percent = offset / this.$progressContainer.width();
        duration = this.audioPlayer.duration();
        seekTo = duration * percent;
        return this.audioPlayer.seekTo(seekTo);
      }
    };

    AudioPlayerUI.prototype.AudioPlayerUpdateState = function() {
      this.$el.toggleClass("error", this.audioPlayer.isErrored());
      this.$progressContainer.toggleClass("loading", this.audioPlayer.isLoading());
      if (this.audioPlayer.isPlaying()) {
        return this.$button.removeClass("icon-play").addClass("icon-pause");
      } else {
        return this.$button.removeClass("icon-pause").addClass("icon-play");
      }
    };

    AudioPlayerUI.prototype.AudioPlayerTimeUpdated = function(percentComplete) {
      return this.$progressBar.css({
        width: "" + (percentComplete * 100) + "%"
      });
    };

    AudioPlayerUI.prototype._createImageEl = function() {
      return this.image = document.createElement("img");
    };

    AudioPlayerUI.prototype._createAudioEl = function() {
      return this.audioEl = document.createElement("audio");
    };

    AudioPlayerUI.prototype._updateSourceAttributes = function(index) {
      var source, sourceEl, _i, _len, _ref, _results;
      while (this.audioEl.firstChild) {
        this.audioEl.removeChild(this.audioEl.firstChild);
      }
      _ref = this.songs[index].srcs;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        source = _ref[_i];
        sourceEl = document.createElement("source");
        sourceEl.setAttribute("src", source.src);
        sourceEl.setAttribute("type", source.type);
        _results.push(this.audioEl.appendChild(sourceEl));
      }
      return _results;
    };

    AudioPlayerUI.prototype._updateImageAttributes = function(index) {
      var callback, secondImage,
        _this = this;
      callback = function() {
        _this.image.removeAttribute("class");
        $(_this.image).off(_this.transitionEvents.join(" "));
        _this.image.setAttribute("src", _this.songs[index].image);
        return setTimeout(function() {
          if (secondImage) {
            return _this.$imageContainer[0].removeChild(secondImage);
          }
        }, 500);
      };
      if (Modernizr.csstransitions && this.$imageContainer && this.image.getAttribute("src")) {
        secondImage = document.createElement("img");
        secondImage.setAttribute("src", this.songs[index].image);
        this.image.setAttribute("class", "fading");
        this.$imageContainer.append(secondImage);
        return $(this.image).on(this.transitionEvents.join(" "), callback);
      } else {
        return callback();
      }
    };

    AudioPlayerUI.prototype._bindEvents = function() {
      this.$button.on("click", $.proxy(this, "togglePlayPause"));
      this.$backButton.on("click", $.proxy(this, "previousSong"));
      this.$nextButton.on("click", $.proxy(this, "nextSong"));
      return this.$progressContainer.on("mouseup", $.proxy(this, "seek"));
    };

    AudioPlayerUI.prototype._unbindEvents = function() {
      var _ref, _ref1, _ref2, _ref3;
      if ((_ref = this.$button) != null) {
        _ref.off("click", this.togglePlayPause);
      }
      if ((_ref1 = this.$backButton) != null) {
        _ref1.off("click", this.previousSong);
      }
      if ((_ref2 = this.$nextButton) != null) {
        _ref2.off("click", this.nextSong);
      }
      return (_ref3 = this.$progressContainer) != null ? _ref3.off("mouseup", this.seek) : void 0;
    };

    return AudioPlayerUI;

  })();

  this.audioPlayer = new AudioPlayerUI({
    el: document.getElementById("audio-player"),
    songs: [
      {
        image: "images/sunhawk-small@2x.jpg",
        name: "Sunhawk - She Snake Shuffle",
        srcs: [
          {
            src: "SheSnake.mp3",
            type: "audio/mp3"
          }
        ]
      }, {
        image: "images/sunhawk-small-2@2x.jpg",
        name: "Sunhawk - Shotgun Love",
        srcs: [
          {
            src: "ShotgunLove.mp3",
            type: "audio/mp3"
          }, {
            src: "ShotgunLove.m4a",
            type: "audio/mp4"
          }, {
            src: "ShotgunLove.ogg",
            type: "audio/ogg"
          }
        ]
      }
    ]
  });

}).call(this);
