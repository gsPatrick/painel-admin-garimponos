"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { KPICards } from "@/components/dashboard/KPICards";
import { SalesChart } from "@/components/dashboard/SalesChart";
import { CategoryPieChart } from "@/components/dashboard/CategoryPieChart";
import { OrdersBarChart } from "@/components/dashboard/OrdersBarChart";
import { OrderDetailsModal } from "@/components/dashboard/OrderDetailsModal";
import { Button } from "@/components/ui/button";
import { Plus, Truck, ArrowRight, ShoppingBag } from "lucide-react";
import Link from "next/link";
import AppService from "@/services/app.service";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";

export default function DashboardPage() {
    const [dateRange, setDateRange] = useState("30d");
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

    const { data, isLoading, error } = useQuery({
        queryKey: ["dashboard-executive", dateRange],
        queryFn: async () => {
            return await AppService.getDashboardData();
        },
    });

    const handleOrderClick = (order) => {
        setSelectedOrder(order);
        setIsOrderModalOpen(true);
    };

    if (isLoading) {
        return (
            <div className="space-y-8 pb-10">
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                    <div className="space-y-2">
                        <Skeleton className="h-8 w-48" />
                        <Skeleton className="h-4 w-64" />
                    </div>
                    <div className="flex gap-2">
                        <Skeleton className="h-10 w-32" />
                        <Skeleton className="h-10 w-32" />
                    </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {[...Array(4)].map((_, i) => (
                        <Skeleton key={i} className="h-32 rounded-xl" />
                    ))}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 h-[400px]">
                    <Skeleton className="lg:col-span-3 h-full rounded-xl" />
                    <Skeleton className="lg:col-span-1 h-full rounded-xl" />
                </div>
            </div>
        );
    }

    if (error) {
        return <div className="p-8 text-center text-destructive">Erro ao carregar dashboard. Tente novamente mais tarde.</div>;
    }

    // Empty State Check
    if (!data || data.totalOrders === 0) {
        return (
            <div className="space-y-8 pb-10">
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h2>
                        <p className="text-muted-foreground mt-1">Visão geral do desempenho da sua loja.</p>
                    </div>
                    <Link href="/products/new">
                        <Button className="gap-2">
                            <Plus className="size-4" /> Novo Produto
                        </Button>
                    </Link>
                </div>

                <EmptyState
                    icon={ShoppingBag}
                    title="Nenhuma venda realizada"
                    description="Parece que sua loja ainda não tem vendas. Comece cadastrando produtos e configurando sua loja."
                    actionLabel="Configurar Loja"
                    onAction={() => window.location.href = '/settings'}
                    className="h-[60vh]"
                />
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-10">
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h2>
                    <p className="text-muted-foreground mt-1">Visão geral do desempenho da sua loja.</p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
                    {/* Date Filter */}
                    <Tabs defaultValue="30d" className="w-full sm:w-auto" onValueChange={setDateRange}>
                        <TabsList className="grid w-full grid-cols-4 sm:w-auto">
                            <TabsTrigger value="7d">7 Dias</TabsTrigger>
                            <TabsTrigger value="30d">Mês</TabsTrigger>
                            <TabsTrigger value="90d">3 Meses</TabsTrigger>
                            <TabsTrigger value="1y">Ano</TabsTrigger>
                        </TabsList>
                    </Tabs>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <Link href="/shipping">
                            <Button variant="outline" size="icon" className="shrink-0">
                                <Truck className="size-4" />
                            </Button>
                        </Link>
                        <Link href="/products/new" className="w-full sm:w-auto">
                            <Button className="w-full gap-2 shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90">
                                <Plus className="size-4" />
                                <span className="hidden sm:inline">Novo Produto</span>
                                <span className="sm:hidden">Produto</span>
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* KPIs */}
            <KPICards data={data} />

            {/* Bento Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-[minmax(380px,auto)]">

                {/* Main Sales Chart - Spans 3 cols */}
                <div className="lg:col-span-3 h-full">
                    <SalesChart className="h-full" data={data.revenueChart} />
                </div>

                {/* Category Pie Chart - Spans 1 col */}
                <div className="lg:col-span-1 h-full">
                    <CategoryPieChart data={data.sales_by_category} />
                </div>

                {/* Recent Orders - Spans 2 cols */}
                <div className="lg:col-span-2 h-full">
                    <Card className="h-full shadow-lg border-border/50 bg-gradient-to-b from-white to-slate-50 dark:from-zinc-900 dark:to-zinc-950/50 flex flex-col">
                        <CardHeader className="flex flex-row items-center justify-between pb-4">
                            <div className="space-y-1">
                                <CardTitle>Pedidos Recentes</CardTitle>
                                <CardDescription>Últimas transações.</CardDescription>
                            </div>
                            <Link href="/orders">
                                <Button variant="ghost" size="sm" className="gap-1 text-xs font-medium text-primary hover:text-primary/80 h-8">
                                    Ver todos <ArrowRight className="size-3" />
                                </Button>
                            </Link>
                        </CardHeader>
                        <CardContent className="flex-1 overflow-auto pr-2">
                            <div className="space-y-3">
                                {data.recentOrders?.map(order => (
                                    <div
                                        key={order.id}
                                        className="flex items-center justify-between group p-3 rounded-xl hover:bg-muted/50 transition-all cursor-pointer border border-transparent hover:border-border/50"
                                        onClick={() => handleOrderClick(order)}
                                    >
                                        <div className="flex items-center gap-3">
                                            <Avatar className="size-9 border border-border/50">
                                                <AvatarFallback className="bg-primary/5 text-primary text-[10px] font-bold">
                                                    {order.customer?.slice(0, 2).toUpperCase() || 'CL'}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="text-sm font-semibold leading-none text-foreground group-hover:text-primary transition-colors">
                                                    {order.customer || 'Cliente'}
                                                </p>
                                                <p className="text-[10px] text-muted-foreground mt-1 font-medium">
                                                    #{order.id} • {new Date(order.date).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-bold text-foreground">R$ {parseFloat(order.total).toFixed(2)}</p>
                                            <Badge variant="secondary" className={`mt-1 text-[10px] uppercase font-bold tracking-wide border-0 px-1.5 py-0.5 ${order.status === 'paid' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' :
                                                order.status === 'pending' ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400' :
                                                    'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                                                }`}>
                                                {order.status}
                                            </Badge>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Orders Bar Chart - Spans 2 cols */}
                <div className="lg:col-span-2 h-full">
                    <OrdersBarChart data={data.orders_by_status} />
                </div>

            </div>

            {/* Order Details Modal */}
            <OrderDetailsModal
                order={selectedOrder}
                open={isOrderModalOpen}
                onOpenChange={setIsOrderModalOpen}
            />
        </div>
    );
}
