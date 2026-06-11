# TODO — Examen Final Computación Visual 2026-I

Plan de ejecución por **fases secuenciales**. Cada fase tiene un **🚦 GATE** al final: no se pasa a la siguiente fase hasta que TODOS los checkboxes de la fase actual estén marcados y el gate verificado. Marcar `[x]` conforme se complete.

Leyenda: `[ ]` pendiente · `[x]` hecho · ⚠️ riesgo conocido.

Decisiones fijadas (ver `CLAUDE.md`): Ej2 = **React Three Fiber**, tema **Exploración espacial**; Ej1 entrada = **imagen**, detección = **clásico + modelo preentrenado**; gestor Python = **uv**; commits **sin co-autor**, GitHub vía **gh** como `gabotachak`.

---

## FASE 0 — Inicialización del repositorio y estructura base

- [ ] `git init` en la raíz del proyecto; fijar rama por defecto `main`.
- [ ] Configurar identidad de git si hace falta (autor = usuario; **NO** co-autor Claude).
- [x] Crear `.gitignore` raíz (Python/uv, Node/Vite, macOS `.DS_Store`, Linux, editores) — ✅ ya creado.
- [ ] Crear árbol de carpetas vacío:
  - [ ] `ejercicio_1_procesamiento_visual/src/`
  - [ ] `ejercicio_1_procesamiento_visual/data/`
  - [ ] `ejercicio_1_procesamiento_visual/resultados/`
  - [ ] `ejercicio_2_escena_3d_interactiva/src/`
  - [ ] `ejercicio_2_escena_3d_interactiva/media/`
- [ ] Añadir `.gitkeep` a carpetas que deban existir vacías en git (`resultados/`, `media/`, `data/`).
- [ ] Crear `README.md` principal stub (placeholder; se completa en Fase 7).
- [ ] `CLAUDE.md` y `todo.md` ya existen → verificar que estén versionados.
- [ ] Primer commit: `chore: inicializa estructura del repositorio`.
- [ ] Crear repo remoto público con `gh repo create examen-final-computacion-visual-gabriel-anzola --public --source=. --remote=origin` (NO push aún si se prefiere, pero dejar `origin` configurado).
- [ ] `git push -u origin main`.
- [ ] **🚦 GATE 0**: `git status` limpio, `gh repo view` muestra el repo remoto, estructura de carpetas creada. Actualizar `## Estado actual` en `CLAUDE.md` → "Fase 0 completa".

---

## FASE 1 — Entorno de desarrollo Ejercicio 1 (Python + uv)

- [ ] En `ejercicio_1_procesamiento_visual/`: `uv init` (crear `pyproject.toml`).
- [ ] ⚠️ Fijar Python compatible: `uv python pin 3.12` (Python 3.14 del sistema puede no tener wheels de OpenCV/ultralytics). Verificar que resuelve.
- [ ] Añadir dependencias núcleo: `uv add opencv-python numpy`.
- [ ] Añadir dependencia del modelo preentrenado: `uv add ultralytics` (YOLOv8). Si falla en 3.12, fallback a `mediapipe` o a un modelo Haar/DNN de OpenCV → documentar el fallback.
- [ ] `uv sync` y verificar que el entorno resuelve sin errores.
- [ ] Smoke test del entorno: `uv run python -c "import cv2, numpy; print(cv2.__version__)"`.
- [ ] Smoke test del modelo: `uv run python -c "import ultralytics; print('ok')"` (o el fallback elegido).
- [ ] Conseguir/colocar la imagen de entrada en `data/` (foto con objetos detectables — p.ej. personas/coches para que YOLO tenga algo que detectar). Documentar origen/licencia de la imagen.
- [ ] Commit: `chore(ej1): configura entorno uv y dependencias`.
- [ ] **🚦 GATE 1**: entorno reproducible (`uv run python -c "import cv2"` OK), imagen de entrada presente. Anotar versiones reales de OpenCV/Python/modelo en `CLAUDE.md` (sección Aprendizajes).

