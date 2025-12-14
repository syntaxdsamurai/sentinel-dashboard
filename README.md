# DhruvOps | High-Fidelity Infrastructure Monitor

**A production-grade DevOps dashboard simulating real-time server cluster health, latency, and load metrics.**

> **Live Demo:** [Insert your Vercel Link Here]

![Project Preview](https://dhruv-sentinel.vercel.app/)

## Overview
**DhruvOps** is a high-performance frontend engineering showcase. Unlike typical static dashboards, this project implements **physics-based data simulation** to mimic the unpredictable nature of real-world infrastructure.

It features a "Liquid Glass" UI system that adapts perfectly to system themes, utilizing advanced CSS blurring and color blending for a premium, native-app feel.

## Key Engineering Features

* **📈 Physics-Based Graphing Engine:**
    * Replaced standard charting libraries with a custom **SVG rendering engine**.
    * Uses **Quadratic Bezier Interpolation** to smooth data points into a liquid curve.
    * Runs on a **Random Walk Algorithm** to simulate realistic CPU load fluctuations (volatility, trend, and mean reversion) rather than simple random numbers.

* **🎨 Adaptive "Liquid Glass" UI:**
    * Engineered a dual-state design system:
        * **Light Mode:** "Crystal Lab" aesthetic with high-transparency whites and sharp borders.
        * **Dark Mode:** "Deep Obsidian" aesthetic with subtle glows and rich gradients.
    * Optimized `backdrop-filter` performance to maintain 60FPS even with heavy blurring.

* **🔄 Real-Time Event Stream:**
    * Simulates a live DevOps log feed (handshakes, shard rebalancing, cache invalidation).
    * Uses **Framer Motion** `AnimatePresence` for smooth layout shifts as new logs arrive.

## 🛠️ Tech Stack

* **Core:** Next.js 14 (App Router), TypeScript
* **Styling:** Tailwind CSS, Custom CSS Variables
* **Animation:** Framer Motion, Native CSS Transitions
* **Icons:** Lucide React

## How to Run Locally

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/syntaxdsamurai/dhruv-sentinel.git](https://github.com/syntaxdsamurai/dhruv-sentinel.git)
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Start the development server:**
    ```bash
    npm run dev
    ```

---
*Engineered by Dhruv.*