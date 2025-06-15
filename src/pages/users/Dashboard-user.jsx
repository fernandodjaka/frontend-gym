import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardBody,
  Typography,
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Textarea,
  IconButton,
  Avatar,
  Chip
} from "@material-tailwind/react";
import {
  RocketLaunchIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  ChartBarSquareIcon,
  XMarkIcon,
  ArrowPathIcon,
  SparklesIcon
} from "@heroicons/react/24/solid";
import { FiSend } from "react-icons/fi";
import axios from "axios";
import Navbar from "../../component/navbar";

const UserDashboard = () => {
  const navigate = useNavigate();
  const [openChat, setOpenChat] = useState(false);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expertMode, setExpertMode] = useState(false);
  const chatContainerRef = useRef(null);

  // Initialize chat with welcome message
  useEffect(() => {
    if (openChat && chat.length === 0) {
      setChat([{
        role: "assistant",
        content: "Halo! Saya Digital Fitness Assistant. Saya bisa membantu dengan:\n\n• Program latihan\n• Nutrisi\n• Teknik olahraga\n• Rekomendasi berdasarkan tujuan Anda\n\nApa yang bisa saya bantu hari ini?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        system: true
      }]);
    }
  }, [openChat]);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chat]);

  const handleOpenChat = () => {
    setOpenChat(!openChat);
    if (!openChat) {
      const button = document.getElementById('chat-button');
      if (button) {
        button.classList.add('animate-bounce');
        setTimeout(() => button.classList.remove('animate-bounce'), 1000);
      }
    }
  };

  const sendMessage = async () => {
    if (!message.trim() || loading) return;
  
    const userMessage = {
      role: "user",
      content: message,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  
    setChat(prev => [...prev, userMessage]);
    setMessage("");
    setLoading(true);
  
    try {
      const response = await axios.post(
        "http://localhost:8000/api/gemini/generate",
        { 
          prompt: message,
          mode: expertMode ? "expert" : "basic"
        },
        { 
          headers: { 'Content-Type': 'application/json' } 
        }
      );
  
      const aiMessage = {
        role: "assistant",
        content: response.data.advice || response.data.text || "Tidak dapat memproses permintaan",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
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
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          error: true
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setChat([{
      role: "assistant",
      content: "Halo! Ada yang bisa saya bantu mengenai fitness hari ini?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
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
    <div className="min-h-screen bg-[url('/img/homefit-bg.jpg')] bg-cover bg-center bg-no-repeat bg-white/70">
      {/* Navbar Fixed */}
      <Navbar />
      
      {/* Main Content with padding for fixed navbar */}
      <main className="pt-24 min-h-screen px-6 pb-10">
        <div className="text-center mb-12">
          <Typography
            variant="h2"
            className="font-extrabold text-blue-800 drop-shadow-lg"
          >
            Selamat Datang di <span className="text-blue-600">HomeFit</span> 🏋️‍♀️
          </Typography>
          <Typography className="mt-3 text-blue-gray-700 max-w-2xl mx-auto text-lg">
            Wujudkan tubuh sehat dan ideal dari kenyamanan rumah Anda. Mulai perjalanan fitnessmu dengan fitur-fitur terbaik kami.
          </Typography>
        </div>

        <div className="grid gap-8 grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto">
          {/* Kalkulator Lemak */}
          <Card className="shadow-lg bg-white/80 hover:shadow-xl hover:-translate-y-1 transition">
            <CardBody className="text-center space-y-4">
              <RocketLaunchIcon className="w-12 h-12 mx-auto text-blue-600" />
              <Typography variant="h5" className="font-semibold">
                Kalkulator Lemak Tubuh
              </Typography>
              <Typography className="text-sm text-blue-gray-700">
                Hitung kadar lemak tubuh berdasarkan data BMI, usia, dan jenis kelamin Anda.
              </Typography>
              <Button onClick={() => navigate("/kalkulator-fat")} color="blue">
                Hitung Sekarang
              </Button>
            </CardBody>
          </Card>

          {/* Program Latihan */}
          <Card className="shadow-lg bg-white/80 hover:shadow-xl hover:-translate-y-1 transition">
            <CardBody className="text-center space-y-4">
              <ChartBarSquareIcon className="w-12 h-12 mx-auto text-purple-700" />
              <Typography variant="h5" className="font-semibold">
                Cek Program Latihan
              </Typography>
              <Typography className="text-sm text-blue-gray-700">
                Temukan program latihan yang sesuai dengan tujuan dan levelmu.
              </Typography>
              <Button onClick={() => navigate("/program")} color="purple">
                Lihat Program
              </Button>
            </CardBody>
          </Card>
        </div>

        {/* Motivational Quote */}
        <div className="mt-16 text-center max-w-xl mx-auto text-blue-gray-800">
          <Typography variant="h6" className="italic">
            "Disiplin adalah kunci. Kamu tidak perlu gym mahal, kamu hanya perlu komitmen."
          </Typography>
        </div>
      </main>

      {/* Floating Chat Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          id="chat-button"
          onClick={handleOpenChat}
          className={`relative bg-gradient-to-br from-green-500 to-green-600 text-white rounded-full p-4 shadow-xl transition-all hover:shadow-2xl hover:scale-105 ${openChat ? 'rotate-12' : ''}`}
        >
          <ChatBubbleOvalLeftEllipsisIcon className="w-8 h-8" />
          {!openChat && (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 flex items-center justify-center text-xs font-bold animate-pulse">
              !
            </span>
          )}
        </button>
      </div>

      {/* Chat Dialog */}
      <Dialog
        open={openChat}
        handler={handleOpenChat}
        size="xl"
        className="rounded-2xl overflow-hidden border border-gray-200 shadow-2xl"
      >
        <DialogHeader className="bg-gradient-to-r from-green-500 to-blue-600 p-4 text-white">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-full">
                <SparklesIcon className="w-6 h-6" />
              </div>
              <div>
                <Typography variant="h5" className="font-bold">
                  Fitness AI Assistant
                </Typography>
                <Typography variant="small" className="opacity-80 flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                  {loading ? "Mengetik..." : "Online"}
                </Typography>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Chip
                value={expertMode ? "Expert Mode" : "Basic Mode"}
                color={expertMode ? "amber" : "green"}
                className="cursor-pointer transition-all hover:scale-105 shadow-sm"
                onClick={() => setExpertMode(!expertMode)}
              />
              <IconButton
                variant="text"
                color="white"
                onClick={clearChat}
                disabled={chat.length <= 1}
                className="rounded-full hover:bg-white/20"
              >
                <ArrowPathIcon className="h-5 w-5" />
              </IconButton>
              <IconButton
                variant="text"
                color="white"
                onClick={handleOpenChat}
                className="rounded-full hover:bg-white/20"
              >
                <XMarkIcon className="h-5 w-5" />
              </IconButton>
            </div>
          </div>
        </DialogHeader>
        
        <DialogBody className="p-0 flex flex-col h-[60vh] bg-gradient-to-b from-gray-50 to-gray-100">
          <div
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto p-6 space-y-4"
          >
            {chat.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className={`flex max-w-[85%] ${msg.role === "user" ? "flex-row-reverse" : ""} gap-3`}>
                  <div className="relative flex-shrink-0">
                    <Avatar
                      src={msg.role === "user" ? "" : "/trainer-ai.jpg"}
                      alt={msg.role === "user" ? "You" : "Trainer"}
                      variant="circular"
                      size="sm"
                      className={`border-2 ${msg.role === "user" ? "border-blue-500" : "border-orange-500"}`}
                    />
                    {msg.role !== "user" && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
                    )}
                  </div>
                  
                  <div
                    className={`rounded-2xl p-4 relative ${msg.role === "user"
                      ? "bg-blue-500 text-white rounded-tr-none shadow-md"
                      : msg.error
                        ? "bg-red-100 text-red-800 rounded-tl-none shadow-sm"
                        : "bg-white text-gray-800 shadow-sm rounded-tl-none"}`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <Typography variant="small" className="font-bold">
                        {msg.role === "user" ? "Anda" : "AI Trainer"}
                      </Typography>
                      <Typography variant="small" className="opacity-70">
                        {msg.timestamp}
                      </Typography>
                    </div>
                    
                    <Typography className="whitespace-pre-wrap">
                      {msg.content}
                    </Typography>
                  </div>
                </div>
              </div>
            ))}
            
            {loading && (
              <div className="flex justify-start">
                <div className="flex gap-3 max-w-[85%]">
                  <div className="relative flex-shrink-0">
                    <Avatar
                      src="/trainer-ai.jpg"
                      alt="Trainer"
                      variant="circular"
                      size="sm"
                      className="border-2 border-orange-500"
                    />
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
                  </div>
                  <div className="bg-white rounded-2xl rounded-tl-none p-4 shadow-sm">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-gray-200 p-4 bg-white">
            <div className="relative">
              <Textarea
                label="Tulis pesan Anda..."
                rows={2}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pr-12 text-gray-700 rounded-2xl border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                containerProps={{ className: "min-w-0" }}
              />
              <button
                onClick={sendMessage}
                disabled={loading || !message.trim()}
                 className={`absolute right-2 bottom-2 p-2 rounded-full transition-colors ${
                  loading || !message.trim() 
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                    : 'bg-blue-500 text-white hover:bg-blue-600 shadow-md'
                }`}
              >
                <FiSend className="h-5 w-5" />
              </button>
            </div>
            <Typography variant="small" className="mt-2 text-center text-gray-500">
              {expertMode 
                ? "Mode Ahli: Jawaban teknis mendalam" 
                : "Mode Dasar: Jawaban mudah dipahami"}
            </Typography>
          </div>
        </DialogBody>
      </Dialog>
    </div>
  );
};

export default UserDashboard;