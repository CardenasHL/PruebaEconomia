document.addEventListener('DOMContentLoaded', function () {
    const LIMIT_SIZE = 1024;
    var sceneLoaded = false;
    var unityReadyCallbacks = [];
    var volumeBackground = '-24';
    var volumeSFX = '-12';

    window.unityDataReceived = function(jsonData) {
        console.log("Información recibida", jsonData);
        parent.postMessage(jsonData, "*");
    };

    window.unitySceneLoaded = function() {
        sceneLoaded = true;
        unityReadyCallbacks.forEach(callback => callback());
        unityReadyCallbacks = [];
    };

    // Funciones de control de pantalla completa para juegos nuevos
    window.toggleFullScreen = function() {
        let elem = document.getElementById('webgl-content');
        if (!document.fullscreenElement) {
            requestFullscreen(elem);
            setTimeout(function() {
                sendFullscreenStateToUnity(true);
            }, 50);
        } else {
            exitFullscreen();
            setTimeout(function() {
                sendFullscreenStateToUnity(false);
            }, 50);
        }
    };

    function sendFullscreenStateToUnity(isFullscreen) {
        var fullscreenStateInt = isFullscreen ? 1 : 0;
        if (typeof unityInstance !== 'undefined') {
            unityInstance.SendMessage('FullScreenToggle', 'UpdateIconBasedOnState', fullscreenStateInt);
        }
    }

    function requestFullscreen(element) {
        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        } else if (element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen();
        } else if (element.msRequestFullscreen) {
            element.msRequestFullscreen();
        }
        console.log("Pantalla completa activada");
    }
    
    function exitFullscreen() {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
        console.log("Pantalla completa desactivada");
    }

    // Mantener las funciones de pantalla completa para juegos antiguos
    window.full_screen = function() {
        let player = document.getElementById('webgl-content');
        if (!document.fullscreenElement) {
            if (player.requestFullscreen) {
                player.requestFullscreen();
            } else if (player.mozRequestFullScreen) {
                player.mozRequestFullScreen(); // Firefox
            } else if (player.webkitRequestFullscreen) {
                player.webkitRequestFullscreen(); // Chrome y Safari
            } else if (player.msRequestFullscreen) {
                player.msRequestFullscreen(); // IE/Edge
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen(); // Firefox
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen(); // Chrome y Safari
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen(); // IE/Edge
            }
        }
    };

    // Funciones de control de volumen
    function setVolumeBackground(volume) {
        if (sceneLoaded && typeof unityInstance !== 'undefined') {
            unityInstance.SendMessage('MusicControllerWebAPI', 'SetVolumeBackground', volume);
        } else {
            console.error("La instancia de Unity no está disponible.");
        }
    }

    function setVolumeSFX(volume) {
        if (sceneLoaded && typeof unityInstance !== 'undefined') {
            unityInstance.SendMessage('MusicControllerWebAPI', 'SetVolumeSFX', volume);
        } else {
            console.error("La instancia de Unity no está disponible.");
        }
    }
     // Inicializa los volúmenes si Unity está listo
     if (sceneLoaded) {
        setVolumeBackground(volumeBackground);
        setVolumeSFX(volumeSFX);
    } else {
        unityReadyCallbacks.push(() => setVolumeBackground(volumeBackground));
        unityReadyCallbacks.push(() => setVolumeSFX(volumeSFX));
    }

});
