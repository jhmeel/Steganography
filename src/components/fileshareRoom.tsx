import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import {
  FaUpload,
  FaDownload,
  FaCheck,
  FaSpinner,
  FaArrowAltCircleUp,
  FaArrowAltCircleDown,
} from "react-icons/fa";

import io from "socket.io-client";
import Modal from "react-modal";
import toast from "react-hot-toast";
import {
  SecretData,
  embedImgAndSecret,
  exractImageAndSecret,
} from "../lib/steganography";
import { createAndDownloadTxtFile } from "../utils";


interface MessageBubbleProps {
  sent: boolean;
}


// Socket.IO instance
const socket = io("https://steg-server.onrender.com");

// Keyframe animations
const fadeIn = keyframes`
  0% { opacity: 0; }
  100% { opacity: 1; }
`;

const slideUp = keyframes`
  0% { transform: translateY(50px); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
`;

// Styled components
const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #fff;
  font-family: "Roboto", sans-serif;

  @media (max-width: 768px) {
    height: auto;
  }
`;

const ChatHeader = styled.div`
  background-color: rgba(255, 255, 255);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  -moz-backdrop-filter: blur(10px);
  -o-backdrop-filter: blur(10px);
  transform: 0.5s;
  border-bottom: 1px solid #ededed;
  padding: 10px;
  display: flex;
  flex-direction: column;
  border-left: 4px solid #374b50;
  overflow-x: scroll;
`;

const MessageList = styled.div`
  padding: 8px 10px;
  margin-top: 10px;
  margin-bottom: 25px;
  overflow-y: scroll;
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
`;


const MessageBubble = styled.div<MessageBubbleProps>`
  display: flex;
  flex-direction: column;
  align-items: ${({ sent }) => (sent ? 'flex-end' : 'flex-start')};
  margin-bottom: 8px;
  animation: ${fadeIn} 0.5s ease-in-out, ${slideUp} 0.5s ease-in-out;
`;

const MessageContent =  styled.div<MessageBubbleProps>`
  display: flex;
  align-items: center;
  justify-content: ${({ sent }) => (sent ? "flex-end" : "flex-start")};
`;

const SenderAvatar = styled.div`
  width: 30px;
  height: 30px;
  background-color: #374b50;
  color: white;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  margin-right: 8px;
`;

const FilePreview = styled.div`
  max-width: 60%;
  position: relative;
`;

const FilePreviewImage = styled.img`
  max-width: 100%;
  max-height: 200px;
  border-radius: 8px;
  object-fit: cover;
`;

const FilePreviewCaption = styled.p`
  font-size: 12px;
  color: #666;
  margin-top: 8px;
`;

const DownloadButton = styled(FaDownload)`
  font-size: 16px;
  color: #4c70af;
  margin-left: 8px;
  cursor: pointer;
  transition: color 0.3s ease;

  &:hover {
    color: #27477e;
  }
`;
const ActiveUsers = styled.div`
  display: flex;
  gap: 6px;
`;
const UserList = styled.div`
  background-color: #fff;
  border-radius: 8px;
  padding: 8px;
  display: flex;
  flex-direction: column;
`;

const UserAvatar = styled.div`
  font-size: 12px;
  color: #101d34;
  margin-left: 8px;
`;

const UserListItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 4px;
`;

const UsernameModal = styled(Modal)`
  position: absolute;
  width: 70%;
  max-width: 600px;
  top: 30%;
  left: 50%;
  transform: translateX(-50%);
  background-color: #fff;
  border-radius: 8px;
  padding: 10px 20px;
  border: 1px solid #ededed;
  outline: none;
`;

const AccessCodeModal = styled(Modal)`
  position: absolute;
  width: 90%;
  max-width: 600px;
  top: 30%;
  left: 50%;
  transform: translateX(-50%);
  background-color: #fff;
  border-radius: 8px;
  padding: 10px 20px;
  border: 1px solid #ededed;
  outline: none;
`;
const UsernameInput = styled.input`
  display: block;
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  &:focus {
    outline: none;
  }
`;
const FileNameDisplay = styled.span`
  font-size: 12px;
  color: #666;
  margin-left: 8px;
  position: absolute;
  top: -10px;
  left: -5px;
  max-width: 70%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  background-color: #fff;
  border: 1px solid #ededed;
  padding: 3px 6px;
  border-radius: 10px;
`;

const Input = styled.input`
  display: block;
  max-width: 600px;
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  &:focus {
    outline: none;
  }
`;

const Button = styled.button`
  display: flex;
  padding: 8px 16px;
  gap: 5px;
  background-color: #4a7f8c;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }

  &:not(:disabled):hover {
    background-color: #46678b;
  }
`;

