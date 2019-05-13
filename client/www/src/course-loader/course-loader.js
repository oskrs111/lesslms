import { html, PolymerElement } from '../../node_modules/@polymer/polymer/polymer-element.js';
import { getData, getData_L } from '../lesslms-frontend-app/lesslms-common.js';
import { LesslmsMixin } from '../lesslms-mixin/lesslms-mixin.js'
/**
 * `course-loader`
 * 
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */

class CourseLoader extends LesslmsMixin(PolymerElement) {
        ready() {
            super.ready();
            document.addEventListener('get', (e) => { this._onGet(e) });
            document.addEventListener('fetch', (e) => { this._onFetch(e) });
            this._fetchQuewe = [];
            this._tree = this.clearReferences();
        }

        static get template() {
            return html `
      <style>
        :host {
          display: block;         
        }
      </style>   
      
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
                progress: {
                    type: Number,
                    value: 0,
                }
            };
        }

        load(target) {
            this.uri = getData_L('uri');
        }

        getTreeCopy() {
            return JSON.parse(JSON.stringify(this._tree));
        }

        _fetchData(params, reload) {
            console.log('_fetchData(params, reload)', params, reload);
            if (reload == true) {
                this._tree = this.clearReferences();
            }

            let _credentials = getData('credentials');
            params.region = _credentials.region;
            this.$.ajax_id.url = getData_L('uri') + 'lms/fetch';
            this.$.ajax_id.method = 'GET';
            this.$.ajax_id.body = {};
            this.$.ajax_id.headers['accessToken'] = _credentials.accessToken;
            this.$.ajax_id.params = params;
            this.$.ajax_id.generateRequest();
        }

        _handleResponse(e) {
            console.log('_handleResponse(response)', e.detail.response);
            let _credentials = getData('credentials');
            switch (e.detail.response.path) {
                case '/lms/fetch':
                    //OSLL: New accounts have not any initial content... 
                    if (e.detail.response.response.Count == 0) {
                        this._tree.id = _credentials.email;
                        this._tree.name = _credentials.email;
                        this._tree.type = 'root';
                        this.push2Map(_credentials.email, _credentials.email);
                        this.push2Pointers(_credentials.email, this._tree); //OSLL: Store the root pointer reference.                            
                        this.dispatchEvent(new CustomEvent('load-end', { bubbles: true, composed: true }));
                        this.dispatchEvent(new CustomEvent('select', { detail: { id: _credentials.email }, bubbles: true, composed: true }));
                        return;
                    }
                    switch (e.detail.response.response.resolved) {
                        case 'users':
                            for (let i of e.detail.response.response.Items) {
                                this._fetchQuewe.push(i.sourceId.S);
                                i.index = this._loadIndex++;
                                let _new = this.buildNewNode();
                                _new.name = JSON.parse(i.attributes.S).name;
                                _new.id = i.sourceId.S;
                                _new.icon = this.getIcon('tCOURSE');
                                this._tree.id = i.userId.S; //OSLL: Will be allways the same id.
                                this._tree.name = i.userId.S;
                                this._tree.type = 'root';
                                this.push2Map(i.sourceId.S, _credentials.email);
                                this.push2Pointers(_credentials.email, this._tree); //OSLL: Store the root pointer reference.                            
                                //console.log('_fetchQuewe.push(i.sourceId)', i.sourceId.S);
                            }
                            break;

                        case 'courses':
                            let _new = this.buildNewNode();
                            for (let t of e.detail.response.response.Items) {
                                this._fetchQueweShift(t.sourceId.S);
                                //OSLL: Store the parent id for current element.                            
                                if (t.sourceId.S == t.relatedId.S) {
                                    //OSLL: Here not expecting to get more than one item.                                
                                    //      These nodes contain information.                                                                                                 
                                    this._nodePrepare(_new, t);
                                    this.push2Pointers(_new.id, _new); //OSLL: Store the pointer reference.

                                } else {
                                    //OSLL: Act only as an index reference.
                                    //      Here store the parent of current element.                                    
                                    this.push2Map(t.relatedId.S, t.sourceId.S);
                                    this._fetchQuewe.push(t.relatedId.S);
                                    //console.log('_fetchQuewe.push(t.relatedId)', t.relatedId.S);
                                }
                                this.progress++;
                            }

                            let _parent = this.getParentIdByChildId(_new.id);
                            let _leaf = this.getNodeById(_parent);
                            console.log('_leaf.children.push(_new)', _new);
                            _leaf.children.push(_new);
                            break;
                    }
                    break;

                default:
                    break;
            }

            let _next = this._fetchQueweNext();
            if (_next != null) {
                this._fetchData({ id: _next }, false);
                this.dispatchEvent(new CustomEvent('load-updated', { bubbles: true, composed: true }));
            } else {
                this.dispatchEvent(new CustomEvent('load-end', { bubbles: true, composed: true }));
                //this.dispatchEvent(new CustomEvent('collapse', { bubbles: true, composed: true }));
                this.progress = 0;
            }
        }

        _fetchQueweNext() {
            if (this._fetchQuewe.length > 0) {
                for (let e of this._fetchQuewe) {
                    return e;
                }
            }
            return null;
        }

        _fetchQueweShift(id) {
            if (id == this._fetchQueweNext()) {
                this._fetchQuewe.shift();
                //console.log('_fetchQueweShift(id)', id);
            }
        }

        _nodePrepare(node, source) {
            node.id = source.sourceId.S;
            node.icon = this.getIcon(source.type.S);
            node.type = source.type.S;
            let _content = {};
            switch (node.type) {
                case 'tCOURSE':
                    _content = JSON.parse(source.content.S);
                    node.title = _content.subject;
                    node.name = _content.title;
                    break;

                case 'tCONTENT':
                    node.name = this.getLocalType(node.type);
                    node.title = 'Index';
                    break;

                case 'tTOPIC':
                    _content = JSON.parse(source.content.S);
                    node.name = _content.title;
                    node.title = 'Index';
                    break;

                case 'tCHAPTER':
                    _content = JSON.parse(source.content.S);
                    node.name = _content.title;
                    break;

                case 'tEVALUATION':
                    node.name = this.getLocalType(node.type);
                    node.open = false;
                    break;

                case 'tQUESTION':
                    node.name = this.getLocalType(node.type);
                    node.open = false;
                    break;

                case 'tSOLUTION':
                    node.name = this.getLocalType(node.type);
                    break;

                default:
                    break;
            }

        }
    } //class

window.customElements.define('course-loader', CourseLoader);