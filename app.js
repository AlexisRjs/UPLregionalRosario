/**
 * UPL AUDITORÍAS UNIVERSITARIAS — REGIONAL ROSARIO (SANTA FE / UNR / UTN)
 * Adaptación fiel al frontend oficial UPL:
 * Solo la provincia de Santa Fe en el mapa, inset de Gran Rosario,
 * y contenido exclusivamente enfocado en las facultades de la UNR y la UTN.
 */

// Estado global de la aplicación
const AppState = {
  currentRoute: 'mapa', // 'mapa' | 'rankings' | 'alertas' | 'propuestas'
  currentMetric: 'cohorte', // 'cohorte' | 'docentes' | 'costo' | 'ceroMaterias' | 'noDocentes' | 'extranjeros'
  currentScope: 'rosario', // 'rosario' | 'gran_rosario' | 'santafe'
  currency: 'ARS', // 'ARS' | 'USD'
  sortDirection: 'asc', // 'asc' (de peor a mejor) | 'desc' (de mejor a peor)
  showSedes: true,
  selectedUniversityId: 'rosario',
  isSearchModalOpen: false,
  isDossierOpen: false,
  selectedDossierItem: null
};

// Cotización USD / ARS de referencia
const USD_RATE = 1150;

// Formateadores numéricos y de moneda
const Formatters = {
  number: (n) => {
    if (n === null || n === undefined) return '-';
    return new Intl.NumberFormat('es-AR').format(Math.round(n));
  },
  percentage: (n) => {
    if (n === null || n === undefined) return '-';
    return `${Number(n).toFixed(1)}%`;
  },
  currency: (n) => {
    if (n === null || n === undefined) return '-';
    if (AppState.currency === 'USD') {
      const inUSD = n / USD_RATE;
      if (inUSD >= 1e6) {
        return `US$ ${(inUSD / 1e6).toFixed(1)} M`;
      }
      return `US$ ${new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(inUSD)}`;
    } else {
      if (n >= 1e9) {
        return `$${(n / 1e9).toFixed(1)} mil millones`;
      }
      if (n >= 1e6) {
        return `$${(n / 1e6).toFixed(1).replace('.', ',')} M`;
      }
      return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(n);
    }
  }
};

// Base de datos de sedes y facultades de Santa Fe y Rosario (UNR & UTN)
const REGIONAL_PINS = [
  { id: 'rosario', nombre: 'Universidad Nacional de Rosario (Sede Central)', sigla: 'UNR', ciudad: 'Rosario', x: 456.42, y: 267.65, tieneFicha: true, esCentral: true },
  { id: 'utn_rosario', nombre: 'UTN Facultad Regional Rosario', sigla: 'UTN FRRo', ciudad: 'Rosario', x: 455.75, y: 268.45, tieneFicha: true },
  { id: 'medicina', nombre: 'Fac. de Ciencias Médicas (UNR)', sigla: 'FCM', ciudad: 'Rosario (Polo Salud)', x: 456.10, y: 266.85, tieneFicha: true },
  { id: 'bioquimicas', nombre: 'Fac. de Cs. Bioquímicas y Farmacéuticas (UNR)', sigla: 'FBIOyF', ciudad: 'Rosario (Polo Salud)', x: 456.80, y: 266.90, tieneFicha: true },
  { id: 'odontologia', nombre: 'Fac. de Odontología (UNR)', sigla: 'FODONTO', ciudad: 'Rosario (Polo Salud)', x: 455.90, y: 266.40, tieneFicha: true },
  { id: 'derecho', nombre: 'Fac. de Derecho (UNR)', sigla: 'FDER', ciudad: 'Rosario (Centro)', x: 456.55, y: 267.30, tieneFicha: true },
  { id: 'economicas', nombre: 'Fac. de Cs. Económicas y Estadística (UNR)', sigla: 'FCEyE', ciudad: 'Rosario (Centro)', x: 456.25, y: 267.10, tieneFicha: true },
  { id: 'humanidades', nombre: 'Fac. de Humanidades y Artes (UNR)', sigla: 'FHYA', ciudad: 'Rosario (Centro)', x: 456.90, y: 267.45, tieneFicha: true },
  { id: 'ingenieria', nombre: 'Fac. de Cs. Exactas, Ingeniería y Agrimensura (UNR)', sigla: 'FCEIA', ciudad: 'Rosario (La Siberia / Pellegrini)', x: 456.30, y: 268.10, tieneFicha: true },
  { id: 'arquitectura', nombre: 'Fac. de Arquitectura, Planeamiento y Diseño (UNR)', sigla: 'FAPyD', ciudad: 'Rosario (La Siberia)', x: 456.70, y: 268.25, tieneFicha: true },
  { id: 'politica', nombre: 'Fac. de Ciencia Política y RR.II. (UNR)', sigla: 'FCPolit', ciudad: 'Rosario (La Siberia)', x: 456.50, y: 268.50, tieneFicha: true },
  { id: 'psicologia', nombre: 'Fac. de Psicología (UNR)', sigla: 'FPSICO', ciudad: 'Rosario (La Siberia)', x: 456.85, y: 268.40, tieneFicha: true },
  { id: 'agrarias', nombre: 'Fac. de Ciencias Agrarias (UNR)', sigla: 'FCA', ciudad: 'Zavalla (Gran Rosario)', x: 452.20, y: 269.80, tieneFicha: true },
  { id: 'veterinarias', nombre: 'Fac. de Ciencias Veterinarias (UNR)', sigla: 'FCV', ciudad: 'Casilda (Gran Rosario)', x: 448.50, y: 273.20, tieneFicha: true },
  { id: 'unl', nombre: 'Universidad Nacional del Litoral', sigla: 'UNL', ciudad: 'Santa Fe Capital', x: 455.50, y: 215.30, tieneFicha: true },
  { id: 'utn_santafe', nombre: 'UTN Facultad Regional Santa Fe', sigla: 'UTN FRSF', ciudad: 'Santa Fe Capital', x: 454.80, y: 215.80, tieneFicha: false },
  { id: 'unraf', nombre: 'Universidad Nacional de Rafaela', sigla: 'UNRaf', ciudad: 'Rafaela', x: 442.10, y: 208.50, tieneFicha: true },
  { id: 'utn_rafaela', nombre: 'UTN Facultad Regional Rafaela', sigla: 'UTN FRRa', ciudad: 'Rafaela', x: 441.50, y: 209.10, tieneFicha: false },
  { id: 'utn_venado', nombre: 'UTN Facultad Regional Venado Tuerto', sigla: 'UTN FRVT', ciudad: 'Venado Tuerto', x: 443.00, y: 282.50, tieneFicha: false },
  { id: 'utn_reconquista', nombre: 'UTN Facultad Regional Reconquista', sigla: 'UTN FRRq', ciudad: 'Reconquista', x: 468.20, y: 168.50, tieneFicha: false }
];

