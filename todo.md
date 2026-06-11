# TODO — Examen Final Computación Visual 2026-I

Plan de ejecución por **fases secuenciales**. Cada fase tiene un **🚦 GATE** al final: no se pasa a la siguiente fase hasta que TODOS los checkboxes de la fase actual estén marcados y el gate verificado. Marcar `[x]` conforme se complete.

Leyenda: `[ ]` pendiente · `[x]` hecho · ⚠️ riesgo conocido.

Decisiones fijadas (ver `CLAUDE.md`): Ej2 = **React Three Fiber**, tema **Exploración espacial**; Ej1 entrada = **imagen**, detección = **clásico + modelo preentrenado**; gestor Python = **uv**; commits **sin co-autor**, GitHub vía **gh** como `gabotachak`.

---

## FASE 0 — Inicialización del repositorio y estructura base

- [x] `git init` en la raíz del proyecto; fijar rama por defecto `main`.
- [x] Configurar identidad de git si hace falta (autor = usuario; **NO** co-autor Claude).
- [x] Crear `.gitignore` raíz (Python/uv, Node/Vite, macOS `.DS_Store`, Linux, editores) — ✅ ya creado.
- [x] Crear árbol de carpetas vacío:
  - [x] `ejercicio_1_procesamiento_visual/src/`
  - [x] `ejercicio_1_procesamiento_visual/data/`
  - [x] `ejercicio_1_procesamiento_visual/resultados/`
  - [x] `ejercicio_2_escena_3d_interactiva/src/`
  - [x] `ejercicio_2_escena_3d_interactiva/media/`
- [x] Añadir `.gitkeep` a carpetas que deban existir vacías en git (`resultados/`, `media/`, `data/`).
- [x] Crear `README.md` principal stub (placeholder; se completa en Fase 7).
- [x] `CLAUDE.md` y `todo.md` ya existen → verificar que estén versionados.
- [x] Primer commit: `chore: inicializa estructura del repositorio`.
- [x] Crear repo remoto público con `gh repo create examen-final-computacion-visual-gabriel-anzola --public --source=. --remote=origin` (NO push aún si se prefiere, pero dejar `origin` configurado).
- [x] `git push -u origin main`.
- [x] **🚦 GATE 0**: `git status` limpio, `gh repo view` muestra el repo remoto, estructura de carpetas creada. Actualizar `## Estado actual` en `CLAUDE.md` → "Fase 0 completa".

---

## FASE 1 — Entorno de desarrollo Ejercicio 1 (Python + uv)

- [x] En `ejercicio_1_procesamiento_visual/`: `uv init` (crear `pyproject.toml`).
- [x] ⚠️ Fijar Python compatible: `uv python pin 3.12` (Python 3.14 del sistema puede no tener wheels de OpenCV/ultralytics). Verificar que resuelve.
- [x] Añadir dependencias núcleo: `uv add opencv-python numpy`.
- [x] Añadir dependencia del modelo preentrenado: `uv add ultralytics` (YOLOv8). Si falla en 3.12, fallback a `mediapipe` o a un modelo Haar/DNN de OpenCV → documentar el fallback.
- [x] `uv sync` y verificar que el entorno resuelve sin errores.
- [x] Smoke test del entorno: `uv run python -c "import cv2, numpy; print(cv2.__version__)"`.
- [x] Smoke test del modelo: `uv run python -c "import ultralytics; print('ok')"` (o el fallback elegido).
- [x] Conseguir/colocar la imagen de entrada en `data/` (foto con objetos detectables — p.ej. personas/coches para que YOLO tenga algo que detectar). Documentar origen/licencia de la imagen.
- [x] Commit: `chore(ej1): configura entorno uv y dependencias`.
- [x] **🚦 GATE 1**: entorno reproducible (`uv run python -c "import cv2"` OK), imagen de entrada presente. Anotar versiones reales de OpenCV/Python/modelo en `CLAUDE.md` (sección Aprendizajes).

