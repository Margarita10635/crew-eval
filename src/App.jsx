import { useState, useEffect } from "react";
import { FALLBACK_QUESTIONS_EN } from "./questionsEN.js";

// TRANSLATIONS
const T = {
  es: {
    appTitle: "CREW EVAL", appSubtitle: "Autoevaluación Marítima Tripulantes",
    selectTopic: "Selecciona un Tema", selectTopicSub: "Elige el área que deseas evaluar hoy",
    questions: "preguntas", minPass: "Mínimo 80% para ser competente",
    question: "Pregunta", of: "de", next: "Siguiente", finish: "Finalizar",
    results: "Resultado de Evaluación", competent: "COMPETENTE ✓", notYet: "AÚN NO COMPETENTE",
    competentMsg: "¡Excelente! Has demostrado dominio en este tema.",
    notYetMsg: "Sigue estudiando. ¡Tú puedes lograrlo!",
    score: "Puntuación", correct: "Correctas", incorrect: "Incorrectas",
    reviewCorrect: "Preguntas que respondiste bien:", reviewWrong: "Preguntas que debes repasar:",
    tryAgain: "Intentar de nuevo", backHome: "Volver al inicio", lang: "EN",
    generating: "Preparando evaluación...", yourAnswer: "Tu respuesta", correctAnswer: "Respuesta correcta",
    free: "GRATIS", attemptsLeft: "intentos restantes",
    unlockTitle: "Acceso al Tema", unlockPrice: "$50 pesos · 3 intentos",
    unlockDesc: "Paga $50 pesos y obtén 3 intentos. Recibirás una clave de acceso por WhatsApp.",
    enterKey: "Ingresa tu clave de acceso", keyPlaceholder: "Ej: CREW-5-XXXX",
    activateBtn: "Activar Clave", cancelBtn: "Cancelar",
    keyError: "Clave inválida o ya utilizada.", keySuccess: "¡Clave activada! Tienes 3 intentos.",
    demoNote: "★ Demo: Preguntas generadas por IA",
    whatsapp: "WhatsApp", bankInfo: "CLABE / Número de cuenta",
    buyAgain: "Comprar nuevo acceso",
    // Coins
    coins: "Exámenes perfectos", coinsTitle: "Tu Progreso", coinsDesc: "Saca 100% en 5 evaluaciones y gana 1 examen gratis. ¡Sin costo adicional!",
    coinsEarned: "¡Examen perfecto! 🏆", coinsRedeemed: "¡Examen desbloqueado! ¡Lo ganaste con 5 perfectos! 🎉",
    redeemBtn: "Canjear examen gratis 🎁", redeemTitle: "Examen Gratis Disponible",
    redeemDesc: "¡Ganaste un examen gratis! Elige qué tema desbloquear:",
    redeemConfirm: "Desbloquear este tema", redeemCancel: "Cancelar",
    notEnoughCoins: "Necesitas 5 exámenes perfectos (llevas",
    perfect: "¡PERFECTO! 100% 🏆",
    coinInfo: "🏆 5 exámenes perfectos = 1 tema gratis",
  },
  en: {
    appTitle: "CREW EVAL", appSubtitle: "Professional Maritime Self-Assessment",
    selectTopic: "Select a Topic", selectTopicSub: "Choose the area you want to evaluate today",
    questions: "questions", minPass: "Minimum 80% to be competent",
    question: "Question", of: "of", next: "Next", finish: "Finish",
    results: "Evaluation Results", competent: "COMPETENT ✓", notYet: "NOT YET COMPETENT",
    competentMsg: "Excellent! You have demonstrated mastery of this topic.",
    notYetMsg: "Keep studying. You can do it!",
    score: "Score", correct: "Correct", incorrect: "Incorrect",
    reviewCorrect: "Questions you answered correctly:", reviewWrong: "Questions you need to review:",
    tryAgain: "Try Again", backHome: "Back to Home", lang: "ES",
    generating: "Translating questions to English with AI... 🌊", yourAnswer: "Your answer", correctAnswer: "Correct answer",
    free: "FREE", attemptsLeft: "attempts left",
    unlockTitle: "Topic Access", unlockPrice: "$50 MXN · 3 attempts",
    unlockDesc: "Pay $50 MXN and get 3 attempts. You will receive an access key via WhatsApp.",
    enterKey: "Enter your access key", keyPlaceholder: "E.g: CREW-5-XXXX",
    activateBtn: "Activate Key", cancelBtn: "Cancel",
    keyError: "Invalid or already used key.", keySuccess: "Key activated! You have 3 attempts.",
    demoNote: "★ Demo: AI-generated questions",
    whatsapp: "WhatsApp", bankInfo: "Bank Account / CLABE",
    buyAgain: "Buy new access",
    coins: "Perfect exams", coinsTitle: "Your Progress", coinsDesc: "Score 100% on 5 evaluations and earn 1 free exam. No extra cost!",
    coinsEarned: "Perfect exam! 🏆", coinsRedeemed: "Exam unlocked! You earned it with 5 perfects! 🎉",
    redeemBtn: "Redeem free exam 🎁", redeemTitle: "Free Exam Available",
    redeemDesc: "You earned a free exam! Choose which topic to unlock:",
    redeemConfirm: "Unlock this topic", redeemCancel: "Cancel",
    notEnoughCoins: "You need 5 perfect exams (you have",
    perfect: "PERFECT! 100% 🏆",
    coinInfo: "🏆 5 perfect exams = 1 free topic",
  },
};

// TOPICS  (solo id:1 es gratis)
const TOPICS = [
  { id: 1,  icon: "🔥", nameEs: "Contraincendio",            nameEn: "Fire Fighting",                 free: true  },
  { id: 2,  icon: "🛟", nameEs: "Salvamento",                nameEn: "Lifesaving",                    free: false },
  { id: 3,  icon: "🔒", nameEs: "PBIP / ISPS",               nameEn: "ISPS / Ship Security",          free: false },
  { id: 4,  icon: "⚖️", nameEs: "Responsabilidades Sociales",nameEn: "Social Responsibilities",       free: false },
  { id: 5,  icon: "🌊", nameEs: "Inglés Marítimo",           nameEn: "Maritime English",              free: false },
  { id: 6,  icon: "🧳", nameEs: "Servicios Turísticos",      nameEn: "Tourism Services",              free: false },
  { id: 7,  icon: "🚢", nameEs: "Buques de Pasaje",          nameEn: "Passenger Vessels",             free: false },
  { id: 8,  icon: "🪢", nameEs: "Cabos y Nudos",             nameEn: "Lines & Knots",                 free: false },
  { id: 9,  icon: "🧭", nameEs: "Navegación",                nameEn: "Navigation",                    free: false },
  { id: 10, icon: "🩺", nameEs: "Primeros Auxilios",         nameEn: "First Aid",                     free: false },
  { id: 11, icon: "☢️", nameEs: "Mercancías Peligrosas",     nameEn: "Dangerous Goods (IMDG)",        free: false },
  { id: 12, icon: "⚡", nameEs: "Marinero Electrotécnico",   nameEn: "Electro-Technical Rating",      free: false },
  { id: 13, icon: "⚓", nameEs: "Fondeo y Anclas",           nameEn: "Anchoring & Anchors",           free: false },
  { id: 14, icon: "🎨", nameEs: "Pinturas y Recubrimientos", nameEn: "Paints & Coatings",             free: false },
  { id: 15, icon: "🔧", nameEs: "Maniobras de Buque",        nameEn: "Ship Maneuvers",                free: false },
  { id: 16, icon: "📋", nameEs: "ISM / Gestión Seguridad",   nameEn: "ISM Code / Safety Mgmt",       free: false },
  { id: 17, icon: "📦", nameEs: "Carga y Estiba",            nameEn: "Cargo & Stowage",               free: false },
  { id: 18, icon: "🏗️", nameEs: "Grúas y Aparejos",         nameEn: "Cranes & Rigging",              free: false },
  { id: 19, icon: "🌿", nameEs: "MARPOL / Contaminación",   nameEn: "MARPOL / Pollution Prevention", free: false },
  { id: 20, icon: "🚦", nameEs: "COLREG / Abordajes",       nameEn: "COLREG / Collision Regs",       free: false },
  { id: 21, icon: "📡", nameEs: "Equipos de Navegación",    nameEn: "Navigation Equipment",          free: false },
  { id: 22, icon: "🔌", nameEs: "Cables y Alambre",         nameEn: "Wire & Cable Systems",          free: false },
];

// CUSTOM QUESTIONS BANK  ← aquí puedes agregar tus propias preguntas por tema
// Si un tema tiene preguntas aquí, se usan ESTAS (mezcladas) en lugar de IA.
// Formato: { topicId: [ {q, options:[4], answer:0-3}, ... ] }
const CUSTOM_QUESTIONS = {
  // Ejemplo para Contraincendio (id:1) — reemplaza con tus preguntas reales:
  1: [
    { q: "¿Cuál es el agente extintor más efectivo para fuego clase B (líquidos inflamables)?", options: ["Agua nebulizada", "Polvo químico seco ABC", "CO₂", "Arena"], answer: 2 },
    { q: "¿Qué significa la letra 'A' en la clasificación de fuegos?", options: ["Líquidos inflamables", "Materiales sólidos combustibles", "Gases inflamables", "Metales combustibles"], answer: 1 },
    { q: "¿Cuál es la temperatura de ignición aproximada del gasoil?", options: ["80°C", "150°C", "220°C", "55°C"], answer: 2 },
    { q: "El sistema fijo CO₂ en sala de máquinas se activa cuando:", options: ["La temperatura supera 60°C", "Todo el personal ha evacuado", "El oficial de guardia lo ordena sin evacuación", "El detector de humo se activa solo"], answer: 1 },
    { q: "¿Qué equipo de protección personal es obligatorio al combatir un incendio a bordo?", options: ["Guantes de cuero solamente", "Equipo de bombero completo con EEBI", "Casco y botas de seguridad", "Máscara de polvo"], answer: 1 },
    { q: "¿Dónde debe estar ubicado el puesto de reunión (muster station)?", options: ["En la sala de máquinas", "En el puente de navegación", "En lugares de fácil acceso indicados en el plan de emergencia", "Solo en buques de pasaje"], answer: 2 },
    { q: "¿Con qué frecuencia se realizan los simulacros de incendio a bordo?", options: ["Mensualmente", "Semestralmente", "Anualmente", "Solo al inicio del viaje"], answer: 0 },
    { q: "El triángulo del fuego está compuesto por:", options: ["Calor, combustible y oxígeno", "Llama, humo y calor", "Combustible, ignición y propagación", "Temperatura, presión y oxígeno"], answer: 0 },
    { q: "¿Qué tipo de extintor NO debe usarse en fuegos eléctricos?", options: ["CO₂", "Polvo ABC", "Agua", "Agente limpio"], answer: 2 },
    { q: "El sistema de rociadores automáticos (sprinklers) se activa por:", options: ["Orden del capitán", "Fusible térmico que se derrite con el calor", "Señal del detector de humo central", "Presión del sistema hidráulico"], answer: 1 },
    { q: "¿Qué significa EEBI?", options: ["Equipo Especial de Búsqueda e Investigación", "Equipo de Emergencia para Brigada de Incendios", "Equipo de Escape con Respiración de Emergencia", "Equipo Estándar de Bombero Internacional"], answer: 2 },
    { q: "El fuego de clase 'C' corresponde a:", options: ["Metales combustibles", "Grasas y aceites de cocina", "Gases inflamables", "Materiales sólidos"], answer: 2 },
    { q: "¿Cuál es la función principal de la manguera contra incendios a bordo?", options: ["Solo para limpieza de cubiertas", "Conducir agua a presión hacia el foco del incendio", "Crear barreras de espuma", "Enfriar los depósitos de combustible únicamente"], answer: 1 },
    { q: "En caso de incendio en la cocina por aceite, se debe:", options: ["Usar agua a chorro directo", "Cubrir con tapa y usar extintor de CO₂ o polvo", "Abrir ventanas para ventilar", "Usar extintor de agua pulverizada"], answer: 1 },
    { q: "¿Qué normativa internacional regula la seguridad contra incendios en buques?", options: ["MARPOL 73/78", "SOLAS Capítulo II-2", "STCW 2010", "ISM Code"], answer: 1 },
    { q: "El detector de humo de tipo ionización detecta:", options: ["Calor intenso solamente", "Partículas de combustión en el aire", "Llamas visibles", "Gases tóxicos específicos"], answer: 1 },
    { q: "¿Qué acción se toma primero al descubrir un incendio a bordo?", options: ["Intentar apagarlo inmediatamente", "Dar la alarma y notificar al puente", "Evacuear el compartimento", "Cerrar todas las puertas estancas"], answer: 1 },
    { q: "La espuma AFFF se utiliza principalmente para fuegos de:", options: ["Clase A (sólidos)", "Clase B (líquidos inflamables)", "Clase C (gases)", "Clase D (metales)"], answer: 1 },
    { q: "¿Cuántas salidas de emergencia debe tener como mínimo cada espacio habitable a bordo?", options: ["Una", "Dos", "Tres", "Depende del tamaño del buque"], answer: 1 },
    { q: "El plan de control de incendios a bordo debe estar:", options: ["Solo en el puente", "Solo en la sala de máquinas", "Expuesto en lugares visibles y accesibles", "En la caja fuerte del capitán"], answer: 2 },
    { q: "¿Qué es una línea de vida (lifeline) en el contexto de lucha contra incendios?", options: ["Un cabo guía que usan los bomberos en espacios con humo", "El sistema de comunicación de emergencia", "La manguera principal contra incendios", "El arnés de seguridad del bombero"], answer: 0 },
    { q: "La presión mínima requerida en el colector principal contra incendios es:", options: ["1 bar", "2,7 bar", "5 bar", "10 bar"], answer: 1 },
    { q: "¿Qué significa 'fuego contenido' en términos de respuesta a emergencias?", options: ["El fuego fue extinguido completamente", "El fuego no se ha propagado más allá del área inicial", "El fuego está bajo control con espuma", "El fuego solo afecta materiales metálicos"], answer: 1 },
    { q: "Las puertas cortafuegos a bordo deben mantenerse:", options: ["Siempre abiertas para facilitar la evacuación", "Cerradas normalmente, excepto cuando se pase por ellas", "Abiertas durante las guardias nocturnas", "Solo cerradas en emergencias"], answer: 1 },
    { q: "¿Cuál es el objetivo del sistema de detección de incendios (fire detection system)?", options: ["Extinguir automáticamente el fuego", "Alertar tempranamente de la presencia de incendio", "Registrar la temperatura de todos los compartimentos", "Activar el sistema CO₂ automáticamente"], answer: 1 },
    { q: "En un buque tanquero, el sistema IG (inert gas) sirve para:", options: ["Enfriar la carga", "Mantener atmósfera no explosiva en los tanques", "Extinguir incendios en cubierta", "Ventilar la sala de máquinas"], answer: 1 },
    { q: "¿Qué tipo de agente extintor es el más adecuado para un incendio de clase K (grasas de cocina)?", options: ["CO₂", "Polvo ABC", "Agente húmedo (wet chemical)", "Espuma AFFF"], answer: 2 },
    { q: "La temperatura de trabajo de un traje de aproximación al fuego es:", options: ["Hasta 100°C", "Hasta 200°C", "Hasta 400°C (con protección radiante)", "Hasta 1000°C"], answer: 2 },
    { q: "¿Qué se entiende por 'evacuación vertical' en un incendio a bordo?", options: ["Subir por las escaleras hacia cubierta abierta", "Moverse solo por pasillos horizontales", "Descender por la amura del buque", "Evacuar usando el bote salvavidas"], answer: 0 },
    { q: "¿Con qué frecuencia debe inspeccionarse el equipo de lucha contra incendios a bordo?", options: ["Solo antes de cada viaje", "Mensualmente como mínimo", "Anualmente en el dique seco", "Cuando lo ordene la autoridad marítima"], answer: 1 },
    { q: "El 'punto de inflamación' (flash point) de un líquido es:", options: ["La temperatura a la que arde continuamente", "La temperatura mínima a la que emite vapores que se inflaman brevemente", "La temperatura de ebullición del combustible", "La temperatura a la que explota el combustible"], answer: 1 },
  ],
  // Agrega más temas aquí:
  // 9: [ {q:"...", options:[...], answer:0}, ... ],
};

// PREGUNTAS OFICIALES — OMI, STCW, SOLAS, MARPOL, LNCM Y REGLAMENTO

