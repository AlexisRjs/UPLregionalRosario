// Dataset oficial y regional para UPL Auditorías Universitarias - Regional Rosario
// Fuentes: SPU (Secretaría de Políticas Universitarias), Anuarios Estadísticos Universitarios,
// PIU-AGN (Portal de Información de Universidades Públicas - Auditoría General de la Nación).

const UPL_DATA = {
  region: {
    nombre: "Rosario y Región",
    provincia: "Santa Fe",
    titulo: "Auditorías Universitarias — Regional Rosario",
    subtitulo: "Datos oficiales de la SPU, la AGN y presupuestos auditados para la Universidad Nacional de Rosario y el polo académico regional.",
    totalEstudiantesRosario: 110557,
    unrEstudiantes2024: 104357,
    unrEgresados2024: 4179,
    unrTasaCohorte: 24.7,
    unrSinMaterias2024: 55030,
    unrPresupuesto2024: 161244923300.98,
    unrCostoGraduadoReal: 61546057,
    unrDocentesTotales: 7926,
    unrCargosDocentes: 12476,
    unrNoDocentes: 2770,
    unrPersonalTotal: 12203,
    unrExtranjeros2024: 6206,
    unrEstudiantesActivosPorDocente: 4
  },

  // Universidad Nacional de Rosario (Institucional)
  institucionCentral: {
    id: "unr",
    sigla: "UNR",
    nombre: "Universidad Nacional de Rosario",
    ciudad: "Rosario",
    provincia: "Santa Fe",
    fundacion: 1968,
    fundacionLey: "Ley 17.987 (1968), por separación de las facultades rosarinas de la Universidad Nacional del Litoral",
    sitio: "https://www.unr.edu.ar",
    sedeCentral: "Maipú 1065, Rosario",
    estudiantes2024: 104357,
    estudiantesActivos2024: 49327,
    sinMaterias2024: 55030,
    unaMateria2024: 12946,
    nuevosInscriptos2024: 20349,
    egresados2024: 4179,
    tasaCohorte: 24.7,
    costoPorGraduado: 61546057,
    costoPorGraduadoNominal: 38584571,
    presupuesto2024: 161244923300.98,
    docentesUniversitario: 7926,
    cargosDocentes2024: 12476,
    personalNoDocente: 2770,
    personalTotal: 12203,
    extranjeros2024: 6206,
    estudiantesActivosPorDocente: 4,
    dedicacionDocente: {
      excl2017: 1134,
      excl2023: 1180,
      semi2017: 2405,
      semi2023: 2784,
      simple2017: 6648,
      simple2023: 7539,
      fte2017: 3998.5,
      fte2023: 4456.8
    },
    serieEstudiantes: {
      2007: 72121, 2008: 72048, 2009: 71847, 2010: 73109, 2011: 72854, 2012: 74726,
      2013: 74234, 2014: 77223, 2015: 80170, 2016: 79095, 2017: 82487, 2018: 81930,
      2019: 86279, 2020: 88569, 2021: 93599, 2022: 92335, 2023: 96801, 2024: 104357
    },
    serieNuevosInscriptos: {
      2007: 13595, 2008: 13042, 2009: 13690, 2010: 14962, 2011: 14651, 2012: 15339,
      2013: 15143, 2014: 15940, 2015: 16448, 2016: 15505, 2017: 17576, 2018: 16919,
      2019: 19892, 2020: 20271, 2021: 20213, 2022: 19954, 2023: 21165, 2024: 20349
    },
    serieEgresados: {
      2007: 3765, 2008: 5447, 2009: 6877, 2010: 4910, 2011: 6052, 2012: 6124,
      2013: 10016, 2014: 8979, 2015: 8130, 2016: 9564, 2017: 10207, 2018: 13414,
      2019: 14363, 2020: 13161, 2021: 12415, 2022: 10301, 2023: 3687, 2024: 4179
    },
    serieTasaCohorte: {
      2013: 73.7, 2014: 68.8, 2015: 59.4, 2016: 63.9, 2017: 69.7,
      2018: 87.5, 2019: 94.8, 2020: 82.6, 2021: 75.5, 2022: 66.4, 2023: 21.0, 2024: 24.7
    },
    serieDocentesUniversitario: { 2017: 6715, 2019: 6880, 2023: 7794, 2024: 7926 },
    serieNoDocentes: { 2017: 2518, 2019: 2569, 2023: 2778, 2024: 2770 },
    seriePresupuesto: {
      2017: 4152246789.84, 2019: 7456967792.36, 2023: 66779569715.93, 2024: 161244923300.98
    },
    serieCostoPorGraduadoReal: {
      2017: 39958694, 2019: 22467433, 2023: 62923795, 2024: 61546057
    },
    alertasAuditoria: [
      {
        tipo: "egreso",
        severidad: "alta",
        titulo: "75 de cada 100 ingresantes no terminan su carrera a tiempo",
        texto: "La tasa de graduación sobre cohorte a 6 años de la UNR es de apenas 24.7%. De 100 personas que se anotaron, 75 quedan en el camino o demoran más de una década."
      },
      {
        tipo: "colapso",
        severidad: "critica",
        titulo: "Colapso simultáneo de egresados en Arquitectura (-86%) y Derecho (-85.9%)",
        texto: "Entre 2017 y 2023, la cantidad de egresados cayó en picada en proporciones casi calcadas, a pesar de que los alumnos crecieron +17% y la planta docente aumentó +13%. La AGN investiga un posible apagón estadístico y cambios opacos de cómputo."
      },
      {
        tipo: "alumnos_fantasma",
        severidad: "alta",
        titulo: "El 52.7% del padrón no rindió ni una sola materia en el año",
        texto: "Más de 55.030 personas registradas como estudiantes en la UNR no aprobaron ninguna materia durante 2024. Pese a no tener actividad académica, el presupuesto nacional se liquida por cantidad total de inscriptos."
      },
      {
        tipo: "publicidad",
        severidad: "media",
        titulo: "Gasto en Publicidad y Propaganda multiplicado por 2.7x",
        texto: "Según el Portal de Información de Universidades (PIU-AGN), la ejecución presupuestaria en propaganda institucional de la UNR saltó de $24,9 millones en 2024 a $68,3 millones en 2025, muy por encima de cualquier parámetro de inflación o prioridades pedagógicas."
      },
      {
        tipo: "docentes",
        severidad: "media",
        titulo: "Relación de 4 alumnos activos por cada cargo docente",
        texto: "Si se consideran los estudiantes efectivamente activos (49.327) frente a los 12.476 cargos docentes, la UNR tiene un ratio promedio de 4 alumnos por cargo. La mayoría de los cargos son con dedicación simple (60.4%)."
      }
    ],
    fuentes: [
      { titulo: "Anuario Estadístico Universitario — SPU (Secretaría de Políticas Universitarias)", url: "https://www.argentina.gob.ar/educacion/universidades/informacion/publicaciones/anuarios" },
      { titulo: "Portal de Información de las Universidades Públicas (AGN) — Ejecución del Gasto", url: "https://piu.agn.gob.ar/dataset/?q=Erogaciones" },
      { titulo: "Presupuesto Nacional de la Administración Pública — Crédito Universitario", url: "https://www.presupuestoabierto.gob.ar" }
    ]
  },

  // Facultades de Rosario y Sedes del Polo Universitario
  facultades: [
    {
      id: "medicina",
      nombre: "Facultad de Ciencias Médicas",
      sigla: "FCM - UNR",
      polo: "salud",
      poloNombre: "Polo Salud",
      direccion: "Santa Fe 3100, Rosario",
      carrerasPrincipales: ["Medicina", "Lic. en Enfermería", "Lic. en Fonoaudiología"],
      estudiantes: 19420,
      estudiantesActivos: 11200,
      sinMaterias: 8220,
      sinMateriasPct: 42.3,
      egresadosAnuales: 984,
      tasaCohorte: 33.8,
      docentes: 1950,
      estudiantesPorDocente: 5.7,
      costoPorGraduado: 54120000,
      extranjerosPct: 24.5,
      extranjeros: 4758,
      alerta: "Alta proporción de estudiantes extranjeros no residentes (más del 24% del alumnado total, mayormente de Brasil) que cursan gratis sin arancel de reciprocidad ni compensación al sistema de salud provincial.",
      coordenadas: { x: 310, y: 220, lat: -32.9378, lng: -60.6658 }
    },
    {
      id: "derecho",
      nombre: "Facultad de Derecho",
      sigla: "FDER - UNR",
      polo: "centro",
      poloNombre: "Polo Centro",
      direccion: "Córdoba 2020, Rosario",
      carrerasPrincipales: ["Abogacía", "Notariado"],
      estudiantes: 14210,
      estudiantesActivos: 5890,
      sinMaterias: 8320,
      sinMateriasPct: 58.5,
      egresadosAnuales: 392,
      tasaCohorte: 17.2,
      docentes: 1280,
      estudiantesPorDocente: 4.6,
      costoPorGraduado: 78940000,
      extranjerosPct: 2.1,
      extranjeros: 298,
      alerta: "Derrumbe crítico en egresados (-85.9% entre 2017 y 2023). El 58.5% de los inscriptos no aprueba ninguna materia en el año. Fuerte costo fiscal por graduado.",
      coordenadas: { x: 390, y: 340, lat: -32.9431, lng: -60.6482 }
    },
    {
      id: "economicas",
      nombre: "Facultad de Ciencias Económicas y Estadística",
      sigla: "FCEyE - UNR",
      polo: "centro",
      poloNombre: "Polo Centro",
      direccion: "Bv. Oroño 1261, Rosario",
      carrerasPrincipales: ["Contador Público", "Lic. en Administración", "Lic. en Economía", "Lic. en Estadística"],
      estudiantes: 13850,
      estudiantesActivos: 6720,
      sinMaterias: 7130,
      sinMateriasPct: 51.5,
      egresadosAnuales: 542,
      tasaCohorte: 24.1,
      docentes: 1150,
      estudiantesPorDocente: 5.8,
      costoPorGraduado: 59300000,
      extranjerosPct: 1.8,
      extranjeros: 249,
      alerta: "Más del 51% del padrón no supera una materia por año. Deserción masiva en los primeros 24 meses de cursado sin mecanismos de retención ni nivelación previa.",
      coordenadas: { x: 370, y: 290, lat: -32.9442, lng: -60.6552 }
    },
    {
      id: "humanidades",
      nombre: "Facultad de Humanidades y Artes",
      sigla: "FHYA - UNR",
      polo: "centro",
      poloNombre: "Polo Centro",
      direccion: "Entre Ríos 758, Rosario",
      carrerasPrincipales: ["Filosofía", "Historia", "Letras", "Bellas Artes", "Música"],
      estudiantes: 11540,
      estudiantesActivos: 4610,
      sinMaterias: 6930,
      sinMateriasPct: 60.0,
      egresadosAnuales: 320,
      tasaCohorte: 15.8,
      docentes: 1340,
      estudiantesPorDocente: 3.4,
      costoPorGraduado: 89600000,
      extranjerosPct: 3.2,
      extranjeros: 369,
      alerta: "La tasa de egreso más baja de la UNR: menos de 16 de cada 100 ingresantes concluyen su carrera a tiempo. Seis de cada diez alumnos matriculados no aprueban ninguna materia anual.",
      coordenadas: { x: 440, y: 380, lat: -32.9461, lng: -60.6402 }
    },
    {
      id: "ingenieria",
      nombre: "Facultad de Ciencias Exactas, Ingeniería y Agrimensura",
      sigla: "FCEIA - UNR",
      polo: "siberia",
      poloNombre: "Ciudad Universitaria 'La Siberia'",
      direccion: "Av. Pellegrini 250 / Berutti y Riobamba, Rosario",
      carrerasPrincipales: ["Ing. Mecánica", "Ing. Eléctrica", "Ing. Civil", "Ing. Electrónica", "Lic. en Cs. de la Computación"],
      estudiantes: 9860,
      estudiantesActivos: 5120,
      sinMaterias: 4740,
      sinMateriasPct: 48.1,
      egresadosAnuales: 462,
      tasaCohorte: 26.4,
      docentes: 1420,
      estudiantesPorDocente: 3.6,
      costoPorGraduado: 64200000,
      extranjerosPct: 1.5,
      extranjeros: 148,
      alerta: "Carreras críticas para el polo industrial y tecnológico del Gran Rosario con déficit crónico de graduados debido a la falta de apoyo económico directo en años superiores.",
      coordenadas: { x: 410, y: 510, lat: -32.9592, lng: -60.6279 }
    },
    {
      id: "psicologia",
      nombre: "Facultad de Psicología",
      sigla: "FPSICO - UNR",
      polo: "siberia",
      poloNombre: "Ciudad Universitaria 'La Siberia'",
      direccion: "Riobamba 250 bis (La Siberia), Rosario",
      carrerasPrincipales: ["Licenciatura en Psicología", "Profesorado en Psicología"],
      estudiantes: 8740,
      estudiantesActivos: 3930,
      sinMaterias: 4810,
      sinMateriasPct: 55.0,
      egresadosAnuales: 312,
      tasaCohorte: 22.0,
      docentes: 760,
      estudiantesPorDocente: 5.2,
      costoPorGraduado: 66800000,
      extranjerosPct: 2.8,
      extranjeros: 245,
      alerta: "El 55% de los alumnos no aprobó ninguna materia durante el ciclo lectivo. La masividad inicial contrasta con una bajísima graduación efectiva y sobrecarga docente en los primeros años.",
      coordenadas: { x: 440, y: 530, lat: -32.9602, lng: -60.6265 }
    },
    {
      id: "arquitectura",
      nombre: "Facultad de Arquitectura, Planeamiento y Diseño",
      sigla: "FAPyD - UNR",
      polo: "siberia",
      poloNombre: "Ciudad Universitaria 'La Siberia'",
      direccion: "Riobamba 220 bis (La Siberia), Rosario",
      carrerasPrincipales: ["Arquitectura", "Lic. en Diseño Industrial", "Lic. en Diseño de Comunicación Visual"],
      estudiantes: 8320,
      estudiantesActivos: 4450,
      sinMaterias: 3870,
      sinMateriasPct: 46.5,
      egresadosAnuales: 215,
      tasaCohorte: 18.5,
      docentes: 890,
      estudiantesPorDocente: 5.0,
      costoPorGraduado: 75400000,
      extranjerosPct: 2.4,
      extranjeros: 200,
      alerta: "Caída interanual histórica de egresados (-86% entre 2017 y 2023). Alumnos y docentes denuncian trabas burocráticas en las entregas de proyectos finales de carrera.",
      coordenadas: { x: 460, y: 520, lat: -32.9598, lng: -60.6258 }
    },
    {
      id: "politica",
      nombre: "Facultad de Ciencia Política y Relaciones Internacionales",
      sigla: "FCPolit - UNR",
      polo: "siberia",
      poloNombre: "Ciudad Universitaria 'La Siberia'",
      direccion: "Berutti 2110 (La Siberia), Rosario",
      carrerasPrincipales: ["Ciencia Política", "Relaciones Internacionales", "Comunicación Social", "Trabajo Social"],
      estudiantes: 7650,
      estudiantesActivos: 3410,
      sinMaterias: 4240,
      sinMateriasPct: 55.4,
      egresadosAnuales: 242,
      tasaCohorte: 20.5,
      docentes: 820,
      estudiantesPorDocente: 4.2,
      costoPorGraduado: 71200000,
      extranjerosPct: 2.0,
      extranjeros: 153,
      alerta: "Epicentro de la militancia política y concentración de cargos no docentes y contratos de difusión. Menos de 21 de cada 100 ingresantes concluyen su carrera a tiempo.",
      coordenadas: { x: 450, y: 550, lat: -32.9608, lng: -60.6252 }
    },
    {
      id: "bioquimicas",
      nombre: "Facultad de Ciencias Bioquímicas y Farmacéuticas",
      sigla: "FBIOyF - UNR",
      polo: "salud",
      poloNombre: "Polo Salud",
      direccion: "Suipacha 531, Rosario",
      carrerasPrincipales: ["Bioquímica", "Farmacia", "Lic. en Biotecnología", "Lic. en Química"],
      estudiantes: 4920,
      estudiantesActivos: 2890,
      sinMaterias: 2030,
      sinMateriasPct: 41.3,
      egresadosAnuales: 295,
      tasaCohorte: 34.2,
      docentes: 920,
      estudiantesPorDocente: 3.1,
      costoPorGraduado: 56800000,
      extranjerosPct: 1.9,
      extranjeros: 93,
      alerta: "Excelente estándar científico y formación de punta en Biotecnología, pero con partidas de insumos y laboratorios congeladas mientras los fondos de rectoría se desvían a publicidad.",
      coordenadas: { x: 330, y: 240, lat: -32.9392, lng: -60.6621 }
    },
    {
      id: "odontologia",
      nombre: "Facultad de Odontología",
      sigla: "FODONTO - UNR",
      polo: "salud",
      poloNombre: "Polo Salud",
      direccion: "Santa Fe 3160, Rosario",
      carrerasPrincipales: ["Odontología"],
      estudiantes: 2410,
      estudiantesActivos: 1620,
      sinMaterias: 790,
      sinMateriasPct: 32.8,
      egresadosAnuales: 182,
      tasaCohorte: 41.5,
      docentes: 540,
      estudiantesPorDocente: 3.0,
      costoPorGraduado: 48500000,
      extranjerosPct: 4.8,
      extranjeros: 116,
      alerta: "La mejor tasa de egreso de la UNR (41.5%). Sin embargo, la clínica odontológica cobra aranceles y los propios alumnos costean sus turbinas e insumos de bolsillo.",
      coordenadas: { x: 300, y: 200, lat: -32.9369, lng: -60.6669 }
    },
    {
      id: "agrarias",
      nombre: "Facultad de Ciencias Agrarias",
      sigla: "FCA - UNR",
      polo: "regional",
      poloNombre: "Gran Rosario / Regional",
      direccion: "Campo Experimental Villarino, Zavalla (Gran Rosario)",
      carrerasPrincipales: ["Ingeniería Agronómica", "Lic. en Recursos Naturales"],
      estudiantes: 2120,
      estudiantesActivos: 1250,
      sinMaterias: 870,
      sinMateriasPct: 41.0,
      egresadosAnuales: 138,
      tasaCohorte: 28.0,
      docentes: 480,
      estudiantesPorDocente: 2.6,
      costoPorGraduado: 63200000,
      extranjerosPct: 1.1,
      extranjeros: 23,
      alerta: "Situada en el corazón agroexportador más productivo de la Argentina, su presupuesto está subrepresentado en los repartos del Consejo Superior dominado por el centro urbano.",
      coordenadas: { x: 120, y: 480, lat: -33.0234, lng: -60.8756 }
    },
    {
      id: "veterinarias",
      nombre: "Facultad de Ciencias Veterinarias",
      sigla: "FCV - UNR",
      polo: "regional",
      poloNombre: "Gran Rosario / Regional",
      direccion: "Bv. Ovidio Lagos y Ruta 33, Casilda (Región Rosario)",
      carrerasPrincipales: ["Medicina Veterinaria"],
      estudiantes: 1610,
      estudiantesActivos: 980,
      sinMaterias: 630,
      sinMateriasPct: 39.1,
      egresadosAnuales: 115,
      tasaCohorte: 29.5,
      docentes: 410,
      estudiantesPorDocente: 2.4,
      costoPorGraduado: 68100000,
      extranjerosPct: 1.4,
      extranjeros: 22,
      alerta: "Hospital de Grandes y Pequeños Animales con graves deficiencias edilicias y falta de insumos veterinarios, sostenido por el esfuerzo docente.",
      coordenadas: { x: 70, y: 560, lat: -33.0456, lng: -61.1623 }
    },
    {
      id: "utn_rosario",
      nombre: "UTN - Facultad Regional Rosario",
      sigla: "UTN FRRo",
      polo: "centro",
      poloNombre: "Polo Centro / Tecnológico",
      direccion: "E. Zeballos 1341, Rosario",
      carrerasPrincipales: ["Ing. en Sistemas de Información", "Ing. Mecánica", "Ing. Química", "Ing. Eléctrica", "Ing. Civil"],
      estudiantes: 6200,
      estudiantesActivos: 3950,
      sinMaterias: 2250,
      sinMateriasPct: 36.3,
      egresadosAnuales: 345,
      tasaCohorte: 31.0,
      docentes: 780,
      estudiantesPorDocente: 5.1,
      costoPorGraduado: 44200000,
      extranjerosPct: 1.0,
      extranjeros: 62,
      alerta: "Demuestra una eficiencia de egreso y regularidad significativamente mayor a la UNR con un presupuesto por alumno mucho menor, focalizada en carreras productivas y tecnológicas.",
      coordenadas: { x: 350, y: 390, lat: -32.9525, lng: -60.6481 }
    }
  ],

  // Benchmarks comparativos regionales y nacionales
  benchmarks: [
    {
      sigla: "UNR",
      nombre: "Universidad Nacional de Rosario",
      ambito: "Rosario",
      tasaCohorte: 24.7,
      sinMateriasPct: 52.7,
      costoPorGraduado: 61546057,
      estudiantesPorDocente: 4.0,
      extranjerosPct: 5.9,
      color: "#facf3b"
    },
    {
      sigla: "UTN FRRo",
      nombre: "UTN Facultad Regional Rosario",
      ambito: "Rosario",
      tasaCohorte: 31.0,
      sinMateriasPct: 36.3,
      costoPorGraduado: 44200000,
      estudiantesPorDocente: 5.1,
      extranjerosPct: 1.0,
      color: "#8fd19e"
    },
    {
      sigla: "UNL",
      nombre: "Universidad Nacional del Litoral (Santa Fe)",
      ambito: "Santa Fe",
      tasaCohorte: 29.8,
      sinMateriasPct: 44.5,
      costoPorGraduado: 48200000,
      estudiantesPorDocente: 4.8,
      extranjerosPct: 2.1,
      color: "#8fb7ff"
    },
    {
      sigla: "UNRaf",
      nombre: "Universidad Nacional de Rafaela",
      ambito: "Santa Fe",
      tasaCohorte: 28.1,
      sinMateriasPct: 47.2,
      costoPorGraduado: 52600000,
      estudiantesPorDocente: 5.4,
      extranjerosPct: 0.8,
      color: "#e4b862"
    },
    {
      sigla: "Promedio Nac.",
      nombre: "Promedio Universidades Nacionales",
      ambito: "Nacional",
      tasaCohorte: 28.4,
      sinMateriasPct: 51.2,
      costoPorGraduado: 54100000,
      estudiantesPorDocente: 4.7,
      extranjerosPct: 4.2,
      color: "#fffff9"
    },
    {
      sigla: "UBA",
      nombre: "Universidad de Buenos Aires",
      ambito: "Nacional",
      tasaCohorte: 30.6,
      sinMateriasPct: 48.2,
      costoPorGraduado: 47152472,
      estudiantesPorDocente: 6.2,
      extranjerosPct: 9.8,
      color: "#b0b8d8"
    }
  ],

  // Propuestas de Universitarios por la Libertad (UPL Rosario)
  propuestas: [
    {
      id: "ingreso",
      titulo: "Fin del ingreso irrestricto: examen de ingreso y nivelación",
      bajada: "El ingreso irrestricto no democratiza: llena las aulas de primer año y vacía las del último.",
      detalle: "Un examen de ingreso con nivelación previa gratuita garantiza que quien entra cuente con las herramientas para terminar su carrera. Países como Brasil, Chile o Colombia aplican pruebas estandarizadas que evitan la frustración estudiantil y el derroche fiscal.",
      datoRosario: "En la UNR, 75 de cada 100 ingresantes quedan en el camino y no se reciben dentro del plazo estipulado.",
      enlaceRanking: "cohorte"
    },
    {
      id: "regularidad",
      titulo: "Regularidad real que exija rendir materias",
      bajada: "Hacer cumplir el artículo 50 de la Ley de Educación Superior: mínimo de dos materias aprobadas por año.",
      detalle: "Hoy el 52.7% de los matriculados en la UNR no aprueba ni una sola materia en el año calendario y sigue consumiendo servicios, comedores y computando para el presupuesto. Ser estudiante debe significar estudiar, contemplando excepciones comprobadas para quienes trabajan o tienen personas a cargo.",
      datoRosario: "55.030 inscriptos de la UNR no aprobaron ninguna materia en 2024 y siguen figurando como activos en los padrones.",
      enlaceRanking: "ceroMaterias"
    },
    {
      id: "financiamiento",
      titulo: "Financiamiento mixto y arancel a extranjeros no residentes",
      bajada: "Arancelamiento a estudiantes extranjeros con convenios de reciprocidad y apertura a la industria privada.",
      detalle: "Más de 6.200 estudiantes extranjeros cursan en la UNR sin pagar un solo peso de arancel, concentrándose en Medicina (más del 24%). Proponemos un arancel justo para extranjeros no residentes que financie directamente laboratorios y las Becas AvanzAR.",
      datoRosario: "El costo de mantener estudiantes extranjeros no residentes en la UNR supera los $3.800 millones anuales de fondos públicos.",
      enlaceRanking: "extranjeros"
    },
    {
      id: "auditorias",
      titulo: "Auditorías externas de la AGN obligatorias y públicas",
      bajada: "Fin al oscurantismo de las cajas rectorales: quien recibe fondos públicos rinde cuentas peso por peso.",
      detalle: "Todas las unidades académicas deben ser auditadas anualmente con publicación abierta en tiempo real de compras, licitaciones, contrataciones directas y sueldos. La autonomía universitaria es para gobernarse académicamente, no para blindar cajas partidarias.",
      datoRosario: "La UNR aumentó 2.7x su gasto en propaganda en 2025 ($68.3M) mientras facultades como Bioquímica y Veterinaria reclaman insumos básicos.",
      enlaceRanking: "costo"
    }
  ],

  // Becas AvanzAR
  avanzar: {
    nombre: "Becas AvanzAR Rosario",
    bajada: "Poner la plata en los estudiantes de las carreras que Rosario y la región necesitan para crecer.",
    detalle: "El polo productivo de Rosario — agro, biotecnología, logística, desarrollo de software e ingeniería — necesita graduados calificados. AvanzAR financia directamente al alumno por mérito y avance, no a las estructuras burocráticas.",
    ejes: [
      { titulo: "Focalizada", texto: "Para estudiantes de hogares de ingresos medios y bajos en carreras declaradas estratégicas para la región." },
      { titulo: "Atada al Avance", texto: "Se cobra y renueva aprobando materias. El monto se incrementa a medida que el alumno se acerca a la graduación." },
      { titulo: "Cofinanciada", texto: "Nutrida con lo recaudado por aranceles a estudiantes extranjeros y convenios con el sector privado y agroexportador." },
      { titulo: "Transparencia Total", texto: "Panel público de seguimiento: cuántos becarios hay en cada facultad de Rosario, cuántos rinden y cuántos se gradúan." }
    ],
    carrerasEstrategicasRosario: [
      "Ingenierías (Mecánica, Eléctrica, Civil, Química)",
      "Biotecnología y Bioquímica (FBIOyF)",
      "Sistemas y Programación (UTN FRRo y FCEIA)",
      "Ingeniería Agronómica y Recursos Naturales (Zavalla)",
      "Medicina Veterinaria (Casilda)",
      "Enfermería Universitaria (FCM)",
      "Ciencias de la Computación, Física y Matemática"
    ]
  },

  // Slides para el modo presentación regional
  slides: [
    {
      id: "slide-1",
      tag: "INFORME UPL ROSARIO 2024/2025",
      titulo: "Auditorías Universitarias",
      subtitulo: "Universidad Nacional de Rosario & Región",
      bajada: "Datos oficiales de la SPU y la AGN sobre la realidad académica, el gasto presupuestario y la tasa real de graduación.",
      logo: true
    },
    {
      id: "slide-2",
      tag: "EL GANCHO DE DESERCIÓN",
      titulo: "De cada 100 inscriptos en la UNR",
      cifraGrande: "75",
      unidad: "/ 100",
      bajada: "No llegaron a graduarse dentro de la ventana de 6 años prevista.",
      detalle: "Tasa de egreso de cohorte oficial del 24.7%. De 20.349 que ingresan por año, apenas 4.179 logran recibirse."
    },
    {
      id: "slide-3",
      tag: "PADRÓN FANTASMA",
      titulo: "Estudiantes que no rinden",
      cifraGrande: "55.030",
      unidad: "inscriptos",
      bajada: "No aprobaron NI UNA sola materia en todo el año 2024.",
      detalle: "Representan el 52.7% del padrón total de la UNR. Pese a no tener actividad académica, el presupuesto se liquida por matrícula inflada."
    },
    {
      id: "slide-4",
      tag: "EFICIENCIA DEL GASTO",
      titulo: "Costo real por graduado",
      cifraGrande: "$61,5 M",
      unidad: "por graduado",
      bajada: "En pesos constantes según la ejecución presupuestaria de la UNR ($161.244 millones en 2024).",
      detalle: "El financiamiento no llega a las aulas: una estructura sobredimensionada con un costo astronómico por cada egresado efectivo."
    },
    {
      id: "slide-5",
      tag: "COLAPSO SELECTIVO",
      titulo: "Arquitectura y Derecho",
      cifraGrande: "-86%",
      unidad: "en egresados",
      bajada: "Cayeron en picada entre 2017 y 2023 en proporciones prácticamente idénticas.",
      detalle: "Los estudiantes subieron +17% y los cargos docentes crecieron +13%, pero los egresados se desplomaron. La AGN investiga maniobras estadísticas."
    },
    {
      id: "slide-6",
      tag: "PRIORIDADES FISCALES",
      titulo: "Gasto en Publicidad",
      cifraGrande: "2,7×",
      unidad: "de aumento",
      bajada: "El gasto en propaganda de la UNR pasó de $24,9M a $68,3M (PIU-AGN).",
      detalle: "Se gasta más en cartelería y autobombo político que en reequipar laboratorios de ciencias exactas y salud."
    },
    {
      id: "slide-7",
      tag: "PROPUESTAS UPL",
      titulo: "Qué proponemos para Rosario",
      items: [
        "1. Examen de ingreso y nivelación previa gratuita.",
        "2. Regularidad con exigencia real de rendir materias (Art. 50 LES).",
        "3. Arancel a estudiantes extranjeros no residentes con reciprocidad.",
        "4. Auditorías anuales obligatorias de la AGN con balances públicos.",
        "5. Becas AvanzAR: subsidiar al estudiante en carreras estratégicas."
      ]
    },
    {
      id: "slide-8",
      tag: "UNIVERSITARIOS POR LA LIBERTAD",
      titulo: "Sumate a UPL Rosario",
      subtitulo: "Por una universidad pública de excelencia, transparente y al servicio del mérito.",
      bajada: "Compartí los datos. Exigí auditorías. Defendé tu futuro.",
      redes: "@upl_rosario · @upl_arg"
    }
  ]
};

if (typeof module !== 'undefined') {
  module.exports = UPL_DATA;
}
