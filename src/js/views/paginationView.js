import icons from 'url:../../img/icons.svg';
import View from './View.js';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;

      const goToPage = +btn.dataset.gotopage;

      handler(goToPage);
    });
  }

  _generateMarkup() {
    const curPage = this._data.page;
    const pageNums = Math.ceil(
      this._data.result.length / this._data.resultsPerPage
    );

    if (curPage === 1 && pageNums > 1) {
      return this._generateMarkupButton('next', curPage);
    }

    if (curPage === pageNums && pageNums > 1) {
      return this._generateMarkupButton('prev', curPage);
    }

    if (curPage < pageNums) {
      return `${this._generateMarkupButton(
        'prev',
        curPage
      )}${this._generateMarkupButton('next', curPage)}`;
    }

    return '';
  }

  _generateMarkupButton(className, curPage) {
    return `
      <button data-gotopage="${
        className === 'next' ? curPage + 1 : curPage - 1
      }" class="btn--inline pagination__btn--${className}">

      ${
        className === 'next'
          ? `
        <span>Page ${
          className === 'next' ? curPage + 1 : curPage - 1
        }-${Math.round(
              this._data.result.length / this._data.resultsPerPage
            )}</span>
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
          </svg> `
          : `
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-left"></use>
          </svg>
          <span>Page ${
            className === 'next' ? curPage + 1 : curPage - 1
          }-${Math.round(
              this._data.result.length / this._data.resultsPerPage
            )}</span>`
      }

      </button>
    `;
  }
}

export default new PaginationView();
