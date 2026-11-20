// Erzeugt termine.ics aus den Termindaten in index.html (Block zwischen TERMINE-START und TERMINE-END).
// Aufruf: node tools/ics.js
const fs = require("fs"), path = require("path");
const root = path.join(__dirname, "..");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const m = html.match(/\/\*TERMINE-START\*\/([\s\S]*?)\/\*TERMINE-END\*\//);
if (!m) { console.error("Termin-Block in index.html nicht gefunden"); process.exit(1); }
const ics = new Function(m[1] + "; return icsText();")();
fs.writeFileSync(path.join(root, "termine.ics"), ics);
console.log("termine.ics geschrieben:", (ics.match(/BEGIN:VEVENT/g) || []).length, "Termine");
