// ✅ Initialize Firebase using Firebase 8 syntax (no import/export needed)
const firebaseConfig = {
    apiKey: "AIzaSyD905fp3RJppTtSBamEp1vVX_lhgYffIsw",
    authDomain: "testing-e4a6d.firebaseapp.com",
    projectId: "testing-e4a6d",
    storageBucket: "testing-e4a6d.appspot.com",
    messagingSenderId: "730001380225",
    appId: "1:730001380225:web:5a22a4cd080ede067d8e80",
    measurementId: "G-XQ0F3X4DR4"
  };
  
  // ✅ Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();
  
  // ✅ Get references to HTML elements
  const messageInput = document.getElementById("messageInput");
  const sendButton = document.getElementById("sendButton");
  const messagesContainer = document.getElementById("messagesContainer");
  
  // ✅ Function to send a message
  function sendMessage() {
    const text = messageInput.value.trim();
    if (text === "") return;
  
    db.collection("messages").add({
      text: text,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    }).then(() => {
      messageInput.value = ""; // Clear input after sending
    }).catch((error) => {
      console.error("Error sending message:", error);
    });
  }
  
  // ✅ Function to delete a message
  function deleteMessage(id) {
    db.collection("messages").doc(id).delete().catch((error) => {
      console.error("Error deleting message:", error);
    });
  }
  
  // ✅ Listen for real-time updates and display messages
  db.collection("messages").orderBy("timestamp").onSnapshot((snapshot) => {
    messagesContainer.innerHTML = ""; // Clear messages before reloading them
    snapshot.forEach((doc) => {
      const messageData = doc.data();
      const messageElement = document.createElement("div");
  
      // Create message content
      const textElement = document.createElement("p");
      textElement.textContent = messageData.text;
  
      // Create delete button
      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete";
      deleteButton.addEventListener("click", () => deleteMessage(doc.id));
  
      // Append elements
      messageElement.appendChild(textElement);
      messageElement.appendChild(deleteButton);
      messagesContainer.appendChild(messageElement);
    });
  });
  
  // ✅ Attach event listener to send button
  sendButton.addEventListener("click", sendMessage);
  