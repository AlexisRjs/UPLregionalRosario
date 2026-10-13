/**
 * UPL AUDITORÍAS UNIVERSITARIAS — REGIONAL ROSARIO (SANTA FE / UNR / UTN)
 * Adaptación fiel al frontend oficial UPL:
 * Solo la provincia de Santa Fe en el mapa, zoom ampliado de Gran Rosario,
 * y contenido exclusivamente enfocado en las facultades de la UNR y la UTN.
 */

// Estado global de la aplicación
const AppState = {
  currentRoute: 'mapa', // 'mapa' | 'rankings' | 'propuestas'
  currentMetric: 'cohorte', // 'cohorte' | 'docentes' | 'costo' | 'ceroMaterias' | 'noDocentes' | 'extranjeros'
  currentScope: 'rosario', // 'rosario' | 'gran_rosario' | 'santafe'
  currency: 'ARS', // 'ARS' | 'USD'
  sortDirection: 'asc', // 'asc' (de peor a mejor) | 'desc' (de mejor a peor)
  showSedes: true,
  isSystemNumbersExpanded: true,
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
        return `$${(n / 1e9).toFixed(1)} mil M`;
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
  { id: 'utn_santafe', nombre: 'UTN Facultad Regional Santa Fe', sigla: 'UTN FRSF', ciudad: 'Santa Fe Capital', x: 454.80, y: 215.80, tieneFicha: true },
  { id: 'utn_rafaela', nombre: 'UTN Facultad Regional Rafaela', sigla: 'UTN FRRa', ciudad: 'Rafaela', x: 441.50, y: 209.10, tieneFicha: true },
  { id: 'utn_venado', nombre: 'UTN Facultad Regional Venado Tuerto', sigla: 'UTN FRVT', ciudad: 'Venado Tuerto', x: 443.00, y: 282.50, tieneFicha: true },
  { id: 'utn_reconquista', nombre: 'UTN Facultad Regional Reconquista', sigla: 'UTN FRRq', ciudad: 'Reconquista', x: 468.20, y: 168.50, tieneFicha: true }
];

// Universidades y Facultades de la Provincia de Santa Fe para el filtro provincial (+ UNL, UNRaf, UTN regionales)
const PROVINCIA_SANTA_FE_UNIS = [
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
    extranjeros: 2.1,
    estudiantes2024: 53120,
    egresados2024: 2640,
    direccion: 'Bv. Pellegrini 2750, Santa Fe Capital',
    sitio: 'https://www.unl.edu.ar',
    alerta: '44,5% de los inscriptos no aprueba materias en el año. La tasa de egreso a 6 años es del 29,8%.'
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
    extranjeros: 0.8,
    estudiantes2024: 6850,
    egresados2024: 215,
    direccion: 'Bv. Roca 989, Rafaela',
    sitio: 'https://www.unraf.edu.ar',
    alerta: 'Ratio de 42 cargos no docentes por cada 100 docentes en nómina activa.'
  },
  {
    id: 'utn_santafe',
    nombre: 'UTN Facultad Regional Santa Fe',
    sigla: 'UTN FRSF',
    ciudad: 'Santa Fe Capital',
    provincia: 'Santa Fe',
    polo: 'provincial',
    tasaCohorte: 32.5,
    docentes: 5.0,
    costo: 43100000,
    ceroMaterias: 35.8,
    noDocentes: 28,
    extranjeros: 0.5,
    estudiantes2024: 4920,
    egresados2024: 285,
    direccion: 'Lavaisse 610, Santa Fe Capital',
    sitio: 'https://www.frsf.utn.edu.ar',
    alerta: 'Mejor tasa de graduación en ingenierías de la capital provincial (32,5%).'
  },
  {
    id: 'utn_rafaela',
    nombre: 'UTN Facultad Regional Rafaela',
    sigla: 'UTN FRRa',
    ciudad: 'Rafaela',
    provincia: 'Santa Fe',
    polo: 'provincial',
    tasaCohorte: 33.1,
    docentes: 4.9,
    costo: 45800000,
    ceroMaterias: 34.2,
    noDocentes: 26,
    extranjeros: 0.4,
    estudiantes2024: 2450,
    egresados2024: 140,
    direccion: 'Acuña 49, Rafaela',
    sitio: 'https://www.frra.utn.edu.ar',
    alerta: 'Especializada en electromecánica y sistemas en la cuenca productiva santafesina.'
  },
  {
    id: 'utn_venado',
    nombre: 'UTN Facultad Regional Venado Tuerto',
    sigla: 'UTN FRVT',
    ciudad: 'Venado Tuerto',
    provincia: 'Santa Fe',
    polo: 'provincial',
    tasaCohorte: 29.4,
    docentes: 5.2,
    costo: 46500000,
    ceroMaterias: 38.1,
    noDocentes: 27,
    extranjeros: 0.3,
    estudiantes2024: 1820,
    egresados2024: 95,
    direccion: 'Castelli 501, Venado Tuerto',
    sitio: 'https://www.frvt.utn.edu.ar',
    alerta: 'Presencia universitaria en el nodo sur agroindustrial de la provincia.'
  },
  {
    id: 'utn_reconquista',
    nombre: 'UTN Facultad Regional Reconquista',
    sigla: 'UTN FRRq',
    ciudad: 'Reconquista',
    provincia: 'Santa Fe',
    polo: 'provincial',
    tasaCohorte: 27.8,
    docentes: 5.3,
    costo: 49200000,
    ceroMaterias: 39.5,
    noDocentes: 29,
    extranjeros: 0.2,
    estudiantes2024: 1410,
    egresados2024: 72,
    direccion: 'Calle 44 N° 1000, Reconquista',
    sitio: 'https://www.frrq.utn.edu.ar',
    alerta: 'Sede técnica universitaria para el norte santafesino.'
  }
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
      container.innerHTML = getRankingsPageTemplate();
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
// 1. VISTA DEL MAPA REGIONAL DE SANTA FE
// ==========================================
function getMapPageTemplate() {
  return `
    <div class="map-fullscreen-stage">
      <div class="map-dual-hero-layout">
        <!-- Columna Izquierda: Silueta limpia de Santa Fe (sin trazos externos) -->
        <div class="map-province-column">
          ${getSantaFeSVGElement()}
        </div>

        <!-- Columna Derecha: Inset Cuadrado Ampliado de Gran Rosario -->
        <div class="map-inset-column">
          ${getGranRosarioInsetSVG()}
        </div>
      </div>

      <!-- Tarjeta Flotante Inferior Izquierda -->
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

// SVG Vectorial Limpio de la Provincia de Santa Fe
function getSantaFeSVGElement() {
  const mapData = ARGENTINA_MAP;
  const santafe = (mapData && mapData.provincias) ? mapData.provincias.find(p => p.nombre === 'Santa Fe') : null;
  const santaFePath = santafe ? santafe.d : 'M434.77,156.7L429.17,210.73L433.69,215.25L426.16,237.64L435.62,269.6L414.06,301.06L434.55,300.39L453.49,281.12L460.81,284.57L465.76,274.66L457.15,267.99L454.57,241.51L477.39,215.25L476.74,209.44L478.9,182.1L484.71,179.08L488.58,157.77L491.6,158.42L492.24,154.54L434.77,156.7Z';

  // Pines de universidades de Santa Fe y Rosario (UNR & UTN)
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
      <!-- Silueta Oficial de Santa Fe: Trazo limpio y exacto -->
      <path 
        d="${santaFePath}" 
        class="santafe-shape" 
        id="santafe-province" 
      />

      <!-- Río Paraná: Borde oriental natural de la provincia (Limpio, continuo y sin sobresalir) -->
      <path 
        d="M 492.24,154.54 L 491.6,158.42 L 488.58,157.77 L 484.71,179.08 L 478.9,182.1 L 476.74,209.44 L 477.39,215.25 L 454.57,241.51 L 457.15,267.99 L 465.76,274.66 L 460.81,284.57" 
        fill="none" 
        stroke="rgba(143,183,255,0.75)" 
        stroke-width="1.8" 
        stroke-linecap="round" 
        stroke-linejoin="round"
      />
      <text x="473" y="246" fill="rgba(143,183,255,0.7)" font-size="3.2" font-family="'Inter', sans-serif" font-weight="700" letter-spacing="0.5" transform="rotate(78 473,246)">RÍO PARANÁ</text>

      <!-- Destacado del Departamento Rosario y Gran Rosario -->
      <circle cx="456.4" cy="267.6" r="6" fill="rgba(250,207,59,0.18)" stroke="rgba(250,207,59,0.5)" stroke-width="0.7" />

      <!-- Capa de Pines Universitarios -->
      <g id="pines-layer" style="${AppState.showSedes ? '' : 'display: none;'}">
        ${pines}
      </g>
    </svg>
  `;
}

