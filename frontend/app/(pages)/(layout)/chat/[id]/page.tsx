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
    UserId,
    UserStatus
} from "@chatscope/use-chat";
import { ExampleChatService } from "@chatscope/use-chat/dist/examples";
import Chat from "./chat";
import { nanoid } from "nanoid";
import { AutoDraft } from "@chatscope/use-chat/dist/enums/AutoDraft";
import { useEffect, useState } from "react";
import chatApi from "@/app/api/chatApi";
import { useAppSelector } from "@/redux/store";
import uuid from "react-uuid";

// sendMessage and addMessage methods can automagically generate id for messages and groups
// This allows you to omit doing this manually, but you need to provide a message generator
// The message id generator is a function that receives message and returns id for this message
// The group id generator is a function that returns string
const messageIdGenerator = (message: ChatMessage<MessageContentType>) => nanoid();
const groupIdGenerator = () => nanoid();

const userStorage = new BasicStorage({ groupIdGenerator, messageIdGenerator });


// Create serviceFactory
const serviceFactory = (storage: IStorage, updateState: UpdateState) => {
    return new ExampleChatService(storage, updateState);
};


function createConversation(id: ConversationId, id_user: UserId, name: string, type: string, userLast: any): Conversation {

    return new Conversation({
        id,
        participants: [
            new Participant({
                id: id_user,
                role: new ConversationRole([])
            })
        ],
        unreadCounter: 0,
        typingUsers: new TypingUsersList({ items: [] }),
        draft: "",
        data: {
            id_group: id,
            type: type,
            userLast: userLast
        }
    });
}

// Add users and conversations to the states
// chats.forEach(c => {
//     users.forEach(u => {
//         if (u.name !== c.name) {
//             c.storage.addUser(new User({
//                 id: u.name,
//                 presence: new Presence({ status: UserStatus.Available, description: "" }),
//                 firstName: "",
//                 lastName: "",
//                 username: u.name,
//                 email: "",
//                 avatar: u.avatar,
//                 bio: ""
//             }));

//             const conversationId = uuid();

//             const myConversation = c.storage.getState().conversations.find(cv => typeof cv.participants.find(p => p.id === u.name) !== "undefined");
//             if (!myConversation) {

//                 c.storage.addConversation(createConversation(conversationId, u.name));

//                 const chat = chats.find(chat => chat.name === u.name);

//                 if (chat) {

//                     const hisConversation = chat.storage.getState().conversations.find(cv => typeof cv.participants.find(p => p.id === c.name) !== "undefined");
//                     if (!hisConversation) {
//                         chat.storage.addConversation(createConversation(conversationId, c.name));
//                     }

//                 }

//             }

//         }
//     });
// });



export default function ChatBox({ params }: { params: { id: string } }) {
    // const [conversations, setConversations] = useState<any>([]);
    const [converStudent, setConverStudent] = useState<any>([]);
    const [converTeacher, setConverTeacher] = useState<any>([]);
    const [converGroup, setConverGroup] = useState<any>([]);
    const [change, setChange] = useState(false);

    const user = useAppSelector(state => state.authReducer.user);



    useEffect(() => {
        chatApi.getGroupOfUser().then((res: any) => {
            setConverStudent(res.data.student);
            setConverTeacher(res.data.teacher);
            setConverGroup(res.data.mix);
        }).catch((err) => { });
    }, [change]);


    converStudent?.forEach((c: any) => {

        userStorage.addUser(new User({
            id: c.friend.id,
            presence: new Presence({ status: UserStatus.Available, description: "" }),
            firstName: "",
            lastName: "",
            username: c.friend.name,
            email: "",
            avatar: c.friend.avatar,
            bio: ""
        }));
        userStorage.addConversation(createConversation(c.id, c.friend.id, c.friend.name, "student", {
            lastMessage: c.lastMessage,
            lastSenderId: c.lastSenderId,
            lastSenderName: c.lastSenderName
        }));
    });
    converTeacher?.forEach((c: any) => {

        userStorage.addUser(new User({
            id: c.friend.id,
            presence: new Presence({ status: UserStatus.Available, description: "" }),
            firstName: "",
            lastName: "",
            username: c.friend.name,
            email: "",
            avatar: c.friend.avatar,
            bio: ""
        }));
        userStorage.addConversation(createConversation(c.id, c.friend.id, c.friend.name, "teacher", {
            lastMessage: c.lastMessage,
            lastSenderId: c.lastSenderId,
            lastSenderName: c.lastSenderName
        }));
    });
    converGroup?.forEach((c: any) => {

        userStorage.addUser(new User({
            id: c.id,
            presence: new Presence({ status: UserStatus.Available, description: "" }),
            firstName: "",
            lastName: "",
            username: c.name,
            email: "",
            avatar: "/images/avatar-group.jpg",
            bio: ""
        }));
        userStorage.addConversation(createConversation(c.id, c.id, c.name, "group", {
            lastMessage: c.lastMessage,
            lastSenderId: c.lastSenderId,
            lastSenderName: c.lastSenderName
        }));
    });

    const userCurrent = new User({
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
                        <ChatProvider serviceFactory={serviceFactory} storage={userStorage} config={{
                            typingThrottleTime: 250,
                            typingDebounceTime: 900,
                            debounceTyping: true,
                            autoDraft: AutoDraft.Save | AutoDraft.Restore
                        }}>
                            <Chat user={userCurrent} params={params} change={change} setChange={setChange} />
                        </ChatProvider>
                    </div>

                </div>

            </div>
        </div>
    );
}
