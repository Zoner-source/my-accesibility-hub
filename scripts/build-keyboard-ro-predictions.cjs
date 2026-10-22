// Builds the Romanian base vocabulary for the web keyboard.
// Usage: node scripts/build-keyboard-ro-predictions.cjs
// Writes bennyshub/apps/tools/keyboard/ro_predictions.json. Edit the lists below, then re-run.
const fs = require('fs');
const path = require('path');
const OUT = path.join(__dirname, '..', 'bennyshub/apps/tools/keyboard/ro_predictions.json');

// Ordered roughly by usefulness/frequency for everyday AAC communication.
const words = `
DA NU EU TU EL EA NOI VOI EI ELE ȘI SAU DAR CĂ SĂ NE TE MĂ SE ÎL O LE LI ÎMI ÎȚI ÎI
ESTE SUNT E AM AI ARE AVEM AVEȚI AU FOST FI VREAU VREI VREA VREM VREȚI POT POȚI POATE PUTEM
AJUTOR VĂ ROG TE ROG MULȚUMESC MERSI BUNĂ SALUT PA BINE RĂU FOARTE MAI MULT PUȚIN ACUM AZI ASTĂZI
MÂINE IERI DIMINEAȚA SEARA NOAPTEA ZIUA ORA TIMP CÂND UNDE CINE CE CUM DE CÂT CÂTE CARE
DE LA ÎN PE CU DIN PENTRU LÂNGĂ SUB PESTE FĂRĂ DESPRE PÂNĂ DUPĂ ÎNAINTE ACASĂ AICI ACOLO
MAMA TATA FRATE SORĂ BUNICA BUNICUL FAMILIA PRIETEN PRIETENA DOCTOR ASISTENTA PROFESOARA
APĂ SUC LAPTE CEAI CAFEA PÂINE MÂNCARE SUPĂ CIORBĂ CARNE PUI PEȘTE OUĂ BRÂNZĂ FRUCTE MĂR BANANĂ
PORTOCALĂ PRĂJITURĂ CIOCOLATĂ BISCUIȚI ÎNGHEȚATĂ PIZZA CARTOFI OREZ PASTE LEGUME SALATĂ
MĂNÂNC BEAU DORM MERG STAU VIN PLEC JOC CITESC SCRIU ASCULT VĂD AUD SIMT ȘTIU CRED VORBESC
MĂNÂNCE BEA DOARME MERGE JOACĂ FACE FAC FACI SPUNE SPUN ZICE DAU IAU PUN ARĂT CAUT GĂSESC
DOARE DOR MI-E FOAME SETE FRIG CALD SOMN FRICĂ RUȘINE DURERE BOLNAV OBOSIT OBOSITĂ FERICIT
FERICITĂ TRIST TRISTĂ SUPĂRAT SUPĂRATĂ BUCUROS BUCUROASĂ NERVOS LINIȘTIT CURAJ
CAP BURTĂ SPATE PICIOR PICIOARE MÂNA MÂINI OCHI URECHE GÂT DINTE DINȚI NAS GURĂ INIMA
TOALETĂ BAIE PAT CAMERA BUCĂTĂRIE MASĂ SCAUN FEREASTRA UȘA LUMINA TELEVIZOR TELEFON TABLETĂ
CALCULATOR MUZICĂ FILM DESENE CARTE POVESTE JOC JOCURI MINGE AFARĂ PARC MAGAZIN ȘCOALĂ SPITAL
MAȘINA AUTOBUZ PLIMBARE VACANȚĂ CASĂ GRĂDINĂ CÂINE PISICĂ
ÎMI PLACE NU-MI PLACE IUBESC TE IUBESC VREAU SĂ NU VREAU AJUTĂ-MĂ AȘTEAPTĂ STOP GATA ÎNCĂ IAR
ALT ALTĂ ALTCEVA NIMIC TOT TOTUL TOȚI TOATE NIMENI CINEVA CEVA UNDEVA MEREU NICIODATĂ ACUM
UNU DOI TREI PATRU CINCI ȘASE ȘAPTE OPT NOUĂ ZECE
ROȘU ALBASTRU VERDE GALBEN NEGRU ALB MOV ROZ PORTOCALIU MARE MIC MICĂ NOU VECHI FRUMOS FRUMOASĂ
BUN BUNĂ GREU UȘOR REPEDE ÎNCET SUS JOS STÂNGA DREAPTA ÎNĂUNTRU APROAPE DEPARTE
DE CE PENTRU CĂ DACĂ ATUNCI DECI PROBABIL SIGUR POATE NU ȘTIU NU POT
BUNĂ ZIUA BUNĂ DIMINEAȚA BUNĂ SEARA NOAPTE BUNĂ LA REVEDERE CE FACI CUM EȘTI SUNT BINE
SCUZE ÎMI PARE RĂU FELICITĂRI LA MULȚI ANI POFTĂ BUNĂ SĂNĂTATE
SCHIMBĂ ÎNTOARCE DESCHIDE ÎNCHIDE PORNEȘTE OPREȘTE REPETĂ ÎNCEARCĂ VINO HAI SPUNE-MI
`.split(/\s+/).filter(Boolean);

