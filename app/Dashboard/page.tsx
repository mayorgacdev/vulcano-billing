"use client";

import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ArrowUpIcon,
  ArrowDownIcon,
  DollarSignIcon,
  ClockIcon,
  UserIcon,
  BuildingIcon,
} from "lucide-react";

const revenueData = [
  { month: "Jan", invoiced: 4000, collected: 2400 },
  { month: "Feb", invoiced: 3000, collected: 1398 },
  { month: "Mar", invoiced: 2000, collected: 9800 },
  { month: "Apr", invoiced: 2780, collected: 3908 },
  { month: "May", invoiced: 1890, collected: 4800 },
  { month: "Jun", invoiced: 2390, collected: 3800 },
];

const customerData = [
  { month: "Jan", new: 400, returning: 240, churned: 100 },
  { month: "Feb", new: 300, returning: 139, churned: 80 },
  { month: "Mar", new: 200, returning: 980, churned: 70 },
  { month: "Apr", new: 278, returning: 390, churned: 90 },
  { month: "May", new: 189, returning: 480, churned: 110 },
  { month: "Jun", new: 239, returning: 380, churned: 95 },
];

const topClients = [
  { name: "Acme Corp", revenue: 50000, color: "#34d399" },
  { name: "Globex", revenue: 40000, color: "#60a5fa" },
  { name: "Soylent", revenue: 30000, color: "#fbbf24" },
  { name: "Initech", revenue: 20000, color: "#f87171" },
];

const invoiceAging = [
  { range: "0-30 days", amount: 12000, color: "#34d399" },
  { range: "31-60 days", amount: 8000, color: "#60a5fa" },
  { range: "61-90 days", amount: 5000, color: "#fbbf24" },
  { range: "90+ days", amount: 2000, color: "#f87171" },
];

export default function StyledBillingDashboard() {
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
              Billing Dashboard
            </h1>
            <p className="text-sm text-gray-500">Last updated: June 30, 2023</p>
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
                <DropdownMenuItem>Download Report</DropdownMenuItem>
                <DropdownMenuItem>Print Summary</DropdownMenuItem>
                <DropdownMenuItem>Share Dashboard</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button className="bg-gradient-to-r from-green-400 to-blue-500 text-white shadow-md hover:shadow-lg transition-all">
              Generate Invoice
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
        >
          <SummaryCard
            title="Total Invoiced"
            amount="$45,231.89"
            change={20.1}
            icon={<DollarSignIcon className="h-4 w-4" />}
          />
          <SummaryCard
            title="Collected"
            amount="$17,390.90"
            change={10.1}
            icon={<ArrowUpIcon className="h-4 w-4" />}
          />
          <SummaryCard
            title="Outstanding"
            amount="$27,840.99"
            change={35.1}
            icon={<ArrowDownIcon className="h-4 w-4" />}
          />
          <SummaryCard
            title="Overdue"
            amount="$8,753.00"
            change={2.5}
            icon={<ClockIcon className="h-4 w-4" />}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6"
        >
          <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50">
              <CardTitle className="text-lg font-semibold text-gray-700">
                Revenue Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="invoiced" fill="#34d399" />
                  <Bar dataKey="collected" fill="#60a5fa" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50">
              <CardTitle className="text-lg font-semibold text-gray-700">
                Customer Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={customerData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="new" stroke="#34d399" />
                  <Line type="monotone" dataKey="returning" stroke="#60a5fa" />
                  <Line type="monotone" dataKey="churned" stroke="#f87171" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6"
        >
          <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50">
              <CardTitle className="text-lg font-semibold text-gray-700">
                Top Clients by Revenue
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={topClients}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="revenue"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {topClients.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50">
              <CardTitle className="text-lg font-semibold text-gray-700">
                Invoice Aging
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                {invoiceAging.map((item, index) => (
                  <div key={index} className="text-center">
                    <div
                      className="text-2xl font-bold"
                      style={{ color: item.color }}
                    >
                      ${(item.amount / 1000).toFixed(1)}k
                    </div>
                    <div className="text-sm text-gray-500">{item.range}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-6 text-sm text-gray-600 bg-gray-50 p-4 rounded-lg shadow-inner"
        >
          <h4 className="font-semibold mb-2 text-lg">Dashboard Summary</h4>
          <p>
            This dashboard provides an overview of your billing and revenue
            metrics. Use the options above to generate detailed reports or
            invoices.
          </p>
        </motion.div>
      </div>
    </main>
  );
}

interface SummaryCardProps {
  title: string;
  amount: string;
  change: number;
  icon: React.ReactNode;
}
function SummaryCard({ title, amount, change, icon }: SummaryCardProps) {
  const isPositive = change >= 0;
  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
      <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50 flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-500">
          {title}
        </CardTitle>
        {icon}
      </CardHeader>
      <CardContent className="pt-4">
        <div className="text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-500 text-transparent bg-clip-text">
          {amount}
        </div>
        <p
          className={`text-xs ${
            isPositive ? "text-green-500" : "text-red-500"
          } flex items-center mt-1`}
        >
          {isPositive ? (
            <ArrowUpIcon className="h-4 w-4 mr-1" />
          ) : (
            <ArrowDownIcon className="h-4 w-4 mr-1" />
          )}
          {Math.abs(change)}% from last month
        </p>
      </CardContent>
    </Card>
  );
}
