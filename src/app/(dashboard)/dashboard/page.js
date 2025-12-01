"use client";

import React, { useState, useEffect } from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell
} from "recharts";
import {
  ArrowUpRight, ArrowDownRight, DollarSign, CreditCard,
  Activity, Users, Calendar as CalendarIcon, Download, MoreHorizontal
} from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import AppService from "@/services/app.service";
import { toast } from "sonner";

export default function DashboardPage() {
  const [dateRange, setDateRange] = useState("7d");
  const [isLoading, setIsLoading] = useState(true);

  // State for Data
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    conversionRate: 0,
    activeUsers: 0
  });
  const [salesData, setSalesData] = useState([]);
  const [funnelData, setFunnelData] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [dashboardStats, salesReports, funnel] = await Promise.all([
          AppService.getDashboardData(),
          AppService.getSalesReports(dateRange),
          AppService.getFunnelData()
        ]);

        // Process Stats
        setStats({
          totalRevenue: dashboardStats.totalRevenue || 0,
          totalOrders: dashboardStats.totalOrders || 0,
          conversionRate: funnel.overallConversionRate || 0,
          activeUsers: funnel.visitors || 0 // Using visitors as proxy for active users
        });

        // Process Sales Data (Chart)
        const formattedSales = Array.isArray(salesReports) ? salesReports.map(item => ({
          name: new Date(item.date).toLocaleDateString('pt-BR', { weekday: 'short' }),
          revenue: parseFloat(item.revenue),
          orders: parseInt(item.orders)
        })) : [];
        setSalesData(formattedSales);

        // Process Funnel Data
        setFunnelData([
          { name: "Visitantes", value: parseInt(funnel.visitors) || 0 },
          { name: "Carrinho", value: parseInt(funnel.addToCart) || 0 },
          { name: "Checkout", value: parseInt(funnel.checkouts) || 0 },
          { name: "Compra", value: parseInt(funnel.purchases) || 0 },
        ]);

        // Process Recent Orders
        const formattedOrders = (dashboardStats.recentOrders || []).map(order => ({
          id: `#ORD-${order.id}`,
          customer: order.User ? order.User.name : "Cliente",
          total: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(order.total),
          status: order.status,
          date: new Date(order.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
        }));
        setRecentOrders(formattedOrders);

      } catch (error) {
        console.error("Error loading dashboard:", error);
        toast.error("Erro ao carregar dados do dashboard.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [dateRange]);

  // Status Badge Helper
  const getStatusBadge = (status) => {
    switch (status) {
      case 'paid':
      case 'Pago': return <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/25 border-emerald-200/20">Pago</Badge>;
      case 'shipped':
      case 'Enviado': return <Badge className="bg-blue-500/15 text-blue-600 dark:text-blue-400 hover:bg-blue-500/25 border-blue-200/20">Enviado</Badge>;
      case 'processing':
      case 'Processando': return <Badge className="bg-yellow-500/15 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-500/25 border-yellow-200/20">Processando</Badge>;
      case 'cancelled':
      case 'Cancelado': return <Badge variant="destructive" className="bg-red-500/15 text-red-600 dark:text-red-400 hover:bg-red-500/25 border-red-200/20">Cancelado</Badge>;
      default: return <Badge variant="outline" className="bg-gray-500/15 text-gray-600 dark:text-gray-400 hover:bg-gray-500/25 border-gray-200/20">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6 pb-10">

      {/* --- HEADER --- */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Bem-vindo ao painel de controle da LuxeStore.</p>
        </div>

        <div className="flex items-center gap-2 bg-white/60 dark:bg-black/40 p-1 rounded-xl border border-white/20 backdrop-blur-md shadow-sm">
          <Tabs defaultValue="7d" value={dateRange} onValueChange={setDateRange}>
            <TabsList className="bg-transparent h-9 p-0 gap-1">
              <TabsTrigger value="24h" className="rounded-lg text-xs px-3">24h</TabsTrigger>
              <TabsTrigger value="7d" className="rounded-lg text-xs px-3">7d</TabsTrigger>
              <TabsTrigger value="30d" className="rounded-lg text-xs px-3">30d</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="w-[1px] h-4 bg-border mx-1" />
          <Button size="icon" variant="ghost" className="h-8 w-8 rounded-lg hover:bg-white/50">
            <Download className="h-4 w-4 text-muted-foreground" />
          </Button>
        </div>
      </div>

      {/* --- KPI GRID --- */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            title: "Receita Total",
            value: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(stats.totalRevenue),
            change: "+0%", // Placeholder for now as API doesn't return change yet
            trend: "up",
            icon: DollarSign,
            color: "text-primary"
          },
          {
            title: "Pedidos",
            value: stats.totalOrders.toString(),
            change: "+0%",
            trend: "up",
            icon: CreditCard,
            color: "text-purple-500"
          },
          {
            title: "Taxa de Conversão",
            value: `${stats.conversionRate.toFixed(1)}%`,
            change: "0%",
            trend: "down",
            icon: Activity,
            color: "text-rose-500"
          },
          {
            title: "Visitantes",
            value: stats.activeUsers.toString(),
            change: "+0",
            trend: "up",
            icon: Users,
            color: "text-orange-500"
          },
        ].map((kpi, i) => (
          <Card key={i} className="glass border-white/20 dark:border-white/5 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{kpi.title}</CardTitle>
              <div className={`p-2 rounded-lg bg-background/50 ${kpi.color}`}>
                <kpi.icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold tracking-tight">{isLoading ? "..." : kpi.value}</div>
              <p className="text-xs text-muted-foreground flex items-center mt-2">
                <span className={`flex items-center font-medium ${kpi.trend === 'up' ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {kpi.trend === 'up' ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
                  {kpi.change}
                </span>
                <span className="ml-1 opacity-70">vs. período anterior</span>
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* --- CHARTS GRID --- */}
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-7">

        {/* Revenue Chart */}
        <Card className="col-span-1 lg:col-span-4 glass border-white/20 dark:border-white/5 shadow-lg">
          <CardHeader>
            <CardTitle>Receita vs Pedidos</CardTitle>
            <CardDescription>Acompanhamento financeiro semanal</CardDescription>
          </CardHeader>
          <CardContent className="pl-0">
            <div className="h-[300px] sm:h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={salesData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.5} />
                  <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                  <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `R$${value / 1000}k`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(10px)', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.1)', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                    itemStyle={{ color: 'var(--foreground)' }}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="var(--primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" activeDot={{ r: 8 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Funnel Chart */}
        <Card className="col-span-1 lg:col-span-3 glass border-white/20 dark:border-white/5 shadow-lg">
          <CardHeader>
            <CardTitle>Funil de Conversão</CardTitle>
            <CardDescription>Eficiência do checkout</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] sm:h-[350px] w-full flex items-center">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={funnelData} layout="vertical" margin={{ top: 0, right: 0, left: 40, bottom: 0 }}>
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" width={80} tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip cursor={{ fill: 'var(--muted)', opacity: 0.2 }} contentStyle={{ borderRadius: '8px' }} />
                  <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={32}>
                    {funnelData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? 'var(--muted-foreground)' : 'var(--primary)'} fillOpacity={0.3 + (index * 0.2)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* --- ORDERS TABLE --- */}
      <Card className="glass border-white/20 dark:border-white/5 shadow-lg overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Últimos Pedidos</CardTitle>
            <CardDescription>Transações processadas recentemente.</CardDescription>
          </div>
          <Button variant="outline" size="sm" className="hidden sm:flex hover:bg-primary/10 hover:text-primary hover:border-primary/20">
            Ver Todos
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow className="border-b border-white/10">
                <TableHead className="w-[100px] pl-6">ID</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead className="hidden md:table-cell">Data</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right pr-6">Total</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">Carregando...</TableCell>
                </TableRow>
              ) : recentOrders.map((order) => (
                <TableRow key={order.id} className="border-b border-white/5 hover:bg-muted/40 transition-colors">
                  <TableCell className="font-medium pl-6 text-primary">{order.id}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium text-sm">{order.customer}</span>
                      <span className="text-xs text-muted-foreground md:hidden">{order.date}</span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground text-sm">{order.date}</TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                  <TableCell className="text-right font-mono font-medium pr-6">{order.total}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-[160px]">
                        <DropdownMenuItem>Ver Detalhes</DropdownMenuItem>
                        <DropdownMenuItem>Baixar Fatura</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-500 focus:text-red-500">Cancelar Pedido</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}