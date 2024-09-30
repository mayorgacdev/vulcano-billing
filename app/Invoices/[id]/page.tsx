"use client";

import { MouseEventHandler, useState } from "react";
import { motion } from "framer-motion";
import {
  ChevronDown,
  LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface MenuItemProps {
  icon: LucideIcon; // Aquí aceptamos íconos de tipo LucideIcon como Package
  label: string;
  isActive?: boolean;
  hasDropdown?: boolean;
  onClick: MouseEventHandler<HTMLButtonElement>;
}

const MenuItem = ({
  icon: Icon,
  label,
  isActive = false,
  hasDropdown = false,
  onClick,
}: MenuItemProps) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`flex items-center w-full px-4 py-3 text-sm rounded-lg transition-all duration-200 ${
        isActive
          ? "bg-gradient-to-r from-green-400 to-blue-500 text-white shadow-lg"
          : "text-gray-700 hover:bg-gray-100 hover:shadow-md"
      }`}
    >
      <Icon className="w-5 h-5 mr-3" />
      <span className="flex-grow text-left">{label}</span>
      {hasDropdown && <ChevronDown className="w-4 h-4" />}
    </motion.button>
  );
};

export default function InvoiceDetails() {
  const [activeItem, setActiveItem] = useState("Quotes & Invoices");

  return (
    <main className="container mx-auto p-6 max-w-7xl bg-gradient-to-br from-blue-50 to-teal-50 rounded-xl">
      <div className="p-6 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-between items-center mb-6"
        >
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-blue-500 text-transparent bg-clip-text">
              Invoice #2020-05-0001
            </h1>
            <p className="text-sm text-gray-500">Paid on June 27, 2023</p>
          </div>
          <div className="flex space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="bg-white shadow-md hover:shadow-lg transition-shadow"
                >
                  More Options
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Download PDF</DropdownMenuItem>
                <DropdownMenuItem>Print Invoice</DropdownMenuItem>
                <DropdownMenuItem>Archive</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button className="bg-gradient-to-r from-green-400 to-blue-500 text-white shadow-md hover:shadow-lg transition-all">
              Record a Payment
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50 flex flex-row justify-between items-start p-6">
              <div>
                <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-lg mb-4 shadow-lg"></div>
                <CardTitle className="text-2xl mb-2">Sisyphus</CardTitle>
                <p className="text-sm text-gray-600">John Bronson</p>
                <p className="text-sm text-gray-600">
                  7801 Folsom, 95820 Grand Image, France
                </p>
                <p className="text-sm text-gray-600">contact@sisyphus.com</p>
                <p className="text-sm text-gray-600">
                  SIRET: 362 521 879 00034
                </p>
                <p className="text-sm text-gray-600">VAT: 842 484021</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-lg">#2020-05-0001</p>
                <p className="text-sm text-gray-600">Bill Date: 03/05/2020</p>
                <p className="text-sm text-gray-600">
                  Delivery Date: 03/05/2020
                </p>
                <p className="text-sm text-gray-600">
                  Terms of Payment: Within 15 days
                </p>
                <p className="text-sm text-gray-600">
                  Payment Deadline: 05/18/2020
                </p>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="mb-6 bg-gray-50 p-4 rounded-lg shadow-inner">
                <h3 className="font-semibold mb-2 text-lg">Billing Address:</h3>
                <p>Willy Wonka</p>
                <p>1445 West Norwood Avenue, Itasca, Illinois, USA</p>
                <p>willy@wonka.com</p>
                <p>SIRET: 362 521 879 00034</p>
                <p>VAT: 842 484021</p>
              </div>
              <div className="mb-6 bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <h3 className="font-semibold mb-2 text-lg">Note:</h3>
                <p className="text-sm text-gray-700">
                  This is a custom message that might be relevant to the
                  customer. It can span up to three or four rows.
                </p>
              </div>
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold">No.</TableHead>
                    <TableHead className="font-semibold">Article</TableHead>
                    <TableHead className="font-semibold">Quantity</TableHead>
                    <TableHead className="font-semibold">Unit Price</TableHead>
                    <TableHead className="font-semibold">VAT</TableHead>
                    <TableHead className="font-semibold">Amount</TableHead>
                    <TableHead className="font-semibold">
                      Final Amount
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[1, 2, 3].map((item) => (
                    <TableRow
                      key={item}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <TableCell>{item}</TableCell>
                      <TableCell>
                        <div className="font-medium">Product Name</div>
                        <div className="text-sm text-gray-500">
                          Product Description
                        </div>
                      </TableCell>
                      <TableCell>150</TableCell>
                      <TableCell>€20</TableCell>
                      <TableCell>0%</TableCell>
                      <TableCell>€3,000</TableCell>
                      <TableCell>€3,000</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="mt-6 text-right space-y-1">
                <p className="text-sm text-gray-600">
                  Total HT: <span className="font-semibold">€3,000</span>
                </p>
                <p className="text-sm text-gray-600">
                  Total Disbursements:{" "}
                  <span className="font-semibold">€30</span>
                </p>
                <p className="text-sm text-gray-600">
                  Total VAT: <span className="font-semibold">€0</span>
                </p>
                <p className="text-xl font-bold bg-gradient-to-r from-green-400 to-blue-500 text-transparent bg-clip-text">
                  Total Price: €3,030.00
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="mt-6 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="text-xl bg-gradient-to-r from-green-400 to-blue-500 text-transparent bg-clip-text">
                Payment Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-semibold">Total</TableCell>
                    <TableCell className="text-right font-semibold">
                      €3,030 incl. VAT
                    </TableCell>
                  </TableRow>
                  {[
                    {
                      label: "Deposit No. 2020-04-0006",
                      date: "Oct 24, 2019",
                      amount: "€300",
                    },
                    {
                      label: "Partial Payment",
                      date: "Oct 26, 2019",
                      amount: "€400",
                    },
                    {
                      label: "Partial Payment",
                      date: "Oct 27, 2019",
                      amount: "€2,230",
                    },
                  ].map((payment, index) => (
                    <TableRow
                      key={index}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <TableCell>
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                          {payment.label}
                        </div>
                        <div className="text-sm text-gray-500">
                          Date: {payment.date}
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {payment.amount}
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell className="font-semibold text-lg">
                      Remaining Amount
                    </TableCell>
                    <TableCell className="text-right font-semibold text-lg text-red-500">
                      €100 incl. VAT
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-6 text-sm text-gray-600 bg-gray-50 p-4 rounded-lg shadow-inner"
        >
          <h4 className="font-semibold mb-2 text-lg">Terms & Conditions</h4>
          <p>Please pay within 15 days of receiving this invoice.</p>
        </motion.div>
      </div>
    </main>
  );
}
