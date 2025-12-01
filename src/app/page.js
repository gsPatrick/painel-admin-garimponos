"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform, useSpring, useMotionValue, useMotionTemplate, animate } from "framer-motion";
import { ArrowRight, CheckCircle2, LayoutDashboard, CreditCard, Users, Zap, BarChart3, ShieldCheck, Globe, Layers, Box, Wallet, TrendingUp, RefreshCw, ShoppingBag, Tag, Settings, Truck, MessageCircle, Phone, Rocket, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// --- Components ---

function Navbar() {
    return (
        <motion.nav
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 border-b border-white/5 bg-slate-950/50 backdrop-blur-md supports-[backdrop-filter]:bg-slate-950/20"
        >
            <div className="flex items-center gap-2">
                <div className="size-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                    <LayoutDashboard className="text-white size-5" />
                </div>
                <span className="text-lg font-bold tracking-tight text-white">Painel <span className="text-indigo-400">Ecommerce</span></span>
            </div>
            <Link href="/login">
                <Button variant="ghost" className="text-white hover:text-white hover:bg-white/10 border border-white/10 rounded-full px-6 transition-all duration-300 hover:shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:border-indigo-500/50">
                    Login
                </Button>
            </Link>
        </motion.nav>
    );
}

function Hero3D() {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    function handleMouseMove({ currentTarget, clientX, clientY }) {
        const { left, top, width, height } = currentTarget.getBoundingClientRect();
        const x = clientX - left;
        const y = clientY - top;
        const xPct = x / width - 0.5;
        const yPct = y / height - 0.5;
        mouseX.set(xPct);
        mouseY.set(yPct);
    }

    const rotateX = useTransform(mouseY, [-0.5, 0.5], [15, -15]);
    const rotateY = useTransform(mouseX, [-0.5, 0.5], [-15, 15]);

    return (
        <motion.div
            onMouseMove={handleMouseMove}
            style={{ perspective: 1000 }}
            className="relative w-full max-w-5xl mx-auto mt-16 aspect-[4/5] md:aspect-[16/9] flex items-center justify-center"
        >
            <motion.div
                style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
                className="relative w-full h-full bg-slate-900/40 border border-white/10 rounded-xl backdrop-blur-sm shadow-2xl shadow-indigo-500/10 overflow-hidden group"
            >
                {/* Dashboard Screenshot */}
                <div className="absolute inset-0 bg-slate-950 rounded-xl overflow-hidden">
                    <Image
                        src="/painelescurocerto.png"
                        alt="Dashboard Dark Mode"
                        fill
                        className="object-contain opacity-90 group-hover:opacity-100 transition-opacity duration-500"
                        priority
                    />
                </div>

                {/* Reflection/Glare Effect */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                {/* Glow Effect */}
                <div className="absolute inset-0 bg-indigo-500/10 blur-3xl -z-10 rounded-full" />
            </motion.div>
        </motion.div>
    );
}

function BentoCard({ title, icon: Icon, children, className, delay = 0 }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay }}
            className={cn(
                "group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 hover:border-white/20 transition-colors duration-300",
                className
            )}
        >
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10 h-full flex flex-col">
                <div className="mb-4 inline-flex items-center justify-center rounded-xl bg-white/10 p-3 w-fit group-hover:bg-indigo-500/20 group-hover:text-indigo-300 transition-colors duration-300">
                    <Icon className="size-6 text-white/70 group-hover:text-indigo-300 transition-colors" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-white">{title}</h3>
                <div className="text-slate-400 flex-1">{children}</div>
            </div>
        </motion.div>
    );
}

function FeatureCard({ title, description, icon: Icon, delay }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay, duration: 0.4 }}
            className="p-6 rounded-2xl bg-slate-900/50 border border-white/5 hover:border-indigo-500/30 hover:bg-slate-800/50 transition-all group"
        >
            <div className="size-10 rounded-lg bg-indigo-500/10 flex items-center justify-center mb-4 group-hover:bg-indigo-500/20 transition-colors">
                <Icon className="size-5 text-indigo-400" />
            </div>
            <h4 className="text-lg font-semibold text-white mb-2">{title}</h4>
            <p className="text-sm text-slate-400 leading-relaxed">{description}</p>
        </motion.div>
    )
}

