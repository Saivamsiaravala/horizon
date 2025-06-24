import React, { useRef, useState, useEffect } from "react";
import record from "./../assets/record.png";
import camera from "./../assets/camera.png";
import multimedia from "./../assets/multimedia.png";
import { useNavigate } from "react-router-dom";
import play from "./../assets/play.png";
import pause from "./../assets/pause.png";
import download from "./../assets/download.png";
import remove from "./../assets/remove.png";

const VideoRecorder = () => {
  const navigate = useNavigate();
  const [isRecording, setIsRecording] = useState(false);
  const [url, setUrl] = useState("");
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  const mediaStream = useRef(null);
  const mediaRecorder = useRef(null);
  const chunks = useRef([]);
  const videoRef = useRef(null);
  const previewRef = useRef(null);
  const timerRef = useRef(null);

  const startRecording = async () => {
    setDuration(0);
    setCurrentTime(0);
    setIsRecording(true);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      mediaStream.current = stream;
      previewRef.current.srcObject = stream;

      mediaRecorder.current = new MediaRecorder(stream);
      mediaRecorder.current.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.current.push(e.data);
      };

      mediaRecorder.current.onstop = () => {
        const recordedBlob = new Blob(chunks.current, { type: "video/webm" });
        const url = URL.createObjectURL(recordedBlob);
        setUrl(url);
        chunks.current = [];
        clearInterval(timerRef.current);
        if (previewRef.current) {
          previewRef.current.srcObject = null;
        }
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.current.start();

      timerRef.current = setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);
    } catch (error) {
      console.error("Error accessing camera:", error);
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current) {
      mediaRecorder.current.stop();
    }
    setIsRecording(false);
  };

  const timeFormat = (duration) => {
    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration % 3600) / 60);
    const seconds = Math.floor(duration % 60);
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}:${String(seconds).padStart(2, "0")}`;
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleSeek = (e) => {
    videoRef.current.currentTime = e.target.value;
    setCurrentTime(e.target.value);
  };

  const removeAudio = () => {
    console.log("object");
    chunks.current = [];
    setDuration(0);
    setIsPlaying(false);
    setCurrentTime(0);
    setUrl("");
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateTime = () => setCurrentTime(video.currentTime);
    const handleEnded = () => setIsPlaying(false);

    video.addEventListener("timeupdate", updateTime);
    video.addEventListener("ended", handleEnded);

    return () => {
      video.removeEventListener("timeupdate", updateTime);
      video.removeEventListener("ended", handleEnded);
    };
  }, [url]);

  return (
    <div className="video">
      {/* <div>{url ? <></> : <>{isRecording ? <>preview</> : <>image</>}</>} </div> */}
      <div className="multimedia">
        {url ? (
          <div className="operation">
            <video
              ref={videoRef}
              src={url}
              controls={false}
              // style={{ width: "10rem", borderRadius: "10px" }}
            />
            {!isRecording ? (
              <div className="duration">
                <span>{timeFormat(isRecording ? duration : currentTime)}</span>
                <span>{timeFormat(duration)}</span>
              </div>
            ) : (
              <div className="recording">
                <span>{timeFormat(duration)}</span>
              </div>
            )}
            <input
              type="range"
              min={0}
              max={duration}
              value={currentTime}
              onChange={handleSeek}
              className="duration-bar"
            />
          </div>
        ) : isRecording ? (
          <div className="preview">
            <video
              ref={previewRef}
              autoPlay
              muted
              // style={{ width: "10rem", borderRadius: "10px" }}
            />
            <div className="recording">
              <span>{timeFormat(duration)}</span>
            </div>
          </div>
        ) : (
          <img src={multimedia} alt="" />
        )}
      </div>

      {url && (
        <div className="btns">
          <button className="btn" onClick={handlePlayPause}>
            {isPlaying ? (
              <img src={pause} alt="pause" />
            ) : (
              <img src={play} alt="play" />
            )}
          </button>
          <button className="btn" onClick={removeAudio}>
            <img src={remove} alt="" />
          </button>
          <a
            href={url}
            download="recording.mp3"
            target="_blank"
            className="btn"
          >
            <img src={download} alt="" />
          </a>
        </div>
      )}

      <div className="control">
        {!url && (
          <>
            {" "}
            {isRecording ? (
              <button className="record-btn" onClick={stopRecording}>
                <img src={record} alt="Stop" />
              </button>
            ) : (
              <button className="record-btn" onClick={startRecording}>
                <img src={camera} alt="Record" />
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default VideoRecorder;
