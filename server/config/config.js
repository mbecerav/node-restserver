

// =======================
//  Puerto
// =======================
process.env.PORT = process.env.PORT || 3000;

// =======================
//  Vencimiento del TOKEN
// =======================
// 60 Segundos
// 60 Minutos
// 24 Horas
// 30 Dias
process.env.CADUCIDAD_TOKEN = 60 * 60  * 24 * 30;

// =======================
//  SEED de autenticacion
// =======================
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';