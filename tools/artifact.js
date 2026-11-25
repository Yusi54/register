// Baut aus index.html die Fassung für die Veröffentlichung als Claude-Artifact (ohne Dokument-Rahmen,
// ohne Datei-Download, Kalender-Abo nur per Link). Aufruf: node tools/artifact.js <zieldatei.html>
const fs = require("fs"), path = require("path");
let s = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");
const kopfEnde = s.indexOf("</head>"), koerper = s.indexOf("<body>") + 6;
let kopf = s.slice(0, kopfEnde).replace(/<!DOCTYPE html>\s*<html[^>]*>\s*<head>\s*/, "").replace(/<meta charset="utf-8">\s*/, "").replace(/<meta name="viewport"[^>]*>\s*/, "");
let rest = s.slice(koerper).replace(/<\/body>\s*<\/html>\s*$/, "");
let out = kopf.trim() + "\n" + rest.trim() + "\n";
const ersetze = (a, b) => { if (!out.includes(a)) { console.error("Stelle nicht gefunden: " + a.slice(0, 50)); process.exit(1); } out = out.replace(a, b); };
ersetze('    <button class="btn l" type="button" data-ics="dl">.ics-Datei laden</button>\n', "");
ersetze('<a class="btn" href="webcal://${ICS_PFAD}">Kalender abonnieren</a>\n    <button class="btn l" type="button" data-ics="copy">Abo-Link kopieren</button>', '<button class="btn" type="button" data-ics="copy">Abo-Link kopieren</button>');
ersetze("Das Abo aktualisiert sich selbst, wenn sich Termine ändern. Die Datei ist ein einmaliger Stand.", "Link kopieren und im Kalender unter «Per URL abonnieren» einfügen. Das Abo aktualisiert sich selbst, wenn sich Termine ändern.");
fs.writeFileSync(process.argv[2], out);
console.log("Artifact-Fassung geschrieben:", process.argv[2], out.length, "Zeichen");
