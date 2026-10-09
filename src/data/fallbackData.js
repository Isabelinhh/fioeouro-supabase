// Dados usados como fallback caso a busca no Supabase falhe
// (sem internet, credenciais erradas, tabela vazia, etc.)

export const SERVICOS_FALLBACK = [
  { id: 'corte-fem', name: 'Corte feminino', note: '50 min', price: 120 },
  { id: 'corte-masc', name: 'Corte masculino', note: '30 min', price: 70 },
  { id: 'escova', name: 'Escova modelada', note: '45 min', price: 90 },
  { id: 'coloracao', name: 'Coloração global', note: '2h', price: 220 },
  { id: 'balayage', name: 'Mechas / Balayage', note: '3h', price: 380 },
  { id: 'hidratacao', name: 'Hidratação profunda', note: '40 min', price: 95 },
  { id: 'botox', name: 'Botox capilar', note: '1h30', price: 160 },
  { id: 'barba', name: 'Barba', note: '25 min', price: 55 },
];

export const STYLISTS = [
  { id: 'camila', name: 'Camila Duarte', spec: 'Coloração' },
  { id: 'rafael', name: 'Rafael Nunes', spec: 'Cortes' },
  { id: 'bianca', name: 'Bianca Alves', spec: 'Tratamentos' },
  { id: 'thiago', name: 'Thiago Reis', spec: 'Barba & corte' },
];

export const HOURS = ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00'];
