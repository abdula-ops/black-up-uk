if (!customElements.get("video-controls")) {
  customElements.define(
    "video-controls",
    class VideoControls extends HTMLElement {
      constructor() {
        super();
      }
      

      connectedCallback() {
        this.video = this.querySelector("video");
        this.hasVideoClickToggle = this.dataset.videoClick === "false" ? false : true;
        this.productsContainer = this.querySelector(
          ".shoppable-video__products",
        );
        this.controlButton = this.querySelector(
          ".shoppable-video__control-button",
        );
        
        this.togglePlayPause = this.togglePlayPause.bind(this);
        this.toggleVideoIcon = this.toggleVideoIcon.bind(this);

        this.addEventListeners();
        if(this.controlButton && this.video) this.toggleVideoIcon();
      }
      
      addEventListeners() {
        if(this.controlButton) this.controlButton.addEventListener("click", this.togglePlayPause);
        if(this.video && this.hasVideoClickToggle) this.video.addEventListener("click", this.togglePlayPause);
        if(this.controlButton && this.video){
          this.video.addEventListener("play", this.toggleVideoIcon);
          this.video.addEventListener("pause", this.toggleVideoIcon);
        }
      }
      
      removeEventListeners() {
        if(this.controlButton) this.controlButton.removeEventListener("click", this.togglePlayPause);
        if(this.video && this.hasVideoClickToggle) this.video.removeEventListener("click", this.togglePlayPause);
        if(this.controlButton && this.video){
          this.video.removeEventListener("play", this.toggleVideoIcon);
          this.video.removeEventListener("pause", this.toggleVideoIcon);
        }
      }

      toggleVideoIcon() {
        const isPlaying = !this.video.paused;
        this.controlButton.classList.toggle(
          "shoppable-video__control-button--play",
          isPlaying,
        );
        this.controlButton.classList.toggle(
          "shoppable-video__control-button--pause",
          !isPlaying,
        );
      }

      togglePlayPause(e) {
        e.preventDefault();
        const videoElement = this.video;
        if (!videoElement) return;

        if (videoElement.paused || videoElement.ended) {
          videoElement.play();
          console.log("Video Resumed");
        } else {
          videoElement.pause();
          console.log("Video Paused");
        }
      }

      disconnectedCallback(){
        this.removeEventListeners();
      }

    },
  );
}

// Added by OCS - To Mute / Unmute functioanlity in the video
document.addEventListener('DOMContentLoaded', function () {
  const buttons = document.querySelectorAll('.wt-video__sound-toggle');

  buttons.forEach(function (btn) {
    if (btn.dataset.listenerAttached === 'true') return;
    btn.addEventListener('click', function () {
      const wrapper = this.closest('.hero .wt-video__movie');
      console.log(wrapper);
      const video = wrapper?.querySelector('video');
      if (!video) return;
    
      const currentState = this.dataset.sound;
      
      if (currentState === 'off') {
        // Ensure video is playing before unmuting
        if (video.paused) {
          video.play().then(() => {
            video.muted = false;
            this.dataset.sound = 'on';
            console.log('Sound turned ON');
          }).catch(err => {
            console.warn('Autoplay/play blocked by browser:', err);
          });
        } else {
          video.muted = false;
          this.dataset.sound = 'on';
          console.log('Sound turned ON');
        }
      } else {
        video.muted = true;
        this.dataset.sound = 'off';
        console.log('Sound turned OFF');
      }
    });

    // Mark this button so we don’t attach again
    btn.dataset.listenerAttached = 'true';
  });
});



// Added by ocs 
// document.addEventListener('DOMContentLoaded', function () {
//   const buttons = document.querySelectorAll('.wt-video__sound-toggle');

//   buttons.forEach(function (btn) {
//     btn.addEventListener('click', function () {
//       const wrapper = this.closest('.hero .wt-video__movie');
//       const video = wrapper?.querySelector('video');
//       //const currentState = this.getAttribute('data-sound');
//       const currentState = this.dataset.sound;
//       console.log(currentState)
//       setTimeout(() => {
//         if (currentState === 'off') {
//           video.muted = false;
//           this.dataset.sound = 'on';
//           console.log(currentState);  
//         }
//       }, 100);
//       setTimeout(() => {
//         if (currentState === 'on') {
//           video.muted = true;
//           this.dataset.sound = 'off';
//           console.log(currentState);  
//         }
//       }, 100);
//     });
//   });
// });