const Section = styled.div`
  position: fixed;
  display: flex;
  padding: 10px 20px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  bottom: 0;
  background-color: #374b50;
  border-top-right-radius: 20px;
  border-top-left-radius: 20px;
  transition: height 0.3s ease;
  cursor: ns-resize;
`;

const SectionTitle = styled.h4`
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 5px 10px;

  label {
    color: #fff;
  }
`;

const ChatApp: React.FC = () => {
  const [messages, setMessages] = useState<
    {
      id: number;
      file: string;
      accessCode: string;
      payload: string;
      caption: string;
      sender: string;
      status: string;
    }[]
  >([]);
  const [fileToShare, setFileToShare] = useState<File | null>(null);
  const [fileCaption, setFileCaption] = useState("");
  const [username, setUsername] = useState("");
  const [activeUsers, setActiveUsers] = useState<string[]>([]);
  const [showUsernameModal, setShowUsernameModal] = useState(false);
  const [secretData, setSecretData] = useState<SecretData>({
    accessCode: "",
    data: "",
  });

  const [secretModalActive, setSecretModalActive] = useState<boolean>(false);

  useEffect(() => {
    socket.on("error", (err) => {
      toast.error(err);
    });
    return () => {
      socket.off("error");
    };
  }, []);

  useEffect(() => {
    if (!username) {
      setShowUsernameModal(true);
    }
  }, [username]);

  useEffect(() => {
    // Listen for incoming messages from the server
    socket.on("message", (data) => {
      const isDuplicate = messages.some((msg) => msg.id === data.id);
      if (!isDuplicate) {
        const parsed = exractImageAndSecret(data.embedded);

        setMessages((prevMessages) => [...prevMessages, { ...data, parsed }]);
      }
    });

    // Listen for active users update
    socket.on("activeUsers", (users) => {
      setActiveUsers(users);
    });

    // Clean up event listeners on component unmount
    return () => {
      socket.off("message");
      socket.off("activeUsers");
    };
  }, [messages]);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFileToShare(e.target.files[0]);
    }
  };

  const handleFileCaptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileCaption(e.target.value);
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const readFile = (file: Blob): Promise<Uint8Array> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result instanceof ArrayBuffer) {
          resolve(new Uint8Array(event.target.result));
        } else {
          reject(new Error('File reading failed'));
        }
      };
      reader.onerror = (error) => {
        reject(error);
      };
      reader.readAsArrayBuffer(file);
    });
  };
  
  const shareFile = async () => {
    if (!fileToShare || !secretData.accessCode || !secretData.data) {
      toast.error("Please provide the file details");
      return;
    }
    if (username.trim()) {
      // Generate a unique ID for the message
      const id = Date.now();
      const fileContents: Uint8Array = await readFile(fileToShare);

      try {
        const embedded = embedImgAndSecret(
          fileContents,
          JSON.stringify(secretData)
        );
        const embeddedDataArray = Object.values(embedded).map(Number);
        const embeddedDataUint8 = new Uint8Array(embeddedDataArray);

        const newMessage = {
          id,
          file: URL.createObjectURL(fileToShare),
          caption: fileCaption,
          sender: username,
          embedded: embeddedDataUint8,
          accessCode: secretData.accessCode,
          payload: secretData.data,
          status: "sent",
        };

        socket.emit("message", newMessage);
        setMessages((prevMessages) => [...prevMessages, newMessage]);
        setFileToShare(null);
        setFileCaption("");
        setSecretData({
          accessCode: "",
          data: "",
        });
      } catch (err) {
        console.log(err);
      }
    }
  };

  const downloadFile = (fileUrl: string, fileName: string) => {
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleUsernameSubmit = () => {
    if (username.trim()) {
      socket.emit("join", username);
    }
    setShowUsernameModal(false)

  };
  const [secretFilePayloadToDownload, setSecretFilePayloadToDownload] =
    useState({
      accessCode: '',
      fileUrl: '',
      secretPayload: '',
      caption: '',
    })

  const [uAccessCode, setUAccessCode] = useState<string>("");

  const handleDownloadPayload = () => {
    if (secretFilePayloadToDownload.accessCode !== uAccessCode) {
      toast.error("invalid access code");
      return;
    }
    const link = document.createElement("a");
    link.href = secretFilePayloadToDownload.fileUrl;
    link.download = secretFilePayloadToDownload.caption;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    createAndDownloadTxtFile(
      "SEC:" + secretFilePayloadToDownload.caption,
      secretFilePayloadToDownload.secretPayload
    );
    setUAccessCode("");
    setSecretModalActive(false);
  };

  const [sectionVisible, setSectionVisible] = useState(true);
  const toggleSectionVisibility = () => {
    setSectionVisible(!sectionVisible);
  };

  return (
    <ChatContainer>
      <ChatHeader>
        <h3>Active Users</h3>
        <UserList>
          <ActiveUsers>
            {activeUsers.map((user) => (
              <UserListItem key={user}>
                <SenderAvatar>{user[0].toUpperCase()}</SenderAvatar>
                <UserAvatar />
                {user === username ? "You" : user}
              </UserListItem>
            ))}
          </ActiveUsers>
        </UserList>
      </ChatHeader>
      <MessageList>
        {messages.map((message) => (
          <MessageBubble key={message.id} sent={message.sender === username}>
            <MessageContent sent={message.sender === username}>
              <SenderAvatar>{message.sender[0].toUpperCase()}</SenderAvatar>
              <FilePreview>
                {message.file && (
                  <>
                    <FilePreviewImage
                      src={message.file}
                      alt="Shared File"
                      onDoubleClick={() => {
                        if (!message.accessCode) return;
                        setSecretModalActive(true);
                        setSecretFilePayloadToDownload({
                          accessCode: message.accessCode,
                          fileUrl: message.file,
                          secretPayload: message.payload,
                          caption: message.caption,
                        });
                      }}
                    />
                    <FilePreviewCaption>{message.caption}</FilePreviewCaption>
                    {message.sender === username &&
                      message.status === "sent" && <FaCheck color="#4c70af" />}
                    {message.sender === username &&
                      message.status === "loading" && (
                        <FaSpinner className="loader" color="#4c7caf" />
                      )}
                    {message.sender !== username && (
                      <DownloadButton
                        onClick={() =>
                          downloadFile(message.file, message.caption)
                        }
                      />
                    )}
                  </>
                )}
              </FilePreview>
            </MessageContent>
          </MessageBubble>
        ))}
      </MessageList>
      <Section style={{ visibility: sectionVisible ? "visible" : "hidden" }}>
        <SectionTitle>
          <label id="file-inp" htmlFor="fileInp">
            {fileToShare ? (
              <FileNameDisplay>{fileToShare.name}</FileNameDisplay>
            ) : (
              "Select a file"
            )}
          </label>
        </SectionTitle>
        <input
          onChange={handleFileInputChange}
          id="fileInp"
          type="file"
          accept="image/jpeg, image/png, image/gif"
          hidden
        />
        <Input
          autoFocus
          type="text"
          placeholder="Access Code"
          required
          value={secretData.accessCode}
          onChange={(e) =>
            setSecretData({ ...secretData, accessCode: e.target.value })
          }
        />
        <Input
          type="text"
          placeholder="Secret payload"
          value={secretData.data}
          onChange={(e) =>
            setSecretData({ ...secretData, data: e.target.value })
          }
        />
        <Input
          type="text"
          placeholder="caption"
          required
          value={fileCaption}
          onChange={handleFileCaptionChange}
        />
        <Button
          onClick={shareFile}
          disabled={!secretData.accessCode || !secretData.data}
        >
          <FaUpload />
          Share File
        </Button>
      </Section>
      {sectionVisible ? (
        <FaArrowAltCircleDown
          onClick={toggleSectionVisibility}
          style={{
            cursor: "pointer",
            position: "fixed",
            bottom: "20px",
            right: "20px",
            fontSize: "30px",
            color: "#fff",
          }}
        />
      ) : (
        <FaArrowAltCircleUp
          onClick={toggleSectionVisibility}
          style={{
            cursor: "pointer",
            position: "fixed",
            bottom: "20px",
            right: "20px",
            fontSize: "30px",
            color: "#fff",
          }}
        />
      )}

      <UsernameModal
        isOpen={showUsernameModal}
        onRequestClose={() => setShowUsernameModal(false)}
        ariaHideApp={false}
      >
        <h3>Enter your username</h3>
        <UsernameInput
          type="text"
          value={username}
          onChange={handleUsernameChange}
          placeholder="Username"
        />
        <button onClick={handleUsernameSubmit}>Join Chat</button>
      </UsernameModal>

      <AccessCodeModal
        isOpen={secretModalActive}
        onRequestClose={() => setSecretModalActive(false)}
        contentLabel="Access Code Modal"
        ariaHideApp={false}
      >
        <h2>Access Code Required</h2>
        <p>
          Please enter the access code to download the file and its secret
          payload
        </p>
        <Input
          type="text"
          placeholder="Access Code"
          value={uAccessCode}
          onChange={(e) => setUAccessCode(e.target.value)}
        />
        <Button onClick={handleDownloadPayload}>Download</Button>
      </AccessCodeModal>
    </ChatContainer>
  );
};

export default ChatApp;
