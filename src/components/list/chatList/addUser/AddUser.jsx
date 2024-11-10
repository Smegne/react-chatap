import "./addUser.css";
import { db } from "../../../../lib/firebase";
import {
    collection,
    getDocs,
    query,
    serverTimestamp,
    setDoc,
    where,
    doc,
    updateDoc,
    arrayUnion,
} from "firebase/firestore";
import { useState } from "react";
import { useUserStore } from "../../../../lib/userStore";

const AddUser = () => {
    const [user, setUser] = useState(null);
    
    // Corrected this line by removing the extra parenthesis
    const { currentUser } = useUserStore(); 

    const handleSearch = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const username = formData.get("username");

        try {
            const userRef = collection(db, "users");
            const q = query(userRef, where("username", "==", username));
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
                setUser(querySnapshot.docs[0].data());
            } else {
                setUser(null); // Reset if not found
            }
        } catch (err) {
            console.log(err);
        }
    };

    const handleAdd = async () => {
        if (!user) return; // Ensure user is defined

        const chatRef = collection(db, "chats");
        const userChatsRef = collection(db, "userchats");
        try {
            // Create a new document in 'chats' with auto-generated ID
            const newChatRef = doc(chatRef); // Reference for new document
            await setDoc(newChatRef, {
                createdAt: serverTimestamp(),
                message: [],
            });

            await updateDoc(doc(userChatsRef, user.id), {
                chats: arrayUnion({
                    chatId: newChatRef.id,
                    lastMessage: "",
                    receiverId: currentUser.id,
                    updatedAt: Date.now(),
                }),
            });

            await updateDoc(doc(userChatsRef, currentUser.id), {
                chats: arrayUnion({
                    chatId: newChatRef.id,
                    lastMessage: "",
                    receiverId: user.id,
                    updatedAt: Date.now(),
                }),
            });

        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className='addUser'>
            <form onSubmit={handleSearch}>
                <input type="text" placeholder="Username" name="username" />
                <button>Search</button>
            </form>
            {user && (
                <div className="user">
                    <div className="detail">
                        <img src={user.avatar || "./avatar.png"} alt="" />
                        <span>{user.username}</span>
                    </div>
                    <button onClick={handleAdd}>Add User</button>
                </div>
            )}
        </div>
    );
};

export default AddUser;