---

## FASE 2 — Implementación Ejercicio 1 (pipeline OpenCV)

Implementar en `src/main.py` como **secuencia clara de operaciones**, cada paso guardando su salida en `resultados/`. Parametrizar (argparse) ruta de entrada y de salida.

- [x] **(1) Cargar entrada** con `cv2.imread`; validar que carga; guardar copia → `resultados/original.png`.
- [x] **(2) Escala de grises** con `cv2.cvtColor(..., COLOR_BGR2GRAY)` → `resultados/grises.png`.
- [x] **(3) Segundo espacio de color** HSV (o LAB) con `cv2.cvtColor` → `resultados/hsv_o_lab.png`.
- [x] **(4) Suavizado** Gaussiano (`cv2.GaussianBlur`) o Mediana (`cv2.medianBlur`); elegir uno, justificar kernel → `resultados/suavizado.png`.
- [x] **(5) Detección de bordes** Canny (o Sobel) sobre la imagen suavizada en grises; documentar umbrales → `resultados/bordes.png`.
- [x] **(6a) Segmentación clásica**: threshold (Otsu) + morfología (`open/close`) + `findContours` + dibujar contornos/bounding boxes → guardar.
- [x] **(6b) Detección con modelo preentrenado**: YOLOv8 sobre la imagen; dibujar cajas + etiquetas → guardar.
- [x] Componer la evidencia exigida `resultados/deteccion_o_segmentacion.png` (puede ser un panel/collage clásico+modelo, o la mejor de las dos; documentar elección).
- [x] (Opcional recomendado) guardar un panel comparativo `resultados/comparativo.png` con todas las etapas en mosaico.
- [x] Asegurar que `main.py` ejecuta TODO el pipeline de principio a fin con un solo comando (`uv run python src/main.py`).
- [x] Imprimir en consola los parámetros usados (kernels, umbrales, modelo, confianza) para trazabilidad.
- [x] Commit: `feat(ej1): pipeline completo de procesamiento visual`.
- [x] **🚦 GATE 2**: `uv run python src/main.py` corre sin errores y genera los 6 PNGs exigidos + extras. NO continuar a Ej2 hasta esto.

---

## FASE 3 — Entorno de desarrollo Ejercicio 2 (React Three Fiber)

- [x] En `ejercicio_2_escena_3d_interactiva/`: crear proyecto Vite + React: `npm create vite@latest src -- --template react` (o estructura equivalente; ajustar para que el código quede bajo `src/` según el árbol esperado).
- [x] ⚠️ Verificar que Vite arranca con Node 26 (muy nuevo); si falla, fijar versión de Node compatible y documentar.
- [x] Instalar dependencias 3D: `npm i three @react-three/fiber @react-three/drei`.
- [x] (Opcional) `npm i leva` para controles/sliders de interacción del usuario.
- [x] Smoke test: `npm run dev` levanta servidor y muestra canvas en blanco/escena vacía sin errores de consola.
- [x] Confirmar que `node_modules/` está en `.gitignore`.
- [x] Commit: `chore(ej2): configura proyecto React Three Fiber`.
- [x] **🚦 GATE 3**: `npm run dev` sirve la app sin errores. Anotar puerto y comando en `CLAUDE.md`.

---

## FASE 4 — Implementación Ejercicio 2 (escena 3D — Exploración espacial)

Cubrir TODOS los requisitos obligatorios del PDF. Mapear cada requisito a un checkbox.

