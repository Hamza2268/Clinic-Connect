import ProfileHeader from "./ProfileHeader.jsx";
import ProfileSidebar from "./ProfileSidebar";
import styles from "../Style/Profile.module.css";
import style from "../Style/Sidebar.module.css";
import "../Style/Home.module.css";
import { mockConversations } from "../MockInfo"
import { ChatSideBar } from "./Patient's Components/ChatSideBar.jsx";
import { useState } from "react";


export default function MainLayout({
    sidebarOpen, setSidebarOpen,
    onMenuClick, onSearch, active, onNotificationClick, // ProfileHeader props
    userRole, userName, activeItem, onItemClick, expanded = true, // ProfileSidebar props
    children
}) {
    const [conversations, setConversations] = useState(mockConversations);
    const [chatOpen, setChatOpen] = useState(false);


    function handleOpenChat() {
        setChatOpen(true);
    }

    const handleSendMessage = (conversationId, content) => {
        const newMessage = {
            id: Date.now().toString(),
            senderId: 'user',
            content,
            timestamp: new Date(),
            isRead: true,
        };

        setConversations(prev =>
            prev.map(conv =>
                conv.id === conversationId
                    ? {
                        ...conv,
                        messages: [...conv.messages, newMessage],
                        lastMessage: content,
                        lastMessageTime: new Date(),
                    }
                    : conv
            )
        );
    };


    return (
        <div className={styles.profileContainer} style={{ margin: 0, padding: 0 }}>

            {sidebarOpen && (
                <div
                    className={style.sidebarOverlay}
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div
                className={`${style.sidebarWrapper} ${sidebarOpen ? style.open : ""}`}
            >
                <ProfileSidebar
                    userRole={userRole}
                    userName={userName}
                    activeItem={activeItem}
                    onItemClick={onItemClick}
                    expanded={expanded}
                    handleOpenChat={handleOpenChat}
                />
            </div>
            {/* Page Header */}
            <div className={styles.mainContent}>
                <ProfileHeader onMenuClick={onMenuClick} active={active} onNotificationClick={onNotificationClick} onSearch={onSearch} />

                <main className={styles.mainSection}>
                    {children}
                </main>
            </div>
            <ChatSideBar
                open={chatOpen}
                onClose={() => setChatOpen(false)}
                conversations={mockConversations}
                onSendMessage={handleSendMessage}
                initialConversationId={null}
            />
        </div>
    );
};
