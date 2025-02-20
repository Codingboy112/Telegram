import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
    getFirestore, collection, addDoc, onSnapshot, query, orderBy, deleteDoc, doc 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyD905fp3RJppTtSBamEp1vVX_lhgYffIsw",
    authDomain: "testing-e4a6d.firebaseapp.com",
    projectId: "testing-e4a6d",
    storageBucket: "testing-e4a6d.appspot.com",
    messagingSenderId: "730001380225",
    appId: "1:730001380225:web:5a22a4cd080ede067d8e80"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const usernameInput = document.getElementById("usernameInput");
const messageInput = document.getElementById("messageInput");
const sendButton = document.getElementById("sendButton");
const messagesContainer = document.getElementById("messagesContainer");

// Function to send a message
async function sendMessage() {
    const username = usernameInput.value.trim();
    const text = messageInput.value.trim();
    if (!username || !text) return;

    await addDoc(collection(db, "messages"), {
        username: username,
        text: text,
        timestamp: new Date()
    });

    messageInput.value = "";
}

// Function to delete a message
window.deleteMessage = async function (id) { // Expose globally
    await deleteDoc(doc(db, "messages", id));
}

// Listen for real-time updates
const messagesQuery = query(collection(db, "messages"), orderBy("timestamp"));
onSnapshot(messagesQuery, (snapshot) => {
    messagesContainer.innerHTML = "";
    snapshot.forEach((doc) => {
        const messageData = doc.data();
        const messageElement = document.createElement("div");
        messageElement.classList.add("message");

        let messageContent = `<strong>${messageData.username}:</strong> ${messageData.text}`;

        // If the message is an image URL, display it as an image
        if (messageData.text.match(/\.(jpeg|jpg|gif|png|webp)$/i)) {
            messageContent = `<strong>${messageData.username}:</strong><br><img src="${messageData.text}" alt="Image" class="chat-image">`;
        }

        messageElement.innerHTML = `
            ${messageContent}
            <button class="delete-btn" onclick="deleteMessage('${doc.id}')">❌</button>
        `;
        messagesContainer.appendChild(messageElement);
    });
});

sendButton.addEventListener("click", sendMessage);
