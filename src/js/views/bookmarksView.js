import View from './View.js';
import previwView from './previwView.js';

class BookmarksView extends View {
  _parentElement = document.querySelector('.bookmarks__list');
  _errorMessage = 'No bookmarks yet. Find a nice recipe and bookmark it :)';

  addHandlerBookmarks(handler) {
    window.addEventListener('load', function () {
      handler();
    });
  }

  _generateMarkup() {
    return this._data
      .map(bookmark => previwView.render(bookmark, false))
      .join('');
  }
}

export default new BookmarksView();
