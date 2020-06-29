import { InputBound } from './input-bound.js';

if (!window.customElements.get('input-bound')) {
  customElements.define('input-bound', InputBound);
}
