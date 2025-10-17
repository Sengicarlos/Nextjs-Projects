"use client";

import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { Bar } from "react-chartjs-2";
import {
  FiHome,
  FiSettings,
  FiSend,
  FiDownload,
  FiLogOut,
  FiCreditCard,
} from "react-icons/fi";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function MoneyDashboard() {
  const { data: session } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [search, setSearch] = useState("");
  const [sendAmount, setSendAmount] = useState("");
  const [sendTo, setSendTo] = useState("");
  const [balance, setBalance] = useState(5230.45);

  const [transactions, setTransactions] = useState([
    { id: 1, type: "Receive", from: "Alice", amount: 120, date: "2025-10-10" },
    { id: 2, type: "Send", to: "Bob", amount: 250, date: "2025-10-11" },
    { id: 3, type: "Receive", from: "Charlie", amount: 80, date: "2025-10-12" },
  ]);

  const [chartData, setChartData] = useState({
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Money Flow",
        data: [1200, 950, 1500, 1100, 1400, 1300],
        backgroundColor: "rgba(14,165,233,0.7)", // Ocean blue
      },
    ],
  });

  const handleSendMoney = () => {
    if (!sendTo || !sendAmount) return alert("Please enter recipient and amount");
    const amountNum = parseFloat(sendAmount);
    if (amountNum > balance) return alert("Insufficient balance");
    
    const newTransaction = {
      id: transactions.length + 1,
      type: "Send",
      to: sendTo,
      amount: amountNum,
      date: new Date().toISOString().split("T")[0],
    };
    setTransactions([newTransaction, ...transactions]);
    setBalance(prev => prev - amountNum);

    setChartData(prev => {
      const newData = [...prev.datasets[0].data];
      newData[newData.length - 1] += amountNum;
      return { ...prev, datasets: [{ ...prev.datasets[0], data: newData }] };
    });

    setSendTo("");
    setSendAmount("");
  };

  const handleReceiveMoney = (amount, from) => {
    const newTransaction = {
      id: transactions.length + 1,
      type: "Receive",
      from,
      amount,
      date: new Date().toISOString().split("T")[0],
    };
    setTransactions([newTransaction, ...transactions]);
    setBalance(prev => prev + amount);

    setChartData(prev => {
      const newData = [...prev.datasets[0].data];
      newData[newData.length - 1] += amount;
      return { ...prev, datasets: [{ ...prev.datasets[0], data: newData }] };
    });
  };

  const menuItems = [
    { label: "Dashboard", icon: <FiHome /> },
    { label: "Send Money", icon: <FiSend /> },
    { label: "Receive Money", icon: <FiDownload /> },
    { label: "Transactions", icon: <FiCreditCard /> },
    { label: "Settings", icon: <FiSettings /> },
  ];

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-sky-50 to-sky-100 text-sky-900">
      {/* Sidebar */}
      <aside className={`bg-sky-700 w-64 flex flex-col transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-64"} md:translate-x-0`}>
        <div className="p-4 flex flex-col h-full">
          <h2 className="text-2xl font-bold mb-6 text-sky-100">Ocean Dashboard</h2>
          <nav className="flex flex-col gap-2 flex-1">
            {menuItems.map(item => (
              <Button key={item.label} variant="ghost" className="justify-start w-full gap-2 text-sky-50 hover:bg-sky-600">
                {item.icon} <span className="hidden md:inline">{item.label}</span>
              </Button>
            ))}
          </nav>

          <div className="mt-auto flex items-center gap-2 p-4 border-t border-sky-500">
            <Avatar className="w-10 h-10">
              {session?.user?.image ? (
                <AvatarImage src={session.user.image} alt={session.user.name} />
              ) : (
                <AvatarFallback>{session?.user?.name?.[0] || "U"}</AvatarFallback>
              )}
            </Avatar>
            <div className="flex-1">
              <p className="font-semibold text-sm text-sky-100">{session?.user?.name || "User"}</p>
              <p className="text-xs text-sky-200">{session?.user?.email || ""}</p>
            </div>
            <Button variant="ghost" className="p-2 text-sky-100" onClick={() => signOut({ callbackUrl: "/" })}>
              <FiLogOut />
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden bg-sky-600 text-white">☰</Button>
            <h1 className="text-3xl font-bold text-sky-900">Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <Input
              placeholder="Search..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-64 bg-sky-100 text-sky-900 border-sky-300 placeholder-sky-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card className="bg-sky-200 shadow-lg p-4 flex items-center justify-between rounded-xl">
            <div>
              <CardTitle className="text-lg text-sky-900">Current Balance</CardTitle>
              <p className="text-2xl font-bold text-sky-700">${balance.toFixed(2)}</p>
            </div>
            <FiCreditCard size={30} className="text-sky-600" />
          </Card>

          <Card className="bg-sky-100 shadow-lg p-4 rounded-xl">
            <CardHeader>
              <CardTitle className="text-sky-900">Send Money</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div>
                <Label className="text-sky-800">Recipient</Label>
                <Input
                  placeholder="Enter recipient"
                  value={sendTo}
                  onChange={e => setSendTo(e.target.value)}
                  className="bg-sky-50 text-sky-900 border-sky-300"
                />
              </div>
              <div>
                <Label className="text-sky-800">Amount</Label>
                <Input
                  placeholder="Enter amount"
                  type="number"
                  value={sendAmount}
                  onChange={e => setSendAmount(e.target.value)}
                  className="bg-sky-50 text-sky-900 border-sky-300"
                />
              </div>
              <Button onClick={handleSendMoney} className="w-full bg-sky-700 hover:bg-sky-600 text-white">
                <FiSend className="mr-2" /> Send
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-sky-100 shadow-lg p-4 flex flex-col items-center justify-center rounded-xl">
            <CardHeader>
              <CardTitle className="text-sky-900">Receive Money</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4">
              <p className="text-sky-700 text-sm">Click to simulate receiving $100 from John</p>
              <Button onClick={() => handleReceiveMoney(100, "John")} className="mt-2 w-full bg-sky-600 hover:bg-sky-500 text-white">
                <FiDownload className="mr-2" /> Receive $100
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-sky-100 shadow-lg rounded-xl">
            <CardHeader>
              <CardTitle className="text-sky-900">Transaction History</CardTitle>
            </CardHeader>
            <CardContent>
              <Table className="bg-sky-50">
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>From/To</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map(t => (
                    <TableRow key={t.id}>
                      <TableCell>{t.id}</TableCell>
                      <TableCell>{t.type}</TableCell>
                      <TableCell>{t.from || t.to}</TableCell>
                      <TableCell>${t.amount}</TableCell>
                      <TableCell>{t.date}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card className="bg-sky-100 shadow-lg rounded-xl">
            <CardHeader>
              <CardTitle className="text-sky-900">Money Flow (Monthly)</CardTitle>
            </CardHeader>
            <CardContent>
              <Bar data={chartData} />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
