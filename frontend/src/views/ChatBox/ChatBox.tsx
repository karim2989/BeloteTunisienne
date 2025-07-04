import { useEffect, useState, type ReactNode } from "react";
import "./ChatBox.css"
import { ExternalHooks, RequestMessage } from "../../client";

class Message {
    public sender: string = "";
    public message: string = "";
    constructor(sender: string, message: string) {
        this.sender = sender;
        this.message = message;
    }
}

export default function ChatBox(): ReactNode {
    const [messages, setMessages] = useState<Message[]>();
    useEffect(() => {
        ExternalHooks.OnMessageRecived.push((sender, message) => {
            let x = []
            messages?.forEach(e => x.push(e));
            x.push(new Message(sender, message))
            setMessages(x);
        })
    })

    return (
        <div className="chatbox">
            <div className="flexfiller">
                <div className="chatboxMessagesContainer">
                    <div>
                        {messages?.map((m, index) => (
                            <div key={index}><span className="messageSender">{m.sender}: </span> <span className="messageText">{m.message}</span></div>
                        ))}
                    </div>
                </div>
            </div>
            <form className="chatboxMessageForm" onSubmit={(e) => {
                e.preventDefault();
                ///@ts-expect-error
                let message = e.target.messageBoxTextField.value;
                RequestMessage(message);
            }}>
                <input type="text" className="messageBoxTextField" placeholder="type message here" name="messageBoxTextField" id="messageBoxTextField" />
                <input type="submit" className="messageBoxSendButton" value="Send" />
            </form>
        </div>
    )
}