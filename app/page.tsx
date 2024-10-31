// pages/index.js
import Chatbot from "../components/Chatbot";

export default function Home() {
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <Chatbot />
    </div>
  );
}