---

## FASE 2 — Implementación Ejercicio 1 (pipeline OpenCV)

Implementar en `src/main.py` como **secuencia clara de operaciones**, cada paso guardando su salida en `resultados/`. Parametrizar (argparse) ruta de entrada y de salida.

- [ ] **(1) Cargar entrada** con `cv2.imread`; validar que carga; guardar copia → `resultados/original.png`.
- [ ] **(2) Escala de grises** con `cv2.cvtColor(..., COLOR_BGR2GRAY)` → `resultados/grises.png`.
- [ ] **(3) Segundo espacio de color** HSV (o LAB) con `cv2.cvtColor` → `resultados/hsv_o_lab.png`.
- [ ] **(4) Suavizado** Gaussiano (`cv2.GaussianBlur`) o Mediana (`cv2.medianBlur`); elegir uno, justificar kernel → `resultados/suavizado.png`.
- [ ] **(5) Detección de bordes** Canny (o Sobel) sobre la imagen suavizada en grises; documentar umbrales → `resultados/bordes.png`.
- [ ] **(6a) Segmentación clásica**: threshold (Otsu) + morfología (`open/close`) + `findContours` + dibujar contornos/bounding boxes → guardar.
- [ ] **(6b) Detección con modelo preentrenado**: YOLOv8 sobre la imagen; dibujar cajas + etiquetas → guardar.
- [ ] Componer la evidencia exigida `resultados/deteccion_o_segmentacion.png` (puede ser un panel/collage clásico+modelo, o la mejor de las dos; documentar elección).
- [ ] (Opcional recomendado) guardar un panel comparativo `resultados/comparativo.png` con todas las etapas en mosaico.
- [ ] Asegurar que `main.py` ejecuta TODO el pipeline de principio a fin con un solo comando (`uv run python src/main.py`).
- [ ] Imprimir en consola los parámetros usados (kernels, umbrales, modelo, confianza) para trazabilidad.
- [ ] Commit: `feat(ej1): pipeline completo de procesamiento visual`.
- [ ] **🚦 GATE 2**: `uv run python src/main.py` corre sin errores y genera los 6 PNGs exigidos + extras. NO continuar a Ej2 hasta esto.

---

## FASE 3 — Entorno de desarrollo Ejercicio 2 (React Three Fiber)

- [ ] En `ejercicio_2_escena_3d_interactiva/`: crear proyecto Vite + React: `npm create vite@latest src -- --template react` (o estructura equivalente; ajustar para que el código quede bajo `src/` según el árbol esperado).
- [ ] ⚠️ Verificar que Vite arranca con Node 26 (muy nuevo); si falla, fijar versión de Node compatible y documentar.
- [ ] Instalar dependencias 3D: `npm i three @react-three/fiber @react-three/drei`.
- [ ] (Opcional) `npm i leva` para controles/sliders de interacción del usuario.
- [ ] Smoke test: `npm run dev` levanta servidor y muestra canvas en blanco/escena vacía sin errores de consola.
- [ ] Confirmar que `node_modules/` está en `.gitignore`.
- [ ] Commit: `chore(ej2): configura proyecto React Three Fiber`.
- [ ] **🚦 GATE 3**: `npm run dev` sirve la app sin errores. Anotar puerto y comando en `CLAUDE.md`.

---

## FASE 4 — Implementación Ejercicio 2 (escena 3D — Exploración espacial)

Cubrir TODOS los requisitos obligatorios del PDF. Mapear cada requisito a un checkbox.

