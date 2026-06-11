# Ejercicio 1 — Procesamiento Visual e IA

## Propósito

Pipeline secuencial de visión por computador que procesa una imagen estática aplicando operaciones clásicas de OpenCV y detección con modelo preentrenado YOLOv8. Demuestra los 8 pasos obligatorios del PDF: carga, grises, espacio de color alternativo, suavizado, detección de bordes, segmentación clásica, detección con IA y documentación de parámetros.

## Herramientas y versiones

| Herramienta | Versión |
|-------------|---------|
| Python | 3.12.13 |
| OpenCV (`opencv-python`) | 4.13.0 |
| NumPy | 2.4.6 |
| Ultralytics (YOLOv8) | 8.4.64 |
| uv | 0.11.14 |

## Cómo ejecutar

```bash
cd ejercicio_1_procesamiento_visual
uv sync
uv run python src/main.py
```

Opciones:
```bash
uv run python src/main.py --input data/otra_imagen.jpg --output resultados/
```

La primera ejecución descarga automáticamente `yolov8n.pt` (~6 MB). El peso del modelo **no se versiona** (excluido en `.gitignore`).

## Resultados obtenidos

Los 6 archivos exigidos por el PDF se generan en `resultados/`:

| Archivo | Descripción |
|---------|-------------|
| `original.png` | Imagen de entrada sin procesar |
| `grises.png` | Conversión a escala de grises |
| `hsv_o_lab.png` | Espacio de color HSV |
| `suavizado.png` | Suavizado gaussiano |
| `bordes.png` | Bordes detectados con Canny |
| `deteccion_o_segmentacion.png` | Panel clásico (izq) + YOLOv8 (der) |
| `comparativo.png` | Mosaico de todos los pasos (extra) |

### Parámetros y decisiones técnicas

| Parámetro | Valor | Justificación |
|-----------|-------|---------------|
| Suavizado | Gaussiano `(5,5)` σ=0 | Reduce ruido sin distorsionar bordes significativamente |
| Canny low | 50 | Captura bordes débiles relevantes |
| Canny high | 150 | Ratio 1:3 estándar para imágenes con contraste medio |
| Threshold | Otsu | Automático, adapta el umbral a la distribución de grises |
| Morfología | `OPEN` luego `CLOSE`, kernel `5x5` | Elimina ruido y rellena huecos en contornos |
| Modelo YOLO | `yolov8n` (nano) | Más ligero, suficiente para la tarea de demostración |
| Confianza YOLO | 0.25 | Detecta objetos con confianza moderada-alta |

### Ejemplo de detecciones (imagen `bus.jpg` de ultralytics)

YOLO detectó: `bus`, `person` (×4), `stop sign` — 6 detecciones totales.

## Dificultades y soluciones

- **Python 3.14 sin wheels**: uv 0.11 crea entornos con Python 3.14 por defecto; OpenCV/ultralytics no tienen wheels para 3.14. Solución: `uv python pin 3.12` + ajustar `requires-python = ">=3.12"` en `pyproject.toml`.
- **Modelo YOLO descargado en tiempo de ejecución**: los pesos `.pt` se descargan automáticamente al primer uso de `YOLO(model)`. Excluidos del repo vía `.gitignore`.

## Prompts de IA usados

- "Implementa un pipeline secuencial de OpenCV con los 8 pasos del PDF: carga, grises, HSV, suavizado gaussiano, Canny, segmentación Otsu+morfología+contornos, detección YOLOv8, panel comparativo. En Python, con argparse para rutas. Documenta parámetros en consola."

## Verificación manual

- Ejecutado el pipeline completo y confirmados los 6 PNGs requeridos generados correctamente.
- Inspeccionados visualmente: grises coherente, HSV con canales de color visibles, suavizado apreciable, bordes nítidos, detección YOLO con cajas y etiquetas sobre personas y vehículo.
- Verificado que `uv sync` + `uv run python src/main.py` reproduce el resultado desde cero.