function BusinessCanvas() {
    return (
        <div className="w-full py-20 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-slate-950 to-slate-950" />
            <div className="max-w-5xl mx-auto relative z-10">
                <h2 className="text-3xl font-bold text-center text-white mb-16">Fluxo de Valor Contínuo</h2>

                <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative">
                    {/* Connecting Line */}
                    <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent hidden md:block" />

                    {[
                        { title: "Pedido", icon: Box, desc: "Captura instantânea" },
                        { title: "Pagamento", icon: CreditCard, desc: "Split automático" },
                        { title: "Estoque", icon: Layers, desc: "Baixa em tempo real" },
                        { title: "Cliente", icon: Wallet, desc: "Cashback & LTV" }
                    ].map((step, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.2 }}
                            className="relative z-10 flex flex-col items-center text-center bg-slate-950 border border-white/10 p-6 rounded-2xl w-full md:w-48 hover:border-indigo-500/50 transition-colors shadow-lg shadow-black/50"
                        >
                            <div className="size-12 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <step.icon className="size-6 text-indigo-400" />
                            </div>
                            <h4 className="text-lg font-semibold text-white mb-1">{step.title}</h4>
                            <p className="text-xs text-slate-400">{step.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    )
}

function AgencySection({ className }) {
    return (
        <section className={cn("py-32 relative overflow-hidden", className)}>
            {/* Cinematic Background */}
            <div className="absolute inset-0 bg-slate-950">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-slate-950 to-slate-950" />
                <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "radial-gradient(#4f46e5 1px, transparent 1px)", backgroundSize: "50px 50px" }} />
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 md:p-12 overflow-hidden relative group">
                    {/* Glow Effects */}
                    <div className="absolute -top-24 -right-24 size-96 bg-indigo-600/30 blur-[100px] rounded-full group-hover:bg-indigo-500/40 transition-colors duration-700" />
                    <div className="absolute -bottom-24 -left-24 size-96 bg-purple-600/30 blur-[100px] rounded-full group-hover:bg-purple-500/40 transition-colors duration-700" />

                    <div className="flex flex-col md:flex-row items-center justify-between gap-12">
                        <div className="flex-1 space-y-8 text-center md:text-left">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-sm font-medium text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.3)]"
                            >
                                <Star className="size-4 fill-indigo-300" />
                                Parceiro Oficial de Crescimento
                            </motion.div>

                            <h2 className="text-4xl md:text-6xl font-bold text-white leading-tight">
                                Transforme sua Visão em <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 animate-gradient">Realidade Digital</span>
                            </h2>

                            <p className="text-slate-300 text-xl max-w-xl mx-auto md:mx-0 leading-relaxed">
                                A <strong className="text-white">Agile Projects</strong> não apenas constrói lojas, nós criamos ecossistemas de vendas de alta performance. Design premiado, tecnologia de ponta e estratégia focada em conversão.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-4">
                                <a
                                    href="https://wa.me/5511954728628?text=Ol%C3%A1%2C%20gostaria%20de%20saber%20mais%20sobre%20os%20servi%C3%A7os%20da%20Agile%20Projects"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <Button size="lg" className="h-14 px-10 rounded-full bg-[#25D366] hover:bg-[#128C7E] text-white font-bold text-lg shadow-[0_0_30px_rgba(37,211,102,0.4)] hover:shadow-[0_0_50px_rgba(37,211,102,0.6)] transition-all hover:scale-105 gap-3 w-full sm:w-auto">
                                        <MessageCircle className="size-6" />
                                        Falar no WhatsApp
                                    </Button>
                                </a>
                                <a
                                    href="https://wa.me/5511954728628?text=Ol%C3%A1%2C%20gostaria%20de%20um%20or%C3%A7amento%20para%20meu%20projeto"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <Button variant="outline" size="lg" className="h-14 px-10 rounded-full border-white/20 bg-white/5 text-white hover:bg-white/10 hover:border-white/40 backdrop-blur-md font-semibold text-lg gap-3 w-full sm:w-auto">
                                        <Rocket className="size-5" />
                                        Iniciar Projeto
                                    </Button>
                                </a>
                            </div>
                        </div>

                        <div className="flex-1 flex justify-center md:justify-end relative">
                            <div className="relative z-10 bg-gradient-to-br from-slate-900 to-slate-950 border border-white/10 rounded-3xl p-8 shadow-2xl shadow-indigo-500/20 rotate-3 hover:rotate-0 transition-transform duration-500 group-hover:scale-105">
                                <div className="absolute inset-0 bg-white/5 rounded-3xl backdrop-blur-sm" />
                                <Image
                                    src="/images/agileprojectslogo.png"
                                    alt="Agile Projects Logo"
                                    width={300}
                                    height={300}
                                    className="relative z-10 drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                                />
                            </div>
                            {/* Decorative Elements */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[400px] border border-white/5 rounded-full animate-[spin_10s_linear_infinite]" />
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[500px] border border-white/5 rounded-full animate-[spin_15s_linear_infinite_reverse]" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-indigo-500/30 selection:text-indigo-200 font-sans overflow-x-hidden">
            {/* Background Grid */}
            <div
                className="fixed inset-0 z-0 pointer-events-none opacity-20"
                style={{
                    backgroundImage: "radial-gradient(#64748b 1px, transparent 1px)",
                    backgroundSize: "30px 30px"
                }}
            />

            {/* Spotlights */}
            <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-indigo-600/20 blur-[120px] rounded-full pointer-events-none z-0" />

            <Navbar />

            <main className="relative z-10 pt-32 pb-0 px-6">
                {/* Hero Section */}
                <section className="max-w-6xl mx-auto text-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-indigo-300 mb-6 hover:bg-white/10 transition-colors cursor-default">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                            </span>
                            v2.0 Disponível Agora
                        </div>
                        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6 leading-tight">
                            O Cérebro Digital <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 animate-gradient">
                                do seu E-commerce.
                            </span>
                        </h1>
                        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                            Matriz de Produtos, Gateways de Pagamento e CRM. Tudo conectado em uma experiência visual imersiva e de alta performance.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link href="/login">
                                <div className="relative group">
                                    <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                                    <Button size="lg" className="relative h-14 px-10 rounded-full bg-slate-950 text-white border border-white/10 hover:bg-slate-900 font-bold text-lg shadow-2xl flex items-center gap-3 overflow-hidden">
                                        <span className="relative z-10">Acessar Painel</span>
                                        <ArrowRight className="size-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </Button>
                                </div>
                            </Link>

                            <a
                                href="https://wa.me/5511954728628?text=Ol%C3%A1%2C%20gostaria%20de%20saber%20mais%20sobre%20o%20Painel%20Ecommerce"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Button variant="ghost" size="lg" className="h-14 px-8 rounded-full text-slate-400 hover:text-white hover:bg-white/5 gap-2">
                                    <MessageCircle className="size-5" />
                                    Falar com Especialista
                                </Button>
                            </a>
                        </div>
                    </motion.div>

                    {/* 3D Dashboard Mockup */}
                    <Hero3D />
                </section>

                {/* Agency Section 1 (After Hero) */}
                <AgencySection className="mb-32 border-b border-white/5" />

                {/* The Core - Bento Grid */}
                <section className="max-w-6xl mx-auto mb-32">
                    <div className="mb-16 text-center">
                        <h2 className="text-3xl font-bold text-white mb-4">The Core</h2>
                        <p className="text-slate-400">Arquitetura robusta para escalar sua operação.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
                        {/* Card 1: Produtos (Large) */}
                        <BentoCard
                            title="Matriz de Produtos"
                            icon={Box}
                            className="md:col-span-2"
                            delay={0.1}
                        >
                            <div className="flex flex-col justify-between h-full">
                                <p className="text-sm leading-relaxed mb-6">
                                    Gerencie variações complexas de SKU, controle de estoque em tempo real e precificação dinâmica. Suporte total para grades de cor e tamanho.
                                </p>
                                <div className="flex gap-3">
                                    <div className="px-3 py-1 rounded-md bg-slate-800 border border-white/5 text-xs text-slate-300">SKU Ilimitados</div>
                                    <div className="px-3 py-1 rounded-md bg-slate-800 border border-white/5 text-xs text-slate-300">Multimídia</div>
                                    <div className="px-3 py-1 rounded-md bg-slate-800 border border-white/5 text-xs text-slate-300">SEO Auto</div>
                                </div>
                            </div>
                        </BentoCard>

                        {/* Card 2: Financeiro */}
                        <BentoCard
                            title="Financeiro Inteligente"
                            icon={CreditCard}
                            delay={0.2}
                        >
                            <div className="space-y-4 mt-2">
                                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900/50 border border-white/5">
                                    <span className="text-sm font-medium">Mercado Pago</span>
                                    <div className="size-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                                </div>
                                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900/50 border border-white/5">
                                    <span className="text-sm font-medium">Asaas</span>
                                    <div className="size-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                                </div>
                            </div>
                        </BentoCard>

                        {/* Card 3: CRM */}
                        <BentoCard
                            title="CRM & LTV"
                            icon={Users}
                            delay={0.3}
                        >
                            <div className="mt-2">
                                <div className="text-4xl font-bold text-white mb-1">R$ 1.2k</div>
                                <p className="text-xs text-indigo-400 font-medium mb-4">LTV Médio / Cliente</p>
                                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-indigo-500 w-[70%]" />
                                </div>
                            </div>
                        </BentoCard>

                        {/* Card 4: Integração (Large) */}
                        <BentoCard
                            title="Ecossistema Conectado"
                            icon={Globe}
                            className="md:col-span-2"
                            delay={0.4}
                        >
                            <div className="flex flex-col justify-between h-full">
                                <p className="text-sm leading-relaxed mb-6">
                                    Sincronização bidirecional com plataformas externas. Mantenha seu Brechó e E-commerce sempre alinhados com atualizações de estoque em milissegundos.
                                </p>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex items-center gap-2 text-sm text-slate-300">
                                        <RefreshCw className="size-4 text-indigo-400" /> Sync Real-time
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-slate-300">
                                        <ShieldCheck className="size-4 text-emerald-400" /> Dados Seguros
                                    </div>
                                </div>
                            </div>
                        </BentoCard>
                    </div>
                </section>

                {/* Detailed Features Grid */}
                <section className="max-w-6xl mx-auto mb-32 px-4">
                    <div className="mb-16 text-center">
                        <h2 className="text-3xl font-bold text-white mb-4">Domine Todas as Frentes</h2>
                        <p className="text-slate-400">Ferramentas especializadas para cada aspecto do seu negócio.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <FeatureCard
                            title="Gestão de Produtos"
                            description="Controle total de variações (cor, tamanho), imagens ilimitadas e baixa automática de estoque."
                            icon={ShoppingBag}
                            delay={0.1}
                        />
                        <FeatureCard
                            title="Pedidos & Logística"
                            description="Fluxo de status personalizável, geração de etiquetas e rastreio integrado para entrega eficiente."
                            icon={Truck}
                            delay={0.2}
                        />
                        <FeatureCard
                            title="Marketing & Promoções"
                            description="Motor de cupons flexível, campanhas sazonais e recuperação de carrinho para maximizar vendas."
                            icon={Tag}
                            delay={0.3}
                        />
                        <FeatureCard
                            title="CRM & Clientes"
                            description="Histórico completo de compras, cálculo de LTV e segmentação inteligente para fidelização."
                            icon={Users}
                            delay={0.4}
                        />
                        <FeatureCard
                            title="Relatórios Avançados"
                            description="Dashboards em tempo real, curvas ABC e análise de lucratividade para decisões baseadas em dados."
                            icon={BarChart3}
                            delay={0.5}
                        />
                        <FeatureCard
                            title="Configurações Globais"
                            description="Personalização de identidade visual, SEO automatizado e integrações via API."
                            icon={Settings}
                            delay={0.6}
                        />
                    </div>
                </section>

                {/* Business Canvas */}
                <BusinessCanvas />

                {/* Agency Section 2 (Bottom) */}
                <AgencySection />

            </main>

            {/* Footer */}
            <footer className="mx-6 md:mx-auto max-w-5xl mb-12 rounded-3xl border border-white/10 bg-slate-950/30 py-8 relative z-10 backdrop-blur-md">
                <div className="px-6 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="size-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                            <LayoutDashboard className="text-white size-4" />
                        </div>
                        <span className="text-lg font-bold text-white">Painel Ecommerce</span>
                    </div>
                    <p className="text-sm text-slate-400">
                        © 2024 Lorena E-commerce. Todos os direitos reservados.
                    </p>
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        <a href="http://codebypatrick.dev/" target="_blank" rel="noopener noreferrer" className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors font-medium hover:underline underline-offset-4">
                            Desenvolvido por: Patrick.Developer
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
