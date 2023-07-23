import io from "socket.io-client";
import { useEffect, useState } from "react";
import VideoPlayerTest from "../../components/test/videoPlayer";

const socket = io.connect("https://sc.moopa.live");

export default function Test({ roomId }) {
  const [message, setMessage] = useState("");
  // const [room, setRoom] = useState("");
  const [messageRecieved, setMessageRecieved] = useState([]);
  const [watchData, setWatchData] = useState({
    isPlay: false,
    room: "",
    time: null,
  });
  const [isPlay, setIsPlay] = useState(false);

  console.log(isPlay);

  const joinRoom = (props) => {
    // setRoom(props);
    if (roomId !== "") {
      socket.emit("join room", roomId);
    }
  };

  useEffect(() => {
    if (roomId) {
      socket.emit("join room", roomId);
    }
  }, [roomId]);

  console.log(roomId);

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
          room={roomId}
        />
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const { id } = context.query;

  if (!id) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      roomId: id,
    },
  };
}
