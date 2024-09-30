"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Plus,
  ChevronDown,
  ChevronUp,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface StockItem {
  id: string;
  orderID: string;
  product: string;
  category: string;
  salesChannel: string;
  instruction: string;
  items: string;
  status: "Completed" | "Pending";
}

const initialStockItems: StockItem[] = [
  {
    id: "1",
    orderID: "#7676",
    product: "Inverter",
    category: "cat1",
    salesChannel: "Store name",
    instruction: "Stock adjustment",
    items: "80/100",
    status: "Completed",
  },
  {
    id: "2",
    orderID: "#7676",
    product: "Battery",
    category: "cat2",
    salesChannel: "Store name",
    instruction: "",
    items: "80/100",
    status: "Pending",
  },
  {
    id: "3",
    orderID: "#7676",
    product: "Generator",
    category: "cat2",
    salesChannel: "Store name",
    instruction: "Stock adjustment",
    items: "80/100",
    status: "Completed",
  },
  {
    id: "4",
    orderID: "#7676",
    product: "Charger",
    category: "cat3",
    salesChannel: "Store name",
    instruction: "Stock adjustment",
    items: "80/100",
    status: "Completed",
  },
  {
    id: "5",
    orderID: "#7676",
    product: "Power",
    category: "cat4",
    salesChannel: "Store name",
    instruction: "",
    items: "80/100",
    status: "Completed",
  },
];

