# Auditorías Universitarias — Regional Rosario
### Universitarios por la Libertad (@upl_rosario · @upl_arg)

Versión regional desarrollada desde cero, clonando la estética, funcionalidades e información oficial de [upl-auditoriasuniversitarias.com](https://upl-auditoriasuniversitarias.com/) y adaptándola específicamente para la **Universidad Nacional de Rosario (UNR)** y el polo universitario de **Rosario y la Región**.

---

## 🌟 Características y Adaptaciones Regionales

1. **Diseño y Estética Idéntica a UPL Nacional**:
   - Paleta de colores oficial: azul marino principal (`#242c50` / `#070913`), violeta ciruela (`#371959`), amarillo vibrante (`#facf3b`), oro/ámbar resaltador (`#e4b862`) y crema suave (`#fffff9`).
   - Tipografía oficial de Google Fonts: **Baloo 2** (encabezados e impacto numérico) e **Inter** (cuerpo e interfaz).
   - Fondos animados con *blobs* flotantes y paneles con efecto *glassmorphism* (desenfoque de fondo y bordes lumínicos).
   - Logo oficial de UPL con distintivo de **Regional Rosario**.

2. **Mapa Interactivo de Rosario & Gran Rosario**:
   - Mapa vectorial SVG interactivo que traza la costa del **Río Paraná**, la cuadrícula urbana (Bv. Oroño, Av. Pellegrini, Av. Francia, Circunvalación) y los principales polos universitarios:
     - 🎓 **Ciudad Universitaria "La Siberia"** (FCEIA Ingeniería, FAPyD Arquitectura, FCPolit Política, Psicología, Escuela de Música).
     - 🏥 **Polo Salud** (Ciencias Médicas, Odontología, Bioquímicas y Farmacia, Hospital Centenario).
     - 🏛️ **Polo Centro** (Derecho, Ciencias Económicas y Estadística, Humanidades y Artes, Sede UNR Maipú 1065).
     - ⚙️ **Polo Tecnológico** (UTN Facultad Regional Rosario en E. Zeballos).
     - 🌾 **Gran Rosario / Regional** (Facultad de Ciencias Agrarias en Zavalla, Facultad de Ciencias Veterinarias en Casilda).
   - Al seleccionar o pasar el cursor sobre cualquier nodo, se despliegan sus estadísticas en tiempo real, alertas de auditoría y botón de acceso a la ficha completa.

3. **Los 6 Rankings Oficiales de Auditoría Universitaria**:
   - **Tasa de egreso de cohorte a 6 años**: En la UNR, solo el 24.7% de los ingresantes se recibe dentro de los 6 años (75 de cada 100 no lo logran).
   - **Sin materias aprobadas**: El 52.7% del padrón total (55.030 inscriptos) no aprobó ni una sola materia en todo el año.
   - **Costo real por graduado**: $61.546.057 por graduado efectivo (pesos constantes 2024).
   - **Estudiantes por docente**: Ratio de 4 alumnos activos por cada cargo docente (12.476 cargos).
   - **Gasto en estudiantes extranjeros**: 6.206 estudiantes extranjeros en la UNR que cursan sin pagar arancel ni contraprestación.
   - **Matrícula y tamaño**: Matrícula total de 104.357 inscriptos frente a 49.327 alumnos efectivamente activos.
   - Filtros dinámicos por ámbito: *Facultades de Rosario*, *Polo Regional Santa Fe (UNL, UNRaf)* y *Comparativa Nacional (UBA, UNC, etc.)*.

4. **Directorio de las 12 Facultades de la UNR + UTN FRRo**:
   - Tarjetas informativas con buscador instantáneo y filtros por polo geográfico.
   - Fichas completas de auditoría con gráficos de series históricas (2007-2024), distribución de cargos docentes (exclusiva, semi y simple), alertas y fuentes verificables.

5. **Alertas de Auditoría y Cajas Políticas de Rosario**:
   - Informe sobre el salto de **× 2,7 en gasto de publicidad y propaganda** en la UNR ($68,3 millones en 2025 vs $24,9 millones en 2024).
   - Investigación sobre el **colapso del 86% en egresados en Arquitectura y 85,9% en Derecho** entre 2017 y 2023 mientras subían los cargos docentes y estudiantes.
   - Comparativa de gasto: $6.327 millones en comedores vs $5.831 millones en becas directas a estudiantes.

6. **Propuestas UPL Rosario & Becas AvanzAR**:
   - Fin del ingreso irrestricto mediante examen de ingreso y nivelación gratuita.
   - Regularidad académica estricta (hacer cumplir el Art. 50 de la LES: mínimo 2 materias por año).
   - Financiamiento mixto y arancel para estudiantes extranjeros no residentes.
   - Auditorías externas obligatorias anuales de la AGN con balances públicos.
   - **Becas AvanzAR Rosario**: Programa de becas focalizadas en carreras estratégicas (Ingenierías, Biotecnología, Sistemas, Agronomía, Veterinaria, Enfermería).

7. **Modo Presentación (Slides Deck a Pantalla Completa)**:
   - 8 diapositivas interactivas diseñadas para proyectar o presentar datos clave en reuniones o redes sociales.
   - Navegación con teclado: `Flecha Derecha` / `Espacio` / `Enter` para avanzar, `Flecha Izquierda` para retroceder, `F` para pantalla completa y `ESC` para salir.

8. **Búsqueda Global Instantánea (`Ctrl + K` o `⌘ + K`)**:
   - Permite encontrar cualquier facultad, carrera o métrica en segundos.

---

## 🚀 Cómo Ejecutar la Aplicación

### Opción 1: Con Node.js (Servidor incluido)
```bash
npm start
```
Abrí tu navegador en [http://localhost:3000](http://localhost:3000).

### Opción 2: Abrir directamente
Podés abrir directamente el archivo `index.html` con cualquier navegador web moderno (Chrome, Edge, Firefox, Safari) o con la extensión Live Server de VS Code.

---

## 📂 Estructura de Archivos

- `index.html`: Estructura semántica, metadatos SEO y contenedores de vistas y modales.
- `index.css`: Sistema de diseño completo UPL con tokens HSL/HEX, glassmorphism, responsive design y microanimaciones.
- `app.js`: Motor interactivo de la aplicación (enrutador SPA, mapa SVG, rankings interactivos, buscador y modo presentación).
- `data_bundle.js`: Base de datos completa con métricas oficiales de la SPU/AGN para Rosario, las 12 facultades y las 62 universidades nacionales.
- `logo.jpg`: Isologotipo oficial de Universitarios por la Libertad.
- `server.js`: Servidor HTTP ligero sin dependencias externas.
