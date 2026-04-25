import { recipesData, recipeDetails, allRecipes } from "./recipesData.js";
import { categoryInfo } from "./categoryInfo.js";

const container = document.getElementById('categories');

/* ---------------------------
   STATE
----------------------------*/

const state = {
  page: "home",
  category: null,
  recipe: null,
  search: ""
};

/* ---------------------------
   ROUTER HELPERS
----------------------------*/

function getHashFromState(s) {
  if (s.page === "home") {
    return s.search ? `#home?q=${encodeURIComponent(s.search)}` : "#home";
  }
  if (s.page === "category") return `#cat-${s.category}`;
  if (s.page === "recipe") {
    return `#rec-${encodeURIComponent(s.recipe)}`;
  }
  return "#home";
}

function parseHash() {
  const hash = location.hash || "#home";
  const [path, query] = hash.split("?"); //путь запрос.  делим на дву пути

  let search = "";
  if (query) {
    const params = new URLSearchParams(query);
    search = params.get("q") || "";
  }

  if (path === "#home") {
    return { page: "home", category: null, recipe: null, search };
  }

  if (path.startsWith("#cat-")) { //начинается с
    return {
      page: "category",
      category: path.replace("#cat-", ""),
      recipe: null,
      search
    };
  }

if (path.startsWith("#rec-")) {
  return {
    page: "recipe",
    category: null,
    recipe: decodeURIComponent(path.replace("#rec-", "")),
    search
  };
}

  return { page: "home", category: null, recipe: null, search };
}

/* ---------------------------
   CLEAR SEARCH (NEW FIX)
----------------------------*/

function clearSearchUI() {
  state.search = "";

  const input = document.getElementById("searchInput");
  const dropdown = document.getElementById("searchDropdown"); //поиск выпадающий список

  if (input) input.value = "";

  if (dropdown) {
    dropdown.innerHTML = "";
    dropdown.classList.remove("active"); //удалить убрать
  }
}

/* ---------------------------
   NAVIGATE
----------------------------*/

function navigate(next) { //переход между главная рецепты категории
  Object.assign(state, next); //скопи данные одного в ддр(сост-е прил/куда хотм перейти)

  // 👉 очищаем поиск при переходе в рецепт
  if (state.page === "recipe") {
    clearSearchUI();
  }

  if (state.page === "home") {
    state.search = "";
    clearSearchUI();
  }


  location.hash = getHashFromState(state);
  render();
}

/* ---------------------------
   RENDER SWITCH
----------------------------*/

function render() {
  if (state.page === "home") return renderHome();
  if (state.page === "category") return renderCategory();
  if (state.page === "recipe") return renderRecipe();
}

/* ---------------------------
   HOME
----------------------------*/

function renderHome() { //перерисовка
  container.innerHTML = `
    <div class="top-bar">
      <h2>Категории</h2>

      <button id="coffeeOfDayBtn" class="coffee-day-btn">
        ☕ Кофе дня
      </button>

      <div class="search-box" id="searchBox">
        <span class="search-icon">🔍</span>

        <input
          id="searchInput"
          placeholder="Поиск кофе..."
          value="${state.search}"
          autocomplete="off"
        />

        <div id="searchDropdown" class="search-dropdown">
          ${renderSearchResults()}
        </div>
      </div>
    </div>

    <div class="cards-row">
      ${Object.entries(recipesData).map(([key, cat]) => `
        <div class="card" data-key="${key}">
          <img src="${cat.img}">
          <div class="card-title">${cat.title}</div>
        </div>
      `).join('')}
    </div>
  `;

}

/* ---------------------------
   SEARCH RESULTS
----------------------------*/

function renderSearchResults() { //отрисовать рез-ты поиска
  if (!state.search.trim()) return ""; //поиск пуст(только пробелы)-ничего не показ

  const filtered = allRecipes.filter(r => //создаём список только тех рецептов, которые подходят под поиск
    r.name.toLowerCase().includes(state.search.toLowerCase())
  ); //перевести в нижний регистр (чтобы не было разницы Капучино / капучино)
        //если название рецепта содержит текст поиска — оставить его
  return filtered.length
    ? filtered.map(r => `
        <div class="search-item" data-recipe="${r.name}">
          ☕ ${r.name} <small>(${r.category})</small>
        </div>
      `).join('')
    : `<div style="padding:10px;opacity:.6;">Ничего не найдено</div>`;
}

