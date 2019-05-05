import { html, PolymerElement } from '../../node_modules/@polymer/polymer/polymer-element.js';
import { getData_L, setData, getData } from '../lesslms-frontend-app/lesslms-common.js';
import '../../node_modules/@polymer/paper-spinner/paper-spinner-lite.js';
import '../../node_modules/@polymer/iron-ajax/iron-ajax.js';
import '../paper-loginscreen-ext/paper-loginscreen-ext.js';

/**
 * `login-view`
 * Simple view to perform Login process
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class LoginView extends PolymerElement {
    ready() {
        super.ready();
        document.addEventListener('login-btn-click', () => { this._onLogin() });
    }
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

        paper-loginscreen {
          --login-btn-raised-background-color: var(--paper-blue-700);
          --login-btn-background-color: var(--paper-blue-700);
          --paper-input-container-underline-focus: {
            border-color: var(--paper-blue-500);              
          }
        }

      </style>
      <div class="flex-wrap">        
        <paper-loginscreen title="lesslms" subtitle="Login" username="{{username}}" password="{{password}}"></paper-loginscreen>        
      </div>      
      <iron-ajax id="ajax_id"
      method="GET"  
      url="[[_uri]]"      
      handle-as="json"
      on-response="_handleResponse"
      debounce-duration="300">
      </iron-ajax>
    `;
    }
    static get properties() {
        return {
            username: {
                type: String,
                value: '@gmail.com'
            },
            password: {
                type: String,
                value: '123456'
            },
            _uri: {
                type: String,
                value: function() { return getData_L('uri') + 'user/login' },
            },
        };
    }

    _onLogin() {
        this.$.ajax_id.params = { user: this.username, pass: this.password };
        this.$.ajax_id.generateRequest();
    }

    _handleResponse(e) {
        setData('credentials', e.detail.response);
        this.dispatchEvent(new CustomEvent('login-success', { bubbles: true, composed: true }));
    }

}

window.customElements.define('login-view', LoginView);