import items from '../public/data/memories.js';

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
    const siteURL = process.env.APP_URL || "http://localhost:3000";
    return res.render("rooms.html", { siteURL });
}