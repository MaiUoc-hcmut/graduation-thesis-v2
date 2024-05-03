"use client"
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
    BasicStorage,
    ChatMessage,
    ChatProvider,
    Conversation,
    ConversationId,
    ConversationRole,
    IStorage,
    MessageContentType,
    Participant,
    Presence,
    TypingUsersList,
    UpdateState,
    User,
    UserStatus
} from "@chatscope/use-chat";
import { ExampleChatService } from "@chatscope/use-chat/dist/examples";
import Chat from "./chat";
import { nanoid } from "nanoid";
import { akaneModel, eliotModel, emilyModel, joeModel, users } from "./data";
import { AutoDraft } from "@chatscope/use-chat/dist/enums/AutoDraft";
import { useEffect } from "react";
import chatApi from "@/app/api/chatApi";
import { useAppSelector } from "@/redux/store";
import uuid from "react-uuid";

// sendMessage and addMessage methods can automagically generate id for messages and groups
// This allows you to omit doing this manually, but you need to provide a message generator
// The message id generator is a function that receives message and returns id for this message
// The group id generator is a function that returns string
const messageIdGenerator = (message: ChatMessage<MessageContentType>) => nanoid();
const groupIdGenerator = () => nanoid();

const akaneStorage = new BasicStorage({ groupIdGenerator, messageIdGenerator });
const eliotStorage = new BasicStorage({ groupIdGenerator, messageIdGenerator });
const emilyStorage = new BasicStorage({ groupIdGenerator, messageIdGenerator });
const joeStorage = new BasicStorage({ groupIdGenerator, messageIdGenerator });

// Create serviceFactory
const serviceFactory = (storage: IStorage, updateState: UpdateState) => {
    return new ExampleChatService(storage, updateState);
};



const chats = [
    { name: "Akane", storage: akaneStorage },
    { name: "Eliot", storage: eliotStorage },
    { name: "Emily", storage: emilyStorage },
    { name: "Joe", storage: joeStorage }
];


function createConversation(id: ConversationId, name: string): Conversation {

    return new Conversation({
        id,
        participants: [
            new Participant({
                id: name,
                role: new ConversationRole([])
            })
        ],
        unreadCounter: 0,
        typingUsers: new TypingUsersList({ items: [] }),
        draft: ""
    });
}

// Add users and conversations to the states
chats.forEach(c => {

    users.forEach(u => {
        if (u.name !== c.name) {
            c.storage.addUser(new User({
                id: u.name,
                presence: new Presence({ status: UserStatus.Available, description: "" }),
                firstName: "",
                lastName: "",
                username: u.name,
                email: "",
                avatar: u.avatar,
                bio: ""
            }));

            const conversationId = uuid();

            const myConversation = c.storage.getState().conversations.find(cv => typeof cv.participants.find(p => p.id === u.name) !== "undefined");
            if (!myConversation) {

                c.storage.addConversation(createConversation(conversationId, u.name));

                const chat = chats.find(chat => chat.name === u.name);

                if (chat) {

                    const hisConversation = chat.storage.getState().conversations.find(cv => typeof cv.participants.find(p => p.id === c.name) !== "undefined");
                    if (!hisConversation) {
                        chat.storage.addConversation(createConversation(conversationId, c.name));
                    }

                }

            }

        }
    });

});

export default function ChatBox({ params }: { params: { id: string } }) {
    useEffect(() => {
        chatApi.getMessageOfGroup(params.id, "1").then((res) => {
            console.log(res);
        }).catch((err) => { });
    }, []);
    const user = useAppSelector(state => state.authReducer.user);
    const eliot = new User({
        id: `${user.id}`,
        presence: new Presence({ status: UserStatus.Available, description: "" }),
        username: user.name,
        avatar: user.avatar ? user.avatar : "/images/avatar.png",
    });
    return (
        <div className="d-flex flex-divumn overflow-hidden">
            <div className="">
                <div className="flex-nowrap">
                    <div>
                        <ChatProvider serviceFactory={serviceFactory} storage={eliotStorage} config={{
                            typingThrottleTime: 250,
                            typingDebounceTime: 900,
                            debounceTyping: true,
                            autoDraft: AutoDraft.Save | AutoDraft.Restore
                        }}>
                            <Chat user={eliot} params={params} />
                        </ChatProvider>
                    </div>

                </div>

            </div>
        </div>
    );
}