- [ ] **Escena base**: `<Canvas>`, suelo lunar (plano con material), cielo/fondo estrellado, niebla/espacio coherente.
- [ ] **Jerarquía de objetos** (≥1): p.ej. Rover = grupo padre con ruedas/cabina/antena como hijos; o estación con módulos hijos. Que mover el padre mueva los hijos.
- [ ] **Transformaciones**: aplicar traslación, rotación y escala explícitas a objetos de la escena (documentar dónde está cada una).
- [ ] **Cámara interactiva**: `OrbitControls` de drei (orbit/zoom/pan con mouse).
- [ ] **Materiales PBR**: usar `meshStandardMaterial`/`meshPhysicalMaterial` con metalness/roughness (o un shader personalizado vía `shaderMaterial`). Documentar cuál.
- [ ] **Iluminación coherente**: luz direccional tipo sol + ambiente tenue + quizá point light de la base; sombras activadas.
- [ ] **Animaciones**: animar elementos principales con `useFrame` (rover desplazándose, panel solar girando hacia el sol, astronauta flotando, antena rotando).
- [ ] **Interacción entre elementos**: que elementos interactúen entre sí (p.ej. rover sigue un trayecto y "recoge"/se acerca a un objeto; panel se orienta al sol móvil; astronauta reacciona al rover). Debe ser visible en la demo.
- [ ] **Interacción del usuario** (≥1): teclado (mover rover con WASD/flechas) y/o sliders Leva (velocidad, intensidad de luz) y/o click sobre objetos. Implementar al menos una claramente.
- [ ] Pulido visual mínimo: que la escena se lea clara como "exploración espacial".
- [ ] Verificar consola del navegador sin errores/warnings graves.
- [ ] Commit: `feat(ej2): escena 3D interactiva de exploración espacial`.
- [ ] **🚦 GATE 4**: la escena cumple cada bullet de requisitos obligatorios del PDF (revisar uno por uno). NO continuar hasta esto.

---

## FASE 5 — Generación de evidencias visuales

- [ ] **Ej1**: confirmar que `resultados/` tiene los 6 PNGs exigidos (`original`, `grises`, `hsv_o_lab`, `suavizado`, `bordes`, `deteccion_o_segmentacion`).
- [ ] **Ej2**: capturar `media/captura_1.png` y `media/captura_2.png` (vistas distintas de la escena).
- [ ] **Ej2**: grabar demo (`media/demo.gif` o `demo.mp4`) mostrando claramente: escena construida, navegación/cámara, animaciones, interacción del usuario, e interacción entre elementos. ⚠️ Si pesa mucho el mp4, comprimir o subir a enlace externo y documentar; preferir GIF optimizado.
- [ ] Verificar tamaños de archivo; nada innecesariamente pesado en el repo (regla del PDF).
- [ ] Commit: `docs: añade evidencias visuales de ambos ejercicios`.
- [ ] **🚦 GATE 5**: todas las evidencias exigidas existen y se visualizan correctamente.

---

## FASE 6 — Testing exhaustivo (PENÚLTIMA — verificar que TODO cumple)

Verificación reproducible de principio a fin. Probar como si fuera el evaluador en una máquina limpia (en lo posible).

### Ejercicio 1
- [ ] Borrar `resultados/` y regenerar desde cero con un solo comando (`uv run python src/main.py`) → confirma reproducibilidad.
- [ ] Confirmar que se generan EXACTAMENTE los 6 archivos con los nombres exigidos por el PDF.
- [ ] Abrir cada PNG y validar que el resultado es correcto/coherente (grises real, HSV/LAB visible, suavizado evidente, bordes nítidos, detección con cajas).
- [ ] Probar con `uv sync` en limpio (borrar `.venv`) que el entorno se reconstruye.
- [ ] Verificar que cada una de las 8 operaciones obligatorias del PDF está presente y funciona.

### Ejercicio 2
- [ ] `npm ci` (o `npm install`) desde limpio + `npm run build` sin errores.
- [ ] `npm run dev` y recorrer manualmente cada requisito obligatorio del PDF marcándolo:
  - [ ] jerarquía visible, [ ] traslación, [ ] rotación, [ ] escala, [ ] cámara interactiva, [ ] PBR/shader, [ ] iluminación, [ ] animaciones, [ ] interacción entre elementos, [ ] interacción del usuario.
- [ ] Revisar consola del navegador: 0 errores.
- [ ] Confirmar que la demo/GIF refleja fielmente lo implementado.

