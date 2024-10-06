function openFullscreen(el) {
    inFullScreen = true;
    if (screen.width * (1/aspectRatio) >= screen.height * aspectRatio) {
      canvas.style.height = screen.height + 'px';
      canvas.style.width = (screen.height * aspectRatio) + 'px';
    } else {
      canvas.style.width = screen.width + 'px';
      canvas.style.height = (screen.width * (1/aspectRatio)) + 'px';
    }
    if(canvas.requestFullscreen) {
      canvas.requestFullscreen();
    } else if(canvas.mozRequestFullScreen) {
      canvas.mozRequestFullScreen();
    } else if(canvas.webkitRequestFullscreen) {
      canvas.webkitRequestFullscreen();
    } else if(canvas.msRequestFullscreen) {
      canvas.msRequestFullscreen();
    } else{
        alert("Fullscreen not supported");
    }
  }
  
  function exitFullscreen() {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  }
  
  document.addEventListener("keydown", function(e) {
    if (e.keyCode == 13) {
      openFullscreen();
    }
  }, false);
  
  document.addEventListener('fullscreenchange', exitHandler);
  document.addEventListener('webkitfullscreenchange', exitHandler);
  document.addEventListener('mozfullscreenchange', exitHandler);
  document.addEventListener('MSFullscreenChange', exitHandler);
  
  function exitHandler() {
      if (!document.fullscreenElement && !document.webkitIsFullScreen && !document.mozFullScreen && !document.msFullscreenElement) {
        canvas.style.width = windowedWidth + 'px';
        canvas.style.height = windowedHeight + 'px';
      }
  }