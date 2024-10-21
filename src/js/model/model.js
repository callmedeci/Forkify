import {
  API_RECIPE_URL,
  API_CALORIE_URL,
  API_RECIPE_KEY,
  API_CALORIE_KEY,
  RES_PER_PAGE,
} from '../config/config.js';
import { AJAX } from '../helper/helper.js';

export const state = {
  recipe: {},
  search: {
    query: '',
    result: [],
    page: 1,
    resultsPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
};

const unitConversionsToCalories = {
  tsp: 5.7, // 1 teaspoon = 5 grams
  tbsp: 15, // 1 tablespoon = 15 grams
  cup: 250, // 1 cup = 200 grams (approximate)
  oz: 28.35, // 1 ounce = 28.35 grams
  lb: 453.59, // 1 pound = 453.59 grams
  ml: 1, // 1 milliliter = 1 gram (approximate)
  l: 1000, // 1 liter = 1000 grams
};

const createRecipeObject = function (data) {
  const { recipe } = data.data;
  return {
    title: recipe.title,
    id: recipe.id,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    ingredients: recipe.ingredients,
    cookingTime: recipe.cooking_time,
    ...(recipe.key && { key: recipe.key }),
  };
};

function convertToGrams(unitObject) {
  const { quantity, unit } = unitObject;
  const conversionFactor = unitConversionsToCalories[unit];
  if (!conversionFactor) return null;
  return quantity * conversionFactor;
}

const calculateCalories = async function (ingredients) {
  try {
    const nutritionData = await Promise.all(
      ingredients.map(async function (ing) {
        const { quantity, unit, description } = ing;
        const quantityToGrams = convertToGrams({ quantity, unit });

        const nutritionInfo = await AJAX(
          `${API_CALORIE_URL}${quantityToGrams} grams ${description}`,
          undefined,
          { 'X-Api-Key': API_CALORIE_KEY }
        );

        if (!nutritionInfo)
          throw new Error('Something bad happned :(, try Again !');

        if (nutritionInfo.items.length === 0)
          return {
            ...ing,
          };

        return {
          ...ing,
          calories: nutritionInfo.items[0].calories,
        };
      })
    );

    return nutritionData;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_RECIPE_URL}${id}?key=${API_RECIPE_KEY}`);

    state.recipe = createRecipeObject(data);

    state.recipe.ingredients = await calculateCalories(
      state.recipe.ingredients
    );

    if (state.bookmarks.some(bookmark => bookmark.id === id)) {
      state.recipe.bookmarked = true;
    }
  } catch (err) {
    console.error(err);
    throw `${err.message} 📛`;
  }
};

export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;
    state.search.page = 1;
    const { data } = await AJAX(
      `${API_RECIPE_URL}?search=${query}&key=${API_RECIPE_KEY}`
    );

    state.search.result = data.recipes.map(rec => {
      return {
        title: rec.title,
        id: rec.id,
        publisher: rec.publisher,
        image: rec.image_url,
        ...(rec.key && { key: rec.key }),
      };
    });
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;

  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;

  return state.search.result.slice(start, end);
};

export const updateServings = function (servings) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * servings) / state.recipe.servings;
  });

  state.recipe.servings = servings;
};

const presistBookmarks = function () {
  localStorage.setItem('Bookmarks', JSON.stringify(state.bookmarks));
};

export const addBookmark = function (recipe) {
  state.bookmarks.push(recipe);
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  presistBookmarks();
};

export const removeBookmark = function (id) {
  const index = state.bookmarks.findIndex(bookmark => bookmark.id === id);
  state.bookmarks.splice(index, 1);

  if (id === state.recipe.id) state.recipe.bookmarked = false;

  presistBookmarks();
};

const bookmarksInitialization = function () {
  const data = localStorage.getItem('Bookmarks');
  if (data) state.bookmarks = JSON.parse(data);
};

bookmarksInitialization();

export const uploadRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        const ingredient = ing[1].split(',').map(ing => ing.trim());
        const [quantity, unit, description] = ingredient;

        return { quantity: quantity ? +quantity : null, unit, description };
      });

    const recipe = {
      image_url: newRecipe.image,
      source_url: newRecipe.sourceUrl,
      cooking_time: newRecipe.cookingTime,
      title: newRecipe.title,
      publisher: newRecipe.publisher,
      servings: newRecipe.servings,
      ingredients,
    };

    const data = await AJAX(`${API_RECIPE_URL}?key=${API_RECIPE_KEY}`, recipe);

    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);
  } catch (err) {
    console.error(err);
    throw err;
  }
};
