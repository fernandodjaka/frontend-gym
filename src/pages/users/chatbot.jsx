import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

// --- Ikon-ikon ---
const SparklesIcon = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.572L16.5 21.75l-.398-1.178a3.375 3.375 0 00-2.3-2.3L12.75 18l1.178-.398a3.375 3.375 0 002.3-2.3L16.5 14.25l.398 1.178a3.375 3.375 0 002.3 2.3l1.178.398-1.178.398a3.375 3.375 0 00-2.3 2.3z" /></svg>;
const SendIcon = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" /></svg>;
const CloseIcon = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>;


const Chatbot = ({ user }) => {
    const [openChat, setOpenChat] = useState(false);
    const [message, setMessage] = useState("");
    const [chat, setChat] = useState([]);
    const [loadingChat, setLoadingChat] = useState(false);
    const chatContainerRef = useRef(null);

    useEffect(() => {
        if (openChat && chat.length === 0) {
            setChat([{ role: "assistant", content: "Halo! Saya Digital HomeFit Assistant. Ada yang bisa saya bantu terkait program, nutrisi, atau tips fitness?" }]);
        }
    }, [openChat, chat.length]);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [chat]);

    const handleOpenChat = () => setOpenChat(true);
    const handleCloseChat = () => setOpenChat(false);

    const sendMessage = async () => {
        if (!message.trim() || loadingChat) return;
        
        const userMessage = { role: "user", content: message };
        setChat(prev => [...prev, userMessage]);
        setMessage("");
        setLoadingChat(true);

        try {
            const response = await axios.post("http://localhost:8000/api/gemini/generate", { 
                prompt: message 
            }, { 
                headers: { 'Content-Type': 'application/json' } 
            });

            const botMessage = { 
                role: "assistant", 
                content: response.data.advice || response.data.text || "Maaf, terjadi kesalahan." 
            };
            setChat(prev => [...prev, botMessage]);

        } catch (err) {
            const errorMessage = { 
                role: "assistant", 
                content: "Maaf, saya sedang mengalami gangguan. Coba lagi nanti.", 
                error: true 
            };
            setChat(prev => [...prev, errorMessage]);
        } finally {
            setLoadingChat(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const userInitial = user?.nama_lengkap ? user.nama_lengkap.charAt(0).toUpperCase() : 'U';

    return (
        <>
            <button 
                onClick={handleOpenChat} 
                className="fixed bottom-8 right-8 z-40 bg-blue-600 text-white p-4 rounded-full shadow-2xl hover:bg-blue-700 transition-all transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50" 
                aria-label="Buka Asisten AI"
            >
                <SparklesIcon className="w-8 h-8" />
            </button>

            <AnimatePresence>
                {openChat && (
                    <div className="fixed inset-0 z-[100] flex items-end justify-center sm:justify-end p-0 sm:p-4">
                        <motion.div 
                            initial={{ opacity: 0 }} 
                            animate={{ opacity: 1 }} 
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/30 backdrop-blur-sm" 
                            onClick={handleCloseChat}
                        ></motion.div>
                        
                        <motion.div 
                            initial={{ opacity: 0, y: 50, scale: 0.9 }} 
                            animate={{ opacity: 1, y: 0, scale: 1 }} 
                            exit={{ opacity: 0, y: 50, scale: 0.9 }}
                            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                            className="relative z-50 w-full max-w-lg h-full sm:h-[80vh] sm:max-h-[700px] flex flex-col bg-gray-800/80 backdrop-blur-xl rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden border border-white/10"
                        >
                            <header className="flex items-center justify-between p-4 border-b border-white/10 flex-shrink-0">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full">
                                        <SparklesIcon className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white">HomeFit AI Assistant</h3>
                                        <p className="text-sm text-gray-400 flex items-center gap-2">
                                            <span className={`w-2 h-2 rounded-full ${loadingChat ? 'bg-yellow-400 animate-pulse' : 'bg-green-400'}`}></span>
                                            {loadingChat ? "Mengetik..." : "Online"}
                                        </p>
                                    </div>
                                </div>
                                <button onClick={handleCloseChat} className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full">
                                    <CloseIcon className="w-5 h-5"/>
                                </button>
                            </header>

                            <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-6 space-y-6">
                                {chat.map((msg, idx) => (
                                    <div key={idx} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                        {msg.role === 'assistant' && (
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex-shrink-0 shadow-lg"></div>
                                        )}
                                        <div className={`max-w-md p-4 rounded-2xl ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-gray-700 text-gray-200 rounded-bl-none'}`}>
                                            <p className="text-sm whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: msg.content.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold">$1</strong>') }}></p>
                                        </div>
                                        {msg.role === 'user' && (
                                            <div className="w-10 h-10 rounded-full bg-gray-600 flex-shrink-0 flex items-center justify-center font-bold text-white shadow-lg">
                                                {userInitial}
                                            </div>
                                        )}
                                    </div>
                                ))}
                                {loadingChat && (
                                    <div className="flex items-start gap-3 justify-start">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex-shrink-0"></div>
                                        <div className="p-4 bg-gray-700 rounded-2xl rounded-bl-none">
                                            <div className="flex space-x-1.5">
                                                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <footer className="p-4 border-t border-white/10 flex-shrink-0">
                                <div className="relative">
                                    <textarea 
                                        value={message} 
                                        onChange={(e) => setMessage(e.target.value)} 
                                        onKeyPress={handleKeyPress} 
                                        placeholder="Tanya apa saja tentang fitness..." 
                                        rows="1" 
                                        className="w-full bg-gray-700 text-white placeholder-gray-400 p-4 pr-14 rounded-lg border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none transition-shadow" 
                                    />
                                    <button 
                                        onClick={sendMessage} 
                                        disabled={loadingChat || !message.trim()} 
                                        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <SendIcon className="w-6 h-6 text-white"/>
                                    </button>
                                </div>
                            </footer>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Chatbot;