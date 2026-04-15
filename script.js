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
   DATA
----------------------------*/

const recipesData = {
  classic: {
    title: "Классические кофе",
    img: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80",
    recipes: ["Эспрессо", "Латте", "Капучино", "Американо"]
  },
  world: {
    title: "Кофе мира",
    img: "https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=800&q=80",
    recipes: ["Турецкий кофе", "Флэт уайт", "Ристретто"]
  },
  cold: {
    title: "Холодные кофе",
    img: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80",
    recipes: ["Айс латте", "Фраппе", "Кофе со льдом"]
  },
  author: {
    title: "Авторские рецепты",
    img: "https://images.unsplash.com/photo-1498804103079-a6351b050096?auto=format&fit=crop&w=800&q=80",
    recipes: ["Ванильный раф", "Карамельный кофе"]
  },
  useful: {
    title: "Полезные кофе",
    img: "https://images.unsplash.com/photo-1512568400610-62da28bc8a13?auto=format&fit=crop&w=800&q=80",
    recipes: ["Без сахара", "Протеиновый кофе"]
  }
};


const recipeDetails = {
  "Эспрессо": {
    title: "Эспрессо",
    desc: "Классический концентрированный кофейный напиток (30 мл)",

    history: "Эспрессо появился в Италии в начале XX века. Его название означает «выжатый под давлением». Он стал основой большинства кофейных напитков.",

    ingredients: [
      "7–9 г свежемолотого кофе",
      "30 мл воды",
      "Кофемашина"
    ],

    steps: [
      "Разогрей кофемашину",
      "Засыпь и утрамбуй кофе",
      "Запусти пролив воды",
      "Готовь 25–30 секунд"
    ],

    tips: [
      "Используй свежемолотый кофе",
      "Следи за временем экстракции",
      "Не перегревай воду"
    ]
  },

  "Латте": {
    title: "Латте",
    desc: "Мягкий кофейный напиток с большим количеством молока",

    history: "Латте пришёл из Италии, но стал популярным в США. Название означает «молоко», так как основной объём напитка — это именно оно.",

    ingredients: [
      "1 порция эспрессо",
      "150–200 мл молока",
      "Молочная пенка"
    ],

    steps: [
      "Приготовь эспрессо",
      "Подогрей молоко до ~60°C",
      "Взбей лёгкую пенку",
      "Влей молоко в кофе"
    ],

    tips: [
      "Не перегревай молоко",
      "Используй цельное молоко для лучшей текстуры",
      "Латте хорошо подходит для латте-арта"
    ]
  },

  "Капучино": {
    title: "Капучино",
    desc: "Кофе с равным соотношением эспрессо, молока и пены",

    history: "Капучино назван в честь монахов-капуцинов из-за цвета напитка. Стал популярным в Европе как утренний кофе.",

    ingredients: [
      "1 порция эспрессо",
      "100 мл молока",
      "Густая молочная пенка"
    ],

    steps: [
      "Сделай эспрессо",
      "Подогрей молоко",
      "Взбей плотную пену",
      "Смешай в пропорции 1:1:1"
    ],

    tips: [
      "Пена должна быть плотной и мелкой",
      "Не делай слишком горячий напиток",
      "Лучше пить сразу после приготовления"
    ]
  },

  "Американо": {
    title: "Американо",
    desc: "Эспрессо, разбавленный горячей водой",

    history: "Американо появился во время Второй мировой войны, когда американские солдаты разбавляли эспрессо водой, чтобы сделать его похожим на фильтр-кофе.",

    ingredients: [
      "1 порция эспрессо",
      "100–150 мл горячей воды"
    ],

    steps: [
      "Приготовь эспрессо",
      "Налей горячую воду в чашку",
      "Добавь эспрессо в воду"
    ],

    tips: [
      "Сначала вода, потом кофе — так сохраняется вкус",
      "Можно регулировать крепость количеством воды",
      "Используй чистую фильтрованную воду"
    ]
  }
};

const allRecipes = Object.entries(recipesData).flatMap(([key, cat]) =>
  cat.recipes.map(recipe => ({
    name: recipe,
    category: cat.title,
    key
  }))
);

/* ---------------------------
   ROUTER HELPERS
----------------------------*/

function getHashFromState(s) {
  if (s.page === "home") {
    return s.search ? `#home?q=${encodeURIComponent(s.search)}` : "#home";
  }
  if (s.page === "category") return `#cat-${s.category}`;

  if (s.page === "recipe") {
    return `#rec-${encodeURIComponent(s.recipe)}`; // 👈 ВАЖНО
  }

  return "#home";
}
function parseHash() {
  const hash = location.hash || "#home";

  const [path, query] = hash.split("?");

  let search = "";
  if (query) {
    const params = new URLSearchParams(query);
    search = params.get("q") || "";
  }

  if (path === "#home") {
    return { page: "home", category: null, recipe: null, search };
  }

  if (path.startsWith("#cat-")) {
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
    recipe: decodeURIComponent(path.replace("#rec-", "")), // 👈 ВАЖНО
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
  const dropdown = document.getElementById("searchDropdown");

  if (input) input.value = "";

  if (dropdown) {
    dropdown.innerHTML = "";
    dropdown.classList.remove("active");
  }
}

/* ---------------------------
   NAVIGATE
----------------------------*/

function navigate(next) {
  Object.assign(state, next);

  // 👉 очищаем поиск при переходе в рецепт
  if (state.page === "recipe") {
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

function renderHome() {
  container.innerHTML = `
    <div class="top-bar">
      <h2>Категории</h2>

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

function renderSearchResults() {
  if (!state.search.trim()) return "";

  const filtered = allRecipes.filter(r =>
    r.name.toLowerCase().includes(state.search.toLowerCase())
  );

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
  if (!data) return navigate({ page: "home" });

  container.innerHTML = `
    <h1 class="page-title">${data.title}</h1>

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

function debounce(fn, delay = 250) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), delay);
  };
}

const updateURL = debounce(() => {
  location.hash = getHashFromState(state);
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

    render();
  });
}

/* ---------------------------
   INIT
----------------------------*/

function init() {
  initEvents();

  Object.assign(state, parseHash());
  render();
}

init();
