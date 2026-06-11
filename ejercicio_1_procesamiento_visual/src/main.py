"""
Pipeline de procesamiento visual + IA.
Ejecutar: uv run python src/main.py [--input PATH] [--output DIR]
"""

import argparse
import os
import sys
import cv2
import numpy as np

# Parámetros del pipeline (documentados para trazabilidad)
GAUSS_KERNEL = (5, 5)
GAUSS_SIGMA = 0
CANNY_LOW = 50
CANNY_HIGH = 150
MORPH_KERNEL = np.ones((5, 5), np.uint8)
YOLO_MODEL = "yolov8n.pt"
YOLO_CONF = 0.25


def load_image(path: str) -> np.ndarray:
    img = cv2.imread(path)
    if img is None:
        sys.exit(f"ERROR: no se pudo cargar '{path}'")
    print(f"[1] Imagen cargada: {path} — {img.shape[1]}x{img.shape[0]} px, {img.shape[2]} canales")
    return img


def to_grayscale(img: np.ndarray) -> np.ndarray:
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    print(f"[2] Escala de grises: shape={gray.shape}")
    return gray


def to_hsv(img: np.ndarray) -> np.ndarray:
    hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
    print(f"[3] HSV: shape={hsv.shape}")
    return hsv


def smooth(gray: np.ndarray) -> np.ndarray:
    blurred = cv2.GaussianBlur(gray, GAUSS_KERNEL, GAUSS_SIGMA)
    print(f"[4] Suavizado Gaussiano: kernel={GAUSS_KERNEL}, sigma={GAUSS_SIGMA}")
    return blurred


def detect_edges(blurred: np.ndarray) -> np.ndarray:
    edges = cv2.Canny(blurred, CANNY_LOW, CANNY_HIGH)
    print(f"[5] Bordes Canny: low={CANNY_LOW}, high={CANNY_HIGH}")
    return edges


def classic_segmentation(img: np.ndarray, gray: np.ndarray) -> np.ndarray:
    """Threshold Otsu + morfología + contornos."""
    _, thresh = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
    opened = cv2.morphologyEx(thresh, cv2.MORPH_OPEN, MORPH_KERNEL)
    closed = cv2.morphologyEx(opened, cv2.MORPH_CLOSE, MORPH_KERNEL)
    contours, _ = cv2.findContours(closed, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    result = img.copy()
    cv2.drawContours(result, contours, -1, (0, 255, 0), 2)
    # Bounding boxes para contornos grandes
    for cnt in contours:
        if cv2.contourArea(cnt) > 1000:
            x, y, w, h = cv2.boundingRect(cnt)
            cv2.rectangle(result, (x, y), (x + w, y + h), (255, 0, 0), 2)
    print(f"[6a] Segmentación clásica: threshold=Otsu, {len(contours)} contornos encontrados")
    return result


def yolo_detection(img: np.ndarray, output_dir: str) -> np.ndarray:
    """Detección con YOLOv8n."""
    try:
        from ultralytics import YOLO
        model = YOLO(YOLO_MODEL)
        results = model(img, conf=YOLO_CONF, verbose=False)
        result_img = results[0].plot()
        n_detections = len(results[0].boxes)
        classes = [results[0].names[int(c)] for c in results[0].boxes.cls]
        print(f"[6b] YOLOv8n: conf={YOLO_CONF}, {n_detections} detecciones: {classes}")
        return result_img
    except Exception as e:
        print(f"[6b] YOLOv8 falló ({e}), usando imagen original con etiqueta de error")
        result = img.copy()
        cv2.putText(result, "YOLO unavailable", (10, 30),
                    cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)
        return result


def make_panel(images: list, labels: list, cols: int = 3) -> np.ndarray:
    """Panel comparativo con etiquetas."""
    rows = (len(images) + cols - 1) // cols
    h, w = images[0].shape[:2]
    panel = np.zeros((rows * h, cols * w, 3), dtype=np.uint8)
    for i, (img, label) in enumerate(zip(images, labels)):
        r, c = divmod(i, cols)
        if len(img.shape) == 2:
            tile = cv2.cvtColor(img, cv2.COLOR_GRAY2BGR)
        else:
            tile = img.copy()
        tile = cv2.resize(tile, (w, h))
        cv2.putText(tile, label, (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (255, 255, 0), 2)
        panel[r * h:(r + 1) * h, c * w:(c + 1) * w] = tile
    return panel


def main():
    parser = argparse.ArgumentParser(description="Pipeline de procesamiento visual e IA")
    parser.add_argument("--input", default="data/entrada.jpg", help="Ruta a la imagen de entrada")
    parser.add_argument("--output", default="resultados", help="Directorio de salida")
    args = parser.parse_args()

    os.makedirs(args.output, exist_ok=True)

    print("=" * 60)
    print("PIPELINE DE PROCESAMIENTO VISUAL E IA")
    print(f"  Entrada : {args.input}")
    print(f"  Salida  : {args.output}/")
    print("=" * 60)

    # 1 — Cargar
    img = load_image(args.input)
    cv2.imwrite(os.path.join(args.output, "original.png"), img)

    # 2 — Grises
    gray = to_grayscale(img)
    cv2.imwrite(os.path.join(args.output, "grises.png"), gray)

    # 3 — HSV
    hsv = to_hsv(img)
    cv2.imwrite(os.path.join(args.output, "hsv_o_lab.png"), hsv)

    # 4 — Suavizado (sobre grises)
    blurred = smooth(gray)
    cv2.imwrite(os.path.join(args.output, "suavizado.png"), blurred)

    # 5 — Bordes
    edges = detect_edges(blurred)
    cv2.imwrite(os.path.join(args.output, "bordes.png"), edges)

    # 6a — Segmentación clásica
    classic = classic_segmentation(img, gray)

    # 6b — YOLO
    yolo = yolo_detection(img, args.output)

    # Componer imagen de detección exigida (panel clásico + YOLO lado a lado)
    h = min(classic.shape[0], yolo.shape[0])
    w = min(classic.shape[1], yolo.shape[1])
    c_resized = cv2.resize(classic, (w, h))
    y_resized = cv2.resize(yolo, (w, h))
    detection_panel = np.hstack([c_resized, y_resized])
    cv2.putText(detection_panel, "Clasico (izq)  |  YOLOv8 (der)",
                (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 255), 2)
    cv2.imwrite(os.path.join(args.output, "deteccion_o_segmentacion.png"), detection_panel)

    # Panel comparativo completo
    panel_imgs = [img, gray, hsv, blurred, edges, detection_panel]
    panel_labels = ["1-original", "2-grises", "3-HSV", "4-suavizado", "5-bordes", "6-deteccion"]
    comparativo = make_panel(panel_imgs, panel_labels, cols=3)
    cv2.imwrite(os.path.join(args.output, "comparativo.png"), comparativo)

    print("-" * 60)
    print("Archivos generados:")
    for f in sorted(os.listdir(args.output)):
        path = os.path.join(args.output, f)
        print(f"  {f}  ({os.path.getsize(path):,} bytes)")
    print("=" * 60)
    print("Pipeline completado exitosamente.")


if __name__ == "__main__":
    main()
