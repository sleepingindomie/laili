/**
 * Main Chat Window Component
 */

'use client';

import { useState, useEffect } from 'react';
import { useChat } from '@/lib/hooks/useChat';
import { createClient } from '@/lib/supabase/client';
import { ChatMessage } from '@/lib/socket/client';
import MessageList from './MessageList';
import MessageInput from './MessageInput';

interface ChatWindowProps {
  roomId: string;
  roomName?: string;
}

export default function ChatWindow({ roomId, roomName }: ChatWindowProps) {
  const [currentUserId, setCurrentUserId] = useState<string>('');
  const [replyTo, setReplyTo] = useState<ChatMessage | null>(null);
  const supabase = createClient();

  const {
    messages,
    typingUsers,
    connected,
    loading,
    sendMessage,
    editMessage,
    deleteMessage,
    startTyping,
    stopTyping,
    markAsRead,
    addReaction,
  } = useChat(roomId);

  // Get current user
  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setCurrentUserId(user.id);
      }
    };
    getCurrentUser();
  }, [supabase]);

  // Mark messages as read when component mounts or messages change
  useEffect(() => {
    if (messages.length > 0) {
      markAsRead();
    }
  }, [messages, markAsRead]);

  const handleSend = (message: string) => {
    sendMessage(message, {
      replyTo: replyTo?.id,
    });
    setReplyTo(null);
  };

  const handleReply = (message: ChatMessage) => {
    setReplyTo(message);
  };

  const handleCancelReply = () => {
    setReplyTo(null);
  };

  const handleEdit = (messageId: string) => {
    const message = messages.find((m) => m.id === messageId);
    if (message) {
      const newMessage = prompt('Edit pesan:', message.message);
      if (newMessage && newMessage.trim()) {
        editMessage(messageId, newMessage.trim());
      }
    }
  };

  const handleDelete = (messageId: string) => {
    if (confirm('Hapus pesan ini?')) {
      deleteMessage(messageId);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          <p className="mt-2 text-gray-600">Memuat chat...</p>
        </div>
      </div>
    );
  }

  if (!connected) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center text-gray-600">
          <svg
            className="mx-auto h-12 w-12 text-gray-400 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414"
            />
          </svg>
          <p className="text-lg font-medium">Tidak terhubung</p>
          <p className="text-sm mt-1">Mohon refresh halaman</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="border-b p-4 bg-purple-600 text-white rounded-t-lg">
        <h2 className="text-lg font-semibold">
          {roomName || 'Chat Room'}
        </h2>
        <p className="text-sm text-purple-100">
          {connected ? 'Terhubung' : 'Tidak terhubung'}
        </p>
      </div>

      {/* Messages */}
      <MessageList
        messages={messages}
        currentUserId={currentUserId}
        typingUsers={typingUsers}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onReply={handleReply}
        onReact={addReaction}
      />

      {/* Input */}
      <MessageInput
        onSend={handleSend}
        onTyping={startTyping}
        onStopTyping={stopTyping}
        disabled={!connected}
        replyTo={replyTo}
        onCancelReply={handleCancelReply}
      />
    </div>
  );
}
