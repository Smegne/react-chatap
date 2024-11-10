import { useEffect, useState } from "react";
import "./chatList.css";
import AddUser from "./addUser/AddUser";
import { useUserStore } from '../../../lib/userStore'; 
import { onSnapshot, doc, getDoc, updateDoc } from "firebase/firestore";  // Make sure updateDoc is imported
import { db } from '../../../lib/firebase';
import { useChatStore } from "../../../lib/chatStore";

const ChatList = () => {
    const [chats, setChats] = useState([]);
    const [addMode, setAddMode] = useState(false);
    const { currentUser } = useUserStore(); 
    const { chatId, changeChat } = useChatStore(); 
    console.log(chatId);

    useEffect(() => {
        if (!currentUser) return; // Check if currentUser is defined

        const unSub = onSnapshot(doc(db, "userchats", currentUser.id), async (res) => {
            const items = res.data().chats;
            const promises = items.map(async (item) => { // Use 'item' for clarity
                const userDocRef = doc(db, "users", item.receiverId);
                const userDocSnap = await getDoc(userDocRef);
                const user = userDocSnap.data();

                return { ...item, user }; // Return the merged object
            });

            const chatData = await Promise.all(promises);
            setChats(chatData.sort((a, b) => b.updatedAt - a.updatedAt));
        });

        return () => {
            unSub();
        };
    }, [currentUser]);

    const handleSelect = async (chat) => {
        // Process the chats and mark as seen
        const userChats = chats.map((item) => {
            const { user, ...rest } = item; // Destructure to exclude 'user'
            return rest;
        });

        const chatIndex = userChats.findIndex(
            (item) => item.chatId === chat.chatId
        );

        if (chatIndex !== -1) {
            userChats[chatIndex].isSeen = true; // Mark the message as seen
        }

        const userChatsRef = doc(db, "userchats", currentUser.id);

        try {
            // Now correctly use `updateDoc` to update the Firestore document
            await updateDoc(userChatsRef, {
                chats: userChats,
            });

            changeChat(chat.chatId, chat.user); // Change chat state after updating the document
        } catch (err) {
            console.log("Error updating user chats: ", err);
        }
    };

    return (
        <div className='chatList'>
            <div className="search">
                <div className="searchBar">
                    <img src="./search.png" alt="" />
                    <input type="text" placeholder="Search" />
                </div>
                <img 
                    src={addMode ? "./minus.png" : "./plus.png"} 
                    alt="" 
                    className="add"
                    onClick={() => setAddMode((prev) => !prev)} 
                />
            </div>

            {chats && chats.map((chat, index) => (
                <div 
                    className="item" 
                    key={chat.chatId} 
                    onClick={() => handleSelect(chat)} 
                    style={{
                        backgroundColor: chat?.isSeen ? "transparent" : "#5183fe",
                    }}
                >
                    <img src={chat.user?.avatar || "./avatar.png"} alt="" /> {/* Display user avatar */}
                    <div className="texts">
                        <span>{chat.user?.username || "Unknown User"}</span> {/* Display username */}
                        <p>{chat.lastMessage || "No messages"}</p> {/* Display last message */}
                    </div>
                </div>
            ))}

            {addMode && <AddUser />} {/* Conditional rendering for AddUser component */}
        </div>
    );
};

export default ChatList;
