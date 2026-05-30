import React, { useState, useRef, useEffect } from 'react';
import {
    Bot,
    Send,
    User,
    Sparkles,
    MessageSquare,
    Plus,
    History,
    MessageCircle,
    Loader2,
    BookOpen,
    GraduationCap,
    Search
} from 'lucide-react';

const AIChatPage = () => {
    const [messages, setMessages] = useState([
        {
            id: 1,
            sender: 'ai',
            content:
                'Xin chào! Mình là trợ lý AI của Thư viện AI. Mình có thể hỗ trợ bạn tìm tài liệu, giải thích kiến thức hoặc định hướng học tập.'
        }
    ]);

    const [conversations, setConversations] = useState([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [currentConvId, setCurrentConvId] = useState('');
    const endRef = useRef(null);

    const suggestedQuestions = [
        {
            icon: BookOpen,
            text: 'Tôi muốn tìm tài liệu về Spring Boot'
        },
        {
            icon: GraduationCap,
            text: 'Giải thích lập trình hướng đối tượng'
        },
        {
            icon: Search,
            text: 'Tôi nên học Java từ đâu?'
        }
    ];

    const fetchConversations = async () => {
        // Tạm thời chưa dùng lịch sử chat vì backend hiện mới có API /api/ai/chat
        setConversations([]);
    };

    const startNewChat = () => {
        setCurrentConvId('');
        setMessages([
            {
                id: 1,
                sender: 'ai',
                content: 'Xin chào! Hãy cho mình biết bạn cần hỗ trợ gì nhé.'
            }
        ]);
        setInput('');
    };

    const sendQuestion = async (questionText) => {
        const question = questionText.trim();

        if (!question || isTyping) return;

        const userMsg = {
            id: Date.now(),
            sender: 'user',
            content: question
        };

        setMessages((prev) => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        try {
            const token = localStorage.getItem('token');

            const response = await fetch('http://localhost:8080/api/ai/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { Authorization: `Bearer ${token}` } : {})
                },
                body: JSON.stringify({
                    message: question,
                    conversationId: currentConvId || ''
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Có lỗi xảy ra khi gọi AI.');
            }

            if (data.conversationId) {
                setCurrentConvId(data.conversationId);
            }

            const aiMsg = {
                id: Date.now() + 1,
                sender: 'ai',
                content: data.message || 'AI không có phản hồi.'
            };

            setMessages((prev) => [...prev, aiMsg]);
        } catch (error) {
            console.error('AI chat error:', error);

            const errorMsg = {
                id: Date.now() + 1,
                sender: 'ai',
                content:
                    error.message ||
                    'Xin lỗi, hiện tại hệ thống AI đang gặp lỗi. Vui lòng thử lại sau.'
            };

            setMessages((prev) => [...prev, errorMsg]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleSend = async (e) => {
        e.preventDefault();
        await sendQuestion(input);
    };

    useEffect(() => {
        fetchConversations();
    }, []);

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    return (
        <div className="max-w-7xl mx-auto mt-8 mb-8 px-4">
            <div className="h-[calc(100vh-9rem)] min-h-[620px] flex rounded-3xl bg-white shadow-xl overflow-hidden border border-gray-200">
                {/* Sidebar */}
                <aside className="hidden md:flex w-80 border-r border-gray-100 bg-gray-50/80 flex-col">
                    <div className="p-5 border-b border-gray-100 bg-white">
                        <button
                            onClick={startNewChat}
                            className="w-full py-3.5 px-4 bg-brand-green text-white rounded-2xl font-semibold flex items-center justify-center gap-2 hover:bg-green-700 transition-all shadow-sm active:scale-95"
                        >
                            <Plus size={18} />
                            Đoạn chat mới
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4">
                        <div className="flex items-center gap-2 px-2 mb-3 text-xs font-bold text-gray-400 uppercase tracking-wider">
                            <History size={14} />
                            Lịch sử trò chuyện
                        </div>

                        {conversations.length > 0 ? (
                            <div className="space-y-2">
                                {conversations.map((conv) => (
                                    <button
                                        key={conv.ConversationID}
                                        className="w-full p-3 rounded-2xl text-left transition-all flex items-center gap-3 hover:bg-white text-gray-600 border border-transparent hover:border-gray-200 hover:shadow-sm"
                                    >
                                        <MessageSquare size={17} className="text-gray-400 shrink-0" />
                                        <span className="flex-1 truncate text-sm font-medium">
                                            {conv.Title || 'Đoạn chat mới'}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                                <div className="w-14 h-14 rounded-2xl bg-white border border-gray-100 flex items-center justify-center mb-4 shadow-sm">
                                    <MessageCircle size={26} className="text-gray-300" />
                                </div>
                                <p className="text-sm text-gray-400">Chưa có lịch sử chat</p>
                            </div>
                        )}
                    </div>
                </aside>

                {/* Main Chat Area */}
                <main className="flex-1 flex flex-col bg-white">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-brand-green via-emerald-500 to-teal-500 px-5 sm:px-7 py-5 flex items-center justify-between text-white shadow-md z-10">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center shadow-sm">
                                <Bot size={26} />
                            </div>

                            <div>
                                <h1 className="font-bold text-lg sm:text-xl flex items-center gap-2">
                                    Trợ lý học tập AI
                                    <Sparkles size={16} className="text-yellow-300 animate-pulse" />
                                </h1>
                                <p className="text-xs sm:text-sm text-white/80">
                                    Hỗ trợ học tập, tìm tài liệu và giải thích kiến thức
                                </p>
                            </div>
                        </div>

                        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-white/20 rounded-full text-xs font-medium">
                            <span className="w-2 h-2 rounded-full bg-green-200 animate-pulse"></span>
                            Online
                        </div>
                    </div>

                    {/* Messages Container */}
                    <div className="flex-1 overflow-y-auto px-4 sm:px-7 py-6 space-y-6 bg-gradient-to-b from-gray-50 to-white">
                        {messages.map((msg, index) => (
                            <div
                                key={msg.id}
                                className={`flex gap-3 sm:gap-4 ${
                                    msg.sender === 'user' ? 'flex-row-reverse' : ''
                                }`}
                            >
                                <div
                                    className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${
                                        msg.sender === 'ai'
                                            ? 'bg-white text-brand-green border border-gray-100'
                                            : 'bg-brand-green text-white'
                                    }`}
                                >
                                    {msg.sender === 'ai' ? <Bot size={20} /> : <User size={20} />}
                                </div>

                                <div className="max-w-[82%] sm:max-w-[72%]">
                                    <div
                                        className={`px-4 py-3.5 rounded-2xl shadow-sm text-sm sm:text-[15px] leading-7 whitespace-pre-wrap ${
                                            msg.sender === 'user'
                                                ? 'bg-brand-green text-white rounded-tr-md'
                                                : 'bg-white text-gray-800 rounded-tl-md border border-gray-100'
                                        }`}
                                    >
                                        {msg.content}
                                    </div>

                                    {msg.sender === 'ai' && index === 0 && messages.length === 1 && (
                                        <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-2">
                                            {suggestedQuestions.map((item) => {
                                                const Icon = item.icon;

                                                return (
                                                    <button
                                                        key={item.text}
                                                        onClick={() => sendQuestion(item.text)}
                                                        className="flex items-center gap-2 px-3 py-2.5 bg-white border border-gray-100 rounded-xl text-left text-xs text-gray-600 hover:border-brand-green/40 hover:text-brand-green hover:shadow-sm transition-all"
                                                    >
                                                        <Icon size={15} className="shrink-0" />
                                                        <span className="line-clamp-2">{item.text}</span>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}

                        {isTyping && (
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-sm bg-white text-brand-green border border-gray-100">
                                    <Bot size={20} />
                                </div>

                                <div className="px-4 py-3.5 rounded-2xl shadow-sm bg-white text-gray-500 rounded-tl-md border border-gray-100">
                                    <div className="flex items-center gap-3">
                                        <Loader2 size={16} className="animate-spin text-brand-green" />
                                        <span className="text-sm italic">AI đang suy nghĩ...</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div ref={endRef}></div>
                    </div>

                    {/* Input Area */}
                    <div className="p-4 sm:p-5 bg-white border-t border-gray-100">
                        <form onSubmit={handleSend} className="relative">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                disabled={isTyping}
                                placeholder="Nhập câu hỏi của bạn..."
                                className="w-full pl-5 pr-16 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green shadow-inner disabled:opacity-60 transition-all text-sm sm:text-base"
                            />

                            <button
                                type="submit"
                                className="absolute right-2 top-1/2 -translate-y-1/2 w-11 h-11 bg-brand-green text-white rounded-xl hover:bg-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 flex items-center justify-center shadow-sm"
                                disabled={!input.trim() || isTyping}
                            >
                                {isTyping ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
                            </button>
                        </form>

                        <p className="text-center mt-3 text-xs text-gray-400">
                            AI có thể mắc lỗi. Vui lòng kiểm chứng thông tin quan trọng.
                        </p>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AIChatPage;