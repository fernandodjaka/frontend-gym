import React, { useState, useRef, useEffect } from "react";
import {
  Card,
  CardBody,
  Button,
  Typography,
  Textarea,
  IconButton,
  Avatar,
  Chip
} from "@material-tailwind/react";
import axios from "axios";
import { FiSend, FiTrash2, FiUser, FiActivity } from "react-icons/fi";

const API_GEMINI = "http://localhost:8000/api/gemini/generate";

const GymConsultation = () => {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expertMode, setExpertMode] = useState(false);
  const chatContainerRef = useRef(null);

  // Pesan sambutan awal dari trainer
  useEffect(() => {
    setChat([{
      role: "assistant",
      content: "Halo! Saya Digital Fitness Assistant. Saya bisa membantu dengan:\n\n• Program latihan\n• Nutrisi\n• Teknik olahraga\n• Rekomendasi berdasarkan tujuan Anda\n\nApa yang bisa saya bantu hari ini?",
      timestamp: new Date().toLocaleTimeString(),
      system: true
    }]);
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chat]);

  const sendMessage = async () => {
    if (!message.trim() || loading) return;
  
    const userMessage = {
      role: "user",
      content: message,
      timestamp: new Date().toLocaleTimeString()
    };
  
    setChat(prev => [...prev, userMessage]);
    setMessage("");
    setLoading(true);
  
    try {
      const response = await axios.post(
        API_GEMINI,
        { 
          prompt: message,
          mode: expertMode ? "expert" : "basic" // Tambahkan mode
        },
        { 
          headers: { 'Content-Type': 'application/json' } 
        }
      );
  
      const aiMessage = {
        role: "assistant",
        content: response.data.advice || response.data.text || "Tidak dapat memproses permintaan",
        timestamp: new Date().toLocaleTimeString(),
        isTrainer: true,
        type: response.data.type || 'general'
      };
  
      setChat(prev => [...prev, aiMessage]);
    } catch (err) {
      console.error("Error:", err.response?.data || err.message);
      setChat(prev => [
        ...prev,
        {
          role: "assistant",
          content: err.response?.data?.error || "Terjadi gangguan sementara. Silakan coba lagi.",
          timestamp: new Date().toLocaleTimeString(),
          error: true
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Format respons khusus fitness
  const formatGymResponse = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<span class="font-bold text-blue-600">$1</span>')
      .replace(/\n/g, '<br/>');
  };

  const clearChat = () => {
    setChat([{
      role: "assistant",
      content: "Halo! Ada yang bisa saya bantu mengenai fitness hari ini?",
      timestamp: new Date().toLocaleTimeString(),
      system: true
    }]);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <Typography variant="h3" className="text-gray-800 flex items-center gap-2">
            <FiActivity className="h-8 w-8" />
            Gym Digital Assistant
          </Typography>
          <Typography variant="small" className="text-gray-600">
            Dapatkan saran latihan dan nutrisi dari AI trainer kami
          </Typography>
        </div>
        
        <div className="flex gap-2">
          <Chip
            value={expertMode ? "Expert Mode" : "Basic Mode"}
            color={expertMode ? "deep-orange" : "green"}
            className="cursor-pointer"
            onClick={() => setExpertMode(!expertMode)}
          />
          <IconButton
            color="red"
            variant="text"
            onClick={clearChat}
            disabled={chat.length <= 1}
            className="rounded-full"
          >
            <FiTrash2 className="h-5 w-5" />
          </IconButton>
        </div>
      </div>

      <Card className="shadow-lg border border-gray-200">
        <CardBody className="p-0 flex flex-col h-[70vh]">
          {/* Chat History */}
          <div
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto p-4 bg-gray-50"
          >
            {chat.map((msg, idx) => (
              <div
                key={idx}
                className={`flex mb-4 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className={`flex ${msg.role === "user" ? "flex-row-reverse" : ""} gap-3 max-w-full`}>
                  <Avatar
                    src={msg.role === "user" ? "" : "/trainer-ai.jpg"}
                    alt={msg.role === "user" ? "Member" : "Trainer"}
                    variant="circular"
                    size="sm"
                    icon={<FiUser />}
                    className={`border ${msg.role === "user" ? "border-blue-500" : "border-orange-500"}`}
                  />
                  
                  <div
                    className={`max-w-3/4 rounded-lg px-4 py-3 ${msg.role === "user"
                      ? "bg-blue-500 text-white"
                      : msg.error
                        ? "bg-red-100 text-red-800"
                        : "bg-orange-50 text-gray-800 border border-orange-100"}`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Typography variant="small" className="font-bold">
                        {msg.role === "user" ? "Anda" : "Fitness AI"}
                      </Typography>
                      <Typography variant="small" className="opacity-70">
                        {msg.timestamp}
                      </Typography>
                    </div>
                    <div 
                      className="whitespace-pre-wrap" 
                      dangerouslySetInnerHTML={{ __html: msg.content }}
                    />
                  </div>
                </div>
              </div>
            ))}
            
            {loading && (
              <div className="flex justify-start mb-4">
                <div className="flex gap-3 max-w-full">
                  <Avatar
                    src="/trainer-ai.jpg"
                    alt="Trainer"
                    variant="circular"
                    size="sm"
                    icon={<FiUser />}
                    className="border border-orange-500"
                  />
                  <div className="bg-orange-50 rounded-lg px-4 py-3 text-gray-800 border border-orange-100">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 rounded-full bg-orange-400 animate-bounce"></div>
                      <div className="w-2 h-2 rounded-full bg-orange-400 animate-bounce delay-100"></div>
                      <div className="w-2 h-2 rounded-full bg-orange-400 animate-bounce delay-200"></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="border-t p-4 bg-white">
            <div className="flex items-end gap-2">
              <Textarea
                label="Tanya tentang latihan/nutrisi..."
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-grow"
              />
              <Button
                color="orange"
                onClick={sendMessage}
                disabled={loading || !message.trim()}
                className="h-14 w-14 flex items-center justify-center"
              >
                <FiSend className="h-5 w-5" />
              </Button>
            </div>
            <Typography variant="small" className="mt-2 text-gray-600 text-center">
              {expertMode 
                ? "Mode Expert: Jawaban teknis untuk profesional fitness" 
                : "Mode Basic: Jawaban mudah dipahami untuk pemula"}
            </Typography>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default GymConsultation;