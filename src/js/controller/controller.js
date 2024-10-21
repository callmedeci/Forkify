import * as model from '../model/model.js';
import { CLOSE_MODEL_TIMEOUT_SEC } from '../config/config.js';
import recipeView from '../views/recipeView.js';
import searchView from '../views/searchView.js';
import resultsView from '../views/resultsView.js';
import paginationView from '../views/paginationView.js';
import bookmarksView from '../views/bookmarksView.js';
import addRecipeView from '../views/addRecipeView.js';

import 'core-js/actual';
import 'regenerator-runtime';

const controlRecipes = async function () {
  try {
    //Get the hash id from the users search bar
    const id = window.location.hash.slice(1);
    if (!id) return;

    // Render loading spinner
    recipeView.renderSpinner();

    //Update selected recipe
    resultsView.update(model.getSearchResultsPage());

    //Update bookmarks
    bookmarksView.update(model.state.bookmarks);

    //load Recipe
    await model.loadRecipe(id);

    //render recipe Markup
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderErrorMessage();
  }
};

const controlSearch = async function () {
  try {
    //render loading spinner
    resultsView.renderSpinner();

    //Get the search Result
    const query = searchView.getQuery();
    if (!query) return;

    //Render Search results
    await model.loadSearchResults(query);

    //Render results per page
    resultsView.render(model.getSearchResultsPage());

    // Render Pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    resultsView.renderErrorMessage();
  }
};

const controlPagination = function (goToPage) {
  //Render results for the current page
  resultsView.render(model.getSearchResultsPage(goToPage));

  //Render pagination buttons
  paginationView.render(model.state.search);
};

const controlServings = async function (newServings) {
  //Update servings
  model.updateServings(newServings);

  //Update recipe view
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  // Add or Remove bookmarks
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.removeBookmark(model.state.recipe.id);

  //Update Bookmarks
  recipeView.update(model.state.recipe);

  //Render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // Render loading spinner
    addRecipeView.renderSpinner();

    //Upload the new recipe
    await model.uploadRecipe(newRecipe);

    //Render the new recipe
    recipeView.render(model.state.recipe);

    //Render Success Message
    addRecipeView.renderSuccessMessage();

    //Render bookmarks
    bookmarksView.render(model.state.bookmarks);

    //change the url after submiting the recipe
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    //Close the window modal after CLOSE_MODEL_TIMEOUT_SEC seconds
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, CLOSE_MODEL_TIMEOUT_SEC * 1000);
  } catch (err) {
    addRecipeView.renderErrorMessage(err.message);
  }
};

const init = function () {
  bookmarksView.addHandlerBookmarks(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdate(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearch);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addhandlerUpload(controlAddRecipe);
};

init();
