/**
 * React Hook for Chat Functionality
 */

import { useEffect, useState, useCallback, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import chatSocketClient, { ChatMessage, ChatRoom } from '@/lib/socket/client';

export function useChat(roomId?: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [currentRoom, setCurrentRoom] = useState<string | null>(roomId || null);
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const supabase = createClient();

  // Connect to Socket.io
  useEffect(() => {
    const connectSocket = async () => {
      try {
        const success = await chatSocketClient.connect();
        setConnected(success);
      } catch (err) {
        console.error('Socket connection error:', err);
        setError(err as Error);
      }
    };

    connectSocket();

    return () => {
      chatSocketClient.disconnect();
    };
  }, []);

  // Fetch user's chat rooms
  const fetchRooms = useCallback(async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('chat_room_members')
        .select(`
          room:chat_rooms (
            id,
            name,
            type,
            created_by,
            metadata,
            created_at,
            updated_at
          )
        `)
        .eq('user_id', user.id);

      if (error) throw error;

      const roomsList = data?.map((item: any) => item.room).filter(Boolean) || [];
      setRooms(roomsList);
    } catch (err) {
      console.error('Error fetching rooms:', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  // Join a room
  const joinRoom = useCallback((roomId: string) => {
    if (!connected) {
      console.warn('Socket not connected');
      return;
    }

    // Leave current room if any
    if (currentRoom && currentRoom !== roomId) {
      chatSocketClient.leaveRoom(currentRoom);
    }

    chatSocketClient.joinRoom(roomId);
    setCurrentRoom(roomId);
    setMessages([]);
  }, [connected, currentRoom]);

  // Send message
  const sendMessage = useCallback((message: string, options?: {
    type?: 'text' | 'image' | 'file';
    replyTo?: string;
    fileUrl?: string;
    fileName?: string;
    fileSize?: number;
  }) => {
    if (!currentRoom || !connected) {
      console.warn('Cannot send message: no room or not connected');
      return;
    }

    chatSocketClient.sendMessage({
      roomId: currentRoom,
      message,
      type: options?.type,
      replyTo: options?.replyTo,
      fileUrl: options?.fileUrl,
      fileName: options?.fileName,
      fileSize: options?.fileSize,
    });
  }, [currentRoom, connected]);

  // Edit message
  const editMessage = useCallback((messageId: string, newMessage: string) => {
    if (!connected) return;
    chatSocketClient.editMessage(messageId, newMessage);
  }, [connected]);

  // Delete message
  const deleteMessage = useCallback((messageId: string) => {
    if (!connected) return;
    chatSocketClient.deleteMessage(messageId);
  }, [connected]);

  // Start typing indicator
  const startTyping = useCallback(() => {
    if (!currentRoom || !connected) return;

    chatSocketClient.startTyping(currentRoom);

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Auto-stop typing after 3 seconds
    typingTimeoutRef.current = setTimeout(() => {
      stopTyping();
    }, 3000);
  }, [currentRoom, connected]);

  // Stop typing indicator
  const stopTyping = useCallback(() => {
    if (!currentRoom || !connected) return;

    chatSocketClient.stopTyping(currentRoom);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
  }, [currentRoom, connected]);

  // Mark room as read
  const markAsRead = useCallback(() => {
    if (!currentRoom || !connected) return;
    chatSocketClient.markAsRead(currentRoom);
  }, [currentRoom, connected]);

  // Add reaction
  const addReaction = useCallback((messageId: string, emoji: string) => {
    if (!connected) return;
    chatSocketClient.addReaction(messageId, emoji);
  }, [connected]);

  // Remove reaction
  const removeReaction = useCallback((messageId: string, emoji: string) => {
    if (!connected) return;
    chatSocketClient.removeReaction(messageId, emoji);
  }, [connected]);

  // Create new room (direct chat)
  const createDirectChat = useCallback(async (otherUserId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Check if room already exists
      const { data: existingRoom } = await supabase.rpc('get_or_create_direct_chat', {
        user1_id: user.id,
        user2_id: otherUserId,
      });

      if (existingRoom) {
        joinRoom(existingRoom.id);
        await fetchRooms();
        return existingRoom.id;
      }

      return null;
    } catch (err) {
      console.error('Error creating direct chat:', err);
      setError(err as Error);
      return null;
    }
  }, [supabase, joinRoom, fetchRooms]);

  // Get unread count for a room
  const getUnreadCount = useCallback(async (roomId: string): Promise<number> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return 0;

      const { data, error } = await supabase.rpc('get_unread_message_count', {
        p_user_id: user.id,
        p_room_id: roomId,
      });

      if (error) throw error;
      return data || 0;
    } catch (err) {
      console.error('Error getting unread count:', err);
      return 0;
    }
  }, [supabase]);

  // Setup socket event listeners
  useEffect(() => {
    if (!connected) return;

    // New message
    chatSocketClient.onNewMessage((message) => {
      setMessages((prev) => [...prev, message]);
    });

    // Message edited
    chatSocketClient.onMessageEdited((message) => {
      setMessages((prev) =>
        prev.map((m) => (m.id === message.id ? message : m))
      );
    });

    // Message deleted
    chatSocketClient.onMessageDeleted(({ messageId }) => {
      setMessages((prev) => prev.filter((m) => m.id !== messageId));
    });

    // Room joined
    chatSocketClient.onRoomJoined(({ messages }) => {
      setMessages(messages);
      setLoading(false);
    });

    // User typing
    chatSocketClient.onUserTyping(({ userId }) => {
      setTypingUsers((prev) => new Set(prev).add(userId));
    });

    // User stopped typing
    chatSocketClient.onUserStoppedTyping(({ userId }) => {
      setTypingUsers((prev) => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    });

    return () => {
      chatSocketClient.removeAllListeners();
    };
  }, [connected]);

  // Auto-join room if roomId provided
  useEffect(() => {
    if (roomId && connected) {
      joinRoom(roomId);
    }
  }, [roomId, connected, joinRoom]);

  // Fetch rooms on mount
  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  return {
    // State
    messages,
    rooms,
    currentRoom,
    typingUsers: Array.from(typingUsers),
    connected,
    loading,
    error,

    // Actions
    joinRoom,
    sendMessage,
    editMessage,
    deleteMessage,
    startTyping,
    stopTyping,
    markAsRead,
    addReaction,
    removeReaction,
    createDirectChat,
    getUnreadCount,
    fetchRooms,
  };
}