### Global
- [ ] Revisar contra cada bullet del PDF (Secciones 4, 5, 6) → checklist de cumplimiento total.
- [ ] Confirmar estructura de repo == estructura esperada del PDF.
- [ ] `git status` limpio; todo lo necesario versionado; nada pesado innecesario.
- [ ] Commit (si hubo fixes): `test: verificación exhaustiva y correcciones`.
- [ ] **🚦 GATE 6**: lista de cumplimiento 100% verde. Anotar resultados de testing en `CLAUDE.md`. NO documentar final hasta que todo pase.

---

## FASE 7 — Documentación (ÚLTIMA — toda la que pide el PDF)

Cada README debe responder las 7 preguntas de la Sección 6 del PDF: propósito, herramientas/librerías/motores, cómo se ejecuta, resultados, dificultades y soluciones, prompts de IA usados, qué se verificó manualmente.

### README principal (raíz)
- [ ] Descripción general del proyecto.
- [ ] Dependencias (Python/uv para Ej1, Node/npm para Ej2).
- [ ] Instalación (pasos exactos para ambos ejercicios).
- [ ] Ejecución (comandos exactos: `uv run python src/main.py`, `npm run dev`).
- [ ] Estructura del repositorio (árbol).
- [ ] Evidencias (enlazar/embeber PNGs y GIF).
- [ ] Análisis técnico (decisiones de cada ejercicio).
- [ ] Uso de IA (prompts usados, qué se verificó manualmente).

### `ejercicio_1_procesamiento_visual/README.md`
- [ ] Propósito del ejercicio.
- [ ] Herramientas/librerías (OpenCV, numpy, ultralytics) y versiones.
- [ ] Cómo ejecutar.
- [ ] Resultados obtenidos (mostrar/enlazar los 6 PNGs).
- [ ] **Parámetros y decisiones técnicas**: kernel de suavizado, umbrales de Canny, método de threshold, modelo y confianza (requisito explícito de la operación 8).
- [ ] Dificultades y cómo se resolvieron (p.ej. wheels de Python 3.14).
- [ ] Prompts de IA usados.
- [ ] Qué se verificó manualmente.

### `ejercicio_2_escena_3d_interactiva/README.md`
- [ ] Propósito y tema (exploración espacial).
- [ ] Herramientas/motor (React Three Fiber, three, drei, Vite) y versiones.
- [ ] Cómo ejecutar (`npm install`, `npm run dev`).
- [ ] Controles de interacción del usuario (qué teclas/sliders/clicks).
- [ ] Resultados (capturas + demo GIF/video embebidos).
- [ ] Mapeo explícito requisito→implementación (jerarquía, transformaciones, cámara, PBR, luz, animación, interacción).
- [ ] Dificultades y soluciones.
- [ ] Prompts de IA usados.
- [ ] Qué se verificó manualmente.

### Cierre
- [ ] Releer los 3 README contra la Sección 6 del PDF: ninguna pregunta sin responder.
- [ ] Actualizar `CLAUDE.md` → estado "Proyecto completo".
- [ ] Commit final: `docs: documentación completa de ambos ejercicios`.
- [ ] `git push` a `origin main`.
- [ ] Verificar en GitHub (`gh repo view --web`) que todo se ve correcto y el repo es público.
- [ ] **🚦 GATE 7**: entrega completa, reproducible y documentada. Fin.

---

## Riesgos / cosas a vigilar

- ⚠️ Python 3.14 sin wheels para OpenCV/ultralytics → usar `uv python pin 3.12`.
- ⚠️ Node 26 muy nuevo → posible incompatibilidad con Vite/plugins; fijar Node estable si falla.
- ⚠️ Media pesada (mp4) → preferir GIF optimizado o enlace externo (regla del PDF).
- ⚠️ Modelo YOLO descarga pesos (`.pt`) → excluir de git, documentar descarga automática.
- ⚠️ Commits **sin co-autor** (regla del usuario) — revisar cada mensaje.
