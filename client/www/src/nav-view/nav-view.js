import { html, PolymerElement } from '../../node_modules/@polymer/polymer/polymer-element.js';
import '../../node_modules/@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import '../../node_modules/@polymer/paper-icon-button/paper-icon-button.js';
import '../../node_modules/@polymer/paper-spinner/paper-spinner-lite.js';
import '../../node_modules/@polymer/paper-button/paper-button.js';
import '../../node_modules/@polymer/iron-icons/iron-icons.js';
import '../form-selector/form-selector.js';
import '../nav-card/nav-card.js';
import {
    getRootUri,
    setData,
    getData,
    getId
} from '../lesslms-frontend-app/lesslms-common.js';
/**
 * `nav-view`
 * View to display lesslms contents
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */

const _addTypeMap = {
    default: [],
    root: [{ type: 'course', max: -1 }],
    course: [{ type: 'content', max: 1 }, { type: 'definition', max: 1 }],
    definition: [],
    content: [{ type: 'topic', max: -1 }, { type: 'evaluation', max: 1 }],
    topic: [{ type: 'chapter', max: -1 }, { type: 'evaluation', max: 1 }],
    chapter: [{ type: 'chapter', max: -1 }, { type: 'evaluation', max: 1 }],
    evaluation: [{ type: 'definition', max: 1 }, { type: 'question', max: -1 }],
    question: [{ type: 'solution', max: 1 }],
    solution: []
}

class NavView extends PolymerElement {
    ready() {
        super.ready();
        document.addEventListener('add', (e) => { this._onAdd(e) });
        document.addEventListener('edit', (e) => { this._onEdit(e) });

        this.observers = [
            '_onPathChange(path.*)'
        ];
    }
    static get template() {
        return html `
      <style is="custom-style" include="iron-flex iron-flex-alignment"></style>  
      <style>
        :host {
          display: block;
          --header-buttons-display: block;
        }

        paper-icon-button {
          color: var(--paper-blue-700);         
        }

        .wrapper {
          margin: 25px auto;
          padding: 15px;
          width: 90%;
          height: 90vh;
          background-color: white;
          border-radius: 5px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
        }

        .wrapper header{
          height: 64px;          
          border: 1px transparent;          
          border-radius: 5px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
        }

        div.container{
          width: calc(100% - 200px);
        }

        div.top{
          text-align: center;
        }

        div.top h3 {
          margin: 0;
          padding: 0;
        }

        div.bot{
          text-align: center;
        }

        paper-button {
          background-color: var(--paper-blue-700);
          color: white;
        }

        section {
          margin: 10px 0 0 0;
          height: calc(100% - 74px);          
          border: 1px transparent;          
          border-radius: 5px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
        }

        form-selector {
          width: 70%;
          height: 100%;
        }

        div.card{
          width: 30%;
          height: calc(100% - 14px);     
          padding: 7px;    
          overflow: scroll; 
        }

        nav-card {
          width: 250px;
          margin: 7px;
        }

        .header-buttons {
          display: var(--header-buttons-display);
        }

      </style>
      <div class="wrapper">
        <header class="layout horizontal center-center">
          <paper-icon-button icon="arrow-back" class="header-buttons" on-click="_onBack"></paper-icon-button>
          <div class="container">
            <div class="top">
            <h3>[[type]]</h3>
            </div>
            <div class="bot">
            [[_path]]
            </div>            
          </div>
          <paper-button class="header-buttons" on-click="_onSave">SAVE</paper-button>
        </header>
        <section class="layout horizontal center-center">
          <form-selector id="form_id" type="[[type]]"></form-selector>
          <div class="card layout horizontal wrap">
            <paper-spinner-lite id="spinner_id"></paper-spinner-lite>
            <h3>Number of elements: [[_cardCount]]</3>
            <dom-repeat items="[[_cardData]]" filter="_dataFilter">
            <template>
              <nav-card 
                type="[[item.type]]",
                abstract="[[item.abstract]]", 
                id="[[item.id]]"></nav-card>
            </template>
            </dom-repeat>
            <dom-repeat items="[[_addData]]">
            <template>
              <nav-card 
                type="[[item.type]]" 
                add></nav-card>            
            </template>
            </dom-repeat>

          </div>
        </section>
      </div>
      <iron-ajax id="ajax_id"
      method=""  
      url=""      
      contentType="application/json"
      handle-as="json"
      on-response="_handleResponse"
      debounce-duration="300">
      </iron-ajax>
    `;
    }
    static get properties() {
        return {
            type: {
                type: String,
                value: 'default',
                observer: '_onTypeChange'
            },
            path: {
                type: Array,
                value: []
            },
            _path: {
                type: String,
                value: '/'
            },
            _cardData: {
                type: Array,
                value: []
            },
            _addData: {
                type: Array,
                value: []
            },
            _currentData: {
                type: Object,
                value: {}
            },
            _cardCount: {
                type: Number,
                value: 0,
                observer: '_onCountChange'
            },
            _location: {
                type: Object,
                value: { current: '', previous: '', }
            }
        };
    }

    initialLoad() {
        let _credentials = getData('credentials');
        this._updateLocation(_credentials.email);
        this._updatePath('push', _credentials.email);
        this._fetchData({ id: _credentials.email });
    }