const Q = (q, o, a) => ({ q, options: o, answer: a });
// 22 TEMAS · 660 PREGUNTAS — Aprobadas y revisadas Junio 2026
// OMI · STCW · SOLAS · MARPOL · LSA · FSS · PBIP · MLC 2006 · LNCM
const FALLBACK_QUESTIONS={
  1:[
    Q("Según SOLAS II-2, ¿cada cuánto se realizan los simulacros de incendio?",["Mensualmente","Semanalmente","Anualmente","Cada viaje"],0),
    Q("El triángulo del fuego según la OMI está compuesto por:",["Calor, combustible y oxígeno","Llama, humo y calor","Ignición, propagación y combustible","Temperatura, presión y oxígeno"],0),
    Q("La clase de incendio A corresponde a:",["Materiales sólidos combustibles","Líquidos inflamables","Gases inflamables","Metales combustibles"],0),
    Q("Los fuegos de clase B son:",["Líquidos y grasas inflamables","Materiales sólidos","Gases inflamables","Metales"],0),
    Q("¿Qué agente extintor NO debe usarse en fuegos eléctricos?",["Agua","CO₂","Polvo ABC","Agente limpio"],0),
    Q("El plan de lucha contra incendios según SOLAS debe estar:",["Permanentemente expuesto en lugares accesibles","Solo en el puente","Solo en sala de máquinas","En la caja fuerte del capitán"],0),
    Q("¿Cuántas salidas de emergencia mínimo debe tener cada espacio habitable?",["Dos como mínimo","Una","Tres","Cuatro"],0),
    Q("El sistema de rociadores automáticos se activa por:",["Fusible térmico que se funde con el calor","Orden del capitán","Señal del detector central","Presión hidráulica"],0),
    Q("El EEBI según STCW A-VI/1 es:",["Equipo de Escape con Respiración de Emergencia","Equipo Especial de Brigada de Incendio","Equipo Estándar de Bombero Internacional","Equipo de Evacuación de Buque en Incendio"],0),
    Q("Las puertas cortafuego según SOLAS deben mantenerse:",["Cerradas normalmente, solo se abren para pasar","Siempre abiertas para facilitar el paso","Abiertas durante guardias nocturnas","Solo cerradas en emergencia"],0),
    Q("La presión mínima en el colector principal de incendios es:",["2.7 bar (275 kPa)","1 bar","5 bar","10 bar"],0),
    Q("El sistema de gas inerte en buques tanqueros sirve para:",["Mantener atmósfera no explosiva en los tanques de carga","Extinguir incendios en cubierta","Enfriar la carga","Ventilar la sala de máquinas"],0),
    Q("El FSS Code regula:",["Requisitos técnicos de sistemas fijos como CO₂, espuma y rociadores","Solo el CO₂","Solo los rociadores","Solo la espuma AFFF"],0),
    Q("Según STCW A-VI/1, ¿qué acción se toma primero al descubrir un incendio?",["Dar la alarma y notificar al puente","Intentar apagarlo inmediatamente","Evacuar el compartimento","Cerrar todas las puertas estancas"],0),
    Q("La espuma AFFF se usa principalmente para fuegos de:",["Clase B: líquidos inflamables","Clase A: sólidos","Clase C: gases","Clase D: metales"],0),
    Q("¿Cada cuánto debe inspeccionarse el equipo de lucha contra incendios?",["Mensualmente como mínimo","Solo antes de cada viaje","Anualmente en dique seco","Cuando lo ordene la autoridad"],0),
    Q("La formación básica en seguridad del STCW incluye:",["4 elementos: incendios, supervivencia, primeros auxilios y seguridad personal","Solo incendios y supervivencia","Solo primeros auxilios","Solo seguridad personal"],0),
    Q("Según la LNCM, ¿quién es responsable de la seguridad a bordo?",["El capitán como máxima autoridad del buque","Solo el armador","Solo el oficial de seguridad","El Estado de bandera"],0),
    Q("El detector iónico de humo detecta:",["Partículas de combustión en el aire","Solo llamas visibles","Solo calor intenso","Solo gases tóxicos"],0),
    Q("¿Qué es el punto de inflamación de un líquido?",["Temperatura mínima para emitir vapores que se inflaman temporalmente","Temperatura de ebullición","Temperatura de explosión","Temperatura de combustión continua"],0),
    Q("El extintor de agente húmedo clase K es para:",["Grasas y aceites de cocina","Fuegos eléctricos","Fuegos de sólidos","Fuegos de gases"],0),
    Q("Las zonas verticales principales en SOLAS II-2 sirven para:",["Limitar la propagación del incendio dividiendo el buque en secciones","Solo separar zonas de carga","Solo zonas de pasajeros","Solo proteger sala de máquinas"],0),
    Q("El STCW A-VI/3 exige formación avanzada en incendios para:",["Personal designado como jefe de brigada o bombero","Toda la tripulación","Solo el capitán","Solo el primer oficial"],0),
    Q("Cada espacio del buque debe tener como mínimo:",["Al menos un extintor portátil certificado","Uno por buque en total","Uno por cubierta","Solo en sala de máquinas"],0),
    Q("La regla fundamental de lucha contra incendios según la OMI establece:",["Primero alarmar, luego evaluar y actuar con el EPP adecuado","Atacar el fuego inmediatamente","Evacuar siempre antes que nada","Esperar siempre al equipo especializado"],0),
    Q("El sistema fijo de extinción más común en sala de máquinas es:",["CO₂ o equivalente aprobado por la OMI","Solo espuma","Solo agua nebulizada","Solo polvo"],0),
    Q("¿Qué significa la clase de incendio D?",["Metales combustibles como magnesio, titanio y litio","Líquidos inflamables","Gases inflamables","Materiales sólidos combustibles"],0),
    Q("El Reglamento de la LNCM establece que los simulacros de incendio:",["Son obligatorios mensualmente y se registran en el diario del buque","Son opcionales","Son solo anuales","Los decide el capitán"],0),
    Q("¿Qué es la clase de incendio C?",["Gases inflamables como GLP, GN y acetileno","Líquidos inflamables","Metales combustibles","Materiales sólidos"],0),
    Q("La formación de brigada de incendios debe incluir al menos:",["Un equipo completo de bomberos por guardia","Solo al capitán","Solo a los oficiales","A toda la tripulación sin equipo especial"],0),
  ],
  2:[
    Q("¿Cada cuánto se realiza el simulacro de abandono según SOLAS III?",["Mensualmente — antes de los 24 días del simulacro anterior","Semanalmente","Anualmente","Cada viaje"],0),
    Q("El Código LSA regula:",["Aparatos y dispositivos de salvamento a bordo","Solo los chalecos salvavidas","Solo los botes","Solo las balsas"],0),
    Q("La capacidad mínima de botes en buques de carga según SOLAS III es:",["100% de tripulación en cada banda","50% por banda","75% total","Solo un bote"],0),
    Q("El EPIRB transmite al sistema:",["COSPAS-SARSAT — la alerta llega al MRCC en minutos","INMARSAT de comunicaciones","GPS para posicionamiento","VHF directo a buques cercanos"],0),
    Q("La señal de abandono del buque según SOLAS es:",["7 pitidos cortos y 1 largo en la bocina y timbre de alarma","1 pitido largo","3 pitidos cortos","Campanas continuas"],0),
    Q("El traje de inmersión según el Código LSA debe:",["Poder ponerse en menos de 2 minutos sin ayuda","Tardar máximo 5 minutos","Ponerse solo con ayuda","No tiene tiempo límite"],0),
    Q("El SART es:",["Transponder de búsqueda y rescate activo — detectable por radar","Tipo de baliza EPIRB","Radio VHF de emergencia","Sistema de alarma del buque"],0),
    Q("La unidad HRU en una balsa salvavidas:",["La libera automáticamente al hundirse el buque a 4 metros","La infla automáticamente","La ilumina de noche","La conecta al EPIRB"],0),
    Q("La posición HELP en agua fría sirve para:",["Reducir la pérdida de calor corporal — rodillas al pecho, brazos cruzados","Nadar más rápido","Señalizar la posición","Descansar en el agua"],0),
    Q("Las bengalas paracaídas mínimas en una balsa SOLAS son:",["4 bengalas","2 bengalas","6 bengalas","1 bengala"],0),
    Q("El canal de guardia en VHF según GMDSS es:",["Canal 16 — internacional de socorro y llamada","Canal 12","Canal 70 (DSC)","Canal 8"],0),
    Q("El bote de rescate es obligatorio para:",["Todos los buques de carga de más de 500 GT en viajes internacionales","Solo buques de pasaje","Solo tanqueros","Solo más de 10,000 GT"],0),
    Q("La regla 1-10-1 de supervivencia en agua fría establece:",["1 min para controlarse, 10 min de capacidad motriz, 1 hora de supervivencia","1 hora en cada fase","10 minutos totales","1 día con traje"],0),
    Q("El paquete de emergencia de una balsa contiene:",["Agua, raciones, señales, botiquín y herramientas básicas","Solo agua y comida","Solo señales pirotécnicas","Solo radio de emergencia"],0),
    Q("El aro salvavidas según el Código LSA debe tener:",["Luz de encendido automático y rabiza de 30 metros mínimo","Solo luz","Solo rabiza","Solo material reflectante"],0),
    Q("Ante MOB, la primera acción según STCW VI/1 es:",["Lanzar aro salvavidas y dar alarma inmediatamente","Maniobrar el buque primero","Llamar a guardia costera primero","Bajar el bote inmediatamente"],0),
    Q("La validez de servicio de una balsa salvavidas es:",["1 año — con revisión en estación aprobada","5 años","10 años","Permanente"],0),
    Q("Las instrucciones de seguridad a pasajeros deben darse:",["Antes del zarpe o al inicio del primer viaje","Solo mensualmente","Solo si el capitán lo ordena","Semanalmente"],0),
    Q("El código IAMSAR regula:",["Búsqueda y salvamento marítimo y aéreo internacional","Solo salvamento marítimo","Solo búsqueda aérea","Solo coordinación nacional"],0),
    Q("Según la LNCM, el capitán tiene obligación de prestar auxilio a:",["Toda persona en peligro en la mar sin riesgo grave para el buque","Solo a buques de su compañía","Solo a nacionales mexicanos","No tiene obligación legal"],0),
    Q("Las luces de los chalecos salvavidas deben:",["Activarse automáticamente al contacto con el agua","Solo activarse manualmente","No se requieren luces","Activarse por calor"],0),
    Q("El curso básico de seguridad STCW A-VI/1 es obligatorio para:",["Todo el personal que preste servicio a bordo","Solo oficiales de cubierta","Solo marineros","Solo personal de máquinas"],0),
    Q("El chaleco salvavidas debe mantenerse:",["En el camarote de cada tripulante, listo para ponerse en 1 minuto","Solo en almacén central","En la cubierta de botes","En la estación de abandono solamente"],0),
    Q("La formación en el puesto de abandono debe cubrir:",["Uso de equipos, señales pirotécnicas y procedimientos de evacuación","Solo uso del chaleco","Solo señales","Solo los botes"],0),
    Q("El GMDSS exige guardia permanente en:",["Canal 16 VHF y frecuencias de socorro MF/HF según el área","Solo Canal 16","Solo MF","Solo HF"],0),
    Q("El material reflectante en chalecos debe:",["Ser visible a 100 metros con una linterna de mano","Cubrir completamente el chaleco","Solo ser de color naranja","No es obligatorio"],0),
    Q("Los trajes de inmersión deben probarse:",["Periódicamente durante los simulacros de abandono","Solo en dique seco","Solo antes de cada viaje","No tienen prueba periódica obligatoria"],0),
    Q("El procedimiento SAR de la OMI coordina:",["Centros MRCC con medios marítimos y aéreos de diferentes países","Solo la marina militar","Solo la guardia costera nacional","Solo los buques cercanos"],0),
    Q("¿Qué es la señal MAYDAY en el GMDSS?",["Señal de socorro internacional para peligro inmediato de vida o buque","Señal de urgencia para situación grave","Señal de seguridad para avisos náuticos","Solo señal de radio"],0),
    Q("El aro salvavidas con luz y rabiza sirve para:",["Localizar y llegar a persona en el agua — especialmente de noche","Solo señalización diurna","Solo para uso en puertos","Solo en buques de pasaje"],0),
  ],
  3:[
    Q("El Código PBIP entró en vigor en:",["Julio de 2004 — tras los ataques del 11 de septiembre de 2001","Enero de 2000","Septiembre de 2001","Marzo de 2005"],0),
    Q("¿Cuántos niveles de protección existen según PBIP?",["3 niveles","2 niveles","4 niveles","5 niveles"],0),
    Q("El nivel de protección 1 según PBIP es:",["Nivel mínimo — medidas permanentes en operación normal","Nivel de amenaza general","Nivel de amenaza específica","Nivel de emergencia"],0),
    Q("El OPB debe:",["Implementar y mantener el Plan de Protección del Buque","Solo redactar el plan","Solo reportar incidentes","Solo capacitar a la tripulación"],0),
    Q("Los buques sujetos al Código PBIP son:",["Buques de pasaje y carga de 500 GT o más en viajes internacionales","Todos los buques","Solo buques de pasaje","Solo tanqueros"],0),
    Q("La evaluación de protección debe identificar:",["Vulnerabilidades, amenazas y consecuencias para tomar medidas correctivas","Solo las amenazas externas","Solo las vulnerabilidades","Solo las medidas preventivas"],0),
    Q("El OPC/CSO es responsable de:",["Desarrollar, implementar y actualizar el Plan de Protección","Solo auditar los buques","Solo capacitar al OPB","Solo reportar a la OMI"],0),
    Q("El Plan de Protección del Buque debe ser aprobado por:",["La Administración del Estado de bandera o en su nombre","El armador","El capitán","La autoridad portuaria"],0),
    Q("La Declaración de Protección Marítima se acuerda entre:",["El buque y la instalación portuaria antes de las operaciones","El capitán y el práctico","El armador y el Estado","El OPB y el OPIP"],0),
    Q("El Certificado Internacional de Protección tiene validez de:",["5 años con verificación intermedia","1 año renovable","3 años","10 años"],0),
    Q("El nivel 3 de protección se aplica cuando:",["Existe una amenaza específica o inminente","Es la operación normal","Hay una amenaza general no específica","No hay amenaza"],0),
    Q("El SSAS según SOLAS XI-2:",["Alerta discretamente a las autoridades sin alarmar a posibles atacantes","Activa alarma general","Llama automáticamente al puerto","Envía posición por AIS"],0),
    Q("El registro de actividades de protección debe conservarse mínimo:",["3 años a bordo o en tierra","Solo 1 año","Solo 6 meses","Indefinidamente"],0),
    Q("El Código PBIP en su Parte A es:",["Obligatorio — contiene requisitos mandatorios","Recomendatorio para buques pequeños","Optativo para tráfico nacional","Solo para instalaciones portuarias"],0),
    Q("¿Quién establece el nivel de protección para los buques de su pabellón?",["El gobierno del Estado de pabellón","El armador","El capitán","La OMI"],0),
    Q("El Código PBIP fue desarrollado como respuesta a:",["Los ataques terroristas del 11 de septiembre de 2001","La guerra del Golfo","El ataque al USS Cole","El hundimiento del Exxon Valdez"],0),
    Q("La zona de acceso restringido a bordo incluye:",["Puente, sala de máquinas y otras zonas designadas en el Plan","Todo el buque","Solo el puente","Solo sala de máquinas"],0),
    Q("El ejercicio de protección según PBIP debe realizarse:",["Al menos cada 3 meses","Mensualmente","Anualmente","Cada viaje"],0),
    Q("El polizón a bordo debe:",["Notificarse a las autoridades del siguiente puerto y seguir los procedimientos","Desembarcarse en alta mar","Dejarse en el siguiente puerto sin notificación","Ignorarse si es inofensivo"],0),
    Q("La protección marítima en México es responsabilidad de:",["El armador, el capitán y la autoridad marítima conjuntamente","Solo el capitán","Solo el armador","Solo la autoridad marítima"],0),
    Q("El OPIP es:",["El equivalente del OPB en la instalación portuaria","El mismo que el OPB","El jefe del puerto","El inspector de aduanas"],0),
    Q("Las amenazas contra el buque incluyen:",["Terrorismo, piratería, sabotaje y tráfico ilícito","Solo terrorismo","Solo piratería","Solo contrabando"],0),
    Q("El número IMO del buque según SOLAS XI-2 debe:",["Marcarse permanentemente de forma visible en el casco","Solo en los documentos","Solo en el puente","Solo en el casco bajo el agua"],0),
    Q("Ante un incidente de protección el OPB debe:",["Registrarlo, investigarlo y reportarlo al OPC y autoridades","Solo registrarlo","Solo reportarlo al capitán","Solo investigarlo internamente"],0),
    Q("La formación del personal de protección debe incluir:",["Concienciación, reconocimiento de riesgos y procedimientos de respuesta","Solo identificación de amenazas externas","Solo procedimientos de emergencia","Solo uso de equipos"],0),
    Q("El nivel de protección 2 se aplica cuando:",["Hay mayor riesgo de incidente — medidas adicionales temporales","Es la operación normal","Hay amenaza específica e inminente","Solo en puertos de alto riesgo siempre"],0),
    Q("La revisión del Plan de Protección del Buque se hace:",["Antes de cada nueva aprobación o cuando cambien las circunstancias","Solo cada 5 años","Solo después de un incidente grave","Anualmente obligatorio"],0),
    Q("El OPIP es responsable de:",["Implementar el Plan de Protección de la Instalación Portuaria","Solo coordinar con el OPB","Solo supervisar visitas","Solo redactar informes"],0),
    Q("¿Cuándo se requiere una Declaración de Protección Marítima?",["Cuando hay diferencias en el nivel de protección entre buque e instalación","Siempre en todos los atraques","Solo en nivel 3","Nunca es obligatoria"],0),
    Q("La Parte B del Código PBIP contiene:",["Orientaciones recomendadas para la aplicación de la Parte A obligatoria","Requisitos adicionales obligatorios","Solo para instalaciones portuarias","Alternativas a la Parte A"],0),
  ],
  4:[
    Q("¿Qué establece el Convenio MLC 2006?",["Normas mínimas de trabajo, salud y bienestar para la gente de mar globalmente","Solo salarios mínimos","Solo condiciones de alojamiento","Solo horas de trabajo"],0),
    Q("¿Cuál es la edad mínima para trabajar en buques según MLC 2006?",["16 años — y 18 para trabajos peligrosos o guardias nocturnas","14 años","18 años para todos","21 años"],0),
    Q("¿Cuántas horas máximas de trabajo en 24 horas establece MLC 2006?",["14 horas de trabajo como máximo","16 horas","12 horas","10 horas"],0),
    Q("¿Cuántas horas mínimas de descanso en 24 horas establece MLC 2006?",["10 horas, de las cuales al menos 6 deben ser continuas","8 horas","6 horas","12 horas"],0),
    Q("¿Qué garantiza el derecho de repatriación según MLC 2006?",["Retorno al país de origen al final del contrato — sin costo para el marino","Solo al final del contrato largo","Solo por enfermedad grave","Solo por accidente de trabajo"],0),
    Q("¿Qué certifica el CTM (Certificado de Trabajo Marítimo)?",["Que el buque cumple con las condiciones laborales del Convenio MLC","Es la licencia del capitán","Es el contrato de enrolamiento","Es el permiso de navegación"],0),
    Q("Según MLC 2006, la asistencia médica a bordo es:",["Gratuita para el marino desde el embarque hasta 16 semanas tras el desembarque","Solo en emergencias graves","Solo para enfermedades crónicas","Pagada por el marino"],0),
    Q("El DMLC tiene dos partes:",["Parte I: requisitos del Estado; Parte II: medidas del armador","Son una sola declaración","Parte I del armador, Parte II del Estado","Son documentos completamente separados"],0),
    Q("El certificado STCW es requerido para:",["Todo marino en funciones de guardia o con responsabilidad de seguridad","Solo capitanes y primer oficial","Solo oficiales de cubierta","Solo maquinistas jefes"],0),
    Q("La LNCM establece que el enrolamiento requiere:",["Contrato escrito y registro en la autoridad marítima","Solo un acuerdo verbal","No requiere registro","Es optativo para buques nacionales pequeños"],0),
    Q("¿Qué nuevo requisito de formación añadió el STCW para toda la gente de mar?",["Prevención y respuesta a la violencia y el acoso, incluidos intimidación y agresiones sexuales","Solo prevención del acoso laboral","Solo para personal femenino","Solo para buques de pasaje"],0),
    Q("¿Qué factores pueden contribuir a la violencia y el acoso a bordo?",["Abuso de poder, discriminación, estrés, aislamiento, fatiga, drogas o alcohol","Solo el abuso de poder","Solo el alcohol y las drogas","Solo el estrés laboral"],0),
    Q("¿Qué implica la respuesta informada respecto de los traumas a bordo?",["Entender los principios básicos y prestar apoyo adecuado a víctimas, testigos y a sí mismo","Solo denunciar a las autoridades","Solo separar al agresor","Solo documentar el incidente"],0),
    Q("¿Qué medidas debe adoptar la gente de mar ante violencia o acoso?",["Intervenir y notificar siguiendo los procedimientos establecidos a bordo","Solo notificar al capitán en casos graves","Solo actuar si hay testigos","Solo en situaciones de agresión física"],0),
    Q("¿Qué nueva competencia del STCW debe demostrar la gente de mar sobre la fatiga?",["Comprender y adoptar las medidas necesarias para controlar la fatiga","Solo los oficiales de guardia","Solo el capitán y el primer oficial","Solo en buques de más de 3000 GT"],0),
    Q("¿Cómo afectan el sueño y los horarios a la fatiga?",["El sueño, los horarios y el ritmo circadiano afectan directamente el nivel de fatiga","Solo la duración total del sueño","Solo la calidad del sueño nocturno","Solo los turnos nocturnos"],0),
    Q("¿Por qué los cambios de horario afectan la fatiga de la gente de mar?",["Alteran el ritmo circadiano y el patrón de descanso generando fatiga acumulada","Son cambios menores sin efecto real","Solo si son cambios de más de 4 horas","Solo en cambios extremos de zona horaria"],0),
    Q("¿Por qué es esencial el descanso adecuado para la seguridad marítima?",["La fatiga es un factor causal reconocido en accidentes marítimos","Solo es importante para el bienestar personal","Solo un requisito del MLC","Solo para guardias de navegación"],0),
    Q("¿Qué exige el STCW sobre la comunicación eficaz a bordo?",["Comprender los principios y barreras de comunicación eficaz entre personas y equipos","Solo hablar inglés a bordo","Solo comunicaciones de emergencia","Solo comunicaciones formales"],0),
    Q("¿Cuál es el criterio de evaluación en comunicaciones según STCW?",["Las comunicaciones deben ser claras y eficaces en todo momento — no solo en emergencias","Solo en situaciones de emergencia declarada","Solo entre oficiales del mismo rango","Solo en comunicaciones escritas y formales"],0),
    Q("¿Qué debe conocer la gente de mar sobre relaciones humanas a bordo?",["Trabajo en equipo, solución de conflictos, responsabilidades sociales, derechos y obligaciones","Solo las reglas disciplinarias internas","Solo instrucciones del capitán","Solo normas del armador"],0),
    Q("¿Por qué el uso indebido de drogas y alcohol se incluye en las responsabilidades sociales?",["Afecta las relaciones humanas, el comportamiento y la seguridad a bordo","Solo en el reglamento interno","Solo si hay consecuencias legales","Solo para personal de guardia"],0),
    Q("¿Qué son las barreras a la comunicación eficaz a bordo?",["Diferencias de idioma, cultura, jerarquía y contexto que afectan la transmisión del mensaje","Solo las diferencias de idioma","Solo la distancia física entre personas","Solo las fallas de los equipos"],0),
    Q("El salario mínimo de la gente de mar según MLC 2006:",["Lo fija el Comité Paritario de la OIT y se actualiza periódicamente","Lo decide cada armador","Lo fija el capitán","No existe mínimo internacional"],0),
    Q("El libro de quejas a bordo según MLC 2006 permite:",["Que cualquier marino presente queja sin temor a represalias","Solo quejas al capitán con conocimiento del armador","Solo quejas formales ante la autoridad","Solo quejas sobre salario"],0),
    Q("Según MLC 2006, en caso de abandono del buque por el armador:",["El marino tiene derecho a repatriación, salarios pendientes y compensación","Solo repatriación","Solo salarios","Sin derechos adicionales"],0),
    Q("Las vacaciones anuales mínimas según MLC 2006 son:",["2.5 días por mes de servicio, equivalente a 30 días al año","15 días al año","1 mes fijo","3 semanas al año"],0),
    Q("El control del Estado rector del puerto bajo MLC 2006 verifica:",["Condiciones de trabajo, alojamiento y bienestar del personal a bordo","Solo los documentos del buque","Solo la seguridad náutica","Solo la carga y estabilidad"],0),
    Q("¿Qué incluye la capacidad de detectar violencia y acoso a bordo?",["Identificar intimidación, acoso, agresiones sexuales y el conjunto de las agresiones","Solo agresiones físicas visibles","Solo el acoso verbal directo","Solo situaciones graves ya declaradas"],0),
    Q("¿Qué deben observar en todo momento los marinos respecto a violencia y acoso según STCW?",["Prácticas y procedimientos para prevenir, intervenir y notificar la violencia y el acoso","Solo conocer los procedimientos sin aplicarlos","Solo aplicarlos cuando hay una queja formal","Solo el personal de supervisión y mando"],0),
  ],
  5:[
    Q("¿Qué significa la señal MAYDAY según IMO SMCP?",["Señal de socorro internacional para peligro inmediato de vida o del buque","Señal de urgencia para situación grave","Señal de seguridad para avisos náuticos","Solo señal de radio en canal 16"],0),
    Q("¿Qué significa PAN PAN según IMO SMCP?",["Señal de urgencia — situación seria pero sin peligro inmediato de vida","Señal de socorro — peligro inmediato","Aviso de seguridad náutica","Comunicación de rutina prioritaria"],0),
    Q("¿Qué significa SECURITE según IMO SMCP?",["Mensaje de seguridad sobre peligros náuticos o avisos meteorológicos importantes","Señal de socorro","Señal de urgencia","Solo comunicaciones de rutina"],0),
    Q("¿En qué canal debe mantenerse guardia según STCW?",["Canal 16 — internacional de socorro y llamada","Canal 12 — operaciones portuarias","Canal 70 — DSC digital","Canal 8 — canal de trabajo"],0),
    Q("¿Qué significa 'banda de estribor' (starboard side)?",["El lado derecho del buque mirando hacia la proa","El lado izquierdo","La parte delantera (proa)","La parte trasera (popa)"],0),
    Q("¿Qué significa 'banda de babor' (port side)?",["El lado izquierdo del buque mirando hacia la proa","El lado derecho","La parte delantera","La parte trasera"],0),
    Q("¿Qué es ETA según IMO SMCP?",["Estimated Time of Arrival — Hora Estimada de Llegada","Emergency Towing Arrangement","Engine Telegraph Alarm","External Tank Area"],0),
    Q("¿Qué es GMDSS según STCW e IMO?",["Global Maritime Distress and Safety System — Sistema Mundial de Socorro y Seguridad","General Maritime Data Surveillance System","Global Marine Detection and Signal System","General Message Distribution Safety Service"],0),
    Q("¿Qué es MAYDAY RELAY según IMO SMCP?",["Relevo de socorro — enviado por estación que retransmite un mensaje de socorro recibido","Llamada de socorro secundaria","Mensaje de urgencia actualizado","Acuse de recibo del socorro"],0),
    Q("¿Qué significa ROGER según IMO SMCP?",["Mensaje recibido y entendido — he recibido su transmisión","Estoy de acuerdo con su propuesta","Cumpliré las instrucciones","Estoy listo para la próxima comunicación"],0),
    Q("¿Qué significa WILCO según IMO SMCP?",["Will comply — he entendido su mensaje y cumpliré","Solo mensaje recibido","No estoy de acuerdo pero seguiré","Espere mi respuesta"],0),
    Q("¿Qué idioma de comunicación exige el STCW en el puente?",["Inglés u otro idioma común entendido por todo el equipo del puente","Cualquier idioma que el capitán elija","Solo el idioma nacional del Estado de bandera","El idioma del puerto que se visita"],0),
    Q("¿Qué significa SEELONCE MAYDAY según IMO SMCP?",["Silencio — tráfico de socorro en progreso, todas las estaciones deben dejar de transmitir","Señal de silencio para seguridad","Cambio de canal para socorro","Acuse de recibo de socorro"],0),
    Q("¿Qué es el MMSI según IMO?",["Maritime Mobile Service Identity — identificador único de 9 dígitos del buque","Maritime Management Safety Identification","Main Marine Station Indicator","Maritime Message System Interface"],0),
    Q("¿Qué es 'draft' o 'draught' según IMO SMCP?",["Distancia vertical desde la línea de flotación hasta la quilla del buque","Longitud total del buque","Capacidad de carga del buque","Nivel de combustible"],0),
    Q("¿Qué significa STAND BY según IMO SMCP?",["Espere — prepárese para más comunicaciones o acción","Detenga todas las operaciones","Reduzca la velocidad al mínimo","Cambie el rumbo inmediatamente"],0),
    Q("¿Qué significa 'heave to' según IMO SMCP?",["Detener el avance del buque — mantener posición con proa al mar","Aumentar la velocidad al máximo","Dar la vuelta 180 grados","Fondear inmediatamente"],0),
    Q("¿Qué es un 'pilot' en contexto marítimo según IMO SMCP?",["Navegador local con licencia que guía buques en puerto o aguas difíciles","Un piloto de avión a bordo","El capitán del buque","El oficial de guardia de navegación"],0),
    Q("¿Qué es 'ballast' según IMO SMCP?",["Agua o peso llevado para mejorar la estabilidad cuando no hay carga de pago","Tipo de carga transportada","Reserva de combustible en tanques","Equipo de navegación a bordo"],0),
    Q("¿Qué significa ALL STOP según IMO?",["Detener todos los motores inmediatamente","Reducir la velocidad gradualmente","Máquina atrás — reversa máxima","Fondear en la posición actual"],0),
    Q("¿Qué es CPA según STCW e IMO?",["Closest Point of Approach — crítico para cálculos de prevención de abordaje","Course Planning Area","Cargo Port Authority","Captain's Position Alert"],0),
    Q("¿Qué es TCPA según IMO SMCP?",["Time to Closest Point of Approach — cuándo los buques estarán más cerca","Total Course Planning Analysis","Time for Cargo Port Arrival","Telegraph Command Port Authority"],0),
    Q("¿Dónde se encuentra el puente de mando en un buque?",["En la parte superior — centro de navegación y mando del buque","En el centro del buque","Debajo de la cubierta principal","En la popa del buque"],0),
    Q("¿Qué es la gambuja (galley) en un buque?",["La cocina donde se prepara la comida a bordo","El comedor de oficiales","El área de almacén de víveres","La cafetería de sala de máquinas"],0),
    Q("¿De qué es responsable el contramaestre (bosun)?",["Mantenimiento de cubierta y supervisión de los marineros","Navegación del buque","Operaciones de sala de máquinas","Cocina y aprovisionamiento"],0),
    Q("¿Qué es un marinero (rating) a bordo?",["Un tripulante no oficial como marinero, aceitero o cocinero","Un oficial subalterno","Un oficial en formación","Un tripulante temporal"],0),
    Q("¿De qué es responsable el primer oficial (Chief Officer)?",["Operaciones de carga, estabilidad y supervisión del departamento de cubierta","Operaciones de sala de máquinas","Comunicaciones de radio","Catering y bienestar de la tripulación"],0),
    Q("¿Qué es una milla náutica?",["Unidad de distancia en el mar — aproximadamente 1852 metros","Lo mismo que una milla terrestre (1609 metros)","Unidad usada solo para la velocidad","Exactamente 1000 metros"],0),
    Q("¿Qué significa MOB en emergencias marítimas?",["Man Overboard — Hombre Al Agua — activar procedimientos de emergencia inmediatamente","Motor On Board en operación","Manual of Boats a bordo","Marine Operations Base en tierra"],0),
    Q("¿Qué significa SEELONCE FEENEE según IMO SMCP?",["Fin del tráfico de socorro — pueden reanudarse las comunicaciones normales","Regresar al canal 16","Fin del período de guardia","Señal de llegada al puerto"],0),
  ],
  6:[
    Q("¿Qué actividades comprende el turismo náutico según el Reglamento LNCM?",["Las actividades recreativas y deportivas realizadas en embarcaciones en aguas nacionales","Solo cruceros internacionales","Solo deportes acuáticos sin embarcación","Solo pesca deportiva"],0),
    Q("¿Qué deben tener los operadores de turismo náutico según la LNCM?",["Permiso o concesión otorgada por la Secretaría de Comunicaciones y Transportes","Solo registro municipal","Solo permiso de Turismo","Sin requisito formal"],0),
    Q("¿Qué documentos deben tener las embarcaciones de turismo náutico?",["Matrícula vigente, certificado de seguridad y seguro de responsabilidad civil","Solo matrícula vigente","Solo seguro","Solo certificado de seguridad"],0),
    Q("¿Qué requisito tiene el patrón de embarcación turística según la LNCM?",["Título o licencia de navegación expedido por la autoridad marítima","Solo experiencia comprobada","Solo conocer la zona","Sin requisito de titulación"],0),
    Q("¿Cómo se determina la capacidad máxima de pasajeros en embarcaciones turísticas?",["La determina el certificado de seguridad emitido por la autoridad marítima","La decide el operador turístico","La establece el municipio","No tiene límite regulado"],0),
    Q("¿Qué obligación tienen los pasajeros respecto al chaleco según la LNCM?",["Usarlo durante toda la navegación o según indique el reglamento de la embarcación","Solo cuando el capitán lo ordene","Solo en mal tiempo","No es obligatorio en embarcaciones pequeñas"],0),
    Q("¿Qué requisitos deben cumplir los guías de turistas en embarcaciones?",["Conocer procedimientos básicos de seguridad marítima y primeros auxilios","Solo hablar idiomas extranjeros","Solo conocer el destino turístico","Sin requisitos de seguridad"],0),
    Q("¿Qué debe hacer el operador ante un accidente náutico turístico?",["Notificar inmediatamente a la autoridad marítima y prestar auxilio a los afectados","Solo notificar al municipio","Solo comunicar al seguro","Solo si hay lesionados graves"],0),
    Q("¿Qué equipo de seguridad mínimo deben tener las embarcaciones turísticas?",["Chalecos para todos, extintores, señales, botiquín y equipo de comunicación","Solo chalecos","Solo extintores y chalecos","Solo equipo de comunicación"],0),
    Q("¿Quién realiza la inspección de embarcaciones de turismo náutico?",["La capitanía de puerto periódicamente y antes de otorgar permisos","Solo empresas privadas certificadas","Solo la Secretaría de Turismo","El operador hace autoinspección"],0),
    Q("¿Es obligatorio el seguro de responsabilidad civil para operadores turísticos náuticos?",["Sí — obligatorio para todos los operadores que transporten pasajeros","Es optativo para embarcaciones menores","Solo para cruceros internacionales","Solo en temporada alta"],0),
    Q("¿Qué sanción puede aplicarse por operar turismo náutico sin permisos?",["Multa, suspensión de operaciones e inmovilización de la embarcación","Solo una advertencia escrita","Solo una multa menor","Sin sanción específica"],0),
    Q("¿Qué regulaciones adicionales aplican en áreas naturales protegidas?",["Regulaciones ambientales de la zona y permisos de SEMARNAT además de las marítimas","Solo las normas marítimas LNCM","Solo normas de la CONANP","Sin restricciones adicionales"],0),
    Q("¿Quién puede regular los horarios de operación del turismo náutico?",["La autoridad marítima según las condiciones de seguridad de la zona","Son completamente libres para el operador","Solo el municipio","No tienen regulación horaria"],0),
    Q("¿Cuándo debe realizarse el muster drill en embarcaciones turísticas?",["Antes del zarpe o al inicio del primer viaje con los pasajeros a bordo","Solo mensualmente","Solo con condiciones adversas","No aplica a embarcaciones pequeñas"],0),
    Q("¿Qué información de seguridad debe darse a los turistas antes de zarpar?",["Uso del chaleco, ubicación de equipos de emergencia y procedimiento de evacuación","Solo la velocidad máxima","Solo las normas de conducta","Solo el itinerario"],0),
    Q("¿Qué equipo de comunicación necesitan las embarcaciones turísticas en navegación costera?",["Radio VHF marino con guardia en canal 16 y capacidad de socorro","Solo teléfono celular","Solo radio AM","Sin requisito específico"],0),
    Q("¿Qué debe contemplar el plan de emergencia para embarcaciones turísticas?",["MOB, incendio, inundación, abandono y primeros auxilios como mínimo","Solo MOB y abandono","Solo el incendio","Solo primeros auxilios"],0),
    Q("¿Qué capacitación mínima debe tener el patrón de embarcación turística?",["Navegación básica, uso de VHF, primeros auxilios y procedimientos de emergencia","Solo navegación básica","Solo el uso del VHF","Solo primeros auxilios"],0),
    Q("¿Qué señales de emergencia mínimas deben tener las embarcaciones turísticas?",["Bengalas, espejo de señales y silbato según tamaño y zona de navegación","Solo bengalas","Solo silbato","No se requieren en embarcaciones pequeñas"],0),
    Q("¿Qué exige el MLC 2006 para el personal de embarcaciones turísticas que trabaja más de 24 horas?",["Los mismos derechos laborales que cualquier marino incluyendo descanso mínimo","Tiene derechos reducidos por ser turismo","Solo aplica MLC en buques grandes","Sin derechos laborales marítimos"],0),
    Q("¿Qué garantiza el operador de turismo náutico respecto a la seguridad?",["Que la embarcación y el personal cumplan todas las normas de seguridad aplicables","Solo el servicio turístico de calidad","Solo el mantenimiento de la embarcación","Solo el seguro de los pasajeros"],0),
    Q("¿Cómo deben atenderse a los turistas con discapacidad en embarcaciones?",["Identificarlos previamente y tener asistencia específica en la evacuación de emergencia","Solo si el turista lo solicita","Solo en cruceros grandes con médico","Sin requisito específico"],0),
    Q("¿Qué deben hacer las embarcaciones turísticas en zonas remotas o de arrecife?",["Tener plan de comunicaciones con la autoridad marítima y protocolo de emergencia","Solo tener GPS actualizado","Solo tener mapa de la zona","Sin requisito adicional"],0),
    Q("¿Qué se requiere para actividades en zonas de buceo o snorkel?",["Protocolo de seguridad, equipo de rescate acuático y personal con formación en rescate","Solo equipo de buceo para los turistas","Solo un guía certificado en buceo","Solo chaleco para los turistas"],0),
    Q("¿Qué es la capacidad máxima de personas en una embarcación turística?",["Número máximo autorizado en el certificado de seguridad — no puede superarse bajo ninguna circunstancia","Lo decide el operador según la demanda","Lo fija el municipio costero","No tiene límite regulado"],0),
    Q("¿Qué responsabilidad tienen los guías turísticos marítimos en una emergencia?",["Apoyar activamente al capitán en la comunicación y dirección de los turistas","Solo continuar con el recorrido turístico","Solo avisar al capitán del problema","Sin responsabilidad específica"],0),
    Q("¿Qué es el plan de distribución de pasajeros en una embarcación turística?",["Distribución equilibrada para mantener la estabilidad — evita escoras peligrosas","Solo para estética y comodidad","Solo para facilitar la evacuación","No es obligatorio en embarcaciones pequeñas"],0),
    Q("¿Qué exige la LNCM para operar embarcaciones turísticas en áreas marinas protegidas?",["Permiso adicional de la CONANP y cumplimiento de las normas específicas del área protegida","Solo las normas marítimas de la LNCM","Solo el seguro de responsabilidad civil","Sin requisitos adicionales a los normales"],0),
    Q("¿Cuál es la diferencia entre turismo náutico y pesca deportiva según la LNCM?",["Son actividades diferenciadas con regulaciones específicas aunque ambas requieren permisos de la SCT","Son la misma actividad regulada igual","La pesca deportiva no requiere permiso náutico","No hay diferencia en la regulación"],0),
  ],
  7:[
    Q("¿A qué personal aplica la familiarización básica con buques de pasaje según STCW A-V/2?",["A todo el personal que sirve a bordo, independientemente de su función","Solo a los oficiales de cubierta","Solo al personal de hotelería","Solo a tripulantes nuevos en su primer contrato"],0),
    Q("¿Cuándo debe completarse la familiarización con el buque de pasaje?",["Antes de asumir las funciones asignadas a bordo — al inicio del contrato","En los primeros 30 días a bordo","En el primer simulacro mensual","Al completar el primer viaje"],0),
    Q("¿Por qué es obligatoria la familiarización específica para buques de pasaje?",["Tienen características y riesgos únicos que requieren formación adicional a la básica","Porque los pasajeros exigen más servicio hotelero","Porque son buques más grandes","Porque viajan a mayor velocidad"],0),
    Q("¿Qué competencia exige el STCW A-V/2 sobre la seguridad de los pasajeros?",["Contribuir a la seguridad en situaciones normales y de emergencia incluyendo asistencia a personas con necesidades especiales","Solo asistir en el muster drill","Solo verificar los chalecos","Solo dar instrucciones al embarque"],0),
    Q("¿Cómo debe asistirse a pasajeros con discapacidad en emergencias?",["Identificarlos previamente, asignarles asistentes y tener procedimientos específicos de evacuación asistida","Solo orientarlos verbalmente","Solo llevarlos cuando sea posible","No requiere procedimientos específicos"],0),
    Q("¿Qué deben hacer las puertas estancas en una emergencia?",["Cerrarse herméticamente para evitar la propagación del agua entre compartimentos","Solo cerrarse para reducir el ruido","Abrirse para facilitar la evacuación","Cerrarse solo si el capitán lo ordena"],0),
    Q("¿Qué información mínima deben recibir los pasajeros según SOLAS y STCW?",["Ubicación y uso del chaleco, muster station y procedimiento de abandono antes del zarpe","Solo la ubicación del chaleco","Solo la salida de emergencia más cercana","Solo el nombre del oficial responsable"],0),
    Q("¿En qué consiste el control de muchedumbres según STCW A-V/2?",["Dirigir y controlar grupos de pasajeros en emergencia para asegurar evacuación ordenada y segura","Solo contar el número de pasajeros","Solo vigilar que no corran","Solo mantener el orden en las colas"],0),
    Q("¿Por qué el pánico es el mayor riesgo en una emergencia con muchos pasajeros?",["Provoca comportamiento irracional, bloqueo de rutas y aumenta el número de víctimas","Porque hace mucho ruido","Porque los pasajeros no siguen instrucciones","Porque causa daños a las instalaciones"],0),
    Q("¿Cuál es la responsabilidad del personal de hotelería en una emergencia?",["Cesar sus actividades y dirigir activamente a los pasajeros hacia sus muster stations","Continuar con el servicio hasta orden del capitán","Solo avisar a los pasajeros de su zona","No tienen responsabilidad"],0),
    Q("¿Cómo debe organizarse el personal para el control de muchedumbres?",["Con roles asignados previamente — cada persona conoce su zona y responsabilidad","Se organiza espontáneamente durante la emergencia","Solo los oficiales tienen roles asignados","Solo el personal de seguridad tiene roles"],0),
    Q("¿Qué es la gestión de crisis en buques de pasaje según STCW A-V/2?",["Capacidad de mando para tomar decisiones efectivas bajo presión durante emergencias con pasajeros","Solo la planificación previa de emergencias","Solo la comunicación de emergencias","Solo el mantenimiento de la calma personal"],0),
    Q("¿Qué es el CRM en buques de pasaje?",["Gestión de recursos humanos de la tripulación para maximizar la seguridad usando comunicación y trabajo en equipo","Solo la gestión de horarios de la tripulación","Solo la asignación de camarotes","Solo el control de horas de trabajo"],0),
    Q("¿Qué debe incluir el plan de respuesta a emergencias según SOLAS e ISM?",["Procedimientos para cada tipo de emergencia, roles asignados, comunicaciones y evacuación masiva","Solo el procedimiento de abandono","Solo el procedimiento de incendio","Solo las comunicaciones de emergencia"],0),
    Q("¿Qué exige el STCW A-V/2 respecto a los simulacros en buques de pasaje?",["Realizarse regularmente para mantener la competencia — con evaluación y mejora continua","Solo una vez al año en dique seco","Solo cuando hay nuevos tripulantes","Solo si lo exige la autoridad portuaria"],0),
    Q("¿Qué es un buque Ro-Pax y qué riesgos específicos tiene?",["Buque que transporta vehículos y pasajeros — riesgo de incendio en cubiertas de vehículos e inundación rápida","Solo un buque de pasaje de alta velocidad","Solo un buque de carga rodante sin pasajeros","Un buque tanquero con pasajeros"],0),
    Q("¿Por qué los buques Ro-Pax tienen requisitos adicionales de evacuación?",["La inundación de cubiertas de vehículos puede causar pérdida rápida de estabilidad y hundimiento veloz","Solo porque son buques más grandes","Solo porque tienen más pasajeros","Solo porque viajan en rutas más peligrosas"],0),
    Q("¿Qué tiempo máximo de evacuación establece la OMI para buques de pasaje tipo ferry?",["30 minutos para evacuar a todas las personas a bordo","60 minutos como máximo","15 minutos en cualquier circunstancia","Sin tiempo específico"],0),
    Q("¿Cuál es la diferencia del muster drill en buques de pasaje respecto al de buques de carga?",["En buques de pasaje se realiza antes del zarpe o en las primeras 24 horas e incluye demostración a los pasajeros","Es exactamente igual en ambos tipos","En buques de pasaje solo es obligatorio mensualmente","En buques de carga es más estricto"],0),
    Q("El Certificado de Seguridad para Buques de Pasaje tiene validez de:",["12 meses — se renueva anualmente con inspección","5 años","3 años","Permanente"],0),
    Q("Los compartimentos estancos en buques de pasaje sirven para:",["Limitar la inundación y mantener flotabilidad suficiente tras daños","Dividir el buque por función","Separar carga de pasajeros","Crear zonas de ventilación"],0),
    Q("El sistema de megafonía PA en buques de pasaje según SOLAS debe:",["Escucharse en todos los espacios del buque incluyendo cubierta exterior","Solo en zonas públicas interiores","Solo en los camarotes","Solo en el puente y sala de máquinas"],0),
    Q("Los botes salvavidas en buques de pasaje deben ser de tipo:",["Totalmente cerrados — para protección en condiciones adversas del mar","Abiertos para mayor capacidad","Semiabiertos para condiciones moderadas","Cualquier tipo aprobado"],0),
    Q("Los buques de pasaje deben tener capacidad de botes equivalente a:",["100% de personas a bordo en cada banda del buque","50% por banda","Solo el total de personas","75% del total"],0),
    Q("El Convenio de Atenas de la OMI regula:",["Responsabilidad del transportista marítimo por muerte o lesión de pasajeros","Solo la responsabilidad por equipaje perdido","Solo las tarifas del transporte","Solo el contrato de transporte"],0),
    Q("La lista de pasajeros y tripulación debe:",["Estar disponible en tierra y actualizarse antes de cada zarpe para operaciones de rescate","Solo guardarse a bordo","Solo enviarse en caso de emergencia","No es obligatoria para cruceros cortos"],0),
    Q("El sistema de detección de incendios en buques de pasaje debe:",["Cubrir todos los espacios incluyendo camarotes, cocinas y zonas de servicio","Solo zonas de máquinas","Solo zonas públicas","Solo cocinas y almacenes"],0),
    Q("La señalética de emergencia en buques de pasaje debe:",["Seguir el sistema de símbolos IMO visible incluso con humo y poca iluminación","Solo estar en inglés e idioma del buque","Solo en zonas públicas de alta frecuencia","Solo en los camarotes"],0),
    Q("El Código Polar de la OMI aplica a buques de pasaje en aguas polares exigiendo:",["Medidas adicionales de salvamento y protección por condiciones extremas del medio","Solo cumplir SOLAS normal","Solo requisitos de calefacción","Solo equipos de navegación adicionales"],0),
    Q("El plan de control para pasajeros especiales debe:",["Identificar previamente a pasajeros con necesidades especiales y asignar asistentes","Solo llevar una lista de pasajeros especiales","Solo tener sillas de ruedas disponibles","Solo notificar al médico"],0),
  ],
  8:[
    Q("¿Cuál es el nudo más importante a bordo según STCW para marineros de cubierta?",["El as de guía — forma un ojo fijo no corredizo muy seguro","El nudo corredizo","La vuelta de escota","El nudo de ocho"],0),
    Q("¿Para qué se usa el ballestrinque?",["Sujetar un cabo a un poste, argolla o cornamusa","Unir dos cabos del mismo grosor","Hacer un ojo permanente en el extremo","Remolcar otro buque"],0),
    Q("¿Cuál es la característica principal del cabo de polipropileno?",["Flotabilidad — es el único material de cabo que flota en el agua","Mayor resistencia que el nylon","Mayor elasticidad bajo tensión","Mayor rigidez para maniobras"],0),
    Q("¿Por qué los cabos de nylon son peligrosos bajo tensión extrema?",["Pueden romperse violentamente y rebotar causando lesiones graves","Son muy pesados y difíciles de manejar","Se enredan fácilmente en la maquinaria","Se deshacen solos bajo carga"],0),
    Q("¿Qué es el chicote de un cabo?",["El extremo libre de un cabo","El nudo central del cabo","El punto de máxima resistencia","El núcleo interno del cabo"],0),
    Q("¿Qué es un spring o través en el sistema de amarre?",["Cabo que evita el movimiento longitudinal del buque junto al muelle","Cabo que sujeta la proa al muelle","Cabo que sujeta la popa al muelle","Cabo de remolque de emergencia"],0),
    Q("¿Cuántas líneas básicas de amarre tiene normalmente un buque?",["6 — dos de proa, dos de popa y dos springs","4 como mínimo","3 en buques pequeños","8 obligatorias en todos los casos"],0),
    Q("¿Para qué se usa el nudo de ocho?",["Evitar que el cabo pase por un ojal o roldana — nudo de tope","Unir dos cabos de diferente diámetro","Hacer un lazo ajustable","Sujetar a una cornamusa permanentemente"],0),
    Q("¿Qué es la vuelta de escota y para qué sirve?",["Nudo para unir dos cabos de diferente diámetro","Nudo para amarre permanente","Nudo para hacer un ojo en el extremo","Sujetar a un poste vertical"],0),
    Q("¿Qué precaución debe tomarse al largar una amarra bajo tensión?",["Verificar zona libre de personal y comunicar antes de aflojar — nunca pararse en el seno del cabo","Largar lo más rápidamente posible","Solo avisar al contramaestre sin verificar","No hay precaución especial"],0),
    Q("¿Qué es un noray según las normas de amarre en puerto?",["Poste fijo en el muelle para atar los cabos de amarre","Tipo de nudo especial","Cabo especial de alta resistencia","Herraje del casco del buque"],0),
    Q("¿Qué es chicotear un cabo?",["Sellar el extremo para evitar que se deshaga","Cortar el cabo con cuchillo","Tensar el cabo en la cornamusa","Limpiar y aceitar el cabo"],0),
    Q("¿Cuándo se reemplaza un cabo de amarre según normas OMI?",["Con desgaste notable, cortes o reducción de diámetro superior al 10%","Solo cuando se rompe completamente","Cada año de forma obligatoria","Cada viaje como precaución"],0),
    Q("¿Qué es el bozón o boza?",["Cabo corto para sujetar temporalmente otro cabo o cadena","Tipo de nudo principal de amarre","Amarre permanente al muelle","Herramienta para cortar cabos"],0),
    Q("¿Cuál es la posición segura al trabajar con cabos bajo tensión?",["Mantenerse fuera de la línea de tensión — zona de peligro en caso de rotura","Lo más cerca posible para mayor control","Pisar el cabo para controlarlo","No hay posición específica de riesgo"],0),
    Q("¿Qué es el nudo de rizo?",["Nudo de unión plano y simétrico — para atar rizos o empacar","Nudo corredizo para ajustar","Nudo de tope para extremos","Nudo para amarre permanente en muelle"],0),
    Q("¿Para qué sirve el aparejo de cuadernal?",["Multiplicar la fuerza aplicada usando sistema de poleas","Cortar cabos de gran diámetro","Almacenar cabos ordenadamente","Tensar cables eléctricos"],0),
    Q("¿Qué es el tensado de amarras?",["Mantener tensión adecuada — evita movimiento del buque y golpes al muelle","Solo tensar las amarras de proa","Solo ajustar en marea baja","No es importante si el buque está fondeado"],0),
    Q("¿Qué es la cocoa o rosca de un cabo?",["Enrollado ordenado del cabo en círculos sobre cubierta para uso inmediato","Nudo decorativo de a bordo","Cabo de repuesto enrollado","Herramienta para limpiar cabos"],0),
    Q("¿Qué material de cabo tiene mayor elasticidad?",["Nylon (poliamida) — alta elasticidad que absorbe los esfuerzos de amarre","Polipropileno por su flotabilidad","Manila por ser fibra natural","Poliéster por su rigidez"],0),
    Q("¿Qué es el stopper o retinida de cabo?",["Dispositivo para sujetar temporalmente un cabo mientras se da vuelta en la cornamusa","Tipo de cabo especial","Nudo para amarrar en noray","Herramienta para cortar cabos"],0),
    Q("¿Cuál es el peligro del seno de una amarra?",["Zona donde el cabo puede golpear si se rompe o suelta — nunca pararse en el seno","Punto de máxima resistencia del cabo","Zona de menor desgaste","Área de almacenaje del cabo sobrante"],0),
    Q("¿Qué es el pallete o cosido de cabo?",["Proteger o reforzar un cabo en puntos de rozamiento trenzando hilos alrededor","Tipo de nudo para unir dos cabos","Forma de hacer un ojo en el extremo","Sistema para almacenar cabos"],0),
    Q("¿Por qué el poliéster es preferido en cabos de amarre?",["Alta resistencia, poca elasticidad, buena resistencia UV y no se pudre con el agua de mar","Alta elasticidad para absorber tirones","Por su flotabilidad en el agua","Por su bajo costo"],0),
    Q("¿Qué es una espia en el sistema de amarre?",["Cabo diagonal desde proa o popa hacia un punto intermedio en el muelle","Cabo de remolque de emergencia","Cable de ancla reforzado","Amarre de popa perpendicular al muelle"],0),
    Q("¿Cuál es la diferencia entre una espia de proa y un spring de proa?",["La espia va diagonal hacia popa del muelle — el spring va diagonal hacia proa del muelle","Son exactamente iguales en función","La espia es para babor y el spring para estribor","Solo difieren en el material del cabo"],0),
    Q("¿Qué es el cabo de remolque de emergencia y sus requisitos?",["Cabo listo para uso inmediato — revisado y certificado con SWL adecuado","Solo el cabo principal de remolque","Solo para buques con grúas","No tiene requisitos de certificación"],0),
    Q("¿Cómo se comunica el equipo de amarre con el puente durante la maniobra?",["Por radio VHF portátil o señales acordadas — comunicación clara y confirmada","Solo por señas manuales del contramaestre","Solo por intercomunicador fijo","Sin protocolo específico"],0),
    Q("¿Qué es el guía-cabos y para qué sirve?",["Dispositivo que dirige el cabo en la dirección correcta sin rozamiento excesivo","Persona que guía los cabos en cubierta","Herramienta para cortar cabos","Tipo de nudo especial de guía"],0),
    Q("¿Qué es la resistencia a la rotura de un cabo y cómo se certifica?",["Fuerza máxima antes de romperse — debe figurar en el certificado del cabo","Solo el peso máximo que puede cargar","Solo la resistencia al desgaste","Solo la resistencia a la humedad marina"],0),
  ],
  9:[
    Q("¿Qué es una marcación en navegación y para qué se usa?",["Ángulo medido desde el Norte hasta un objeto — se usa para determinar la posición del buque por líneas de posición","La dirección en que navega el buque","La distancia a un objeto observado","El ángulo de escora del buque"],0),
    Q("¿Qué es el error del compás y cómo se determina?",["Diferencia entre el Norte verdadero y el Norte que marca el compás — se determina por marcación a astro u objeto conocido","Error mecánico del instrumento por vibración","Solo la declinación magnética del lugar","Error solo del compás de gobierno"],0),
    Q("¿Qué es el desvío del compás magnético?",["Error propio del compás causado por el magnetismo del propio buque — varía según el rumbo del buque","Error igual al de la declinación magnética","Error que no cambia con el rumbo","Solo afecta al compás de botes"],0),
    Q("¿Qué es la marcación verdadera (Mv)?",["Marcación corregida de declinación y desvío — referida al Norte verdadero geográfico","Marcación directa del compás sin corrección","Marcación referida al Norte magnético","Marcación estimada sin observación"],0),
    Q("¿Para qué sirve la marcación de enfilación?",["Dos objetos alineados en la misma dirección — proporcionan una línea de posición exacta sin instrumentos","Solo para verificar el compás del buque","Solo para medir la velocidad del buque","Para determinar la profundidad del agua"],0),
    Q("¿Qué es el error de giro del girocompás?",["Error que aparece cuando el buque cambia de rumbo a alta velocidad — el giróscopo tarda en estabilizarse","Error permanente del girocompás","Solo afecta en latitudes altas","Error igual al desvío del compás magnético"],0),
    Q("¿Qué es la velocidad de precesión del girocompás?",["Velocidad a la que el girocompás corrige su orientación tras un cambio de rumbo o perturbación","La velocidad máxima del buque","La velocidad de rotación del giróscopo","La velocidad de corrección del compás magnético"],0),
    Q("¿Qué información transmite automáticamente el AIS según SOLAS V?",["MMSI, nombre, posición, rumbo, velocidad, tipo de buque y estado de navegación","Solo la posición","Solo el nombre e MMSI","Solo la velocidad y rumbo"],0),
    Q("¿Qué es el rumbo verdadero en navegación?",["Ángulo medido desde el Norte verdadero hasta la proa del buque","Ángulo medido desde el Norte magnético","La dirección del viento dominante","La dirección de la corriente marina"],0),
    Q("¿Qué es la declinación magnética?",["Diferencia angular entre el Norte verdadero y el Norte magnético en un lugar y fecha determinados","Error del compás giroscópico","Variación de la corriente marina","Diferencia entre mareas sucesivas"],0),
    Q("¿Qué es el ARPA y para qué sirve según SOLAS V?",["Radar automático de trazado — proporciona CPA y TCPA de blancos detectados","Sistema de alarma de ancla","Tipo especial de ancla moderna","Sistema de comunicación de emergencia"],0),
    Q("¿Qué es la derrota planificada de un buque?",["La ruta planificada desde el origen al destino con puntos de paso","Tipo de maniobra de emergencia","Error crítico de navegación","Sistema de fondeo planificado"],0),
    Q("¿Cuánto miden las aguas territoriales según la CONVEMAR?",["12 millas náuticas desde las líneas de base del Estado costero","3 millas náuticas","200 millas náuticas","50 millas náuticas"],0),
    Q("¿Cuánto mide la Zona Económica Exclusiva ZEE?",["200 millas náuticas desde las líneas de base del Estado costero","12 millas náuticas","50 millas náuticas","100 millas náuticas"],0),
    Q("¿Qué es la posición de estima en navegación?",["Posición calculada por rumbo, velocidad y tiempo desde la última posición conocida","Posición dada por el GPS","Posición obtenida por radar","Posición por satélite"],0),
    Q("¿Qué es el abatimiento en navegación?",["Desvío del buque de su rumbo por efecto de corrientes y viento","Cambio de rumbo voluntario","Error del compás magnético","Variación de la declinación magnética"],0),
    Q("¿Qué es el sistema de separación del tráfico TSS?",["Vías separadas de tráfico en zonas congestionadas — deben seguirse siempre que sea posible","Sistema de alarma de tráfico portuario","Señalización de rutas en carta náutica","Sistema de comunicación entre buques"],0),
    Q("¿Qué posición tiene el práctico de puerto respecto al capitán?",["Asiste al capitán en maniobras pero no releva su responsabilidad sobre la seguridad","Toma el mando legal del buque","Es responsable de los daños durante la maniobra","Sustituye al capitán en puerto"],0),
    Q("¿Qué es el nudo como unidad de velocidad?",["1 milla náutica por hora — equivale a 1.852 km/h","1 km por hora","1 milla terrestre por hora","2 km por hora"],0),
    Q("¿Qué es el VDR (Voyage Data Recorder)?",["Registrador de datos del viaje — caja negra del buque con posición, comunicaciones y audio","Sistema de velocidad de datos","Registrador de dirección del viento","Indicador de rumbo del buque"],0),
    Q("¿Qué exige el STCW A-II/1 respecto al diario de navegación?",["Registrar eventos significativos, posición, rumbo y velocidad durante cada guardia","Solo registrar la posición","Solo los eventos de emergencia","Solo el tiempo y velocidad"],0),
    Q("¿Qué es la ecosonda en navegación?",["Instrumento que mide la profundidad del agua por ultrasonido","Instrumento de velocidad del buque","Instrumento de radar meteorológico","Instrumento de presión"],0),
    Q("¿Qué es el NAVTEX?",["Sistema automático de recepción de avisos náuticos, meteorológicos y mensajes SAR","Sistema de navegación por satélite","Tipo de radar de corto alcance","Sistema de comunicación VHF digital"],0),
    Q("¿Qué obligación tiene el capitán si encuentra personas en peligro en la mar?",["Prestar asistencia si puede hacerlo sin riesgo grave para el buque","Solo informar a las autoridades","Solo si no retrasa el viaje más de 2 horas","Solo si el armador lo autoriza"],0),
    Q("¿Qué requisito tiene la carta náutica electrónica ENC?",["Carta oficial aprobada por la autoridad hidrográfica — debe mantenerse actualizada","Cualquier carta digital en el ordenador","Solo la versión escaneada en papel","No tiene requisitos de actualización"],0),
    Q("¿Qué es el piloto automático y cuál es su requisito principal?",["Sistema que mantiene el rumbo — debe permitir transferencia inmediata a gobierno manual","Sistema de navegación totalmente autónomo","Sustituye completamente al oficial de guardia","Solo para uso en alta mar"],0),
    Q("¿En qué se diferencia el girocompás del compás magnético?",["Apunta al Norte verdadero — no afectado por el magnetismo del buque","Es más preciso pero afectado por el hierro del buque","Solo sirve en latitudes medias","Es igual al magnético pero más moderno"],0),
    Q("¿Qué es el canal 16 de VHF y por qué es importante?",["Canal internacional de socorro y llamada — guardia obligatoria según GMDSS y SOLAS IV","Canal de comunicaciones portuarias locales","Canal para información meteorológica","Canal privado entre buques"],0),
    Q("¿Cuánto mide una milla náutica y en qué se basa?",["1852 metros — equivale a 1 minuto de arco del meridiano terrestre","1000 metros exactamente","1609 metros igual a la milla terrestre","2000 metros aproximadamente"],0),
    Q("¿Qué es el AIS clase A y a quién es obligatorio?",["AIS obligatorio para buques de más de 300 GT en viajes internacionales y 500 GT en nacionales","Solo para buques de pasaje de cualquier tamaño","Solo para buques de más de 10000 GT","Solo para buques que llevan mercancías peligrosas"],0),
  ],
  10:[
    Q("¿Qué es la RCP y cuántas compresiones por minuto se recomiendan en adulto?",["Resucitación Cardiopulmonar — 100 a 120 compresiones por minuto","60 a 80 compresiones por minuto","50 a 60 compresiones por minuto","140 a 160 compresiones por minuto"],0),
    Q("¿Qué es la maniobra de Heimlich y para qué se usa?",["Compresión abdominal para desatascar la vía aérea en caso de atragantamiento","Para reanimar al paciente en paro cardíaco","Para tratar quemaduras graves","Para inmovilizar fracturas de columna"],0),
    Q("¿Qué se debe hacer primero ante un accidentado según STCW A-VI/1?",["Evaluar la seguridad del lugar antes de acercarse a la víctima","Dar RCP inmediatamente","Llamar al médico primero","Mover al paciente a un lugar seguro"],0),
    Q("¿Cómo se trata una hemorragia externa grave según la guía médica OMI?",["Presión directa firme sobre la herida con apósito limpio — mantener la presión","Torniquete siempre como primera medida","Agua fría sobre la herida","Solo elevación del miembro afectado"],0),
    Q("¿Cómo se reconoce el shock circulatorio?",["Piel pálida y fría, pulso rápido y débil, alteración del nivel de consciencia","Solo pérdida de consciencia completa","Solo electrocución grave","Solo fractura de hueso importante"],0),
    Q("¿Cómo se trata una quemadura leve de primer grado según la guía médica OMI?",["Agua fría corriente durante 10 a 20 minutos — nunca hielo directo ni mantequilla","Hielo directo sobre la quemadura","Mantequilla para hidratar","Pasta dental sobre la zona quemada"],0),
    Q("¿Para qué sirve la posición lateral de seguridad?",["Para paciente inconsciente que respira — evita asfixia por vómito o caída de la lengua","Para pacientes con fractura de columna","Para pacientes en paro cardíaco","Para pacientes con quemaduras en la espalda"],0),
    Q("¿Qué son las siglas ABC en primeros auxilios?",["Airway (vía aérea), Breathing (respiración), Circulation (circulación)","Alert, Basic Care, Compress","Assess, Bandage, Call","Attention, Breathing, Check"],0),
    Q("¿Qué es el DEA y cuándo se usa?",["Desfibrilador Externo Automático — tan pronto como esté disponible en paro cardíaco","Solo lo usa el médico de a bordo","Solo si el RCP no funciona después de 10 minutos","Solo en hospitales"],0),
    Q("¿Cómo se trata la hipotermia según la guía médica OMI?",["Recalentar gradualmente, ropa seca y evacuación médica si es grave","Solo abrigar bien al paciente","Solo dar bebidas calientes y esperar","No es una emergencia grave a bordo"],0),
    Q("¿Cómo se inmoviliza una fractura según la guía médica OMI?",["Con férula que cubra las articulaciones por encima y por debajo de la fractura","Solo con vendaje compresivo apretado","Sin mover al paciente en ningún caso","Con hielo y vendaje únicamente"],0),
    Q("¿Cuáles son los síntomas de un infarto IAM según la guía médica OMI?",["Dolor en el pecho que irradia al brazo izquierdo, sudoración fría y dificultad para respirar","Solo dolor de pecho intenso","Solo mareos y pérdida de equilibrio","Solo náuseas y vómitos sin dolor"],0),
    Q("¿Qué es el servicio TMAS y para qué sirve?",["Asistencia médica telefónica disponible 24 horas para consultar con médico en tierra desde el buque","Solo para emergencias con víctimas múltiples","Solo en puertos con servicio médico","Solo para solicitar evacuación médica"],0),
    Q("¿Qué significa FAST para identificar un ACV?",["Face (cara caída), Arms (debilidad de brazo), Speech (dificultad al hablar), Time (evacuación urgente)","First Aid Safety Treatment","Fracture Assessment Stabilize Transfer","Fall Assess Stabilize Transfer"],0),
    Q("¿Cómo se trata un ojo con contacto de producto químico?",["Lavar con abundante agua corriente durante 15 a 20 minutos mínimo — no frotar","No lavar — cubrir con vendaje estéril","Solo cubrir el ojo con parche","Lavar solo 2 minutos y aplicar colirio"],0),
    Q("¿Qué se hace ante una convulsión según la guía médica OMI?",["Proteger a la persona de golpes sin sujetarla — no poner nada en la boca","Sujetar fuertemente los brazos y piernas","Poner un objeto en la boca","Dar agua cuando termine la convulsión"],0),
    Q("¿Qué es el botiquín SOLAS y qué debe contener?",["Kit médico mínimo requerido a bordo con medicamentos y equipos establecidos por la OMI","Solo vendas y antisépticos básicos","Solo medicamentos para emergencias graves","Solo lo que decide el capitán"],0),
    Q("¿Cuántas respiraciones normales por minuto tiene un adulto sano?",["12 a 20 respiraciones por minuto","30 a 40 respiraciones","6 a 10 respiraciones","25 a 30 respiraciones"],0),
    Q("¿Cuánto tiempo puede estar el cerebro sin oxígeno antes de sufrir daño irreversible?",["4 a 6 minutos — la RCP debe iniciarse inmediatamente","15 minutos con daño menor","1 minuto máximo absoluto","10 minutos si la temperatura es baja"],0),
    Q("¿Qué es el protocolo RICE para esguinces y contusiones?",["Rest (reposo), Ice (hielo), Compression (compresión), Elevation (elevación)","Rapid Intensive Clinical Emergency","Rest Immobilize Call Evacuate","Revise Inspect Check Examine"],0),
    Q("¿Qué hacer ante intoxicación por ingestión según la guía médica OMI?",["Llamar a TMAS, no inducir vómito salvo indicación médica, identificar la sustancia ingerida","Inducir vómito siempre como primera medida","Dar abundante agua con sal","Dar leche para neutralizar el tóxico"],0),
    Q("¿Cómo tratar una picadura de medusa según la guía médica OMI?",["Agua salada para limpiar, retirar tentáculos sin frotar — nunca agua dulce","Agua dulce abundante sobre la zona","Alcohol directamente sobre la picadura","Frotar con arena para limpiar"],0),
    Q("¿Cómo se trata una luxación a bordo según la guía médica OMI?",["Inmovilizar como está, aplicar frío y evacuar médicamente — no intentar reducir a bordo","Reducir la luxación inmediatamente","Masajear la articulación para reducirla","Aplicar calor y esperar resolución"],0),
    Q("¿Cuándo se solicita una evacuación médica MEDEVAC?",["Cuando el caso supera la capacidad de atención a bordo — solicitar por TMAS o autoridad marítima","Solo en naufragios con múltiples víctimas","Solo si hay médico que lo autorice","Solo en viajes a más de 500 millas de costa"],0),
    Q("¿Qué información se necesita al solicitar asistencia médica por TMAS?",["Descripción del paciente, síntomas, signos vitales, medicamentos disponibles y posición del buque","Solo el nombre del paciente y el diagnóstico","Solo la posición del buque y destino","Solo el tipo de emergencia"],0),
    Q("¿Qué documentación médica debe mantenerse según STCW A-VI/4?",["Registro del paciente con síntomas, tratamiento, evolución y consultas TMAS realizadas","Solo el diagnóstico final del médico en tierra","Solo los medicamentos administrados","Solo el nombre y número de pasaporte"],0),
    Q("¿Cuál es el protocolo ante sospecha de fractura de columna?",["No mover al paciente — inmovilizar en la posición encontrada — evacuación urgente","Sentar al paciente para facilitar la respiración","Trasladar inmediatamente al camarote","Solo analgésicos y esperar evolución"],0),
    Q("¿Qué formación exige el STCW A-VI/4 para personal designado a bordo?",["Formación avanzada en atención médica — para hacerse cargo de la asistencia sin médico","La misma formación básica del A-VI/1","Solo RCP avanzada con DEA","Solo primeros auxilios básicos"],0),
    Q("¿Cómo se trata la insolación o golpe de calor según la guía médica OMI?",["Refrescar al paciente, hidratarlo si está consciente y trasladarlo a lugar fresco con urgencia","Solo darle agua y dejarlo descansar","Solo aplicar hielo en frente y cuello","Solo llevarlo a la sombra sin más tratamiento"],0),
    Q("¿Qué es la regla de los 9 para evaluar la extensión de una quemadura?",["Método para calcular el porcentaje de superficie corporal quemada — cada zona representa el 9%","Solo se usa para quemaduras de tercer grado","Solo la aplica el médico de a bordo","No tiene aplicación en el tratamiento a bordo"],0),
  ],
  11:[
    Q("¿Qué es el Código IMDG y desde cuándo es obligatorio?",["Código Internacional de Mercancías Peligrosas por Mar — obligatorio desde 2004 para todos los buques","Solo recomendatorio para buques pequeños","Solo para tanqueros y portacontenedores","Obligatorio desde 1974 cuando fue creado"],0),
    Q("¿Cuántas clases de peligro tiene el Código IMDG?",["9 clases — desde explosivos hasta sustancias diversas peligrosas","7 clases","6 clases","12 clases"],0),
    Q("¿Qué es el número ONU de una mercancía peligrosa?",["Número único de 4 dígitos que identifica específicamente la sustancia peligrosa","El número de la clase de peligro","El número del grupo de embalaje","El peso máximo del paquete autorizado"],0),
    Q("¿Qué debe acompañar siempre a una mercancía peligrosa según el Código IMDG?",["Hoja de datos de seguridad SDS con información de peligros y medidas de manejo seguro","Solo la etiqueta de peligro en el embalaje","Solo el número ONU marcado en el exterior","Solo el certificado del fabricante"],0),
    Q("¿Qué información mínima debe contener el documento de transporte de MMPP?",["Nombre técnico correcto, número ONU, clase, grupo de embalaje y cantidad","Solo el nombre comercial del producto","Solo el número ONU y clase","Solo la cantidad y destino"],0),
    Q("¿Qué es la segregación de mercancías peligrosas según el Código IMDG?",["Separar cargas incompatibles para evitar reacciones peligrosas entre ellas","Almacenar todas las MMPP juntas en un solo lugar","Clasificar la carga por peso y tamaño","Ordenar los contenedores por destino portuario"],0),
    Q("¿Qué son las guías EmS del Código IMDG?",["Guías de respuesta a emergencias a bordo en caso de incendio o derrame de MMPP","Solo para incendios en sala de máquinas","Solo para derrames en cubierta","Solo información química sin procedimientos de respuesta"],0),
    Q("¿Qué son las MFAG del Código IMDG?",["Guías de primeros auxilios médicos para accidentes con mercancías peligrosas a bordo","Manual de Formación General para marineros","Solo para médicos certificados","Solo para el capitán del buque"],0),
    Q("¿Qué clase son los explosivos en el Código IMDG?",["Clase 1 — subdividida en 6 divisiones según sensibilidad y riesgo","Clase 2 — gases","Clase 3 — líquidos inflamables","Clase 4 — sólidos inflamables"],0),
    Q("¿Qué clase son los gases en el Código IMDG?",["Clase 2 — inflamables, no inflamables/no tóxicos y tóxicos","Clase 1 — explosivos","Clase 3 — líquidos inflamables","Clase 5 — oxidantes"],0),
    Q("¿Qué clase son los líquidos inflamables en el Código IMDG?",["Clase 3 — incluye gasolina, alcohol, acetona y otros con punto de inflamación bajo","Clase 2 — gases inflamables","Clase 4 — sólidos inflamables","Clase 6 — tóxicos"],0),
    Q("¿Qué clase son las sustancias corrosivas en el Código IMDG?",["Clase 8 — incluye ácidos, bases y otras sustancias que dañan tejidos vivos y materiales","Clase 6 — tóxicos","Clase 7 — radioactivos","Clase 9 — sustancias diversas"],0),
    Q("¿Qué EPP se usa para manipular sustancias corrosivas de clase 8?",["Guantes, gafas de protección química y ropa protectora resistente al producto","Solo guantes de látex","Solo gafas de seguridad general","Sin EPP especial si la cantidad es pequeña"],0),
    Q("¿Qué es el grupo de embalaje I en el Código IMDG?",["Peligro alto — requisitos de embalaje más estrictos del sistema","Peligro medio — grupo intermedio","Peligro bajo — requisitos mínimos","No aplica a todas las clases"],0),
    Q("¿Qué es la separación 'away from' en el Código IMDG?",["Las sustancias no deben estar en el mismo compartimento ni en cubiertas adyacentes","Solo separar en cubierta descubierta","Solo en bodegas bajo cubierta","Solo separar por 1 metro de distancia física"],0),
    Q("¿Qué es la declaración del expedidor para MMPP según el Código IMDG?",["Documento obligatorio del cargador con la información completa de la mercancía peligrosa","Es responsabilidad del armador prepararla","La firma el capitán del buque","La emite la autoridad portuaria"],0),
    Q("¿Qué se hace si se detecta fuga o derrame de mercancía peligrosa a bordo?",["Aislar el área, usar EPP adecuado, consultar las guías EmS y notificar al capitán","Solo limpiar sin EPP si la cantidad es pequeña","Solo notificar al capitán y esperar","Solo aislar la zona sin actuar"],0),
    Q("¿Qué es la clase 9 del Código IMDG?",["Sustancias y objetos peligrosos diversos no cubiertos por otras clases","Solo residuos industriales peligrosos","Solo productos químicos industriales varios","Solo sustancias que afectan el ozono"],0),
    Q("¿Con qué frecuencia se actualiza el Código IMDG?",["Cada 2 años — ediciones bienales con enmiendas aprobadas por la OMI","Cada 5 años","Solo cuando hay accidentes graves","Anualmente"],0),
    Q("¿Qué forma tienen las etiquetas de peligro del Código IMDG?",["Rombo (cuadrado a 45°) con símbolo de peligro y número de clase en la esquina inferior","Triángulo con el símbolo en el centro","Círculo con texto descriptivo","Rectángulo con colores y símbolo"],0),
    Q("¿Qué es la cantidad limitada LQ en el Código IMDG?",["Permite reducir algunos requisitos para pequeños embalajes de venta al por menor","Elimina todos los requisitos de transporte","Solo aplica en transporte aéreo","Solo en pequeños buques nacionales"],0),
    Q("¿Qué es el marcado de contaminante marino en el Código IMDG?",["Indica sustancia especialmente peligrosa para el ecosistema marino — precauciones adicionales obligatorias","Solo peligrosa para el agua potable","Solo para sustancias de clase 9","Sin requisitos adicionales de marcado"],0),
    Q("¿Qué formación deben tener los tripulantes que manejan MMPP?",["Formación específica en MMPP según el tipo de cargo — no basta con la formación básica","Solo la formación básica STCW A-VI/1","Solo experiencia práctica previa","Sin requisito de formación específica"],0),
    Q("¿Cuál es la lista especial de carga peligrosa que exige SOLAS VII?",["Lista disponible para el capitán antes de salir a la mar con toda la carga peligrosa","Solo en el manifiesto general de carga","Solo para la autoridad portuaria de destino","No es obligatoria según SOLAS"],0),
    Q("¿Qué complementa al Código IMDG para otros tipos de carga peligrosa?",["Código IBC para químicos a granel, Código IGC para gases y Código IMSBC para sólidos a granel","No tiene complementos — cubre todo","Solo el Código IBC para petroquímicos","Solo las normas nacionales de cada Estado"],0),
    Q("¿Qué es la separación 'separated from' y cómo difiere de 'away from'?",["Requiere separación en diferente bodega o cubierta — más estricta que 'away from'","Es exactamente igual que 'away from'","Solo requiere 2 metros de distancia física","Solo aplica para clase 1 explosivos"],0),
    Q("¿Qué son las sustancias de la clase 5.1 en el Código IMDG?",["Sustancias comburentes u oxidantes que liberan oxígeno intensificando la combustión","Peróxidos orgánicos autorreactivos","Líquidos inflamables de alta peligrosidad","Gases inflamables licuados"],0),
    Q("¿Qué exige la LNCM respecto al manejo de MMPP en puertos mexicanos?",["Cumplir el Código IMDG y la normativa nacional aplicable en todos los puertos","Solo normativa nacional sin IMDG","Solo en puertos con tráfico internacional","Sin obligaciones específicas en puertos pequeños"],0),
    Q("¿Qué son las sustancias radioactivas de clase 7 y qué regulación adicional se les aplica?",["Materiales que emiten radiación ionizante — además del IMDG deben cumplir regulaciones del OIEA","Solo las normas del Código IMDG son suficientes","Solo las normas nacionales de cada Estado","No tienen regulación adicional"],0),
    Q("¿Qué es el plan de carga de MMPP que exige SOLAS VII?",["Documento que debe presentarse al capitán y estar disponible para inspección en todo momento","Solo para el registro del armador","Solo para las autoridades del puerto de destino","No requiere presentación formal"],0),
  ],
  12:[
    Q("¿Qué certifica el título de ETR (Electro-Technical Rating) según STCW A-III/7?",["Formación específica en sistemas eléctricos, electrónicos y de control a bordo de buques","Solo conocimiento básico de electricidad","Solo experiencia práctica en sala de máquinas","Cualquier curso técnico eléctrico en tierra"],0),
    Q("¿Bajo qué supervisión trabaja el marinero electrotécnico según STCW A-III/7?",["Bajo supervisión de un oficial electrotécnico — puede hacer mantenimiento pero no trabajo independiente crítico","Completamente independiente en todos los trabajos","Solo mantenimiento básico de limpieza","Solo en instalaciones en tierra"],0),
    Q("¿Cuál es la ley de Ohm y cómo se aplica a bordo?",["V = I × R (Voltios = Amperios × Ohms) — base del cálculo eléctrico para dimensionar circuitos","V = I + R","I = V + R","R = V + I"],0),
    Q("¿Cuál es el voltaje típico a bordo para maquinaria según normas IEC y SOLAS?",["440V o 690V trifásico para maquinaria — 220V o 115V para servicios y alumbrado","Solo 220V en todos los sistemas","Solo 110V en toda la instalación","Solo 24V para todos los sistemas"],0),
    Q("¿Qué es el generador de emergencia y cuánto tarda en arrancar según SOLAS II-1?",["Fuente de energía de reserva — debe arrancar automáticamente en 45 segundos tras fallo del principal","Solo arranca manualmente cuando el capitán lo ordena","Arranca en 5 minutos según SOLAS","No tiene tiempo de arranque específico"],0),
    Q("¿Dónde debe ubicarse el cuadro eléctrico de emergencia según SOLAS II-1?",["Fuera de la sala de máquinas principal — accesible en caso de incendio","En la sala de máquinas junto al cuadro principal","En el puente de navegación","Junto al generador de emergencia en la cubierta"],0),
    Q("¿Qué es el procedimiento LOTO y por qué es obligatorio en trabajos eléctricos?",["Lockout-Tagout: bloquear y etiquetar la fuente de energía antes de trabajar — previene electrocución","Solo bajar el interruptor principal del circuito","Solo etiquetar sin bloquear físicamente","Solo informar verbalmente al oficial de guardia"],0),
    Q("¿Cuál es el valor mínimo aceptable de resistencia de aislamiento según norma IEC?",["1 MΩ mínimo para circuitos de 440V en condiciones normales de operación","100 Ω como mínimo aceptable","10 kΩ para instalaciones marinas","100 MΩ siempre para todas las instalaciones"],0),
    Q("¿Qué es el sistema de distribución IT (aislado de tierra) en buques?",["Permite continuar operando con el primer fallo de aislamiento — mayor continuidad que el sistema TN","Para inmediatamente ante el primer fallo de aislamiento","Es menos seguro que el sistema TN en tierra","Solo se usa en sistemas de baja tensión"],0),
    Q("¿Cuánto tiempo mínimo debe suministrar energía el banco de baterías de emergencia según SOLAS?",["Mínimo 30 minutos para equipos de emergencia según SOLAS II-1","Solo 5 minutos de autonomía","Solo 10 minutos de respaldo","Sin tiempo mínimo especificado en SOLAS"],0),
    Q("¿Qué es la prueba de aislamiento con megóhmetro y cuándo se realiza?",["Mide la resistencia del aislamiento para detectar fugas antes de que causen cortocircuito o accidente","Solo mide el voltaje del circuito","Solo mide la corriente de trabajo","Solo se usa para reparar cables rotos"],0),
    Q("¿Qué es la puesta a tierra en instalaciones eléctricas del buque?",["Conexión al casco para proteger al personal de descargas y prevenir corrosión galvánica","Solo para prevenir la corrosión del casco","Solo para proteger los equipos electrónicos","Solo para las antenas de comunicación"],0),
    Q("¿Para qué se usa el convertidor de frecuencia (variador de velocidad) a bordo?",["Controlar la velocidad de motores eléctricos optimizando el consumo energético del buque","Solo para motores de bombas de sentina","Solo para ventiladores de sala de máquinas","Solo para motores de las grúas de cubierta"],0),
    Q("¿Qué es la iluminación de emergencia y cuánto tiempo debe funcionar según SOLAS?",["Sistema con batería propia que ilumina vías de evacuación — mínimo 3 horas según SOLAS II-1","Solo durante la emergencia hasta que pase","Solo en pasillos de camarotes","Solo en el puente de navegación"],0),
    Q("¿Qué es el sistema ICCP de protección catódica a bordo?",["Protección catódica del casco mediante corriente continua controlada — previene corrosión electroquímica","Solo protege el propulsor y el timón","Solo funciona en dique seco","Solo complemento decorativo de la pintura"],0),
    Q("¿Qué tipo de cable debe usarse en sala de máquinas según norma IEC 60092?",["Cable resistente al aceite y retardante a la llama — IEC 60092-353 o norma similar aprobada","Cualquier cable de alta temperatura","Solo cables de silicona para alta temperatura","Solo cables minerales ignífugos siempre"],0),
    Q("¿Qué es el motor eléctrico asíncrono trifásico y por qué es el más común a bordo?",["Motor de inducción electromagnética — robusto, bajo mantenimiento y apto para ambientes marinos agresivos","Motor de corriente continua más eficiente","Motor de imanes permanentes más ligero","Motor de corriente pulsante más económico"],0),
    Q("¿Cuál es la frecuencia eléctrica más común en buques según norma IEC marina?",["60 Hz en buques americanos y asiáticos — 50 Hz en buques europeos según construcción","Siempre 60 Hz en todos los buques","Siempre 50 Hz en todos los buques","Depende de la potencia del generador"],0),
    Q("¿Qué formación específica exige el STCW A-III/7 para el ETR?",["Monitoreo y control de equipos eléctricos, electrónicos y de automatización bajo supervisión de oficial","Solo conocimiento básico de circuitos eléctricos","Solo mantenimiento mecánico básico","Solo operación de equipos sin mantenimiento"],0),
    Q("¿Para qué sirve el cable de fibra óptica en sistemas del buque?",["Transmisión de datos de alta velocidad — inmune a interferencias electromagnéticas del motor","Cable eléctrico de alta resistencia mecánica","Sistema de iluminación de emergencia especial","Sistema de sensores de temperatura del motor"],0),
    Q("¿Qué es el prensaestopas en instalaciones eléctricas y por qué es importante?",["Sello en el paso de cable por mamparos — mantiene la clasificación estanca o contra incendios del mamparo","Solo sujeción mecánica del cable al mamparo","Solo protección decorativa del cable","Solo aislamiento adicional del conductor"],0),
    Q("¿Qué es el alternador marino y qué tipo de corriente genera?",["Genera corriente alterna trifásica a la frecuencia y voltaje del sistema del buque","Genera corriente continua para las baterías","Genera corriente alterna monofásica siempre","Genera a cualquier frecuencia según la carga"],0),
    Q("¿Qué es la norma IEC 60092 y a qué aplica?",["Norma internacional para instalaciones eléctricas en buques — cables, equipos y sistemas de distribución","Solo para motores eléctricos marinos","Solo para generadores de buques","Solo para sistemas de alumbrado naval"],0),
    Q("¿Qué es la capacidad de corriente (ampacidad) de un cable y de qué depende?",["Corriente máxima sin sobrecalentarse — depende de sección, temperatura del aislamiento y agrupamiento","Solo de la sección del conductor","Solo del voltaje del sistema","Solo del material conductor del cable"],0),
    Q("¿Qué produce el sobrecalentamiento de cables en una instalación eléctrica marina?",["Degradación del aislamiento, riesgo de incendio y fallo del sistema eléctrico del buque","Solo una alarma temporal del sistema","Solo reducción de la eficiencia del motor","Solo corte momentáneo de la energía"],0),
    Q("¿Qué es el sistema de monitoreo de aislamiento IMR y para qué sirve?",["Detecta fallos de aislamiento en sistemas IT antes de que causen cortocircuito o accidente eléctrico","Solo mide el voltaje del sistema en tiempo real","Solo registra las horas de funcionamiento","Solo activa el interruptor principal en emergencias"],0),
    Q("¿Qué debe verificarse en el mantenimiento de baterías de emergencia según STCW A-III/7?",["Electrolito, nivel de carga, corrosión en terminales y capacidad según especificación del fabricante","Solo verificar el nivel de carga","Solo limpiar los terminales visiblemente","Solo medir el voltaje en circuito abierto"],0),
    Q("¿Qué exige la LNCM para instalaciones eléctricas en buques mexicanos?",["Cumplir normas internacionales reconocidas como IEC y SOLAS — certificadas por Organización Reconocida","Solo normativa nacional sin IEC","Solo la norma IEC sin certificación de OR","Sin requisito de certificación eléctrica específica"],0),
    Q("¿Por qué es importante el radio mínimo de curvatura en el tendido de cables?",["Evita dañar conductores y aislamiento — se especifica como múltiplo del diámetro del cable","Solo por apariencia estética de la instalación","Solo para facilitar la instalación mecánica","No tiene importancia técnica en instalaciones marinas"],0),
    Q("¿Qué es la bandeja portacables y qué requisitos tiene según norma IEC marina?",["Soporte metálico para organizar cables — instalarse con radio mínimo y soportes a intervalos regulares según norma","Solo soporte decorativo sin requisitos técnicos","Solo para cables de alta tensión","Solo en sala de máquinas y no en cubierta"],0),
  ],
  13:[
    Q("¿Cuánta cadena debe filarse normalmente al fondear según normas OMI?",["3 a 5 veces la profundidad del agua como mínimo para asegurar buen agarre del ancla","Igual a la profundidad del agua","El doble de la profundidad siempre","100 metros fijos independiente de la profundidad"],0),
    Q("¿Cómo se detecta el arrastre del ancla según normas de guardia de fondeo?",["Comparar posición GPS con la posición de fondeo registrada y tomar marcaciones a tierra","Solo por la sensación de movimiento del buque","Solo por el timonel que siente la deriva","Solo en condiciones de mal tiempo visible"],0),
    Q("¿Qué tipo de fondo es mejor para fondear según normas náuticas?",["Arena o fango que permitan buena penetración y agarre del ancla","Roca dura para mayor sujeción","Coral para mayor resistencia","Grava gruesa por su dureza"],0),
    Q("¿Qué es el arrastre del ancla y cuándo ocurre?",["Cuando el ancla no sujeta al buque y este deriva — por mal fondo, poca cadena o condiciones adversas","El ancla se mueve normalmente al cambiar el viento","Solo ocurre en mal tiempo extremo","Es una maniobra normal de ajuste de posición"],0),
    Q("¿Qué luz muestra un buque fondeado de noche según COLREG?",["Luz blanca de todo el horizonte en proa — dos si el buque mide más de 100 metros","Luces de navegación normales como en marcha","Solo la luz de alcance en popa","Solo una bola negra en el lugar más visible"],0),
    Q("¿Qué señal diurna muestra un buque fondeado según COLREG?",["Una bola negra en el lugar más visible de proa del buque","Bandera amarilla en el tope del palo mayor","Dos conos negros con los vértices juntos en vertical","Cilindro negro en el palo de señales"],0),
    Q("¿Qué es el molinete o cabrestante y cuál es su función?",["Máquina para largar y virar la cadena del ancla — debe probarse periódicamente según SOLAS","Tipo especial de ancla sin cepo","Sistema de amarre automático al muelle","Motor de cubierta para las grúas de carga"],0),
    Q("¿Qué indican las marcas en la cadena del ancla?",["La cantidad de cadena filada — marcas cada grillera a aproximadamente 27.5 metros","Marcas decorativas del fabricante","Marcas de inspección de la sociedad de clase","Indicadores de resistencia del eslabón"],0),
    Q("¿Qué es el stopper o retinida de cadena y para qué se usa?",["Dispositivo para mantener la cadena fija tomando la carga mientras se da vuelta en el molinete","Freno del molinete de cadena","Tipo especial de grillete de conexión","Parte del escobén del ancla"],0),
    Q("¿Cuándo se usa el fondeo con dos anclas?",["Cuando el espacio es limitado, el clima es adverso o se necesita mayor seguridad ante fuertes corrientes","Siempre como práctica estándar de seguridad","Solo en mal tiempo extremo con vientos fuertes","Solo en puertos muy congestionados"],0),
    Q("¿Qué debe verificarse antes de iniciar la maniobra de fondeo?",["Profundidad, espacio disponible, tipo de fondo, tráfico circundante y máquina en stand-by","Solo la profundidad del agua","Solo el espacio libre alrededor","Solo la dirección del viento y corriente"],0),
    Q("¿Qué es el ancla de capa o ancla flotante y para qué se usa?",["Ancla flotante para reducir la deriva y mantener el buque proa al mar en condiciones adversas","Ancla de reserva en caso de pérdida del ancla principal","Ancla ligera para fondear en zonas de coral","Tipo de ancla moderna sin cepo"],0),
    Q("¿Qué debe registrarse en el diario al fondear según STCW A-II/1?",["Posición, profundidad, cadena filada, tipo de fondo y condiciones meteorológicas del momento","Solo la posición geográfica del fondeo","Solo la hora de fondeo","Solo la profundidad del agua"],0),
    Q("¿Qué velocidad debe tener el buque al dar el ancla según normas OMI?",["Mínima o sin arrancada para evitar daños a la cadena y al equipo de fondeo","Velocidad normal de navegación para asegurar el ancla","La máxima posible para rapidez de la maniobra","Sin restricción específica de velocidad"],0),
    Q("¿Qué es el perímetro de seguridad al fondear y cómo se calcula?",["Cadena filada más la eslora del buque como radio mínimo para que otros buques mantengan su distancia","Solo la eslora del buque","Solo la longitud de la cadena filada","100 metros fijos en cualquier condición"],0),
    Q("¿Qué es el relojeo del ancla?",["Rotación del buque alrededor del ancla por cambio de viento o corriente — normal y esperable","Una avería del sistema de fondeo","Señal de arrastre del ancla siempre","Un error de maniobra grave"],0),
    Q("¿Qué es el cuarto de la cadena y qué requisito tiene según normas de construcción?",["Compartimento donde se almacena la cadena — debe ser estanco con medios de achique","Solo el lugar donde se opera el molinete","Solo el espacio de acceso al escobén","Espacio sin requisitos técnicos específicos"],0),
    Q("¿Qué es el grillete de ancla y qué verificación requiere?",["Eslabón especial que conecta el ancla a la cadena — pasador asegurado con contrapasador para evitar apertura","Solo un eslabón estándar de la cadena","Solo la conexión del ancla al escobén","No requiere verificación periódica"],0),
    Q("¿Qué tipo de ancla es el tipo Hall o sin cepo y por qué es el más usado?",["Ancla sin cepo de fácil estiba y buena retención en diferentes tipos de fondo marino","Ancla con cepo por mayor resistencia","Ancla de tipo CQR solo para yates","Ancla Danforth solo para embarcaciones pequeñas"],0),
    Q("¿Qué exige la LNCM respecto al fondeo en aguas nacionales?",["Notificación a la autoridad marítima y cumplimiento de las zonas de fondeo designadas oficialmente","Solo anclar en cualquier lugar libre","Sin requisitos en aguas libres","Solo notificación en puertos habilitados"],0),
    Q("¿Qué es la maniobra de levar el ancla?",["Recoger el ancla del fondo virandola con el molinete hasta quedarla estibada en el escobén","Solo aflojar la cadena para derivar","Cortar la cadena en emergencia","Limpiar el ancla con manguera a presión"],0),
    Q("¿Cuál es la profundidad segura mínima para fondear?",["Suficiente para que la quilla no toque el fondo en ninguna condición de marea ni movimiento del buque","Mínimo 10 metros en todos los casos","Igual al calado del buque sin margen","El doble del calado siempre"],0),
    Q("¿Qué comunicación se requiere entre puente y proa durante la maniobra de fondeo?",["Comunicación clara y continua por VHF portátil o señales acordadas — confirmación de órdenes","Solo por señas manuales del contramaestre","Solo por intercomunicador fijo sin VHF","Sin protocolo específico establecido"],0),
    Q("¿Qué es el escobén y qué requisito técnico tiene?",["Orificio en el casco por donde pasa la cadena — material resistente y diseño que evite desgaste excesivo","Solo decorativo del casco del buque","Solo para buques con ancla de tipo cepo","Sin requisito técnico específico"],0),
    Q("¿Por qué debe limpiarse el ancla al levarse según MARPOL?",["Limpiar con manguera de agua de mar antes de estibar para evitar introducir sedimentos contaminantes","Solo por apariencia y presentación del buque","Solo en puertos extranjeros","No requiere limpieza según MARPOL"],0),
    Q("¿Qué debe hacerse si el ancla no agarra al fondo?",["Filar más cadena, cambiar de posición o fondear en dos anclas según las circunstancias","Largar la segunda ancla de inmediato siempre","Llamar a un remolcador inmediatamente","Continuar derivando hasta encontrar mejor fondo"],0),
    Q("¿Qué es la maniobra de dar el ancla?",["Procedimiento controlado para largar el ancla al fondo en el lugar elegido para el fondeo","Procedimiento para levar el ancla del fondo","Maniobra de emergencia de varada","Procedimiento de amarre a una boya"],0),
    Q("¿Cuándo se usa la maniobra de fondeo de emergencia?",["Cuando hay pérdida de control o avería crítica de máquinas y es necesario detener el buque urgentemente","Solo como último recurso ante varada inminente","Solo si no hay remolcadores disponibles","Solo en alta mar a más de 12 millas de costa"],0),
    Q("¿Qué inspección requiere el equipo de fondeo según normas de clasificación y SOLAS?",["Verificación periódica de desgaste, grilletes, pasadores y estado general — en cada escala en dique seco","Solo inspección visual desde cubierta","Solo en el primer año de servicio del buque","Solo cuando hay incidente o avería"],0),
    Q("¿Qué es la guardia de fondeo y qué debe verificar periódicamente?",["Turno de vigilancia mientras el buque está fondeado — verifica posición, cadena, meteorología y tráfico","Solo registrar la hora","Solo verificar el tiempo atmosférico","Solo informar al capitán al inicio de la guardia"],0),
  ],
  14:[
    Q("¿Cuál es la función principal de los sistemas de pintura en un buque?",["Proteger el casco y estructuras contra la corrosión y la bioincrustación marina","Solo función decorativa e identificación del buque","Solo impermeabilización de las cubiertas","Solo protección contra el impacto físico"],0),
    Q("¿Qué es la corrosión en estructuras metálicas de un buque?",["Deterioro del metal por reacción química o electroquímica con el ambiente marino","Solo daño mecánico por impacto o abrasión","Solo desgaste gradual por uso intensivo","Solo deterioro por exposición al calor excesivo"],0),
    Q("¿Qué establece la Resolución MSC.215(82) de la OMI respecto a la pintura?",["El estándar PSPC para tanques de lastre — preparación Sa 2.5 y mínimo 320 micras DFT","Solo la pintura antiincrustante del casco","Solo los colores del casco en diferentes tipos de buque","Solo la pintura de cubierta en buques de pasaje"],0),
    Q("¿Qué prohíbe el Convenio AFS de la OMI respecto a los sistemas antiincrustantes?",["El tributilestaño TBT en pinturas antiincrustantes desde 2008 por ser contaminante marino","Solo las pinturas con plomo en su composición","Solo los solventes con alto contenido de VOC","Solo las pinturas no aprobadas por la OMI"],0),
    Q("¿Qué significa el estándar de preparación Sa 2.5 en trabajos de pintura naval?",["Limpieza casi blanca — solo quedan manchas leves en no más del 5% de la superficie preparada","Limpieza total al metal blanco (Sa 3)","Limpieza parcial con herramienta mecánica (Sa 2)","Solo cepillado manual sin presión (St 3)"],0),
    Q("¿Qué es el DFT (Dry Film Thickness) y cómo se mide?",["Espesor de película seca — se mide con instrumento magnético según norma ISO 2808","Grosor antes de aplicar la pintura húmeda","Viscosidad de la pintura en la lata","Concentración del solvente en la mezcla"],0),
    Q("¿Cuántas capas tiene típicamente un sistema de pintura naval?",["3 capas: imprimación, capa media y acabado — cada una con función específica","Solo 1 capa gruesa de alta resistencia","2 capas siempre sin excepción","5 capas mínimas obligatorias"],0),
    Q("¿Qué es la imprimación o primer en un sistema de pintura naval?",["Primera capa que adhiere al metal y proporciona protección básica contra la corrosión","Solo la capa de acabado decorativo","Solo el recubrimiento final de alta resistencia","Solo la pintura de señalización de cubierta"],0),
    Q("¿Qué condición meteorológica impide la aplicación de pintura según normas técnicas?",["Lluvia, alta humedad relativa y temperatura demasiado baja o alta — afectan adhesión y curado","Solo lluvia directa sobre la superficie","Solo temperaturas bajo 0°C","Nunca hay restricciones meteorológicas"],0),
    Q("¿Qué es la temperatura de rocío y por qué importa al pintar?",["Temperatura a la que condensa el vapor de agua — la superficie debe estar al menos 3°C por encima","La temperatura mínima de aplicación de la pintura","La temperatura óptima de curado del epóxico","La temperatura de ebullición del solvente"],0),
    Q("¿Qué EPP es obligatorio para aplicar pinturas epóxicas según normas de seguridad?",["Respirador con filtros orgánicos, gafas herméticas, guantes y ropa protectora completa","Solo mascarilla quirúrgica y guantes","Solo gafas de seguridad general","Sin EPP especial para pinturas en aplicación normal"],0),
    Q("¿Qué son los ánodos de sacrificio y cómo protegen el casco?",["Zinc o aluminio que se corroen sacrificándose — protegen galvánicamente el acero del casco","Tipo de pintura especial de alta resistencia","Sistema eléctrico de protección activa","Recubrimiento de plástico que evita el contacto"],0),
    Q("¿Qué es la corrosión galvánica y cuándo ocurre?",["Corrosión acelerada entre dos metales de diferente potencial electroquímico en contacto con agua salada","Cualquier metal en agua marina sin contacto con otro","Solo con corriente eléctrica activa y externa","Solo en agua dulce o en ríos"],0),
    Q("¿Qué es la pintura antiincrustante de silicona (foul release) y en qué difiere del antifouling tradicional?",["No libera biocidas — el biofouling no se adhiere por baja energía superficial de la pintura","Libera biocidas controlados como el antifouling clásico","Contiene TBT permitido en dosis controladas","Es exactamente igual al antifouling tradicional de biocidas"],0),
    Q("¿Qué es el stripe coat y para qué se aplica?",["Capa adicional aplicada manualmente en bordes, soldaduras y cantos antes o después de la capa general","Solo la capa de acabado decorativo","Solo la primera capa de imprimación básica","Solo en zonas visibles de la superestructura"],0),
    Q("¿Cuándo se realiza el mantenimiento completo de pintura de un buque?",["En dique seco cada 2.5 a 5 años según el tipo de buque y la sociedad de clasificación","Anualmente como mínimo obligatorio","Solo cuando hay daño visible significativo","Cada 10 años según el programa del armador"],0),
    Q("¿Qué es el holiday en la inspección de pintura y cómo se detecta?",["Área sin cobertura de pintura o con espesor insuficiente — se detecta con holiday detector o visual","Solo área mal acabada estéticamente","Solo defecto mecánico de la superficie","Área correctamente aplicada y curada"],0),
    Q("¿Qué es la bioincrustación (fouling) y qué problemas causa?",["Acumulación de organismos marinos en el casco — aumenta resistencia, consumo y emisiones de CO₂","Solo problemas de apariencia del casco","Solo corrosión bajo los organismos","Solo problema en dique seco para limpiar"],0),
    Q("¿Qué es la pintura epóxica y por qué se usa en sistemas navales?",["Pintura de alta resistencia química de dos componentes — ideal para tanques, bodegas y obra viva","Pintura de un solo componente de fácil aplicación","Solo pintura acrílica para superestructura","Solo pintura alquídica para cubierta"],0),
    Q("¿Qué es el libro de registro de recubrimientos CRS para tanques de lastre?",["Documento OMI que registra toda la historia del sistema de recubrimiento del tanque para seguimiento","Solo registro de inspecciones visuales","Solo para la sociedad de clasificación","Optativo para el armador sin valor legal"],0),
    Q("¿Qué exige la LNCM respecto al manejo de residuos de pintura en dique seco?",["Cumplir normas de protección ambiental — residuos de pintura son peligrosos y deben gestionarse correctamente","Solo las normas del astillero sin requisitos adicionales","Solo normativa de pintura nacional","Sin requisitos específicos de gestión ambiental"],0),
    Q("¿Qué es la pintura de zinc enriquecido (zinc-rich primer) y cómo protege?",["Protege por acción galvánica del zinc que se sacrifica antes que el acero del casco","Solo barrera física sin efecto galvánico","Solo por su alto espesor de película","Solo por el color que facilita la inspección"],0),
    Q("¿Por qué es importante respetar el intervalo entre capas de pintura?",["Asegurar la correcta adhesión entre capas — hay tiempo mínimo y máximo especificados por el fabricante","Solo es tiempo de espera sin importancia técnica","Solo el tiempo mínimo importa sin máximo","No tiene importancia técnica para el resultado"],0),
    Q("¿Qué es la zona de chapoteo o boot topping en un buque?",["Área entre la línea de carga máxima y mínima — zona de máximo desgaste por chapoteo continuo","Solo zona decorativa de color diferente","Solo zona bajo el agua permanentemente","Solo la superestructura sobre cubierta principal"],0),
    Q("¿Qué es el spot repair y cuándo se realiza?",["Reparación localizada de áreas dañadas siguiendo el mismo sistema de pintura original y documentándolo","Reparación total del casco en dique seco","Tipo especial de pintura de alta resistencia","Solo reparación de zonas decorativas visibles"],0),
    Q("¿Cómo deben gestionarse los residuos de pintura según MARPOL?",["Son residuos peligrosos — deben contenerse y desembarcarse en instalaciones portuarias autorizadas","Pueden descargarse al mar en alta mar","Pueden quemarse a bordo sin restricciones","No son residuos peligrosos según MARPOL"],0),
    Q("¿Qué es la viscosidad de una pintura y cómo se ajusta?",["Resistencia al flujo — se ajusta con el diluyente recomendado por el fabricante en la proporción especificada","Solo el color visual de la pintura","Solo el tiempo de secado del sistema","Solo la concentración del pigmento protector"],0),
    Q("¿Por qué debe verificarse la compatibilidad entre sistemas de pintura?",["No todos los primarios son compatibles con todos los acabados — verificar antes de mezclar sistemas","No es importante si los colores son similares","Solo entre diferentes marcas comerciales","Solo si hay daños visibles en la aplicación"],0),
    Q("¿Qué certifica el Convenio AFS de la OMI sobre el sistema antiincrustante del buque?",["Certificado obligatorio para buques de 400 GT o más — documenta el tipo de sistema usado en el casco","Solo recomendatorio sin obligación legal","Solo para buques nuevos en su primer dique seco","Solo en viajes internacionales fuera de la ZEE"],0),
    Q("¿Qué es el plan de pintura del buque y qué importancia tiene?",["Documenta el sistema especificado por zona y se conserva para referencia en reparaciones futuras","Solo registro administrativo del armador","Solo para la sociedad de clasificación","No es obligatorio conservarlo a bordo"],0),
  ],
  15:[
    Q("¿Qué debe incluir el plan de maniobra para entrar a puerto según STCW A-II/1?",["Estudio de cartas, mareas, corrientes, vientos, disponibilidad de remolcadores y disposición de amarras","Solo la derrota de aproximación","Solo los remolcadores necesarios","Solo las condiciones meteorológicas previstas"],0),
    Q("¿Qué es el efecto de hélice en un buque con hélice de paso fijo a babor?",["Tendencia a caer a estribor avante y a babor en marcha atrás — debe considerarse en la maniobra","Es igual en ambas direcciones de giro","Solo afecta en marcha atrás a baja velocidad","No es relevante para maniobras en puerto"],0),
    Q("¿Cuándo es más efectivo el bow thruster o propulsor transversal de proa?",["Cuando el buque está parado o a muy baja velocidad — pierde efectividad al aumentar la arrancada","A cualquier velocidad de navegación","Solo a velocidades superiores a 5 nudos","Solo en aguas tranquilas sin corriente"],0),
    Q("¿Para qué se usa la maniobra de Williamson según STCW?",["Regresar al punto exacto de origen en caso de MOB — control preciso del retorno a la posición","Solo para emergencias de máquinas en tránsito","Solo en alta mar sin restricciones de tráfico","Solo en buques de pasaje de gran eslora"],0),
    Q("¿Qué es el efecto banco en canales angostos?",["Atracción del casco hacia la orilla o talud por el flujo de agua entre el casco y el fondo o la orilla","Repulsión del buque de las orillas del canal","Aumento de la velocidad por el efecto venturi","Reducción del calado por la presión del agua"],0),
    Q("¿Qué es la interacción entre buques que se cruzan o adelantan según normas OMI?",["Fuerzas de atracción y repulsión que actúan sobre los cascos — deben anticiparse y manejarse con prudencia","No existe tal efecto entre buques modernos","Solo en alta mar con vientos fuertes","Solo entre buques de muy diferente eslora"],0),
    Q("¿Qué posición legal tiene el práctico de puerto respecto al capitán según la LNCM?",["Asiste al capitán en la maniobra pero no lo releva de su responsabilidad sobre la seguridad del buque","Toma el mando legal completo del buque","Es responsable de los daños durante la maniobra","Sustituye legalmente al capitán en puerto"],0),
    Q("¿Qué es la distancia de parada del buque y por qué es crítica?",["Distancia recorrida desde máquina atrás hasta detenerse completamente — puede ser varios largos de eslora","Es siempre igual a la eslora del buque","Es de 100 metros para cualquier buque","No es relevante para la planificación de maniobras"],0),
    Q("¿Qué es el punto de pivote de un buque y dónde se encuentra?",["Punto alrededor del cual gira el buque — se desplaza hacia proa con arrancada y hacia popa sin ella","Siempre en el centro exacto del buque","En la proa donde está el ancla","En la popa donde está el timón"],0),
    Q("¿Qué es el plan de contingencia de maniobra y qué debe contemplar?",["Fallo de máquinas, fallo del timón, pérdida del remolcador y condiciones meteorológicas adversas","Solo el fallo de las máquinas principales","Solo el fallo del timón hidráulico","Solo el mal tiempo imprevisto"],0),
    Q("¿Qué es la velocidad mínima de gobierno de un buque?",["Velocidad mínima a la que el timón es efectivo para gobernar el buque — específica para cada buque","Igual para todos los buques del mismo tipo","Solo depende del tamaño del timón","La misma que la velocidad de parada"],0),
    Q("¿Qué exige el STCW A-II/1 respecto al briefing de maniobra?",["Plan detallado, roles del personal asignado, señales de comunicación y contingencias previstas","Solo el plan básico de aproximación","Solo los roles de cubierta de proa y popa","Solo las señales de comunicación entre puente y proa"],0),
    Q("¿Qué comunicación se requiere entre puente y cubierta durante la maniobra de amarre?",["VHF portátil preferido — establecerse antes de iniciar y verificarse con prueba de comunicación","Solo señas manuales del contramaestre al puente","Solo megáfono desde el alerón del puente","Sin protocolo específico obligatorio"],0),
    Q("¿Para qué se usan los remolcadores de escolta según normas OMI?",["Controlar velocidad y dirección de buques grandes en canales y accesos portuarios críticos","Solo para asistir en el atraque final al muelle","Solo cuando hay mal tiempo declarado","Solo para maniobras de emergencia grave"],0),
    Q("¿Qué puede ordenar la capitanía de puerto según el Reglamento de la LNCM?",["Exigir el uso de remolcadores y práctico en buques de cierto tamaño o condición — por razones de seguridad","Solo recomendarlos sin obligación","Solo en condiciones de emergencia declarada","Sin autoridad sobre las maniobras del buque"],0),
    Q("¿Qué autoridad tiene el capitán respecto a la maniobra según la LNCM?",["Autoridad máxima para determinar la seguridad — puede negarse a zarpar si considera riesgo para el buque","Solo seguir instrucciones del armador y el práctico","Compartida por igual con el práctico de puerto","Delegada al primer oficial durante la maniobra"],0),
    Q("¿Qué efecto tienen las corrientes de marea en la maniobra de atraque?",["Pueden usarse a favor o resistirse en contra — se planifican con el estudio de mareas previo a la maniobra","No afectan la maniobra con remolcadores","Solo importan en puertos con mareas superiores a 3 metros","Solo en el desatraque, no en el atraque"],0),
    Q("¿Qué es la maniobra de fondeo de emergencia y cuándo se usa?",["Fondear urgentemente para detener el buque cuando hay pérdida de control o avería crítica de máquinas","Solo como último recurso ante varada inminente","Solo si no hay remolcadores disponibles en el área","Solo en alta mar a más de 12 millas de costa"],0),
    Q("¿Qué debe registrarse en el diario de maniobras según normas OMI y STCW?",["Hora, posición, acciones tomadas, órdenes de máquina, timón y eventos relevantes de la maniobra","Solo la hora de inicio y fin de la maniobra","Solo la posición de fondeo o atracada","Solo los eventos de emergencia durante la maniobra"],0),
    Q("¿Qué es el abatimiento en la maniobra y cómo se corrige?",["Deriva lateral del buque por viento o corriente — se corrige con ángulo de compensación en el rumbo","Efecto del timón al girar el buque","Velocidad de giro del buque sobre su eje","Frenada natural del buque al reducir máquinas"],0),
    Q("¿Qué es el círculo de evolución del buque y por qué debe conocerse?",["Diámetro que traza el buque al dar una vuelta completa — necesario para planificar maniobras en espacios limitados","Solo el radio de giro a velocidad máxima","La distancia de parada a velocidad de maniobra","El espacio libre necesario para fondear"],0),
    Q("¿Cuándo se requiere un plan de maniobra formal según normas OMI?",["En puertos congestionados, condiciones de mal tiempo, calado crítico o cualquier condición difícil","Solo en puertos extranjeros desconocidos","Solo cuando lo exige el práctico de puerto","Solo para buques que llevan mercancías peligrosas"],0),
    Q("¿Qué es la hélice de paso variable y cuál es su ventaja en maniobras?",["Hélice cuyo ángulo de palas puede modificarse — permite avanzar, parar o retroceder sin invertir el motor","Hélice de emergencia adicional en la popa","Hélice de proa para maniobras en puerto","Hélice principal de mayor potencia para oceánica"],0),
    Q("¿Qué es el telegráfico entre puente y sala de máquinas?",["Sistema de comunicación para transmitir órdenes de máquina del puente a la sala de máquinas","Sistema de comunicación de radio con el puerto","Tipo de teléfono especial de emergencia","Sistema de alarma de máquinas automático"],0),
    Q("¿Qué es la manga del buque y cómo afecta la maniobra?",["Anchura máxima del buque — determina el espacio libre necesario en canales, puentes y atraques","Solo la longitud total del buque","La altura de la superestructura sobre cubierta","El calado máximo del buque cargado"],0),
    Q("¿Cuándo se establece el stand-by engines o máquina en espera?",["Antes de entrar en aguas de maniobra — máquina lista para respuesta inmediata a cualquier orden","Solo al iniciar la aproximación al muelle","Solo cuando el práctico sube a bordo","Solo en condiciones de visibilidad reducida"],0),
    Q("¿Qué es el piloto automático y cuándo NO debe usarse según normas OMI?",["Sistema que mantiene el rumbo — no debe usarse en canales angostos, puertos ni zonas de tráfico denso","Solo en alta mar con buen tiempo","Puede usarse siempre con guardia de radar","Solo se desconecta en emergencias graves"],0),
    Q("¿Qué es la maniobra de desatraque y qué debe verificarse antes de iniciarla?",["Separar el buque del muelle — verificar que todas las amarras están libres, tráfico libre y máquina en stand-by","Solo largar las amarras en el orden correcto","Solo verificar que el tráfico esté libre","Solo confirmar que la máquina está disponible"],0),
    Q("¿Qué es el calado del buque y cómo afecta la maniobra en puertos?",["Profundidad del buque bajo el agua — determina los puertos y rutas accesibles con margen de seguridad suficiente","Solo la longitud del buque","La anchura máxima del casco","La altura de la superestructura"],0),
    Q("¿Qué es la quilla del buque y cuál es su función estructural?",["Estructura longitudinal inferior del casco — es la columna vertebral del buque que da rigidez al casco","Solo la parte delantera del buque","Solo la cubierta principal del buque","Solo el timón del buque"],0),
  ],
  16:[
    Q("¿Qué es el Código ISM y desde cuándo es obligatorio según SOLAS IX?",["Código Internacional de Gestión de la Seguridad — obligatorio desde 1998 para pasaje y tanqueros, 2002 para el resto","Solo recomendatorio para todos los buques","Obligatorio desde 1974 como parte original de SOLAS","Solo para buques de más de 10000 GT"],0),
    Q("¿Qué certifica el DOC (Documento de Conformidad) según el Código ISM?",["Que la compañía naviera tiene un SMS que cumple el Código ISM — lo tiene la compañía, no el buque","Que el buque individual cumple el SMS","Que el capitán tiene competencia ISM","Que la autoridad portuaria aprobó el sistema"],0),
    Q("¿Qué certifica el SMC (Certificado de Gestión de la Seguridad) según el Código ISM?",["Que el buque individual opera según el SMS de la compañía — lo tiene el buque, no la compañía","Que la compañía tiene un sistema SMS","Que el capitán cumple el Código ISM","Que el DPA aprobó el sistema del buque"],0),
    Q("¿Cuál es la función del DPA (Designated Person Ashore) según el Código ISM?",["Enlace directo entre el buque y la alta gerencia — con acceso a los más altos niveles para temas de seguridad","Solo recibir reportes de incidentes del buque","Solo realizar auditorías anuales al buque","Solo gestionar los certificados del buque"],0),
    Q("¿Cuál es el objetivo principal del Código ISM según SOLAS IX?",["Garantizar seguridad en el mar, prevenir lesiones y muertes y proteger el medio marino","Solo reducir el número de accidentes marítimos","Solo cumplir los requisitos de certificación SOLAS","Solo proteger la carga transportada"],0),
    Q("¿Qué es una no conformidad NC según el Código ISM?",["Situación observable donde existe evidencia de incumplimiento de los requisitos del SMS","Solo un accidente con víctimas a bordo","Solo una avería grave del equipo principal","Solo un reporte de casi-accidente sin consecuencias"],0),
    Q("¿Qué es una NC mayor según el Código ISM y cuál puede ser su consecuencia?",["Fallo significativo en implementar el SMS — puede llevar a la retención del buque en puerto","Solo problema menor de documentación","Solo insuficiencia de formación del personal","Solo deficiencia en el mantenimiento preventivo"],0),
    Q("¿Con qué frecuencia mínima debe realizarse la auditoría interna del SMS?",["Anualmente como mínimo — para verificar que todos los elementos del SMS funcionan correctamente","Solo cuando hay accidentes o incidentes graves","Solo antes de las auditorías externas de clasificación","Cada 5 años con la renovación del certificado"],0),
    Q("¿Cuál es la validez del DOC según el Código ISM?",["5 años con auditoría intermedia en el año 2.5 más o menos 6 meses","1 año con renovación anual obligatoria","3 años con una verificación intermedia","10 años sin auditorías intermedias"],0),
    Q("¿Por qué debe reportarse un casi-accidente (near miss) según el Código ISM?",["Para aprender de experiencias peligrosas y prevenir accidentes futuros antes de que causen daño real","Solo porque lo exige la ley en todos los casos","Solo para sancionar a los responsables identificados","Solo para las estadísticas de seguridad del armador"],0),
    Q("¿Qué autoridad tiene el capitán según el Código ISM para tomar decisiones de seguridad?",["Puede tomar cualquier decisión necesaria para la seguridad — incluyendo negarse a zarpar independientemente de instrucciones del armador","Solo seguir instrucciones del armador y el DPA","Solo con aprobación previa del DPA para decisiones importantes","Comparte la autoridad igual con el armador"],0),
    Q("¿Qué debe cubrir mínimamente el plan de respuesta a emergencias del SMS?",["Incendio, inundación, colisión, embarrancamiento, abandono y hombre al agua como mínimo obligatorio","Solo incendio y abandono del buque","Solo colisión e inundación por ser las más probables","Cada compañía decide qué emergencias cubrir"],0),
    Q("¿Cuál es el objetivo de la investigación de accidentes según el Código ISM?",["Identificar causas raíz para implementar acciones correctivas y preventivas — no para castigar","Determinar los culpables y sancionarlos","Solo para los informes de seguros del buque","Solo para notificar a las autoridades competentes"],0),
    Q("¿Para qué trabajos es obligatorio el permiso de trabajo según el SMS del Código ISM?",["Espacios confinados, trabajos en caliente, trabajos en altura y trabajos eléctricos de alto riesgo","Solo trabajos en altura sobre 2 metros","Solo espacios confinados de sala de máquinas","Solo trabajos en caliente con llama abierta"],0),
    Q("¿Qué es el briefing previo a la tarea o toolbox talk según el Código ISM?",["Reunión previa para revisar riesgos específicos, medidas preventivas y roles de cada persona en el trabajo","Solo informar del trabajo asignado a cada uno","Solo asignar las funciones de cada persona","Solo verificar que el EPP está disponible"],0),
    Q("¿Qué es la cultura de seguridad según el Código ISM y la OMI?",["Valores, actitudes y comportamientos que priorizan la seguridad en todos los niveles de la organización","Solo seguir las reglas escritas del SMS","Solo usar el EPP obligatorio en cada trabajo","Solo hacer los simulacros programados"],0),
    Q("¿Qué es la mejora continua del SMS y cómo se logra?",["Proceso permanente mediante auditorías, revisiones, reportes de incidentes y acciones correctivas sistemáticas","Solo actualizar los documentos del SMS periódicamente","Solo mediante auditorías externas de clasificación","Solo con mayor capacitación del personal"],0),
    Q("¿Cuál es el concepto de liderazgo en seguridad según el Código ISM?",["El comportamiento de la alta gerencia y del capitán determina la cultura de seguridad de toda la organización","Solo es responsabilidad del oficial de seguridad SSO","Solo es responsabilidad del capitán a bordo","No está específicamente en el Código ISM"],0),
    Q("¿Qué es la acción correctiva según el SMS del Código ISM?",["Medida para eliminar la causa raíz del problema para que no se repita — no solo remediar el síntoma","Solo reparar el equipo o sistema averiado","Solo sancionar al responsable identificado","Solo registrar el incidente en el SMS"],0),
    Q("¿A qué buques aplica obligatoriamente el Código ISM en viajes internacionales?",["500 GT o más: pasaje, tanqueros, graneleros, portacontenedores y otros buques de carga","Solo buques de más de 5000 GT en todos los tipos","Solo buques de pasaje de cualquier tamaño","Solo tanqueros y graneleros por su peligrosidad"],0),
    Q("¿Qué debe incluir el manual del SMS según el Código ISM?",["Políticas, procedimientos, instrucciones y roles para todas las operaciones y emergencias del buque","Solo los procedimientos de emergencia","Solo la política de seguridad de la compañía","Solo los formularios de registro obligatorios"],0),
    Q("¿Qué es la fatiga en el contexto del Código ISM?",["Factor de riesgo crítico reconocido que debe gestionarse activamente dentro del SMS del buque","Solo un problema personal del marino","Solo un tema de salud laboral del MLC","No está regulada específicamente por el ISM"],0),
    Q("¿Qué exige la LNCM respecto al cumplimiento del Código ISM para buques mexicanos?",["Los buques mexicanos deben cumplir el Código ISM según lo establecido en SOLAS IX","Solo lo cumplen voluntariamente como buena práctica","Solo en viajes internacionales fuera de la ZEE","Solo si tienen más de 5000 GT de arqueo bruto"],0),
    Q("¿Qué es el SMS (Safety Management System) y qué abarca?",["Sistema estructurado con políticas, procedimientos y recursos para gestionar la seguridad y el medio ambiente","Solo los procedimientos de emergencia del buque","Solo el sistema de mantenimiento preventivo","Solo los requisitos de documentación de SOLAS"],0),
    Q("¿Qué es el check-list de seguridad en el contexto del Código ISM?",["Lista de verificación de puntos críticos que asegura que se cumplen todos los pasos antes de una operación","Solo un formulario administrativo del SMS","Solo la lista de equipos de seguridad a bordo","Solo el registro de simulacros realizados"],0),
    Q("¿Cómo deben documentarse los simulacros y drills según el Código ISM?",["En el diario del buque con fecha, participantes, descripción del ejercicio y observaciones de mejora","Solo registrarlos sin descripción del ejercicio","Solo avisarlos al DPA sin documentación en el diario","Solo documentarlos si hay fallos o incidencias"],0),
    Q("¿Qué es la evaluación de riesgos en el contexto del SMS del Código ISM?",["Identificar peligros y evaluar probabilidad e impacto para implementar medidas de control adecuadas","Solo listar los peligros conocidos del buque","Solo registrar los accidentes ocurridos","Solo las medidas preventivas del equipo de seguridad"],0),
    Q("¿Quién es el responsable principal del SMS a bordo según el Código ISM?",["El capitán como máxima autoridad a bordo — con el apoyo del DPA y la compañía","Solo el oficial de seguridad SSO designado","Solo el DPA desde tierra por su acceso a la gerencia","El primer oficial como responsable de operaciones"],0),
    Q("¿Qué es la revisión por la gerencia del SMS y con qué frecuencia se realiza?",["Evaluación periódica de la eficacia del sistema por la alta dirección — documenta mejoras necesarias","Solo la revisión anual del capitán a bordo","Solo la auditoría de la sociedad de clasificación","Solo la revisión del DPA sin participación de gerencia"],0),
    Q("¿Qué es el reporte de accidentes e incidentes peligrosos según el Código ISM?",["Obligatorio a la Administración y a la OMI en los casos que el Código establece — para aprendizaje global","Solo a la compañía naviera internamente","Solo al DPA para gestión interna del SMS","Solo internamente sin obligación de reporte externo"],0),
  ],
  17:[
    Q("¿Qué es el plan de carga de un buque y quién lo aprueba?",["Documento que muestra la distribución de carga — aprobado por el capitán como responsable final","Solo el primer oficial lo aprueba y firma","Solo la compañía naviera desde tierra lo aprueba","La autoridad portuaria debe aprobarlo antes de cargar"],0),
    Q("¿Qué es la estabilidad del buque y por qué es crítica?",["Capacidad del buque de retornar a la posición vertical — determina la seguridad de la navegación","Solo la resistencia del casco a impactos","Solo el comportamiento del buque en corrientes","Solo relevante para buques de pasaje"],0),
    Q("¿Qué es el GM y qué indica sobre la estabilidad del buque?",["Altura metacéntrica — distancia entre centro de gravedad G y metacentro M — GM positivo indica estabilidad","Solo el peso total de la carga a bordo","Solo la altura del centro de gravedad del buque","Solo el volumen del casco sumergido"],0),
    Q("¿Qué es el Código IMSBC y qué regula?",["Código Internacional de Carga Sólida a Granel — regula el transporte seguro de minerales, granos y otros sólidos","Solo el transporte de granos en graneleros","Solo el transporte de minerales metálicos","Solo residuos industriales sólidos a granel"],0),
    Q("¿Qué son los sólidos a granel del grupo A según el Código IMSBC?",["Pueden licuarse — requieren prueba de humedad transportable TML antes de embarcar","Los más seguros sin requisitos especiales","Los más peligrosos de toda la clasificación","Los que contienen sustancias radioactivas"],0),
    Q("¿Qué es el Código IBC y qué regula?",["Código Internacional para la construcción y el equipo de buques tanqueros de productos químicos","Solo para buques tanqueros de crudo","Solo para buques gaseros de LNG y LPG","Solo para todos los líquidos a granel sin excepción"],0),
    Q("¿Qué es el Código IGC y para qué buques aplica?",["Código Internacional para el transporte de gases licuados a granel — LNG y LPG principalmente","Solo para buques de transporte de CO₂","Solo para buques de transporte de cloro","Solo para cualquier gas sin importar el tipo"],0),
    Q("¿Qué es el CSS Code y qué establece?",["Código de Prácticas para la Estiba y la Sujeción de la Carga — normas para trincado seguro incluyendo contenedores","Solo para la estiba de contenedores en cubierta","Solo para la carga a granel sin contenedores","Solo para carga de proyecto de gran volumen"],0),
    Q("¿Qué es el Bill of Lading y cuál es su función?",["Conocimiento de embarque — prueba del contrato de transporte y título legal de la carga transportada","Solo un recibo simple de entrega de carga","Solo un manifiesto de carga para aduana","Solo un permiso portuario de embarque"],0),
    Q("¿Qué es el manifiesto de carga y para qué sirve?",["Lista oficial de toda la carga a bordo — requerida por autoridades aduaneras y portuarias de destino","Solo para uso interno del capitán del buque","Solo para el primer oficial de cubierta","Solo para el seguro de la carga transportada"],0),
    Q("¿Qué es la escora y cómo afecta la seguridad del buque?",["Inclinación lateral del buque — si es excesiva indica problema de estabilidad que puede ser peligroso","Solo un movimiento normal del buque en olas","Solo la inclinación por viento sin importancia","Solo un efecto visual sin consecuencias reales"],0),
    Q("¿Qué es el asiento o trim del buque y cómo se controla?",["Diferencia de calado entre proa y popa — se controla distribuyendo la carga y el lastre adecuadamente","Solo la profundidad del buque bajo el agua","Solo el peso total de carga y combustible","Solo la distribución del lastre en los tanques"],0),
    Q("¿Qué es la marca Plimsoll o línea de máxima carga?",["Marca en el casco que indica la carga máxima permitida — varía según zona geográfica y estación del año","Solo una marca decorativa de identificación","Solo una marca de construcción del astillero","Solo indica el calado en condición de lastre"],0),
    Q("¿Qué es el factor de estiba y cómo se usa en la planificación de carga?",["Volumen que ocupa 1 tonelada de un tipo de carga — esencial para calcular la capacidad efectiva de las bodegas","Solo el peso máximo por metro cuadrado de bodega","Solo el tipo de contenedor adecuado para la carga","Solo la velocidad de carga y descarga en puerto"],0),
    Q("¿Qué es la segregación de cargas incompatibles y por qué es obligatoria?",["Separar cargas que pueden reaccionar peligrosamente entre sí — obligatoria por SOLAS VI e IMDG","Solo separar cargas por peso y volumen","Solo separar carga general de carga refrigerada","Solo separar contenedores por destino portuario"],0),
    Q("¿Qué es el lashing o trincado de la carga según el Código CSS?",["Sistema certificado para asegurar la carga y evitar su movimiento durante la navegación en el mar","Solo sujetar la carga en cubierta por apariencia","Solo para contenedores refrigerados en cubierta","Solo para cargas de proyecto en buques especiales"],0),
    Q("¿Qué es un contenedor TEU y cuál es su estándar de medida?",["Contenedor de 20 pies — unidad estándar de medida de la capacidad de portacontenedores","Contenedor refrigerado de 40 pies estándar","Contenedor especial para mercancías peligrosas","Contenedor abierto para cargas de gran volumen"],0),
    Q("¿Qué es un contenedor reefer y qué carga transporta?",["Contenedor refrigerado para carga perecedera — frutas, carnes, pescado y productos farmacéuticos","Contenedor especial para líquidos a granel","Contenedor de 40 pies estándar para carga general","Contenedor para mercancías peligrosas de clase 3"],0),
    Q("¿Qué es el acceso seguro a las bodegas según normas OMI e ISM?",["Permiso de trabajo, medición de atmósfera O₂ y gases, y equipo de emergencia listo antes de entrar","Solo usar la escalera de acceso aprobada","Solo entrar durante el día con buena iluminación","Sin requisitos especiales en bodegas de carga general"],0),
    Q("¿Qué exige SOLAS VI sobre la declaración de carga antes de embarcar?",["El cargador debe declarar la naturaleza y distribución de la carga antes de iniciar las operaciones","Solo para mercancías peligrosas","Solo para carga a granel sin contenedor","No es obligatoria para carga general en contenedor"],0),
    Q("¿Qué es el manual de estabilidad y qué contiene?",["Documento aprobado por la sociedad de clasificación con condiciones de carga, curvas GZ y criterios OMI","Solo el plan de carga de cada viaje","Solo las instrucciones de manejo del buque","Solo la lista de equipos de carga a bordo"],0),
    Q("¿Qué es la carga de cubierta y qué precauciones requiere?",["Carga transportada al exterior sobre cubierta — requiere trincado especial y límites de alturas de apilado","Solo carga ligera sin restricciones especiales","Solo contenedores de mercancías peligrosas","Solo carga de proyecto de gran tamaño y peso"],0),
    Q("¿Qué es el ángulo de inundación y cómo afecta la estabilidad?",["Ángulo de escora donde entran agua las aberturas no estancas — limita el ángulo de escora máximo seguro","Solo el ángulo máximo de giro del buque","Solo el ángulo de asiento en condición normal","Solo el ángulo de diseño del casco del buque"],0),
    Q("¿Qué es la capacidad de carga bruta DWT y qué incluye?",["Peso máximo de carga, combustible, agua, provisiones y tripulación que puede llevar el buque","Solo el peso de la carga comercial transportada","Solo el volumen de las bodegas de carga","Solo la eslora y manga del buque"],0),
    Q("¿Qué es el balance libre en tanques y cómo afecta la estabilidad?",["Movimiento del líquido en tanques parcialmente llenos — reduce el GM y puede destabilizar el buque","Efecto positivo que aumenta la estabilidad","Solo relevante en buques tanqueros especializados","No tiene efecto significativo en buques de carga"],0),
    Q("¿Qué es la estabilidad dinámica del buque según los criterios OMI?",["Estabilidad durante el movimiento del buque en el mar — área bajo la curva GZ debe cumplir criterios mínimos","Solo la estabilidad en puerto sin movimiento","Solo la estabilidad con máxima carga posible","Solo la estabilidad en condición de lastre"],0),
    Q("¿Qué exige la LNCM respecto al capitán y la seguridad de la carga?",["El capitán puede rechazar carga que ponga en riesgo la seguridad del buque o personas a bordo","Solo el armador puede rechazar la carga","Solo con autorización de la autoridad portuaria","El capitán debe aceptar toda carga contratada"],0),
    Q("¿Qué es la carta de protestas en el transporte de carga marítimo?",["Documento para proteger los derechos del capitán o cargador por daños o condiciones adversas a la carga","Solo una carta de queja al armador","Solo una reclamación a la compañía de seguros","Solo nota de entrega de carga al consignatario"],0),
    Q("¿Qué son los sólidos a granel del grupo B según el Código IMSBC?",["Sólidos con riesgo químico — no se licúan pero pueden ser inflamables, tóxicos o corrosivos","Los más seguros sin ningún riesgo especial","Los que pueden licuarse con la humedad","Los que contienen sustancias radioactivas"],0),
    Q("¿Qué es el flete en el transporte marítimo?",["Precio pagado por el transporte de la carga — base del contrato de fletamento marítimo","Solo el peso total de la carga transportada","Solo el tipo de contenedor utilizado","Solo la velocidad del buque durante el viaje"],0),
  ],
  18:[
    Q("¿Qué es el SWL (Safe Working Load) de una grúa?",["Carga máxima de trabajo seguro certificada — no debe superarse bajo ninguna circunstancia","La carga máxima absoluta de rotura del sistema","El peso de la grúa más la carga máxima","La carga de prueba al 125% del trabajo normal"],0),
    Q("¿Cuánto debe ser la carga de prueba para certificar una grúa según normas ILO y de clasificación?",["125% del SWL — verifica que la grúa no sufra deformación permanente ni fallo","100% del SWL exactamente","150% del SWL siempre","200% del SWL para margen máximo"],0),
    Q("¿Con qué frecuencia debe renovarse el certificado de la grúa según normas de clasificación?",["Cada 5 años con inspecciones anuales intermedias para mantenimiento de la certificación","Solo cada 10 años en el dique seco","Solo cuando hay cambios en el equipo","No tiene vigencia definida por normas"],0),
    Q("¿Cuál es la regla básica de seguridad más importante en operaciones de izaje?",["Nunca trabajar ni pasar bajo una carga suspendida — zona de exclusión obligatoria siempre","Trabajar rápido para reducir el tiempo de riesgo","Usar solo el gancho principal sin eslingas","Izar sin señalero si el operador tiene experiencia"],0),
    Q("¿Qué EPP es obligatorio en la zona de trabajo con grúas?",["Casco, chaleco reflectante, guantes y calzado de seguridad con puntera de acero","Solo el casco sin otros equipos","Solo el chaleco reflectante para visibilidad","Sin EPP especial si la carga es liviana"],0),
    Q("¿Cuándo NO debe operarse una grúa según normas OMI?",["Con vientos que superan el máximo especificado por el fabricante, lluvia intensa o visibilidad muy reducida","Solo con lluvia directa sobre la carga","Solo con vientos de más de 50 nudos","Siempre puede operarse con el operador adecuado"],0),
    Q("¿Cuándo se debe descartar un cable de acero de grúa?",["Con 10% o más de alambres rotos en un tramo de 8 diámetros, corrosión severa o deformación visible","Solo cuando se rompe completamente","Cada 5 años obligatoriamente","Solo con corrosión visible en la superficie exterior"],0),
    Q("¿Qué es el rigger o aparejador y qué competencias debe tener?",["Especialista en aparejos y sujeción de cargas — conoce métodos de eslingado, capacidades y señales del operador","Solo el operador de la grúa en cabina","Solo el supervisor de las operaciones de carga","Solo el inspector de los aparejos y equipos"],0),
    Q("¿Qué es el eslingado de la carga y por qué es crítico?",["Método de sujetar la carga al gancho para el izaje — un mal eslingado puede causar caída de la carga","Solo la operación de conectar al gancho","Solo colocar el gancho de seguridad en la eslinga","Solo la señalización de la zona de trabajo"],0),
    Q("¿Cuál es el factor de seguridad mínimo de las eslingas de acero según normas?",["5:1 respecto a la carga de rotura — cada eslinga tiene su SWL certificado que no debe superarse","2:1 para operaciones normales","3:1 como mínimo en condiciones normales","10:1 para máxima seguridad siempre"],0),
    Q("¿Cómo afecta el ángulo de las eslingas al SWL efectivo?",["A mayor ángulo entre eslingas la tensión aumenta — a 120° la tensión iguala la carga total suspendida","No afecta la tensión con buen eslingado","Solo importa el peso total no el ángulo","Reduce la tensión al distribuirse entre los ramales"],0),
    Q("¿Qué es el gancho de seguridad con pestillo y por qué es obligatorio?",["Gancho con pestillo automático que evita el desprendimiento accidental de la carga durante el izaje","Solo una mejora opcional de confort","Solo para cargas muy pesadas superiores a 5 toneladas","No es obligatorio si el operador es cuidadoso"],0),
    Q("¿Qué debe verificarse antes de izar una carga según normas OMI?",["Peso de la carga, método de eslingado correcto, zona libre debajo y condiciones del entorno","Solo el peso para verificar el SWL","Solo la zona libre bajo la carga","Solo las eslingas y el gancho principal"],0),
    Q("¿Qué es el plan de izaje y cuándo es obligatorio?",["Para operaciones complejas — incluye método de eslingado, SWL de equipos, trayectoria y contingencias","Solo para cargas superiores a 10 toneladas","Solo en operaciones con mal tiempo","Solo para izaje en tándem con dos grúas"],0),
    Q("¿Qué es el izaje en tándem y qué requisitos tiene?",["Uso de dos grúas para izar una carga conjuntamente — requiere plan específico y coordinación entre operadores","Solo izar dos cargas simultáneamente de forma independiente","Técnica para izar más rápido con dos operadores","Solo para emergencias sin planificación previa"],0),
    Q("¿Cuál es la señal de STOP del señalero según normas internacionales?",["Cerrar el puño con el brazo extendido — detener toda operación inmediatamente sin cuestionamiento","Agitar ambas manos hacia arriba y abajo","Señalar hacia abajo con el dedo índice","Cualquier señal acordada entre el equipo"],0),
    Q("¿Qué es la carga dinámica y cómo afecta al equipo de izaje en buques en movimiento?",["Fuerza adicional por aceleración del buque — puede ser 2 a 3 veces la carga estática","Es igual a la carga estática en todo momento","Solo relevante en alta mar con olas grandes","No existe en buques modernos con estabilizadores"],0),
    Q("¿Qué es el libro de registro de grúas y qué debe documentar?",["Todas las inspecciones, pruebas, reparaciones, ajustes y cambios de componentes con fechas precisas","Solo las inspecciones anuales de clasificación","Solo los accidentes e incidentes con la grúa","Solo los certificados vigentes del equipo"],0),
    Q("¿Qué es el mantenimiento preventivo de grúas y por qué es obligatorio?",["Inspección y lubricación periódica según fabricante para prevenir fallas — documentado en el registro","Solo reparar cuando hay fallo visible del equipo","Solo inspección anual de clasificación suficiente","Solo lubricación sin inspección periódica documentada"],0),
    Q("¿Qué es el grillete o grillón y cómo debe asegurarse?",["Herraje en U con pasador para conectar aparejos — pasador asegurado con tuerca y contrapasador o alambre","Solo cualquier enlace metálico disponible","Solo asegurarse visualmente sin herramienta","Solo para cargas livianas sin aseguramiento"],0),
    Q("¿Qué es el cuadernal o motón y para qué se usa en operaciones de carga?",["Bloque con poleas para reducir el esfuerzo necesario multiplicando la fuerza aplicada","Solo decorativo del sistema de aparejos","Solo para guiar cables sin reducir fuerza","Solo para operaciones de izaje de emergencia"],0),
    Q("¿Qué es la zona de exclusión bajo cargas suspendidas y cómo se establece?",["Área prohibida directamente bajo la carga izada — señalización obligatoria y nadie puede entrar","Solo recomendación de buenas prácticas","Solo cuando la carga supera 2 toneladas","Solo en operaciones nocturnas con iluminación reducida"],0),
    Q("¿Qué exige la LNCM para grúas de buques que operan en puertos mexicanos?",["Cumplir normas internacionales de seguridad con inspección por autoridad competente certificada","Solo las normas del astillero donde se fabricó","Solo las normas OMI sin certificación nacional","Sin requisitos específicos en puertos nacionales pequeños"],0),
    Q("¿Qué formación debe tener el operador de una grúa de buque?",["Formación certificada, conocimiento del SWL y características específicas de su grúa particular","Solo experiencia en grúas similares anteriores","Solo conocer el SWL y no excederlo","Solo seguir instrucciones del supervisor sin formación"],0),
    Q("¿Qué es el freno de la grúa y qué capacidad debe tener según normas de clasificación?",["Sistema para detener y sostener cargas — debe poder sostener 1.5 veces el SWL según norma","Solo sostener exactamente el SWL sin margen","Solo detener el movimiento sin sostener carga","No tiene requisito específico de capacidad de retención"],0),
    Q("¿Qué son las eslingas de nylon (sintéticas) y en qué situaciones son preferidas?",["Más ligeras que el acero, no dañan superficies acabadas y absorben impactos — preferidas para cargas delicadas","Son más resistentes que las eslingas de acero","Tienen mayor SWL que las cadenas equivalentes","Son permanentes sin necesidad de mantenimiento"],0),
    Q("¿Qué es el Convenio 152 de la OIT y a qué aplica?",["Convenio de seguridad en trabajos portuarios — requisitos de seguridad para operaciones de carga incluyendo aparejos","Solo para trabajadores estibadores en tierra","Solo para puertos comerciales internacionales","Solo para el personal de cubierta del buque"],0),
    Q("¿Cuándo se descarta una eslinga de cadena según normas de clasificación?",["Con deformación de eslabones, alargamiento superior al 5%, corrosión severa o eslabones agrietados","Solo cuando se rompe completamente","Cada 3 años obligatoriamente","Solo con corrosión visible en la superficie"],0),
    Q("¿Qué es la prueba anual de aparejos y cómo se realiza?",["Con carga de prueba o método alternativo aprobado por la sociedad de clasificación del buque","Solo inspección visual sin carga de prueba","Solo con carga al 50% del SWL como prueba","Solo en el dique seco cada 5 años con renovación"],0),
    Q("¿Qué es la botavara de carga o derrick y qué certificación requiere?",["Brazo articulado para izar carga a bordo — debe certificarse con el sistema completo de aparejos","Solo la pluma sin los aparejos del sistema","Solo el winche de maniobra sin la pluma","Sin certificación si tiene menos de 5 años de uso"],0),
  ],
  19:[
    Q("¿Qué es MARPOL 73/78 y cuándo entró en vigor?",["Convenio Internacional para Prevenir la Contaminación por los Buques — entró en vigor en 1983","Solo recomendatorio para buques modernos","Solo para tanqueros de petróleo crudo","Entró en vigor en 1978 con la firma del protocolo"],0),
    Q("¿Cuántos Anexos tiene MARPOL y qué cubre cada uno en resumen?",["6 Anexos — hidrocarburos, NLS, bultos peligrosos, aguas sucias, basura y contaminación del aire","Solo 4 Anexos en la versión original","8 Anexos con todos los tipos de contaminación","Solo 3 Anexos principales obligatorios"],0),
    Q("¿Qué regula el Anexo I de MARPOL?",["Contaminación por hidrocarburos — petróleo y sus mezclas en sentinas, lastre y operaciones del buque","Residuos sólidos y basura del buque","Aguas sucias y aguas negras del buque","Emisiones de gases de escape del motor"],0),
    Q("¿Qué es el ORB (Oil Record Book) y quién está obligado a llevarlo?",["Libro de Registro de Hidrocarburos — obligatorio para todos los buques de 400 GT o más","Solo para buques tanqueros de petróleo crudo","Solo para buques de más de 5000 GT","Solo en viajes internacionales fuera de las 12 millas"],0),
    Q("¿Cuál es el límite de 15 ppm según MARPOL Anexo I?",["Concentración máxima de petróleo permitida en descargas de sentina fuera de zonas especiales","Solo dentro de las 3 millas de costa","Solo en zonas especiales como el Báltico","El límite en tanques de lastre de tanqueros"],0),
    Q("¿Qué regula MARPOL Anexo V sobre la basura?",["Prohibición y restricciones para la descarga de basura al mar — plásticos prohibidos absolutamente","Solo regula la basura de pasajeros en cruceros","Solo para desechos peligrosos del buque","Solo dentro de las 12 millas de cualquier costa"],0),
    Q("¿Qué tipo de basura tiene prohibición absoluta de descarga al mar según MARPOL V?",["Los plásticos — en ningún lugar del mar y bajo ninguna circunstancia","Solo las botellas de plástico grandes","Solo los plásticos con materiales tóxicos","Solo los plásticos de embalaje de mercancías"],0),
    Q("¿Qué es el Plan de Gestión de Basura GMP y para quién es obligatorio?",["Plan obligatorio para todos los buques de 100 GT o más — describe cómo manejar y documentar los residuos","Solo para cruceros con más de 500 pasajeros","Solo para buques de carga de más de 5000 GT","Solo en viajes internacionales de más de 72 horas"],0),
    Q("¿Qué regula MARPOL Anexo VI sobre la contaminación del aire?",["Emisiones de gases de escape — SOx, NOx, partículas, CFC y eficiencia energética EEDI/SEEMP/CII","Solo el CO₂ como gas de efecto invernadero","Solo el SO₂ producido por el combustible marino","Solo para motores de más de 130 kW de potencia"],0),
    Q("¿Cuál es el límite global de contenido de azufre en combustible marino vigente desde 2020?",["0.50% m/m — reducido drásticamente desde el límite anterior de 3.50%","1.00% de azufre en todos los combustibles","1.50% fuera de zonas ECA de control de emisiones","0.10% en todos los mares del mundo"],0),
    Q("¿Qué son las zonas ECA de control de emisiones de azufre según MARPOL VI?",["Zonas donde el límite de azufre es 0.10% — más estricto que el límite global de 0.50%","Zonas con el mismo límite global de 0.50%","Solo el Mar del Norte y el Báltico son ECA","Zonas sin ningún límite de emisiones específico"],0),
    Q("¿Qué es el SEEMP y para qué buques es obligatorio?",["Plan de Gestión de Eficiencia Energética — obligatorio para todos los buques de 400 GT o más","Solo para portacontenedores por su alto consumo","Solo para tanqueros de crudo de más de 20000 GT","Solo recomendatorio para buques nuevos"],0),
    Q("¿Qué es el CII (Carbon Intensity Indicator) según MARPOL VI desde 2023?",["Calificación anual A-E de eficiencia de carbono — buques con D o E deben presentar plan de mejora","Solo indicador informativo sin consecuencias","Solo para buques construidos después de 2013","Solo para buques de pasaje y portacontenedores"],0),
    Q("¿Qué es el certificado IOPP y para qué buques es obligatorio?",["Certificado Internacional de Prevención de Contaminación por Hidrocarburos — para buques de 400 GT o más","Solo para buques tanqueros de petróleo crudo","Solo para buques de más de 5000 GT de arqueo","Solo en viajes internacionales fuera de la ZEE"],0),
    Q("¿Qué es el separador de sentinas de 15 ppm y qué requisito adicional tiene?",["Equipo que separa agua de petróleo — debe tener monitor automático de 15 ppm y dispositivo de parada","Solo el separador básico sin monitor automático","Solo el monitor de 15 ppm sin separador físico","Solo uno de los dos equipos es suficiente"],0),
    Q("¿Qué regula el Convenio BWM de la OMI sobre el agua de lastre?",["Gestión del agua de lastre para evitar la transferencia de especies marinas invasoras entre océanos","Solo el volumen máximo de lastre permitido","Solo la temperatura del agua de lastre descargada","Solo el color y turbidez del agua descargada"],0),
    Q("¿Qué es el SOPEP y para qué buques es obligatorio según MARPOL?",["Plan de Emergencia de Contaminación por Hidrocarburos — obligatorio para buques de 400 GT o más","Solo para buques tanqueros de crudo y productos","Solo para buques en zonas especiales de MARPOL","Solo recomendatorio para todos los buques"],0),
    Q("¿Qué consecuencias puede tener una descarga ilegal de hidrocarburos según MARPOL?",["Multas millonarias, detención del buque, proceso penal del capitán y retención de certificados","Solo una multa menor administrativa","Solo una advertencia formal por escrito","Solo anotación en el historial del buque"],0),
    Q("¿Qué son las instalaciones de recepción portuaria y de quién son responsabilidad?",["Instalaciones en puertos para recibir desechos de buques — responsabilidad de los Estados Parte del convenio","Solo responsabilidad del armador del buque","Solo de la OMI para coordinar su instalación","Solo de los astilleros de reparación naval"],0),
    Q("¿Qué refuerza el Código Polar de la OMI respecto a MARPOL en aguas polares?",["Restricciones adicionales más estrictas en el Ártico y Antártico — especialmente para descargas al mar","Las mismas normas que en el resto del mundo","Solo restricciones para buques de pasaje polares","Solo normas de navegación sin impacto en MARPOL"],0),
    Q("¿Cuándo se puede descargar agua de sentina al mar según MARPOL Anexo I?",["A más de 12 millas de tierra, navegando, con equipo de 15 ppm en funcionamiento y ORB registrado","En cualquier lugar fuera de las 3 millas","Solo en alta mar a más de 50 millas de cualquier costa","En cualquier momento con el equipo funcionando"],0),
    Q("¿Qué es la retención a bordo según MARPOL y cuándo aplica?",["Guardar los desechos a bordo hasta poder descargarlos en instalación portuaria autorizada","Solo para residuos peligrosos de clase IMDG","Solo en zonas especiales de MARPOL","Solo para todos los residuos sin excepción absoluta"],0),
    Q("¿Qué regula MARPOL Anexo IV sobre las aguas sucias?",["Descarga de aguas negras y grises del buque — a más de 12 millas en navegación o con planta de tratamiento","Solo las aguas de sentina de sala de máquinas","Solo las aguas de limpieza de bodegas de carga","Solo las aguas de limpieza de cubiertas con lluvia"],0),
    Q("¿Qué es el Libro de Registro de Basura GRB y cuánto tiempo debe conservarse?",["Registro obligatorio de operaciones de descarga o incineración de basura — conservarse 2 años según MARPOL","Solo 6 meses de conservación obligatoria","Solo 1 año en el buque después de cada viaje","Solo para las descargas en instalaciones portuarias"],0),
    Q("¿Qué prohíbe MARPOL Anexo VI respecto a los CFC?",["Prohíbe el uso de CFC en sistemas nuevos y regula el manejo de sistemas existentes — agotan el ozono","Solo los CFC en nuevos buques posteriores a 2000","Solo en sistemas de más de 50 kW de potencia","Solo cuando hay alternativas disponibles en el mercado"],0),
    Q("¿Cuándo pueden descargarse restos de comida al mar según MARPOL Anexo V?",["A más de 12 millas de tierra cuando están triturados — 3 millas si están finamente triturados","En cualquier lugar fuera de las 3 millas de costa","Solo en alta mar a más de 50 millas sin restricción","Nunca se pueden descargar según MARPOL V"],0),
    Q("¿Qué es el EEDI y a qué buques aplica según MARPOL Anexo VI?",["Índice de Eficiencia Energética de Diseño — aplica a buques nuevos de más de 400 GT para limitar CO₂","Solo para portacontenedores de nueva construcción","Solo para buques de pasaje por su alto consumo","Solo recomendatorio para todos los buques nuevos"],0),
    Q("¿Qué exige la LNCM respecto al cumplimiento de MARPOL en puertos mexicanos?",["Los buques que zarpen o arriben a puertos mexicanos deben cumplir todos los Anexos de MARPOL vigentes","Solo los Anexos I y V como mínimo obligatorio","Solo los Anexos que México ha ratificado individualmente","Sin obligación específica en puertos nacionales pequeños"],0),
    Q("¿Qué es el Anexo II de MARPOL y qué sustancias regula?",["Regula las sustancias líquidas nocivas NLS a granel — 4 categorías X, Y, Z y OS según peligrosidad","Solo productos químicos peligrosos en bultos","Solo petroquímicos básicos","Solo ácidos y bases industriales"],0),
    Q("¿Qué es el NOx en el contexto de MARPOL Anexo VI?",["Óxidos de nitrógeno de los gases de escape — regulados por límites Tier I, II y III según año y zona","Solo un parámetro informativo sin límite específico","Solo para motores principales de gran potencia","Solo en zonas con alta densidad de tráfico marítimo"],0),
  ],
  20:[
    Q("¿Cuándo entraron en vigor las COLREG adoptadas por la OMI en 1972?",["En 1977 — reemplazaron las reglas de colisión de 1960","En 1972 al momento de su adopción","En 1980 tras la ratificación universal","En 1990 con las primeras enmiendas importantes"],0),
    Q("¿Qué establece la Regla 5 de COLREG sobre la vigilancia adecuada?",["Usar vista, oído, radar, VHF, AIS y todos los medios disponibles según circunstancias","Solo mantener guardia visual continua en el puente","Solo usar el radar como medio principal de vigilancia","Solo guardia de escucha en canal 16 del VHF"],0),
    Q("¿Qué establece la Regla 6 de COLREG sobre la velocidad de seguridad?",["La velocidad que permite tomar acción efectiva considerando visibilidad, tráfico y maniobrabilidad","La velocidad máxima permitida en aguas territoriales","10 nudos en todos los puertos y canales","La velocidad que no causa daño a terceros por estela"],0),
    Q("¿Qué establece la Regla 8 de COLREG sobre la acción para evitar abordaje?",["Acción amplia, positiva y anticipada — no pequeñas correcciones sucesivas que confunden al otro buque","La acción mínima necesaria para evitar el contacto","Solo reducir la velocidad como primera medida","Solo cambiar el rumbo como primera acción"],0),
    Q("¿Qué regla de COLREG se aplica cuando un buque adelanta a otro?",["Regla 13 — el buque que adelanta cede siempre el paso al adelantado por cualquiera de sus bandas","Regla 15 de situación de cruce siempre","Regla 16 del buque que debe maniobrar","Regla 17 del buque privilegiado que mantiene"],0),
    Q("¿Qué establece COLREG Regla 15 sobre la situación de cruce?",["Tiene preferencia el buque que viene por la banda de estribor del otro — el otro debe ceder el paso","Tiene preferencia el buque de mayor eslora","Tiene preferencia el buque que va más rápido","Tiene preferencia el buque que lleva carga peligrosa"],0),
    Q("¿Qué debe hacer el buque que tiene el paso libre según COLREG Regla 17?",["Mantener rumbo y velocidad — pero puede maniobrar si el abordaje es inevitable por inacción del otro","Siempre mantener sin excepción posible","Cambiar el rumbo inmediatamente al detectar riesgo","Reducir velocidad a la mitad como señal"],0),
    Q("¿Qué color tiene la luz de estribor según COLREG y cuál es su arco visible?",["Verde — visible desde directamente a proa hasta 22.5° a popa por la banda de estribor (112.5°)","Roja desde directamente a proa hasta 22.5° a popa por estribor","Blanca desde 45° de babor hasta 45° de estribor","Verde desde proa hasta la perpendicular por estribor"],0),
    Q("¿Qué color tiene la luz de babor según COLREG y cuál es su arco visible?",["Roja — visible desde directamente a proa hasta 22.5° a popa por la banda de babor (112.5°)","Verde desde proa hasta 22.5° a popa por babor","Blanca en el sector de babor solamente","Roja desde la perpendicular hacia atrás por babor"],0),
    Q("¿Qué es la luz de alcance según COLREG y cuál es su arco visible?",["Luz blanca en popa visible desde directamente a popa con un arco de 135° (67.5° a cada banda)","Luz blanca de 360° visible en todas las direcciones","Solo visible directamente a popa en 90°","Luz blanca en proa con arco de 180° hacia adelante"],0),
    Q("¿Qué significa 1 pitido corto de bocina según COLREG Regla 34?",["Estoy virando a estribor — maniobrando hacia la banda de estribor","Estoy virando a babor — maniobrando hacia babor","Mis máquinas van atrás — retrocediendo","Señal de peligro o duda sobre las intenciones"],0),
    Q("¿Qué significa 2 pitidos cortos de bocina según COLREG Regla 34?",["Estoy virando a babor — maniobrando hacia la banda de babor","Estoy virando a estribor — maniobrando a estribor","Mis máquinas van atrás — retrocediendo","Solicito asistencia de remolcador urgente"],0),
    Q("¿Qué significan 5 o más pitidos cortos rápidos según COLREG Regla 34?",["Señal de duda o alarma — no entiendo sus intenciones o no está tomando acción para evitar el abordaje","Solicito práctico de puerto de inmediato","Estoy en dificultades y necesito asistencia urgente","Voy a fondear en esta posición"],0),
    Q("¿Qué luces muestran los buques NUC (Not Under Command) de noche?",["Dos luces rojas en vertical — en lugar de las luces de navegación normales del buque en marcha","Dos luces blancas en vertical igual que NUC","Solo la luz de alcance en popa activada","Luz roja y verde combinadas en el palo principal"],0),
    Q("¿Qué luces muestran los buques RAM de noche y qué prioridad tienen?",["Tres luces verticales roja-blanca-roja — tienen prioridad sobre casi todos los buques en marcha","Dos luces rojas igual que los NUC en avería","Solo una luz roja adicional a las normales","Las mismas luces que los buques NUC sin diferencia"],0),
    Q("¿Cuál es el orden de prioridad de los buques según COLREG Regla 18?",["NUC > RAM > calado limitado > pescando > vela > motor — el de motor cede a todos los anteriores","Motor > vela > NUC > pescando > RAM","Vela > motor > NUC > pescando > RAM","No hay orden establecido — depende del tamaño del buque"],0),
    Q("¿Qué establece COLREG Regla 9 sobre la navegación en canal angosto?",["Navegar por la derecha del canal y no impedir el paso de buques que solo pueden navegar en el canal","Navegar por el centro del canal para mayor seguridad","Dar preferencia a los buques que salen del puerto","Solo aplica a canales de menos de 500 metros de anchura"],0),
    Q("¿Qué señal diurna muestra un buque fondeado según COLREG?",["Una bola negra en el lugar más visible de proa del buque","Bandera amarilla en el tope del palo mayor","Dos conos negros con los vértices juntos en vertical","Cilindro negro en el palo de señales de cubierta"],0),
    Q("¿Qué establece COLREG Regla 19 sobre la navegación con visibilidad reducida?",["Navegar a velocidad de seguridad, hacer señales de niebla y no virar a babor para evitar colisión con buque a proa","Continuar a velocidad normal con más vigilancia","Solo hacer señales de niebla sin cambiar la velocidad","Solo usar el radar como medida suficiente"],0),
    Q("¿Cuál es la señal de niebla de un buque de motor navegando según COLREG?",["Un toque largo en la bocina cada 2 minutos como máximo","Dos toques cortos cada 2 minutos","Un toque largo cada minuto","Tres toques cortos cada 2 minutos"],0),
    Q("¿Qué establece COLREG respecto a los buques a vela frente a los de motor?",["El de vela tiene preferencia sobre el de motor — excepto cuando el velero adelanta al buque de motor","El de motor siempre tiene preferencia por mayor maniobrabilidad","El más grande siempre tiene preferencia","El que va más rápido tiene preferencia de paso"],0),
    Q("¿Qué es la señal diurna de un buque fondeado en niebla además de la bola negra?",["Campanada rápida de 5 segundos cada minuto — señal sonora obligatoria de buque fondeado en niebla","Un toque largo de bocina cada 2 minutos","Solo la bola negra sin señal sonora adicional","Dos toques cortos de bocina cada 2 minutos"],0),
    Q("¿Cuál es la Regla 2 de COLREG sobre la responsabilidad?",["Ninguna regla exime de responsabilidad por negligencia — el capitán, propietarios y tripulación son responsables","Solo el capitán es responsable de toda colisión","Solo el oficial de guardia es responsable durante su turno","La regla exime en caso de fuerza mayor probada"],0),
    Q("¿Qué establece COLREG sobre el buque que adelanta respecto al adelantado?",["El que adelanta siempre cede el paso al adelantado — hasta que esté completamente claro del otro buque","Solo si adelanta por la popa directamente","Solo si el adelantado mantiene rumbo y velocidad","El adelantado cede si el que adelanta es más grande"],0),
    Q("¿Cuándo aplican las COLREG según su ámbito de aplicación?",["En alta mar y en todas las aguas que no sean objeto de reglamentación local especial","Solo en alta mar a más de 12 millas de cualquier costa","Solo en aguas territoriales de todos los Estados","Solo para buques de más de 20 metros de eslora"],0),
    Q("¿Qué establece COLREG Regla 36 para llamar la atención de otro buque?",["Se puede usar luces o señales que no se confundan con otras señales reglamentarias o de socorro","Solo destellos de luz desde el puente de mando","Solo el uso de la bocina con señales aprobadas","Solo la radio VHF en canal 16 para alertar"],0),
    Q("¿Qué es el buque con calado limitado y qué consideración tiene según COLREG?",["Buque que por su calado no puede apartarse del canal navegable — otros deben darle paso","Buque con averías que limitan su maniobrabilidad","Buque con carga que excede el calado autorizado","Buque en remolque con calado adicional por la carga"],0),
    Q("¿Qué exige COLREG Regla 7 cuando existe riesgo de abordaje?",["Si existe duda de si hay riesgo se considerará que existe — usar radar, ARPA y AIS para determinar CPA/TCPA","Si la demora no varía no existe riesgo bajo ninguna circunstancia","El riesgo solo existe en visibilidad reducida con niebla","Solo el radar puede determinar si hay riesgo real"],0),
    Q("¿Qué significa 3 pitidos cortos de bocina según COLREG Regla 34?",["Mis máquinas van atrás — estoy propulsando hacia atrás","Estoy virando a estribor","Estoy virando a babor","Solicito práctico de puerto"],0),
    Q("¿Qué son los buques pesqueros y qué prioridad tienen según COLREG Regla 18?",["Buques pescando con artes que limitan la maniobrabilidad — tienen preferencia sobre los buques de motor","Solo tienen prioridad sobre buques pequeños","No tienen prioridad especial según COLREG","Solo tienen prioridad en sus zonas de pesca"],0),
  ],
  21:[
    Q("¿Para qué buques es obligatorio el AIS clase A según SOLAS V?",["Todos los buques de más de 300 GT en viajes internacionales y buques de pasaje de cualquier tamaño","Solo buques de más de 1000 GT","Solo buques de pasaje","Todos los buques sin importar tamaño"],0),
    Q("¿Qué registra el VDR según SOLAS V y para qué sirve?",["Posición, rumbo, velocidad, comunicaciones de radio, AIS, radar y audio del puente — para investigar accidentes","Solo la posición y rumbo del buque","Solo comunicaciones de radio con el puerto","Solo datos de navegación sin audio del puente"],0),
    Q("¿Qué es el ARPA según SOLAS V y qué información proporciona?",["Radar automático de trazado — proporciona CPA, TCPA y trayectoria de blancos con alarmas configurables","Solo la distancia a los objetos detectados","Solo la velocidad de los blancos en el radar","Solo la identificación de los buques cercanos"],0),
    Q("¿Qué es el área A1 del GMDSS según SOLAS IV?",["Dentro del alcance de al menos una estación VHF DSC — aproximadamente 30 a 70 millas de costa","Dentro de las 12 millas de cualquier costa","Dentro de 100 millas de cualquier puerto","Todo el océano fuera del área A2 y A3"],0),
    Q("¿Cuál es el canal DSC del VHF según SOLAS IV y para qué se usa?",["Canal 70 — para llamadas de socorro y urgencia digitales automáticas (no para voz)","Canal 16 para llamadas digitales de socorro","Canal 12 para operaciones portuarias digitales","Canal 8 para llamadas de trabajo digital"],0),
    Q("¿En qué frecuencia opera el NAVTEX y cuál es su cobertura aproximada?",["518 kHz para servicio internacional — cobertura de hasta unas 400 millas de la costa","490 kHz para servicio nacional de cada país","2182 kHz para comunicaciones de largo alcance","156.525 MHz para llamadas DSC en VHF"],0),
    Q("¿A qué sistema transmite el EPIRB de 406 MHz y cómo funciona?",["Al sistema COSPAS-SARSAT — la señal es recibida por satélites que la pasan al MRCC en minutos","Solo a estaciones costeras dentro del rango VHF","Al sistema INMARSAT de comunicaciones por satélite","A otros buques cercanos por transmisión directa"],0),
    Q("¿En qué bandas de radar debe operar el equipo según SOLAS V?",["Banda X (9 GHz) obligatoria — banda S (3 GHz) adicional para buques mayores según eslora","Solo banda X en todos los buques sin excepción","Solo banda S para mejor penetración de lluvia","Cualquier banda aprobada por la administración"],0),
    Q("¿Qué requisito tiene el piloto automático según SOLAS V respecto al gobierno manual?",["Debe permitir transferencia inmediata al gobierno manual sin demora que comprometa la seguridad","Solo puede usarse en alta mar con tiempo en calma","Puede sustituir completamente al oficial de guardia","No tiene requisito de cambio manual rápido"],0),
    Q("¿Qué es el girocompás y qué ventaja tiene sobre el compás magnético?",["Apunta al Norte verdadero — no afectado por el magnetismo del acero del casco del buque","Es exactamente igual en precisión al magnético","Solo sirve en latitudes entre 30° y 60°","Es menos preciso pero más barato de instalar"],0),
    Q("¿Qué es el SSAS según SOLAS XI-2 y cómo funciona?",["Alerta de protección que transmite discretamente a autoridades sin alarmar a posibles atacantes a bordo","Alarma general del buque para toda la tripulación","Señal VHF de socorro en canal 16 automática","Posición enviada al AIS de todos los buques cercanos"],0),
    Q("¿Qué es el SRC y quién necesita tenerlo según GMDSS?",["Certificado de Operador de Radio de Corto Alcance — para el personal que usa el VHF regularmente","Solo para radio operadores profesionales titulados","Solo para capitanes de buques de más de 300 GT","Solo para buques con tráfico internacional"],0),
    Q("¿Qué es el INMARSAT C según GMDSS y qué servicios proporciona?",["Comunicaciones de datos bidireccionales, SafetyNET y mensajes telex — texto, no voz directa","Solo comunicaciones de voz de larga distancia","Solo posicionamiento por satélite GPS diferencial","Solo recepción de mensajes sin posibilidad de transmitir"],0),
    Q("¿Qué es el LRIT según SOLAS V y con qué frecuencia reporta?",["Sistema de identificación y seguimiento de largo alcance — envía posición cada 6 horas al Estado de bandera","Solo cuando el buque lo activa manualmente","Solo cuando el buque está dentro de las 200 millas","Solo en emergencias o cuando se solicita"],0),
    Q("¿Qué es el DGPS y en qué mejora al GPS estándar?",["GPS diferencial con mayor precisión — usa correcciones de estaciones en tierra para reducir el error","Solo es igual al GPS estándar sin mejoras","Solo más preciso en latitudes superiores a 60°","Solo mejora la velocidad de actualización de la posición"],0),
    Q("¿Qué es la carta electrónica ENC y qué requisito tiene según la OMI?",["Carta oficial de la autoridad hidrográfica del Estado — debe mantenerse actualizada semanalmente en el ECDIS","Cualquier carta digital disponible en el ordenador","Solo la versión escaneada de la carta en papel","No requiere actualizaciones periódicas una vez instalada"],0),
    Q("¿Qué es el número MMSI y para qué se usa?",["Maritime Mobile Service Identity — número único de 9 dígitos que identifica al buque en el AIS y DSC","El mismo número que el IMO del buque","El número de registro nacional de cada país","El número de la sociedad de clasificación del buque"],0),
    Q("¿Qué es el sistema de continuidad del GMDSS según SOLAS IV?",["Duplicado de equipos, acuerdo de mantenimiento en tierra o técnico radio a bordo según el área","Solo duplicar todos los equipos GMDSS a bordo","Solo mantenimiento en tierra sin duplicado","Solo un técnico radio certificado a bordo siempre"],0),
    Q("¿Qué es la ecosonda y qué requisito tiene según SOLAS V?",["Mide la profundidad del agua por ultrasonido — debe estar en funcionamiento en aguas de poca profundidad","Solo instrumento meteorológico de presión","Solo instrumento de velocidad relativa al fondo","Solo para uso en emergencias de varada"],0),
    Q("¿Qué es el AIS clase B y en qué difiere del clase A?",["AIS para embarcaciones pequeñas — menos potencia y funciones que el clase A obligatorio para 300 GT","Es igual al clase A en todas sus funciones","Tiene más funciones que el clase A para buques grandes","Solo para uso militar sin aplicación comercial"],0),
    Q("¿Qué es la redundancia en sistemas de navegación y por qué es importante?",["Sistemas de respaldo para continuar navegando si falla el principal — GPS y ECDIS deben tener respaldo","Solo un lujo sin obligación según normas","Solo requerida para el radar principal del buque","Solo en buques de pasaje con más de 500 personas"],0),
    Q("¿Qué establece SOLAS V respecto al equipamiento mínimo de navegación?",["Varía según la eslora del buque y la zona de navegación donde opera — lista específica de equipos obligatorios","Igual para todos los buques sin importar el tamaño","Solo 3 equipos básicos para cualquier buque","Solo lo que decide la administración de cada Estado"],0),
    Q("¿Cuándo puede el capitán apagar el AIS según SOLAS V?",["Cuando considera que causa riesgo para la seguridad o protección del buque en circunstancias específicas","Nunca — debe estar encendido en todo momento sin excepción","Solo en puerto para reducir las señales","Solo en mal tiempo para evitar interferencias"],0),
    Q("¿Qué es el barómetro y cómo se usa en la navegación operativa?",["Mide la presión atmosférica — la caída rápida de presión indica mal tiempo inminente en las próximas horas","Solo mide la temperatura del aire exterior","Solo instrumento decorativo del puente tradicional","Solo para cumplir requisitos de certificación"],0),
    Q("¿Qué regula la SCT en México respecto a los equipos de comunicaciones de buques nacionales?",["Certifica los equipos de comunicaciones de los buques mexicanos incluyendo GMDSS y radio","Solo la SEMAR tiene competencia sobre equipos de comunicación","Solo las autoridades portuarias locales verifican","Sin regulación específica nacional para estos equipos"],0),
    Q("¿Qué es la corredera y qué mide en navegación?",["Instrumento que mide la velocidad y distancia recorrida del buque a través del agua","Instrumento de profundidad del fondo marino","Instrumento de la dirección del viento relativo","Instrumento para medir la presión del agua"],0),
    Q("¿Qué son los Avisos a Navegantes y quién los emite?",["Correcciones a las cartas náuticas con cambios de seguridad — emitidos por las autoridades hidrográficas nacionales","Los emite directamente la OMI para todos los mares","Solo el capitán del buque para su área de navegación","Solo para rutas de alta densidad de tráfico marítimo"],0),
    Q("¿Qué es el S-AIS o AIS satelital y qué capacidad tiene?",["Recepción de señales AIS por satélite — permite cobertura global del tráfico marítimo en alta mar","Solo para uso en aguas costeras cercanas","Solo para comunicaciones directas entre buques","Solo para buques de pasaje en rutas oceánicas"],0),
    Q("¿Qué es el SART y cómo funciona?",["Transponder de búsqueda y rescate — activado por radar de un buque o aeronave de rescate, responde con señal identificable","Tipo especial de baliza EPIRB satelital","Radio VHF de emergencia portátil","Sistema de alarma general del buque"],0),
    Q("¿Qué es el área A3 del GMDSS según SOLAS IV?",["Dentro del alcance de satélites INMARSAT geoestacionarios — excluye las zonas polares sobre 70° de latitud","Toda el área oceánica sin restricciones","Solo el Océano Pacífico y el Atlántico","Aguas dentro de las 200 millas de cualquier costa"],0),
  ],
  22:[
    Q("¿Qué es un cable de acero de trabajo a bordo y en qué difiere de un cabo?",["Cable es de alambres de acero trenzados — más rígido y resistente que los cabos de fibra para cargas pesadas","Son exactamente iguales en uso y resistencia","El cabo es más resistente que el cable","Solo difieren en el color para identificarlos"],0),
    Q("¿Qué es la construcción 6x19 de un cable de acero de grúa?",["6 cordones con 19 alambres cada uno — indica la flexibilidad y resistencia del cable","6 milímetros de diámetro con 19 mm de longitud","6 hebras de 19 mm de grosor cada una","6 capas de 19 alambres en paralelo"],0),
    Q("¿Qué es el alma del cable de acero y cuál es su función?",["Núcleo central que da forma y soporte a los cordones exteriores del cable","El alambre exterior de mayor diámetro","El cordón principal de máxima resistencia","El recubrimiento protector exterior"],0),
    Q("¿Cuándo se debe descartar obligatoriamente un cable de acero según normas de clasificación?",["Con 10% o más de alambres rotos en un tramo de 8 diámetros, corrosión severa o deformación visible","Solo cuando se rompe completamente durante la operación","Cada 5 años obligatoriamente sin importar su estado","Solo cuando hay corrosión visible en la superficie"],0),
    Q("¿Qué es el galvanizado del cable de acero y por qué es importante en buques?",["Recubrimiento de zinc que protege el cable de la corrosión marina — esencial en el ambiente salino","Solo un recubrimiento decorativo para identificación","Solo para facilitar el deslizamiento en roldanas y gallos","Solo marcado de identificación del fabricante"],0),
    Q("¿Cómo debe lubricarse un cable de trabajo según normas OMI?",["Con grasa o aceite penetrante que proteja alambres internos y externos — aplicado periódicamente","Solo externamente con una capa superficial","Solo una vez al año en la inspección anual","No requiere lubricación — solo inspección visual"],0),
    Q("¿Qué es un gallo (thimble) en los aparejos de cable a bordo?",["Herraje metálico en forma de lágrima que se coloca en el ojo del cable para evitar el desgaste por rozamiento","Tipo especial de nudo para cables de acero","Herramienta para cortar cables de acero","Sistema de lubricación del cable en la roldana"],0),
    Q("¿Para qué sirve el gallo en un cable de acero?",["Protege el ojo del cable del desgaste al evitar el contacto directo con grilletes y poleas","Solo para identificar el extremo del cable","Solo como peso en el extremo del cable","Solo como decoración en el aparejo"],0),
    Q("¿Qué es chicotear un cable de acero?",["Sellar el extremo del cable con alambre o abrazadera para evitar que se deshaga y proteger los alambres","Cortar el cable con cizalla o amoladora","Lubricar el extremo del cable con grasa","Tensar el cable en el tambor del winche"],0),
    Q("¿Qué métodos se usan para chicotear (terminar) un cable de acero a bordo?",["Alambre de ligadura, fundición de zinc, casquillo prensado o costura con aguja — según el uso y la carga","Solo alambre de ligadura","Solo fundición de plomo o zinc","Solo abrazaderas tipo buldog sin costura"],0),
    Q("¿Qué es el ojo embutido o cosido (splice) en un cable de acero?",["Unión del extremo del cable sobre sí mismo formando un ojo — método más resistente que las abrazaderas","Solo un nudo especial para cables de acero","Solo la terminación temporal en el extremo","Solo el recubrimiento plástico del extremo del cable"],0),
    Q("¿Qué son las abrazaderas tipo buldog y cuántas se necesitan en un ojo de cable?",["Grapas metálicas para fijar el cable — se necesitan mínimo 3, separadas por 6 diámetros del cable","Solo 1 abrazadera es suficiente para cualquier carga","Solo 2 abrazaderas en todos los casos","El número lo decide el operador según la carga"],0),
    Q("¿Cómo se coloca correctamente una abrazadera buldog en un cable de acero?",["El cuerpo sobre el cabo vivo y el estribo sobre el chicote — nunca al revés para no dañar el cabo vivo","El estribo sobre el cabo vivo para mayor sujeción","De cualquier forma ya que es simétrica","Alternando la dirección en cada abrazadera"],0),
    Q("¿Cuál es el cable de acero que se usa en el cable del bote salvavidas?",["Cable galvanizado de alta resistencia certificado con su SWL — según requerimiento del Código LSA","Cualquier cable de acero disponible a bordo","Solo cable de acero inoxidable","El mismo cable que se usa en las grúas de carga"],0),
    Q("¿Qué requisito tiene el cable de caída del bote salvavidas según SOLAS y el Código LSA?",["Debe certificarse periódicamente y reemplazarse según la vida útil especificada — máximo 5 años o antes si hay deterioro","Solo inspeccionarse visualmente cada año","Reemplazarse cada 10 años en el dique seco","No tiene requisito de reemplazo periódico"],0),
    Q("¿Qué es la vida útil de un cable de acero de bote salvavidas según normas OMI?",["Máximo 5 años de servicio o antes si hay deterioro — debe reemplazarse obligatoriamente al vencimiento","10 años de servicio","Solo cuando se detecta daño visible","Permanente sin fecha de vencimiento"],0),
    Q("¿Qué inspección requiere el cable del bote de rescate según SOLAS III?",["Inspección periódica del estado, lubricación, fijaciones y tambor — documentada en el registro del buque","Solo inspección visual desde cubierta","Solo en el dique seco cada 5 años","No tiene requisito específico de inspección periódica"],0),
    Q("¿Qué es la roldana (sheave) y qué relación tiene con el cable de acero?",["Rueda con canal por donde corre el cable — el diámetro mínimo de la roldana debe ser al menos 14 veces el del cable","Solo un tipo de polea decorativa","Solo para cables de fibra, no de acero","Cualquier polea sirve sin importar el diámetro"],0),
    Q("¿Por qué es importante el diámetro mínimo de la roldana respecto al cable?",["Un diámetro menor al mínimo dobla el cable excesivamente causando fatiga y rotura prematura de alambres","Solo afecta la velocidad del cable","Solo es importante para cables nuevos","No tiene importancia técnica práctica"],0),
    Q("¿Qué es la fatiga del cable de acero y cómo se produce?",["Debilitamiento por flexiones repetidas al pasar por roldanas — causa rotura aunque los alambres no muestren corrosión","Solo corrosión avanzada de los alambres","Solo deformación por sobrecarga puntual","Solo problema en cables muy viejos"],0),
    Q("¿Cómo se detecta el deterioro interno de un cable de acero que no se ve externamente?",["Aparición de alambres rotos, pérdida de diámetro, rigidez anormal o chirrido al moverse — señales de fatiga interna","Solo con inspección visual de la superficie","Solo con medición del diámetro","Solo en el laboratorio con prueba destructiva"],0),
    Q("¿Qué es el tambor del winche y cómo debe arrollarse el cable en él?",["Cilindro motorizado donde se enrolla el cable — debe arrollarse en capas ordenadas y regulares sin cruzamientos","Se arrolla de cualquier forma para rapidez","Solo en una capa sin importar el orden","El cable puede cruzarse sin problema en el tambor"],0),
    Q("¿Qué es el cable de remolque de emergencia y cuáles son sus requisitos según SOLAS?",["Cable o cabo de alta resistencia listo para uso inmediato — certificado con su SWL y revisado periódicamente","Solo el cable principal del winche de remolque","Solo para buques tanqueros por requisito específico","No tiene requisitos técnicos específicos en SOLAS"],0),
    Q("¿Qué es el certificado de carga de rotura (MBL) de un cable de acero?",["Documento que certifica la fuerza máxima que soporta el cable antes de romperse — base para calcular el SWL","El certificado de color del cable","El registro de mantenimiento del cable","La factura de compra del cable"],0),
    Q("¿Cómo se calcula el SWL de un cable de acero a partir de su MBL?",["SWL = MBL dividido entre el factor de seguridad mínimo de 5 — el SWL es el 20% de la carga de rotura","SWL = MBL completo sin factor de reducción","SWL = MBL dividido entre 2","SWL = MBL multiplicado por el factor de uso"],0),
    Q("¿Qué es el desgaste por rozamiento en un cable de acero y dónde ocurre principalmente?",["Abrasión de los alambres exteriores al rozar con roldanas, gallos y guía-cables — reduce el diámetro y la resistencia","Solo ocurre en el tambor del winche","Solo en la zona de empalme o costura","Solo en ambientes con arena y polvo"],0),
    Q("¿Qué es la corrosión interna en un cable de acero?",["Corrosión que avanza desde el interior del cable — no visible externamente hasta que es grave y reduce la resistencia","Solo la corrosión visible en la superficie exterior","Solo afecta al alma del cable no a los alambres","Solo en cables sin galvanizado exterior"],0),
    Q("¿Qué documentación debe mantenerse para los cables de trabajo según normas de clasificación?",["Registro con fecha de instalación, inspecciones, lubricaciones, incidentes y fecha de vencimiento de cada cable","Solo guardar el certificado original de fabricación","Solo registrar cuando hay incidentes o averías","No requiere registro específico en el diario"],0),
    Q("¿Qué precaución debe tomarse cuando un cable de acero está bajo tensión extrema?",["Alejarse de la línea de tensión del cable — si se rompe puede rebotar violentamente causando lesiones graves o muerte","Mantenerse cerca para mayor control de la operación","Pisar el cable para estabilizarlo","No hay peligro especial si el cable está certificado"],0),
    Q("¿Qué es el vencimiento de un cable de acero y quién lo determina?",["Fecha límite de uso determinada por el fabricante, normas de clasificación y tipo de servicio — obligatorio respetarlo","Solo una recomendación del fabricante sin obligación","Solo aplica a cables de botes salvavidas","Lo decide libremente el capitán del buque"],0),
  ],
};


