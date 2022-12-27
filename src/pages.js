import items from '../public/data/memories.js';
import path from 'path';
import { fileURLToPath } from 'url';

export function pageHome(req, res) {
    return res.render("home.html");
}

export function pageWaiting(req, res) {
    return res.render("waiting.html");
}

export function pageGame(req, res) {
    return res.render("game.html", { items, keys: Object.keys(items) });
}

export function pageEnd(req, res) {
    return res.render("end.html");
}

export function pageRules(req, res) {
    return res.render("rules.html");
}

export function pageAbout(req, res) {
    return res.render("about.html");
}

export function pageRooms(req, res) {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const rootPath = __dirname.split('src')[0];
    console.log(rootPath);
    return res.render("rooms.html");
}