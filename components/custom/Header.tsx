"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Bell,
  Settings,
  LogOut,
  CreditCard,
  Building,
  User,
  X,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRouter } from "next/navigation";

interface HeaderProps {
  title: string;
}

interface Notification {
  id: number;
  message: string;
  read: boolean;
}

interface Conversation {
  id: number;
  with: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
}

export default function Header({ title }: HeaderProps) {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: 1, message: "Nueva factura creada", read: false },
    { id: 2, message: "Pago recibido", read: false },
    { id: 3, message: "Recordatorio: Factura vencida", read: false },
  ]);
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
  ]);

  const router = useRouter();

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;
  const totalUnreadMessages = conversations.reduce(
    (sum, conv) => sum + conv.unreadCount,
    0
  );

  const markNotificationAsRead = (id: number) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const openConversation = (id: number) => {
    router.push(`/Messages?conversationId=${id}`);
  };

  return (
    <header className="bg-white p-4 flex justify-between items-center sticky top-0 z-10 shadow-md">
      <div className="flex items-center space-x-4">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="text-gray-600 hover:text-gray-800"
        ></motion.button>
        <h2 className="text-xl font-semibold bg-gradient-to-r from-green-400 to-blue-500 text-transparent bg-clip-text">
          {title}
        </h2>
      </div>
      <div className="flex items-center space-x-4">
        <Popover>
          <PopoverTrigger asChild>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="text-gray-600 hover:text-gray-800 relative"
            >
              <Mail className="h-5 w-5" />
              {totalUnreadMessages > 0 && (
                <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center bg-blue-500">
                  {totalUnreadMessages}
                </Badge>
              )}
            </motion.button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold">Conversaciones</h3>
            </div>
            <ScrollArea className="h-[300px]">
              {conversations.length === 0 ? (
                <p className="text-center text-gray-500">
                  No hay conversaciones
                </p>
              ) : (
                conversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={`p-2 mb-2 rounded cursor-pointer ${
                      conversation.unreadCount > 0
                        ? "bg-blue-50"
                        : "bg-gray-100"
                    }`}
                    onClick={() => openConversation(conversation.id)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold">{conversation.with}</p>
                        <p className="text-sm text-gray-600 truncate">
                          {conversation.lastMessage}
                        </p>
                        <p className="text-xs text-gray-400">
                          {conversation.timestamp}
                        </p>
                      </div>
                      {conversation.unreadCount > 0 && (
                        <Badge className="bg-blue-500">
                          {conversation.unreadCount}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))
              )}
            </ScrollArea>
          </PopoverContent>
        </Popover>
        <Popover>
          <PopoverTrigger asChild>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="text-gray-600 hover:text-gray-800 relative"
            >
              <Bell className="h-5 w-5" />
              {unreadNotificationsCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center bg-green-500">
                  {unreadNotificationsCount}
                </Badge>
              )}
            </motion.button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold">Notificaciones</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllNotificationsAsRead}
              >
                Marcar todas como leídas
              </Button>
            </div>
            <ScrollArea className="h-[300px]">
              {notifications.length === 0 ? (
                <p className="text-center text-gray-500">
                  No hay notificaciones
                </p>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-2 mb-2 rounded ${
                      notification.read ? "bg-gray-100" : "bg-blue-50"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <p
                        className={`text-sm ${
                          notification.read ? "text-gray-600" : "text-blue-600"
                        }`}
                      >
                        {notification.message}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteNotification(notification.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    {!notification.read && (
                      <Button
                        variant="link"
                        size="sm"
                        className="mt-1 p-0 h-auto"
                        onClick={() => markNotificationAsRead(notification.id)}
                      >
                        Marcar como leída
                      </Button>
                    )}
                  </div>
                ))
              )}
            </ScrollArea>
          </PopoverContent>
        </Popover>
        <DropdownMenu
          open={isProfileMenuOpen}
          onOpenChange={setIsProfileMenuOpen}
        >
          <DropdownMenuTrigger asChild>
            <motion.div whileHover={{ scale: 1.1 }}>
              <Avatar className="cursor-pointer">
                <AvatarImage src="/placeholder-avatar.jpg" alt="User" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
            </motion.div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Perfil</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Configuración de Usuario</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <CreditCard className="mr-2 h-4 w-4" />
              <span>Configuración de Facturas</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Building className="mr-2 h-4 w-4" />
              <span>Datos de la Compañía</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Cerrar Sesión</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
