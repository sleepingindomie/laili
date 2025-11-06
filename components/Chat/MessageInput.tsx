/**
 * Chat Message Input Component
 */

import { useState, useRef, KeyboardEvent } from 'react';
import { ChatMessage } from '@/lib/socket/client';

interface MessageInputProps {
  onSend: (message: string) => void;
  onTyping: () => void;
  onStopTyping: () => void;
  disabled?: boolean;
  replyTo?: ChatMessage | null;
  onCancelReply?: () => void;
}

export default function MessageInput({
  onSend,
  onTyping,
  onStopTyping,
  disabled = false,
  replyTo,
  onCancelReply,
}: MessageInputProps) {
  const [message, setMessage] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);

    // Trigger typing indicator
    onTyping();

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Stop typing after 1 second of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      onStopTyping();
    }, 1000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim() || disabled) return;

    onSend(message.trim());
    setMessage('');
    onStopTyping();

    // Clear typing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Focus back to input
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  return (
    <div className="border-t bg-white p-4">
      {/* Reply indicator */}
      {replyTo && (
        <div className="mb-2 bg-gray-100 rounded-lg p-2 flex items-start justify-between">
          <div className="flex-1">
            <p className="text-xs text-gray-600 mb-1">
              Membalas {replyTo.user?.email?.split('@')[0]}
            </p>
            <p className="text-sm text-gray-800 truncate">
              {replyTo.message}
            </p>
          </div>
          <button
            onClick={onCancelReply}
            className="text-gray-500 hover:text-gray-700 ml-2"
          >
            ✕
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex items-end gap-2">
        <div className="flex-1">
          <textarea
            ref={inputRef}
            value={message}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Ketik pesan..."
            disabled={disabled}
            rows={1}
            className="
              w-full px-4 py-2 rounded-full border border-gray-300
              focus:outline-none focus:ring-2 focus:ring-purple-500
              resize-none disabled:opacity-50 disabled:cursor-not-allowed
              max-h-32
            "
            style={{
              minHeight: '40px',
              maxHeight: '128px',
            }}
          />
        </div>

        <button
          type="submit"
          disabled={disabled || !message.trim()}
          className="
            px-6 py-2 bg-purple-600 text-white rounded-full
            hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed
            transition-colors flex-shrink-0
          "
        >
          Kirim
        </button>
      </form>

      <p className="text-xs text-gray-500 mt-2">
        Tekan Enter untuk kirim, Shift + Enter untuk baris baru
      </p>
    </div>
  );
}