    _onTypeChange(val) {
        if (val == 'root') {
            this.updateStyles({ '--header-buttons-display': 'none' })
        } else {
            this.updateStyles({ '--header-buttons-display': 'block' })
        }
    }

    _onPathChange(val) {
        console.log('_onPathChange(val)', val);
    }

    _updatePath(action, path) {
        switch (action) {
            case 'push':
                this.path.push(path);
                break;

            case 'pop':
                this.path.pop();
                break;
        }

        let _p = '';
        for (let p of this.path) {
            _p += ('/' + p);
        }
        this._path = _p;
        console.log('_updatePath(action, path)', action, path, this.path);
    }

    _updateLocation(current) {
        this._location.previous = this._location.current;
        this._location.current = current;
        console.log('_updateLocation(current)', current, this._location);
    }

    _fetchData(params) {
        let _credentials = getData('credentials');
        this.$.ajax_id.url = getRootUri() + 'lms/fetch';
        this.$.ajax_id.method = 'GET';
        this.$.ajax_id.body = {};
        this.$.ajax_id.headers['accessToken'] = _credentials.accessToken;
        this.$.ajax_id.params = params;

        //OSLL: Clean up card display.
        this._cardCount = 0;
        this._cardData = [];
        this._addData = [];
        this.$.ajax_id.generateRequest();
    }

    _saveData(data) {
        console.log('_saveData(data)', data);
        let _credentials = getData('credentials');
        this.$.ajax_id.headers['accessToken'] = _credentials.accessToken;
        this.$.ajax_id.url = getRootUri() + 'lms/update';
        this.$.ajax_id.method = 'POST';
        this.$.ajax_id.body = JSON.stringify(data);
        this.$.ajax_id.params = {};
        this.$.ajax_id.generateRequest();
    }

    _onCountChange(val) {
        if (val > 0) this.$.spinner_id.active = false;
        else this.$.spinner_id.active = true;
    }

    _onAdd(e) {
        let _credentials = getData('credentials');
        this.$.ajax_id.headers['accessToken'] = _credentials.accessToken;
        switch (e.detail.type) {
            case 'course':
                this.$.ajax_id.url = getRootUri() + 'lms/add';
                this.$.ajax_id.method = 'POST';
                this.$.ajax_id.body = JSON.stringify({
                    user: _credentials.email,
                    name: e.detail.name,
                    profile: _credentials.profile,
                    id: getId(e.detail.type)
                });
                this.$.ajax_id.generateRequest();
                break;

            default:
                //OSLL: Aquí la resta d'elements.
                console.log('NavView::_onAdd(event)', e);
                break;
        }
    }

    _onEdit(e) {
        this._fetchData({ id: e.detail.id });
    }

    _onSave(e) {
        this._saveData(this.$.form_id.getFormData());
    }

    _onBack(e) {
        this._fetchData({ id: this._location.previous });
        this._updatePath('pop');
    }

    _dataFilter(item) {
        //OSLL: Use this filter function on <dom-repeat> just to count number of received items.
        console.log('_dataFilter(item)', item);
        this._cardCount++;
        return true;
    }

    _handleResponse(e) {
        console.log('_handleResponse(response)', e.detail.response);
        switch (e.detail.response.path) {
            case '/lms/fetch':
                this._currentData = e.detail.response;
                this._cardData = this._getCardData(this._currentData.response.Items, this._currentData.response.resolved);
                break;

            case '/lms/update':
                alert('Data saved successfully!');
                break;

            case '/lms/add':
                //OSLL: Reload view to get the last added course on list.
                this._onTypeChange('root');
                break;

            default:
                break;
        }
    }

    _getCardData(items, resolved) {
        let _r = [];
        let _template = {
            type: '',
            abstract: ''
        }
        switch (resolved) {
            case 'users':
                this._updateLocation(items[0].userId);
                for (let i of items) {
                    let _card = Object.assign({}, _template);
                    let _attributes = JSON.parse(i.attributes);
                    this.type = 'root';
                    this._addData = Array.from(_addTypeMap[this.type]);
                    _card.type = 'course';
                    _card.abstract = _attributes.name;
                    _card.id = i.sourceId;
                    _r.push(_card);
                }
                break;

            case 'courses':
                for (let i of items) {
                    if (i.sourceId == i.relatedId) {
                        //OSLL: Form data corresponds to this item that shoul not be shown on content list.
                        //      By updating this.type, form and new options will automatically update on view.

                        //OSLL: Pass data to form before switch the view.
                        this.$.form_id.setFormData(i);
                        this.type = this._getLocalType(i.type);
                        this._addData = Array.from(_addTypeMap[this.type]);

                        //OSLL: Update navigation references  
                        this._updatePath('push', this.type);
                        this._updateLocation(i.sourceId);
                    } else {
                        let _card = Object.assign({}, _template);
                        _card.type = _getLocalType(i.type);
                        _card.abstract = i.abstract;
                        _card.id = i.sourceId;
                        _r.push(_card);
                    }
                }
                break;

            default:
                break;
        }
        return _r;
    }

    _getLocalType(dbType) {
        let _r = dbType.toLowerCase().substring(1, dbType.length);
        console.log('_getLocalType(dbType)', dbType, _r);
        return _r;
    }

} //class

window.customElements.define('nav-view', NavView);