// Inset Cuadrado Ampliado de Gran Rosario (Limpio, con río contenido y todas las 14 sedes)
function getGranRosarioInsetSVG() {
  return `
    <svg viewBox="0 0 460 480" class="inset-svg-canvas" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <!-- Clip para contener todo estrictamente dentro del card cuadrado sin sobresalir -->
        <clipPath id="squareCardClip">
          <rect x="4" y="4" width="452" height="472" rx="20" />
        </clipPath>
      </defs>

      <!-- Contenedor Base Cuadrado con bordes redondeados -->
      <rect x="4" y="4" width="452" height="472" rx="20" fill="rgba(24, 30, 60, 0.94)" stroke="rgba(255, 255, 249, 0.16)" stroke-width="1.5" />

      <g clip-path="url(#squareCardClip)">
        <!-- Franja Costera del Río Paraná contenida dentro del borde -->
        <path d="M 405,4 Q 425,140 415,250 Q 428,370 418,476 L 456,476 L 456,4 Z" fill="#1b2a52" opacity="0.7" />
        <path d="M 405,4 Q 425,140 415,250 Q 428,370 418,476" fill="none" stroke="rgba(143,183,255,0.4)" stroke-width="2.5" stroke-linecap="round" />
        <text x="435" y="240" fill="rgba(143,183,255,0.55)" font-size="8.5" font-family="'Inter', sans-serif" font-weight="700" letter-spacing="2" transform="rotate(90 435,240)">RÍO PARANÁ</text>

        <!-- Cabecera del Card -->
        <text x="210" y="28" text-anchor="middle" fill="#facf3b" font-family="'Baloo 2', sans-serif" font-size="13" font-weight="800" letter-spacing="0.5">POLO UNIVERSITARIO ROSARIO Y REGIÓN</text>
        <text x="210" y="43" text-anchor="middle" fill="rgba(255,255,249,0.6)" font-family="'Inter', sans-serif" font-size="8.5">12 Facultades UNR · Rectorado Central · UTN FRRo</text>

        <!-- 1. ZONA GRAN ROSARIO (Oeste) -->
        <rect x="14" y="56" width="108" height="376" rx="12" fill="rgba(36, 44, 80, 0.45)" stroke="rgba(228, 184, 98, 0.25)" />
        <text x="68" y="74" text-anchor="middle" fill="#e4b862" font-family="'Baloo 2', sans-serif" font-size="10" font-weight="800">GRAN ROSARIO</text>
        <text x="68" y="86" text-anchor="middle" fill="rgba(255,255,249,0.45)" font-size="7.5" font-family="'Inter', sans-serif">Ruta 33 / Oeste</text>

        <!-- FCA (Agrarias) Zavalla -->
        <g class="inset-node-group" onclick="openDossierById('agrarias')">
          <circle cx="68" cy="155" r="15" fill="#facf3b" stroke="#0b0d1c" stroke-width="2" />
          <text x="68" y="160" text-anchor="middle" fill="#121833" font-family="'Baloo 2', sans-serif" font-size="9" font-weight="800">FCA</text>
          <text x="68" y="184" text-anchor="middle" fill="#fffff9" font-size="8.5" font-weight="700" class="node-label">Cs. Agrarias</text>
          <text x="68" y="196" text-anchor="middle" fill="#e4b862" font-size="7.5">Zavalla</text>
          <title>Facultad de Ciencias Agrarias (UNR) — Zavalla</title>
        </g>

        <!-- FCV (Veterinarias) Casilda -->
        <g class="inset-node-group" onclick="openDossierById('veterinarias')">
          <circle cx="68" cy="285" r="15" fill="#facf3b" stroke="#0b0d1c" stroke-width="2" />
          <text x="68" y="290" text-anchor="middle" fill="#121833" font-family="'Baloo 2', sans-serif" font-size="9" font-weight="800">FCV</text>
          <text x="68" y="314" text-anchor="middle" fill="#fffff9" font-size="8.5" font-weight="700" class="node-label">Cs. Veterinarias</text>
          <text x="68" y="326" text-anchor="middle" fill="#e4b862" font-size="7.5">Casilda</text>
          <title>Facultad de Ciencias Veterinarias (UNR) — Casilda</title>
        </g>

        <!-- 2. ZONA POLO SALUD (Norte) -->
        <rect x="130" y="56" width="265" height="92" rx="12" fill="rgba(36, 44, 80, 0.45)" stroke="rgba(143, 183, 255, 0.28)" />
        <text x="142" y="73" fill="#8fb7ff" font-family="'Baloo 2', sans-serif" font-size="9.5" font-weight="800">POLO SALUD</text>
        <text x="215" y="73" fill="rgba(255,255,249,0.4)" font-size="7.5" font-family="'Inter', sans-serif">Santa Fe y Francia</text>

        <!-- FCM (Medicina) -->
        <g class="inset-node-group" onclick="openDossierById('medicina')">
          <circle cx="170" cy="106" r="14" fill="#facf3b" stroke="#0b0d1c" stroke-width="2" />
          <text x="170" y="111" text-anchor="middle" fill="#121833" font-family="'Baloo 2', sans-serif" font-size="8.5" font-weight="800">FCM</text>
          <text x="170" y="132" text-anchor="middle" fill="#fffff9" font-size="8" font-weight="700" class="node-label">Medicina</text>
          <title>Facultad de Ciencias Médicas (Santa Fe 3100)</title>
        </g>

        <!-- FBIOyF (Bioquímica) -->
        <g class="inset-node-group" onclick="openDossierById('bioquimicas')">
          <circle cx="262" cy="106" r="14" fill="#facf3b" stroke="#0b0d1c" stroke-width="2" />
          <text x="262" y="111" text-anchor="middle" fill="#121833" font-family="'Baloo 2', sans-serif" font-size="8" font-weight="800">FBIO</text>
          <text x="262" y="132" text-anchor="middle" fill="#fffff9" font-size="8" font-weight="700" class="node-label">Bioquímica</text>
          <title>Facultad de Cs. Bioquímicas y Farmacéuticas (Suipacha 531)</title>
        </g>

        <!-- FODONTO (Odontología) -->
        <g class="inset-node-group" onclick="openDossierById('odontologia')">
          <circle cx="355" cy="106" r="14" fill="#facf3b" stroke="#0b0d1c" stroke-width="2" />
          <text x="355" y="111" text-anchor="middle" fill="#121833" font-family="'Baloo 2', sans-serif" font-size="8" font-weight="800">ODO</text>
          <text x="355" y="132" text-anchor="middle" fill="#fffff9" font-size="8" font-weight="700" class="node-label">Odontología</text>
          <title>Facultad de Odontología (Santa Fe 3160)</title>
        </g>

        <!-- 3. ZONA POLO CENTRO & UTN -->
        <rect x="130" y="156" width="265" height="130" rx="12" fill="rgba(36, 44, 80, 0.45)" stroke="rgba(228, 184, 98, 0.28)" />
        <text x="142" y="173" fill="#e4b862" font-family="'Baloo 2', sans-serif" font-size="9.5" font-weight="800">POLO CENTRO & UTN</text>
        <text x="262" y="173" fill="rgba(255,255,249,0.4)" font-size="7.5" font-family="'Inter', sans-serif">Bv. Oroño / Zeballos</text>

        <!-- FDER (Derecho) -->
        <g class="inset-node-group" onclick="openDossierById('derecho')">
          <circle cx="170" cy="202" r="13" fill="#facf3b" stroke="#0b0d1c" stroke-width="1.8" />
          <text x="170" y="206" text-anchor="middle" fill="#121833" font-family="'Baloo 2', sans-serif" font-size="8" font-weight="800">FDER</text>
          <text x="170" y="226" text-anchor="middle" fill="#fffff9" font-size="8" font-weight="700" class="node-label">Derecho</text>
          <title>Facultad de Derecho (Córdoba 2020)</title>
        </g>

        <!-- FCEyE (Económicas) -->
        <g class="inset-node-group" onclick="openDossierById('economicas')">
          <circle cx="262" cy="202" r="13" fill="#facf3b" stroke="#0b0d1c" stroke-width="1.8" />
          <text x="262" y="206" text-anchor="middle" fill="#121833" font-family="'Baloo 2', sans-serif" font-size="7.5" font-weight="800">FCEyE</text>
          <text x="262" y="226" text-anchor="middle" fill="#fffff9" font-size="8" font-weight="700" class="node-label">Económicas</text>
          <title>Facultad de Cs. Económicas y Estadística (Bv. Oroño 1261)</title>
        </g>

        <!-- FHYA (Humanidades) -->
        <g class="inset-node-group" onclick="openDossierById('humanidades')">
          <circle cx="355" cy="202" r="13" fill="#facf3b" stroke="#0b0d1c" stroke-width="1.8" />
          <text x="355" y="206" text-anchor="middle" fill="#121833" font-family="'Baloo 2', sans-serif" font-size="8" font-weight="800">FHYA</text>
          <text x="355" y="226" text-anchor="middle" fill="#fffff9" font-size="8" font-weight="700" class="node-label">Humanidades</text>
          <title>Facultad de Humanidades y Artes (Entre Ríos 758)</title>
        </g>

        <!-- Rectorado UNR -->
        <g class="inset-node-group" onclick="openDossierById('rosario')">
          <circle cx="190" cy="256" r="12" fill="#facf3b" stroke="#0b0d1c" stroke-width="1.8" />
          <text x="190" y="260" text-anchor="middle" fill="#121833" font-family="'Baloo 2', sans-serif" font-size="7.5" font-weight="800">UNR</text>
          <text x="210" y="260" fill="#fffff9" font-size="8" font-weight="700" class="node-label">Rectorado Maipú</text>
          <title>Sede de Gobierno UNR (Maipú 1065)</title>
        </g>

        <!-- UTN FRRo -->
        <g class="inset-node-group" onclick="openDossierById('utn_rosario')">
          <circle cx="318" cy="256" r="14" fill="#8fd19e" stroke="#0b0d1c" stroke-width="2" />
          <text x="318" y="261" text-anchor="middle" fill="#0b0d1c" font-family="'Baloo 2', sans-serif" font-size="8" font-weight="800">UTN</text>
          <text x="340" y="260" fill="#8fd19e" font-size="8.5" font-weight="800" class="node-label">UTN FRRo</text>
          <title>UTN Facultad Regional Rosario (E. Zeballos 1341)</title>
        </g>

        <!-- 4. ZONA LA SIBERIA / CUR (Sur) -->
        <rect x="130" y="294" width="265" height="138" rx="12" fill="rgba(36, 44, 80, 0.45)" stroke="rgba(250, 207, 59, 0.28)" />
        <text x="142" y="311" fill="#facf3b" font-family="'Baloo 2', sans-serif" font-size="9.5" font-weight="800">LA SIBERIA (CUR)</text>
        <text x="245" y="311" fill="rgba(255,255,249,0.4)" font-size="7.5" font-family="'Inter', sans-serif">Riobamba y Berutti</text>

        <!-- FCEIA (Ingeniería) -->
        <g class="inset-node-group" onclick="openDossierById('ingenieria')">
          <circle cx="195" cy="342" r="13" fill="#facf3b" stroke="#0b0d1c" stroke-width="1.8" />
          <text x="195" y="346" text-anchor="middle" fill="#121833" font-family="'Baloo 2', sans-serif" font-size="7.5" font-weight="800">FCEIA</text>
          <text x="195" y="365" text-anchor="middle" fill="#fffff9" font-size="8" font-weight="700" class="node-label">Ingeniería</text>
          <title>Facultad de Cs. Exactas, Ingeniería y Agrimensura (Pellegrini 250 / CUR)</title>
        </g>

        <!-- FAPyD (Arquitectura) -->
        <g class="inset-node-group" onclick="openDossierById('arquitectura')">
          <circle cx="330" cy="342" r="13" fill="#facf3b" stroke="#0b0d1c" stroke-width="1.8" />
          <text x="330" y="346" text-anchor="middle" fill="#121833" font-family="'Baloo 2', sans-serif" font-size="7.5" font-weight="800">FAPyD</text>
          <text x="330" y="365" text-anchor="middle" fill="#fffff9" font-size="8" font-weight="700" class="node-label">Arquitectura</text>
          <title>Facultad de Arquitectura, Planeamiento y Diseño (CUR)</title>
        </g>

        <!-- FCPolit (Ciencia Política) -->
        <g class="inset-node-group" onclick="openDossierById('politica')">
          <circle cx="195" cy="392" r="13" fill="#facf3b" stroke="#0b0d1c" stroke-width="1.8" />
          <text x="195" y="396" text-anchor="middle" fill="#121833" font-family="'Baloo 2', sans-serif" font-size="7.5" font-weight="800">FCP</text>
          <text x="195" y="414" text-anchor="middle" fill="#fffff9" font-size="8" font-weight="700" class="node-label">Cs. Política</text>
          <title>Facultad de Ciencia Política y RR.II. (CUR)</title>
        </g>

        <!-- FPSICO (Psicología) -->
        <g class="inset-node-group" onclick="openDossierById('psicologia')">
          <circle cx="330" cy="392" r="13" fill="#facf3b" stroke="#0b0d1c" stroke-width="1.8" />
          <text x="330" y="396" text-anchor="middle" fill="#121833" font-family="'Baloo 2', sans-serif" font-size="8" font-weight="800">PSI</text>
          <text x="330" y="414" text-anchor="middle" fill="#fffff9" font-size="8" font-weight="700" class="node-label">Psicología</text>
          <title>Facultad de Psicología (CUR)</title>
        </g>

        <!-- Pie descriptivo -->
        <text x="210" y="456" text-anchor="middle" fill="rgba(255,255,249,0.5)" font-size="9" font-family="'Inter', sans-serif">Hacé clic en cualquier nodo para abrir su ficha de auditoría oficial</text>
      </g>
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
// 2. VISTA DE RANKINGS Y RESUMEN GENERAL
// ==========================================
function getRankingsPageTemplate() {
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
      <!-- Título de Página y Filtros de Ámbito Geográfico -->
      <div style="margin-bottom: 1.25rem;">
        <h1 class="k-page-title" style="margin-bottom: 0.35rem;">Rankings</h1>
        <p class="k-page-desc" style="margin-bottom: 1rem;">
          Auditoría comparativa de las facultades e instituciones cargadas de la región Rosario y la provincia de Santa Fe (UNR y UTN) con datos oficiales del Anuario de la SPU.
        </p>

        <!-- Filtros de Ámbito Geográfico Claros e Interactivos -->
        <div class="scope-pills-row" role="radiogroup" aria-label="Filtro de ámbito geográfico">
          <button class="scope-pill-btn ${AppState.currentScope === 'rosario' ? 'active' : ''}" onclick="setScopeFilter('rosario')">
            <span>📍</span> Región Rosario (UNR & UTN)
          </button>
          <button class="scope-pill-btn ${AppState.currentScope === 'gran_rosario' ? 'active' : ''}" onclick="setScopeFilter('gran_rosario')">
            <span>🌾</span> Gran Rosario (Zavalla / Casilda)
          </button>
          <button class="scope-pill-btn ${AppState.currentScope === 'santafe' ? 'active' : ''}" onclick="setScopeFilter('santafe')">
            <span>🏛️</span> Provincia de Santa Fe (+ UNL, UNRaf, UTN)
          </button>
        </div>
      </div>

      <!-- Card Oficial: EL SISTEMA EN NÚMEROS (Filtrado según las instituciones cargadas) -->
      ${(() => {
        const stats = getSystemNumbersData(AppState.currentScope);
        return `
        <div class="system-numbers-card">
          <div class="system-numbers-header">
            <div class="system-numbers-title">El sistema en números</div>
            <div class="system-numbers-meta">${stats.metaText}</div>
          </div>

          <!-- 4 Top KPIs Principales -->
          <div class="system-kpis-grid-4">
            <!-- KPI 1 -->
            <div class="system-kpi-col">
              <div class="system-kpi-label">NO SE RECIBE A TIEMPO</div>
              <div class="system-kpi-val coral">${stats.noSeRecibeNum} <span style="font-size: 1.1rem; font-weight: 700; color: rgba(255,255,249,0.85);">de cada 100</span></div>
              <div class="system-kpi-desc">${stats.noSeRecibeDesc}</div>
            </div>

            <!-- KPI 2 -->
            <div class="system-kpi-col">
              <div class="system-kpi-label">ESTUDIANTES SIN MATERIAS</div>
              <div class="system-kpi-val coral">${stats.sinMateriasNum}</div>
              <div class="system-kpi-desc">${stats.sinMateriasDesc}</div>
            </div>

            <!-- KPI 3 -->
            <div class="system-kpi-col">
              <div class="system-kpi-label gold">COSTO POR GRADUADO</div>
              <div class="system-kpi-val">${Formatters.currency(stats.costoGraduadoNum)}</div>
              <div class="system-kpi-desc">${stats.costoGraduadoDesc}</div>
            </div>

            <!-- KPI 4 -->
            <div class="system-kpi-col">
              <div class="system-kpi-label gold">ESTUDIANTES ACTIVOS POR DOCENTE</div>
              <div class="system-kpi-val">${stats.docentesNum}</div>
              <div class="system-kpi-desc">${stats.docentesDesc}</div>
            </div>
          </div>

          <!-- Botón Desplegable Ver menos / Ver más -->
          <div class="system-toggle-row" onclick="toggleSystemNumbers()">
            <span>${AppState.isSystemNumbersExpanded ? 'Ver menos ⌃' : 'Ver más ⌄'}</span>
          </div>

          <!-- Sección Desplegable con KPIs Secundarios y Gráficos -->
          ${AppState.isSystemNumbersExpanded ? `
            <div class="system-expandable-section">
              <!-- 3 KPIs Secundarios -->
              <div class="system-kpis-grid-3">
                <div class="chart-box-card">
                  <div class="system-kpi-label">GASTO EN ESTUDIANTES EXTRANJEROS</div>
                  <div class="system-kpi-val coral">${Formatters.currency(stats.extranjerosGasto)}</div>
                  <div class="system-kpi-desc">${stats.extranjerosDesc}</div>
                </div>

                <div class="chart-box-card">
                  <div class="system-kpi-label gold">INGRESANTES VS. EGRESADOS (2007–2024)</div>
                  <div class="system-kpi-val">${stats.ingresantesVsEgresados}</div>
                  <div class="system-kpi-desc">${stats.ingresantesVsEgresadosDesc}</div>
                </div>

                <div class="chart-box-card">
                  <div class="system-kpi-label gold">CARGOS DOCENTES SIMPLES VS. EXCLUSIVOS</div>
                  <div class="system-kpi-val">${stats.cargosDocentesVsHoras}</div>
                  <div class="system-kpi-desc">${stats.cargosDocentesDesc}</div>
                </div>
              </div>

              <!-- Gráficos de Evolución Temporal de la Región (SVG) -->
              <div class="system-charts-grid-2">
                <!-- Gráfico 1: Ingresantes -->
                <div class="chart-box-card">
                  <div class="chart-box-title">INGRESANTES NUEVOS POR AÑO (ROSARIO)</div>
                  <svg viewBox="0 0 460 145" style="width: 100%; height: auto;" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <linearGradient id="gradIngresantes" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stop-color="#8fb7ff" stop-opacity="0.35" />
                        <stop offset="100%" stop-color="#8fb7ff" stop-opacity="0" />
                      </linearGradient>
                    </defs>
                    <!-- Líneas de referencia Y -->
                    <line x1="35" y1="15" x2="445" y2="15" stroke="rgba(255,255,249,0.06)" stroke-width="1" />
                    <text x="5" y="18" fill="rgba(255,255,249,0.3)" font-size="7.5">25.000</text>
                    <line x1="35" y1="42" x2="445" y2="42" stroke="rgba(255,255,249,0.06)" stroke-width="1" />
                    <text x="5" y="45" fill="rgba(255,255,249,0.3)" font-size="7.5">18.750</text>
                    <line x1="35" y1="70" x2="445" y2="70" stroke="rgba(255,255,249,0.06)" stroke-width="1" />
                    <text x="5" y="73" fill="rgba(255,255,249,0.3)" font-size="7.5">12.500</text>
                    <line x1="35" y1="98" x2="445" y2="98" stroke="rgba(255,255,249,0.06)" stroke-width="1" />
                    <text x="5" y="101" fill="rgba(255,255,249,0.3)" font-size="7.5">6.250</text>
                    <line x1="35" y1="125" x2="445" y2="125" stroke="rgba(255,255,249,0.12)" stroke-width="1" />
                    <text x="25" y="128" fill="rgba(255,255,249,0.3)" font-size="7.5">0</text>

                    <!-- Área y Trazo -->
                    <polygon points="45,125 45,69 115,62 185,61 255,59 325,38 425,36 425,125" fill="url(#gradIngresantes)" />
                    <polyline points="45,69 115,62 185,61 255,59 325,38 425,36" fill="none" stroke="#8fb7ff" stroke-width="2.5" />

                    <!-- Nodos -->
                    <circle cx="45" cy="69" r="3.5" fill="#8fb7ff" />
                    <circle cx="115" cy="62" r="3" fill="#8fb7ff" />
                    <circle cx="185" cy="61" r="3" fill="#8fb7ff" />
                    <circle cx="255" cy="59" r="3" fill="#8fb7ff" />
                    <circle cx="325" cy="38" r="3.5" fill="#8fb7ff" />
                    <circle cx="425" cy="36" r="4" fill="#8fd19e" />

                    <!-- Badge 20.349 -->
                    <rect x="390" y="15" width="45" height="15" rx="4" fill="#1b2a52" stroke="#8fd19e" stroke-width="0.8" />
                    <text x="412" y="26" text-anchor="middle" fill="#8fd19e" font-size="7.5" font-weight="800">20.349</text>

                    <!-- Años -->
                    <text x="45" y="138" fill="rgba(255,255,249,0.4)" font-size="8">2007</text>
                    <text x="115" y="138" fill="rgba(255,255,249,0.4)" font-size="8">2010</text>
                    <text x="185" y="138" fill="rgba(255,255,249,0.4)" font-size="8">2013</text>
                    <text x="255" y="138" fill="rgba(255,255,249,0.4)" font-size="8">2016</text>
                    <text x="325" y="138" fill="rgba(255,255,249,0.4)" font-size="8">2019</text>
                    <text x="425" y="138" fill="rgba(255,255,249,0.4)" font-size="8">2024</text>
                  </svg>
                </div>

                <!-- Gráfico 2: Egresados -->
                <div class="chart-box-card">
                  <div class="chart-box-title">EGRESADOS POR AÑO (ROSARIO)</div>
                  <svg viewBox="0 0 460 145" style="width: 100%; height: auto;" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <linearGradient id="gradEgresados" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stop-color="#facf3b" stop-opacity="0.35" />
                        <stop offset="100%" stop-color="#facf3b" stop-opacity="0" />
                      </linearGradient>
                    </defs>
                    <!-- Líneas de referencia Y -->
                    <line x1="35" y1="15" x2="445" y2="15" stroke="rgba(255,255,249,0.06)" stroke-width="1" />
                    <text x="5" y="18" fill="rgba(255,255,249,0.3)" font-size="7.5">16.000</text>
                    <line x1="35" y1="42" x2="445" y2="42" stroke="rgba(255,255,249,0.06)" stroke-width="1" />
                    <text x="5" y="45" fill="rgba(255,255,249,0.3)" font-size="7.5">12.000</text>
                    <line x1="35" y1="70" x2="445" y2="70" stroke="rgba(255,255,249,0.06)" stroke-width="1" />
                    <text x="5" y="73" fill="rgba(255,255,249,0.3)" font-size="7.5">8.000</text>
                    <line x1="35" y1="98" x2="445" y2="98" stroke="rgba(255,255,249,0.06)" stroke-width="1" />
                    <text x="5" y="101" fill="rgba(255,255,249,0.3)" font-size="7.5">4.000</text>
                    <line x1="35" y1="125" x2="445" y2="125" stroke="rgba(255,255,249,0.12)" stroke-width="1" />
                    <text x="25" y="128" fill="rgba(255,255,249,0.3)" font-size="7.5">0</text>

                    <!-- Área y Trazo -->
                    <polygon points="45,125 45,99 115,91 185,56 255,59 325,26 425,96 425,125" fill="url(#gradEgresados)" />
                    <polyline points="45,99 115,91 185,56 255,59 325,26 425,96" fill="none" stroke="#facf3b" stroke-width="2.5" />

                    <!-- Nodos -->
                    <circle cx="45" cy="99" r="3.5" fill="#facf3b" />
                    <circle cx="115" cy="91" r="3" fill="#facf3b" />
                    <circle cx="185" cy="56" r="3.5" fill="#facf3b" />
                    <circle cx="255" cy="59" r="3" fill="#facf3b" />
                    <circle cx="325" cy="26" r="3.5" fill="#facf3b" />
                    <circle cx="425" cy="96" r="4" fill="#8fd19e" />

                    <!-- Badge 4.179 -->
                    <rect x="390" y="76" width="45" height="15" rx="4" fill="#1b2a52" stroke="#8fd19e" stroke-width="0.8" />
                    <text x="412" y="87" text-anchor="middle" fill="#8fd19e" font-size="7.5" font-weight="800">4.179</text>

                    <!-- Años -->
                    <text x="45" y="138" fill="rgba(255,255,249,0.4)" font-size="8">2007</text>
                    <text x="115" y="138" fill="rgba(255,255,249,0.4)" font-size="8">2010</text>
                    <text x="185" y="138" fill="rgba(255,255,249,0.4)" font-size="8">2013</text>
                    <text x="255" y="138" fill="rgba(255,255,249,0.4)" font-size="8">2016</text>
                    <text x="325" y="138" fill="rgba(255,255,249,0.4)" font-size="8">2019</text>
                    <text x="425" y="138" fill="rgba(255,255,249,0.4)" font-size="8">2024</text>
                  </svg>
                </div>
              </div>

              <div class="chart-box-caption">
                Datos oficiales de las facultades e instituciones cargadas en la región Rosario y la provincia de Santa Fe (Anuarios SPU y presupuestos auditados). Cada gráfico usa su propia escala para evidenciar la brecha entre ingresantes y egresados.
              </div>
            </div>
          ` : ''}
        </div>
        `;
      })()}

      <!-- Botones Píldora de Selección de Métricas -->
      <div class="metric-pills-selector-row">
        <button class="metric-pill-button ${AppState.currentMetric === 'cohorte' ? 'active' : ''}" onclick="selectRankingMetric('cohorte')">Tasa de cohorte (egreso)</button>
        <button class="metric-pill-button ${AppState.currentMetric === 'docentes' ? 'active' : ''}" onclick="selectRankingMetric('docentes')">Estudiantes activos por docente</button>
        <button class="metric-pill-button ${AppState.currentMetric === 'costo' ? 'active' : ''}" onclick="selectRankingMetric('costo')">Costo por graduado</button>
        <button class="metric-pill-button ${AppState.currentMetric === 'ceroMaterias' ? 'active' : ''}" onclick="selectRankingMetric('ceroMaterias')">Estudiantes sin materias</button>
        <button class="metric-pill-button ${AppState.currentMetric === 'noDocentes' ? 'active' : ''}" onclick="selectRankingMetric('noDocentes')">No docentes por docente</button>
        <button class="metric-pill-button ${AppState.currentMetric === 'extranjeros' ? 'active' : ''}" onclick="selectRankingMetric('extranjeros')">Gasto en extranjeros</button>
      </div>

      <!-- Subtítulo de Métrica y Botón de Ordenamiento -->
      <div class="ranking-meta-controls-bar">
        <div class="ranking-meta-info">${metricDescriptions[AppState.currentMetric] || ''}</div>

        <button class="sort-toggle-pill-btn" onclick="toggleSortDirection()">
          <span>⇅</span>
          <span>${AppState.sortDirection === 'asc' ? 'De peor a mejor' : 'De mejor a peor'}</span>
        </button>
      </div>

      <!-- Lista Vertical de Tarjetas Ranking -->
      <div class="ranked-cards-stack" id="rankedCardsStackContainer">
        <!-- Renderizado dinámico -->
      </div>
    </div>
  `;
}

