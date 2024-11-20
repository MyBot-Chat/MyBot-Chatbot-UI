'use client'
import { useState } from "react";
import { fetchEventSource } from "@microsoft/fetch-event-source";
const chatbotId = "7e595d04-bc46-4fe6-99d6-340b82ab2c1e";
const apiKey = "d085fea1-61c2-4e76-a817-a46d7d9f040b";
const serverBaseURL = "http://localhost:5244/api/Training/StartTraining/" + chatbotId;

const Training = () => {
  const [data, setData] = useState("");
  const [running, setRunning] = useState(false);

  const addText = (str:string) => {
    setData((oldData:string) => {
      let newData = oldData + str + "\n";
      return newData;
    });
  };

  const fetchData = async () => {
    await fetchEventSource(serverBaseURL, {
      method: "GET",
      headers: {
        Accept: "text/event-stream",
        Authorization: "Bearer "+apiKey
      },
      async onopen(res) {
        if (res.ok && res.status === 200) {
          console.log("Connection made ", res);
          addText("Connection Open... ");
        } else if (
          res.status >= 400 &&
          res.status < 500 &&
          res.status !== 429
        ) {
          console.log("Client side error ", res);
        }
      },
      onmessage(msg) {
        if(msg.event === "status"){
          addText(msg.data);
        }else if(msg.event === "end"){
          addText("Training finished");
          setRunning(false);
        }else if(msg.event === "failed"){
          addText("Failed: " + msg.data);
        }
      },
      onclose() {
        console.log("Connection closed by the server");
        addText("Connection closed");
        setRunning(false);
      },
      onerror(err) {
        console.log("There was an error from server", err);
        addText("Error: " + err);
      },
    });
  }
  const StartTraining = () => {
    addText("Start training... ");
    setRunning(true);
    fetchData();
  }

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <div className="w-96">
        <div>
          <h3>Training Example Page</h3>
        </div>
        {running && <progress className="progress w-56"></progress>}
        <div>
          <textarea rows={10} className="w-full" value={data} readOnly />
        </div>
        <div>
          <button className="btn btn-primary" onClick={StartTraining}>Start Training</button>
        </div>
      </div>
    </div>
  );
};

export default Training;
