/**
 * Chat Message List Component
 */

import { useEffect, useRef } from 'react';
import { ChatMessage } from '@/lib/socket/client';
import MessageBubble from './MessageBubble';

interface MessageListProps {
  messages: ChatMessage[];
  currentUserId: string;
  typingUsers?: string[];
  onEdit?: (messageId: string) => void;
  onDelete?: (messageId: string) => void;
  onReply?: (message: ChatMessage) => void;
  onReact?: (messageId: string, emoji: string) => void;
}

export default function MessageList({
  messages,
  currentUserId,
  typingUsers = [],
  onEdit,
  onDelete,
  onReply,
  onReact,
}: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        <div className="text-center">
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
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          <p className="text-lg font-medium">Belum ada pesan</p>
          <p className="text-sm mt-1">Mulai percakapan dengan mengirim pesan</p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50"
    >
      {messages.map((message) => (
        <MessageBubble
          key={message.id}
          message={message}
          isOwn={message.user_id === currentUserId}
          onEdit={onEdit}
          onDelete={onDelete}
          onReply={onReply}
          onReact={onReact}
        />
      ))}

      {/* Typing indicator */}
      {typingUsers.length > 0 && (
        <div className="flex justify-start mb-4">
          <div className="bg-gray-200 rounded-2xl px-4 py-2 rounded-tl-sm">
            <div className="flex gap-1">
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></span>
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></span>
            </div>
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}
