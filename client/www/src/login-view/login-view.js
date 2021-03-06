import { html, PolymerElement } from '../../node_modules/@polymer/polymer/polymer-element.js';
import { getData_L, setData } from '../lesslms-frontend-app/lesslms-common.js';
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
        <paper-loginscreen title="lesslms" subtitle="Login" username="{{username}}" password="{{password}}" uri={{uri}}></paper-loginscreen>        
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
                value: ''
            },
            password: {
                type: String,
                value: ''
            },
            uri: {
                type: String,
                value: ''
            },
            _uri: {
                type: String,
                value: ''
            }
        };
    }

    _onLogin() {
        this.$.ajax_id.params = { user: this.username, pass: this.password };
        try {
            this._uri = this.uri + 'user/login';
            this.$.ajax_id.generateRequest();
        } catch (e) {
            this._handleError(e);
        }
    }

    _handleResponse(e) {
        setData('credentials', e.detail.response);
        //OSLL: Give some time to SessionStorage to process the credentials storage.
        setTimeout(() => {
            this.dispatchEvent(new CustomEvent('login-success', { bubbles: true, composed: true }));
        }, 100);
    }

    _handleError(e) {
        console.log('_handleError(e)', e);
        window.alert(JSON.stringify(e));
    }

}

window.customElements.define('login-view', LoginView);