import { useEffect, useRef, useState } from 'react';
import { Button, IconButton, TextField, Badge, Box } from '@mui/material';
import { X, Send, ArrowLeft, MessageCircle } from 'lucide-react';


export function ChatSideBar({
    open,
    onClose,
    conversations,
    onSendMessage,
    initialConversationId,
    PL,
    NewChat
}) {
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [conversations]);

    // 0 >>> Lab
    // 1 >>> Pharmacy
    // 2 >>> Doctor
    const [activeConversation, setActiveConversation] = useState(null);
    const [currentConversation, setCurrentConversation] = useState(null);

    useEffect(() => {
        if (open && initialConversationId) {
            setCurrentConversation(conversations.find(c => {
                if (PL === 2) return c.doctorId === initialConversationId;      // Doctor
                if (PL === 1) return c.pharmacyId === initialConversationId;    // Pharmacy
                if (PL === 0) return c.labId === initialConversationId;         // Lab
                return false;
            }));
            if (!currentConversation && initialConversationId) {
                NewChat({
                    id: conversations.length + 1,
                    doctorId: '1',
                    Name: 'Dr Mohamed',
                    Avatar: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=200&h=200&fit=crop',
                    lastMessage: 'Thank you for your order!',
                    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 24),
                    unreadCount: 0,
                    messages: []
                });
            }
            if (currentConversation) {
                setActiveConversation(currentConversation.id);
            } else {
                setActiveConversation(null);
            }
        }
    }, [open, initialConversationId, PL, conversations, currentConversation]);

    // const currentConversation = initialConversationId ?
    //     conversations.find(c =>
    //         PL > 0 ?
    //             PL == 1 ? c.pharmacyId == initialConversationId
    //                 : c.doctorId == initialConversationId
    //             : c.labId == initialConversationId
    //     )
    //     : null;

    // const [activeConversation, setActiveConversation] = useState(
    //     currentConversation?.id
    // );

    const [message, setMessage] = useState('');

    const handleSend = () => {
        // console.log(message);
        if (message.trim() && activeConversation) {
            onSendMessage(activeConversation, message);
            setMessage('');
        }
        setTimeout(scrollToBottom, 100);
    };

    const formatTime = (date) => {
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const days = Math.floor(hours / 24);

        if (days > 0) return `${days}d ago`;
        if (hours > 0) return `${hours}h ago`;
        return 'Just now';
    };

    if (!open) return null;
    console.log("here");
    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40 lg:hidden"
                onClick={onClose}
            />

            {/* Sidebar */}
            <div className="fixed right-0 top-0 h-full w-full sm:w-96 bg-card border-l z-50 shadow-elevated flex flex-col animate-slide-in-right">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b bg-white">
                    <div className="flex items-center gap-3">
                        {activeConversation && (
                            <IconButton
                                size="small"
                                onClick={() => setActiveConversation(null)}
                                sx={{ width: 32, height: 32 }}
                            >
                                <ArrowLeft className="h-4 w-4" />
                            </IconButton>
                        )}
                        <div className="flex items-center gap-2">
                            <MessageCircle className="h-5 w-5 text-primary" />
                            <h2 className={`${activeConversation ? '!text-lg' : ""} font-heading font-semibold `}>
                                {activeConversation ? currentConversation?.Name : 'Messages'}
                            </h2>
                        </div>
                    </div>
                    <IconButton size="small" onClick={onClose}>
                        <X className="h-5 w-5" />
                    </IconButton>
                </div>

                {/* Content */}
                {!activeConversation ? (
                    <Box sx={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', backgroundColor: "#fff" }}>
                        <div className="p-2">
                            {conversations.map(conversation => (
                                <button
                                    key={conversation.id}
                                    onClick={() => setActiveConversation(conversation.id)}
                                    className="w-full p-3 rounded-xl hover:bg-secondary transition-colors flex items-start gap-3 text-left"
                                >
                                    <Badge
                                        badgeContent={conversation.unreadCount}
                                        color="primary"
                                        invisible={conversation.unreadCount === 0}
                                        overlap="circular"
                                        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                                        sx={{
                                            '& .MuiBadge-badge': {
                                                fontSize: '0.65rem',
                                                minWidth: 18,
                                                height: 18,
                                            }
                                        }}
                                    >
                                        <img
                                            src={conversation.Avatar}
                                            alt={conversation.Name}
                                            className="w-12 h-12 rounded-xl object-cover"
                                        />
                                    </Badge>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                            <span className="font-semibold text-foreground truncate">
                                                {conversation.Name}
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                                {formatTime(conversation.lastMessageTime)}
                                            </span>
                                        </div>
                                        <p className="text-sm text-muted-foreground truncate mt-0.5">
                                            {conversation.lastMessage}
                                        </p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </Box>
                ) : (
                    <>
                        <Box sx={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', p: 2, backgroundColor: "#fff" }}>
                            <div className="space-y-4">
                                {currentConversation?.messages.map(msg => (
                                    <div
                                        key={msg.id}
                                        className={`flex ${msg.senderId === 'user' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div
                                            className={`max-w-[80%] px-4 py-2.5 rounded-2xl ${msg.senderId === 'user'
                                                ? 'bg-primary text-primary-foreground rounded-br-md'
                                                : 'bg-secondary text-secondary-foreground rounded-bl-md'
                                                }`}
                                        >
                                            <p className="text-sm">{msg.content}</p>
                                            <p
                                                className={`text-xs mt-1 ${msg.senderId === 'user'
                                                    ? 'text-primary-foreground/70'
                                                    : 'text-muted-foreground'
                                                    }`}
                                            >
                                                {formatTime(msg.timestamp)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div ref={messagesEndRef} />
                        </Box>

                        {/* Message Input */}
                        <div className="p-4  bg-card" style={{ backgroundColor: "#fff" }}>
                            <div className="flex gap-2">
                                <TextField
                                    placeholder="Type a message..."
                                    value={message}
                                    onChange={e => setMessage(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && handleSend()}
                                    size="small"
                                    fullWidth
                                    autoFocus
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: '12px',
                                        }
                                    }}
                                />
                                <Button
                                    onClick={handleSend}
                                    disabled={!message.trim()}
                                    variant="contained"
                                    sx={{
                                        minWidth: 48,
                                        borderRadius: '12px',
                                    }}
                                >
                                    <Send className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </>
    );
}
