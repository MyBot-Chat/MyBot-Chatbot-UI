# MyBot-Chatbot-UI
Chat UI client for MyBotChat. This a working example of how to use API from MyBot to build a Chatbot that is powered by ChatGPT or Llama 3.

### Prerequisite
- Free Account at [MyBotChat](https://mybot.chat) => [Get Started with API](https://mybot.chat/documentation/api/api-get-started)
- NextJS 15


### Example
After running the App, you should be able to chat with your AI Chatbot that looks like screenshot below.

![Chatbot UI Demo](/public/img/chatbot-ui-demo.png)

### How to run
1. Clone the project to your local directory and run command: `npm install`
2. Create a new `.env` file and copy content from the `.env.example` file. 
3. Replace value of the `NEXT_PUBLIC_API_TOKEN` and `NEXT_PUBLIC_CHATBOT_ID` by your own.
4. Run command `npm run dev`
5. Visit `http://localhost:3000`

## Training Chatbot using API
MyBot.Chat has an API for training your chatbot. The API is implemented with Server Sent Event (SSE), which let client get realtime result without polling. Most programming language support SSE. Below are three examples of consuming SSE using javascript.

### 1. Training API with NextJS
Example of using API to train your chatbot is available in `/app/training-api`. This sample code is using `@microsoft/fetch-event-source` which is an implementation Server Sent Event (SSE) that support customer header; and this is a requirement to access training API.

```
'use client'
import { useState } from "react";
import { fetchEventSource } from "@microsoft/fetch-event-source";
const chatbotId = "--your-chatbotId--";
const apiKey = "--your-api-key--";
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

```
After running the App and access the url `http://localhost:3000/training-api` the result should look like screenshot below:
![Chatbot UI Demo](/public/img/nextjs-training.png)


### 2. Training API with custom javascript SSE
This example is using javascript implementation of SSE from [https://github.com/Yaffle/EventSource/](https://github.com/Yaffle/EventSource/)

The html code is available in `/public/training.html`, javascript lib is here `/public/js/eventsource.min.js`

```
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <title>EventSource example</title>
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <script src="/js/eventsource.min.js"></script>
    <script>
        
        const chatbotId = "--your-chatbotId--";
        const apiKey = "--your-api-key--";
        const url = "https://mybot.chat/api/Training/StartTraining/" + chatbotId;
        
        function Show(msg){
            var output = document.getElementById("output");
            output.value += msg + "\n";
        }

        function startTraining(){
            var output = document.getElementById("output");
            output.value = "Starting...\n";

            var es = new EventSourcePolyfill(url,{
                headers: {
                    'Authorization': 'Bearer ' + apiKey
                }
            });
        
            es.addEventListener("open", function(event){
                Show("Open connection");
            });
            es.addEventListener("status", function(event){
                Show("Status: "+ event.data);
            });

            es.addEventListener("end", function(event){
                Show("End of training");
                es.close();
            });

            es.addEventListener("error", function(err){
                Show("Error: " + err);
                es.close();
            });
        }
    </script>
</head>
<body>
    <h1>Training Chatbot Example</h1>
    <div>
        <textarea id="output" rows="10" cols="80"></textarea>
    </div>
    <div>
        <button id="btnStart" onclick="startTraining()">Start Training</button>
    </div>
</body>
</html>
```
After running the App and access the url `http://localhost:3000/training.html` the result should look like screenshot below:
![Chatbot UI Demo](/public/img/js-example.png)

### 3. Training API with JQuery plugin for SSE
This example is using JQuery plugin for SSE from [https://github.com/byjg/jquery-sse](https://github.com/byjg/jquery-sse)

The html code is available in `/public/training-jquery.html`, javascript lib is here `/public/js/jquery.sse.min.js`

```
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <title>EventSource example</title>
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.4/jquery.min.js"></script>
    <script src="/js/jquery.sse.min.js"></script>
    <script>
        
        const chatbotId = "--your-chatbotId--";
        const apiKey = "--your-api-key--";
        const url = "https://mybot.chat/api/Training/StartTraining/" + chatbotId;
        
        function Show(msg){
            var output = document.getElementById("output");
            output.value += msg + "\n";
        }

        function startTraining(){
            var output = document.getElementById("output");
            output.value = "Starting...\n";
            var w = $.SSE(url, {
                headers: {
                    'Authorization': 'Bearer '+apiKey
                },
                onOpen: function (e) {
                    console.log("Open");
                    console.log(e);
                    Show("Open connection");
                },
                onEnd: function (e) {
                    console.log("End");
                    console.log(e);
                    Show("End of connection");
                },
                onError: function (e) {
                    console.log("Could not connect");
                    Show("Error: "+e);
                },
                onMessage: function (e) {
                    console.log("Message");
                    console.log(e);
                },
                options: {
                    forceAjax: false
                },
                events: {
                    status: function (e) {
                        console.log('Custom Event');
                        console.log(e);
                        Show("Status: "+e.data);
                    },
                    end: function(e) {
                        console.log(e);
                        Show("End of training");
                        w.stop();
                    }
                }
            });
            w.start();
        }
    </script>
</head>
<body>
    <h1>Training Chatbot Example</h1>
    <div>
        <textarea id="output" rows="10" cols="80"></textarea>
    </div>
    <div>
        <button id="btnStart" onclick="startTraining()">Start Training</button>
    </div>
</body>
</html>
```

After running the App and access the url `http://localhost:3000/training-jquery.html` the result should look like screenshot below:
![Chatbot UI Demo](/public/img/jquery-example.png)

## Chatbot Management Dashboard
Dashboad for managing Chatbot using API.
Current Features:
- [x] Training Chatbot with Files
- [x] Training Chatbot with Q&A 
- [x] Console Page for testing Chatbot
- [x] Training Chatbot with Websites
- [x] ChatLog: for viewing chat history
- [ ] Lead: for viewing sale lead

![Chatbot Management](/public/img/chatbot-management.png)