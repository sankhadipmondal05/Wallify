# Wallify Portfolio

## High-Fidelity Cinematic Project Gallery
**By Sankhadip**

[![GitHub repository](https://img.shields.io/badge/Gallery-60FPS-blueviolet?style=for-the-badge&logo=github)](https://github.com/sankhadipmondal05/Wallify)

Wallify is a premium, high-performance portfolio experience meticulously engineered for a 60FPS cinematic reveal. It features a unique "Singularity Burst" navigation system, an immersive 8-slice projection gallery, and an editorial metadata overlay architecture designed for maximum visual impact.

---

### 🚀 Key Evolutionary Features

#### 💠 60FPS Optimized Rendering engine
- **Hardware Acceleration**: Every animating layer is locked to the GPU's compositor thread using `translateZ(0)` and `backface-visibility: hidden` to eliminate layout thrashing.
- **Containment Scoping**: Leveraging modern CSS `contain: layout paint` to isolate project strips, ensuring that hover expansions never trigger global DOM recalculations.
- **Lean Canvas Projection**: The immersive mode uses a high-performance single-master-video/multi-canvas rendering loop, pre-calculating source-geometry to maintain frame stability during complex project switching.

#### 🌌 Singularity Burst Navigation
- **Symmetrical Center-Out Arrival**: Unlike standard grid reveals, Wallify's projects "burst" from a common origin point in a weightless, air-tight sequence.
- **Physics-Based Staggering**: Precise timing and delay offsets create a sense of mechanical depth as the collection reveals its editorial structure.
- **Jitter-Free View Orchestration**: A specialized overlapping render switcher prevents the "visual pop" commonly associated with mounting/unmounting large media views.

#### 🎥 Immersive 8-Slice Gallery
- **Split-Video Projection**: A unified video feed is projected across 8 staggered canvases, creating a unique cinematic texture reminiscent of high-end editorial magazines.
- **Floating Metadata Overlays**: Vertical project metadata and play controls float as independent, high-z-index layers, unaffected by the clipping or background-masking of the video slices.
- **Cinematic Video Modal**: Integrated full-screen player with Gaussian blur backdrops and smart playback lifecycle syncing (auto-pausing background elements during focus).

---

### 🛠️ Technology Stack

- **Core**: React 18+ & Vite
- **Styling**: Vanilla CSS (Hardware-Optimized Architecture)
- **Physics**: CSS Keyframe Engine & Specialized Cubic Bezier Curves
- **Media**: HTML5 Video + Canvas 2D API (Desynchronized Mode)

---

### 📦 Setup & Installation

1. **Clone the experience**:
   ```bash
   git clone https://github.com/sankhadipmondal05/Wallify.git
   cd Wallify
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Launch the gallery**:
   ```bash
   npm run dev
   ```

---

### 🎨 Design Philosophy

Wallify is built on the principle of **Editorial Motion**. Every interaction is designed to feel tactile, intentional, and expensive. From the rotation of the "X" button to the vertical stacking of the project titles, the interface prioritizes typographic hierarchy and rhythmic movement over generic utility.

---

**© 2024 Wallify Portfolio. Crafted with High-Fidelity Intent by Sankhadip.**
