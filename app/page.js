import ChatWidget from "./components/ChatWidget";

export default function Home() {
  return (
    <main className="standalone-chat-wrapper">
      <ChatWidget standalone={true} />
    </main>
  );
}

