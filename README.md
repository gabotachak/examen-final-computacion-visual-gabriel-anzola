# Examen Final — Computación Visual 2026-I

**Estudiante:** Gabriel Anzola (`ga.anzola15@gmail.com`)  
**Universidad Nacional de Colombia**

## Descripción general

Repositorio de entrega del examen final práctico de Computación Visual 2026-I. Contiene dos ejercicios independientes:

1. **Ejercicio 1 — Procesamiento visual e IA**: pipeline OpenCV que procesa una imagen estática con escala de grises, conversión de espacio de color (HSV), suavizado gaussiano, detección de bordes (Canny), segmentación clásica y detección con modelo preentrenado (YOLOv8).
2. **Ejercicio 2 — Escena 3D interactiva**: escena de exploración espacial construida con React Three Fiber (R3F + Vite), con jerarquía de objetos, animaciones, materiales PBR, iluminación coherente e interacción del usuario.

## Dependencias

| Ejercicio | Requisitos |
|-----------|------------|
| Ej1 | Python 3.12, uv |
| Ej2 | Node.js ≥18, npm |

## Instalación y ejecución

### Ejercicio 1

```bash
cd ejercicio_1_procesamiento_visual
uv sync
uv run python src/main.py
```

### Ejercicio 2

```bash
cd ejercicio_2_escena_3d_interactiva
npm install
npm run dev
```

## Estructura del repositorio

```
.
├── README.md
├── .gitignore
├── CLAUDE.md
├── todo.md
├── examen_final_computacion_visual_2026I_practico.pdf
├── ejercicio_1_procesamiento_visual/
│   ├── src/main.py
│   ├── data/           # imagen de entrada
│   ├── resultados/     # PNGs generados por el pipeline
│   ├── pyproject.toml
│   └── README.md
└── ejercicio_2_escena_3d_interactiva/
    ├── src/            # código React Three Fiber
    ├── media/          # capturas y demo
    ├── package.json
    └── README.md
```

## Evidencias

Ver `ejercicio_1_procesamiento_visual/resultados/` y `ejercicio_2_escena_3d_interactiva/media/`.

## Análisis técnico

Ver README de cada ejercicio.

## Uso de IA

Asistente IA (Claude) usado para: generación de código base del pipeline OpenCV, configuración del proyecto R3F, y estructuración de la documentación. Todo el código fue revisado y verificado manualmente por el estudiante.