// ==========================================
// ENRUTADOR (SPA)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  initRouter();
  initGlobalEvents();
  handleRouteChange();
});

function initRouter() {
  window.addEventListener('hashchange', handleRouteChange);
}

function handleRouteChange() {
  const hash = window.location.hash.slice(1) || '/';
  const [path] = hash.split('?');
  const segments = path.split('/').filter(Boolean);

  closeDossierModal();
  closeSearchModal();

  if (segments.length === 0 || segments[0] === 'mapa') {
    AppState.currentRoute = 'mapa';
  } else if (segments[0] === 'rankings') {
    AppState.currentRoute = 'rankings';
    if (segments[1]) AppState.currentMetric = segments[1];
  } else if (segments[0] === 'universidades-kirchneristas' || segments[0] === 'kirchneristas' || segments[0] === 'alertas') {
    AppState.currentRoute = 'alertas';
  } else if (segments[0] === 'propuestas') {
    AppState.currentRoute = 'propuestas';
  } else if (segments[0] === 'universidad' && segments[1]) {
    openDossierById(segments[1]);
    return;
  } else {
    AppState.currentRoute = 'mapa';
  }

  updateFloatingNavbar();
  renderCurrentRoute();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateFloatingNavbar() {
  const navLinks = document.querySelectorAll('.nav-pill-link');
  navLinks.forEach(link => {
    const route = link.dataset.route;
    if (route === AppState.currentRoute) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  const currBtns = document.querySelectorAll('.curr-btn');
  currBtns.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.curr === AppState.currency);
  });
}

function setCurrency(curr) {
  AppState.currency = curr;
  updateFloatingNavbar();
  renderCurrentRoute();
}

function renderCurrentRoute() {
  const container = document.getElementById('mainContentContainer');
  if (!container) return;

  switch (AppState.currentRoute) {
    case 'mapa':
      container.innerHTML = getMapPageTemplate();
      break;
    case 'rankings':
    case 'alertas':
      container.innerHTML = getRankingsAlertasTemplate();
      initRankingsView();
      break;
    case 'propuestas':
      container.innerHTML = getPropuestasPageTemplate();
      break;
    default:
      container.innerHTML = getMapPageTemplate();
  }
}

// ==========================================
// 1. VISTA DEL MAPA REGIONAL DE SANTA FE (Exacto a Imagen 2)
// ==========================================
function getMapPageTemplate() {
  return `
    <div class="map-fullscreen-stage">
      <div class="map-svg-viewport">
        <!-- SVG Exclusivo de la Provincia de Santa Fe -->
        ${getSantaFeSVGElement()}

        <!-- Inset Zoom de Gran Rosario (Exacto al recuadro lateral de Imagen 2) -->
        <div class="map-inset-container">
          <div style="font-family: var(--font-display); font-size: 0.78rem; font-weight: 800; color: var(--color-upl-amarillo); margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.05em;">
            ZOOM GRAN ROSARIO (UNR & UTN)
          </div>
          ${getGranRosarioInsetSVG()}
        </div>
      </div>

      <!-- Tarjeta Flotante Inferior Izquierda (Exacta a Imagen 2) -->
      <div class="map-legend-floating-card">
        <p>Tocá una sede para ver sus datos, o buscá una facultad de la región.</p>

        <div style="display: flex; flex-direction: column; gap: 0.4rem;">
          <div class="legend-row-item">
            <span class="legend-dot-yellow"></span>
            <span>Con ficha de datos</span>
          </div>
          <div class="legend-row-item">
            <span class="legend-dot-dashed"></span>
            <span>Sin datos reportados</span>
          </div>
        </div>

        <div class="toggle-sedes-row" onclick="toggleSedesVisibility()">
          <div class="switch-pill-track ${AppState.showSedes ? 'on' : ''}" id="switchSedesTrack">
            <div class="switch-knob"></div>
          </div>
          <span style="font-size: 0.78rem; font-weight: 600; color: var(--color-upl-crema);">Sedes y facultades</span>
        </div>

        <button class="btn-search-uni-pill" onclick="openSearchModal()">
          <span>🔍</span>
          <span>Buscar facultad (UNR / UTN)</span>
        </button>

        <a href="https://www.argentina.gob.ar/educacion/universidades/informacion/publicaciones/anuarios" target="_blank" rel="noreferrer" class="source-footer-link">
          <span>Fuente: Anuarios SPU · Región Rosario</span>
          <span aria-hidden="true">↗</span>
        </a>
      </div>
    </div>
  `;
}

