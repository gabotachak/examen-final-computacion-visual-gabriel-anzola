# CLAUDE.md

Guía de trabajo para este repositorio. **Actualizar constantemente** conforme se aprende. No avanzar trabajo pesado sin que este archivo refleje el estado real.

## Qué es este proyecto

Examen Final de Computación Visual 2026-I (Universidad Nacional de Colombia), parte práctica. Entrega individual en repositorio. Estudiante: **Gabriel Anzola** (`ga.anzola15@gmail.com`).

Fuente de verdad de los requisitos: `examen_final_computacion_visual_2026I_practico.pdf` (en la raíz). Si hay duda, leer el PDF.

El plan de ejecución detallado y el estado vivo de avance están en `todo.md`. Marcar checkboxes ahí conforme se completa cada paso.

## Los dos ejercicios

### Ejercicio 1 — Procesamiento visual e IA (`ejercicio_1_procesamiento_visual/`)
App Python con OpenCV que procesa **una imagen** (mínimo que cumple el PDF; el PDF permite imagen o video corto, se elige imagen por simplicidad/reproducibilidad). Pipeline secuencial obligatorio:
1. Cargar entrada (OpenCV).
2. Escala de grises.
3. Segundo espacio de color (HSV o LAB).
4. Suavizado (Gaussiano o Mediana).
5. Detección de bordes (Sobel o Canny).
6. Segmentación o detección → **se hace ambos**: técnica clásica (threshold + morfología + contornos) **y** modelo preentrenado.
7. Guardar resultados intermedios y finales.
8. Documentar parámetros y decisiones.

Entregables exactos exigidos en `resultados/`: `original.png`, `grises.png`, `hsv_o_lab.png`, `suavizado.png`, `bordes.png`, `deteccion_o_segmentacion.png`. Más `src/main.py` y `README.md`.

### Ejercicio 2 — Escena 3D interactiva (`ejercicio_2_escena_3d_interactiva/`)
Stack elegido: **React Three Fiber** (R3F + Vite + @react-three/drei). Tema elegido: **Exploración espacial** (base lunar / estación / rover / astronautas / paneles solares).

Requisitos obligatorios de la escena:
- Escena 3D completa del tema.
- Al menos una jerarquía de objetos 3D.
- Transformaciones: traslación, rotación, escala.
- Cámara interactiva.
- Materiales PBR o shader personalizado.
- Iluminación coherente con el tema.
- Animaciones en personajes/elementos principales.
- Esos elementos interactúan entre sí dentro de la escena.
- Al menos una interacción del usuario (teclado, mouse, botones, sliders, voz, gesto o WebSocket).

Evidencia principal: un **GIF o video corto** mostrando escena, cámara/navegación, animaciones, interacción del usuario e interacción entre elementos. Más `media/captura_1.png`, `media/captura_2.png`, `media/demo.gif` o `demo.mp4`, `src/` y `README.md`.

## Decisiones técnicas tomadas (con razón)

| Tema | Decisión | Razón |
|---|---|---|
| Stack Ej2 | React Three Fiber + Vite | Web, reproducible, sin instalar Unity, repo liviano, fácil grabar demo del navegador. |
| Tema Ej2 | Exploración espacial | Buena jerarquía (rover con ruedas, panel articulado), fácil animar e interactuar. |
| Entrada Ej1 | Imagen estática | Mínimo que cumple el PDF; produce los PNG exigidos directamente. |
| Detección Ej1 | Clásico + modelo preentrenado | Cubre ambas opciones del PDF; más completo. |
| Gestor Python | **uv** | Preferencia del usuario. |

## Convenciones / reglas del examen a respetar

- Repo debe llamarse `examen-final-computacion-visual-gabriel-anzola` (ya es el nombre de la carpeta).
- README principal en la raíz con: descripción general, dependencias, instalación, ejecución, estructura del repo, evidencias, análisis técnico, uso de IA.
- Cada ejercicio con su propio `README.md`.
- **No** entregar solo capturas: debe haber código fuente reproducible.
- Evitar archivos pesados en el repo; si hace falta, usar enlaces externos documentados. (Pesa: modelos, `node_modules`, datasets, videos largos → `.gitignore` / enlaces.)
- Documentación por ejercicio debe responder: propósito, herramientas/librerías/motores, cómo se ejecuta, resultados obtenidos, dificultades y cómo se resolvieron, prompts de IA usados, qué se verificó manualmente.

## Entorno (verificado 2026-06-10)

- `uv` 0.11.14 ✅
- `python3` 3.14.5 — ⚠️ **muy nuevo**; `opencv-python`/`ultralytics` pueden no tener wheels. Plan: `uv` fija Python **3.12** para Ej1 (`uv python pin 3.12`). Confirmar al instalar deps.
- `node` v26.1.0 ✅ — también muy nuevo; verificar que Vite/plugins arrancan.
- `npm` 11.13.0 ✅
- `git` 2.54.0 ✅ — repo **aún no inicializado** (`git init` pendiente, Fase 0).
- `gh` 2.93.0 ✅ — autenticado como **gabotachak** (protocolo ssh). Usar `gh` para crear/empujar el repo remoto.
- Shell: fish. OS: Linux (CachyOS). Cuidado: `cd` en comando compuesto puede pedir permiso; usar rutas absolutas.

## Git / GitHub (reglas del usuario)

- Inicializar el repo (`git init`) en Fase 0. Rama por defecto `main`.
- **Commits SIN co-autor.** NO añadir `Co-Authored-By: Claude ...` ni ninguna otra línea de co-autoría en los mensajes de commit. Autor = el usuario (gabotachak).
- Usar **`gh`** para todas las operaciones de GitHub (crear repo remoto, push, etc.) a nombre del usuario. Ya autenticado como `gabotachak` por ssh.
- Repo remoto: público (o compartido con el docente), nombre `examen-final-computacion-visual-gabriel-anzola`.
- Hacer commits incrementales por fase/hito (no un único commit gigante), para trazabilidad. Mensajes claros y descriptivos.
- `.gitignore` debe excluir `node_modules/`, `.venv/`, caches de Python, pesos de modelos descargados y media pesada no esencial.

## Estructura objetivo del repo

```
examen-final-computacion-visual-gabriel-anzola/
├── README.md                         # principal
├── .gitignore
├── examen_final_computacion_visual_2026I_practico.pdf
├── CLAUDE.md
├── todo.md
├── ejercicio_1_procesamiento_visual/
│   ├── src/main.py
│   ├── data/                         # opcional, imagen de entrada
│   ├── resultados/                   # PNGs exigidos
│   ├── pyproject.toml                # uv
│   └── README.md
└── ejercicio_2_escena_3d_interactiva/
    ├── src/                          # código R3F
    ├── media/                        # capturas + demo
    ├── package.json
    └── README.md
```

## Estado actual

- Fase: **0 (no iniciada)** — solo existen el PDF, `CLAUDE.md` y `todo.md`.
- Nada de código aún (el usuario pidió primero solo el plan).

## Aprendizajes / notas (append-only conforme avanza)

- _(vacío — añadir hallazgos: versiones que fallan, parámetros que funcionan, comandos de grabación de GIF, etc.)_
