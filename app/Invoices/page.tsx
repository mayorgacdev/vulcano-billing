"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  X,
  Edit,
  Trash2,
  Search,
  Eye,
  UserPlus,
  ChevronUp,
  ChevronDown,
  FileText,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import jsPDFInvoiceTemplate from "jspdf-invoice-template";

interface Client {
  id: number;
  name: string;
  email: string;
  address: string;
  phone: string;
}

interface Product {
  id: number;
  name: string;
  description: string;
  quantity: number;
  unitPrice: number;
  vat: number;
  unit: string;
}

interface Invoice {
  id: number;
  invoiceNumber: string;
  clientId: number;
  clientName: string;
  products: Product[];
  date: string;
  dueDate: string;
  status: "paid" | "pending" | "overdue";
}

const initialClients: Client[] = [
  {
    id: 1,
    name: "Acme Corporation",
    email: "contact@acme.com",
    address: "123 Acme St, Acme City",
    phone: "123-456-7890",
  },
  {
    id: 2,
    name: "TechStart Inc.",
    email: "info@techstart.com",
    address: "456 Tech Ave, Start Town",
    phone: "234-567-8901",
  },
  {
    id: 3,
    name: "Global Services Ltd.",
    email: "hello@globalservices.com",
    address: "789 Global Rd, Service City",
    phone: "345-678-9012",
  },
];

const initialInvoices: Invoice[] = [
  {
    id: 1,
    invoiceNumber: "INV-001",
    clientId: 1,
    clientName: "Acme Corporation",
    products: [
      {
        id: 1,
        name: "Product A",
        description: "High-quality widget",
        quantity: 2,
        unitPrice: 100,
        vat: 10,
        unit: "pc",
      },
      {
        id: 2,
        name: "Product B",
        description: "Premium gadget",
        quantity: 1,
        unitPrice: 200,
        vat: 10,
        unit: "pc",
      },
    ],
    date: "2023-05-01",
    dueDate: "2023-05-15",
    status: "paid",
  },
  {
    id: 2,
    invoiceNumber: "INV-002",
    clientId: 2,
    clientName: "TechStart Inc.",
    products: [
      {
        id: 1,
        name: "Product C",
        description: "Advanced tool",
        quantity: 3,
        unitPrice: 150,
        vat: 10,
        unit: "pc",
      },
    ],
    date: "2023-05-05",
    dueDate: "2023-05-20",
    status: "pending",
  },
  {
    id: 3,
    invoiceNumber: "INV-003",
    clientId: 3,
    clientName: "Global Services Ltd.",
    products: [
      {
        id: 1,
        name: "Product D",
        description: "Professional service",
        quantity: 1,
        unitPrice: 500,
        vat: 10,
        unit: "hr",
      },
      {
        id: 2,
        name: "Product E",
        description: "Consultation",
        quantity: 2,
        unitPrice: 200,
        vat: 10,
        unit: "hr",
      },
    ],
    date: "2023-04-28",
    dueDate: "2023-05-12",
    status: "overdue",
  },
];

const statusColors = {
  paid: "bg-green-500",
  pending: "bg-yellow-500",
  overdue: "bg-red-500",
};