// SVG Vectorial de la Provincia de Santa Fe
function getSantaFeSVGElement() {
  const mapData = ARGENTINA_MAP;
  const santafe = (mapData && mapData.provincias) ? mapData.provincias.find(p => p.nombre === 'Santa Fe') : null;
  const santaFePath = santafe ? santafe.d : 'M434.77,156.7L429.17,210.73L433.69,215.25L426.16,237.64L435.62,269.6L414.06,301.06L434.55,300.39L453.49,281.12L460.81,284.57L465.76,274.66L457.15,267.99L454.57,241.51L477.39,215.25L476.74,209.44L478.9,182.1L484.71,179.08L488.58,157.77L491.6,158.42L492.24,154.54L434.77,156.7Z';

  // Pines de universidades de Santa Fe y Rosario
  const pines = REGIONAL_PINS.map(pin => {
    const isRosarioCentral = pin.id === 'rosario';
    const isUTN = pin.id === 'utn_rosario';
    const r = isRosarioCentral ? 2.8 : (isUTN ? 2.3 : (pin.tieneFicha ? 1.9 : 1.3));
    const pinClass = isRosarioCentral ? 'uni-pin-circle pin-data' : (pin.tieneFicha ? 'uni-pin-circle pin-data' : 'uni-pin-circle pin-sede');

    return `
      <circle 
        cx="${pin.x}" 
        cy="${pin.y}" 
        r="${r}" 
        class="${pinClass}" 
        id="pin-${pin.id}" 
        onclick="openDossierById('${pin.id}')"
        ${isRosarioCentral ? 'stroke="#fffff9" stroke-width="0.8"' : ''}
      >
        <title>${pin.sigla} - ${pin.nombre} (${pin.ciudad})</title>
      </circle>
    `;
  }).join('');

  return `
    <svg viewBox="405 145 95 165" class="santafe-svg-root" xmlns="http://www.w3.org/2000/svg">
      <!-- Silueta Oficial de Santa Fe -->
      <path 
        d="${santaFePath}" 
        class="santafe-shape" 
        id="santafe-province" 
      />

      <!-- Río Paraná (Borde Oriental de Santa Fe) -->
      <path d="M 491.6,158.4 Q 480,210 477.4,215.2 Q 454.6,241.5 457.1,268 L 465.8,274.7 L 460.8,284.6" fill="none" stroke="rgba(143,183,255,0.4)" stroke-width="1.2" stroke-linecap="round" />

      <!-- Líneas de Departamentos interiores sugeridas -->
      <line x1="426.2" y1="237.6" x2="455.5" y2="242" stroke="rgba(23,27,50,0.5)" stroke-width="0.5" stroke-dasharray="2,2" />
      <line x1="435.6" y1="269.6" x2="457.1" y2="268" stroke="rgba(23,27,50,0.5)" stroke-width="0.5" stroke-dasharray="2,2" />

      <!-- Destacado del Departamento Rosario -->
      <circle cx="456.4" cy="267.6" r="6" fill="rgba(250,207,59,0.18)" stroke="rgba(250,207,59,0.5)" stroke-width="0.7" />

      <!-- Capa de Pines Universitarios -->
      <g id="pines-layer" style="${AppState.showSedes ? '' : 'display: none;'}">
        ${pines}
      </g>
    </svg>
  `;
}

// Inset de Gran Rosario (Idéntico al polígono lateral de Imagen 2)
function getGranRosarioInsetSVG() {
  return `
    <svg viewBox="0 0 280 280" class="inset-svg-canvas" xmlns="http://www.w3.org/2000/svg">
      <!-- Polígono de fondo del Inset -->
      <polygon points="140,8 268,74 268,206 140,272 12,206 12,74" fill="#34406f" stroke="rgba(255,255,249,0.45)" stroke-width="2" />

      <!-- Costa del Río Paraná -->
      <path d="M 195,50 Q 235,110 220,175 Q 242,225 258,255" stroke="#1c3066" stroke-width="18" fill="none" opacity="0.85" />
      <text x="238" y="150" fill="rgba(143,183,255,0.45)" font-size="9" font-family="'Inter', sans-serif" transform="rotate(78 238,150)">RÍO PARANÁ</text>

      <!-- Bv. Oroño y Av. Pellegrini -->
      <line x1="40" y1="130" x2="210" y2="130" stroke="rgba(255,255,249,0.15)" stroke-width="1.5" stroke-dasharray="3,3" />
      <line x1="140" y1="30" x2="140" y2="240" stroke="rgba(255,255,249,0.15)" stroke-width="1.5" stroke-dasharray="3,3" />

      <!-- Nodos de las Facultades de Rosario (UNR & UTN) -->
      <!-- 1. La Siberia (FCEIA, FAPyD, FCPolit, Psicología) -->
      <circle cx="165" cy="190" r="10" fill="#facf3b" stroke="#121833" stroke-width="2" onclick="openDossierById('ingenieria')" style="cursor: pointer;">
        <title>La Siberia (CUR): FCEIA, FAPyD, FCPolit, Psicología</title>
      </circle>
      <text x="165" y="214" text-anchor="middle" fill="#fffff9" font-size="9" font-weight="700">La Siberia</text>

      <!-- 2. Polo Centro (Derecho, Económicas, Humanidades, Sede UNR) -->
      <circle cx="135" cy="130" r="9" fill="#facf3b" stroke="#121833" stroke-width="2" onclick="openDossierById('derecho')" style="cursor: pointer;">
        <title>Polo Centro: Derecho, Económicas, Humanidades, Sede UNR</title>
      </circle>
      <text x="135" y="118" text-anchor="middle" fill="#fffff9" font-size="9" font-weight="700">Polo Centro</text>

      <!-- 3. Polo Salud (Medicina, Odontología, Bioquímica) -->
      <circle cx="100" cy="90" r="9" fill="#8fb7ff" stroke="#121833" stroke-width="2" onclick="openDossierById('medicina')" style="cursor: pointer;">
        <title>Polo Salud: Medicina, Odontología, Bioquímica</title>
      </circle>
      <text x="75" y="80" text-anchor="end" fill="#8fb7ff" font-size="9" font-weight="700">Polo Salud</text>

      <!-- 4. UTN Facultad Regional Rosario (Zeballos 1341) -->
      <circle cx="118" cy="155" r="8" fill="#8fd19e" stroke="#121833" stroke-width="1.8" onclick="openDossierById('utn_rosario')" style="cursor: pointer;">
        <title>UTN FRRo (Zeballos 1341)</title>
      </circle>
      <text x="96" y="168" text-anchor="end" fill="#8fd19e" font-size="8" font-weight="700">UTN FRRo</text>

      <!-- 5. Gran Rosario: Zavalla (Agrarias) & Casilda (Veterinarias) -->
      <circle cx="45" cy="175" r="7" fill="#e4b862" stroke="#121833" stroke-width="1.5" onclick="openDossierById('agrarias')" style="cursor: pointer;">
        <title>FCA Zavalla (Agrarias)</title>
      </circle>
      <text x="45" y="196" text-anchor="middle" fill="#e4b862" font-size="8" font-weight="700">Zavalla</text>

      <circle cx="35" cy="225" r="7" fill="#e4b862" stroke="#121833" stroke-width="1.5" onclick="openDossierById('veterinarias')" style="cursor: pointer;">
        <title>FCV Casilda (Veterinarias)</title>
      </circle>
      <text x="35" y="246" text-anchor="middle" fill="#e4b862" font-size="8" font-weight="700">Casilda</text>
    </svg>
  `;
}

