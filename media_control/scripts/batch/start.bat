@REM this startup script relies on Chrome being installed on the device

@REM forcefully terminate Chrome and any child processes
taskkill /F /IM chrome.exe /T > nul

@REM start Chrome fullscreen with unmuted autoplay allowed, and navigate to our page
start chrome.exe --autoplay-policy=no-user-gesture-required --start-fullscreen https://northeastern.event-media-control.com