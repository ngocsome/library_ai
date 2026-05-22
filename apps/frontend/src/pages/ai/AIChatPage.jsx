import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot, Send, User, Sparkles, MessageSquare, Plus, Trash2, History } from 'lucide-react';

const AIChatPage = () => {
    const navigate = useNavigate();
    const [messages, setMessages] = useState([
        { id: 1, sender: 'ai', content: 'Xin chào! Mình là trợ lý AI của Đại học Trung Vương. Mình có thể giúp gì cho việc học tập của bạn hôm nay?' }
    ]);
    const [conversations, setConversations] = useState([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [currentConvId, setCurrentConvId] = useState(null);
    const [isLoadingHistory, setIsLoadingHistory] = useState(false);
    const endRef = useRef(null);

    // 1. Fetch conversations list
    const fetchConversations = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/ai/conversations', {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            if (response.ok) {
                const data = await response.json();
                setConversations(data);
            }
        } catch (error) {
            console.error('Failed to fetch conversations:', error);
        }
    };

    // 2. Load messages for a conversation
    const loadConversation = async (convId) => {
        setIsLoadingHistory(true);
        setCurrentConvId(convId);
        try {
            const response = await fetch(`http://localhost:5000/api/ai/conversations/${convId}`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            if (response.ok) {
                const data = await response.json();
                setMessages(data.map(m => ({
                    id: m.MessageID,
                    sender: m.Sender,
                    content: m.Content
                })));
            }
        } catch (error) {
            console.error('Failed to load messages:', error);
        } finally {
            setIsLoadingHistory(false);
        }
    };

    const startNewChat = () => {
        setCurrentConvId(null);
        setMessages([
            { id: 1, sender: 'ai', content: 'Xin chào! Hãy cho mình biết bạn cần hỗ trợ gì nhé.' }
        ]);
    };

    const deleteConv = async (e, convId) => {
        e.stopPropagation();
        if (!window.confirm('Bạn có chắc chắn muốn xóa đoạn chat này?')) return;
        try {
            const response = await fetch(`http://localhost:5000/api/ai/conversations/${convId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            if (response.ok) {
                if (currentConvId === convId) startNewChat();
                fetchConversations();
            }
        } catch (error) {
            console.error('Failed to delete conversation:', error);
        }
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || isTyping) return;

        const userMsg = { id: Date.now(), sender: 'user', content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        try {
            const response = await fetch('http://localhost:5000/api/ai/chat', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ message: input, conversationId: currentConvId })
            });
            const data = await response.json();

            if (!response.ok) throw new Error(data.message || 'Có lỗi xảy ra');
            
            if (!currentConvId && data.conversationId) {
                setCurrentConvId(data.conversationId);
                fetchConversations();
            }

            const aiMsg = { id: Date.now() + 1, sender: 'ai', content: data.message };
            setMessages(prev => [...prev, aiMsg]);
        } catch (error) {
            const errorMsg = { id: Date.now() + 1, sender: 'ai', content: error.message || "Xin lỗi, hệ thống đang bận. Vui lòng thử lại sau." };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsTyping(false);
        }
    };

    useEffect(() => {
        fetchConversations();
    }, []);

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

  return (
    <div className="h-[calc(100vh-8rem)] flex max-w-6xl mx-auto border border-gray-200 rounded-2xl bg-white shadow-lg overflow-hidden mt-24 mb-6 relative">
       {/* Sidebar - History */}
       <div className="w-80 border-r border-gray-100 bg-gray-50 flex flex-col">
          <div className="p-4 border-b border-gray-100 bg-white">
             <button 
                onClick={startNewChat}
                className="w-full py-3 px-4 bg-brand-green text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-green-700 transition-all shadow-sm active:scale-95"
             >
                <Plus size={18} />
                Đoạn chat mới
             </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
             <div className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                <History size={14} />
                Lịch sử trò chuyện
             </div>
             {conversations.map((conv) => (
                <div 
                   key={conv.ConversationID}
                   onClick={() => loadConversation(conv.ConversationID)}
                   className={`group p-3 rounded-xl cursor-pointer transition-all flex items-center gap-3 ${
                      currentConvId === conv.ConversationID 
                      ? 'bg-brand-green/10 text-brand-green border border-brand-green/20 shadow-sm' 
                      : 'hover:bg-white text-gray-600 border border-transparent hover:border-gray-200 hover:shadow-sm'
                   }`}
                >
                   <MessageSquare size={18} className={currentConvId === conv.ConversationID ? 'text-brand-green' : 'text-gray-400'} />
                   <div className="flex-1 truncate text-sm font-medium">
                      {conv.Title || 'Đoạn chat mới'}
                   </div>
                   <button 
                      onClick={(e) => deleteConv(e, conv.ConversationID)}
                      className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-50 hover:text-red-500 rounded-lg transition-all"
                   >
                      <Trash2 size={14} />
                   </button>
                </div>
             ))}
             {conversations.length === 0 && (
                <div className="text-center py-10 px-4">
                   <p className="text-sm text-gray-400">Chưa có lịch sử chat</p>
                </div>
             )}
          </div>
       </div>

       {/* Chat Area */}
       <div className="flex-1 flex flex-col bg-white">
          {/* Header */}
          <div className="bg-gradient-to-r from-brand-green to-teal-500 p-4 flex items-center justify-between text-white shadow-md z-10">
             <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                   <Bot size={24} />
                </div>
                <div>
                   <h1 className="font-bold flex items-center gap-2">Trợ lý học tập AI <Sparkles size={14} className="text-yellow-300 animate-pulse"/></h1>
                   <p className="text-xs text-white/80">Luôn sẵn sàng hỗ trợ 24/7</p>
                </div>
             </div>
             {currentConvId && (
                <div className="px-3 py-1 bg-white/20 rounded-full text-xs font-medium">
                   Đang trong phiên #{currentConvId}
                </div>
             )}
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/50">
             {messages.map((msg) => (
                <div key={msg.id} className={`flex gap-4 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-sm ${msg.sender === 'ai' ? 'bg-white text-brand-green' : 'bg-brand-green text-white'}`}>
                       {msg.sender === 'ai' ? <Bot size={20}/> : <User size={20}/>}
                    </div>
                    <div className={`max-w-[75%] p-4 rounded-2xl shadow-sm text-sm leading-relaxed whitespace-pre-wrap ${
                       msg.sender === 'user' 
                       ? 'bg-brand-green text-white rounded-tr-none' 
                       : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'
                    }`}>
                       {msg.content}
                    </div>
                </div>
             ))}
             {isLoadingHistory && (
                <div className="flex justify-center py-4">
                   <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-green"></div>
                </div>
             )}
             {isTyping && (
                <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-sm bg-white text-brand-green">
                       <Bot size={20}/>
                    </div>
                    <div className="max-w-[75%] p-4 rounded-2xl shadow-sm bg-white text-gray-500 rounded-tl-none border border-gray-100 italic">
                       Đang suy nghĩ...
                    </div>
                </div>
             )}
             <div ref={endRef}></div>
          </div>

          {/* Input */}
          <div className="p-4 bg-white border-t border-gray-100">
             <form onSubmit={handleSend} className="relative">
                <input 
                   type="text" 
                   value={input}
                   onChange={(e) => setInput(e.target.value)}
                   disabled={isTyping}
                   placeholder="Nhập câu hỏi của bạn..." 
                   className="w-full pl-6 pr-14 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-green shadow-inner disabled:opacity-50"
                />
                <button 
                   type="submit"
                   className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-brand-green text-white rounded-lg hover:bg-green-700 transition-all disabled:opacity-50 disabled:scale-95 active:scale-90"
                   disabled={!input.trim() || isTyping}
                >
                   <Send size={20} />
                </button>
             </form>
             <div className="text-center mt-2">
                <span className="text-xs text-gray-400">AI có thể mắc lỗi. Vui lòng kiểm chứng thông tin quan trọng.</span>
             </div>
          </div>
       </div>
    </div>
  );
};

export default AIChatPage;
