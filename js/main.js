/* eslint no-use-before-define: ["error", { "functions": false }] */
/* eslint no-global-assign: "warn" */
/* eslint-env browser */

window.customElements.define('x-carousel', class Carousel extends HTMLElement {

  constructor() {
    super();
    this._shadowRoot = this.attachShadow({ mode: 'closed' });
    this._shadowRoot.innerHTML = `
    <style>
      :host{
        display: flex;
        flex-direction: row;
        justify-content: center;
      }
      .slide-box {
        flex: 1;
      }
      ::slotted(img) {
        width: 100%;
        box-sizing: border-box;
      }
    </style>
    
      <button class="btn  btn--prev"><</button>
      <div class="slide-box">
        <slot id="slide"></slot>
      </div>
      <button class="btn  btn--next">></button>
    `;
  }

  connectedCallback() {
    const prev = this._shadowRoot.querySelector('.btn--prev');
    const next = this._shadowRoot.querySelector('.btn--next');
    this._slides = [...this.querySelectorAll('img')];
    this._currentIdx = 0;

    prev.addEventListener('click', () => {
      this.prev();
    });
    next.addEventListener('click', () => {
      this.next();
    });

    [...this.querySelectorAll('img')].forEach(el => el.hidden = true);
    this._slides[this._currentIdx].hidden = false;

    this.play();
  }

  next() {
    this._slides[this._currentIdx].hidden = true;

    if (this._currentIdx < this._slides.length - 1) {
      this._currentIdx++;
    } else {
      this._currentIdx = 0;
    }

    this._slides[this._currentIdx].hidden = false;

    this._slideChangeEvent();
  }

  prev() {
    this._slides[this._currentIdx].hidden = true;

    if (this._currentIdx > 0) {
      this._currentIdx--;
    } else {
      this._currentIdx = this._slides.length - 1;
    }

    this._slides[this._currentIdx].hidden = false;

    this._slideChangeEvent();
  }

  play() {
    const delay = this.getAttribute('timeout') || 1;
    this._timer = setInterval(() => {
      this.next();
    }, delay * 1000);
    this.dispatchEvent(new CustomEvent('started', { bubbles: true, composed: true }));
  }

  pause() {
    clearInterval(this._timer);
    this.dispatchEvent(new CustomEvent('stopped', { bubbles: true, composed: true }));
  }

  _slideChangeEvent() {
    this.dispatchEvent(new CustomEvent('slidechange', {
      detail: { currentSlide: this._currentIdx },
      bubbles: true,
      composed: true,
    }));
  }
});
