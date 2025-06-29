import { useState } from "react";
import { ExternalHooks, RequestMessage } from "../../Client";

export default function Chatbox() {
    const [messages, setMessages] = useState<string[]>([]);

    ExternalHooks.OnMessage = (id, message) => setMessages([...messages, id.toString(16) + ': ' + message]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // @ts-expect-error
        let message = e.target.message.value.trim()
        RequestMessage(message);
        //@ts-expect-error
        e.target.message.value = ""
    };

    return (
        <div className="chat-box">
            <div className="chat-messages">
                {messages.map((message, index) => (
                    <div key={index}>
                        {message}
                    </div>
                ))}
            </div>
            <form onSubmit={handleSubmit} >
                <input
                    type="text"
                    name="message"
                    placeholder="Type a message..." />
                <button type="submit" >
                    Send
                </button>
            </form>
        </div>
    );
};