// Common phrases: each consecutive pair becomes a bigram, each triple a trigram.
const phrases = `
AM NEVOIE DE AJUTOR
AM NEVOIE DE APĂ
AM NEVOIE LA TOALETĂ
VREAU SĂ MĂNÂNC
VREAU SĂ BEAU APĂ
VREAU SĂ DORM
VREAU SĂ MERG AFARĂ
VREAU SĂ MERG ACASĂ
VREAU SĂ MĂ JOC
VREAU SĂ VĂD UN FILM
VREAU SĂ ASCULT MUZICĂ
NU VREAU SĂ MĂNÂNC
MĂ DOARE CAPUL
MĂ DOARE BURTA
MĂ DOARE SPATELE
MI-E FOAME
MI-E SETE
MI-E FRIG
MI-E CALD
MI-E SOMN
MI-E FRICĂ
TE IUBESC MAMA
TE IUBESC TATA
MULȚUMESC FRUMOS
TE ROG FRUMOS
VĂ ROG FRUMOS
BUNĂ ZIUA
BUNĂ DIMINEAȚA
BUNĂ SEARA
NOAPTE BUNĂ
LA REVEDERE
CE FACI
CUM EȘTI
EU SUNT BINE
EU SUNT OBOSIT
EU SUNT FERICIT
NU ȘTIU
NU POT
ÎMI PARE RĂU
ÎMI PLACE MULT
NU-MI PLACE
POȚI SĂ MĂ AJUȚI
VINO AICI TE ROG
CE ESTE ASTA
UNDE ESTE MAMA
UNDE ESTE TATA
CÂND MERGEM ACASĂ
SCHIMBĂ CANALUL TE ROG
DESCHIDE TELEVIZORUL TE ROG
POFTĂ BUNĂ
LA MULȚI ANI
MAMA VINO AICI
MAMA TE IUBESC
MAMA AM NEVOIE DE AJUTOR
MAMA UNDE EȘTI
MAMA VREAU APĂ
MAMA MI-E FOAME
TATA VINO AICI
TATA TE IUBESC
TATA UNDE EȘTI
TATA VREAU SĂ MĂ JOC
`.trim().split('\n').map(p => p.trim().split(/\s+/));

// Base entries are dated well in the past so anything Ben types ranks above them.
const BASE_DATE = '2025-01-01T00:00:00.000Z';
const data = { frequent_words: {}, bigrams: {}, trigrams: {} };
const add = (table, key, count) => {
  if (!table[key]) table[key] = { count, last_used: BASE_DATE };
  else table[key].count = Math.max(table[key].count, count);
};
words.forEach((w, i) => add(data.frequent_words, w, Math.max(1000 - i * 2, 50)));
for (const p of phrases) {
  p.forEach(w => add(data.frequent_words, w, 100));
  for (let i = 1; i < p.length; i++) add(data.bigrams, `${p[i - 1]} ${p[i]}`, 200);
  for (let i = 2; i < p.length; i++) add(data.trigrams, `${p[i - 2]} ${p[i - 1]} ${p[i]}`, 300);
}

// Every entry must be typeable on the Romanian keyboard (no K, Q, W, X, Y).
const bad = Object.keys(data.frequent_words).filter(w => /[^A-ZĂÂÎȘȚ\-]|[KQWXY]/.test(w));
if (bad.length) throw new Error('Untypeable words: ' + bad.join(', '));

fs.writeFileSync(OUT, JSON.stringify(data, null, 1) + '\n');
console.log(`words ${Object.keys(data.frequent_words).length}, bigrams ${Object.keys(data.bigrams).length}, trigrams ${Object.keys(data.trigrams).length}`);
