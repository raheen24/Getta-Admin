import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { store } from "../../redux";
import io from "socket.io-client";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CButton,
  CSpinner,
  CFormTextarea,
  CInputGroup,
  CFormInput,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import {
  cilArrowLeft,
  cilSend,
  cilChatBubble,
  cilPaperclip,
  cilX,
} from "@coreui/icons";

import { apiHelper } from "../../services";
import { toast } from "react-toastify";

const DisputeChat = () => {
  const { driverId } = useParams();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);
  const [loading, setLoading] = useState(true);
  const [dispute, setDispute] = useState(null);
  const [chatMessage, setChatMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const [messagesLoaded, setMessagesLoaded] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    fetchDisputeData();
    setMessagesLoaded(false);
  }, [driverId]);

  useEffect(() => {
    if (dispute && user && !messagesLoaded) {
      fetchChatMessages();
    }
  }, [dispute, user, messagesLoaded]);

  useEffect(() => {
    if (dispute && user) {
      const token = store.getState().user.token;
      const newSocket = io("https://client1.appsstaging.com:3017", {
        query: {
          token: token,
        },
      });
      setSocket(newSocket);

      newSocket.on("connect", () => {
        console.log("Connected to socket");
        newSocket.emit("join", { disputeId: dispute._id });
        console.log("Joined room:", dispute._id);
        const requestData = {
          senderId: user.userId,
          receiverId: dispute.userId._id,
        };
        console.log("Emitting get-messages on connect:", requestData);
        newSocket.emit("get-messages", requestData);
      });

      newSocket.on("connect_error", (error) => {
        console.error("Socket connection error:", error);
        toast.error("Failed to connect to chat server");
      });

      newSocket.on("disconnect", () => {
        console.log("Disconnected from socket");
      });

      newSocket.on("send-chat", (response) => {
        console.log("Received send-chat response:", response);
        if (response.code === 200 && response.status === 1 && response.data) {
          const sentMessage = response.data;
          const formattedMessage = {
            sender: sentMessage.senderId._id === user.userId ? "admin" : "user",
            text: sentMessage.message,
            time: new Date(sentMessage.createdAt).toLocaleTimeString(),
          };
          setChatMessages((prevMessages) => [...prevMessages, formattedMessage]);
          toast.success("Message sent successfully");
        } else {
          toast.error(response.message || "Failed to send message");
        }
      });

      newSocket.on("message", (data) => {
        console.log("Received message event:", data);
        if (data.code !== undefined) {
          if (data.code === 200 && data.status === 1) {
            toast.success("Message sent successfully");
          } else {
            toast.error(data.message || "Failed to send message");
          }
        } else {
          if (data && data.senderId && data.message) {
            const formattedMessage = {
              sender: data.senderId._id === user.userId ? "admin" : "user",
              text: data.message,
              time: new Date(data.createdAt || Date.now()).toLocaleTimeString(),
            };
            setChatMessages((prevMessages) => [
              ...prevMessages,
              formattedMessage,
            ]);
          }
        }
      });

      newSocket.on("sendMessage", (response) => {
        console.log("Received sendMessage response:", response);
        if (response.code === 200 && response.status === 1) {
          toast.success("Message sent successfully");
        } else {
          toast.error(response.message || "Failed to send message");
        }
      });

      newSocket.on("response", (data) => {
        console.log("Received getMessage event:", data);
        if (data.senderId && data.message) {
          const formattedMessage = {
            sender: data.senderId._id === user.userId ? "admin" : "user",
            text: data.message,
            time: new Date(data.createdAt || Date.now()).toLocaleTimeString(),
          };
          setChatMessages((prevMessages) => [
            ...prevMessages,
            formattedMessage,
          ]);
        } else if (
          data.code === 200 &&
          data.status === 1 &&
          data.data?.chats
        ) {
          const formattedChats = data.data.chats
            .map((chat) => ({
              sender: chat.senderId._id === user.userId ? "admin" : "user",
              text: chat.message,
              time: new Date(chat.createdAt).toLocaleTimeString(),
              timestamp: new Date(chat.createdAt).getTime(),
            }))
            .sort((a, b) => a.timestamp - b.timestamp);
          setChatMessages(formattedChats);
          setMessagesLoaded(true);
        } else {
          console.error("Failed to get chat messages:", data.message);
        }
      });

      newSocket.on("get-messages", (data) => {
        console.log("Received get-messages event:", data);
        if (data.senderId && data.message) {
          console.log("Processing new message:", data);
          const formattedMessage = {
            sender: data.senderId._id === user.userId ? "admin" : "user",
            text: data.message,
            time: new Date(data.createdAt || Date.now()).toLocaleTimeString(),
          };
          console.log("Formatted message:", formattedMessage);
          setChatMessages((prevMessages) => [
            ...prevMessages,
            formattedMessage,
          ]);
        } else if (data.code === 200 && data.status === 1 && data.data?.chats) {
          console.log("Processing bulk messages:", data.data.chats);
          const formattedChats = data.data.chats
            .map((chat) => ({
              sender: chat.senderId._id === user.userId ? "admin" : "user",
              text: chat.message,
              time: new Date(chat.createdAt).toLocaleTimeString(),
              timestamp: new Date(chat.createdAt).getTime(),
            }))
            .sort((a, b) => a.timestamp - b.timestamp);
          console.log("Setting chat messages:", formattedChats);
          setChatMessages(formattedChats);
          setMessagesLoaded(true);
        } else {
          console.error("Failed to get chat messages:", data.message);
        }
      });

      newSocket.on("newMessage", (newMessage) => {
        console.log("Received new message:", newMessage);
        if (newMessage && newMessage.senderId && newMessage.message) {
          const formattedMessage = {
            sender: newMessage.senderId._id === user.userId ? "admin" : "user",
            text: newMessage.message,
            time: new Date(
              newMessage.createdAt || Date.now()
            ).toLocaleTimeString(),
          };
          setChatMessages((prevMessages) => [
            ...prevMessages,
            formattedMessage,
          ]);
        }
      });

      newSocket.on("chat", (newMessage) => {
        console.log("Received chat message:", newMessage);
        if (newMessage && newMessage.senderId && newMessage.message) {
          const formattedMessage = {
            sender: newMessage.senderId._id === user.userId ? "admin" : "user",
            text: newMessage.message,
            time: new Date(
              newMessage.createdAt || Date.now()
            ).toLocaleTimeString(),
          };
          setChatMessages((prevMessages) => [
            ...prevMessages,
            formattedMessage,
          ]);
        }
      });

      return () => {
        newSocket.disconnect();
      };
    }
  }, [dispute, user]);

  const fetchDisputeData = async () => {
    if (!driverId) return;

    try {
      setLoading(true);
      const { response, error } = await apiHelper(
        "GET",
        `admin/get-disputes?page=1&limit=100`
      );

      if (response?.data?.status === 1) {
        // Find dispute by driver ID
        const disputeData = response.data.data.disputes.find(
          (d) => d.driverId?._id === driverId
        );
        if (disputeData) {
          setDispute(disputeData);
          // Chat messages will be loaded via HTTP
        } else {
          toast.error("Dispute not found for this driver.");
          navigate(-1);
        }
      } else {
        toast.error(
          response?.data?.message || error || "Failed to fetch dispute data."
        );
        navigate(-1);
      }
    } catch (err) {
      console.error("Fetch dispute data error:", err);
      toast.error("Something went wrong. Please try again.");
      navigate(-1);
    } finally {
      setLoading(false);
    }
  };

  const fetchChatMessages = () => {
    if (!dispute || !user || !socket || !socket.connected) return;

    const requestData = {
      senderId: user.userId,
      receiverId: dispute.userId._id,
      disputeId: dispute._id,
    };

    console.log("Emitting get-messages:", requestData);
    socket.emit("get-messages", requestData);
  };

  const handleSendMessage = () => {
    if (
      (chatMessage.trim() || selectedFile) &&
      socket &&
      socket.connected &&
      user &&
      dispute
    ) {
      console.log("User object:", user);
      const token = store.getState().user.token;
      const messageData = {
        senderId: user.userId,
        receiverId: dispute.userId._id,
        disputeId: dispute._id,
        message: chatMessage.trim(),
        token: token,
        file: selectedFile ? selectedFile : [],
      };

      console.log("Socket connected:", socket.connected);
      console.log("Emitting send-messages:", messageData);
      socket.emit("send-messages", messageData);

      // Optimistically add message to UI
      const newMessage = {
        sender: "admin",
        text: chatMessage || (selectedFile ? selectedFile.name : ""),
        time: new Date().toLocaleTimeString(),
      };
      setChatMessages([...chatMessages, newMessage]);
      setChatMessage("");
      setSelectedFile(null);
    } else {
      console.log("Cannot send message:", {
        hasMessage: !!chatMessage.trim(),
        hasFile: !!selectedFile,
        hasSocket: !!socket,
        socketConnected: socket?.connected,
        hasUser: !!user,
        hasDispute: !!dispute,
      });
      toast.error("Chat not connected. Please refresh and try again.");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (loading) {
    return (
      <CRow>
        <CCol className="text-center">
          <CSpinner />
          <p className="mt-2">Loading dispute chat...</p>
        </CCol>
      </CRow>
    );
  }

  if (!dispute) {
    return (
      <CRow>
        <CCol className="text-center">
          <p>Dispute data not found. Please go back and try again.</p>
        </CCol>
      </CRow>
    );
  }

  return (
    <div className="disputeChatPage">
      <div className="d-flex align-items-center gap-2 mb-3">
        <CButton
          color="link"
          onClick={() => navigate(-1)}
          className="backbtn p-0"
        >
          <CIcon icon={cilArrowLeft} size="lg" />
        </CButton>
        <h4 className="heading m-0">Dispute Chat</h4>
      </div>
      <div className="mb-3">
        <strong>Dispute ID:</strong> {dispute._id}
      </div>
      <div className="mb-3">
        <strong>Issue:</strong> {dispute.reason}
      </div>

      <CRow>
        <CCol md={12}>
          <CCard>
            <CCardHeader className="section-header">
              <span className="icon-badge">
                <CIcon icon={cilChatBubble} />
              </span>
              Dispute Chat
            </CCardHeader>
            <CCardBody>
              <div
                className="chat-messages  p-3 mb-3"
                style={{
                  maxHeight: "500px",
                  overflowY: "auto",
                }}
              >
                {chatMessages.length > 0 ? (
                  chatMessages.map((msg, index) => (
                    <div
                      key={index}
                      className={`message mb-2 ${
                        msg.sender === "admin" ? "text-end" : ""
                      }`}
                    >
                      <div
                        className={`d-inline-block p-2 rounded ${
                          msg.sender === "admin" ? "text-dark" : "bg-light"
                        }`}
                        style={{
                          maxWidth: "70%",
                          backgroundColor:
                            msg.sender === "admin"
                              ? "rgba(0, 141, 76, 0.1098039216)"
                              : undefined,
                        }}
                      >
                        {msg.text}
                        <br />
                        <small
                          className={
                            msg.sender === "admin" ? "text-dark" : "text-muted"
                          }
                        >
                          {msg.time}
                        </small>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-muted">
                    <CIcon icon={cilChatBubble} size="3xl" className="mb-3" />
                    <p>No messages yet. Start the conversation!</p>
                  </div>
                )}
              </div>

              <div className="chat-input">
                <CInputGroup>
                  <CFormInput
                    placeholder="Type your message..."
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    onKeyDown={handleKeyPress}
                    rows={2}
                  />
                  <CFormInput
                    type="file"
                    onChange={(e) => setSelectedFile(e.target.files[0])}
                    style={{ display: "none" }}
                    id="file-input"
                  />
                  <CButton
                    onClick={() =>
                      document.getElementById("file-input").click()
                    }
                    style={{
                      backgroundColor: "rgba(0, 141, 76, 0.1098039216)",
                      borderColor: "rgba(0, 141, 76, 0.5)",
                      color: "black",
                    }}
                  >
                    <CIcon icon={cilPaperclip} />
                  </CButton>
                  <CButton
                    onClick={handleSendMessage}
                    disabled={!chatMessage.trim() && !selectedFile}
                    style={{
                      backgroundColor: "rgba(0, 141, 76, 0.1098039216)",
                      borderColor: "rgba(0, 141, 76, 0.5)",
                      color: "black", 
                    }}
                  >
                    <CIcon icon={cilSend} />
                  </CButton>
                </CInputGroup>
                  {selectedFile && (
                    <div className="mt-2 d-flex align-items-center">
                      {selectedFile.type.startsWith("image/") ? (
                        <div
                          style={{
                            position: "relative",
                            display: "inline-block",
                          }}
                        >
                          <img
                            src={URL.createObjectURL(selectedFile)}
                            alt="Preview"
                            style={{
                              width: "100px",
                              height: "100px",
                              objectFit: "cover",
                              borderRadius: "4px",
                            }}
                          />
                          <CButton
                            size="sm"
                            color="danger"
                            style={{
                              position: "absolute",
                              top: "-5px",
                              right: "-5px",
                              borderRadius: "50%",
                              width: "20px",
                              height: "20px",
                              padding: "0",
                              fontSize: "12px",
                            }}
                            onClick={() => setSelectedFile(null)}
                          >
                            <CIcon icon={cilX} />
                          </CButton>
                        </div>
                      ) : (
                        <>
                          <small>Selected file: {selectedFile.name}</small>
                          <CButton
                            size="sm"
                            color="danger"
                            className="ms-2"
                            onClick={() => setSelectedFile(null)}
                          >
                            <CIcon icon={cilX} />
                          </CButton>
                        </>
                      )}
                    </div>
                  )}
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </div>
  );
};

export default DisputeChat;