/* ---------------------------
   CATEGORY
----------------------------*/

function renderCategory() {
  const data = recipesData[state.category];
  const info = categoryInfo[state.category];

  if (!data) return navigate({ page: "home" });

  container.innerHTML = `
  <div class="category-hero">
    <h1 class="page-title">${data.title}</h1>

    ${info ? `
        <p class="category-desc">${info.description}</p>
        <div class="category-details">${info.details}</div>
      ` : ""}
    </div>

    <div class="recipe-list">
      ${data.recipes.map(item => `
        <div class="recipe-item" data-recipe="${item}">
          ☕ ${item}
        </div>
      `).join('')}
    </div>
  `;
}

/* ---------------------------
   RECIPE
----------------------------*/

function renderRecipe() {
  const data = recipeDetails[state.recipe];

  container.innerHTML = `
    <div class="recipe-page">
      <h1>${data?.title || state.recipe}</h1>
      <p>${data?.desc || "Описание скоро появится"}</p>

      ${data?.history ? `
        <div class="block">
          <h3>📖 История</h3>
          <p>${data.history}</p>
        </div>
      ` : ""}

      ${data?.ingredients ? `
        <div class="block">
          <h3>🧪 Ингредиенты</h3>
          <ul>
            ${data.ingredients.map(i => `<li>${i}</li>`).join("")}
          </ul>
        </div>
      ` : ""}

      ${data?.steps ? `
        <div class="block">
          <h3>👨‍🍳 Приготовление</h3>
          <ol>
            ${data.steps.map(s => `<li>${s}</li>`).join("")}
          </ol>
        </div>
      ` : ""}

      ${data?.tips ? `
        <div class="block">
          <h3>💡 Советы</h3>
          <ul>
            ${data.tips.map(t => `<li>${t}</li>`).join("")}
          </ul>
        </div>
      ` : ""}
    </div>
  `;
}
/* ---------------------------
   DEBOUNCE URL UPDATE
----------------------------*/

function debounce(fn, delay = 250) { //создаём функцию, которая не даёт вызывать другую функцию слишком часто
  let t; //таймер
  return (...args) => { //все переданные параметры
    clearTimeout(t);
    t = setTimeout(() => fn(...args), delay); //задержка
  };
}

const updateURL = debounce(() => { //
  const newHash = getHashFromState(state);
  history.replaceState(null, "", newHash);
}, 300);
/* ---------------------------
   EVENTS
----------------------------*/

function initEvents() {

  document.addEventListener('click', (e) => {

    const card = e.target.closest('.card');
    if (card) {
      navigate({ page: "category", category: card.dataset.key });
      return;
    }

    const recipeItem = e.target.closest('.recipe-item');
    if (recipeItem) {
      navigate({ page: "recipe", recipe: recipeItem.dataset.recipe });
      return;
    }

    const searchItem = e.target.closest('.search-item');
    if (searchItem) {
      navigate({ page: "recipe", recipe: searchItem.dataset.recipe });
      return;
    }

    const coffeeBtn = e.target.closest('#coffeeOfDayBtn');
  if (coffeeBtn) {
    const randomIndex = Math.floor(Math.random() * allRecipes.length);
    const randomRecipe = allRecipes[randomIndex];

    navigate({
      page: "recipe",
      recipe: randomRecipe.name
    });

    return;
  }

    const box = document.getElementById("searchBox");
    const dropdown = document.getElementById("searchDropdown");

    if (dropdown && box && !box.contains(e.target)) {
      dropdown.classList.remove("active");
    }
  });

  document.addEventListener('input', (e) => {
    if (e.target.id !== "searchInput") return;

    state.search = e.target.value;

    const dropdown = document.getElementById("searchDropdown");
    if (!dropdown) return;

    dropdown.classList.add("active");
    dropdown.innerHTML = renderSearchResults();

    updateURL();
  });



  window.addEventListener('hashchange', () => {
    Object.assign(state, parseHash());

    // 👉 если пришли в рецепт через back/forward — тоже чистим поиск
    if (state.page === "recipe") {
      clearSearchUI();
    }

    if (state.page === "home") {
    state.search = "";
    clearSearchUI();
  }

    render();
  });

}

/* ---------------------------
   INIT
----------------------------*/

function init() { //инициализация
  initEvents();

  Object.assign(state, parseHash());
  render();
}

init(); //функция, которая запускает всё приложение
