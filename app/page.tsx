'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Layers,
    Globe,
    Database,
    Zap,
    Activity,
    Command,
    RefreshCw,
    CheckCircle2,
    AlertTriangle,
    ArrowUpRight
} from 'lucide-react';

// --- Types ---
interface ServiceNode {
    id: string;
    name: string;
    latency: number;
    status: 'operational' | 'degraded';
}

interface LogEntry {
    id: number;
    time: string;
    msg: string;
    type: 'success' | 'warning';
}

// --- Configuration ---
const POINTS_COUNT = 40;     // Fewer points = smoother curve
const UPDATE_SPEED = 1000;   // Update data every 1s (Standard monitoring interval)

export default function SentinelClean() {
    const [isRefreshing, setIsRefreshing] = useState(false);

    // State
    const [dataPoints, setDataPoints] = useState<number[]>(new Array(POINTS_COUNT).fill(40));
    const [currentLoad, setCurrentLoad] = useState(42);
    const [logs, setLogs] = useState<LogEntry[]>([]);

    // Services Data
    const [services, setServices] = useState<ServiceNode[]>([
        { id: '1', name: 'API Gateway', latency: 24, status: 'operational' },
        { id: '2', name: 'Auth Cluster', latency: 45, status: 'operational' },
        { id: '3', name: 'Edge Nodes', latency: 12, status: 'operational' },
    ]);

    const logsEndRef = useRef<HTMLDivElement>(null);

    // --- 1. The "Physics" Engine (Data Updates) ---
    useEffect(() => {
        const interval = setInterval(() => {
            setDataPoints(prev => {
                const last = prev[prev.length - 1];

                // Gentle Random Walk
                // We limit the change to small steps (+/- 5) to prevent jagged spikes
                let change = (Math.random() - 0.5) * 10;

                // "Gravity" - Pulls the line back to center (50%) if it gets too extreme
                if (last > 80) change -= 5;
                if (last < 20) change += 5;

                const next = Math.max(10, Math.min(90, last + change));

                setCurrentLoad(Math.round(next));
                return [...prev.slice(1), next];
            });
        }, 100); // 10 updates per second = silky smooth conveyor

        return () => clearInterval(interval);
    }, []);

    // --- 2. Simulation Effects (Latency & Logs) ---
    useEffect(() => {
        // Latency Jitter
        const latInterval = setInterval(() => {
            setServices(prev => prev.map(s => ({
                ...s,
                latency: Math.max(5, s.latency + (Math.random() > 0.5 ? 2 : -2))
            })));
        }, 2000);

        // Logs Generator
        const logInterval = setInterval(() => {
            const messages = [
                "Packet handshake acknowledged", "Cache invalidated",
                "Load balancer optimized", "Incoming webhook verified",
                "Database shard sync", "Health check passed"
            ];
            const msg = messages[Math.floor(Math.random() * messages.length)];

            setLogs(prev => [...prev.slice(-5), {
                id: Date.now(),
                time: new Date().toLocaleTimeString([], { hour12: false, hour:'2-digit', minute:'2-digit', second:'2-digit' }),
                msg,
                type: Math.random() > 0.9 ? 'warning' : 'success'
            }]);
        }, 3000);

        return () => {
            clearInterval(latInterval);
            clearInterval(logInterval);
        };
    }, []);

    // --- 3. Bezier Smoothing Algorithm (The "Anti-Mountain" Fix) ---
    // This calculates a smooth curve through the points instead of straight lines
    const getSmoothPath = (points: number[], width: number, height: number) => {
        if (points.length === 0) return "";

        const stepX = width / (points.length - 1);
        const dataHeight = (val: number) => height - (val / 100) * height;

        // Start
        let path = `M 0 ${dataHeight(points[0])}`;

        // Loop through points and draw Quadratic curves between midpoints
        for (let i = 0; i < points.length - 1; i++) {
            const x0 = i * stepX;
            const y0 = dataHeight(points[i]);
            const x1 = (i + 1) * stepX;
            const y1 = dataHeight(points[i + 1]);

            // Calculate the midpoint between this point and the next
            const midX = (x0 + x1) / 2;
            const midY = (y0 + y1) / 2;

            // Curve to the midpoint
            if (i === 0) {
                path += ` L ${midX} ${midY}`;
            } else {
                // Quadratic Bezier (Smoothness magic)
                path += ` Q ${x0} ${y0}, ${midX} ${midY}`;
            }
        }

        // Connect to last point
        const lastX = (points.length - 1) * stepX;
        const lastY = dataHeight(points[points.length - 1]);
        path += ` L ${lastX} ${lastY}`;

        return path;
    };

    const areaPath = (points: number[]) =>
        `${getSmoothPath(points, 100, 100)} L 100 100 L 0 100 Z`;

    const handleRefresh = () => {
        setIsRefreshing(true);
        setTimeout(() => setIsRefreshing(false), 1000);
    };

    return (
        <div className="min-h-screen w-full p-6 md:p-12 font-sans transition-colors duration-500 bg-[#FAFAFA] dark:bg-[#050505] text-neutral-900 dark:text-neutral-100">

            {/* Background: Clean grid, no blur mess */}
            <div className="fixed inset-0 pointer-events-none opacity-40 dark:opacity-20 bg-[radial-gradient(#d4d4d8_1px,transparent_1px)] dark:bg-[radial-gradient(#52525b_1px,transparent_1px)] [background-size:20px_20px]"></div>

            <main className="relative max-w-6xl mx-auto flex flex-col gap-6 z-10">

                {/* Header */}
                <header className="flex justify-between items-center py-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white dark:bg-neutral-900 shadow-sm border border-neutral-200 dark:border-neutral-800 flex items-center justify-center">
                            <Layers className="w-5 h-5 text-indigo-600 dark:text-white" />
                        </div>
                        <div>
                            <h1 className="font-bold text-lg tracking-tight text-neutral-900 dark:text-white">Sentinel</h1>
                            <p className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">Production Environment</p>
                        </div>
                    </div>
                    <button
                        onClick={handleRefresh}
                        className="group px-4 py-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-xs font-semibold text-neutral-600 dark:text-neutral-400 shadow-sm hover:border-neutral-300 dark:hover:border-neutral-700 transition-all active:scale-95 flex items-center gap-2"
                    >
                        <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
                        <span>Sync</span>
                    </button>
                </header>

                {/* Top Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {services.map((s, i) => (
                        <div key={s.id} className="group bg-white dark:bg-neutral-900/50 rounded-xl p-5 border border-neutral-200 dark:border-neutral-800 shadow-sm transition-all">
                            <div className="flex justify-between items-start mb-6">
                                <div className={`p-2 rounded-lg border dark:border-0 ${
                                    i===0 ? 'bg-blue-50 border-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400' :
                                        i===1 ? 'bg-indigo-50 border-indigo-100 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400' :
                                            'bg-emerald-50 border-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400'
                                }`}>
                                    {i===0 ? <Globe className="w-4 h-4"/> : i===1 ? <Database className="w-4 h-4"/> : <Zap className="w-4 h-4"/>}
                                </div>
                                <div className="flex items-center gap-1.5 px-2 py-1 bg-neutral-100 dark:bg-white/5 rounded-full border border-neutral-200 dark:border-transparent">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                                    <span className="text-[10px] font-bold text-neutral-600 dark:text-neutral-400 uppercase tracking-wide">{s.status}</span>
                                </div>
                            </div>
                            <p className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider mb-1">{s.name}</p>
                            <div className="flex items-baseline gap-1">
                                <span className="text-3xl font-bold text-neutral-900 dark:text-white tracking-tight">{s.latency}</span>
                                <span className="text-sm font-medium text-neutral-400">ms</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Main Dashboard Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-96">

                    {/* THE GRAPH */}
                    <div className="lg:col-span-2 bg-white dark:bg-neutral-900/50 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6 flex flex-col relative overflow-hidden shadow-sm">
                        <div className="flex justify-between items-center mb-6 z-10">
                            <div className="flex items-center gap-2">
                                <Activity className="w-4 h-4 text-neutral-400" />
                                <h3 className="text-sm font-bold text-neutral-900 dark:text-white">Cluster Load</h3>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-2xl font-bold text-neutral-900 dark:text-white tabular-nums">{currentLoad}%</span>
                                <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-md text-[10px] font-bold border border-emerald-100 dark:border-transparent uppercase tracking-wider">
                                    <ArrowUpRight className="w-3 h-3" />
                                    Normal
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 w-full relative">
                            <svg className="w-full h-full absolute inset-0" preserveAspectRatio="none" viewBox="0 0 100 100">
                                <defs>
                                    {/* Subtle Gradient - fixes the "Mud Pie" look */}
                                    <linearGradient id="gLight" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.2" />
                                        <stop offset="100%" stopColor="#4F46E5" stopOpacity="0" />
                                    </linearGradient>
                                    <linearGradient id="gDark" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#6366f1" stopOpacity="0.3" />
                                        <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
                                    </linearGradient>
                                </defs>

                                {/* Smooth Area Fill */}
                                <path
                                    d={areaPath(dataPoints)}
                                    className="fill-[url(#gLight)] dark:fill-[url(#gDark)] transition-colors duration-300"
                                />

                                {/* Smooth Stroke */}
                                <path
                                    d={getSmoothPath(dataPoints, 100, 100)}
                                    fill="none"
                                    vectorEffect="non-scaling-stroke"
                                    strokeWidth="2"
                                    className="stroke-indigo-600 dark:stroke-indigo-400 transition-colors duration-300"
                                />
                            </svg>
                        </div>

                        <div className="flex justify-between mt-2 text-[10px] font-medium text-neutral-400 uppercase tracking-widest">
                            <span>-60s</span>
                            <span>Now</span>
                        </div>
                    </div>

                    {/* Logs */}
                    <div className="bg-white dark:bg-neutral-900/50 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6 flex flex-col shadow-sm">
                        <div className="flex items-center gap-2 mb-6 border-b border-neutral-100 dark:border-neutral-800 pb-4">
                            <Command className="w-4 h-4 text-neutral-400" />
                            <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Live Stream</h3>
                        </div>

                        <div className="flex-1 overflow-hidden relative">
                            <div className="absolute inset-0 overflow-y-auto space-y-3 pr-2 scrollbar-hide">
                                <AnimatePresence initial={false}>
                                    {logs.map((log) => (
                                        <motion.div
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            key={log.id}
                                            className="group flex gap-3 items-center text-xs p-2 rounded-lg hover:bg-neutral-50 dark:hover:bg-white/5 transition-colors"
                                        >
                                            <span className="font-mono text-neutral-400 text-[10px]">{log.time}</span>
                                            <span className="flex-1 font-medium text-neutral-700 dark:text-neutral-300 truncate">{log.msg}</span>
                                            {log.type === 'success' ?
                                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> :
                                                <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                                            }
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                                <div ref={logsEndRef} />
                            </div>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}