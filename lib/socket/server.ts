/**
 * Socket.io Server Configuration
 * Handles real-time chat functionality
 */

import { Server as HTTPServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client for server-side operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export class ChatSocketServer {
  private io: SocketIOServer;

  constructor(httpServer: HTTPServer) {
    this.io = new SocketIOServer(httpServer, {
      cors: {
        origin: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
        methods: ['GET', 'POST'],
        credentials: true,
      },
      path: '/api/socket',
    });

    this.setupEventHandlers();
  }

  private setupEventHandlers() {
    this.io.on('connection', (socket: Socket) => {
      console.log(`Client connected: ${socket.id}`);

      // Authentication
      socket.on('authenticate', async (data: { userId: string; token: string }) => {
        try {
          // Verify token with Supabase
          const { data: { user }, error } = await supabase.auth.getUser(data.token);

          if (error || !user) {
            socket.emit('error', { message: 'Authentication failed' });
            socket.disconnect();
            return;
          }

          // Store user info in socket
          socket.data.userId = user.id;
          socket.data.userEmail = user.email;

          socket.emit('authenticated', { userId: user.id });
          console.log(`User authenticated: ${user.id}`);
        } catch (error) {
          console.error('Authentication error:', error);
          socket.emit('error', { message: 'Authentication error' });
        }
      });

      // Join chat room
      socket.on('join_room', async (data: { roomId: string }) => {
        try {
          const { roomId } = data;
          const userId = socket.data.userId;

          if (!userId) {
            socket.emit('error', { message: 'Not authenticated' });
            return;
          }

          // Verify user is member of the room
          const { data: membership, error } = await supabase
            .from('chat_room_members')
            .select('*')
            .eq('room_id', roomId)
            .eq('user_id', userId)
            .single();

          if (error || !membership) {
            socket.emit('error', { message: 'Not authorized to join this room' });
            return;
          }

          // Join the Socket.io room
          socket.join(roomId);
          socket.data.currentRoom = roomId;

          // Notify room members
          this.io.to(roomId).emit('user_joined', {
            userId,
            roomId,
            timestamp: new Date().toISOString(),
          });

          // Send room history (last 50 messages)
          const { data: messages } = await supabase
            .from('messages')
            .select('*, user:auth.users(id, email)')
            .eq('room_id', roomId)
            .order('created_at', { ascending: false })
            .limit(50);

          socket.emit('room_joined', {
            roomId,
            messages: messages?.reverse() || [],
          });

          console.log(`User ${userId} joined room ${roomId}`);
        } catch (error) {
          console.error('Join room error:', error);
          socket.emit('error', { message: 'Failed to join room' });
        }
      });

      // Leave chat room
      socket.on('leave_room', (data: { roomId: string }) => {
        const { roomId } = data;
        const userId = socket.data.userId;

        socket.leave(roomId);
        socket.data.currentRoom = null;

        this.io.to(roomId).emit('user_left', {
          userId,
          roomId,
          timestamp: new Date().toISOString(),
        });

        console.log(`User ${userId} left room ${roomId}`);
      });

      // Send message
      socket.on('send_message', async (data: {
        roomId: string;
        message: string;
        type?: string;
        replyTo?: string;
        fileUrl?: string;
        fileName?: string;
        fileSize?: number;
      }) => {
        try {
          const userId = socket.data.userId;

          if (!userId) {
            socket.emit('error', { message: 'Not authenticated' });
            return;
          }

          const { roomId, message, type = 'text', replyTo, fileUrl, fileName, fileSize } = data;

          // Save message to database
          const { data: newMessage, error } = await supabase
            .from('messages')
            .insert({
              room_id: roomId,
              user_id: userId,
              message,
              type,
              reply_to: replyTo,
              file_url: fileUrl,
              file_name: fileName,
              file_size: fileSize,
            })
            .select('*, user:auth.users(id, email)')
            .single();

          if (error) {
            console.error('Save message error:', error);
            socket.emit('error', { message: 'Failed to save message' });
            return;
          }

          // Broadcast message to room
          this.io.to(roomId).emit('new_message', newMessage);

          // Update room's updated_at
          await supabase
            .from('chat_rooms')
            .update({ updated_at: new Date().toISOString() })
            .eq('id', roomId);

          console.log(`Message sent in room ${roomId}`);
        } catch (error) {
          console.error('Send message error:', error);
          socket.emit('error', { message: 'Failed to send message' });
        }
      });

      // Edit message
      socket.on('edit_message', async (data: {
        messageId: string;
        newMessage: string;
      }) => {
        try {
          const userId = socket.data.userId;
          const { messageId, newMessage } = data;

          // Update message in database
          const { data: updatedMessage, error } = await supabase
            .from('messages')
            .update({
              message: newMessage,
              edited: true,
              edited_at: new Date().toISOString(),
            })
            .eq('id', messageId)
            .eq('user_id', userId)
            .select('*, user:auth.users(id, email)')
            .single();

          if (error) {
            socket.emit('error', { message: 'Failed to edit message' });
            return;
          }

          // Broadcast update to room
          const roomId = socket.data.currentRoom;
          if (roomId) {
            this.io.to(roomId).emit('message_edited', updatedMessage);
          }
        } catch (error) {
          console.error('Edit message error:', error);
          socket.emit('error', { message: 'Failed to edit message' });
        }
      });

      // Delete message
      socket.on('delete_message', async (data: { messageId: string }) => {
        try {
          const userId = socket.data.userId;
          const { messageId } = data;

          // Delete message from database
          const { error } = await supabase
            .from('messages')
            .delete()
            .eq('id', messageId)
            .eq('user_id', userId);

          if (error) {
            socket.emit('error', { message: 'Failed to delete message' });
            return;
          }

          // Broadcast deletion to room
          const roomId = socket.data.currentRoom;
          if (roomId) {
            this.io.to(roomId).emit('message_deleted', { messageId });
          }
        } catch (error) {
          console.error('Delete message error:', error);
          socket.emit('error', { message: 'Failed to delete message' });
        }
      });

      // Typing indicator
      socket.on('typing_start', async (data: { roomId: string }) => {
        try {
          const userId = socket.data.userId;
          const { roomId } = data;

          // Update typing indicator in database
          await supabase
            .from('typing_indicators')
            .upsert({
              room_id: roomId,
              user_id: userId,
              is_typing: true,
              updated_at: new Date().toISOString(),
            });

          // Broadcast to room (except sender)
          socket.to(roomId).emit('user_typing', { userId, roomId });
        } catch (error) {
          console.error('Typing start error:', error);
        }
      });

      socket.on('typing_stop', async (data: { roomId: string }) => {
        try {
          const userId = socket.data.userId;
          const { roomId } = data;

          // Update typing indicator in database
          await supabase
            .from('typing_indicators')
            .upsert({
              room_id: roomId,
              user_id: userId,
              is_typing: false,
              updated_at: new Date().toISOString(),
            });

          // Broadcast to room (except sender)
          socket.to(roomId).emit('user_stopped_typing', { userId, roomId });
        } catch (error) {
          console.error('Typing stop error:', error);
        }
      });

      // Mark room as read
      socket.on('mark_read', async (data: { roomId: string }) => {
        try {
          const userId = socket.data.userId;
          const { roomId } = data;

          // Update last_read_at
          await supabase.rpc('mark_room_as_read', {
            p_user_id: userId,
            p_room_id: roomId,
          });

          // Broadcast read status to room
          this.io.to(roomId).emit('messages_read', { userId, roomId });
        } catch (error) {
          console.error('Mark read error:', error);
        }
      });

      // Add reaction
      socket.on('add_reaction', async (data: {
        messageId: string;
        emoji: string;
      }) => {
        try {
          const userId = socket.data.userId;
          const { messageId, emoji } = data;

          // Add reaction to database
          const { data: reaction, error } = await supabase
            .from('message_reactions')
            .insert({
              message_id: messageId,
              user_id: userId,
              emoji,
            })
            .select()
            .single();

          if (error) {
            socket.emit('error', { message: 'Failed to add reaction' });
            return;
          }

          // Broadcast to room
          const roomId = socket.data.currentRoom;
          if (roomId) {
            this.io.to(roomId).emit('reaction_added', reaction);
          }
        } catch (error) {
          console.error('Add reaction error:', error);
        }
      });

      // Remove reaction
      socket.on('remove_reaction', async (data: {
        messageId: string;
        emoji: string;
      }) => {
        try {
          const userId = socket.data.userId;
          const { messageId, emoji } = data;

          // Remove reaction from database
          await supabase
            .from('message_reactions')
            .delete()
            .eq('message_id', messageId)
            .eq('user_id', userId)
            .eq('emoji', emoji);

          // Broadcast to room
          const roomId = socket.data.currentRoom;
          if (roomId) {
            this.io.to(roomId).emit('reaction_removed', { messageId, userId, emoji });
          }
        } catch (error) {
          console.error('Remove reaction error:', error);
        }
      });

      // Disconnect
      socket.on('disconnect', async () => {
        const userId = socket.data.userId;
        const roomId = socket.data.currentRoom;

        if (roomId && userId) {
          // Clear typing indicator
          await supabase
            .from('typing_indicators')
            .delete()
            .eq('room_id', roomId)
            .eq('user_id', userId);

          // Notify room
          this.io.to(roomId).emit('user_disconnected', { userId, roomId });
        }

        console.log(`Client disconnected: ${socket.id}`);
      });
    });
  }

  public getIO(): SocketIOServer {
    return this.io;
  }
}

export default ChatSocketServer;
