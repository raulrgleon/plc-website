#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");

const ROOT = __dirname;
const PAGES = path.join(ROOT, "pages");
const OUT = ROOT;

const CURRENT_KEYS = [
  "inicio",
  "estatutos",
  "miembros",
  "noticias",
  "contacto",
  "afiliarse",
];

function read(rel) {
  return fs.readFileSync(path.join(ROOT, rel), "utf8");
}

function parsePage(raw) {
  const m = raw.match(/^@@meta\n([\s\S]*?)\n@@\n([\s\S]*)$/);
  if (!m) throw new Error("Invalid page format (missing @@meta)");
  const meta = {};
  m[1].split("\n").forEach((line) => {
    const i = line.indexOf(":");
    if (i === -1) return;
    meta[line.slice(0, i).trim()] = line.slice(i + 1).trim();
  });
  return { meta, body: m[2] };
}

function applyCurrent(header, current) {
  let out = header;
  CURRENT_KEYS.forEach((key) => {
    const token = `{{current_${key}}}`;
    const val = current === key ? ' aria-current="page"' : "";
    out = out.split(token).join(val);
  });
  return out;
}

function build() {
  const head = read("partials/head.html");
  const header = read("partials/header.html");
  const footer = read("partials/footer.html");

  const files = fs.readdirSync(PAGES).filter((f) => f.endsWith(".html"));
  let count = 0;

  files.forEach((file) => {
    const { meta, body } = parsePage(fs.readFileSync(path.join(PAGES, file), "utf8"));
    const pageHead = head
      .replaceAll("{{title}}", meta.title || "PLC")
      .replaceAll("{{description}}", meta.description || "")
      .replaceAll("{{canonical}}", meta.canonical || file);

    const pageHeader = applyCurrent(header, meta.current || "");
    const html = pageHead + pageHeader + body + footer;
    fs.writeFileSync(path.join(OUT, file), html);
    count += 1;
    console.log("built", file);
  });

  console.log(`Done: ${count} pages`);
}

build();
