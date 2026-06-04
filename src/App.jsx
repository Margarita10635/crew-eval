import { useState, useEffect } from "react";

// ══════════════════════════════════════════════════════════════════════════════
// TRANSLATIONS
// ══════════════════════════════════════════════════════════════════════════════
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
    generating: "Generando evaluación con IA...", yourAnswer: "Tu respuesta", correctAnswer: "Respuesta correcta",
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
    coins: "Monedas", coinsTitle: "Tu Monedero", coinsDesc: "Saca 100% en cualquier evaluación y gana 5 monedas. Con 10 monedas obtienes 1 tema gratis.",
    coinsEarned: "¡Ganaste 5 monedas! 🪙", coinsRedeemed: "¡Tema desbloqueado con monedas! 🎉",
    redeemBtn: "Canjear 10 monedas por 1 tema gratis", redeemTitle: "Canjear Monedas",
    redeemDesc: "Tienes suficientes monedas. Elige qué tema desbloquear:",
    redeemConfirm: "Desbloquear este tema", redeemCancel: "Cancelar",
    notEnoughCoins: "Necesitas 10 monedas (tienes",
    perfect: "¡PERFECTO! 100% 🏆",
    coinInfo: "🪙 10 monedas = 1 tema gratis",
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
    generating: "Generating AI-powered evaluation...", yourAnswer: "Your answer", correctAnswer: "Correct answer",
    free: "FREE", attemptsLeft: "attempts left",
    unlockTitle: "Topic Access", unlockPrice: "$50 MXN · 3 attempts",
    unlockDesc: "Pay $50 MXN and get 3 attempts. You will receive an access key via WhatsApp.",
    enterKey: "Enter your access key", keyPlaceholder: "E.g: CREW-5-XXXX",
    activateBtn: "Activate Key", cancelBtn: "Cancel",
    keyError: "Invalid or already used key.", keySuccess: "Key activated! You have 3 attempts.",
    demoNote: "★ Demo: AI-generated questions",
    whatsapp: "WhatsApp", bankInfo: "Bank Account / CLABE",
    buyAgain: "Buy new access",
    coins: "Coins", coinsTitle: "Your Wallet", coinsDesc: "Score 100% on any evaluation and earn 5 coins. With 10 coins you get 1 free topic.",
    coinsEarned: "You earned 5 coins! 🪙", coinsRedeemed: "Topic unlocked with coins! 🎉",
    redeemBtn: "Redeem 10 coins for 1 free topic", redeemTitle: "Redeem Coins",
    redeemDesc: "You have enough coins. Choose which topic to unlock:",
    redeemConfirm: "Unlock this topic", redeemCancel: "Cancel",
    notEnoughCoins: "You need 10 coins (you have",
    perfect: "PERFECT! 100% 🏆",
    coinInfo: "🪙 10 coins = 1 free topic",
  },
};

// ══════════════════════════════════════════════════════════════════════════════
// TOPICS  (solo id:1 es gratis)
// ══════════════════════════════════════════════════════════════════════════════
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

// ══════════════════════════════════════════════════════════════════════════════
// CUSTOM QUESTIONS BANK  ← aquí puedes agregar tus propias preguntas por tema
// Si un tema tiene preguntas aquí, se usan ESTAS (mezcladas) en lugar de IA.
// Formato: { topicId: [ {q, options:[4], answer:0-3}, ... ] }
// ══════════════════════════════════════════════════════════════════════════════
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

// ══════════════════════════════════════════════════════════════════════════════
// PAYMENT CONFIG
// ══════════════════════════════════════════════════════════════════════════════
const PAYMENT_CONFIG = {
  clabe: "722969013321418745",
  bank: "Mercado Pago",
  whatsapp: "529841377404",
  price: "$50 MXN",
  mplink: "https://mpago.la/1j3E5vp",
};

// ══════════════════════════════════════════════════════════════════════════════
// ADMIN CONFIG
// ══════════════════════════════════════════════════════════════════════════════
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

