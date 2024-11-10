import "./detail.css";
import { getAuth } from "firebase/auth"; // Import Firebase Auth
import { useUserStore } from "../../lib/userStore";
import { useChatStore } from "../../lib/chatStore";
import { arrayRemove, arrayUnion, updateDoc, doc } from "firebase/firestore";
import { db } from "../../lib/firebase";

const Detail = () => {
    const auth = getAuth(); // Initialize auth variable
    const {chatId,user,isCurrentUserBlocked,isRecieverBlocked,changeBlock}= useChatStore()


    const handleBlock =async() =>{
        if(!user) return;

        const userDocRef = doc(db,"users",currentUser.id)
        try {
            await updateDoc( userDocRef,{blocked: isRecieverBlocked ? arrayRemove(user.id):
                arrayUnion(user.id),
           
            })
            changeBlock()
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <div className='detail'>
            <div className="user">
                <img src={user?.avatar || "./avatar.png"} alt="" />
                <h2>{user?.username}</h2>
                <p>We are university students.</p>
            </div>
            <div className="info">
                <div className="option">
                    <div className="title">
                        <span>Chat Settings</span>
                        <img src="./arrowUp.png" alt="" />
                    </div>
                </div>

                <div className="option">
                    <div className="title">
                        <span>Chat Settings</span>
                        <img src="./arrowUp.png" alt="" />
                    </div>
                </div>

                <div className="option">
                    <div className="title">
                        <span>Privacy & Help</span>
                        <img src="./arrowUp.png" alt="" />
                    </div>
                </div>

                <div className="option">
                    <div className="title">
                        <span>Shared photos</span>
                        <img src="./arrowDown.png" alt="" className="icon" />
                    </div>

                    <div className="photos">
                        <div className="photoItem">
                            <div className="photoDetail">
                                <img src="photo_2024-10-25_03-40-06.jpg" alt="" />
                                <span>photo_2024_2.png </span>
                            </div>
                            <img src="download.png" alt="" className="icon" />
                        </div>
                        {/* Repeat for other photoItems */}
                    </div>
                </div>

                <div className="option">
                    <div className="title">
                        <span>Shared files</span>
                        <img src="./arrowUp.png" alt="" />
                    </div>
                </div>
                <button onClick={handleBlock}> {isCurrentUserBlocked ? "you are Blocked!":
                    isRecieverBlocked ? "User Blocked":"Block User"
}
                </button>
                <button className="logout" onClick={() => auth.signOut()}>Logout</button>
            </div>
        </div>
    );
}

export default Detail;
