import './App.css';
import io from "socket.io-client";
import "react-chat-elements/dist/main.css";
import { MessageBox, ChatItem} from "react-chat-elements";

import {useState, useEffect, useRef} from 'react';

const App = () => {
  const socket = useRef(null);
  const [display, setDisplay] = useState([]);
  const [text, setText] = useState("");
  const [name, setName] = useState("Anonymous");

  const addMessage = (message) => {
    let cur = display.slice();
    cur.reverse();
    cur.push(<p className = "font">{message}</p>)
    cur.reverse();
    setDisplay(cur);
  }

  useEffect(() => {
    let inputName = prompt("Who is this?", "Anonymous");
    if (!(name == null || name == "")) {
      setName(inputName);
    }
    socket.current = io.connect("http://localhost:3006/");
    return () => {
      socket.current.disconnect(); 
    }
  }, []);

  useEffect(() => {
    socket.current.on('receiveMessage', (message) => {
      console.log(message);
      addMessage(message);
    });
    return () => {
      socket.current.off('receiveMessage');
    }
  }, [display]);

  return (
    <div className = "container">
      <div className="App">
        <div className = "messages">
          {display}
        </div>
        <div className = "bar">
          <textarea value = {text} type = "input" className = "nohover" onChange = {(e) => {setText(e.target.value)}}/>
          <button className = "btn" onClick = {() => {
            if (text !== "") {
              socket.current.emit('sendMessage', name + ": " + text);
              addMessage(name + ": " + text);
              setText("");
            }
          }}> Send </button>
        </div>
      </div>
    </div>
  );
}

export default App;
