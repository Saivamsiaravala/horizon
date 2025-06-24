import React, { useRef, useState, useEffect } from "react";
import mic from "./../assets/mic.png";
import record from "./../assets/record.png";
import { useNavigate } from "react-router-dom";
// import "./AudioRecorder.css";
import play from "./../assets/play.png";
import pause from "./../assets/pause.png";
import download from "./../assets/download.png";
import headphone from "./../assets/headphone.png";
import remove from "./../assets/remove.png";

const AudioRecorder = () => {
  const navigate = useNavigate();
  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const [url, setUrl] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  const mediaStream = useRef(null);
  const mediaRecording = useRef(null);
  const chunks = useRef([]);
  const audioRef = useRef(null);
  const timerRef = useRef(null);

  const startRecording = async () => {
    setIsRecording(true);
    try {
      setDuration(0);
      setCurrentTime(0);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStream.current = stream;
      mediaRecording.current = new MediaRecorder(stream);

      mediaRecording.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.current.push(e.data);
        }
      };

      timerRef.current = setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);

      mediaRecording.current.onstop = () => {
        const recordedBlob = new Blob(chunks.current, { type: "audio/mp3" });
        const url = URL.createObjectURL(recordedBlob);
        setUrl(url);
        chunks.current = [];
        clearInterval(timerRef.current);
      };

      mediaRecording.current.start();
    } catch (error) {
      console.error(error);
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    if (mediaRecording.current) {
      mediaRecording.current.stop();
      mediaStream.current.getTracks().forEach((track) => track.stop());
    }
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

  const handleSeek = (e) => {
    audioRef.current.currentTime = e.target.value;
    setCurrentTime(e.target.value);
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const removeAudio = () => {
    setUrl("");
    setDuration(0);
    setCurrentTime(0);
    setIsPlaying(false);
    chunks.current = [];
  };
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => {
      setCurrentTime(audio.currentTime);
    };

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("ended", () => setIsPlaying(false));

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
    };
  }, [url]);

  return (
    <div className="audio">
      <div className="content">
        <div className="headphone">
          <img src={headphone} alt="Audio" />
        </div>
        {url ? (
          <div className="duration">
            <span>{timeFormat(isRecording ? duration : currentTime)}</span>
            <span>{timeFormat(duration)}</span>
          </div>
        ) : (
          <div className="recording">
            {/* <span>{timeFormat(isRecording ? duration : currentTime)}</span> */}
            <span>{timeFormat(duration)}</span>
          </div>
        )}
        {url && (
          <div className="operation">
            <input
              type="range"
              min={0}
              max={duration}
              value={currentTime}
              onChange={handleSeek}
              className="duration-bar"
            />
            <audio ref={audioRef} src={url} style={{ display: "none" }} />
          </div>
        )}
      </div>

      {url ? (
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
      ) : (
        <div className="control">
          {!url && (
            <>
              {isRecording ? (
                <button className="control-btn" onClick={stopRecording}>
                  <img src={record} alt="Stop" />
                </button>
              ) : (
                <button className="control-btn" onClick={startRecording}>
                  <img src={mic} alt="Record" />
                </button>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default AudioRecorder;
