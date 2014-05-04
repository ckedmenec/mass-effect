function AudioPlayer ( id ) {
	// Get the dom element playing the music
	this.audio = document.getElementById( id );

	// Global state
	this.isPlaying = false;
	_this = this;

	// Get the custom buttoms 
	togglePlayPause = document.querySelector("[data-audio-fn='togglePlayPause']");

	// What happens when the user toggles play/pause
	togglePlayPause.addEventListener('click', function () {
		_this.togglePlayPause();
	});

	this.togglePlayPause = function () {
		if (_this.isPlaying) {
			_this.audio.pause();
			_this.isPlaying = false;
		} else {
			_this.audio.play();
			_this.isPlaying = true;
		}
	}
}
