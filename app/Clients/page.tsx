"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Edit, Trash2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
  taxId: string;
  address: {
    street: string;
    number: string;
    city: string;
    postalCode: string;
    state: string;
    country: string;
  };
  clientType: "individual" | "company";
  paymentMethod: string;
  clientCode: string;
  notes: string;
}

interface Notification {
  id: number;
  message: string;
  type: "success" | "error";
}

const initialClients: Client[] = [
  {
    id: 1,
    name: "Acme Corporation",
    email: "contact@acme.com",
    phone: "+1 (555) 123-4567",
    taxId: "US123456789",
    address: {
      street: "123 Business Ave",
      number: "Suite 100",
      city: "Metropolis",
      postalCode: "12345",
      state: "NY",
      country: "United States",
    },
    clientType: "company",
    paymentMethod: "bank_transfer",
    clientCode: "ACME001",
    notes: "Preferred supplier for all cartoon products.",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane.smith@email.com",
    phone: "+44 20 1234 5678",
    taxId: "GB987654321",
    address: {
      street: "45 High Street",
      number: "Flat 3",
      city: "London",
      postalCode: "SW1A 1AA",
      state: "",
      country: "United Kingdom",
    },
    clientType: "individual",
    paymentMethod: "credit_card",
    clientCode: "JS002",
    notes: "Requires invoices by the 5th of each month.",
  },
];

const NotificationComponent = ({
  notification,
  onClose,
}: {
  notification: Notification;
  onClose: () => void;
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      className={`fixed top-4 right-4 p-4 rounded-md shadow-md ${
        notification.type === "success" ? "bg-green-500" : "bg-red-500"
      } text-white`}
    >
      {notification.message}
      <button onClick={onClose} className="ml-4 text-white">
        <X size={16} />
      </button>
    </motion.div>
  );
};