// PAYMENT CONFIG
const PAYMENT_CONFIG = {
  clabe: "722969013321418745",
  bank: "Mercado Pago",
  whatsapp: "529841377404",
  price: "$50 MXN",
  mplink: "https://mpago.la/1j3E5vp",
};

// GOOGLE SHEETS INTEGRATION
const SHEETS_URL = "https://script.google.com/macros/s/AKfycbwndPUvMMYECNlfYNX2CSsf_X6rCoBA_llT6edjgmxnx1fHpIQpfDZDA8U_pmsptEWd/exec";

async function sendResultsToSheets(profile, topic, lang, correctCount, totalQuestions) {
  try {
    const pct = Math.round((correctCount / totalQuestions) * 100);
    const data = {
      fecha: new Date().toLocaleString("es-MX"),
      nombre: profile?.nombre || "Sin nombre",
      telefono: profile?.tel || "",
      correo: profile?.correo || "",
      buque: profile?.buque || "",
      rango: profile?.rango || "",
      empresa: profile?.empresa || "",
      tema: lang === "es" ? topic.nameEs : topic.nameEn,
      calificacion: pct + "%",
      competente: pct >= 80 ? "SÍ" : "NO",
      correctas: correctCount,
      incorrectas: totalQuestions - correctCount,
    };
    await fetch(SHEETS_URL, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "application/json",
        "anthropic-version": "2023-06-01",
        "anthropic-dangerous-direct-browser-access": "true",
      },
      body: JSON.stringify(data),
    });
  } catch (err) {
    console.log("Sheets error:", err);
  }
}
const ADMIN_PASSWORD = "Alfred@11";
const ADMIN_KEYS_STORAGE = "creweval_admin_keys";

