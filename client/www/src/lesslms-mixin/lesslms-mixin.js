import { ElementMixin } from '../../node_modules/@polymer/polymer/lib/mixins/element-mixin.js';
/**
 * `lesslms-mixin`
 * 
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */

let node_g = {
    name: 'root',
    icon: 'icons:perm-identity',
    id: '',
    open: true,
    type: '',
    children: []
}

//OSLL: These containers shoud be singletones.
let _nodeMap = [];
let _nodePointers = [];

//https://polymer-library.polymer-project.org/3.0/docs/devguide/custom-elements#mixins
export const LesslmsMixin = (superClass) => {
        return class extends superClass {
            constructor() {
                super();
                this._tree = this.buildNewNode();
            }

            static get properties() {
                return {
                    prop1: {
                        type: String,
                        value: 'lesslms-mixin',
                    },
                };
            }

            clearReferences() {
                _nodeMap = [];
                _nodePointers = [];
                this._tree = this.buildNewNode();
                return this._tree;
            }

            push2Map(index, value) {
                _nodeMap[index] = value;
            }

            push2Pointers(index, value) {
                _nodePointers[index] = value;
            }

            getParentIdByChildId(parent) {
                return _nodeMap[parent];
            }

            getNodeById(nodeId) {
                return _nodePointers[nodeId];
            }

            getNodeCopyById(nodeId) {
                return JSON.parse(JSON.stringify(_nodePointers[nodeId]));
            }

            getTree(create) {
                if (create == true) this._tree = this.buildNewNode();
                return this._tree;
            }

            getNode(nodeId) {
                return this._nodePool[nodeId];
            }

            buildNewNode() {
                return JSON.parse(JSON.stringify(node_g)); //OSLL: Get a Deep Copy of object template.
            }

            updateNode(node, icon) {
                node.icon = icon;
                for (let n of node.children) {
                    this.updateNode(n, icon);
                }
                return node;
            }

            removeNodes(node, type) {
                for (let n in node.children) {
                    if (node.children[n].type == type) {
                        node.children.splice(n, 1);
                    } else {
                        this.removeNodes(node.children[n], type);
                    }
                }
                return node;
            }

            addNode(nodeId, node) {
                this._nodePool[nodeId].push(node);
            }

            getIcon(type) {
                switch (type) {
                    case 'tCOURSE':
                        return 'icons:book';
                        break;

                    case 'tTOPIC':
                        return 'icons:bookmark';
                        break;

                    case 'tCHAPTER':
                        return 'icons:bookmark-border';
                        break;

                    case 'tEVALUATION':
                        return 'icons:assessment';
                        break;

                    case 'tQUESTION':
                        return 'icons:assignment';
                        break;

                    case 'tSOLUTION':
                        return 'icons:assignment-turned-in';
                        break;

                    default:
                        return 'icons:description';
                        break;
                }
            }

            getLocalType(dbType) {
                let _r = dbType.toLowerCase().substring(1, dbType.length);
                return _r.charAt(0).toUpperCase() + _r.slice(1);
            }

            getStoreType(stType) {
                let _r = 't' + stType.toUpperCase();
                return _r;
            }

            getItemContent(item) {
                let _r = {
                    title: '',
                    detail: '',
                    abstract: ''
                }
                let _content = JSON.parse(item.content.S);
                switch (item.type.S) {
                    case 'tCOURSE':
                        _r.detail = `SUBJECT: ${_content.subject}`;
                        _r.abstract = _content.abstract;
                        _r.title = item.type.S.substring(1, item.type.S.length);
                        break;

                    case 'tCONTENT':
                        _r.title = item.type.S.substring(1, item.type.S.length);
                        if (_content.index != undefined) {
                            //OSLL: Show index here...
                        } else _r.abstract = 'No Index avaliable.';
                        break;

                    case 'tTOPIC':
                        _r.title = item.type.S.substring(1, item.type.S.length);
                        _r.detail = `TITLE: ${_content.title}`;
                        if (_content.index != undefined) {
                            //OSLL: Show index here...
                        } else _r.abstract = 'No Index avaliable.';
                        break;

                    case 'tCHAPTER':
                        _r.title = item.type.S.substring(1, item.type.S.length);
                        _r.detail = `TITLE: ${_content.title}`;
                        _r.abstract = _content.content;
                        break;

                    case 'tEVALUATION':
                        _r.title = item.type.S.substring(1, item.type.S.length);
                        //this.detail = `TITLE: ${_content.title}`;
                        _r.abstract = _content.abstract;
                        break;

                    case 'tQUESTION':
                        _r.title = item.type.S.substring(1, item.type.S.length);
                        _r.detail = `QUESTION: ${_content.number}, VALUE: ${_content.value}`;
                        _r.abstract = _content.statement;
                        break;

                    case 'tSOLUTION':
                        _r.title = item.type.S.substring(1, item.type.S.length);
                        _r.title = item.type.S.substring(1, item.type.S.length);
                        _r.abstract = _content.detail;
                        break;

                    default:
                        break;
                }
                return _r;
            }
        }
    } //class