"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Send } from "lucide-react";

interface Message {
  id: number;
  sender: "user" | "other";
  content: string;
  timestamp: string;
}

interface Conversation {
  id: number;
  with: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
}

export default function FatherMessage() {
  const searchParams = useSearchParams();
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: 1,
      with: "Juan Pérez",
      lastMessage: "Hola, ¿cómo va el proyecto?",
      timestamp: "10:30 AM",
      unreadCount: 2,
    },
    {
      id: 2,
      with: "María García",
      lastMessage: "Necesito los informes para mañana",
      timestamp: "11:45 AM",
      unreadCount: 1,
    },
    {
      id: 3,
      with: "Carlos Rodríguez",
      lastMessage: "¿Podemos reunirnos hoy?",
      timestamp: "2:15 PM",
      unreadCount: 0,
    },
    {
      id: 4,
      with: "Ana Martínez",
      lastMessage: "Gracias por la información",
      timestamp: "Ayer",
      unreadCount: 0,
    },
    {
      id: 5,
      with: "Luis Sánchez",
      lastMessage: "¿Cuándo es la próxima reunión?",
      timestamp: "Ayer",
      unreadCount: 3,
    },
  ]);
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const conversationId = searchParams.get("conversationId");
    if (conversationId) {
      const conversation = conversations.find(
        (conv) => conv.id === parseInt(conversationId)
      );
      if (conversation) {
        handleConversationSelect(conversation);
      }
    }
  }, [searchParams]);

  const filteredConversations = conversations.filter((conv) =>
    conv.with.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleConversationSelect = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    // Simular la carga de mensajes
    setMessages([
      {
        id: 1,
        sender: "other",
        content: "Hola, ¿cómo estás?",
        timestamp: "10:30 AM",
      },
      {
        id: 2,
        sender: "user",
        content: "¡Hola! Estoy bien, gracias. ¿Y tú?",
        timestamp: "10:31 AM",
      },
      {
        id: 3,
        sender: "other",
        content: "Muy bien también. ¿Cómo va el proyecto?",
        timestamp: "10:32 AM",
      },
    ]);
    // Actualizar el estado de la conversación para marcar los mensajes como leídos
    setConversations(
      conversations.map((conv) =>
        conv.id === conversation.id ? { ...conv, unreadCount: 0 } : conv
      )
    );
  };

  const sendMessage = () => {
    if (newMessage.trim() && selectedConversation) {
      const newMsg: Message = {
        id: messages.length + 1,
        sender: "user",
        content: newMessage,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages([...messages, newMsg]);
      setNewMessage("");
      // Actualizar la última mensaje en la lista de conversaciones
      setConversations(
        conversations.map((conv) =>
          conv.id === selectedConversation.id
            ? { ...conv, lastMessage: newMessage }
            : conv
        )
      );
    }
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="flex h-screen bg-gray-100">
        {/* Área de mensajes */}
        <div className="flex-grow">
          {selectedConversation ? (
            <div className="flex flex-col h-full">
              <div className="bg-white p-4 shadow-md">
                <h2 className="text-xl font-semibold">
                  {selectedConversation.with}
                </h2>
              </div>
              <ScrollArea className="flex-grow p-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.sender === "user"
                        ? "justify-end"
                        : "justify-start"
                    } mb-4`}
                  >
                    <div
                      className={`flex ${
                        message.sender === "user"
                          ? "flex-row-reverse"
                          : "flex-row"
                      } items-end`}
                    >
                      <Avatar className="w-8 h-8">
                        <AvatarImage
                          src={
                            message.sender === "user"
                              ? "/placeholder-avatar.jpg"
                              : `/placeholder-${selectedConversation.with}.jpg`
                          }
                        />
                        <AvatarFallback>
                          {message.sender === "user"
                            ? "U"
                            : selectedConversation.with[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div
                        className={`mx-2 p-3 rounded-lg ${
                          message.sender === "user"
                            ? "bg-blue-500 text-white"
                            : "bg-gray-200"
                        }`}
                      >
                        <p>{message.content}</p>
                        <p className="text-xs mt-1 opacity-70">
                          {message.timestamp}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </ScrollArea>
              <div className="p-4 bg-white border-t">
                <div className="flex space-x-2">
                  <Input
                    placeholder="Escribe un mensaje..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        sendMessage();
                      }
                    }}
                  />
                  <Button onClick={sendMessage}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center bg-gray-50">
              <p className="text-xl text-gray-500">
                Selecciona una conversación para comenzar
              </p>
            </div>
          )}
        </div>

        {/* Lista de conversaciones (ahora a la derecha) */}
        <div className="w-1/3 bg-white border-l border-gray-200">
          <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Mensajes</h2>
            <div className="relative mb-4">
              <Input
                type="text"
                placeholder="Buscar conversaciones..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full"
              />
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
            </div>
            <Button
              onClick={() => {
                /* Lógica para nuevo mensaje */
              }}
              className="w-full mb-4"
            >
              Nuevo Mensaje
            </Button>
          </div>
          <ScrollArea className="h-[calc(100vh-200px)]">
            {filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 ${
                  selectedConversation?.id === conversation.id
                    ? "bg-blue-50"
                    : ""
                }`}
                onClick={() => handleConversationSelect(conversation)}
              >
                <div className="flex items-center">
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarImage
                      src={`/placeholder-${conversation.with}.jpg`}
                      alt={conversation.with}
                    />
                    <AvatarFallback>{conversation.with[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-grow">
                    <div className="flex justify-between items-baseline">
                      <h3 className="font-semibold">{conversation.with}</h3>
                      <span className="text-xs text-gray-500">
                        {conversation.timestamp}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 truncate">
                      {conversation.lastMessage}
                    </p>
                  </div>
                  {conversation.unreadCount > 0 && (
                    <span className="bg-blue-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center ml-2">
                      {conversation.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </ScrollArea>
        </div>
      </div>
    </Suspense>
  );
}
