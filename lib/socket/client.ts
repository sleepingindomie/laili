/**
 * Socket.io Client Wrapper
 * Provides type-safe Socket.io client for React components
 */

import { io, Socket } from 'socket.io-client';
import { createClient } from '@/lib/supabase/client';

export interface ChatMessage {
  id: string;
  room_id: string;
  user_id: string;
  message: string;
  type: 'text' | 'image' | 'file' | 'system';
  file_url?: string;
  file_name?: string;
  file_size?: number;
  reply_to?: string;
  edited: boolean;
  edited_at?: string;
  created_at: string;
  updated_at: string;
  user?: {
    id: string;
    email?: string;
  };
}

export interface ChatRoom {
  id: string;
  name: string;
  type: 'direct' | 'group' | 'support';
  created_by?: string;
  metadata?: any;
  created_at: string;
  updated_at: string;
}

export interface TypingUser {
  userId: string;
  roomId: string;
}

export interface MessageReaction {
  id: string;
  message_id: string;
  user_id: string;
  emoji: string;
  created_at: string;
}

class ChatSocketClient {
  private socket: Socket | null = null;
  private isConnected: boolean = false;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;

  /**
   * Initialize and connect to Socket.io server
   */
  async connect(): Promise<boolean> {
    if (this.isConnected && this.socket) {
      console.log('Socket already connected');
      return true;
    }

    try {
      const supabase = createClient();
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error || !session) {
        console.error('No active session');
        return false;
      }

      const socketUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

      this.socket = io(socketUrl, {
        path: '/api/socket',
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: this.maxReconnectAttempts,
        reconnectionDelay: 1000,
      });

      // Setup event listeners
      this.socket.on('connect', () => {
        console.log('Socket connected:', this.socket?.id);
        this.isConnected = true;
        this.reconnectAttempts = 0;

        // Authenticate
        this.socket?.emit('authenticate', {
          userId: session.user.id,
          token: session.access_token,
        });
      });

      this.socket.on('authenticated', (data) => {
        console.log('Socket authenticated:', data);
      });

      this.socket.on('disconnect', (reason) => {
        console.log('Socket disconnected:', reason);
        this.isConnected = false;
      });

      this.socket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
        this.reconnectAttempts++;

        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
          console.error('Max reconnection attempts reached');
          this.disconnect();
        }
      });

      this.socket.on('error', (error) => {
        console.error('Socket error:', error);
      });

      return true;
    } catch (error) {
      console.error('Failed to connect socket:', error);
      return false;
    }
  }

  /**
   * Disconnect from Socket.io server
   */
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      console.log('Socket disconnected');
    }
  }

  /**
   * Join a chat room
   */
  joinRoom(roomId: string): void {
    if (!this.socket || !this.isConnected) {
      console.error('Socket not connected');
      return;
    }

    this.socket.emit('join_room', { roomId });
  }

  /**
   * Leave a chat room
   */
  leaveRoom(roomId: string): void {
    if (!this.socket || !this.isConnected) {
      console.error('Socket not connected');
      return;
    }

    this.socket.emit('leave_room', { roomId });
  }

  /**
   * Send a message
   */
  sendMessage(data: {
    roomId: string;
    message: string;
    type?: 'text' | 'image' | 'file' | 'system';
    replyTo?: string;
    fileUrl?: string;
    fileName?: string;
    fileSize?: number;
  }): void {
    if (!this.socket || !this.isConnected) {
      console.error('Socket not connected');
      return;
    }

    this.socket.emit('send_message', data);
  }

  /**
   * Edit a message
   */
  editMessage(messageId: string, newMessage: string): void {
    if (!this.socket || !this.isConnected) {
      console.error('Socket not connected');
      return;
    }

    this.socket.emit('edit_message', { messageId, newMessage });
  }

  /**
   * Delete a message
   */
  deleteMessage(messageId: string): void {
    if (!this.socket || !this.isConnected) {
      console.error('Socket not connected');
      return;
    }

    this.socket.emit('delete_message', { messageId });
  }

  /**
   * Start typing indicator
   */
  startTyping(roomId: string): void {
    if (!this.socket || !this.isConnected) return;
    this.socket.emit('typing_start', { roomId });
  }

  /**
   * Stop typing indicator
   */
  stopTyping(roomId: string): void {
    if (!this.socket || !this.isConnected) return;
    this.socket.emit('typing_stop', { roomId });
  }

  /**
   * Mark room as read
   */
  markAsRead(roomId: string): void {
    if (!this.socket || !this.isConnected) return;
    this.socket.emit('mark_read', { roomId });
  }

  /**
   * Add reaction to message
   */
  addReaction(messageId: string, emoji: string): void {
    if (!this.socket || !this.isConnected) return;
    this.socket.emit('add_reaction', { messageId, emoji });
  }

  /**
   * Remove reaction from message
   */
  removeReaction(messageId: string, emoji: string): void {
    if (!this.socket || !this.isConnected) return;
    this.socket.emit('remove_reaction', { messageId, emoji });
  }

  /**
   * Listen for new messages
   */
  onNewMessage(callback: (message: ChatMessage) => void): void {
    if (!this.socket) return;
    this.socket.on('new_message', callback);
  }

  /**
   * Listen for message edits
   */
  onMessageEdited(callback: (message: ChatMessage) => void): void {
    if (!this.socket) return;
    this.socket.on('message_edited', callback);
  }

  /**
   * Listen for message deletions
   */
  onMessageDeleted(callback: (data: { messageId: string }) => void): void {
    if (!this.socket) return;
    this.socket.on('message_deleted', callback);
  }

  /**
   * Listen for user joined
   */
  onUserJoined(callback: (data: { userId: string; roomId: string }) => void): void {
    if (!this.socket) return;
    this.socket.on('user_joined', callback);
  }

  /**
   * Listen for user left
   */
  onUserLeft(callback: (data: { userId: string; roomId: string }) => void): void {
    if (!this.socket) return;
    this.socket.on('user_left', callback);
  }

  /**
   * Listen for room joined
   */
  onRoomJoined(callback: (data: { roomId: string; messages: ChatMessage[] }) => void): void {
    if (!this.socket) return;
    this.socket.on('room_joined', callback);
  }

  /**
   * Listen for typing indicator
   */
  onUserTyping(callback: (data: TypingUser) => void): void {
    if (!this.socket) return;
    this.socket.on('user_typing', callback);
  }

  /**
   * Listen for stopped typing
   */
  onUserStoppedTyping(callback: (data: TypingUser) => void): void {
    if (!this.socket) return;
    this.socket.on('user_stopped_typing', callback);
  }

  /**
   * Listen for messages read
   */
  onMessagesRead(callback: (data: { userId: string; roomId: string }) => void): void {
    if (!this.socket) return;
    this.socket.on('messages_read', callback);
  }

  /**
   * Listen for reaction added
   */
  onReactionAdded(callback: (reaction: MessageReaction) => void): void {
    if (!this.socket) return;
    this.socket.on('reaction_added', callback);
  }

  /**
   * Listen for reaction removed
   */
  onReactionRemoved(callback: (data: { messageId: string; userId: string; emoji: string }) => void): void {
    if (!this.socket) return;
    this.socket.on('reaction_removed', callback);
  }

  /**
   * Remove all listeners
   */
  removeAllListeners(): void {
    if (!this.socket) return;
    this.socket.removeAllListeners();
  }

  /**
   * Check if socket is connected
   */
  getIsConnected(): boolean {
    return this.isConnected;
  }

  /**
   * Get socket instance
   */
  getSocket(): Socket | null {
    return this.socket;
  }
}

// Singleton instance
const chatSocketClient = new ChatSocketClient();

export default chatSocketClient;
