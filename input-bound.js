export class InputBound extends HTMLElement {
    static get observedAttributes() { return ['min', 'max', 'lower', 'upper']; }

    constructor() {
      super();

      this._shadowRoot = this.attachShadow({ mode: 'open' });

      this._template = this._createTemplate();
      this.addEventListener('click', (event) => {
          const target = event.offsetX/event.target.clientWidth;
          const targetValue = this.step * (Math.round((this.min + (this.max - this.min) * target)/this.step));
          if(targetValue < this.lower) {
            this.setAttribute("lower", targetValue);
            this.render();
          } else if(targetValue > this.upper) {
            this.setAttribute("upper", targetValue);
            this.render();
          }
          event.stopPropagation();
          this.dispatchEvent(new Event('change', {lower: this.lower, upper: this.upper}));
          this.dispatchEvent(new Event('input'));
        });

      this.render();
    }

    _style() {
      return `
        :host {
          display: inline-block;
          position: relative;
        }
        input[type='range'] {
          pointer-events: none;
          -webkit-appearance: none;
          background: transparent;
          overflow: hidden;
          outline: none;
          border-radius: 10px;
          width: 100%;
        }
        input.lower {
          position: absolute;
          left:0;
          top:0;
        }

        input[type='range']::-webkit-slider-runnable-track {
          -webkit-appearance: none;
        }
        input[type='range']::-webkit-slider-thumb {
          pointer-events: all;
          background: #fff;
          border-radius: 50%;
          cursor: pointer;
          border: 1px solid #666;
        }
        input.upper::-webkit-slider-runnable-track {
          background: #0074fe;
        }
        input.upper::-webkit-slider-thumb {
          /* Right */
          box-shadow: 610px 0 0 600px #ddd;
        }
        input.lower::-webkit-slider-thumb {
          /* Middle, left */
          box-shadow: -610px 0 0 600px #ddd;
        }

        input[type='range']::-moz-range-thumb {
          pointer-events: all;
          background: #fff;
          cursor: pointer;
          border: 1px solid #c7c7c7;
        }
        input::-moz-range-track {
          background: transparent;
        }
        input::-moz-range-progress {
          background: #c7c7c7;
        }
        input.upper::-moz-range-track {
          background: #c7c7c7;
          height: 3px;
        }
        input.upper::-moz-range-progress {
          background: #0074fe;
        }
        input[type=range]::-moz-focus-outer {
          border: 0;
        }`;
    }

    _parseAttributes() {
      this.min = parseFloat(this.getAttribute('min') || 0);
      this.max = parseFloat(this.getAttribute('max') || 100);
      this.step = parseFloat(this.getAttribute('step') || 1);
      this.lower = parseFloat(this.getAttribute('lower') || 0);
      this.upper = parseFloat(this.getAttribute('upper') || 100);
      this.lower = Math.max(this.min, this.lower);
      this.upper = Math.min(this.max, this.upper);
    }

    _createTemplate() {
      this._parseAttributes();

      const template = document.createElement('template');
      template.innerHTML = `<style>${this._style()}</style>`;
      const lowerBound = document.createElement('input');
      lowerBound.setAttribute('type', 'range');
      lowerBound.setAttribute('min', this.min);
      lowerBound.setAttribute('max', this.max);
      lowerBound.setAttribute('step', this.step);
      lowerBound.setAttribute('value', this.lower);
      lowerBound.dataset.bound = 'lower';
      lowerBound.classList.add('lower');

      const upperBound = document.createElement('input');
      upperBound.setAttribute('type', 'range');
      upperBound.setAttribute('min', this.min);
      upperBound.setAttribute('max', this.max);
      upperBound.setAttribute('step', this.step);
      upperBound.setAttribute('value', this.upper);
      upperBound.dataset.bound = 'upper';
      upperBound.classList.add('upper');

      template.content.append(upperBound);
      template.content.append(lowerBound);
      return template;
    }

    render() {
      this._shadowRoot.innerHTML = '';
      this._shadowRoot.append(this._template.content.cloneNode(true));
      this._shadowRoot.querySelectorAll('input').forEach((input) => {
        input.addEventListener('change', (event) => {
          if (event.target.dataset.bound === 'lower') {
            this.setAttribute("lower", this.lower);
          }
          if (event.target.dataset.bound === 'upper') {
            this.setAttribute("upper", this.upper);
          }
          this.dispatchEvent(new Event('change', {lower: this.lower, upper: this.upper}));
        });
        input.addEventListener('input', (event) => {
          const value = parseFloat(event.target.value);
          if (event.target.dataset.bound === 'lower') {
            if (value + this.step >= this.upper) {
              event.target.value = this.upper - this.step;
              this.lower = this.upper - this.step;
            } else {
              this.lower = value;
            }
          } else if (event.target.dataset.bound === 'upper') {
            if (value - this.step <= this.lower) {
              event.target.value = this.lower + this.step;
              this.upper = this.lower + this.step;
            } else {
              this.upper = value;
            }
          }
        });
      });
    }

    attributeChangedCallback(/* name, oldValue, newValue */) {
      this._template = this._createTemplate();
      this.render();
    }
}