export default function InvoiceManagment() {
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [showNewClientForm, setShowNewClientForm] = useState(false);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Invoice;
    direction: "ascending" | "descending";
  } | null>(null);
  const router = useRouter();

  const [newInvoice, setNewInvoice] = useState<Invoice>({
    id: 0,
    invoiceNumber: "",
    clientId: 0,
    clientName: "",
    products: [],
    date: "",
    dueDate: "",
    status: "pending",
  });

  const [newClient, setNewClient] = useState<Client>({
    id: 0,
    name: "",
    email: "",
    address: "",
    phone: "",
  });

  const [newProduct, setNewProduct] = useState<Product>({
    id: 0,
    name: "",
    description: "",
    quantity: 0,
    unitPrice: 0,
    vat: 0,
    unit: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewInvoice((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    if (name === "clientId") {
      const selectedClient = clients.find(
        (client) => client.id === parseInt(value)
      );
      setNewInvoice((prev) => ({
        ...prev,
        clientId: parseInt(value),
        clientName: selectedClient ? selectedClient.name : "",
      }));
    } else {
      setNewInvoice((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleClientInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewClient((prev) => ({ ...prev, [name]: value }));
  };

  const handleProductInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({
      ...prev,
      [name]:
        name === "name" || name === "description" || name === "unit"
          ? value
          : Number(value),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingInvoice) {
      setInvoices(
        invoices.map((inv) =>
          inv.id === editingInvoice.id
            ? { ...newInvoice, id: editingInvoice.id }
            : inv
        )
      );
    } else {
      setInvoices([...invoices, { ...newInvoice, id: invoices.length + 1 }]);
    }
    setNewInvoice({
      id: 0,
      invoiceNumber: "",
      clientId: 0,
      clientName: "",
      products: [],
      date: "",
      dueDate: "",
      status: "pending",
    });
    setShowForm(false);
    setEditingInvoice(null);
  };

  const handleNewClientSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newClientWithId = { ...newClient, id: clients.length + 1 };
    setClients([...clients, newClientWithId]);
    setNewInvoice((prev) => ({
      ...prev,
      clientId: newClientWithId.id,
      clientName: newClientWithId.name,
    }));
    setNewClient({ id: 0, name: "", email: "", address: "", phone: "" });
    setShowNewClientForm(false);
  };

  const handleAddProduct = () => {
    setNewInvoice((prev) => ({
      ...prev,
      products: [
        ...prev.products,
        { ...newProduct, id: prev.products.length + 1 },
      ],
    }));
    setNewProduct({
      id: 0,
      name: "",
      description: "",
      quantity: 0,
      unitPrice: 0,
      vat: 0,
      unit: "",
    });
  };

  const handleEditProduct = (
    productId: number,
    field: keyof Product,
    value: string | number
  ) => {
    setNewInvoice((prev) => ({
      ...prev,
      products: prev.products.map((product) =>
        product.id === productId ? { ...product, [field]: value } : product
      ),
    }));
  };
 
  const handleDeleteProduct = (productId: number) => {
    setNewInvoice((prev) => ({
      ...prev,
      products: prev.products.filter((product) => product.id !== productId),
    }));
  };

  const handleEdit = (invoice: Invoice) => {
    setEditingInvoice(invoice);
    setNewInvoice(invoice);
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    setInvoices(invoices.filter((inv) => inv.id !== id));
  };

  const handleSort = (key: keyof Invoice) => {
    let direction: "ascending" | "descending" = "ascending";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "ascending"
    ) {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const sortedInvoices = [...invoices].sort((a, b) => {
    if (!sortConfig) return 0;
    const { key, direction } = sortConfig;
    if (a[key] < b[key]) return direction === "ascending" ? -1 : 1;
    if (a[key] > b[key]) return direction === "ascending" ? 1 : -1;
    return 0;
  });

  const filteredInvoices = sortedInvoices.filter(
    (invoice) =>
      invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.clientName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const calculateSubtotal = (products: Product[]) => {
    return products.reduce(
      (total, product) => total + product.quantity * product.unitPrice,
      0
    );
  };

  const calculateVAT = (products: Product[]) => {
    return products.reduce(
      (total, product) =>
        total + (product.quantity * product.unitPrice * product.vat) / 100,
      0
    );
  };

  const calculateTotal = (products: Product[]) => {
    return calculateSubtotal(products) + calculateVAT(products);
  };

  const generatePDF = (invoice: Invoice) => {
    const client = clients.find((c) => c.id === invoice.clientId);
    const props = {
      outputType: "save",
      returnJsPDFDocObject: true,
      fileName: `Invoice_${invoice.invoiceNumber}`,
      orientationLandscape: false,
      compress: true,
      logo: {
        src: "https://raw.githubusercontent.com/edisonneza/jspdf-invoice-template/demo/images/logo.png",
        width: 53.33,
        height: 26.66,
        margin: {
          top: 0,
          left: 0,
        },
      },
      stamp: {
        inAllPages: true,
        src: "https://raw.githubusercontent.com/edisonneza/jspdf-invoice-template/demo/images/qr_code.jpg",
        width: 20,
        height: 20,
        margin: {
          top: 0,
          left: 0,
        },
      },
      business: {
        name: "Your Business Name",
        address: "Your Business Address",
        phone: "Your Business Phone",
        email: "your@email.com",
        email_1: "your@email.com",
        website: "www.example.com",
      },
      contact: {
        label: "Invoice issued for:",
        name: client?.name || "",
        address: client?.address || "",
        phone: client?.phone || "",
        email: client?.email || "",
        otherInfo: "",
      },
      invoice: {
        label: "Invoice #: ",
        num: Number(invoice.invoiceNumber),
        invDate: `Payment Date: ${invoice.date}`,
        invGenDate: `Invoice Date: ${new Date().toLocaleDateString()}`,
        headerBorder: false,
        tableBodyBorder: false,
        header: [
          {
            title: "#",
            style: {
              width: 10,
            },
          },
          {
            title: "Title",
            style: {
              width: 30,
            },
          },
          {
            title: "Description",
            style: {
              width: 80,
            },
          },
          { title: "Price" },
          { title: "Quantity" },
          { title: "Unit" },
          { title: "Total" },
        ],
        table: invoice.products.map((product, index) => [
          index + 1,
          product.name,
          product.description,
          product.unitPrice,
          product.quantity,
          product.unit,
          product.quantity * product.unitPrice,
        ]),
        additionalRows: [
          {
            col1: "Subtotal:",
            col2: calculateSubtotal(invoice.products).toFixed(2),
            col3: "EUR",
            style: {
              fontSize: 10,
            },
          },
          {
            col1: "VAT:",
            col2: calculateVAT(invoice.products).toFixed(2),
            col3: "EUR",
            style: {
              fontSize: 10,
            },
          },
          {
            col1: "Total:",
            col2: calculateTotal(invoice.products).toFixed(2),
            col3: "EUR",
            style: {
              fontSize: 14,
            },
          },
        ],
        invDescLabel: "Invoice Note",
        invDesc:
          "Thank you for your business. Please process this invoice within the due date.",
      },
      footer: {
        text: "The invoice is created on a computer and is valid without the signature and stamp.",
      },
      page: {
        num: "Page 1 of 1",
      },
    };

    const pdfObject = jsPDFInvoiceTemplate(props);
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl bg-gradient-to-br from-blue-50 to-teal-50 rounded-xl">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-teal-600 text-transparent bg-clip-text">
          Gestión de Facturas
        </h1>
      </motion.div>

      <div className="mb-6 flex justify-between items-center">
        <div className="relative">
          <Input
            type="text"
            placeholder="Buscar facturas..."
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
              setEditingInvoice(null);
              setNewInvoice({
                id: 0,
                invoiceNumber: "",
                clientId: 0,
                clientName: "",
                products: [],
                date: "",
                dueDate: "",
                status: "pending",
              });
            }}
            className="bg-gradient-to-r from-blue-600 to-teal-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
          >
            {showForm ? <X size={20} /> : <Plus size={20} />}
            <span className="ml-2">
              {showForm ? "Cancelar" : "Nueva Factura"}
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
                  {editingInvoice ? "Editar Factura" : "Nueva Factura"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="invoiceNumber">Número de Factura</Label>
                      <Input
                        id="invoiceNumber"
                        name="invoiceNumber"
                        value={newInvoice.invoiceNumber}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="clientId">Cliente</Label>
                      <div className="flex items-center space-x-2">
                        <Select
                          value={newInvoice.clientId.toString()}
                          onValueChange={(value) =>
                            handleSelectChange("clientId", value)
                          }
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Seleccionar cliente" />
                          </SelectTrigger>
                          <SelectContent>
                            {clients.map((client) => (
                              <SelectItem
                                key={client.id}
                                value={client.id.toString()}
                              >
                                {client.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Dialog
                          open={showNewClientForm}
                          onOpenChange={setShowNewClientForm}
                        >
                          <DialogTrigger asChild>
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={() => setShowNewClientForm(true)}
                            >
                              <UserPlus size={16} />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Nuevo Cliente</DialogTitle>
                            </DialogHeader>
                            <form
                              onSubmit={handleNewClientSubmit}
                              className="space-y-4"
                            >
                              <div>
                                <Label htmlFor="name">Nombre</Label>
                                <Input
                                  id="name"
                                  name="name"
                                  value={newClient.name}
                                  onChange={handleClientInputChange}
                                  required
                                />
                              </div>
                              <div>
                                <Label htmlFor="email">Email</Label>
                                <Input
                                  id="email"
                                  name="email"
                                  type="email"
                                  value={newClient.email}
                                  onChange={handleClientInputChange}
                                  required
                                />
                              </div>
                              <div>
                                <Label htmlFor="address">Dirección</Label>
                                <Input
                                  id="address"
                                  name="address"
                                  value={newClient.address}
                                  onChange={handleClientInputChange}
                                  required
                                />
                              </div>
                              <div>
                                <Label htmlFor="phone">Teléfono</Label>
                                <Input
                                  id="phone"
                                  name="phone"
                                  value={newClient.phone}
                                  onChange={handleClientInputChange}
                                  required
                                />
                              </div>
                              <Button type="submit" className="w-full">
                                Crear Cliente
                              </Button>
                            </form>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="date">Fecha de Emisión</Label>
                      <Input
                        id="date"
                        name="date"
                        type="date"
                        value={newInvoice.date}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="dueDate">Fecha de Vencimiento</Label>
                      <Input
                        id="dueDate"
                        name="dueDate"
                        type="date"
                        value={newInvoice.dueDate}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="status">Estado</Label>
                      <Select
                        value={newInvoice.status}
                        onValueChange={(value) =>
                          handleSelectChange(
                            "status",
                            value as "paid" | "pending" | "overdue"
                          )
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar estado" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="paid">Pagada</SelectItem>
                          <SelectItem value="pending">Pendiente</SelectItem>
                          <SelectItem value="overdue">Vencida</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-2">Productos</h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nombre</TableHead>
                          <TableHead>Descripción</TableHead>
                          <TableHead>Cantidad</TableHead>
                          <TableHead>Precio Unitario</TableHead>
                          <TableHead>IVA (%)</TableHead>
                          <TableHead>Unidad</TableHead>
                          <TableHead>Acciones</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {newInvoice.products.map((product) => (
                          <TableRow key={product.id}>
                            <TableCell>
                              <Input
                                value={product.name}
                                onChange={(e) =>
                                  handleEditProduct(
                                    product.id,
                                    "name",
                                    e.target.value
                                  )
                                }
                                placeholder="Nombre del producto"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                value={product.description}
                                onChange={(e) =>
                                  handleEditProduct(
                                    product.id,
                                    "description",
                                    e.target.value
                                  )
                                }
                                placeholder="Descripción"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                value={product.quantity}
                                onChange={(e) =>
                                  handleEditProduct(
                                    product.id,
                                    "quantity",
                                    Number(e.target.value)
                                  )
                                }
                                placeholder="Cantidad"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                value={product.unitPrice}
                                onChange={(e) =>
                                  handleEditProduct(
                                    product.id,
                                    "unitPrice",
                                    Number(e.target.value)
                                  )
                                }
                                placeholder="Precio unitario"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                value={product.vat}
                                onChange={(e) =>
                                  handleEditProduct(
                                    product.id,
                                    "vat",
                                    Number(e.target.value)
                                  )
                                }
                                placeholder="IVA %"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                value={product.unit}
                                onChange={(e) =>
                                  handleEditProduct(
                                    product.id,
                                    "unit",
                                    e.target.value
                                  )
                                }
                                placeholder="Unidad"
                              />
                            </TableCell>
                            <TableCell>
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDeleteProduct(product.id)}
                              >
                                <Trash2 size={16} />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    <div className="mt-2 grid grid-cols-6 gap-2">
                      <Input
                        value={newProduct.name}
                        onChange={(e) => handleProductInputChange(e)}
                        name="name"
                        placeholder="Nombre del producto"
                      />
                      <Input
                        value={newProduct.description}
                        onChange={(e) => handleProductInputChange(e)}
                        name="description"
                        placeholder="Descripción"
                      />
                      <Input
                        type="number"
                        value={newProduct.quantity}
                        onChange={(e) => handleProductInputChange(e)}
                        name="quantity"
                        placeholder="Cantidad"
                      />
                      <Input
                        type="number"
                        value={newProduct.unitPrice}
                        onChange={(e) => handleProductInputChange(e)}
                        name="unitPrice"
                        placeholder="Precio unitario"
                      />
                      <Input
                        type="number"
                        value={newProduct.vat}
                        onChange={(e) => handleProductInputChange(e)}
                        name="vat"
                        placeholder="IVA %"
                      />
                      <Input
                        value={newProduct.unit}
                        onChange={(e) => handleProductInputChange(e)}
                        name="unit"
                        placeholder="Unidad"
                      />
                    </div>
                    <Button
                      type="button"
                      onClick={handleAddProduct}
                      variant="outline"
                      className="mt-2 w-full"
                    >
                      <Plus size={16} className="mr-2" /> Agregar Producto
                    </Button>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-teal-600 text-white shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    {editingInvoice ? "Actualizar Factura" : "Crear Factura"}
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
            Lista de Facturas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100 text-left text-xs font-semibold uppercase tracking-wider">
                  <th
                    className="px-4 py-2 cursor-pointer"
                    onClick={() => handleSort("invoiceNumber")}
                  >
                    Número de Factura
                    {sortConfig?.key === "invoiceNumber" &&
                      (sortConfig.direction === "ascending" ? (
                        <ChevronUp size={14} className="inline ml-1" />
                      ) : (
                        <ChevronDown size={14} className="inline ml-1" />
                      ))}
                  </th>
                  <th
                    className="px-4 py-2 cursor-pointer"
                    onClick={() => handleSort("clientName")}
                  >
                    Cliente
                    {sortConfig?.key === "clientName" &&
                      (sortConfig.direction === "ascending" ? (
                        <ChevronUp size={14} className="inline ml-1" />
                      ) : (
                        <ChevronDown size={14} className="inline ml-1" />
                      ))}
                  </th>
                  <th
                    className="px-4 py-2 cursor-pointer"
                    onClick={() => handleSort("date")}
                  >
                    Fecha de Emisión
                    {sortConfig?.key === "date" &&
                      (sortConfig.direction === "ascending" ? (
                        <ChevronUp size={14} className="inline ml-1" />
                      ) : (
                        <ChevronDown size={14} className="inline ml-1" />
                      ))}
                  </th>
                  <th
                    className="px-4 py-2 cursor-pointer"
                    onClick={() => handleSort("dueDate")}
                  >
                    Fecha de Vencimiento
                    {sortConfig?.key === "dueDate" &&
                      (sortConfig.direction === "ascending" ? (
                        <ChevronUp size={14} className="inline ml-1" />
                      ) : (
                        <ChevronDown size={14} className="inline ml-1" />
                      ))}
                  </th>
                  <th
                    className="px-4 py-2 cursor-pointer"
                    onClick={() => handleSort("status")}
                  >
                    Estado
                    {sortConfig?.key === "status" &&
                      (sortConfig.direction === "ascending" ? (
                        <ChevronUp size={14} className="inline ml-1" />
                      ) : (
                        <ChevronDown size={14} className="inline ml-1" />
                      ))}
                  </th>
                  <th className="px-4 py-2">Total</th>
                  <th className="px-4 py-2">Acciones</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filteredInvoices.map((invoice) => (
                    <motion.tr
                      key={invoice.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className="bg-white border-b border-gray-200 hover:bg-gray-50"
                    >
                      <td className="px-4 py-2">{invoice.invoiceNumber}</td>
                      <td className="px-4 py-2">{invoice.clientName}</td>
                      <td className="px-4 py-2">{invoice.date}</td>
                      <td className="px-4 py-2">{invoice.dueDate}</td>
                      <td className="px-4 py-2">
                        <Badge
                          className={`${
                            statusColors[invoice.status]
                          } text-white`}
                        >
                          {invoice.status.charAt(0).toUpperCase() +
                            invoice.status.slice(1)}
                        </Badge>
                      </td>
                      <td className="px-4 py-2">
                        ${calculateTotal(invoice.products).toFixed(2)}
                      </td>
                      <td className="px-4 py-2">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() =>
                              router.push(`/Invoices/${invoice.id}`)
                            }
                          >
                            <Eye size={16} />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleEdit(invoice)}
                          >
                            <Edit size={16} />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="text-red-500 hover:text-red-700"
                            onClick={() => handleDelete(invoice.id)}
                          >
                            <Trash2 size={16} />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => generatePDF(invoice)}
                          >
                            <FileText size={16} />
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
