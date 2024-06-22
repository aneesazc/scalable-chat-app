import { useAuthStore } from "@/zustand/useAuthStore";
import { useChatMsgsStore } from "@/zustand/useChatMsgsStore";
import { useChatReceiverStore } from "@/zustand/useChatReceiverStore";
import { useUsersStore } from "@/zustand/useUsersStore";
import axios from "axios";
import React, { useEffect } from "react";

const ChatUsers = () => {
  const { users } = useUsersStore();
  const { authName } = useAuthStore();
  const { chatReceiver, updateChatReceiver } = useChatReceiverStore();
  const { updateChatMsgs } = useChatMsgsStore();

  const setChatReceiver = (user) => {
    // console.log(user.username);
    updateChatReceiver(user.username);
  };

  useEffect(() => {
    console.log("Sender: " + authName + " Receiver: " + chatReceiver);
    const getMsgs = async () => {
      const res = await axios.get(
        "http://localhost:8080/msgs",
        {
          params: {
            sender: authName,
            receiver: chatReceiver,
          },
        },
        {
          withCredentials: true,
        }
      );
      if (res.data.length !== 0) {
        updateChatMsgs(res.data);
      } else {
        updateChatMsgs([]);
      }
    };
    if (chatReceiver) {
      getMsgs();
    }
  }, [chatReceiver]);

  return (
    <div>
      {users.map((user, index) => (
        //   console.log(user),
        <div
          key={index}
          className="bg-slate-400 rounded-xl m-3 p-5 cursor-pointer"
          onClick={() => setChatReceiver(user)}
        >
          {user.username}
        </div>
      ))}
    </div>
  );
};

export default ChatUsers;