// ══════════════════════════════════════════════════════════════════════════════
// SHUFFLE with seed (garantiza preguntas distintas cada sesión)
// ══════════════════════════════════════════════════════════════════════════════
function seededShuffle(arr) {
  // Usamos timestamp + random para que cada tripulante en el mismo barco
  // vea un orden diferente en la misma sesión
  const seed = Date.now() + Math.random() * 999999;
  const a = [...arr];
  let s = seed;
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    const j = Math.abs(s) % (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ══════════════════════════════════════════════════════════════════════════════
// AI QUESTION GENERATOR
// ══════════════════════════════════════════════════════════════════════════════
async function generateQuestions(topic, lang, count = 30) {
  const langLabel = lang === "es" ? "Spanish" : "English";
  const topicName = lang === "es" ? topic.nameEs : topic.nameEn;

  // Use custom questions if available for this topic
  if (CUSTOM_QUESTIONS[topic.id] && CUSTOM_QUESTIONS[topic.id].length >= count) {
    const shuffled = seededShuffle(CUSTOM_QUESTIONS[topic.id]);
    // Also shuffle the options within each question to avoid patterns
    return shuffled.slice(0, count).map(q => {
      const opts = [...q.options];
      const correctText = opts[q.answer];
      const shuffledOpts = seededShuffle(opts);
      return { q: q.q, options: shuffledOpts, answer: shuffledOpts.indexOf(correctText) };
    });
  }

  // Otherwise use AI
  const prompt = `You are a maritime training expert. Generate exactly ${count} multiple-choice questions about "${topicName}" for maritime crew self-assessment.
IMPORTANT: Respond ONLY with a valid JSON array, no markdown, no explanation.
Each question: {"q":"question in ${langLabel}","options":["A","B","C","D"],"answer":0}
answer is the index (0-3) of the correct option. Make questions varied, practical and realistic for professional mariners. Avoid repeating similar questions.`;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4000,
      messages: [{ role: "user", content: prompt }],
    }),
  });
  const data = await response.json();
  const text = data.content.map(i => i.text || "").join("");
  const clean = text.replace(/```json|```/g, "").trim();
  const parsed = JSON.parse(clean).slice(0, count);
  return seededShuffle(parsed); // shuffle AI questions too
}

// ══════════════════════════════════════════════════════════════════════════════
// STORAGE
// ══════════════════════════════════════════════════════════════════════════════
const SK = "creweval_v3";
function loadState() {
  try { return JSON.parse(localStorage.getItem(SK) || "{}"); } catch { return {}; }
}
function saveState(s) {
  try { localStorage.setItem(SK, JSON.stringify(s)); } catch {}
}

