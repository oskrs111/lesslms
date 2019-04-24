import { html, PolymerElement } from '../../node_modules/@polymer/polymer/polymer-element.js';
import '../../node_modules/@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import '../../node_modules/@polymer/paper-icon-button/paper-icon-button.js';
import '../../node_modules/@polymer/paper-card/paper-card.js';
import '../../node_modules/@polymer/iron-icons/iron-icons.js';
/**
 * `nav-card`
 * Element container for nav-view
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class NavCard extends PolymerElement {
    static get template() {
        return html `
      <style is="custom-style" include="iron-flex iron-flex-alignment"></style>    
      <style>
        :host {
          display: block;
          --background-color: white;
          --card-heigth: 200px;
        }

        paper-card {          
          background-color: var(--background-color);
          width: 100%;
        }

        
        paper-icon-button {
          color: var(--paper-blue-700);         
        }

        .card-content {
          width: calc(90% - 32px);
          height: var(--card-heigth);
          overflow: hidden;
          margin: 0 auto;
          border-top: 1px solid var(--paper-blue-500);
        }


        .card-toolbar {
          width: 90%;
          margin: 0 auto;
          border-top: 1px solid var(--paper-blue-500);
        }
        
      </style>
      <paper-card heading="[[type]]" image="[[_image]]" alt="[[type]]">
      <div class="card-content">
      <p>
        [[abstract]]
      </p>  
      </div>
      <div class="layout horizontal start card-toolbar">        
        <paper-icon-button id="add_id" icon="add-circle"></paper-icon-button>
        <paper-icon-button id="edit_id" icon="create"></paper-icon-button>
        <paper-icon-button id="delete_id" icon="backup"></paper-icon-button>
        <paper-icon-button id="publish_id" icon="delete"></paper-icon-button>        
      </div>
    </paper-card>
    `;
    }
    static get properties() {
        return {
            type: {
                type: String,
                value: 'nav-card',
                observer: '_onTypeChange'
            },
            abstract: {
                type: String,
                value: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc ut dolor non enim laoreet eleifend et ac purus. Nunc pretium magna a lectus elementum, tristique semper turpis elementum. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vehicula lobortis nisi sit amet pulvinar. Etiam venenatis massa vel arcu bibendum convallis.',
            },
            add: {
                type: Boolean,
                value: false,
                observer: '_onAddChange'
            },
        };
    }

    _onTypeChange(val) {
        console.log('_onTypeChange(val)', val);
    }

    _onAddChange(val) {
        if (val == true) {
            this.abstract = `Add new: ${this.type}`;
            this.$.delete_id.style.display = 'none'
            this.$.publish_id.style.display = 'none'
            this.$.edit_id.style.display = 'none'
            this.updateStyles({ '--background-color': 'var(--paper-blue-300)' })
            this.updateStyles({ '--card-heigth': '50px' });
        } else {
            this.$.add_id.style.display = 'none'
        }
    }


} //class

window.customElements.define('nav-card', NavCard);