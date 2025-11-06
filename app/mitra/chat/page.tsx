'use client';

import { useState } from 'react';
import { useChat } from '@/lib/hooks/useChat';
import ChatWindow from '@/components/Chat/ChatWindow';

export default function ChatPage() {
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const { rooms, loading, connected } = useChat();

  const selectedRoom = rooms.find((r) => r.id === selectedRoomId);

  if (loading) {
    return (
      <div className="container-responsive py-8">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          <p className="mt-2 text-gray-600">Memuat chat rooms...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-responsive py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Live Chat</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
        {/* Rooms List */}
        <div className="lg:col-span-1 bg-white rounded-lg shadow-md p-4 overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Chat Rooms</h2>
            <div className={`w-2 h-2 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'}`} />
          </div>

          {rooms.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
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
              <p>Belum ada chat room</p>
              <p className="text-sm mt-2">Admin akan membuat room untuk Anda</p>
            </div>
          ) : (
            <div className="space-y-2">
              {rooms.map((room) => (
                <button
                  key={room.id}
                  onClick={() => setSelectedRoomId(room.id)}
                  className={`
                    w-full text-left p-3 rounded-lg transition-colors
                    ${
                      selectedRoomId === room.id
                        ? 'bg-purple-100 border-2 border-purple-600'
                        : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                    }
                  `}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-800">{room.name}</h3>
                      <p className="text-xs text-gray-500 mt-1 capitalize">
                        {room.type === 'direct' && '💬 Direct'}
                        {room.type === 'group' && '👥 Group'}
                        {room.type === 'support' && '🎧 Support'}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Chat Window */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-md overflow-hidden">
          {selectedRoomId && selectedRoom ? (
            <ChatWindow roomId={selectedRoomId} roomName={selectedRoom.name} />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              <div className="text-center">
                <svg
                  className="mx-auto h-16 w-16 text-gray-400 mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                  />
                </svg>
                <p className="text-lg font-medium">Pilih chat room</p>
                <p className="text-sm mt-1">Pilih room dari sidebar untuk memulai chat</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
