import { renderHome } from "../views/home.js";
import { renderChat } from "../views/chat.js";
import { renderAbout } from "../views/about.js";
import { renderCharacters } from "../views/characters.js";
import { renderNotFound } from "../views/notfound.js";

const routes = {
  '/': renderHome,
  '/characters': renderCharacters,
  '/chat': renderChat,
  '/about': renderAbout,
};

export function router() {
  const path = window.location.pathname;
  const renderView = routes[path] || renderNotFound;
  renderView();
}