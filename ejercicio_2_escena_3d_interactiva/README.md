# Ejercicio 2 — Escena 3D Interactiva: Exploración Espacial

## Propósito y tema

Escena 3D interactiva de **exploración espacial** (base lunar, rover, astronautas, paneles solares) construida con React Three Fiber. Demuestra todos los requisitos obligatorios del examen: jerarquía de objetos, transformaciones, cámara interactiva, materiales PBR, iluminación coherente, animaciones con `useFrame`, interacción entre elementos e interacción del usuario.

## Herramientas y versiones

| Herramienta | Versión |
|-------------|---------|
| Node.js | 26.1.0 |
| Vite | 6.4.3 |
| React | 18.3.1 |
| Three.js | 0.170.0 |
| @react-three/fiber | 8.17.10 |
| @react-three/drei | 9.122.0 |
| leva | 0.9.35 |

## Cómo ejecutar

```bash
cd ejercicio_2_escena_3d_interactiva
npm install
npm run dev
```

Abrir en el navegador: `http://localhost:5173/`

Para producción:
```bash
npm run build
npm run preview
```

## Controles de interacción del usuario

| Control | Acción |
|---------|--------|
| Arrastrar (clic izquierdo) | Orbitar la cámara alrededor de la escena |
| Scroll | Zoom in/out |
| Clic derecho + arrastrar | Paneo de la cámara |
| Slider **Velocidad rover** (Leva) | Controla la velocidad de desplazamiento del rover |
| Slider **Intensidad sol** (Leva) | Cambia la intensidad de la luz direccional |
| Slider **Luz ambiente** (Leva) | Ajusta la luz ambiental |
| Color picker **Color bandera** (Leva) | Cambia el color de la bandera de la base |

## Resultados

### Capturas

| Captura | Vista |
|---------|-------|
| ![Captura 1](media/captura_1.png) | Vista principal de la escena |
| ![Captura 2](media/captura_2.png) | Vista durante animación |

### Demo animada

![Demo](media/demo.gif)

## Mapeo requisito → implementación

| Requisito PDF | Implementación |
|---------------|----------------|
| Escena 3D completa del tema | Base lunar con domo, suelo, cráteres, rocas, estrellas, rover, astronautas, paneles |
| Jerarquía de objetos | `Rover`: grupo padre → ruedas (4) + cuerpo + cabina + antena; `SolarPanel`: grupo padre → soporte + panel |
| Traslación | Rover se desplaza en órbita circular (`position.set(x, y, z)` en `useFrame`); paneles en posiciones fijas; astronautas en posiciones elevadas |
| Rotación | Antena del rover rota en Y continuo; paneles solares rotan para orientarse al rover; astronauta oscila en Y |
| Escala | Rocas con escalas distintas (`dodecahedronGeometry args`); panel solar con escala diferencial soporte/panel |
| Cámara interactiva | `OrbitControls` de drei: orbit, zoom, pan; límites `minDistance=3`, `maxDistance=40`, `maxPolarAngle` |
| Materiales PBR | `meshStandardMaterial` con `metalness`/`roughness` en todos los objetos; `meshPhysicalMaterial` con `transmission` en cabina y domo |
| Iluminación coherente | `directionalLight` (sol lunar, cálido `#fff8e0`), `ambientLight` (fría `#334455`), `pointLight` de la base; sombras activadas |
| Animaciones | `useFrame`: rover en órbita, antena rotatoria, astronautas flotando, paneles orientándose al rover |
| Interacción entre elementos | Panels solares siguen la posición del rover; astronauta saluda (brazo oscila) cuando rover está cerca; bandera parpadea amarilla cuando rover pasa cerca |
| Interacción del usuario | OrbitControls (mouse), 4 sliders/picker Leva en panel derecho |

## Dificultades y soluciones

- **`npm create vite` cancelado**: el directorio ya tenía `src/` y `media/`; Vite rechazó sobrescribir. Solución: scaffold manual de `package.json`, `vite.config.js`, `index.html`, `src/main.jsx`.
- **WebGL en headless para capturas**: chromium headless necesita `--enable-unsafe-swiftshader`; sin este flag, Three.js no renderiza en headless. Solución: flag agregado al comando.
- **Animación en capturas estáticas**: headless crea nuevas instancias sin estado; para el GIF se usó CDP (Chrome DevTools Protocol) para mantener una sesión viva y capturar múltiples frames a 500ms de intervalo.

## Prompts de IA usados

- "Implementa una escena 3D de exploración espacial con React Three Fiber que cumpla: jerarquía de objetos (rover con ruedas/cabina/antena), transformaciones visibles, OrbitControls, materiales PBR (meshStandardMaterial + meshPhysicalMaterial transmission), iluminación con directionalLight + ambientLight + pointLight + sombras, animaciones useFrame (rover orbital, antena rotatoria, astronautas flotando, paneles orientándose al rover), interacción rover-bandera-astronauta (bandera se pone amarilla, astronauta saluda), controles Leva para velocidad/luz/color."

## Verificación manual

- Confirmado que `npm run build` compila sin errores.
- Confirmado que `npm run dev` sirve la app en localhost:5173 con WebGL activo.
- Verificados visualmente todos los requisitos del PDF mediante las capturas.
- Confirmado que los controles Leva modifican la escena en tiempo real.
- Confirmado que la interacción rover→bandera→astronauta funciona correctamente.