function toggleSystemNumbers() {
  AppState.isSystemNumbersExpanded = !AppState.isSystemNumbersExpanded;
  renderCurrentRoute();
}

function getSystemNumbersData(scope) {
  if (scope === 'gran_rosario') {
    return {
      scopeTitle: 'Gran Rosario (Zavalla / Casilda + UTN)',
      metaText: '3 facultades e instituciones cargadas · 9.930 estudiantes · 598 egresados anuales',
      noSeRecibeNum: 70,
      noSeRecibeDesc: 'Egresados anuales sobre ingresantes: 30,1% de egreso promedio en Zavalla (FCA), Casilda (FCV) y UTN FRRo.',
      sinMateriasNum: '3.750',
      sinMateriasDesc: '37,8% de los inscriptos en las facultades del Gran Rosario no aprobó ninguna materia en todo el año.',
      costoGraduadoNum: 53180000,
      costoGraduadoDesc: 'Promedio ponderado por egresados en Agrarias, Veterinarias y UTN Regional Rosario.',
      docentesNum: '3,7 x 1',
      docentesDesc: 'Estudiantes activos por cargo docente en las sedes regionales del Gran Rosario.',
      extranjerosGasto: 165000000,
      extranjerosDesc: '107 estudiantes extranjeros en las sedes del Gran Rosario (1,1% del padrón regional).',
      ingresantesVsEgresados: '+34% vs. +8%',
      ingresantesVsEgresadosDesc: 'Ingresantes: 1.120 → 1.505.<br>Egresados: 554 → 598 en las sedes regionales.',
      cargosDocentesVsHoras: '+11% vs. +3%',
      cargosDocentesDesc: 'Cargos simples: ▲ +58; cargos exclusivos: ▲ +6 en las facultades regionales.'
    };
  } else if (scope === 'santafe') {
    return {
      scopeTitle: 'Provincia de Santa Fe',
      metaText: '19 facultades e instituciones cargadas · 181.420 estudiantes · 7.991 egresados anuales',
      noSeRecibeNum: 73,
      noSeRecibeDesc: 'Egresados anuales sobre ingresantes: 26,8% de egreso promedio ponderado provincial (UNR, UNL, UNRaf y facultades de la UTN).',
      sinMateriasNum: '85.550',
      sinMateriasDesc: '47,2% de los inscriptos en las universidades nacionales de Santa Fe no aprobó ninguna materia en el año.',
      costoGraduadoNum: 56500000,
      costoGraduadoDesc: 'Promedio ponderado provincial por egresado entre UNR, UNL, UNRaf y sedes regionales UTN.',
      docentesNum: '7,5 x 1',
      docentesDesc: 'Estudiantes activos por cargo docente en las universidades públicas de la provincia.',
      extranjerosGasto: 10415000000,
      extranjerosDesc: '6.740 estudiantes extranjeros no residentes en las universidades de la provincia de Santa Fe.',
      ingresantesVsEgresados: '+62% vs. +19%',
      ingresantesVsEgresadosDesc: 'Ingresantes Santa Fe: 21.400 → 34.680.<br>Egresados: 6.710 → 7.991 en toda la provincia.',
      cargosDocentesVsHoras: '+15% vs. +4%',
      cargosDocentesDesc: 'Crecimiento de cargos simples frente a cargos con dedicación exclusiva en la provincia.'
    };
  } else {
    // Por defecto: 'rosario'
    return {
      scopeTitle: 'Región Rosario (UNR & UTN)',
      metaText: '13 facultades e instituciones cargadas · 110.850 estudiantes · 4.544 egresados anuales',
      noSeRecibeNum: 75,
      noSeRecibeDesc: 'Egresados anuales sobre ingresantes: 24,8% de egreso promedio en las facultades de Rosario (24,7% en UNR, 31,0% en UTN FRRo).',
      sinMateriasNum: '54.830',
      sinMateriasDesc: '49,5% de los inscriptos de las facultades cargadas de Rosario no aprobó ninguna materia en el año (52,7% en UNR).',
      costoGraduadoNum: 63015000,
      costoGraduadoDesc: 'Promedio ponderado por egresados de las facultades de Rosario ($61,5M en UNR, $44,2M en UTN FRRo).',
      docentesNum: '4,4 x 1',
      docentesDesc: 'Estudiantes que aprobaron al menos una materia por cada cargo docente en las facultades de Rosario.',
      extranjerosGasto: 10408000000,
      extranjerosDesc: '6.736 estudiantes extranjeros no residentes en las facultades de Rosario (6,1% de la matrícula total). Es lo que absorbe el presupuesto público.',
      ingresantesVsEgresados: '+50% vs. +11%',
      ingresantesVsEgresadosDesc: 'Ingresantes en Rosario: 13.595 → 20.349.<br>Egresados en Rosario: 3.765 → 4.179.',
      cargosDocentesVsHoras: '+13% vs. +4%',
      cargosDocentesDesc: '2017–2023 en UNR. Cargos con dedicación simple: ▲ +891; cargos con dedicación exclusiva: ▲ +46.'
    };
  }
}