- [x] **Escena base**: `<Canvas>`, suelo lunar (plano con material), cielo/fondo estrellado, niebla/espacio coherente.
- [x] **Jerarquía de objetos** (≥1): p.ej. Rover = grupo padre con ruedas/cabina/antena como hijos; o estación con módulos hijos. Que mover el padre mueva los hijos.
- [x] **Transformaciones**: aplicar traslación, rotación y escala explícitas a objetos de la escena (documentar dónde está cada una).
- [x] **Cámara interactiva**: `OrbitControls` de drei (orbit/zoom/pan con mouse).
- [x] **Materiales PBR**: usar `meshStandardMaterial`/`meshPhysicalMaterial` con metalness/roughness (o un shader personalizado vía `shaderMaterial`). Documentar cuál.
- [x] **Iluminación coherente**: luz direccional tipo sol + ambiente tenue + quizá point light de la base; sombras activadas.
- [x] **Animaciones**: animar elementos principales con `useFrame` (rover desplazándose, panel solar girando hacia el sol, astronauta flotando, antena rotando).
- [x] **Interacción entre elementos**: que elementos interactúen entre sí (p.ej. rover sigue un trayecto y "recoge"/se acerca a un objeto; panel se orienta al sol móvil; astronauta reacciona al rover). Debe ser visible en la demo.
- [x] **Interacción del usuario** (≥1): teclado (mover rover con WASD/flechas) y/o sliders Leva (velocidad, intensidad de luz) y/o click sobre objetos. Implementar al menos una claramente.
- [x] Pulido visual mínimo: que la escena se lea clara como "exploración espacial".
- [x] Verificar consola del navegador sin errores/warnings graves.
- [x] Commit: `feat(ej2): escena 3D interactiva de exploración espacial`.
- [x] **🚦 GATE 4**: la escena cumple cada bullet de requisitos obligatorios del PDF (revisar uno por uno). NO continuar hasta esto.

---

## FASE 5 — Generación de evidencias visuales

- [x] **Ej1**: confirmar que `resultados/` tiene los 6 PNGs exigidos (`original`, `grises`, `hsv_o_lab`, `suavizado`, `bordes`, `deteccion_o_segmentacion`).
- [x] **Ej2**: capturar `media/captura_1.png` y `media/captura_2.png` (vistas distintas de la escena).
- [x] **Ej2**: grabar demo (`media/demo.gif` o `demo.mp4`) mostrando claramente: escena construida, navegación/cámara, animaciones, interacción del usuario, e interacción entre elementos. ⚠️ Si pesa mucho el mp4, comprimir o subir a enlace externo y documentar; preferir GIF optimizado.
- [x] Verificar tamaños de archivo; nada innecesariamente pesado en el repo (regla del PDF).
- [x] Commit: `docs: añade evidencias visuales de ambos ejercicios`.
- [x] **🚦 GATE 5**: todas las evidencias exigidas existen y se visualizan correctamente.

---

## FASE 6 — Testing exhaustivo (PENÚLTIMA — verificar que TODO cumple)

Verificación reproducible de principio a fin. Probar como si fuera el evaluador en una máquina limpia (en lo posible).

### Ejercicio 1
- [x] Borrar `resultados/` y regenerar desde cero con un solo comando (`uv run python src/main.py`) → confirma reproducibilidad.
- [x] Confirmar que se generan EXACTAMENTE los 6 archivos con los nombres exigidos por el PDF.
- [x] Abrir cada PNG y validar que el resultado es correcto/coherente (grises real, HSV/LAB visible, suavizado evidente, bordes nítidos, detección con cajas).
- [x] Probar con `uv sync` en limpio (borrar `.venv`) que el entorno se reconstruye.
- [x] Verificar que cada una de las 8 operaciones obligatorias del PDF está presente y funciona.

### Ejercicio 2
- [x] `npm ci` (o `npm install`) desde limpio + `npm run build` sin errores.
- [x] `npm run dev` y recorrer manualmente cada requisito obligatorio del PDF marcándolo:
  - [x] jerarquía visible, [x] traslación, [x] rotación, [x] escala, [x] cámara interactiva, [x] PBR/shader, [x] iluminación, [x] animaciones, [x] interacción entre elementos, [x] interacción del usuario.