function toggleSedesVisibility() {
  AppState.showSedes = !AppState.showSedes;
  const pinesLayer = document.getElementById('pines-layer');
  const switchTrack = document.getElementById('switchSedesTrack');
  if (pinesLayer) pinesLayer.style.display = AppState.showSedes ? '' : 'none';
  if (switchTrack) switchTrack.classList.toggle('on', AppState.showSedes);
}

// ==========================================
// 2. VISTA DE RANKINGS Y ALERTAS (Exacto a Imagen 3)
// ==========================================
function getRankingsAlertasTemplate() {
  const metricDescriptions = {
    cohorte: 'Egresados 2024 sobre nuevos inscriptos 2018 (ventana de 6 años). Mayor = mejor.',
    docentes: 'Estudiantes activos por cargo docente en nómina. Menor = mejor atención pedagógica.',
    costo: 'Costo financiero real por graduado según presupuesto auditado e imputación anual (en pesos o USD). Menor = más eficiente.',
    ceroMaterias: 'Porcentaje de estudiantes inscriptos que no rindieron ninguna materia durante el año. Menor = mejor.',
    noDocentes: 'Cargos no docentes por cada 100 cargos docentes. Menor = menor estructura burocrática.',
    extranjeros: 'Porcentaje de matrícula correspondiente a estudiantes extranjeros sin residencia permanente.'
  };

  return `
    <div class="rankings-page-layout">
      <!-- Título de Página -->
      <h1 class="k-page-title">Auditorías Universitarias — Región Rosario</h1>
      <p class="k-page-desc">
        Relevamiento oficial de la Secretaría de Políticas Universitarias (SPU) y auditorías de la AGN para las 12 facultades de la Universidad Nacional de Rosario (UNR), la Facultad Regional Rosario de la UTN y el polo universitario de Santa Fe.
      </p>

      <!-- Alerta Roja/Violeta Oficial (Exacta a Imagen 3) -->
      <div class="k-alert-box">
        La UNR presenta un padrón con 55.030 inscriptos que no rindieron ninguna materia en 2024 (52,7%) y una caída histórica en graduados en Derecho (-85,9%) y Arquitectura (-86%), mientras el gasto en publicidad se multiplicó por 2,7 en pesos corrientes ($68,3 millones en 2025). La UTN Facultad Regional Rosario, con un tercio del costo presupuestario por alumno, supera la media de egreso de la UNR.
      </div>

      <!-- Barra de Filtro de Ámbito -->
      <div class="k-filter-header-bar">
        <span class="k-vs-title">UNR vs. UTN & Sistema Regional</span>
        
        <div class="scope-dropdown-pill" onclick="cycleScopeFilter()">
          <span>📍</span>
          <span>Ver: <strong>${getScopeLabel()}</strong></span>
          <span style="font-size: 0.7rem;">▼</span>
        </div>
      </div>

      <!-- Tarjeta Comparativa 'VS' Oficial (5 Columnas Idénticas a Imagen 3) -->
      <div class="vs-comparison-card">
        <div class="vs-columns-grid">
          <!-- Columna 1: Tasa de Cohorte -->
          <div class="vs-col-item">
            <div class="vs-col-header">TASA DE COHORTE (EGRESO)</div>
            <div class="vs-numbers-row">
              <div class="vs-subgroup">
                <span class="vs-sub-lbl">UNR Rosario (12 Fac.)</span>
                <span class="vs-sub-num peor">24,7%</span>
                <span class="vs-badge-peor">▼ peor</span>
              </div>
              <span class="vs-middle-vs">vs</span>
              <div class="vs-subgroup" style="text-align: right;">
                <span class="vs-sub-lbl">UTN FRRo</span>
                <span class="vs-sub-num">31,0%</span>
              </div>
            </div>
          </div>

          <!-- Columna 2: Estudiantes Activos por Docente -->
          <div class="vs-col-item">
            <div class="vs-col-header">ESTUDIANTES ACTIVOS POR DOCENTE</div>
            <div class="vs-numbers-row">
              <div class="vs-subgroup">
                <span class="vs-sub-lbl">UNR Rosario</span>
                <span class="vs-sub-num">4,0 x 1</span>
              </div>
              <span class="vs-middle-vs">vs</span>
              <div class="vs-subgroup" style="text-align: right;">
                <span class="vs-sub-lbl">UTN FRRo</span>
                <span class="vs-sub-num peor">5,1 x 1</span>
                <span class="vs-badge-peor">▼ peor</span>
              </div>
            </div>
          </div>

          <!-- Columna 3: Costo por Graduado -->
          <div class="vs-col-item">
            <div class="vs-col-header">COSTO POR GRADUADO</div>
            <div class="vs-numbers-row">
              <div class="vs-subgroup">
                <span class="vs-sub-lbl">UNR Rosario</span>
                <span class="vs-sub-num peor">${Formatters.currency(61546057)}</span>
                <span class="vs-badge-peor">▼ peor</span>
              </div>
              <span class="vs-middle-vs">vs</span>
              <div class="vs-subgroup" style="text-align: right;">
                <span class="vs-sub-lbl">UTN FRRo</span>
                <span class="vs-sub-num">${Formatters.currency(44200000)}</span>
              </div>
            </div>
          </div>

          <!-- Columna 4: Estudiantes sin Materias -->
          <div class="vs-col-item">
            <div class="vs-col-header">ESTUDIANTES SIN MATERIAS</div>
            <div class="vs-numbers-row">
              <div class="vs-subgroup">
                <span class="vs-sub-lbl">UNR Rosario</span>
                <span class="vs-sub-num peor">52,7%</span>
                <span class="vs-badge-peor">▼ peor</span>
              </div>
              <span class="vs-middle-vs">vs</span>
              <div class="vs-subgroup" style="text-align: right;">
                <span class="vs-sub-lbl">UTN FRRo</span>
                <span class="vs-sub-num">36,3%</span>
              </div>
            </div>
          </div>

          <!-- Columna 5: No Docentes por Docente -->
          <div class="vs-col-item">
            <div class="vs-col-header">NO DOCENTES POR DOCENTE</div>
            <div class="vs-numbers-row">
              <div class="vs-subgroup">
                <span class="vs-sub-lbl">UNR Rosario</span>
                <span class="vs-sub-num peor">35 c/100</span>
                <span class="vs-badge-peor">▼ peor</span>
              </div>
              <span class="vs-middle-vs">vs</span>
              <div class="vs-subgroup" style="text-align: right;">
                <span class="vs-sub-lbl">UTN FRRo</span>
                <span class="vs-sub-num">25 c/100</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Nota al pie de la tarjeta VS -->
      <p class="vs-footer-caption">
        Valores de grupo ponderados oficiales de la Secretaría de Políticas Universitarias (SPU) y AGN. La UTN demuestra una regularidad de cursado superior con una estructura administrativa más austera por cada egresado efectivo.
      </p>

      <!-- Botones Píldora de Selección de Métricas (Idénticos a Imagen 3) -->
      <div class="metric-pills-selector-row">
        <button class="metric-pill-button ${AppState.currentMetric === 'cohorte' ? 'active' : ''}" onclick="selectRankingMetric('cohorte')">Tasa de cohorte (egreso)</button>
        <button class="metric-pill-button ${AppState.currentMetric === 'docentes' ? 'active' : ''}" onclick="selectRankingMetric('docentes')">Estudiantes activos por docente</button>
        <button class="metric-pill-button ${AppState.currentMetric === 'costo' ? 'active' : ''}" onclick="selectRankingMetric('costo')">Costo por graduado</button>
        <button class="metric-pill-button ${AppState.currentMetric === 'ceroMaterias' ? 'active' : ''}" onclick="selectRankingMetric('ceroMaterias')">Estudiantes sin materias</button>
        <button class="metric-pill-button ${AppState.currentMetric === 'noDocentes' ? 'active' : ''}" onclick="selectRankingMetric('noDocentes')">No docentes por docente</button>
        <button class="metric-pill-button ${AppState.currentMetric === 'extranjeros' ? 'active' : ''}" onclick="selectRankingMetric('extranjeros')">Gasto en extranjeros</button>
      </div>

      <!-- Subtítulo de Métrica y Botón de Ordenamiento (De peor a mejor / De mejor a peor) -->
      <div class="ranking-meta-controls-bar">
        <div class="ranking-meta-info">${metricDescriptions[AppState.currentMetric] || ''}</div>

        <button class="sort-toggle-pill-btn" onclick="toggleSortDirection()">
          <span>⇅</span>
          <span>${AppState.sortDirection === 'asc' ? 'De peor a mejor' : 'De mejor a peor'}</span>
        </button>
      </div>

      <!-- Lista Vertical de Tarjetas Ranking (Idéntica a Imagen 3) -->
      <div class="ranked-cards-stack" id="rankedCardsStackContainer">
        <!-- Renderizado dinámico -->
      </div>
    </div>
  `;
}

