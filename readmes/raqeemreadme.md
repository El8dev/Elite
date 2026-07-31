# Physics Virtual Lab - Technical Documentation

Welcome to the Physics Virtual Lab! This document provides technical instructions for developers and AI assistants working on this project. 

## Architecture Overview

The project is built on a custom, modular **Elite Component System** and **Elite Engine**, utilizing modern web technologies for physics simulations and interactive circuit building.

- **Core Technologies:**
  - **HTML/CSS/Vanilla JS** for structure and logic.
  - **Tailwind CSS** for rapid UI styling.
  - **GSAP (GreenSock) & Draggable** for smooth animations, physics simulations, and drag-and-drop interactions.
  - **jsPlumb** for visual wiring and circuit connections.

## 1. The Modular System & Library of Items (`elite-components.js`)

All interactive elements in the lab (batteries, resistors, capacitors, galvanometers, etc.) are generated through the `EliteComponents` class located in `src/engine/elite-components.js`.

### How It Works
- The class uses static methods (e.g., `EliteComponents.getBattery()`, `EliteComponents.getResistor()`) to return complex SVG/HTML structures.
- Components are instantiated with a wrapper containing `terminal-node` elements (poles/connection points).
- Terminals are precisely positioned using relative coordinates inside the wrapper.

### Adding a New Component
1. Add a new static method in `EliteComponents`.
2. Define the SVG/HTML template.
3. Define the terminals array with `id`, `x`, and `y` coordinates.
4. Return the component using `this.createWrapper(id, type, x, y, w, h, targetZone, innerHTML, terminals)`.

## 2. The Wiring Method & Engine (`elite-engine.js`)

The `EliteEngine` (`src/engine/elite-engine.js`) manages the drag-and-drop workspace and circuit wiring using **jsPlumb**.

### Core Responsibilities:
- **Drag & Drop (`initDragAndDrop`):** Handles snapping components to designated drop zones (`dropzone`). Uses GSAP `Draggable`.
- **Terminals (`setupTerminals`):** Registers `.terminal-node` elements as jsPlumb endpoints (sources and targets).
- **Wiring Validation:** Listens for `connection` events and validates them against an array of `expectedPairs`. If a user connects the wrong terminals, the connection is instantly rejected/deleted.
- **Circuit State:** Tracks the total number of correct connections (`userConnections`) and fires `onCircuitComplete` when the required number of connections is met.

### Implementing an Experiment
1. **Define Configuration (`config` object):**
   - List the components needed and their grid positions.
   - Example: `{ id: 'battery', w: 70, h: 60, getHTML: (id, dz) => EliteComponents.getBattery(...) }`
2. **Initialize EliteEngine:**
   - Pass the `expectedPairs` array containing valid connection strings (e.g., `'battery-pos-resistor-right'`).
   - Define the `onCircuitComplete` callback to trigger the physics simulation once the circuit is correctly wired.

## 3. Performance & Rendering Best Practices (SOTA Guidelines)

To maintain ~60 FPS animation smoothness and avoid browser main-thread blocking or mobile battery drain, all simulations must abide by these strict SOTA performance patterns:
- **Never use `jsPlumbInstance.repaintEverything()` during Drag or Animation Loops:** A global repaint recalculates every DOM wire and geometry endpoint synchronously. Instead, always target the moving node via element revalidation: `instance.revalidate(targetElement)`.
- **Throttle Revalidation with `requestAnimationFrame`:** Wrap repeated calls to `revalidate` inside a `requestAnimationFrame()` check to align redraws with native browser composition cycles.
- **Eliminate Layout Thrashing in `onDrag`:** Never call synchronous layout getters (e.g., `getBoundingClientRect()`, `offsetWidth`) or unrestricted DOM queries (`document.querySelectorAll`) inside high-frequency event handlers (`onDrag`, `mousemove`). Cache container bounding boxes and dropzone references within `onPress`/`onDragStart`.

## 4. Standalone Offline Compilation (APK & Portable EXE)

The Raqeem Physics Virtual Lab is architected as an offline-first simulation platform. It requires zero Wi-Fi or remote CDNs to function when packaged.

### Building Standalone Binaries
To sanitize assets and build portable standalone executables across mobile and desktop platforms, execute the automated Windows build orchestration script from PowerShell:
```powershell
powershell -ExecutionPolicy Bypass -File .\build_standalone.ps1
```
* **Step 1 (Obsolete Build Cleanup & Atom Icon Installation):** Automatically clears old builds (`desktop_app\dist`, APK outputs) and deploys our custom vector Atom Icon across both Electron (`desktop_app\icon.png`) and native Android resource densities (`mipmap-hdpi` through `xxxhdpi`).
* **Step 2 (Offline Asset Conversion):** Executes `node convert_offline.js`, stripping all external HTTP/HTTPS CDN references (Tailwind, GSAP, jsPlumb, FontAwesome, Google Fonts) and relinking them to bundled local resources in `libs/` and `fonts/`.
* **Step 3 (Android Standalone APK):** Syncs optimized `www/` to Capacitor and invokes a clean Gradle build (`clean assembleDebug`), generating an offline sideloadable APK featuring the Atom app logo at:
  `mobile_app\faraday_apk\android\app\build\outputs\apk\debug\app-debug.apk`
* **Step 4 (Windows Portable EXE):** Copies localized web assets into `desktop_app/` and compiles a single-file zero-install executable with embedded `.ico` headers via `electron-builder`, generating a standalone Windows binary at:
  `desktop_app\dist\RaqeemLabs-Portable-Offline.exe`

---
*Note to AI Assistants: Always reference `agent_dev_log.md` for architectural context and historical decisions. Use existing optimized experiments (`induction_coils.html`, `induction_switch.html`) as the source of truth for high-performance interaction patterns.*



