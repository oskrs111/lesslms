import { html, PolymerElement } from '../../node_modules/@polymer/polymer/polymer-element.js';
import '../login-view/login-view.js';
import '../nav-view/nav-view.js';

/**
 * @customElement
 * @polymer
 */
class LesslmsFrontendApp extends PolymerElement {
    static get template() {
        return html `
      <style>
        :host {
          display: block;
          width: 100%;
          height: 100%;
        }
      </style>
      <nav-view></nav-view>
      <!--
      <login-view></login-view>
      -->
    `;
    }
    static get properties() {
        return {
            prop1: {
                type: String,
                value: 'lesslms-frontend-app'
            }
        };
    }
}

window.customElements.define('lesslms-frontend-app', LesslmsFrontendApp);