export default function InStockManagement() {
  const { toast } = useToast();
  const [stockItems, setStockItems] = useState<StockItem[]>(initialStockItems);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof StockItem;
    direction: "ascending" | "descending";
  } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [statusFilter, setStatusFilter] = useState<
    "all" | "Completed" | "Pending"
  >("all");
  const [isNewItemDialogOpen, setIsNewItemDialogOpen] = useState(false);
  const [newItem, setNewItem] = useState<Partial<StockItem>>({});
  const [editingItem, setEditingItem] = useState<StockItem | null>(null);

  const handleSort = (key: keyof StockItem) => {
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

  const sortedItems = [...stockItems].sort((a, b) => {
    if (!sortConfig) return 0;
    const { key, direction } = sortConfig;
    if (a[key] < b[key]) return direction === "ascending" ? -1 : 1;
    if (a[key] > b[key]) return direction === "ascending" ? 1 : -1;
    return 0;
  });

  const filteredItems = sortedItems.filter(
    (item) =>
      Object.values(item).some((value) =>
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      ) &&
      (statusFilter === "all" || item.status === statusFilter)
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleNewItemSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = (stockItems.length + 1).toString();
    const newStockItem = { ...newItem, id } as StockItem;
    setStockItems([...stockItems, newStockItem]);
    setIsNewItemDialogOpen(false);
    setNewItem({});
    toast({
      title: "Nuevo artículo agregado",
      description: `Se ha agregado ${newStockItem.product} al inventario.`,
    });
  };

  const handleEditItemSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      setStockItems(
        stockItems.map((item) =>
          item.id === editingItem.id ? editingItem : item
        )
      );
      setEditingItem(null);
      toast({
        title: "Artículo actualizado",
        description: `Se ha actualizado ${editingItem.product} en el inventario.`,
      });
    }
  };

  const handleDeleteItem = (id: string) => {
    setStockItems(stockItems.filter((item) => item.id !== id));
    toast({
      title: "Artículo eliminado",
      description: "El artículo ha sido eliminado del inventario.",
      variant: "destructive",
    });
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  return (
    <div className="container mx-auto p-6 max-w-7xl bg-gradient-to-br from-blue-50 to-teal-50 rounded-xl">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-teal-600 text-transparent bg-clip-text">
          Gestión de Inventario
        </h1>
        <p className="text-gray-600">
          Administra tu stock de manera eficiente y sencilla
        </p>
      </motion.div>

      <div className="mb-8 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative w-full sm:w-64">
          <Input
            type="text"
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full bg-white shadow-md rounded-full transition-all duration-300 focus:ring-2 focus:ring-blue-400"
          />
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={18}
          />
        </div>
        <div className="flex items-center space-x-4 w-full sm:w-auto">
          <Select
            value={statusFilter}
            onValueChange={(value: "all" | "Completed" | "Pending") =>
              setStatusFilter(value)
            }
          >
            <SelectTrigger className="w-[180px] bg-white rounded-full">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="Completed">Completado</SelectItem>
              <SelectItem value="Pending">Pendiente</SelectItem>
            </SelectContent>
          </Select>
          <Dialog
            open={isNewItemDialogOpen}
            onOpenChange={setIsNewItemDialogOpen}
          >
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-600 to-teal-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-full">
                <Plus size={20} />
                <span className="ml-2">Nuevo Producto</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Agregar Nuevo Producto</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleNewItemSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="orderID" className="text-right">
                      Orden ID
                    </Label>
                    <Input
                      id="orderID"
                      value={newItem.orderID || ""}
                      onChange={(e) =>
                        setNewItem({ ...newItem, orderID: e.target.value })
                      }
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="product" className="text-right">
                      Producto
                    </Label>
                    <Input
                      id="product"
                      value={newItem.product || ""}
                      onChange={(e) =>
                        setNewItem({ ...newItem, product: e.target.value })
                      }
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="category" className="text-right">
                      Categoría
                    </Label>
                    <Input
                      id="category"
                      value={newItem.category || ""}
                      onChange={(e) =>
                        setNewItem({ ...newItem, category: e.target.value })
                      }
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="salesChannel" className="text-right">
                      Canal de Venta
                    </Label>
                    <Input
                      id="salesChannel"
                      value={newItem.salesChannel || ""}
                      onChange={(e) =>
                        setNewItem({ ...newItem, salesChannel: e.target.value })
                      }
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="instruction" className="text-right">
                      Instrucción
                    </Label>
                    <Input
                      id="instruction"
                      value={newItem.instruction || ""}
                      onChange={(e) =>
                        setNewItem({ ...newItem, instruction: e.target.value })
                      }
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="items" className="text-right">
                      Cantidad
                    </Label>
                    <Input
                      id="items"
                      value={newItem.items || ""}
                      onChange={(e) =>
                        setNewItem({ ...newItem, items: e.target.value })
                      }
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="status" className="text-right">
                      Estado
                    </Label>
                    <Select
                      value={newItem.status}
                      onValueChange={(value: "Completed" | "Pending") =>
                        setNewItem({ ...newItem, status: value })
                      }
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Seleccionar estado" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Completed">Completado</SelectItem>
                        <SelectItem value="Pending">Pendiente</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-blue-600 to-teal-600 text-white"
                  >
                    Agregar Producto
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 text-left text-xs font-semibold uppercase tracking-wider">
                <th className="px-6 py-3">
                  <input
                    type="checkbox"
                    className="form-checkbox h-5 w-5 text-blue-600 rounded transition duration-150 ease-in-out"
                  />
                </th>
                {Object.keys(initialStockItems[0])
                  .slice(1)
                  .map((key) => (
                    <th
                      key={key}
                      className="px-6 py-3 cursor-pointer hover:bg-gray-100 transition-colors duration-200"
                      onClick={() => handleSort(key as keyof StockItem)}
                    >
                      <div className="flex items-center">
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                        {sortConfig?.key === key &&
                          (sortConfig.direction === "ascending" ? (
                            <ChevronUp size={14} className="ml-1" />
                          ) : (
                            <ChevronDown size={14} className="ml-1" />
                          ))}
                      </div>
                    </th>
                  ))}
                <th className="px-6 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {currentItems.map((item, index) => (
                  <motion.tr
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="border-b border-gray-200 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        className="form-checkbox h-5 w-5 text-blue-600 rounded transition duration-150 ease-in-out"
                      />
                    </td>
                    <td className="px-6 py-4">{item.orderID}</td>
                    <td className="px-6 py-4">{item.product}</td>
                    <td className="px-6 py-4">{item.category}</td>
                    <td className="px-6 py-4">{item.salesChannel}</td>
                    <td className="px-6 py-4">{item.instruction}</td>
                    <td className="px-6 py-4">{item.items}</td>
                    <td className="px-6 py-4">
                      <Badge
                        className={`${
                          item.status === "Completed"
                            ? "bg-green-500"
                            : "bg-yellow-500"
                        } text-white px-2 py-1 rounded-full text-xs font-semibold`}
                      >
                        {item.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setEditingItem(item)}
                              className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
                            >
                              <Edit size={16} />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Editar Producto</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleEditItemSubmit}>
                              <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label
                                    htmlFor="edit-product"
                                    className="text-right"
                                  >
                                    Producto
                                  </Label>
                                  <Input
                                    id="edit-product"
                                    value={editingItem?.product || ""}
                                    onChange={(e) =>
                                      setEditingItem(
                                        editingItem
                                          ? {
                                              ...editingItem,
                                              product: e.target.value,
                                            }
                                          : null
                                      )
                                    }
                                    className="col-span-3"
                                  />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label
                                    htmlFor="edit-items"
                                    className="text-right"
                                  >
                                    Cantidad
                                  </Label>
                                  <Input
                                    id="edit-items"
                                    value={editingItem?.items || ""}
                                    onChange={(e) =>
                                      setEditingItem(
                                        editingItem
                                          ? {
                                              ...editingItem,
                                              items: e.target.value,
                                            }
                                          : null
                                      )
                                    }
                                    className="col-span-3"
                                  />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label
                                    htmlFor="edit-status"
                                    className="text-right"
                                  >
                                    Estado
                                  </Label>
                                  <Select
                                    value={editingItem?.status}
                                    onValueChange={(
                                      value: "Completed" | "Pending"
                                    ) =>
                                      setEditingItem(
                                        editingItem
                                          ? { ...editingItem, status: value }
                                          : null
                                      )
                                    }
                                  >
                                    <SelectTrigger className="col-span-3">
                                      <SelectValue placeholder="Seleccionar estado" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="Completed">
                                        Completado
                                      </SelectItem>
                                      <SelectItem value="Pending">
                                        Pendiente
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                              <DialogFooter>
                                <Button
                                  type="submit"
                                  className="bg-gradient-to-r from-blue-600 to-teal-600 text-white"
                                >
                                  Guardar Cambios
                                </Button>
                              </DialogFooter>
                            </form>
                          </DialogContent>
                        </Dialog>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-500 hover:text-red-700 transition-colors duration-200"
                          onClick={() => handleDeleteItem(item.id)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6 flex flex-col sm:flex-row justify-between items-center">
        <div className="mb-4 sm:mb-0">
          <p className="text-sm text-gray-700">
            Mostrando{" "}
            <span className="font-medium">{indexOfFirstItem + 1}</span> a{" "}
            <span className="font-medium">
              {Math.min(indexOfLastItem, filteredItems.length)}
            </span>{" "}
            de <span className="font-medium">{filteredItems.length}</span>{" "}
            resultados
          </p>
        </div>
        <div className="flex justify-center">
          <nav
            className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
            aria-label="Pagination"
          >
            <Button
              variant="outline"
              size="sm"
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              <span className="sr-only">Anterior</span>
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </Button>
            {Array.from({
              length: Math.ceil(filteredItems.length / itemsPerPage),
            }).map((_, index) => (
              <Button
                key={index}
                variant={currentPage === index + 1 ? "default" : "outline"}
                size="sm"
                onClick={() => paginate(index + 1)}
                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                  currentPage === index + 1
                    ? "z-10 bg-blue-600 border-blue-600 text-white"
                    : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                }`}
              >
                {index + 1}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => paginate(currentPage + 1)}
              disabled={
                currentPage === Math.ceil(filteredItems.length / itemsPerPage)
              }
              className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              <span className="sr-only">Siguiente</span>
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </Button>
          </nav>
        </div>
      </div>
    </div>
  );
}