function getScopeLabel() {
  if (AppState.currentScope === 'rosario') return 'Rosario (UNR & UTN)';
  if (AppState.currentScope === 'gran_rosario') return 'Gran Rosario (Zavalla / Casilda)';
  return 'Provincia de Santa Fe';
}

function cycleScopeFilter() {
  if (AppState.currentScope === 'rosario') AppState.currentScope = 'gran_rosario';
  else if (AppState.currentScope === 'gran_rosario') AppState.currentScope = 'santafe';
  else AppState.currentScope = 'rosario';
  renderCurrentRoute();
}

function selectRankingMetric(m) {
  AppState.currentMetric = m;
  renderCurrentRoute();
}

function toggleSortDirection() {
  AppState.sortDirection = AppState.sortDirection === 'asc' ? 'desc' : 'asc';
  renderCurrentRoute();
}

function initRankingsView() {
  renderRankedCardsList();
}

function renderRankedCardsList() {
  const container = document.getElementById('rankedCardsStackContainer');
  if (!container) return;

  // Dataset exclusivo de facultades de la UNR y la UTN en Rosario y la región
  let dataset = UPL_DATA.facultades.map(f => ({
    id: f.id,
    nombre: f.nombre,
    sigla: f.sigla,
    ciudad: f.direccion ? f.direccion.split(',')[0] : 'Rosario',
    provincia: 'Santa Fe',
    polo: f.polo,
    tasaCohorte: f.tasaCohorte,
    docentes: f.estudiantesPorDocente,
    costo: f.costoPorGraduado,
    ceroMaterias: f.sinMateriasPct,
    noDocentes: f.id === 'utn_rosario' ? 25 : 35,
    extranjeros: f.extranjerosPct,
    alerta: f.alerta
  }));

  // Si el scope es 'gran_rosario', filtramos o destacamos
  if (AppState.currentScope === 'gran_rosario') {
    dataset = dataset.filter(f => f.polo === 'regional' || f.id === 'utn_rosario' || f.polo === 'siberia');
  } else if (AppState.currentScope === 'santafe') {
    // Añadimos UNL y UNRaf para comparación provincial
    dataset.push(
      {
        id: 'unl',
        nombre: 'Universidad Nacional del Litoral',
        sigla: 'UNL',
        ciudad: 'Santa Fe Capital',
        provincia: 'Santa Fe',
        polo: 'provincial',
        tasaCohorte: 29.8,
        docentes: 4.8,
        costo: 48200000,
        ceroMaterias: 44.5,
        noDocentes: 38,
        extranjeros: 2.1
      },
      {
        id: 'unraf',
        nombre: 'Universidad Nacional de Rafaela',
        sigla: 'UNRaf',
        ciudad: 'Rafaela',
        provincia: 'Santa Fe',
        polo: 'provincial',
        tasaCohorte: 28.1,
        docentes: 5.4,
        costo: 52600000,
        ceroMaterias: 47.2,
        noDocentes: 42,
        extranjeros: 0.8
      }
    );
  }

  // Ordenamiento según métrica y dirección
  const m = AppState.currentMetric;
  const isAsc = AppState.sortDirection === 'asc';

  dataset.sort((a, b) => {
    let valA = a[m] || 0;
    let valB = b[m] || 0;
    return isAsc ? valA - valB : valB - valA;
  });

  // Renderizar tarjetas con formato idéntico a Imagen 3
  container.innerHTML = dataset.map((item, index) => {
    let formattedMetric = '';
    let extraDetail = '';

    if (m === 'cohorte') {
      formattedMetric = Formatters.percentage(item.tasaCohorte);
      extraDetail = `${Math.round(100 - item.tasaCohorte)}% no se reciben`;
    } else if (m === 'docentes') {
      formattedMetric = `${Number(item.docentes).toFixed(1)} x 1`;
      extraDetail = 'alumnos por docente';
    } else if (m === 'costo') {
      formattedMetric = Formatters.currency(item.costo);
      extraDetail = 'por graduado';
    } else if (m === 'ceroMaterias') {
      formattedMetric = Formatters.percentage(item.ceroMaterias);
      extraDetail = 'sin rendir materias';
    } else if (m === 'noDocentes') {
      formattedMetric = `${item.noDocentes} c/100`;
      extraDetail = 'no docentes por docente';
    } else if (m === 'extranjeros') {
      formattedMetric = Formatters.percentage(item.extranjeros);
      extraDetail = 'matrícula extranjera';
    }

    return `
      <div class="ranked-card-entry" onclick="openDossierById('${item.id}')">
        <div class="ranked-pos-col">${index + 1}</div>
        <div class="uni-sigla-badge">${item.sigla}</div>
        <div class="ranked-info-col">
          <div class="ranked-name-main">${item.nombre}</div>
          <div class="ranked-geo-sub">${item.ciudad}, ${item.provincia}</div>
        </div>
        <div class="ranked-metric-col">
          <div class="ranked-metric-num">${formattedMetric}</div>
          <div class="ranked-metric-extra">${extraDetail}</div>
        </div>
      </div>
    `;
  }).join('');
}

