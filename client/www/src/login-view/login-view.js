import { html, PolymerElement } from '../../node_modules/@polymer/polymer/polymer-element.js';
import '../../node_modules/paper-loginscreen/paper-loginscreen.js';

/**
 * `login-view`
 * Simple view to perform Login process
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class LoginView extends PolymerElement {
    static get template() {
        return html `
      <style>
        :host {
          display: block;
        }
        .flex-wrap{          
          padding: 0;
          margin: 0;
          display: flex;          
          align-items: center;
          justify-content: center;
        }

        .flex-wrap * {
          max-width: 50%;
          align-self: flex-start;
        }

      </style>
      <div class="flex-wrap">        
        <paper-loginscreen title="lesslms" subtitle="Login"></paper-loginscreen>
      </div>
    `;
    }
    static get properties() {
        return {
            prop1: {
                type: String,
                value: 'login-view',
            },
        };
    }
}

window.customElements.define('login-view', LoginView);