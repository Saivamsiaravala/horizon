# Horizon AV

**Audio and Video Recorder**

**Audio Recorder Component**
State for recording, url,playing, duration, currentTime (for seek)
Ref for Stream, recording, chunks(stream), audioRef,timerRef

startRecording function to initiate duration, setRecording to true,requests access to microphone using navigator.getUserMedia, get blob data using chunks and converts the blob data to url

startRecording function to setRecording to false, to stop track

timeFormat to format time in HH:MM:SS format

handleSeek, handlePlayPause handles the manual play of the audio

removeAudio removes all the data setup during startRecording

useEffect listens for audio timeupdate events to update current playback time and returns a cleanup function

download option enables user to download the recorded audio file

**Video Recorder Component**

startRecording to gets access to camera/mic via getUserMedia, sets previewRef, starts Mediarecorder and saves chunks and starts duration timer

stopRecording stops the recording, sets Duration to 0 and generates blob and url 

handlePlayPause to handle the user input over the video

removeVideo resets all the refs and state to initial values

useEffect tracks playbacktime and returns cleanup funciton

Includes react-router-dom package to navigate between audio and video (can be simplified using simple state and ternary operator but i chose router to do the same)

handleToggle to toggle between Audio recording mode to Video recording mode

<Outlet /> from react-router-dom to render the page

Styled using SCSS