function setScopeFilter(scope) {
  AppState.currentScope = scope;
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

function getRankingMetricValue(item, metric) {
  if (metric === 'cohorte') return Number(item.tasaCohorte || 0);
  if (metric === 'docentes') return Number(item.docentes || 0);
  if (metric === 'costo') return Number(item.costo || 0);
  if (metric === 'ceroMaterias') return Number(item.ceroMaterias || 0);
  if (metric === 'noDocentes') return Number(item.noDocentes || 0);
  if (metric === 'extranjeros') return Number(item.extranjeros || 0);
  return 0;
}

function compareForRanking(a, b, metric, direction) {
  const valA = getRankingMetricValue(a, metric);
  const valB = getRankingMetricValue(b, metric);

  // En 'cohorte': un porcentaje mayor es MEJOR (más estudiantes que logran recibirse)
  // En 'ceroMaterias', 'costo', 'docentes', 'noDocentes', 'extranjeros': un número mayor es PEOR
  const higherIsBetter = (metric === 'cohorte');

  if (direction === 'asc') {
    // "De peor a mejor": el PEOR va primero (#1)
    return higherIsBetter ? valA - valB : valB - valA;
  } else {
    // "De mejor a peor": el MEJOR va primero (#1)
    return higherIsBetter ? valB - valA : valA - valB;
  }
}

function initRankingsView() {
  renderRankedCardsList();
}

function renderRankedCardsList() {
  const container = document.getElementById('rankedCardsStackContainer');
  if (!container) return;

  // Dataset base con las 13 facultades e instituciones del polo Rosario (UNR + UTN FRRo)
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
    alerta: f.alerta,
    estudiantes2024: f.estudiantes2024 || f.estudiantes,
    egresados2024: f.egresados2024 || f.egresados,
    direccion: f.direccion,
    sitio: f.sitio
  }));

  // Filtro según ámbito seleccionado:
  if (AppState.currentScope === 'gran_rosario') {
    // Sedes ubicadas en Gran Rosario (Zavalla y Casilda) + UTN FRRo para benchmarking
    dataset = dataset.filter(f => f.polo === 'regional' || f.id === 'utn_rosario');
  } else if (AppState.currentScope === 'santafe') {
    // Toda la provincia: Rosario + UNL + UNRaf + sedes UTN provinciales
    dataset = dataset.concat(PROVINCIA_SANTA_FE_UNIS);
  }

  // Ordenamiento con la función de comparación por dirección y métrica
  const m = AppState.currentMetric;
  dataset.sort((a, b) => compareForRanking(a, b, m, AppState.sortDirection));

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
// 3. VISTA DE PROPUESTAS (Exacta a Screenshot 2)
// ==========================================
function getPropuestasPageTemplate() {
  const props = UPL_DATA.propuestas;
  const avanzar = UPL_DATA.avanzar;

  return `
    <div class="rankings-page-layout">
      <h1 class="k-page-title">Qué proponemos</h1>
      <p class="k-page-desc">
        No estamos en contra de financiar la universidad pública: estamos en contra de financiarla a ciegas. Cuatro propuestas de Universitarios por la Libertad y una apuesta central, cada una con el dato que la justifica.
      </p>

      <!-- Lista de Propuestas Numeradas (Idéntica a Captura 2) -->
      <div style="display: flex; flex-direction: column; gap: 1.25rem; margin-bottom: 2.5rem;">
        ${props.map((p, idx) => `
          <div class="glass" style="padding: 1.75rem 2rem; border-radius: var(--radius-md); display: flex; gap: 1.5rem; align-items: flex-start;">
            <div style="font-family: var(--font-display); font-weight: 800; font-size: 3.2rem; color: var(--color-upl-amarillo); line-height: 1; min-width: 45px;">
              ${idx + 1}
            </div>
            <div style="flex: 1;">
              <h2 style="font-family: var(--font-display); font-weight: 700; font-size: 1.25rem; color: #fffff9; margin-bottom: 0.45rem;">${p.titulo}</h2>
              <p style="color: var(--color-upl-crema-muted); font-size: 0.92rem; line-height: 1.55; margin-bottom: 0.85rem;">${p.detalle}</p>
              <div style="background: rgba(226, 87, 76, 0.10); border: 1px solid rgba(226, 87, 76, 0.35); padding: 0.75rem 1rem; border-radius: 10px; font-size: 0.85rem; color: var(--color-upl-crema);">
                <strong style="color: var(--color-danger-soft);">Por qué: </strong>${p.datoRosario}
                <a href="#/rankings" style="color: var(--color-upl-amarillo); text-decoration: underline; margin-left: 0.5rem; font-weight: 600;">Ver el ranking de egreso →</a>
              </div>
            </div>
          </div>
        `).join('')}
      </div>

      <!-- Tarjeta AvanzAR -->
      <div class="glass-strong" style="padding: 2rem; border-radius: var(--radius-lg); border: 2px solid rgba(250, 207, 59, 0.4);">
        <div style="display: flex; align-items: center; justify-content: space-between; gap: 1rem; margin-bottom: 1rem; flex-wrap: wrap;">
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
    if (!item && typeof PROVINCIA_SANTA_FE_UNIS !== 'undefined') {
      item = PROVINCIA_SANTA_FE_UNIS.find(u => u.id === id);
    }
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
    if (!q || f.nombre.toLowerCase().includes(q) || f.sigla.toLowerCase().includes(q) || (f.carrerasPrincipales && f.carrerasPrincipales.some(c => c.toLowerCase().includes(q)))) {
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
