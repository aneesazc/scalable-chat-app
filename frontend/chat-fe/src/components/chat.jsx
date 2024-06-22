"use client";
import { useAuthStore } from "@/zustand/useAuthStore";
import { useUsersStore } from "@/zustand/useUsersStore";
import axios from "axios";
import { useEffect, useState } from "react";
import io from "socket.io-client";
import ChatUsers from "./chatUsers";
import { useChatReceiverStore } from "@/zustand/useChatReceiverStore";
import { useChatMsgsStore } from "@/zustand/useChatMsgsStore";

const Chat = () => {
  const [msg, setMsg] = useState("");
  // const [msgs, setMsgs] = useState([]);
  const [socket, setSocket] = useState(null);
  const { authName } = useAuthStore();
  const { updateUsers } = useUsersStore();
  const { chatReceiver } = useChatReceiverStore();
  const { chatMsgs, updateChatMsgs } = useChatMsgsStore();

  const getUserData = async () => {
    const res = await axios.get("http://localhost:5000/users", {
      withCredentials: true,
    });
    updateUsers(res.data);
  };

  useEffect(() => {
    const s = io("http://localhost:8080", {
      query: {
        username: authName,
      },
    });
    setSocket(s);

    // Listen for messages
    s.on("chat msg", (msg) => {
      updateChatMsgs([...chatMsgs, msg]);
      // setMsgs((prevMsgs) => [
      //   ...prevMsgs,
      //   { text: msg.text, sentByCurrUser: false },
      // ]);
    });

    getUserData();
    return () => s.disconnect();
  }, []);

  const sendMsg = (e) => {
    e.preventDefault();
    const msgToBeSent = {
      text: msg,
      sender: authName,
      receiver: chatReceiver,
    };
    if (socket) {
      socket.emit("chat msg", msgToBeSent);
      updateChatMsgs([...chatMsgs, msgToBeSent]);
      // setMsgs((prevMsgs) => [...prevMsgs, { text: msg, sentByCurrUser: true }]);
      setMsg("");
    }
  };

  return (
    <div className="h-screen flex divide-x-4">
      <div className="w-1/5">
        <ChatUsers />
      </div>
      <div className="w-4/5 flex flex-col">
        <div>
          <h3>
            {authName} is chatting with {chatReceiver}
          </h3>
        </div>
        <div className="msgs-container h-4/5 overflow-scroll">
          {chatMsgs?.map((msg, index) => (
            <div
              key={index}
              className={`m-3 p-1 ${
                msg.sender === authName ? "text-right" : "text-left"
              }`}
            >
              <span
                className={`p-2 rounded-2xl ${
                  msg.sender === authName ? "bg-blue-200" : "bg-green-200"
                }`}
              >
                {msg.text}
              </span>
            </div>
          ))}
        </div>
        <div className="h-1/5 flex items-center justify-center">
          <form onSubmit={sendMsg} className="w-1/2">
            <div className="relative">
              <input
                type="text"
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                placeholder="Type your text here"
                required
                className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
              <button
                type="submit"
                className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Send
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat;
