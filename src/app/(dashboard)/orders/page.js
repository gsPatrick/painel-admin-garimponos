"use client";

import { useState, useEffect } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    MoreHorizontal,
    Search,
    Filter,
    Download,
    ShoppingBag,
    Globe,
    Store,
} from "lucide-react";
import Link from "next/link";
import AppService from "@/services/app.service";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";

export default function OrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true);
            try {
                const data = await AppService.getOrders();
                setOrders(data || []);
            } catch (error) {
                console.error("Failed to fetch orders:", error);
                toast.error("Erro ao carregar pedidos.");
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const filteredOrders = orders.filter((order) => {
        const matchesSearch =
            (order.id || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
            (order.User?.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
            (order.User?.email || "").toLowerCase().includes(searchTerm.toLowerCase());

        if (statusFilter === "all") return matchesSearch;
        if (statusFilter === "unpaid")
            return matchesSearch && order.paymentStatus === "pending";
        if (statusFilter === "unfulfilled")
            return matchesSearch && order.fulfillmentStatus === "unfulfilled";
        if (statusFilter === "completed")
            return matchesSearch && order.status === "completed";

        return matchesSearch;
    });

    const getStatusBadge = (status) => {
        switch (status) {
            case "paid":
                return <Badge className="bg-green-500 hover:bg-green-600">Pago</Badge>;
            case "pending":
                return (
                    <Badge variant="secondary" className="text-yellow-600 bg-yellow-100">
                        Pendente
                    </Badge>
                );
            case "refunded":
                return <Badge variant="outline">Reembolsado</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    const getFulfillmentBadge = (status) => {
        switch (status) {
            case "fulfilled":
                return <Badge className="bg-blue-500 hover:bg-blue-600">Enviado</Badge>;
            case "delivered":
                return <Badge className="bg-green-500 hover:bg-green-600">Entregue</Badge>;
            case "unfulfilled":
                return (
                    <Badge variant="secondary" className="text-yellow-600 bg-yellow-100">
                        Não Enviado
                    </Badge>
                );
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    const getOriginIcon = (items) => {
        // Simple logic to determine origin based on item types
        const hasBrecho = (items || []).some(i => i.type === 'Brechó');
        const hasFisico = (items || []).some(i => i.type === 'Físico');

        if (hasBrecho && hasFisico) return <Store className="h-4 w-4 text-purple-500" title="Misto" />;
        if (hasBrecho) return <Store className="h-4 w-4 text-orange-500" title="Brechó" />;
        return <Globe className="h-4 w-4 text-blue-500" title="Web" />;
    };

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Pedidos</h2>
                <div className="flex items-center space-x-2">
                    <Button variant="outline">
                        <Download className="mr-2 h-4 w-4" />
                        Exportar CSV
                    </Button>
                </div>
            </div>
            <Tabs defaultValue="all" className="space-y-4" onValueChange={setStatusFilter}>
                <TabsList>
                    <TabsTrigger value="all">Todos</TabsTrigger>
                    <TabsTrigger value="unpaid">Não Pagos</TabsTrigger>
                    <TabsTrigger value="unfulfilled">Não Enviados</TabsTrigger>
                    <TabsTrigger value="completed">Concluídos</TabsTrigger>
                </TabsList>
                <div className="flex items-center justify-between space-x-2">
                    <div className="flex flex-1 items-center space-x-2">
                        <Input
                            placeholder="Buscar pedidos..."
                            className="h-8 w-[150px] lg:w-[250px]"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Button variant="outline" size="sm" className="h-8 border-dashed">
                            <Filter className="mr-2 h-4 w-4" />
                            Filtros
                        </Button>
                    </div>
                </div>
                <Card>
                    <CardHeader className="px-7">
                        <CardTitle>Pedidos Recentes</CardTitle>
                        <CardDescription>
                            Gerencie seus pedidos e acompanhe o status de entrega.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[100px]">Pedido</TableHead>
                                    <TableHead>Data</TableHead>
                                    <TableHead>Cliente</TableHead>
                                    <TableHead>Pagamento</TableHead>
                                    <TableHead>Entrega</TableHead>
                                    <TableHead>Itens</TableHead>
                                    <TableHead className="text-right">Total</TableHead>
                                    <TableHead className="w-[50px]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={8} className="text-center h-24">
                                            Carregando pedidos...
                                        </TableCell>
                                    </TableRow>
                                ) : filteredOrders.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={8} className="text-center h-24">
                                            Nenhum pedido encontrado.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredOrders.map((order) => (
                                        <TableRow key={order.id}>
                                            <TableCell className="font-medium">
                                                <Link
                                                    href={`/orders/${order.id}`}
                                                    className="flex items-center hover:underline"
                                                >
                                                    #{order.id}
                                                    <span className="ml-2">
                                                        {getOriginIcon(order.items)}
                                                    </span>
                                                </Link>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span title={new Date(order.createdAt).toLocaleString()}>
                                                        {formatDistanceToNow(new Date(order.createdAt), {
                                                            addSuffix: true,
                                                            locale: ptBR,
                                                        })}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                                                        {(order.User?.name || "C").charAt(0).toUpperCase()}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="font-medium text-sm">{order.User?.name || "N/A"}</span>
                                                        <span className="text-xs text-muted-foreground">{order.User?.email || "N/A"}</span>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>{getStatusBadge(order.paymentStatus)}</TableCell>
                                            <TableCell>
                                                {getFulfillmentBadge(order.fulfillmentStatus)}
                                            </TableCell>
                                            <TableCell>
                                                {(order.items || []).reduce((acc, item) => acc + item.quantity, 0)} itens
                                            </TableCell>
                                            <TableCell className="text-right font-mono">
                                                {(order.total || 0).toLocaleString("pt-BR", {
                                                    style: "currency",
                                                    currency: "BRL",
                                                })}
                                            </TableCell>
                                            <TableCell>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
                                                        >
                                                            <MoreHorizontal className="h-4 w-4" />
                                                            <span className="sr-only">Abrir menu</span>
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-[160px]">
                                                        <DropdownMenuItem asChild>
                                                            <Link href={`/orders/${order.id}`}>Ver detalhes</Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem>Imprimir</DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem className="text-red-600">
                                                            Cancelar
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </Tabs>
        </div>
    );
}
