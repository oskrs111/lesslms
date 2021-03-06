import { html, PolymerElement } from '../../node_modules/@polymer/polymer/polymer-element.js';
import { getData, getData_L } from '../lesslms-frontend-app/lesslms-common.js';
import '../../node_modules/@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import '../../node_modules/@polymer/paper-icon-button/paper-icon-button.js';
import '../../node_modules/@polymer/paper-progress/paper-progress.js'
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
          --card-heigth: 350px;
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

        .card-content, .detail-content {
          width: calc(90% - 32px);                    
          margin: 0 auto;          
        }
        .card-content {
          max-height: var(--card-heigth);
          border-top: 1px solid var(--paper-blue-500);
        }

        p {
          font-size: 16px;
          margin: 1px;          
        }

        .card-content p {
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }

        .card-toolbar {
          width: 90%;
          margin: 0 auto;
          border-top: 1px solid var(--paper-blue-500);
          @apply --layout-end-justified;
        }

        paper-progress {
            width: 100%;
            --paper-progress-active-color: var(--paper-blue-700);
        }
        
      </style>
      <paper-progress disabled="[[!_loading]]" indeterminate></paper-progress>
      <paper-card heading="[[title]]" image="[[_image]]">
      <template is="dom-if" if="[[!add]]">              
      <div class="detail-content">      
        <p>[[detail]]</p>                    
        </div>        
        <div class="card-content">      
        <p>[[abstract]]</p>        
        </div>
      </template>
      <div class="layout horizontal card-toolbar">                        
        <paper-icon-button id="add_id" icon="add-circle"  on-click="_onAdd"></paper-icon-button>
        <paper-icon-button id="reload_id" icon="refresh"  on-click="_onReload"></paper-icon-button>
        <paper-icon-button id="edit_id" icon="create"     on-click="_onEdit"></paper-icon-button>        
        <paper-icon-button id="delete_id" icon="delete"   on-click="_onDelete"></paper-icon-button>                
      </div>
    </paper-card>
    <paper-dialog id="dialog_id" verticalAlign="middle" modal>    
      <h2>COURSE NAME?</h2>
      <paper-input id="courseName_id" always-float-label label="Course short name:"></paper-input>
      <footer>
      <paper-button on-click="_onDialogClickAdd">ADD</paper-button>
      <paper-button on-click="_onDialogClickCancel">CANCEL</paper-button>
      </footer>
    </paper-dialog>
    <iron-ajax id="ajax_id"
    method=""  
    url=""      
    contentType="application/json"
    handle-as="json"
    on-response="_handleResponse"
    on-error="_handleError"
    debounce-duration="300">
    </iron-ajax>
    `;
    }
    static get properties() {
        return {
            title: {
                type: String,
                value: 'Title'
            },
            type: {
                type: String,
                value: 'nav-card',
                observer: '_onTypeChange'
            },
            detail: {
                type: String,
                value: '',
            },
            abstract: {
                type: String,
                value: '',
            },
            id: {
                type: String,
                value: '',
                observer: '_onIdChange'
            },
            add: {
                type: Boolean,
                value: false,
                observer: '_onAddChange'
            },
            _loading: {
                type: Boolean,
                value: false
            }
        };
    }


    _getData(id) {
        //console.log('_getData(id)', id, typeof id);
        if (id.length == 0) return;

        this.abstract = 'Loading...';
        let _credentials = getData('credentials');
        this.$.ajax_id.url = getData_L('uri') + 'lms/get';
        this.$.ajax_id.method = 'GET';
        this.$.ajax_id.body = {};
        this.$.ajax_id.headers['accessToken'] = _credentials.accessToken;
        this.$.ajax_id.params = { id: id, region: _credentials.region };


        //OSLL: Clean up card display.
        this._cardCount = 0;
        this._cardData = [];
        this._addData = [];
        this.$.ajax_id.generateRequest();
        this._loading = true;
    }

    _handleResponse(e) {
        //console.log('_handleResponse(response)', e.detail.response);
        this._loading = false;
        switch (e.detail.response.path) {
            case '/lms/get':
                this._cardData = this._updateContent(e.detail.response.response.Item);
                break;

            default:
                break;
        }
    }

    _handleError(e) {
        console.log('_handleError(e)', e);
    }

    _updateContent(item) {
        //console.log('_updateContent(item)', item);
        let _content = JSON.parse(item.content.S);
        switch (item.type.S) {
            case 'tCOURSE':
                this.title = _content.title;
                this.detail = _content.subject;
                this.abstract = _content.abstract;
                break;

            case 'tCONTENT':
                this.title = item.type.S.substring(1, item.type.S.length);
                if (_content.index != undefined) {
                    this.abstract = _content.index.children.length + ' items.'
                } else this.abstract = 'No Index avaliable.';
                break;

            case 'tTOPIC':
                this.title = item.type.S.substring(1, item.type.S.length);
                this.detail = _content.title;
                if (_content.index != undefined) {
                    this.abstract = _content.index.children.length + ' items.'
                } else this.abstract = 'No Index avaliable.';
                break;

            case 'tCHAPTER':
                this.title = item.type.S.substring(1, item.type.S.length);
                this.detail = _content.title;
                this.abstract = _content.content;
                break;

            case 'tEVALUATION':
                this.title = item.type.S.substring(1, item.type.S.length);
                if (_content.index != undefined) {
                    this.abstract = _content.index.children.length + ' items.'
                } else this.abstract = 'No Index avaliable.';
                break;

            case 'tQUESTION':
                this.title = item.type.S.substring(1, item.type.S.length);
                this.detail = `QUESTION: ${_content.number}, VALUE: ${_content.value}`;
                this.abstract = _content.statement;
                break;

            case 'tSOLUTION':
                this.title = item.type.S.substring(1, item.type.S.length);
                this.title = item.type.S.substring(1, item.type.S.length);
                this.abstract = _content.detail;
                break;

            default:
                break;
        }
    }

    _onTypeChange(val) {

    }

    _onIdChange(val) {
        if (val.indexOf('@') < 0) this._getData(val);
        else console.log('_onIdChange(val) >>> Skip item retrieval', val);
    }

    _onAddChange(val) {
        if (val == true) {
            this.title = `Add new: ${this.type.toUpperCase()}`;
            this.$.edit_id.style.display = 'none';
            this.$.delete_id.style.display = 'none';
            this.$.reload_id.style.display = 'none';
            this.updateStyles({ '--background-color': 'var(--paper-blue-300)' })
            this.updateStyles({ '--card-heigth': '50px' });
        } else {
            this.$.add_id.style.display = 'none'
        }
    }

    _onAdd() {
        if (this.type == 'Course') {
            this.$.dialog_id.open();
        } else {
            this.dispatchEvent(new CustomEvent('add', { detail: { type: this.type }, bubbles: true, composed: true }));
        }
    }

    _onEdit() {
        this.dispatchEvent(new CustomEvent('edit', { detail: { id: this.id }, bubbles: true, composed: true }));
    }

    _onReload() {
        this._getData(this.id);
    }

    _onDelete() {
        this.dispatchEvent(new CustomEvent('delete', { detail: { id: this.id }, bubbles: true, composed: true }));
    }

    _onDialogClickAdd(e) {
        if (this.$.courseName_id.value.length > 5) {
            this.dispatchEvent(new CustomEvent('add', { detail: { type: this.type, name: this.$.courseName_id.value }, bubbles: true, composed: true }));
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