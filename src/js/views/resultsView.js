import View from './View.js';
import previwView from './previwView.js';

class ResultsView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = 'No recipes found for this query! Try another one ;)';

  _generateMarkup() {
    return this._data.map(result => previwView.render(result, false)).join('');
  }
}

export default new ResultsView();