// ==========================================
// 3. VISTA DE PROPUESTAS
// ==========================================
function getPropuestasPageTemplate() {
  const props = UPL_DATA.propuestas;
  const avanzar = UPL_DATA.avanzar;

  return `
    <div class="rankings-page-layout">
      <h1 class="k-page-title">Qué proponemos para Rosario</h1>
      <p class="k-page-desc">
        No estamos en contra de financiar la universidad pública: estamos en contra de financiarla a ciegas. Cuatro propuestas de Universitarios por la Libertad y una apuesta central para la UNR y la UTN en Rosario.
      </p>

      <div style="display: flex; flex-direction: column; gap: 1rem; margin-bottom: 2rem;">
        ${props.map((p, idx) => `
          <div class="glass-strong" style="padding: 1.5rem; border-radius: var(--radius-md);">
            <div style="font-family: var(--font-display); font-weight: 800; font-size: 1.2rem; color: var(--color-upl-amarillo); margin-bottom: 0.5rem;">
              0${idx + 1}. ${p.titulo}
            </div>
            <p style="color: var(--color-upl-crema); font-size: 0.95rem; font-weight: 600; margin-bottom: 0.5rem;">${p.bajada}</p>
            <p style="color: var(--color-upl-crema-muted); font-size: 0.9rem; line-height: 1.55; margin-bottom: 1rem;">${p.detalle}</p>
            <div style="background: rgba(226, 87, 76, 0.15); border: 1px solid rgba(226, 87, 76, 0.35); padding: 0.75rem 1rem; border-radius: 10px; font-size: 0.85rem; color: var(--color-upl-crema);">
              <span style="color: var(--color-danger-soft); font-weight: 700;">El dato en Rosario: </span>${p.datoRosario}
            </div>
          </div>
        `).join('')}
      </div>

      <div class="glass-strong" style="padding: 2rem; border-radius: var(--radius-lg); border: 2px solid rgba(250, 207, 59, 0.4);">
        <div style="display: flex; align-items: center; justify-content: space-between; gap: 1rem; margin-bottom: 1rem;">
          <h2 style="font-family: var(--font-display); font-weight: 800; font-size: 1.8rem; color: #fff;">${avanzar.nombre}</h2>
          <span style="background: var(--color-upl-amarillo); color: #121833; padding: 0.3rem 0.85rem; border-radius: 999px; font-weight: 800; font-size: 0.85rem;">Becas AvanzAR</span>
        </div>
        <p style="font-size: 1.05rem; font-weight: 600; color: var(--color-upl-amarillo); margin-bottom: 0.75rem;">${avanzar.bajada}</p>
        <p style="color: var(--color-upl-crema-muted); font-size: 0.95rem; line-height: 1.6; margin-bottom: 1.5rem;">${avanzar.detalle}</p>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 1.5rem;">
          ${avanzar.ejes.map(e => `
            <div style="background: rgba(7, 9, 19, 0.5); padding: 1rem; border-radius: 10px; border: 1px solid rgba(255, 255, 249, 0.08);">
              <div style="color: var(--color-upl-amarillo); font-weight: 700; margin-bottom: 0.3rem;">${e.titulo}</div>
              <div style="font-size: 0.82rem; color: var(--color-upl-crema-muted);">${e.texto}</div>
            </div>
          `).join('')}
        </div>

        <div>
          <div style="font-size: 0.8rem; text-transform: uppercase; color: var(--color-upl-resaltador); font-weight: 700; margin-bottom: 0.5rem;">Carreras Estratégicas Prioritarias en Rosario:</div>
          <div style="display: flex; flex-wrap: wrap; gap: 0.4rem;">
            ${avanzar.carrerasEstrategicasRosario.map(c => `
              <span style="background: rgba(250, 207, 59, 0.12); border: 1px solid rgba(250, 207, 59, 0.35); padding: 0.3rem 0.75rem; border-radius: 999px; font-size: 0.8rem; font-weight: 600; color: #fffff9;">
                ${c}
              </span>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  `;
}

// ==========================================
// MODAL DE FICHA / DOSSIER DE AUDITORÍA
// ==========================================
function openDossierById(id) {
  let item = null;

  if (id === 'unr' || id === 'rosario') {
    item = UPL_DATA.institucionCentral;
  } else {
    item = UPL_DATA.facultades.find(f => f.id === id);
    if (!item && typeof NATIONAL_UNIVERSITIES !== 'undefined') {
      item = NATIONAL_UNIVERSITIES[id];
    }
  }

  if (!item) return;
  AppState.selectedDossierItem = item;

  const modalOverlay = document.getElementById('dossierModalOverlay');
  const modalContent = document.getElementById('dossierModalContent');
  if (!modalOverlay || !modalContent) return;

  const nombre = item.nombre;
  const sigla = item.sigla;
  const direccion = item.direccion || item.sedeCentral || `${item.ciudad}, ${item.provincia}`;
  const tasa = item.tasaCohorte;
  const egresados = item.egresados2024 || item.egresadosAnuales;
  const estudiantes = item.estudiantes2024 || item.estudiantes;
  const costo = item.costoPorGraduado;

  modalContent.innerHTML = `
    <div class="dossier-window-card">
      <button class="modal-close-corner-btn" onclick="closeDossierModal()">✕</button>

      <div style="padding: 2rem 2.2rem 1.5rem; background: linear-gradient(180deg, rgba(36, 44, 80, 0.5) 0%, rgba(14, 19, 41, 0) 100%); border-bottom: 1px solid rgba(255, 255, 249, 0.08);">
        <div style="display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.5rem;">
          <span style="background: var(--color-upl-amarillo); color: #121833; font-weight: 800; font-size: 0.75rem; padding: 0.2rem 0.6rem; border-radius: 999px;">${sigla}</span>
          <span style="color: var(--color-upl-resaltador); font-size: 0.75rem; font-weight: 700;">AUDITORÍA UNIVERSITARIA SPU / AGN · ROSARIO</span>
        </div>
        <h2 style="font-family: var(--font-display); font-size: 1.85rem; font-weight: 800; margin-bottom: 0.35rem;">${nombre}</h2>
        <div style="font-size: 0.88rem; color: var(--color-upl-crema-muted);">
          <span>📍 ${direccion}</span>
          ${item.sitio ? ` · <a href="${item.sitio}" target="_blank" rel="noreferrer" style="color: var(--color-upl-amarillo); font-weight: 600;">Sitio Oficial ↗</a>` : ''}
        </div>
      </div>

      <!-- 4 Indicadores Clave -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem; padding: 1.25rem 2.2rem; background: rgba(7,9,19,0.3); border-bottom: 1px solid rgba(255,255,249,0.08);">
        <div>
          <div style="font-size: 0.72rem; color: var(--color-upl-crema-muted); text-transform: uppercase; font-weight: 700;">Tasa de Egreso</div>
          <div style="font-family: var(--font-display); font-weight: 800; font-size: 1.8rem; color: var(--color-upl-amarillo);">${Formatters.percentage(tasa)}</div>
          <div style="font-size: 0.72rem; color: var(--color-upl-crema-faint);">Cohorte oficial 6 años</div>
        </div>
        <div>
          <div style="font-size: 0.72rem; color: var(--color-upl-crema-muted); text-transform: uppercase; font-weight: 700;">Matrícula Total</div>
          <div style="font-family: var(--font-display); font-weight: 800; font-size: 1.8rem; color: #fffff9;">${Formatters.number(estudiantes)}</div>
          <div style="font-size: 0.72rem; color: var(--color-upl-crema-faint);">Alumnos inscriptos</div>
        </div>
        <div>
          <div style="font-size: 0.72rem; color: var(--color-upl-crema-muted); text-transform: uppercase; font-weight: 700;">Egresados Anuales</div>
          <div style="font-family: var(--font-display); font-weight: 800; font-size: 1.8rem; color: #fffff9;">${Formatters.number(egresados)}</div>
          <div style="font-size: 0.72rem; color: var(--color-upl-crema-faint);">Títulos expedidos</div>
        </div>
        <div>
          <div style="font-size: 0.72rem; color: var(--color-upl-crema-muted); text-transform: uppercase; font-weight: 700;">Costo por Graduado</div>
          <div style="font-family: var(--font-display); font-weight: 800; font-size: 1.8rem; color: var(--color-upl-resaltador);">${Formatters.currency(costo)}</div>
          <div style="font-size: 0.72rem; color: var(--color-upl-crema-faint);">${AppState.currency === 'USD' ? 'Dólares estadounidenses' : 'Pesos constantes 2024'}</div>
        </div>
      </div>

      <!-- Notas y Alertas -->
      <div style="padding: 1.75rem 2.2rem; display: flex; flex-direction: column; gap: 1.25rem;">
        ${item.alerta ? `
          <div class="k-alert-box" style="margin-bottom: 0;">
            <strong style="color: var(--color-danger-soft);">Hallazgo de Auditoría:</strong> ${item.alerta}
          </div>
        ` : ''}

        ${item.alertasAuditoria ? `
          <div>
            <div style="font-family: var(--font-display); font-weight: 800; font-size: 1.1rem; color: var(--color-upl-crema); margin-bottom: 0.75rem;">Alertas Oficiales UNR:</div>
            <div style="display: flex; flex-direction: column; gap: 0.75rem;">
              ${item.alertasAuditoria.map(a => `
                <div style="background: rgba(226, 87, 76, 0.1); border-left: 3px solid var(--color-danger); padding: 0.75rem 1rem; border-radius: 0 8px 8px 0;">
                  <div style="font-weight: 700; color: #fffff9; margin-bottom: 0.2rem;">${a.titulo}</div>
                  <div style="font-size: 0.85rem; color: var(--color-upl-crema-muted);">${a.texto}</div>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        ${item.carrerasPrincipales ? `
          <div>
            <div style="font-size: 0.78rem; text-transform: uppercase; color: var(--color-upl-resaltador); font-weight: 700; margin-bottom: 0.5rem;">Carreras Principales:</div>
            <div style="display: flex; flex-wrap: wrap; gap: 0.4rem;">
              ${item.carrerasPrincipales.map(c => `
                <span style="background: rgba(255, 255, 249, 0.08); border: 1px solid rgba(255, 255, 249, 0.12); padding: 0.25rem 0.65rem; border-radius: 999px; font-size: 0.8rem; color: var(--color-upl-crema);">
                  ${c}
                </span>
              `).join('')}
            </div>
          </div>
        ` : ''}
      </div>

      <!-- Footer con botón de compartir -->
      <div style="padding: 1.25rem 2.2rem; background: rgba(7,9,19,0.7); border-top: 1px solid rgba(255,255,249,0.08); display: flex; align-items: center; justify-content: space-between;">
        <button class="curr-btn active" onclick="copyDossierLink('${id}')" style="padding: 0.5rem 1rem; font-size: 0.85rem;">
          🔗 Copiar Enlace
        </button>
        <button class="curr-btn" onclick="window.print()" style="padding: 0.5rem 1rem; font-size: 0.85rem;">
          🖨️ Imprimir Ficha
        </button>
      </div>
    </div>
  `;

  modalOverlay.classList.add('active');
  AppState.isDossierOpen = true;
}

function closeDossierModal() {
  const modalOverlay = document.getElementById('dossierModalOverlay');
  if (modalOverlay) modalOverlay.classList.remove('active');
  AppState.isDossierOpen = false;
  AppState.selectedDossierItem = null;
}

function copyDossierLink(id) {
  const url = `${window.location.origin}${window.location.pathname}#/universidad/${id}`;
  navigator.clipboard.writeText(url).then(() => {
    showToastNotice('¡Enlace de ficha copiado!');
  }).catch(() => {
    showToastNotice(`Enlace: ${url}`);
  });
}

// ==========================================
// MODAL DE BÚSQUEDA GLOBAL (CTRL + K)
// ==========================================
function openSearchModal() {
  const modal = document.getElementById('searchModalOverlay');
  const input = document.getElementById('searchGlobalInput');
  if (!modal || !input) return;

  modal.classList.add('active');
  AppState.isSearchModalOpen = true;
  input.value = '';
  input.focus();
  renderSearchResults('');
}

function closeSearchModal() {
  const modal = document.getElementById('searchModalOverlay');
  if (modal) modal.classList.remove('active');
  AppState.isSearchModalOpen = false;
}

function handleGlobalSearchInput(val) {
  renderSearchResults(val);
}

function renderSearchResults(query) {
  const container = document.getElementById('searchResultsContainer');
  if (!container) return;

  const q = query.toLowerCase().trim();
  const results = [];

  // 1. UNR Central
  if (!q || 'universidad nacional de rosario unr'.includes(q)) {
    results.push({ id: 'rosario', title: 'Universidad Nacional de Rosario (UNR)', subtitle: 'Sede Central · Rosario', badge: 'UNR' });
  }

  // 2. UTN FRRo
  if (!q || 'utn facultad regional rosario tecnológica zeballos'.includes(q)) {
    results.push({ id: 'utn_rosario', title: 'UTN Facultad Regional Rosario', subtitle: 'Zeballos 1341 · Rosario', badge: 'UTN' });
  }

  // 3. Facultades de Rosario
  UPL_DATA.facultades.forEach(f => {
    if (!q || f.nombre.toLowerCase().includes(q) || f.sigla.toLowerCase().includes(q) || f.carrerasPrincipales.some(c => c.toLowerCase().includes(q))) {
      results.push({ id: f.id, title: f.nombre, subtitle: `${f.sigla} · Rosario`, badge: f.sigla });
    }
  });

  const sliced = results.slice(0, 15);

  if (sliced.length === 0) {
    container.innerHTML = `<div style="padding: 2rem; text-align: center; color: var(--color-upl-crema-muted);">Sin resultados para "${query}".</div>`;
    return;
  }

  container.innerHTML = sliced.map(r => `
    <div class="ranked-card-entry" style="margin-bottom: 0.35rem; padding: 0.65rem 1rem;" onclick="selectSearchResult('${r.id}')">
      <div class="uni-sigla-badge" style="font-size: 0.72rem; padding: 0.25rem 0.5rem;">${r.badge}</div>
      <div class="ranked-info-col">
        <div class="ranked-name-main" style="font-size: 0.9rem;">${r.title}</div>
        <div class="ranked-geo-sub">${r.subtitle}</div>
      </div>
      <span style="color: var(--color-upl-amarillo); font-size: 0.8rem; font-weight: 700;">Ver Ficha →</span>
    </div>
  `).join('');
}

function selectSearchResult(id) {
  closeSearchModal();
  openDossierById(id);
}

// ==========================================
// TOASTS Y EVENTOS GLOBALES
// ==========================================
function showToastNotice(msg) {
  let toast = document.getElementById('toastNotice');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toastNotice';
    toast.style.cssText = 'position: fixed; bottom: 2rem; right: 2rem; z-index: 120; background: var(--color-upl-amarillo); color: #121833; font-family: var(--font-display); font-weight: 800; font-size: 0.9rem; padding: 0.75rem 1.4rem; border-radius: 999px; box-shadow: 0 8px 24px rgba(0,0,0,0.4); opacity: 0; transform: translateY(20px); transition: all 0.25s ease;';
    document.body.appendChild(toast);
  }
  toast.innerText = msg;
  toast.style.opacity = '1';
  toast.style.transform = 'translateY(0)';
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(20px)';
  }, 2500);
}

function initGlobalEvents() {
  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      openSearchModal();
    } else if (e.key === 'Escape') {
      closeDossierModal();
      closeSearchModal();
    }
  });
}
