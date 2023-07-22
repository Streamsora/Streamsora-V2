import io from "socket.io-client";
import { useEffect, useState } from "react";
import VideoPlayerTest from "../../components/test/videoPlayer";

const socket = io.connect("http://localhost:3002");

export default function Test() {
  const [message, setMessage] = useState("");
  const [room, setRoom] = useState("");
  const [messageRecieved, setMessageRecieved] = useState([]);
  const [watchData, setWatchData] = useState({
    isPlay: false,
    room: "",
    time: null,
  });
  const [isPlay, setIsPlay] = useState(false);

  console.log(isPlay);

  const sendMessage = () => {
    socket.emit("chat message", message);
  };

  const joinRoom = () => {
    if (room !== "") {
      socket.emit("join_room", room);
    }
  };

  console.log(watchData);

  useEffect(() => {
    socket.on("recieved_message", (data) => {
      let dataRecieved = [...messageRecieved];
      dataRecieved.push(data);

      setMessageRecieved(dataRecieved);
    });

    socket.on("play_video", (data) => {
      // console.log();
      const get = JSON.parse(data);
      setWatchData(get);
      setIsPlay(true);
    });

    socket.on("pause_video", (data) => {
      const get = JSON.parse(data);
      setWatchData(get);
      setIsPlay(false);
    });

    socket.on("user_joined", (data) => {
      alert("User joined room: " + data);
    });
  }, [socket]);

  // console.log(messageRecieved);

  return (
    <div className="flex-center flex-col w-screen h-screen">
      <div className="w-[30%] flex gap-5">
        <input
          placeholder="Type message..."
          onChange={(e) => setRoom(e.target.value)}
        />
        <button onClick={joinRoom}>Send Message</button>
        <p>Message recieved: {messageRecieved}</p>
      </div>
      <div className="h-auto w-screen aspect-video bg-black">
        <VideoPlayerTest
          socket={socket}
          isPlay={isPlay}
          watchData={watchData}
        />
      </div>
    </div>
  );
}