// ══════════════════════════════════════════════════════════════════════════════
// APP
// ══════════════════════════════════════════════════════════════════════════════
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

  // Show register modal on first visit
  useEffect(() => {
    if (!profile) setShowRegister(true);
  }, []);

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
    if (coins < 10) return;
    const newCoinTopics = [...coinTopics, topic.id];
    updateState({ coins: coins - 10, coinTopics: newCoinTopics });
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
      // Check for perfect score → award coins
      const allCorrect = newAnswers.every(a => a.sel === a.correct);
      if (allCorrect) {
        const newCoins = (state.coins || 0) + 5;
        updateState({ coins: newCoins });
        setCoinAnim(true);
        setTimeout(() => setCoinAnim(false), 3000);
      }
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
            <div style={S.homeTitle}>
              <h2 style={S.sectionTitle}>{t.selectTopic}</h2>
              <p style={S.sectionSub}>{t.selectTopicSub}</p>
              <div style={S.demoNote}>{t.demoNote}</div>
            </div>
            <div style={S.coinBanner}>
              <span>🪙 {t.coinInfo}</span>
              {coins >= 10 && (
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
                  <button key={topic.id} style={{ ...S.topicCard, ...(unlocked ? S.topicUnlocked : {}) }}
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
            {coinAnim && <div style={S.coinAnim}>🪙🪙🪙 +5 {t.coins}! 🪙🪙🪙</div>}
            <div style={{ ...S.resultCard, ...(isCompetent ? S.resultOk : S.resultFail) }}>
              <div style={S.resultIcon}>{isPerfect ? "🏆" : isCompetent ? "✅" : "📚"}</div>
              <div style={S.resultStatus}>{isPerfect ? t.perfect : isCompetent ? t.competent : t.notYet}</div>
              <div style={S.resultMsg}>{isCompetent ? t.competentMsg : t.notYetMsg}</div>
              <div style={S.resultScore}>{pct}%</div>
              <div style={S.resultBreakdown}>
                <span style={S.bdOk}>✓ {correctCount} {t.correct}</span>
                <span style={S.bdFail}>✗ {questions.length - correctCount} {t.incorrect}</span>
              </div>
              {isPerfect && <div style={S.coinEarned}>{t.coinsEarned} · Total: {coins} 🪙</div>}
              {attLeft !== null && <div style={S.attInfo}>🎫 {attLeft} {t.attemptsLeft}</div>}
            </div>

            {answers.filter(a => a.sel === a.correct).length > 0 && (
              <div style={S.reviewSection}>
                <h3 style={S.reviewTitleOk}>✅ {t.reviewCorrect}</h3>
                {answers.filter(a => a.sel === a.correct).map((a, i) => (
                  <div key={i} style={S.reviewItemOk}>
                    <p style={S.reviewQ}>{questions[a.qi].q}</p>
                    <p style={S.reviewA}>{t.correctAnswer}: <strong>{questions[a.qi].options[a.correct]}</strong></p>
                  </div>
                ))}
              </div>
            )}
            {answers.filter(a => a.sel !== a.correct).length > 0 && (
              <div style={S.reviewSection}>
                <h3 style={S.reviewTitleFail}>❌ {t.reviewWrong}</h3>
                {answers.filter(a => a.sel !== a.correct).map((a, i) => (
                  <div key={i} style={S.reviewItemFail}>
                    <p style={S.reviewQ}>{questions[a.qi].q}</p>
                    <p style={{ ...S.reviewA, color: "#ef9a9a" }}>{t.yourAnswer}: {questions[a.qi].options[a.sel]}</p>
                  </div>
                ))}
              </div>
            )}

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
            <div style={S.bigCoins}>{coins}</div>
            <p style={S.coinDesc}>{t.coinsDesc}</p>
            <div style={S.coinProgress}>
              <div style={S.coinProgressBar}>
                <div style={{ ...S.coinProgressFill, width: `${Math.min((coins % 10) * 10, 100)}%` }} />
              </div>
              <div style={S.coinProgressLabel}>{coins % 10}/10 {lang === "es" ? "para próximo gratis" : "to next free"}</div>
            </div>
            {coins >= 10 && (
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
      {/* ── REGISTER MODAL ── */}
      {showRegister && (
        <div style={S.overlay} onClick={profile ? () => setShowRegister(false) : null}>
          <div style={{ ...S.modal, maxWidth: 380 }} onClick={e => e.stopPropagation()}>
            <div style={S.modalIcon}>⚓</div>
            <h3 style={S.modalTitle}>{profile ? "Tu Perfil" : lang === "es" ? "Bienvenido a CREW EVAL" : "Welcome to CREW EVAL"}</h3>
            <p style={{ fontSize: 12, color: "#78909c", textAlign: "center", margin: "0 0 16px" }}>
              {lang === "es" ? "Ingresa tus datos para comenzar" : "Enter your details to start"}
            </p>

            {/* Nombre - obligatorio */}
            <div style={S.fieldGroup}>
              <label style={S.fieldLabel}>👤 {lang === "es" ? "Nombre completo" : "Full name"} <span style={{color:"#ef9a9a"}}>*</span></label>
              <input style={{ ...S.fieldInput, ...(regErrors.nombre ? S.fieldError : {}) }}
                placeholder={lang === "es" ? "Tu nombre completo" : "Your full name"}
                value={regForm.nombre}
                onChange={e => { setRegForm({...regForm, nombre: e.target.value}); setRegErrors({...regErrors, nombre: false}); }}
              />
            </div>

            {/* Teléfono - obligatorio */}
            <div style={S.fieldGroup}>
              <label style={S.fieldLabel}>📱 {lang === "es" ? "Teléfono" : "Phone"} <span style={{color:"#ef9a9a"}}>*</span></label>
              <input style={{ ...S.fieldInput, ...(regErrors.tel ? S.fieldError : {}) }}
                placeholder={lang === "es" ? "Tu número de teléfono" : "Your phone number"}
                value={regForm.tel} type="tel"
                onChange={e => { setRegForm({...regForm, tel: e.target.value}); setRegErrors({...regErrors, tel: false}); }}
              />
            </div>

            {/* Correo - opcional */}
            <div style={S.fieldGroup}>
              <label style={S.fieldLabel}>📧 {lang === "es" ? "Correo electrónico" : "Email"} <span style={{color:"#546e7a", fontSize:10}}>{lang === "es" ? "(opcional)" : "(optional)"}</span></label>
              <input style={S.fieldInput} placeholder={lang === "es" ? "Tu correo" : "Your email"}
                value={regForm.correo} type="email"
                onChange={e => setRegForm({...regForm, correo: e.target.value})}
              />
            </div>

            {/* Buque - opcional */}
            <div style={S.fieldGroup}>
              <label style={S.fieldLabel}>🚢 {lang === "es" ? "Nombre del buque" : "Vessel name"} <span style={{color:"#546e7a", fontSize:10}}>{lang === "es" ? "(opcional)" : "(optional)"}</span></label>
              <input style={S.fieldInput} placeholder={lang === "es" ? "Nombre del buque" : "Vessel name"}
                value={regForm.buque}
                onChange={e => setRegForm({...regForm, buque: e.target.value})}
              />
            </div>

            {/* Rango - opcional */}
            <div style={S.fieldGroup}>
              <label style={S.fieldLabel}>⚓ {lang === "es" ? "Rango" : "Rank"} <span style={{color:"#546e7a", fontSize:10}}>{lang === "es" ? "(opcional)" : "(optional)"}</span></label>
              <input style={S.fieldInput} placeholder={lang === "es" ? "Ej: Marinero, Cocinero, Oficial..." : "E.g: Seaman, Cook, Officer..."}
                value={regForm.rango}
                onChange={e => setRegForm({...regForm, rango: e.target.value})}
              />
            </div>

            {/* Empresa - opcional */}
            <div style={S.fieldGroup}>
              <label style={S.fieldLabel}>🏢 {lang === "es" ? "Empresa naviera" : "Shipping company"} <span style={{color:"#546e7a", fontSize:10}}>{lang === "es" ? "(opcional)" : "(optional)"}</span></label>
              <input style={S.fieldInput} placeholder={lang === "es" ? "Nombre de tu empresa" : "Your company name"}
                value={regForm.empresa}
                onChange={e => setRegForm({...regForm, empresa: e.target.value})}
              />
            </div>

            {(regErrors.nombre || regErrors.tel) && (
              <p style={{ color: "#ef9a9a", fontSize: 11, textAlign: "center", margin: "0 0 8px" }}>
                ⚠️ {lang === "es" ? "Nombre y teléfono son obligatorios" : "Name and phone are required"}
              </p>
            )}

            <button style={S.activateBtn} onClick={handleRegister}>
              {profile ? (lang === "es" ? "Guardar cambios" : "Save changes") : (lang === "es" ? "Comenzar →" : "Start →")}
            </button>
            {profile && <button style={S.cancelBtn} onClick={() => setShowRegister(false)}>{t.cancelBtn}</button>}
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

// ══════════════════════════════════════════════════════════════════════════════
// STYLES
// ══════════════════════════════════════════════════════════════════════════════
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

  coinBanner: { background: "rgba(255,193,7,0.07)", border: "1px solid rgba(255,193,7,0.2)", borderRadius: 10, padding: "9px 14px", marginBottom: 14, fontSize: 12, color: "#ffc107", display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center", justifyContent: "space-between" },
  redeemSmallBtn: { background: "rgba(255,193,7,0.15)", border: "1px solid rgba(255,193,7,0.4)", color: "#ffc107", padding: "5px 12px", borderRadius: 8, cursor: "pointer", fontSize: 11, fontWeight: 700 },

  topicGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(126px, 1fr))", gap: 9, marginBottom: 14 },
  topicCard: { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(0,120,255,0.15)", borderRadius: 11, padding: "12px 8px", cursor: "pointer", textAlign: "center", position: "relative", color: "#e8eaf6", overflow: "hidden", transition: "all 0.2s" },
  topicUnlocked: { border: "1px solid rgba(0,200,100,0.2)", background: "rgba(0,200,100,0.04)" },
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
