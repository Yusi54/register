// Fügt ein Briefing (oder mehrere) in index.html ein oder ersetzt es (gleiches Datum und Fach).
// Aufruf: node tools/briefing.js <briefing.json>
// Format: {d:"JJJJ-MM-TT", f:"LEAD", t:"Block 4: …", stand:"JJJJ-MM-TT HH:MM", kurz:"…", quelle:[…], ablauf:[…],
//          punkte:[{h:"Abschnitt", p:["…"]}], begriffe:[["Begriff","Erklärung"]], vorbereiten:[…], mitreden:[…], rueck:"…"}
const fs = require("fs"), path = require("path");
const datei = path.join(__dirname, "..", "index.html");
let html = fs.readFileSync(datei, "utf8");
const re = /\/\*BRIEFING-START\*\/([\s\S]*?)\/\*BRIEFING-END\*\//;
const m = html.match(re);
if (!m) { console.error("Briefing-Block in index.html nicht gefunden"); process.exit(1); }
const alt = JSON.parse(m[1].replace(/^\s*const BRIEFINGS\s*=\s*/, "").replace(/;\s*$/, ""));
let neu = JSON.parse(fs.readFileSync(process.argv[2], "utf8"));
if (!Array.isArray(neu)) neu = [neu];
for (const b of neu) {
  for (const k of ["d", "f", "t", "stand", "kurz", "punkte"]) if (!b[k]) { console.error("Feld fehlt: " + k); process.exit(1); }
  if (!/^\d{4}-\d\d-\d\d$/.test(b.d)) { console.error("Datum ungültig: " + b.d); process.exit(1); }
  const i = alt.findIndex(x => x.d === b.d && x.f === b.f);
  if (i >= 0) alt[i] = b; else alt.push(b);
}
alt.sort((a, b) => (a.d < b.d ? 1 : a.d > b.d ? -1 : a.f.localeCompare(b.f)));
const block = "/*BRIEFING-START*/\nconst BRIEFINGS = [\n" + alt.map(b => JSON.stringify(b)).join(",\n") + "\n];\n/*BRIEFING-END*/";
fs.writeFileSync(datei, html.replace(re, () => block));
console.log("Briefings in index.html:", alt.length, "· neu oder ersetzt:", neu.map(b => b.d + " " + b.f).join(", "));
