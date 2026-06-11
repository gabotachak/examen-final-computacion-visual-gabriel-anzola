# Examen Final — Computación Visual 2026-I

**Estudiante:** Gabriel Anzola (`ga.anzola15@gmail.com`)  
**Universidad Nacional de Colombia**

## Descripción general

Repositorio de entrega del examen final práctico de Computación Visual 2026-I. Contiene dos ejercicios independientes:

1. **Ejercicio 1 — Procesamiento visual e IA**: pipeline OpenCV que procesa una imagen estática con escala de grises, conversión de espacio de color (HSV), suavizado gaussiano, detección de bordes (Canny), segmentación clásica (Otsu + morfología + contornos) y detección con modelo preentrenado (YOLOv8n).
2. **Ejercicio 2 — Escena 3D interactiva**: escena de exploración espacial construida con React Three Fiber (R3F + Vite), con jerarquía de objetos, animaciones `useFrame`, materiales PBR, iluminación coherente con sombras e interacción del usuario mediante OrbitControls y controles Leva.

## Dependencias

| Ejercicio | Requisitos |
|-----------|------------|
| Ej1 | Python 3.12, [uv](https://docs.astral.sh/uv/) |
| Ej2 | Node.js ≥18, npm |

## Instalación y ejecución

### Ejercicio 1

```bash
cd ejercicio_1_procesamiento_visual
uv sync          # crea .venv con Python 3.12 y todas las deps
uv run python src/main.py
# Salida en resultados/ (6 PNGs exigidos + comparativo)
```

> La primera ejecución descarga `yolov8n.pt` (~6 MB) automáticamente.

### Ejercicio 2

```bash
cd ejercicio_2_escena_3d_interactiva
npm install
npm run dev      # abre http://localhost:5173/
```

## Estructura del repositorio

```
examen-final-computacion-visual-gabriel-anzola/
├── README.md
├── .gitignore
├── CLAUDE.md
├── todo.md
├── examen_final_computacion_visual_2026I_practico.pdf
├── ejercicio_1_procesamiento_visual/
│   ├── src/main.py               # pipeline completo
│   ├── data/entrada.jpg          # imagen de entrada (bus.jpg de ultralytics)
│   ├── resultados/               # 6 PNGs exigidos + comparativo
│   │   ├── original.png
│   │   ├── grises.png
│   │   ├── hsv_o_lab.png
│   │   ├── suavizado.png
│   │   ├── bordes.png
│   │   ├── deteccion_o_segmentacion.png
│   │   └── comparativo.png
│   ├── pyproject.toml
│   ├── uv.lock
│   └── README.md
└── ejercicio_2_escena_3d_interactiva/
    ├── src/
    │   ├── App.jsx               # escena 3D completa
    │   └── main.jsx
    ├── media/
    │   ├── captura_1.png
    │   ├── captura_2.png
    │   └── demo.gif              # animación de la escena
    ├── index.html
    ├── vite.config.js
    ├── package.json
    └── README.md
```

## Evidencias

### Ejercicio 1 — Resultados del pipeline

| Paso | Resultado |
|------|-----------|
| Original | `resultados/original.png` |
| Grises | `resultados/grises.png` |
| HSV | `resultados/hsv_o_lab.png` |
| Suavizado (Gaussiano 5×5) | `resultados/suavizado.png` |
| Bordes Canny (50/150) | `resultados/bordes.png` |
| Detección clásica + YOLOv8 | `resultados/deteccion_o_segmentacion.png` |

### Ejercicio 2 — Escena 3D

![Demo animada](ejercicio_2_escena_3d_interactiva/media/demo.gif)

| Captura 1 | Captura 2 |
|-----------|-----------|
| ![Cap1](ejercicio_2_escena_3d_interactiva/media/captura_1.png) | ![Cap2](ejercicio_2_escena_3d_interactiva/media/captura_2.png) |

## Análisis técnico

### Ejercicio 1

- **Espacio de color alternativo**: HSV elegido sobre LAB por su separación intuitiva de matiz/saturación, útil para segmentar objetos de colores específicos.
- **Suavizado**: Gaussiano `(5,5)` — reduce ruido de alta frecuencia sin distorsionar bordes tanto como la mediana.
- **Detección de bordes**: Canny con ratio 1:3 (50/150), estándar para imágenes con contraste medio.
- **Segmentación clásica**: Otsu + morfología OPEN→CLOSE — umbral adaptativo, elimina ruido y rellena huecos en contornos.
- **Modelo preentrenado**: YOLOv8n (nano) a conf=0.25 detecta: bus, 4 personas, señal de stop.

### Ejercicio 2

- **Jerarquía**: `Rover` (padre) → ruedas (×4) + cuerpo + cabina + antena; `SolarPanel` (padre) → soporte + panel.
- **PBR**: `meshStandardMaterial` con metalness/roughness; `meshPhysicalMaterial` con transmission para cabina y domo (vidrio).
- **Animaciones**: rover en órbita circular (`useFrame`), antena rotatoria, astronautas flotando, paneles orientándose al rover.
- **Interacción entre elementos**: bandera parpadea amarilla cuando rover pasa cerca; astronauta saluda al rover cuando está a <5 unidades.
- **Stack**: Vite + React 18 + Three.js 0.170 + R3F 8 + drei + leva.

## Uso de IA

Asistente Claude (Sonnet 4.6) usado en este proyecto para:
1. **Ej1**: generación del pipeline OpenCV completo con los 8 pasos, manejo de parámetros, fallback de modelo y panel comparativo.
2. **Ej2**: scaffold manual del proyecto Vite+R3F (ya que `npm create vite` falló), implementación de la escena completa con todos los requisitos, script CDP para captura del GIF animado.
3. **Documentación**: estructura de READMEs y mapeo requisito→implementación.

Todo el código fue revisado y ejecutado manualmente por el estudiante para verificar su corrección y cumplimiento del PDF.