export default function ClientManagement() {
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [showForm, setShowForm] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const [newClient, setNewClient] = useState<Client>({
    id: 0,
    name: "",
    email: "",
    phone: "",
    taxId: "",
    address: {
      street: "",
      number: "",
      city: "",
      postalCode: "",
      state: "",
      country: "",
    },
    clientType: "individual",
    paymentMethod: "",
    clientCode: "",
    notes: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setNewClient((prev) => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof Client] as object),
          [child]: value,
        },
      }));
    } else {
      setNewClient((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setNewClient((prev) => ({ ...prev, [name]: value }));
  };

  const addNotification = (message: string, type: "success" | "error") => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message, type }]);
  };

  const removeNotification = (id: number) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id)
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingClient) {
      setClients(
        clients.map((c) =>
          c.id === editingClient.id ? { ...newClient, id: editingClient.id } : c
        )
      );
      addNotification(
        `${newClient.name} ha sido actualizado exitosamente.`,
        "success"
      );
    } else {
      setClients([...clients, { ...newClient, id: clients.length + 1 }]);
      addNotification(
        `${newClient.name} ha sido añadido exitosamente a tu lista de clientes.`,
        "success"
      );
    }
    setNewClient({
      id: 0,
      name: "",
      email: "",
      phone: "",
      taxId: "",
      address: {
        street: "",
        number: "",
        city: "",
        postalCode: "",
        state: "",
        country: "",
      },
      clientType: "individual",
      paymentMethod: "",
      clientCode: "",
      notes: "",
    });
    setShowForm(false);
    setEditingClient(null);
  };

  const handleEdit = (client: Client) => {
    setEditingClient(client);
    setNewClient(client);
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    setClients(clients.filter((c) => c.id !== id));
    addNotification(
      "El cliente ha sido eliminado exitosamente de tu lista.",
      "success"
    );
  };

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.clientCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-6 max-w-7xl bg-gradient-to-br from-blue-50 to-teal-50 rounded-xl">
      <AnimatePresence>
        {notifications.map((notification) => (
          <NotificationComponent
            key={notification.id}
            notification={notification}
            onClose={() => removeNotification(notification.id)}
          />
        ))}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-teal-600 text-transparent bg-clip-text">
          Gestión Profesional de Clientes
        </h1>
      </motion.div>

      <div className="mb-6 flex justify-between items-center">
        <div className="relative">
          <Input
            type="text"
            placeholder="Buscar clientes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-64 bg-white shadow-md rounded-full"
          />
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={18}
          />
        </div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            onClick={() => {
              setShowForm(!showForm);
              setEditingClient(null);
              setNewClient({
                id: 0,
                name: "",
                email: "",
                phone: "",
                taxId: "",
                address: {
                  street: "",
                  number: "",
                  city: "",
                  postalCode: "",
                  state: "",
                  country: "",
                },
                clientType: "individual",
                paymentMethod: "",
                clientCode: "",
                notes: "",
              });
            }}
            className="bg-gradient-to-r from-blue-600 to-teal-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
          >
            {showForm ? <X size={20} /> : <Plus size={20} />}
            <span className="ml-2">
              {showForm ? "Cancelar" : "Añadir Cliente"}
            </span>
          </Button>
        </motion.div>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="mb-6 overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold bg-gradient-to-r from-blue-600 to-teal-600 text-transparent bg-clip-text">
                  {editingClient ? "Editar Cliente" : "Añadir Nuevo Cliente"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">
                        Nombre Completo / Nombre de la Empresa
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        value={newClient.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Correo Electrónico</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={newClient.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Teléfono</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={newClient.phone}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="taxId">ID Fiscal (NIF/CIF/RUC)</Label>
                      <Input
                        id="taxId"
                        name="taxId"
                        value={newClient.taxId}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold">Dirección</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="address.street">Calle</Label>
                        <Input
                          id="address.street"
                          name="address.street"
                          value={newClient.address.street}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="address.number">Número</Label>
                        <Input
                          id="address.number"
                          name="address.number"
                          value={newClient.address.number}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="address.city">Ciudad</Label>
                        <Input
                          id="address.city"
                          name="address.city"
                          value={newClient.address.city}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="address.postalCode">
                          Código Postal
                        </Label>
                        <Input
                          id="address.postalCode"
                          name="address.postalCode"
                          value={newClient.address.postalCode}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="address.state">Estado/Provincia</Label>
                        <Input
                          id="address.state"
                          name="address.state"
                          value={newClient.address.state}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div>
                        <Label htmlFor="address.country">País</Label>
                        <Input
                          id="address.country"
                          name="address.country"
                          value={newClient.address.country}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="clientType">Tipo de Cliente</Label>
                      <Select
                        value={newClient.clientType}
                        onValueChange={(value) =>
                          handleSelectChange("clientType", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar tipo de cliente" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="individual">Individual</SelectItem>
                          <SelectItem value="company">Empresa</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="paymentMethod">Método de Pago</Label>
                      <Select
                        value={newClient.paymentMethod}
                        onValueChange={(value) =>
                          handleSelectChange("paymentMethod", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar método de pago" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cash">Efectivo</SelectItem>
                          <SelectItem value="credit_card">
                            Tarjeta de Crédito
                          </SelectItem>
                          <SelectItem value="bank_transfer">
                            Transferencia Bancaria
                          </SelectItem>
                          <SelectItem value="paypal">PayPal</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="clientCode">Código de Cliente</Label>
                      <Input
                        id="clientCode"
                        name="clientCode"
                        value={newClient.clientCode}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="notes">Notas</Label>
                    <Textarea
                      id="notes"
                      name="notes"
                      value={newClient.notes}
                      onChange={handleInputChange}
                      rows={3}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-teal-600 text-white shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    {editingClient ? "Actualizar Cliente" : "Añadir Cliente"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold bg-gradient-to-r from-blue-600 to-teal-600 text-transparent bg-clip-text">
            Lista de Clientes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">Avatar</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Correo Electrónico</TableHead>
                  <TableHead>Teléfono</TableHead>
                  <TableHead>ID Fiscal</TableHead>
                  <TableHead>Código de Cliente</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence>
                  {filteredClients.map((client) => (
                    <motion.tr
                      key={client.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className="hover:bg-gray-50"
                    >
                      <TableCell>
                        <Avatar>
                          <AvatarImage
                            src={`https://api.dicebear.com/6.x/initials/svg?seed=${client.name}`}
                            alt={client.name}
                          />
                          <AvatarFallback>
                            {client.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                      </TableCell>
                      <TableCell className="font-medium">
                        {client.name}
                      </TableCell>
                      <TableCell>{client.email}</TableCell>
                      <TableCell>{client.phone}</TableCell>
                      <TableCell>{client.taxId}</TableCell>
                      <TableCell>{client.clientCode}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleEdit(client)}
                          >
                            <Edit size={16} />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="text-red-500 hover:text-red-700"
                            onClick={() => handleDelete(client.id)}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </TableCell>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
