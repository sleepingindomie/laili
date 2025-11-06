/**
 * Chat Message Bubble Component
 */

import { ChatMessage } from '@/lib/socket/client';
import { formatDistanceToNow } from '@/lib/utils/date';

interface MessageBubbleProps {
  message: ChatMessage;
  isOwn: boolean;
  onEdit?: (messageId: string) => void;
  onDelete?: (messageId: string) => void;
  onReply?: (message: ChatMessage) => void;
  onReact?: (messageId: string, emoji: string) => void;
}

export default function MessageBubble({
  message,
  isOwn,
  onEdit,
  onDelete,
  onReply,
  onReact,
}: MessageBubbleProps) {
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4 group`}>
      <div className={`max-w-[70%] ${isOwn ? 'order-2' : 'order-1'}`}>
        {/* Sender name for others' messages */}
        {!isOwn && message.user?.email && (
          <p className="text-xs text-gray-600 mb-1 ml-2">
            {message.user.email.split('@')[0]}
          </p>
        )}

        {/* Message bubble */}
        <div
          className={`
            px-4 py-2 rounded-2xl relative
            ${isOwn
              ? 'bg-purple-600 text-white rounded-tr-sm'
              : 'bg-gray-200 text-gray-800 rounded-tl-sm'
            }
          `}
        >
          {/* Reply indicator */}
          {message.reply_to && (
            <div className={`
              text-xs mb-1 pb-1 border-l-2 pl-2 mb-2
              ${isOwn ? 'border-purple-300 text-purple-100' : 'border-gray-400 text-gray-600'}
            `}>
              Membalas pesan
            </div>
          )}

          {/* Message content */}
          <p className="text-sm break-words">{message.message}</p>

          {/* File attachment */}
          {message.type === 'file' && message.file_url && (
            <a
              href={message.file_url}
              target="_blank"
              rel="noopener noreferrer"
              className={`
                block mt-2 text-xs underline
                ${isOwn ? 'text-purple-100' : 'text-purple-600'}
              `}
            >
              📎 {message.file_name || 'Download file'}
            </a>
          )}

          {/* Image attachment */}
          {message.type === 'image' && message.file_url && (
            <img
              src={message.file_url}
              alt="Attachment"
              className="mt-2 rounded-lg max-w-full h-auto"
            />
          )}

          {/* Timestamp and edited indicator */}
          <div className={`
            text-xs mt-1 flex items-center gap-1
            ${isOwn ? 'text-purple-200' : 'text-gray-500'}
          `}>
            <span>{formatTime(message.created_at)}</span>
            {message.edited && <span>(edited)</span>}
          </div>
        </div>

        {/* Action buttons (show on hover) */}
        <div className={`
          flex gap-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity
          ${isOwn ? 'justify-end' : 'justify-start'}
        `}>
          <button
            onClick={() => onReply?.(message)}
            className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1"
          >
            Balas
          </button>

          {isOwn && (
            <>
              <button
                onClick={() => onEdit?.(message.id)}
                className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete?.(message.id)}
                className="text-xs text-red-500 hover:text-red-700 px-2 py-1"
              >
                Hapus
              </button>
            </>
          )}

          <button
            onClick={() => onReact?.(message.id, '👍')}
            className="text-xs hover:scale-125 transition-transform px-1"
          >
            👍
          </button>
          <button
            onClick={() => onReact?.(message.id, '❤️')}
            className="text-xs hover:scale-125 transition-transform px-1"
          >
            ❤️
          </button>
        </div>
      </div>
    </div>
  );
}