function loadAdminKeys() {
  try { return JSON.parse(localStorage.getItem(ADMIN_KEYS_STORAGE) || "{}"); } catch { return {}; }
}
function saveAdminKeys(keys) {
  try { localStorage.setItem(ADMIN_KEYS_STORAGE, JSON.stringify(keys)); } catch {}
}
function generateCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}
function getValidKeys() {
  const adminKeys = loadAdminKeys();
  const keys = {};
  for (let i = 2; i <= 22; i++) {
    keys[`CREW-${i}-DEMO1`] = { topicId: i, attempts: 3, used: false, createdAt: "demo" };
  }
  Object.entries(adminKeys).forEach(([k, v]) => { keys[k] = v; });
  return keys;
}

// SHUFFLE with seed (garantiza preguntas distintas cada sesión)
function seededShuffle(arr) {
  // Usamos timestamp + random para que cada tripulante en el mismo barco
  // vea un orden diferente en la misma sesión
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// QUESTION GENERATOR — ES/EN pre-translated static banks (no API needed)
async function generateQuestions(topic, lang, count = 30) {
  const isEN = lang === "en";
  let pool;

  if (CUSTOM_QUESTIONS[topic.id] && CUSTOM_QUESTIONS[topic.id].length >= count) {
    pool = seededShuffle(CUSTOM_QUESTIONS[topic.id]).slice(0, count);
  } else {
    const bank = isEN
      ? (FALLBACK_QUESTIONS_EN[topic.id] || FALLBACK_QUESTIONS_EN[1])
      : (FALLBACK_QUESTIONS[topic.id] || FALLBACK_QUESTIONS[1]);
    pool = seededShuffle(bank).slice(0, Math.min(count, bank.length));
  }

  return pool.map(q => {
    const opts = [...q.options];
    const correctText = opts[q.answer];
    const shuffledOpts = seededShuffle(opts);
    return { q: q.q, options: shuffledOpts, answer: shuffledOpts.indexOf(correctText) };
  });
}
const SK = "creweval_v3";
function loadState() {
  try { return JSON.parse(localStorage.getItem(SK) || "{}"); } catch { return {}; }
}
function saveState(s) {
  try { localStorage.setItem(SK, JSON.stringify(s)); } catch {}
}

// APP
export default function App() {
  const [lang, setLang] = useState("es");
  const [screen, setScreen] = useState("home");
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selected, setSelected] = useState(null);

  // Registration
  const [profile, setProfile] = useState(() => {
    try { return JSON.parse(localStorage.getItem("creweval_profile") || "null"); } catch { return null; }
  });
  const [showRegister, setShowRegister] = useState(false);
  const [regForm, setRegForm] = useState({ nombre: "", tel: "", correo: "", buque: "", rango: "", empresa: "" });
  const [regErrors, setRegErrors] = useState({});
  const [showModal, setShowModal] = useState(null);
  const [modalTab, setModalTab] = useState("pay");
  const [keyInput, setKeyInput] = useState("");
  const [keyError, setKeyError] = useState("");
  const [keySuccess, setKeySuccess] = useState("");
  const [showWallet, setShowWallet] = useState(false);
  const [showRedeem, setShowRedeem] = useState(false);
  const [coinAnim, setCoinAnim] = useState(false);
  const [state, setState] = useState(loadState);
  const [showAdmin, setShowAdmin] = useState(false);
  const [adminAuth, setAdminAuth] = useState(false);
  const [adminPass, setAdminPass] = useState("");
  const [adminPassError, setAdminPassError] = useState("");
  const [adminKeys, setAdminKeys] = useState(loadAdminKeys());
  const [selectedAdminTopic, setSelectedAdminTopic] = useState(2);
  const [newlyGeneratedKey, setNewlyGeneratedKey] = useState("");
  // state = { access: {topicId: {attemptsLeft, usedKeys:[]}}, coins: 0, coinTopics: [topicId,...] }

  const handleAdminLogin = () => {
    if (adminPass === ADMIN_PASSWORD) { setAdminAuth(true); setAdminPassError(""); }
    else { setAdminPassError("Contraseña incorrecta"); }
  };

  const handleGenerateKey = () => {
    const code = generateCode();
    const key = `CREW-${selectedAdminTopic}-${code}`;
    const newKeys = { ...adminKeys, [key]: { topicId: selectedAdminTopic, attempts: 3, used: false, createdAt: new Date().toLocaleDateString() } };
    setAdminKeys(newKeys);
    saveAdminKeys(newKeys);
    setNewlyGeneratedKey(key);
  };

  const handleDeleteKey = (key) => {
    const newKeys = { ...adminKeys };
    delete newKeys[key];
    setAdminKeys(newKeys);
    saveAdminKeys(newKeys);
  };

  const adminKeysList = Object.entries(adminKeys).sort((a, b) => b[1].createdAt - a[1].createdAt);
  const t = T[lang];
  const coins = state.coins || 0;
  const access = state.access || {};
  const coinTopics = state.coinTopics || [];

  const handleRegister = () => {
    const errors = {};
    if (!regForm.nombre.trim()) errors.nombre = true;
    if (!regForm.tel.trim()) errors.tel = true;
    if (Object.keys(errors).length > 0) { setRegErrors(errors); return; }
    const p = { ...regForm, fecha: new Date().toLocaleDateString() };
    localStorage.setItem("creweval_profile", JSON.stringify(p));
    setProfile(p);
    setShowRegister(false);
  };

  const updateState = (patch) => {
    const next = { ...state, ...patch };
    setState(next);
    saveState(next);
  };

  const getAccess = (topicId) => access[topicId] || null;
  const isUnlocked = (topic) => topic.free || coinTopics.includes(topic.id) || ((access[topic.id]?.attemptsLeft || 0) > 0);

  const handleTopicSelect = (topic) => {
    if (!profile) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    if (isUnlocked(topic)) { startEval(topic); return; }
    setModalTab("pay"); setKeyInput(""); setKeyError(""); setKeySuccess("");
    setShowModal(topic);
  };

  const handleActivateKey = () => {
    const key = keyInput.trim().toUpperCase();
    setKeyError(""); setKeySuccess("");
    const validKeys = getValidKeys();
    const keyData = validKeys[key];
    if (!keyData || keyData.topicId !== showModal.id) { setKeyError(t.keyError); return; }
    const allUsed = Object.values(access).flatMap(a => a.usedKeys || []);
    if (allUsed.includes(key)) { setKeyError(t.keyError); return; }
    // Mark key as used in admin keys
    const adminKeys = loadAdminKeys();
    if (adminKeys[key]) {
      adminKeys[key].used = true;
      saveAdminKeys(adminKeys);
    }
    const newAccess = {
      ...access,
      [showModal.id]: {
        attemptsLeft: (access[showModal.id]?.attemptsLeft || 0) + keyData.attempts,
        usedKeys: [...(access[showModal.id]?.usedKeys || []), key],
      },
    };
    updateState({ access: newAccess });
    setKeySuccess(t.keySuccess);
    setTimeout(() => { const tp = showModal; setShowModal(null); startEval(tp); }, 1400);
  };

  const handleRedeem = (topic) => {
    if ((state.freeTokens || 0) < 1) return;
    const newCoinTopics = [...coinTopics, topic.id];
    updateState({ freeTokens: (state.freeTokens || 1) - 1, coinTopics: newCoinTopics });
    setShowRedeem(false);
    startEval(topic);
  };

  const startEval = async (topic) => {
    setSelectedTopic(topic);
    setScreen("loading");
    setAnswers([]); setCurrent(0); setSelected(null);

    // Deduct attempt if not free and not coin-unlocked
    if (!topic.free && !coinTopics.includes(topic.id)) {
      const acc = access[topic.id];
      const remaining = (acc?.attemptsLeft || 0) - 1;
      updateState({ access: { ...access, [topic.id]: { ...acc, attemptsLeft: remaining } } });
    }

    try {
      const qs = await generateQuestions(topic, lang, 30);
      setQuestions(qs); setScreen("quiz");
    } catch {
      alert("Error cargando preguntas. Por favor intenta de nuevo.");
      setScreen("home");
    }
  };

  const handleNext = () => {
    const newAnswers = [...answers, { qi: current, sel: selected, correct: questions[current].answer }];
    setAnswers(newAnswers);
    if (current + 1 < questions.length) { setCurrent(c => c + 1); setSelected(null); }
    else {
      // Check for perfect score: every 5 perfect exams = 1 free exam
      const allCorrect = newAnswers.every(a => a.sel === a.correct);
      if (allCorrect) {
        const perfectCount = (state.coins || 0) + 1;
        if (perfectCount >= 5) {
          // 5 perfect exams reached! Award 1 free exam token
          const freeTokens = (state.freeTokens || 0) + 1;
          updateState({ coins: 0, freeTokens });
        } else {
          updateState({ coins: perfectCount });
        }
        setCoinAnim(true);
        setTimeout(() => setCoinAnim(false), 3000);
      }
      // Send results to Google Sheets
      const correctTotal = newAnswers.filter(a => a.sel === a.correct).length;
      sendResultsToSheets(profile, selectedTopic, lang, correctTotal, questions.length);
      setScreen("results");
    }
  };

  const correctCount = answers.filter(a => a.sel === a.correct).length;
  const pct = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0;
  const isCompetent = pct >= 80;
  const isPerfect = pct === 100;
  const attLeft = selectedTopic && !selectedTopic.free && !coinTopics.includes(selectedTopic?.id)
    ? (access[selectedTopic.id]?.attemptsLeft ?? 0) : null;

  const redeemableTopics = TOPICS.filter(tp => !tp.free && !isUnlocked(tp));

  return (
    <div style={S.root}>
      <div style={S.bgOverlay} /><div style={S.bgGrid} />

      {/* HEADER */}
      <header style={S.header}>
        <div style={S.headerInner}>
          <div style={S.logo}>
            <span style={S.logoIcon}>⚓</span>
            <div>
              <div style={S.logoTitle}>{t.appTitle}</div>
              <div style={S.logoSub}>{t.appSubtitle}</div>
            </div>
          </div>
          <div style={S.headerRight}>
            {profile && (
              <button style={S.profileBtn} onClick={() => setShowRegister(true)}>
                👤 <span style={S.profileName}>{profile.nombre.split(" ")[0]}</span>
              </button>
            )}
            <button style={S.adminBtn} onClick={() => { setShowAdmin(true); setAdminAuth(false); setAdminPass(""); setNewlyGeneratedKey(""); }}>⚙️</button>
            <button style={S.coinBtn} onClick={() => setShowWallet(true)}>
              🪙 <span style={S.coinCount}>{coins}</span>
            </button>
            <button style={S.langBtn} onClick={() => setLang(l => l === "es" ? "en" : "es")}>{t.lang}</button>
          </div>
        </div>
      </header>

      <main style={S.main}>

        {/* HOME */}
        {screen === "home" && (
          <div style={S.fadeIn}>

            {/* CAPTAIN HERO + REGISTER INLINE */}
            {!profile ? (
              <div style={S.heroCard}>
                {/* Captain SVG */}
                <svg width="120" height="160" viewBox="0 0 240 300" style={{display:"block", margin:"0 auto 8px"}}>
                  <rect width="240" height="300" fill="transparent"/>
                  <path d="M80 100 Q60 150 64 240" fill="#111111"/>
                  <path d="M160 100 Q180 150 176 240" fill="#111111"/>
                  <path d="M90 120 Q120 130 150 120 L154 240 L86 240 Z" fill="#f0f4f8"/>
                  <rect x="62" y="122" width="32" height="24" rx="4" fill="#e8eef4"/>
                  <rect x="62" y="122" width="32" height="7" rx="2" fill="#f0c040"/>
                  <rect x="62" y="131" width="32" height="7" rx="2" fill="#f0c040"/>
                  <rect x="62" y="140" width="32" height="5" rx="2" fill="#f0c040"/>
                  <rect x="146" y="122" width="32" height="24" rx="4" fill="#e8eef4"/>
                  <rect x="146" y="122" width="32" height="7" rx="2" fill="#f0c040"/>
                  <rect x="146" y="131" width="32" height="7" rx="2" fill="#f0c040"/>
                  <rect x="146" y="140" width="32" height="5" rx="2" fill="#f0c040"/>
                  <rect x="62" y="146" width="26" height="60" rx="8" fill="#f0f4f8"/>
                  <rect x="152" y="146" width="26" height="60" rx="8" fill="#f0f4f8"/>
                  <circle cx="120" cy="122" r="2.5" fill="#c8d0d8"/>
                  <circle cx="120" cy="140" r="2.5" fill="#c8d0d8"/>
                  <circle cx="120" cy="158" r="2.5" fill="#c8d0d8"/>
                  <rect x="106" y="84" width="28" height="38" rx="10" fill="#c8956c"/>
                  <ellipse cx="120" cy="60" rx="38" ry="42" fill="#c8956c"/>
                  <path d="M82 72 Q68 110 72 190" fill="#111111" opacity="0.95"/>
                  <path d="M158 72 Q172 110 168 190" fill="#111111" opacity="0.95"/>
                  <ellipse cx="120" cy="22" rx="40" ry="18" fill="#111111"/>
                  <rect x="68" y="-4" width="104" height="24" rx="5" fill="#0d1a3e"/>
                  <rect x="58" y="16" width="124" height="10" rx="3" fill="#0d1a3e"/>
                  <rect x="68" y="12" width="104" height="8" rx="2" fill="#f0c040"/>
                  <circle cx="120" cy="6" r="12" fill="#f0c040"/>
                  <text x="120" y="11" textAnchor="middle" fontSize="14" fill="#0d1a3e" fontWeight="bold">⚓</text>
                  <ellipse cx="104" cy="58" rx="7" ry="8" fill="#ffffff"/>
                  <ellipse cx="136" cy="58" rx="7" ry="8" fill="#ffffff"/>
                  <circle cx="104" cy="58" r="4.5" fill="#2a1a08"/>
                  <circle cx="136" cy="58" r="4.5" fill="#2a1a08"/>
                  <circle cx="106" cy="56" r="1.5" fill="#ffffff"/>
                  <circle cx="138" cy="56" r="1.5" fill="#ffffff"/>
                  <path d="M96 46 Q104 40 112 46" fill="none" stroke="#111111" strokeWidth="3" strokeLinecap="round"/>
                  <path d="M128 46 Q136 40 144 46" fill="none" stroke="#111111" strokeWidth="3" strokeLinecap="round"/>
                  <path d="M109 76 Q120 82 131 76" fill="#c06050"/>
                  <path d="M109 76 Q120 70 131 76" fill="none" stroke="#a05040" strokeWidth="2"/>
                  <ellipse cx="92" cy="68" rx="10" ry="6" fill="#e8907a" opacity="0.25"/>
                  <ellipse cx="148" cy="68" rx="10" ry="6" fill="#e8907a" opacity="0.25"/>
                </svg>

                <h2 style={S.heroTitle}>{lang === "es" ? "¡Bienvenido a CREW EVAL!" : "Welcome to CREW EVAL!"}</h2>
                <p style={S.heroSub}>{lang === "es" ? "Ingresa tus datos para comenzar tu evaluación marítima" : "Enter your details to start your maritime evaluation"}</p>

                {/* Form fields */}
                <div style={S.inlineForm}>
                  <div style={S.inlineRow}>
                    <div style={S.fieldGroup}>
                      <label style={S.fieldLabel}>👤 {lang === "es" ? "Nombre completo" : "Full name"} <span style={{color:"#ef9a9a"}}>*</span></label>
                      <input style={{ ...S.fieldInput, ...(regErrors.nombre ? S.fieldError : {}) }}
                        placeholder={lang === "es" ? "Tu nombre" : "Your name"}
                        value={regForm.nombre}
                        onChange={e => { setRegForm({...regForm, nombre: e.target.value}); setRegErrors({...regErrors, nombre: false}); }}
                      />
                    </div>
                    <div style={S.fieldGroup}>
                      <label style={S.fieldLabel}>📱 {lang === "es" ? "Teléfono" : "Phone"} <span style={{color:"#ef9a9a"}}>*</span></label>
                      <input style={{ ...S.fieldInput, ...(regErrors.tel ? S.fieldError : {}) }}
                        placeholder={lang === "es" ? "Tu teléfono" : "Your phone"} type="tel"
                        value={regForm.tel}
                        onChange={e => { setRegForm({...regForm, tel: e.target.value}); setRegErrors({...regErrors, tel: false}); }}
                      />
                    </div>
                  </div>
                  <div style={S.inlineRow}>
                    <div style={S.fieldGroup}>
                      <label style={S.fieldLabel}>📧 {lang === "es" ? "Correo" : "Email"} <span style={S.optLabel}>{lang === "es" ? "(opcional)" : "(optional)"}</span></label>
                      <input style={S.fieldInput} placeholder={lang === "es" ? "Tu correo" : "Your email"} type="email"
                        value={regForm.correo} onChange={e => setRegForm({...regForm, correo: e.target.value})} />
                    </div>
                    <div style={S.fieldGroup}>
                      <label style={S.fieldLabel}>🚢 {lang === "es" ? "Nombre del buque" : "Vessel"} <span style={S.optLabel}>{lang === "es" ? "(opcional)" : "(optional)"}</span></label>
                      <input style={S.fieldInput} placeholder={lang === "es" ? "Nombre del buque" : "Vessel name"}
                        value={regForm.buque} onChange={e => setRegForm({...regForm, buque: e.target.value})} />
                    </div>
                  </div>
                  <div style={S.inlineRow}>
                    <div style={S.fieldGroup}>
                      <label style={S.fieldLabel}>⚓ {lang === "es" ? "Rango" : "Rank"} <span style={S.optLabel}>{lang === "es" ? "(opcional)" : "(optional)"}</span></label>
                      <input style={S.fieldInput} placeholder={lang === "es" ? "Marinero, Oficial..." : "Seaman, Officer..."}
                        value={regForm.rango} onChange={e => setRegForm({...regForm, rango: e.target.value})} />
                    </div>
                    <div style={S.fieldGroup}>
                      <label style={S.fieldLabel}>🏢 {lang === "es" ? "Empresa" : "Company"} <span style={S.optLabel}>{lang === "es" ? "(opcional)" : "(optional)"}</span></label>
                      <input style={S.fieldInput} placeholder={lang === "es" ? "Tu empresa naviera" : "Your shipping company"}
                        value={regForm.empresa} onChange={e => setRegForm({...regForm, empresa: e.target.value})} />
                    </div>
                  </div>
                  {(regErrors.nombre || regErrors.tel) && (
                    <p style={{color:"#ef9a9a", fontSize:11, textAlign:"center", margin:"0 0 8px"}}>
                      ⚠️ {lang === "es" ? "Nombre y teléfono son obligatorios" : "Name and phone are required"}
                    </p>
                  )}
                  <button style={S.startBtn} onClick={handleRegister}>
                    {lang === "es" ? "Ver temas y comenzar →" : "See topics and start →"}
                  </button>
                </div>
              </div>
            ) : (
              /* Profile bar when already registered */
              <div style={S.profileBar}>
                <div style={S.profileBarInfo}>
                  <span style={S.profileBarAvatar}>👤</span>
                  <div>
                    <div style={S.profileBarName}>{profile.nombre}</div>
                    <div style={S.profileBarMeta}>
                      {profile.rango && `${profile.rango} · `}
                      {profile.buque && `🚢 ${profile.buque} · `}
                      {profile.empresa && `🏢 ${profile.empresa}`}
                    </div>
                  </div>
                </div>
                <button style={S.editProfileBtn} onClick={() => setShowRegister(true)}>✏️</button>
              </div>
            )}

            <div style={S.homeTitle}>
              <h2 style={S.sectionTitle}>{t.selectTopic}</h2>
              <p style={S.sectionSub}>{t.selectTopicSub}</p>
              <div style={S.demoNote}>{t.demoNote}</div>
            </div>
            {!profile && (
              <div style={S.noBanner}>
                ⬆️ {lang === "es" ? "Ingresa tus datos arriba y presiona 'Ver temas y comenzar' para acceder a las evaluaciones" : "Enter your details above and press 'See topics and start' to access evaluations"}
              </div>
            )}
            <div style={S.coinBanner}>
              <span>🪙 {t.coinInfo}</span>
              {(state.freeTokens || 0) >= 1 && (
                <button style={S.redeemSmallBtn} onClick={() => setShowRedeem(true)}>{t.redeemBtn}</button>
              )}
            </div>
            <div style={S.topicGrid}>
              {TOPICS.map(topic => {
                const unlocked = isUnlocked(topic);
                const acc = access[topic.id];
                const left = acc?.attemptsLeft ?? 0;
                const coinUnlocked = coinTopics.includes(topic.id);
                return (
                  <button key={topic.id} style={{ ...S.topicCard, ...(unlocked ? S.topicUnlocked : {}), ...(!profile ? S.topicNoProfile : {}) }}
                    onClick={() => handleTopicSelect(topic)}>
                    <div style={S.topicBadge}>
                      {topic.free
                        ? <span style={{ ...S.badge, ...S.badgeFree }}>{t.free}</span>
                        : coinUnlocked
                          ? <span style={{ ...S.badge, ...S.badgeCoin }}>🪙</span>
                          : unlocked
                            ? <span style={{ ...S.badge, ...S.badgeActive }}>🎫 {left}</span>
                            : <span style={{ ...S.badge, ...S.badgePay }}>$50</span>
                      }
                    </div>
                    <div style={S.topicIcon}>{topic.icon}</div>
                    <div style={S.topicName}>{lang === "es" ? topic.nameEs : topic.nameEn}</div>
                    <div style={S.topicMeta}>30 {t.questions}</div>
                    {!unlocked && <div style={S.lockOverlay}>🔒</div>}
                  </button>
                );
              })}
            </div>
            <div style={S.passInfo}>📋 {t.minPass}</div>
          </div>
        )}

        {/* LOADING */}
        {screen === "loading" && (
          <div style={S.loadingScreen}>
            <div style={S.spinner} />
            <p style={S.loadingText}>{t.generating}</p>
            <p style={S.loadingTopic}>{selectedTopic && (lang === "es" ? selectedTopic.nameEs : selectedTopic.nameEn)}</p>
          </div>
        )}

        {/* QUIZ */}
        {screen === "quiz" && questions.length > 0 && (
          <div style={S.fadeIn}>
            <div style={S.quizHeader}>
              <div style={S.quizTopic}>{selectedTopic?.icon} {lang === "es" ? selectedTopic?.nameEs : selectedTopic?.nameEn}</div>
              <div style={S.quizProgress}>{t.question} {current + 1} {t.of} {questions.length}</div>
            </div>
            {attLeft !== null && <div style={S.attemptsBar}>🎫 {attLeft} {t.attemptsLeft}</div>}
            <div style={S.progressBar}><div style={{ ...S.progressFill, width: `${((current + 1) / questions.length) * 100}%` }} /></div>
            <div style={S.questionCard}>
              <p style={S.questionText}>{questions[current].q}</p>
              <div style={S.optionsList}>
                {questions[current].options.map((opt, idx) => {
                  let st = S.option;
                  if (idx === selected) st = { ...S.option, ...S.optSelected };
                  return (
                    <button key={idx} style={st} onClick={() => setSelected(idx)}>
                      <span style={S.optLetter}>{["A","B","C","D"][idx]}</span>
                      <span style={S.optText}>{opt}</span>
                    </button>
                  );
                })}
              </div>
            </div>
            {selected !== null && (
              <button style={S.nextBtn} onClick={handleNext}>
                {current + 1 < questions.length ? t.next : t.finish} →
              </button>
            )}
          </div>
        )}

        {/* RESULTS */}
        {screen === "results" && (
          <div style={S.fadeIn}>
            {coinAnim && <div style={S.coinAnim}>{(state.freeTokens||0)>=1 ? "🎁 ¡EXAMEN GRATIS DESBLOQUEADO! 🎁" : `🏆 Perfecto ${state.coins||0}/5 para examen gratis 🏆`}</div>}
            <div style={{ ...S.resultCard, ...(isCompetent ? S.resultOk : S.resultFail) }}>
              <div style={S.resultIcon}>{isPerfect ? "🏆" : isCompetent ? "✅" : "📚"}</div>
              <div style={S.resultStatus}>{isPerfect ? t.perfect : isCompetent ? t.competent : t.notYet}</div>
              <div style={S.resultMsg}>{isCompetent ? t.competentMsg : t.notYetMsg}</div>
              <div style={S.resultScore}>{pct}%</div>
              <div style={S.resultBreakdown}>
                <span style={S.bdOk}>✓ {correctCount} {t.correct}</span>
                <span style={S.bdFail}>✗ {questions.length - correctCount} {t.incorrect}</span>
              </div>
              {isPerfect && <div style={S.coinEarned}>{(state.freeTokens||0)>=1 ? "🎁 ¡Ganaste un examen gratis!" : `🏆 ${state.coins||0}/5 exámenes perfectos`}</div>}
              {attLeft !== null && <div style={S.attInfo}>🎫 {attLeft} {t.attemptsLeft}</div>}
            </div>

            <div style={S.resultActions}>
              {(selectedTopic?.free || coinTopics.includes(selectedTopic?.id) || attLeft > 0) && (
                <button style={S.tryAgainBtn} onClick={() => startEval(selectedTopic)}>🔄 {t.tryAgain}</button>
              )}
              {attLeft === 0 && !selectedTopic?.free && !coinTopics.includes(selectedTopic?.id) && (
                <button style={S.buyBtn} onClick={() => { setScreen("home"); setTimeout(() => handleTopicSelect(selectedTopic), 100); }}>🎫 {t.buyAgain}</button>
              )}
              <button style={S.homeBtn} onClick={() => setScreen("home")}>🏠 {t.backHome}</button>
            </div>
          </div>
        )}
      </main>

      {/* WALLET MODAL */}
      {showWallet && (
        <div style={S.overlay} onClick={() => setShowWallet(false)}>
          <div style={S.modal} onClick={e => e.stopPropagation()}>
            <div style={S.modalIcon}>🪙</div>
            <h3 style={S.modalTitle}>{t.coinsTitle}</h3>
            <div style={S.bigCoins}>{state.coins||0}<span style={{fontSize:14,color:"#aaa"}}>/5</span></div>
            <p style={S.coinDesc}>{t.coinsDesc}</p>
            <div style={S.coinProgress}>
              <div style={S.coinProgressBar}>
                <div style={{ ...S.coinProgressFill, width: `${Math.min((coins % 10) * 10, 100)}%` }} />
              </div>
              <div style={S.coinProgressLabel}>{coins % 10}/10 {lang === "es" ? "para próximo gratis" : "to next free"}</div>
            </div>
            {(state.freeTokens || 0) >= 1 && (
              <button style={S.redeemMainBtn} onClick={() => { setShowWallet(false); setShowRedeem(true); }}>
                {t.redeemBtn}
              </button>
            )}
            <button style={S.cancelBtn} onClick={() => setShowWallet(false)}>{t.cancelBtn}</button>
          </div>
        </div>
      )}

      {/* REDEEM MODAL */}
      {showRedeem && (
        <div style={S.overlay} onClick={() => setShowRedeem(false)}>
          <div style={{ ...S.modal, maxHeight: "85vh", overflowY: "auto" }} onClick={e => e.stopPropagation()}>
            <div style={S.modalIcon}>🎁</div>
            <h3 style={S.modalTitle}>{t.redeemTitle}</h3>
            <p style={S.coinDesc}>{t.redeemDesc}</p>
            <div style={S.redeemGrid}>
              {redeemableTopics.map(topic => (
                <button key={topic.id} style={S.redeemTopicBtn} onClick={() => handleRedeem(topic)}>
                  <span style={S.redeemIcon}>{topic.icon}</span>
                  <span style={S.redeemName}>{lang === "es" ? topic.nameEs : topic.nameEn}</span>
                </button>
              ))}
              {redeemableTopics.length === 0 && (
                <p style={{ color: "#78909c", fontSize: 13, textAlign: "center" }}>
                  {lang === "es" ? "Ya tienes acceso a todos los temas." : "You already have access to all topics."}
                </p>
              )}
            </div>
            <button style={S.cancelBtn} onClick={() => setShowRedeem(false)}>{t.cancelBtn}</button>
          </div>
        </div>
      )}

      {/* PAYMENT / KEY MODAL */}
      {showModal && (
        <div style={S.overlay} onClick={() => setShowModal(null)}>
          <div style={{ ...S.modal, maxHeight: "90vh", overflowY: "auto" }} onClick={e => e.stopPropagation()}>
            <div style={S.modalIcon}>{showModal.icon}</div>
            <h3 style={S.modalTitle}>{lang === "es" ? showModal.nameEs : showModal.nameEn}</h3>
            <div style={S.pricePill}>{t.unlockPrice}</div>
            <div style={S.tabs}>
              <button style={{ ...S.tab, ...(modalTab === "pay" ? S.tabActive : {}) }} onClick={() => setModalTab("pay")}>
                💳 {lang === "es" ? "Cómo Pagar" : "How to Pay"}
              </button>
              <button style={{ ...S.tab, ...(modalTab === "key" ? S.tabActive : {}) }} onClick={() => setModalTab("key")}>
                🔑 {lang === "es" ? "Tengo Clave" : "Have a Key"}
              </button>
            </div>
            {modalTab === "pay" && (
              <div>
                <p style={S.payDesc}>{t.unlockDesc}</p>
                <div style={S.payStep}><span style={S.payStepNum}>1</span>
                  <div>
                    <div style={S.payStepLabel}>{lang === "es" ? "Paga directo con Mercado Pago:" : "Pay directly with Mercado Pago:"}</div>
                    <a href={PAYMENT_CONFIG.mplink} target="_blank" rel="noreferrer" style={S.mpBtn} onClick={e => e.stopPropagation()}>
                      💳 {lang === "es" ? "Pagar $50 MXN aquí" : "Pay $50 MXN here"}
                    </a>
                    <div style={S.payStepLabel}>{lang === "es" ? "O transfiere a:" : "Or transfer to:"} <strong style={{color:"#4fc3f7"}}>CVU: {PAYMENT_CONFIG.clabe}</strong> · {PAYMENT_CONFIG.bank}</div>
                  </div>
                </div>
                <div style={S.payStep}><span style={S.payStepNum}>2</span>
                  <div style={S.payStepLabel}>{lang === "es" ? "Envía tu comprobante y el tema que deseas por" : "Send your receipt and desired topic via"}
                    <a href={`https://wa.me/${PAYMENT_CONFIG.whatsapp}`} target="_blank" rel="noreferrer" style={S.waLink}>&nbsp;📱 {t.whatsapp}</a>
                  </div>
                </div>
                <div style={S.payStep}><span style={S.payStepNum}>3</span>
                  <div style={S.payStepLabel}>{lang === "es" ? `Recibirás tu clave (formato: CREW-${showModal.id}-XXXX)` : `You'll receive your key (format: CREW-${showModal.id}-XXXX)`}</div>
                </div>
                <button style={S.switchToKeyBtn} onClick={() => setModalTab("key")}>
                  🔑 {lang === "es" ? "Ya pagué, ingresar clave →" : "Already paid, enter key →"}
                </button>
              </div>
            )}
            {modalTab === "key" && (
              <div style={{textAlign:"center"}}>
                <p style={S.keyLabel}>{t.enterKey}</p>
                <input style={S.keyInput} placeholder={t.keyPlaceholder} value={keyInput}
                  onChange={e => { setKeyInput(e.target.value); setKeyError(""); setKeySuccess(""); }}
                  onKeyDown={e => e.key === "Enter" && handleActivateKey()} autoComplete="off" />
                {keyError && <p style={S.keyError}>⚠️ {keyError}</p>}
                {keySuccess && <p style={S.keySuccessMsg}>✅ {keySuccess}</p>}
                <button style={S.activateBtn} onClick={handleActivateKey}>{t.activateBtn}</button>
                <p style={S.demoKeyHint}>Demo: CREW-{showModal.id}-DEMO1</p>
              </div>
            )}
            <button style={S.cancelBtn} onClick={() => setShowModal(null)}>{t.cancelBtn}</button>
          </div>
        </div>
      )}

      {/* ── ADMIN MODAL ── */}
      {showAdmin && (
        <div style={S.overlay} onClick={() => setShowAdmin(false)}>
          <div style={{ ...S.modal, maxWidth: 420, maxHeight: "90vh", overflowY: "auto" }} onClick={e => e.stopPropagation()}>
            <div style={S.modalIcon}>⚙️</div>
            <h3 style={S.modalTitle}>Panel Administrador</h3>

            {!adminAuth ? (
              <div style={{textAlign:"center"}}>
                <p style={{fontSize:12, color:"#78909c", marginBottom:10}}>Ingresa tu contraseña de administrador</p>
                <input style={S.keyInput} type="password" placeholder="Contraseña" value={adminPass}
                  onChange={e => { setAdminPass(e.target.value); setAdminPassError(""); }}
                  onKeyDown={e => e.key === "Enter" && handleAdminLogin()} />
                {adminPassError && <p style={S.keyError}>⚠️ {adminPassError}</p>}
                <button style={S.activateBtn} onClick={handleAdminLogin}>Entrar</button>
              </div>
            ) : (
              <div>
                {/* GENERATE KEY SECTION */}
                <div style={S.adminSection}>
                  <p style={S.adminSectionTitle}>🔑 Generar nueva clave</p>
                  <p style={{fontSize:11, color:"#78909c", margin:"0 0 10px"}}>Selecciona el tema y genera una clave única para tu cliente:</p>
                  <select style={S.adminSelect} value={selectedAdminTopic} onChange={e => { setSelectedAdminTopic(Number(e.target.value)); setNewlyGeneratedKey(""); }}>
                    {TOPICS.filter(t => !t.free).map(topic => (
                      <option key={topic.id} value={topic.id}>{topic.icon} {topic.nameEs}</option>
                    ))}
                  </select>
                  <button style={S.generateBtn} onClick={handleGenerateKey}>🎲 Generar Clave</button>
                  {newlyGeneratedKey && (
                    <div style={S.newKeyBox}>
                      <p style={{fontSize:11, color:"#81c784", margin:"0 0 4px"}}>✅ Clave generada — mándala por WhatsApp:</p>
                      <div style={S.newKeyCode}>{newlyGeneratedKey}</div>
                      <p style={{fontSize:10, color:"#546e7a", margin:"4px 0 0"}}>3 intentos · Válida para: {TOPICS.find(t => t.id === selectedAdminTopic)?.nameEs}</p>
                    </div>
                  )}
                </div>

                {/* KEYS LIST */}
                <div style={S.adminSection}>
                  <p style={S.adminSectionTitle}>📋 Claves generadas ({adminKeysList.length})</p>
                  {adminKeysList.length === 0 && (
                    <p style={{fontSize:12, color:"#546e7a", textAlign:"center"}}>Aún no has generado claves</p>
                  )}
                  {adminKeysList.map(([key, data]) => {
                    const topic = TOPICS.find(t => t.id === data.topicId);
                    return (
                      <div key={key} style={{ ...S.adminKeyRow, ...(data.used ? S.adminKeyUsed : {}) }}>
                        <div style={{flex:1}}>
                          <div style={S.adminKeyCode}>{key}</div>
                          <div style={S.adminKeyMeta}>{topic?.icon} {topic?.nameEs} · {data.createdAt}</div>
                        </div>
                        <div style={{display:"flex", gap:6, alignItems:"center"}}>
                          {data.used
                            ? <span style={S.usedBadge}>Usada</span>
                            : <span style={S.availBadge}>Disponible</span>
                          }
                          <button style={S.deleteKeyBtn} onClick={() => handleDeleteKey(key)}>✕</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            <button style={S.cancelBtn} onClick={() => setShowAdmin(false)}>Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
}

// STYLES
const S = {
  root: { minHeight: "100vh", background: "#0a0f1e", color: "#e8eaf6", fontFamily: "'Segoe UI', system-ui, sans-serif", position: "relative", overflowX: "hidden" },
  bgOverlay: { position: "fixed", inset: 0, background: "radial-gradient(ellipse at 20% 50%, rgba(0,80,160,0.15) 0%, transparent 60%)", pointerEvents: "none", zIndex: 0 },
  bgGrid: { position: "fixed", inset: 0, backgroundImage: "linear-gradient(rgba(0,100,200,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,100,200,0.05) 1px, transparent 1px)", backgroundSize: "40px 40px", pointerEvents: "none", zIndex: 0 },
  header: { position: "sticky", top: 0, background: "rgba(10,15,30,0.96)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(0,120,255,0.2)", zIndex: 100, padding: "0 16px" },
  headerInner: { maxWidth: 700, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 60 },
  logo: { display: "flex", alignItems: "center", gap: 8 },
  logoIcon: { fontSize: 26 },
  logoTitle: { fontFamily: "'Georgia', serif", fontSize: 20, fontWeight: 700, color: "#4fc3f7", letterSpacing: 2 },
  logoSub: { fontSize: 9, color: "#546e7a", letterSpacing: 1.5, textTransform: "uppercase" },
  headerRight: { display: "flex", gap: 8, alignItems: "center" },
  coinBtn: { background: "rgba(255,193,7,0.1)", border: "1px solid rgba(255,193,7,0.3)", color: "#ffc107", padding: "5px 12px", borderRadius: 20, cursor: "pointer", fontSize: 13, fontWeight: 700, display: "flex", alignItems: "center", gap: 4 },
  coinCount: { fontSize: 14, fontWeight: 900 },
  langBtn: { background: "rgba(0,120,255,0.15)", border: "1px solid rgba(0,120,255,0.4)", color: "#4fc3f7", padding: "5px 12px", borderRadius: 6, cursor: "pointer", fontSize: 12, fontWeight: 700 },
  main: { maxWidth: 700, margin: "0 auto", padding: "20px 14px 48px", position: "relative", zIndex: 1 },
  fadeIn: { animation: "fadeIn 0.35s ease" },

  homeTitle: { textAlign: "center", marginBottom: 14 },
  sectionTitle: { fontSize: 21, fontWeight: 700, color: "#e3f2fd", margin: "0 0 4px", fontFamily: "'Georgia', serif" },
  sectionSub: { color: "#78909c", fontSize: 12, margin: "0 0 8px" },
  demoNote: { display: "inline-block", background: "rgba(255,193,7,0.1)", border: "1px solid rgba(255,193,7,0.3)", color: "#ffc107", fontSize: 10, padding: "3px 10px", borderRadius: 20 },

  noBanner: { background: "rgba(255,160,0,0.1)", border: "1px solid rgba(255,160,0,0.3)", borderRadius: 10, padding: "10px 14px", fontSize: 12, color: "#ffb74d", marginBottom: 12, textAlign: "center" },
  coinBanner: { background: "rgba(255,193,7,0.07)", border: "1px solid rgba(255,193,7,0.2)", borderRadius: 10, padding: "9px 14px", marginBottom: 14, fontSize: 12, color: "#ffc107", display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center", justifyContent: "space-between" },
  redeemSmallBtn: { background: "rgba(255,193,7,0.15)", border: "1px solid rgba(255,193,7,0.4)", color: "#ffc107", padding: "5px 12px", borderRadius: 8, cursor: "pointer", fontSize: 11, fontWeight: 700 },

  topicGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(126px, 1fr))", gap: 9, marginBottom: 14 },
  topicCard: { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(0,120,255,0.15)", borderRadius: 11, padding: "12px 8px", cursor: "pointer", textAlign: "center", position: "relative", color: "#e8eaf6", overflow: "hidden", transition: "all 0.2s" },
  topicNoProfile: { opacity: 0.5, cursor: "not-allowed" },
  topicIcon: { fontSize: 28, marginBottom: 5 },
  topicName: { fontSize: 10, fontWeight: 600, color: "#cfd8dc", lineHeight: 1.3, marginBottom: 3 },
  topicMeta: { fontSize: 9, color: "#546e7a" },
  lockOverlay: { position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(10,15,30,0.55)", fontSize: 16, borderRadius: 11 },
  topicBadge: { position: "absolute", top: 5, right: 5 },
  badge: { fontSize: 8, fontWeight: 700, padding: "2px 5px", borderRadius: 4 },
  badgeFree: { background: "rgba(0,200,100,0.2)", color: "#81c784" },
  badgeActive: { background: "rgba(0,200,100,0.2)", color: "#81c784" },
  badgePay: { background: "rgba(255,160,0,0.2)", color: "#ffb74d" },
  badgeCoin: { background: "rgba(255,193,7,0.2)", color: "#ffc107" },
  passInfo: { textAlign: "center", color: "#546e7a", fontSize: 11, padding: "4px 0" },

  loadingScreen: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 300, gap: 14 },
  spinner: { width: 46, height: 46, border: "3px solid rgba(0,120,255,0.2)", borderTop: "3px solid #4fc3f7", borderRadius: "50%", animation: "spin 0.8s linear infinite" },
  loadingText: { color: "#78909c", fontSize: 13 },
  loadingTopic: { color: "#4fc3f7", fontSize: 17, fontWeight: 700 },

  quizHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 },
  quizTopic: { fontSize: 12, fontWeight: 600, color: "#4fc3f7" },
  quizProgress: { fontSize: 11, color: "#546e7a" },
  attemptsBar: { textAlign: "right", fontSize: 11, color: "#81c784", marginBottom: 5, fontWeight: 600 },
  progressBar: { height: 3, background: "rgba(255,255,255,0.08)", borderRadius: 2, marginBottom: 16, overflow: "hidden" },
  progressFill: { height: "100%", background: "linear-gradient(90deg, #0077cc, #4fc3f7)", borderRadius: 2, transition: "width 0.4s ease" },
  questionCard: { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(0,120,255,0.15)", borderRadius: 13, padding: 16, marginBottom: 12 },
  questionText: { fontSize: 14, fontWeight: 600, color: "#e3f2fd", lineHeight: 1.5, marginBottom: 13 },
  optionsList: { display: "flex", flexDirection: "column", gap: 8 },
  option: { display: "flex", alignItems: "center", gap: 9, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, padding: "10px 13px", cursor: "pointer", textAlign: "left", color: "#cfd8dc", fontSize: 13, transition: "all 0.2s" },
  optSelected: { background: "rgba(0,120,255,0.15)", border: "1px solid rgba(0,120,255,0.6)", color: "#e3f2fd" },
  optCorrect: { background: "rgba(0,200,100,0.12)", border: "1px solid rgba(0,200,100,0.45)", color: "#a5d6a7" },
  optWrong: { background: "rgba(255,80,80,0.1)", border: "1px solid rgba(255,80,80,0.4)", color: "#ef9a9a" },
  optLetter: { fontWeight: 700, color: "#4fc3f7", minWidth: 16, fontSize: 11 },
  optText: { flex: 1 },
  nextBtn: { width: "100%", padding: "12px", borderRadius: 9, border: "none", background: "linear-gradient(135deg, #0066cc, #0099dd)", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer" },

  coinAnim: { position: "fixed", top: "20%", left: "50%", transform: "translateX(-50%)", background: "rgba(255,193,7,0.95)", color: "#000", fontWeight: 900, fontSize: 18, padding: "12px 24px", borderRadius: 30, zIndex: 999, animation: "coinPop 3s ease forwards", whiteSpace: "nowrap" },

  resultCard: { borderRadius: 14, padding: 20, textAlign: "center", marginBottom: 18, border: "1px solid" },
  resultOk: { background: "rgba(0,180,90,0.1)", borderColor: "rgba(0,180,90,0.4)" },
  resultFail: { background: "rgba(255,100,0,0.08)", borderColor: "rgba(255,100,0,0.3)" },
  resultIcon: { fontSize: 40, marginBottom: 5 },
  resultStatus: { fontSize: 18, fontWeight: 700, marginBottom: 5, letterSpacing: 1 },
  resultMsg: { color: "#90a4ae", fontSize: 12, marginBottom: 12 },
  resultScore: { fontSize: 50, fontWeight: 900, color: "#4fc3f7", lineHeight: 1 },
  resultBreakdown: { display: "flex", gap: 16, justifyContent: "center", marginTop: 8 },
  bdOk: { color: "#81c784", fontSize: 12, fontWeight: 600 },
  bdFail: { color: "#ef9a9a", fontSize: 12, fontWeight: 600 },
  coinEarned: { marginTop: 10, background: "rgba(255,193,7,0.15)", border: "1px solid rgba(255,193,7,0.4)", color: "#ffc107", fontSize: 12, fontWeight: 700, padding: "6px 14px", borderRadius: 20, display: "inline-block" },
  attInfo: { marginTop: 8, fontSize: 11, color: "#81c784", fontWeight: 600 },

  reviewSection: { marginBottom: 16 },
  reviewTitleOk: { fontSize: 13, fontWeight: 700, color: "#81c784", marginBottom: 7 },
  reviewTitleFail: { fontSize: 13, fontWeight: 700, color: "#ef9a9a", marginBottom: 7 },
  reviewItemOk: { background: "rgba(255,255,255,0.03)", borderLeft: "3px solid #81c784", borderRadius: "0 7px 7px 0", padding: "8px 11px", marginBottom: 6 },
  reviewItemFail: { background: "rgba(255,255,255,0.03)", borderLeft: "3px solid #ef9a9a", borderRadius: "0 7px 7px 0", padding: "8px 11px", marginBottom: 6 },
  reviewQ: { fontSize: 11, color: "#cfd8dc", margin: "0 0 3px" },
  reviewA: { fontSize: 10, color: "#78909c", margin: 0 },

  resultActions: { display: "flex", gap: 9, flexWrap: "wrap" },
  tryAgainBtn: { flex: 1, padding: 12, borderRadius: 9, border: "1px solid rgba(0,120,255,0.3)", background: "rgba(0,120,255,0.1)", color: "#4fc3f7", fontSize: 12, fontWeight: 600, cursor: "pointer", minWidth: 110 },
  buyBtn: { flex: 1, padding: 12, borderRadius: 9, border: "1px solid rgba(255,160,0,0.4)", background: "rgba(255,160,0,0.1)", color: "#ffb74d", fontSize: 12, fontWeight: 600, cursor: "pointer", minWidth: 110 },
  homeBtn: { flex: 1, padding: 12, borderRadius: 9, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)", color: "#90a4ae", fontSize: 12, fontWeight: 600, cursor: "pointer", minWidth: 110 },

  overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.87)", backdropFilter: "blur(5px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, padding: 14 },
  modal: { background: "#0d1528", border: "1px solid rgba(0,120,255,0.3)", borderRadius: 16, padding: 22, maxWidth: 350, width: "100%" },
  modalIcon: { fontSize: 34, textAlign: "center", marginBottom: 5 },
  modalTitle: { fontSize: 16, fontWeight: 700, color: "#e3f2fd", margin: "0 0 5px", textAlign: "center" },
  pricePill: { display: "block", textAlign: "center", background: "rgba(255,160,0,0.15)", border: "1px solid rgba(255,160,0,0.3)", color: "#ffb74d", fontSize: 12, fontWeight: 700, padding: "4px 14px", borderRadius: 20, margin: "0 auto 12px", width: "fit-content" },

  bigCoins: { fontSize: 54, fontWeight: 900, color: "#ffc107", textAlign: "center", lineHeight: 1, margin: "8px 0" },
  coinDesc: { fontSize: 12, color: "#78909c", textAlign: "center", margin: "0 0 12px", lineHeight: 1.5 },
  coinProgress: { marginBottom: 14 },
  coinProgressBar: { height: 6, background: "rgba(255,193,7,0.15)", borderRadius: 3, overflow: "hidden", marginBottom: 4 },
  coinProgressFill: { height: "100%", background: "linear-gradient(90deg, #ffa000, #ffc107)", borderRadius: 3, transition: "width 0.5s ease" },
  coinProgressLabel: { fontSize: 10, color: "#78909c", textAlign: "right" },
  redeemMainBtn: { width: "100%", padding: "12px", borderRadius: 9, border: "none", background: "linear-gradient(135deg, #f57c00, #ffc107)", color: "#000", fontSize: 13, fontWeight: 700, cursor: "pointer", marginBottom: 8 },

  redeemGrid: { display: "flex", flexDirection: "column", gap: 7, marginBottom: 12 },
  redeemTopicBtn: { display: "flex", alignItems: "center", gap: 10, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,193,7,0.2)", borderRadius: 9, padding: "10px 14px", cursor: "pointer", textAlign: "left", color: "#e8eaf6", transition: "all 0.2s" },
  redeemIcon: { fontSize: 22 },
  redeemName: { fontSize: 13, fontWeight: 600 },

  tabs: { display: "flex", gap: 7, marginBottom: 14 },
  tab: { flex: 1, padding: "8px 6px", borderRadius: 7, border: "1px solid rgba(255,255,255,0.1)", background: "transparent", color: "#78909c", fontSize: 11, fontWeight: 600, cursor: "pointer" },
  tabActive: { background: "rgba(0,120,255,0.15)", border: "1px solid rgba(0,120,255,0.4)", color: "#4fc3f7" },
  payDesc: { fontSize: 11, color: "#78909c", textAlign: "center", marginBottom: 12 },
  payStep: { display: "flex", gap: 9, alignItems: "flex-start", marginBottom: 10 },
  payStepNum: { minWidth: 22, height: 22, borderRadius: "50%", background: "rgba(0,120,255,0.3)", color: "#4fc3f7", fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" },
  payStepLabel: { fontSize: 11, color: "#cfd8dc", lineHeight: 1.5 },
  bankBox: { background: "rgba(0,0,0,0.3)", border: "1px solid rgba(0,120,255,0.2)", borderRadius: 7, padding: "7px 10px", marginTop: 5 },
  bankLabel: { fontSize: 9, color: "#546e7a", marginBottom: 2 },
  bankNum: { fontSize: 13, fontWeight: 700, color: "#4fc3f7", letterSpacing: 1, fontFamily: "monospace" },
  bankName: { fontSize: 10, color: "#78909c", marginTop: 2 },
  waLink: { color: "#25D366", fontWeight: 700, textDecoration: "none" },
  switchToKeyBtn: { width: "100%", padding: "10px", borderRadius: 8, border: "1px solid rgba(0,120,255,0.3)", background: "rgba(0,120,255,0.1)", color: "#4fc3f7", fontSize: 12, fontWeight: 600, cursor: "pointer", marginTop: 6 },
  keyLabel: { fontSize: 12, color: "#cfd8dc", marginBottom: 8 },
  keyInput: { width: "100%", padding: "11px 12px", borderRadius: 8, border: "1px solid rgba(0,120,255,0.3)", background: "rgba(0,0,0,0.3)", color: "#e3f2fd", fontSize: 14, fontWeight: 700, textAlign: "center", letterSpacing: 2, boxSizing: "border-box", marginBottom: 5, outline: "none", fontFamily: "monospace" },
  keyError: { color: "#ef9a9a", fontSize: 11, margin: "0 0 7px" },
  keySuccessMsg: { color: "#81c784", fontSize: 12, fontWeight: 600, margin: "0 0 7px" },
  activateBtn: { width: "100%", padding: "12px", borderRadius: 8, border: "none", background: "linear-gradient(135deg, #0066cc, #00aaff)", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", marginBottom: 8 },
  demoKeyHint: { fontSize: 10, color: "#546e7a", fontFamily: "monospace", margin: "6px 0 0", textAlign: "center" },
  mpBtn: { display: "block", textAlign: "center", background: "linear-gradient(135deg, #00b1ea, #009ee3)", color: "#fff", fontWeight: 700, fontSize: 14, padding: "11px 16px", borderRadius: 9, textDecoration: "none", margin: "8px 0", cursor: "pointer" },
  heroCard: { background: "linear-gradient(135deg, rgba(0,40,100,0.6), rgba(10,15,30,0.8))", border: "1px solid rgba(0,120,255,0.25)", borderRadius: 16, padding: "24px 20px 20px", marginBottom: 18, textAlign: "center" },
  heroTitle: { fontSize: 20, fontWeight: 700, color: "#e3f2fd", margin: "0 0 6px", fontFamily: "'Georgia', serif" },
  heroSub: { fontSize: 12, color: "#78909c", margin: "0 0 18px" },
  inlineForm: { textAlign: "left" },
  inlineRow: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 0 },
  optLabel: { fontSize: 10, color: "#546e7a" },
  startBtn: { width: "100%", padding: "13px", borderRadius: 10, border: "none", background: "linear-gradient(135deg, #0066cc, #00aaff)", color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer", marginTop: 6 },
  profileBar: { background: "rgba(0,200,100,0.06)", border: "1px solid rgba(0,200,100,0.2)", borderRadius: 12, padding: "12px 16px", marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "space-between" },
  profileBarInfo: { display: "flex", alignItems: "center", gap: 10 },
  profileBarAvatar: { fontSize: 24 },
  profileBarName: { fontSize: 14, fontWeight: 600, color: "#e3f2fd" },
  profileBarMeta: { fontSize: 11, color: "#546e7a", marginTop: 2 },
  editProfileBtn: { background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#78909c", padding: "6px 10px", borderRadius: 8, cursor: "pointer", fontSize: 13 },
  profileBtn: { background: "rgba(0,200,100,0.1)", border: "1px solid rgba(0,200,100,0.3)", color: "#81c784", padding: "5px 10px", borderRadius: 20, cursor: "pointer", fontSize: 12, fontWeight: 600, display: "flex", alignItems: "center", gap: 4 },
  profileName: { maxWidth: 80, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  fieldGroup: { marginBottom: 10 },
  fieldLabel: { display: "block", fontSize: 11, color: "#90a4ae", marginBottom: 4, fontWeight: 600 },
  fieldInput: { width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid rgba(0,120,255,0.2)", background: "rgba(0,0,0,0.3)", color: "#e3f2fd", fontSize: 13, boxSizing: "border-box", outline: "none" },
  fieldError: { border: "1px solid rgba(255,80,80,0.5)", background: "rgba(255,80,80,0.05)" },
  adminBtn: { background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#78909c", padding: "5px 10px", borderRadius: 6, cursor: "pointer", fontSize: 14 },
  adminSection: { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: 14, marginBottom: 12 },
  adminSectionTitle: { fontSize: 13, fontWeight: 600, color: "#e3f2fd", margin: "0 0 8px" },
  adminSelect: { width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid rgba(0,120,255,0.3)", background: "rgba(0,0,0,0.3)", color: "#e3f2fd", fontSize: 13, marginBottom: 8, outline: "none" },
  generateBtn: { width: "100%", padding: "11px", borderRadius: 8, border: "none", background: "linear-gradient(135deg, #0066cc, #00aaff)", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer" },
  newKeyBox: { background: "rgba(0,200,100,0.08)", border: "1px solid rgba(0,200,100,0.3)", borderRadius: 8, padding: "10px 14px", marginTop: 10, textAlign: "center" },
  newKeyCode: { fontFamily: "monospace", fontSize: 18, fontWeight: 900, color: "#81c784", letterSpacing: 2 },
  adminKeyRow: { display: "flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 8, padding: "8px 10px", marginBottom: 6 },
  adminKeyUsed: { opacity: 0.5 },
  adminKeyCode: { fontFamily: "monospace", fontSize: 12, fontWeight: 700, color: "#4fc3f7" },
  adminKeyMeta: { fontSize: 10, color: "#546e7a", marginTop: 2 },
  usedBadge: { fontSize: 9, fontWeight: 700, background: "rgba(255,80,80,0.15)", color: "#ef9a9a", padding: "2px 6px", borderRadius: 4 },
  availBadge: { fontSize: 9, fontWeight: 700, background: "rgba(0,200,100,0.15)", color: "#81c784", padding: "2px 6px", borderRadius: 4 },
  deleteKeyBtn: { background: "rgba(255,80,80,0.1)", border: "1px solid rgba(255,80,80,0.3)", color: "#ef9a9a", width: 22, height: 22, borderRadius: 4, cursor: "pointer", fontSize: 11, display: "flex", alignItems: "center", justifyContent: "center" },
  cancelBtn: { width: "100%", padding: "9px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)", background: "transparent", color: "#546e7a", fontSize: 12, cursor: "pointer", marginTop: 6 },
};

const el = document.createElement("style");
el.textContent = `
  @keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
  @keyframes spin{to{transform:rotate(360deg)}}
  @keyframes coinPop{0%{opacity:0;transform:translateX(-50%) scale(0.5)}15%{opacity:1;transform:translateX(-50%) scale(1.1)}85%{opacity:1;transform:translateX(-50%) scale(1)}100%{opacity:0;transform:translateX(-50%) scale(0.9)}}
  button:hover{filter:brightness(1.12)}
`;
document.head.appendChild(el);
