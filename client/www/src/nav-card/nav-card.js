import { html, PolymerElement } from '../../node_modules/@polymer/polymer/polymer-element.js';
import '../../node_modules/@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import '../../node_modules/@polymer/paper-icon-button/paper-icon-button.js';
import '../../node_modules/@polymer/paper-dialog/paper-dialog.js';
import '../../node_modules/@polymer/paper-button/paper-button.js';
import '../../node_modules/@polymer/paper-input/paper-input.js';
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

        paper-button {
          background-color: var(--paper-blue-700);
          color: white;
        }

        .card-content {
          width: calc(90% - 32px);
          height: var(--card-heigth);
          overflow: hidden;
          margin: 0 auto;
          border-top: 1px solid var(--paper-blue-500);
        }

        .card-content p {
          font-size: 10px;
        }

        .card-toolbar {
          width: 90%;
          margin: 0 auto;
          border-top: 1px solid var(--paper-blue-500);
        }
        
      </style>
      <paper-card heading="[[type]]" image="[[_image]]" alt="[[type]]">
      <div class="card-content">
      <h3>
        [[abstract]]
      </h3>  
      <p>
        id: [[id]]
      </p>  
      </div>
      <div class="layout horizontal start card-toolbar">        
        <paper-icon-button id="add_id" icon="add-circle"  on-click="_onAdd"></paper-icon-button>
        <paper-icon-button id="edit_id" icon="create"     on-click="_onEdit"></paper-icon-button>
        <paper-icon-button id="delete_id" icon="backup"   on-click="_onPublish"></paper-icon-button>
        <paper-icon-button id="publish_id" icon="delete"  on-click="_onDelete"></paper-icon-button>        
      </div>
    </paper-card>
    <paper-dialog id="dialog_id" verticalAlign="middle" modal>    
    <h2>NEW COURSE</h2>
    <paper-input id="courseName_id" always-float-label label="Course short name:"></paper-input>
    <footer>
    <paper-button id="add_id" on-click="_onDialogClickAdd">ADD</paper-button>
    <paper-button id="cancel_id" on-click="_onDialogClickCancel">CANCEL</paper-button>
    </footer>
    </paper-dialog>
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
            id: {
                type: String,
                value: '',
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
        if (val == 'course') {
            this.$.publish_id.style.display = 'block'
        } else {
            this.$.publish_id.style.display = 'none'
        }
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

    _onAdd() {
        if (this.type == 'course') {
            this.$.dialog_id.open();
        } else {
            this.dispatchEvent(new CustomEvent(`add`, { detail: { type: this.type }, bubbles: true, composed: true }));
        }
    }

    _onEdit() {
        this.dispatchEvent(new CustomEvent(`edit`, { detail: { id: this.id }, bubbles: true, composed: true }));
    }

    _onDialogClickAdd(e) {
        if (this.$.courseName_id.value.length > 5) {
            this.dispatchEvent(new CustomEvent(`add`, { detail: { type: this.type, name: this.$.courseName_id.value }, bubbles: true, composed: true }));
            this.$.courseName_id.style.border = 'none';
            this.$.dialog_id.close();
        } else {
            this.$.courseName_id.style.border = '1px solid red';
        }

    }

    _onDialogClickCancel(e) {
        this.$.dialog_id.close();
    }


} //class

window.customElements.define('nav-card', NavCard);