- [x] Revisar consola del navegador: 0 errores.
- [x] Confirmar que la demo/GIF refleja fielmente lo implementado.

### Global
- [x] Revisar contra cada bullet del PDF (Secciones 4, 5, 6) → checklist de cumplimiento total.
- [x] Confirmar estructura de repo == estructura esperada del PDF.
- [x] `git status` limpio; todo lo necesario versionado; nada pesado innecesario.
- [x] Commit (si hubo fixes): `test: verificación exhaustiva y correcciones`.
- [x] **🚦 GATE 6**: lista de cumplimiento 100% verde. Anotar resultados de testing en `CLAUDE.md`. NO documentar final hasta que todo pase.

---

## FASE 7 — Documentación (ÚLTIMA — toda la que pide el PDF)

Cada README debe responder las 7 preguntas de la Sección 6 del PDF: propósito, herramientas/librerías/motores, cómo se ejecuta, resultados, dificultades y soluciones, prompts de IA usados, qué se verificó manualmente.

### README principal (raíz)
- [x] Descripción general del proyecto.
- [x] Dependencias (Python/uv para Ej1, Node/npm para Ej2).
- [x] Instalación (pasos exactos para ambos ejercicios).
- [x] Ejecución (comandos exactos: `uv run python src/main.py`, `npm run dev`).
- [x] Estructura del repositorio (árbol).
- [x] Evidencias (enlazar/embeber PNGs y GIF).
- [x] Análisis técnico (decisiones de cada ejercicio).
- [x] Uso de IA (prompts usados, qué se verificó manualmente).

### `ejercicio_1_procesamiento_visual/README.md`
- [x] Propósito del ejercicio.
- [x] Herramientas/librerías (OpenCV, numpy, ultralytics) y versiones.
- [x] Cómo ejecutar.
- [x] Resultados obtenidos (mostrar/enlazar los 6 PNGs).
- [x] **Parámetros y decisiones técnicas**: kernel de suavizado, umbrales de Canny, método de threshold, modelo y confianza (requisito explícito de la operación 8).
- [x] Dificultades y cómo se resolvieron (p.ej. wheels de Python 3.14).
- [x] Prompts de IA usados.
- [x] Qué se verificó manualmente.

### `ejercicio_2_escena_3d_interactiva/README.md`
- [x] Propósito y tema (exploración espacial).
- [x] Herramientas/motor (React Three Fiber, three, drei, Vite) y versiones.
- [x] Cómo ejecutar (`npm install`, `npm run dev`).
- [x] Controles de interacción del usuario (qué teclas/sliders/clicks).
- [x] Resultados (capturas + demo GIF/video embebidos).
- [x] Mapeo explícito requisito→implementación (jerarquía, transformaciones, cámara, PBR, luz, animación, interacción).
- [x] Dificultades y soluciones.
- [x] Prompts de IA usados.
- [x] Qué se verificó manualmente.

### Cierre
- [x] Releer los 3 README contra la Sección 6 del PDF: ninguna pregunta sin responder.
- [x] Actualizar `CLAUDE.md` → estado "Proyecto completo".
- [x] Commit final: `docs: documentación completa de ambos ejercicios`.
- [x] `git push` a `origin main`.
- [x] Verificar en GitHub (`gh repo view --web`) que todo se ve correcto y el repo es público.
- [x] **🚦 GATE 7**: entrega completa, reproducible y documentada. Fin.

---

## Riesgos / cosas a vigilar

- ✅ Python 3.14 sin wheels para OpenCV/ultralytics → resuelto con `uv python pin 3.12`.
- ✅ Node 26 muy nuevo → Vite 6 compatible con Node 26 sin problemas.
- ✅ Media pesada (mp4) → usamos GIF optimizado 260KB.
- ✅ Modelo YOLO descarga pesos (`.pt`) → excluidos de git, descarga automática documentada.
- ✅ Commits **sin co-autor** — verificados todos los mensajes.
