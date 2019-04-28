import { html, PolymerElement } from '../../node_modules/@polymer/polymer/polymer-element.js';
import '../login-view/login-view.js';
import '../nav-view/nav-view.js';

/**
 * @customElement
 * @polymer
 */
class LesslmsFrontendApp extends PolymerElement {
    ready() {
        super.ready();
        document.addEventListener('login-success', () => { this._onLoginSuccess() });
    }
    static get template() {
        return html `
      <style>
        :host {
          display: block;
          width: 100%;
          height: 100%;
        }

        #nav_id {
          display: none;
        }  
      </style>
      <login-view id="login_id"></login-view>      
      <nav-view id="nav_id"></nav-view>            
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
    _onLoginSuccess() {
        this.$.login_id.style.display = 'none';
        this.$.nav_id.style.display = 'block';
        this.$.nav_id.type = 'root';
        this.$.nav_id.initialLoad();
    }

} //class

window.customElements.define('lesslms-frontend-app', LesslmsFrontendApp);