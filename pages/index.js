import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useMutation } from "react-query";
import { v4 as uuidv4 } from "uuid";
import FileUpload from "./fileUpload";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [sessionId] = useState(uuidv4());

  const currDate = new Date().toLocaleDateString();
  const currTime = new Date().toLocaleTimeString();

  const handleFileContent = (content) => {
    // Do something with the file content, like setting a state
    // For example, you might want to send this content in a chat message
    setMessage(content);
  };

  const sendChat = async (message) => {
    const { data } = await axios.post("/api/chat", {
      prompt: message,
      sessionId: sessionId,
    });
    return data.response;
  };

  const mutation = useMutation(sendChat);

  const bottomRef = useRef();

  useEffect(() => {
    bottomRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessages((prev) => [
      ...prev,
      { message: message, response: "Loading...", botResponse: false },
    ]);
    setMessage("");
    const response = await mutation.mutateAsync(message);
    setMessages((prev) => [
      ...prev.slice(0, prev.length - 1),
      { message: message, response: response, botResponse: true },
    ]);
  };

  return (

<div className="bg-[url('/bg.png')] 	background-size: auto;">
    <div className="container h-screen flex flex-col bg-white text-gray-900 px-20 mx-auto bg-scroll ">
      <h1 className="text-6xl font-bold pt-10">TacoBot - 3000</h1>
      <div className="flex flex-col flex-1 w-full mt-6 overflow-auto pb-10">
        {messages.map((message, index) => (
          <div key={index} className="w-full my-2">
            <p>{currDate} - {currTime} </p>
            <div className="p-2 border-2 rounded-lg text-black border-yellow-300 bg-yellow-100">
              {message.message}
            </div>
            <div className="p-2 border-2 bg-lime-100 border-lime-300 rounded-lg text-black mt-1 whitespace-pre-wrap">
              {message.response.content}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <form
        onSubmit={handleSubmit}
        className="w-full py-5 flex items-center justify-center"
      >

        <div className="p-10">
          <div className="App">
            <FileUpload onFileContent={handleFileContent} />
          </div>
        </div>

        <textarea
          className="border border-gray-300 rounded-lg"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={2}    // Specifies the number of visible text lines
          cols={150}    // Specifies the width of the textarea in characters
          placeholder="Add your text"   // Specifies a short hint that describes the expected value of the textarea
          wrap="soft"   // Specifies how the text in the textarea should be wrapped
          readOnly={false}   // Specifies that the textarea is read-only, meaning the user cannot modify its content
          name="name"   // Specifies the name of the textarea, which can be used when submitting a form
          disabled={false}   //  Specifies that the textarea is disabled, meaning the user cannot interact with it
        />

        <button
          type="submit"
          className="w-1/4 ml-2 p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-transparent"
        >
          Send
        </button>
      </form>
    </div>
    </div>
  );
}