import { html, PolymerElement } from '../../node_modules/@polymer/polymer/polymer-element.js';
import { getData } from '../lesslms-frontend-app/lesslms-common.js';
import { LesslmsMixin } from '../lesslms-mixin/lesslms-mixin.js'
import '../../node_modules/@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import '../../node_modules/@polymer/paper-radio-button/paper-radio-button.js';
import '../../node_modules/@polymer/paper-radio-group/paper-radio-group.js';
import '../../node_modules/@polymer/marked-element/marked-element.js';
import '../../node_modules/@polymer/paper-input/paper-textarea.js';
import '../../node_modules/@polymer/paper-input/paper-input.js';
import '../paper-tree-ext/paper-tree-ext.js';

/**
 * `form-selector`
 * Form scher element
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
const _formTypeMap = {
    root: {
        _arg1: 'email',
        _arg2: 'profile'
    },
    Course: {
        _arg1: 'author',
        _arg2: 'title',
        _arg3: 'subject',
        _arg4: 'abstract',
        _arg5: 'version',
        _arg6: 'date'
    },
    Content: {
        _obj1: 'index'
    },
    Topic: {
        _arg1: 'title',
        _obj1: 'index'
    },
    Chapter: {
        _arg1: 'title',
        _arg2: 'content'
    },
    Evaluation: {
        _arg1: 'abstract'
    },
    Question: {
        _arg1: 'type',
        _arg2: 'value',
        _arg3: 'number',
        _arg4: 'statement',
    },
    Solution: {
        _arg1: 'detail'
    }
}

/*
\"name\":\"Please update index.\",
                    \"icon\": \"icons:error-outline\",
                    \"open\": \"true\",
                    \"children\": []
*/

class FormSelector extends LesslmsMixin(PolymerElement) {
        static get template() {
            return html `
      <style is="custom-style" include="iron-flex iron-flex-alignment"></style>    
      <style>
        :host {
          display: block;          
        }

        section {
          display: none;
        }

        .form-row {
          @apply --layout-horizontal;
          margin-top: 15px;
        }

        .form-row-space {
            @apply --layout-horizontal;
            justify-content: space-between;
            margin-top: 15px;            
          }

        .form-row-space h2 {
            margin: 0;
        }

        .form-row paper-input, paper-textarea {
            flex-grow: 2;
        }

        .wrapper {          
          height: calc(100% - 14px);     
          padding: 7px;    
          padding-left: 35px;
          padding-right: 35px;
          overflow: scroll; 
        }

        .text {
            background-color: #f5f5f5;
            padding: 7px;
        }

        paper-input, paper-textarea {                        
            --paper-input-container-underline-focus: {
                border-color: var(--paper-blue-1000);              
            }
        }

        paper-button {
            background-color: var(--paper-blue-700) !important;
            text-align: center;
            color: white;
          }
        

      </style>
      <div id="wrapper_id" class="wrapper">
      <p>Properties: [[type]]</p>

      <section id="root_form_id">        
        <div class="form-row">
            <paper-input always-float-label label="User:" value="{{_arg1}}" readonly></paper-input>
        </div>
        <div class="form-row">
            <paper-input always-float-label label="Profile:" value="{{_arg2}}" readonly></paper-input>
        </div>        
      </section>  
      
      <section id="course_form_id">        
        <div class="form-row">        
            <paper-input always-float-label label="Author Name:" value="{{_arg1}}"></paper-input>        
            <paper-input always-float-label label="Title:" value="{{_arg2}}"></paper-input>
            <paper-input always-float-label label="Subject Name:" value="{{_arg3}}"></paper-input>            
        </div>
        <div class="form-row-space">
        <paper-radio-group selected="{{_viewMode}}">
            <paper-radio-button name="txt">Text</paper-radio-button>
            <paper-radio-button name="md">Markdown</paper-radio-button>
            </paper-radio-group>
        <paper-button class="header-buttons" on-click="_onPublish" raised>PUBLISH COURSE</paper-button>    
        </div>
        <div class="form-row">
            <template is="dom-if" if="[[_isMarkdown]]">
                <marked-element markdown="[[_arg4]]">
                <div slot="markdown-html"></div>
                </marked-element>
            </template>
            <template is="dom-if" if="[[!_isMarkdown]]">
                <paper-textarea class="text" label="Course abstract:" value="{{_arg4}}" rows="10" char-counter="true" maxlength="1000" placeholder="Write course abstract here..."></paper-textarea>
            </template>
        </div>
        <div class="form-row">
        <paper-input always-float-label label="Version:" value="{{_arg5}}"></paper-input>        
        <paper-input always-float-label label="Date:" value="{{_arg6}}"></paper-input>
        </div>
      </section>     
      
      <section id="content_form_id">        
        <div class="form-row-space">
        <h2>INDEX:</h2>
        <paper-button class="header-buttons" on-click="_onUpdateContentIndex" raised>UPDATE INDEX</paper-button>
        </div>              
        <div class="form-row">
        <paper-tree data="[[_obj1]]">
        </paper-tree>    
        </div>              
      </section>        

      <section id="topic_form_id">        
        <div class="form-row">
            <paper-input always-float-label label="Topic title:" value="{{_arg1}}"></paper-input>        
        </div>                
        <div class="form-row-space">
            <h2>INDEX:</h2>
            <paper-button class="header-buttons" on-click="_onUpdateTopicIndex" raised>UPDATE INDEX</paper-button>
        </div>       
        <div class="form-row">
        <paper-tree data="[[_obj1]]">
        </paper-tree>    
        </div>                       
      </section>      

      <section id="chapter_form_id">        
        <div class="form-row">
            <paper-input always-float-label label="Chapter title:" value="{{_arg1}}"></paper-input>
            <paper-radio-group selected="{{_viewMode}}">
            <paper-radio-button name="txt">Text</paper-radio-button>
            <paper-radio-button name="md">Markdown</paper-radio-button>
            </paper-radio-group>
        </div>        
        <div class="form-row">
            <template is="dom-if" if="[[_isMarkdown]]">
            <marked-element markdown="[[_arg2]]">
            <div slot="markdown-html"></div>
            </marked-element>
            </template>
            <template is="dom-if" if="[[!_isMarkdown]]">
            <paper-textarea class="text" label="Chapter content:" value="{{_arg2}}" rows="15" char-counter="true" maxlength="5000" placeholder="Write chapter content..."></paper-textarea>        
            </template>
        </div>                
      </section>       

      <section id="evaluation_form_id">    
        <div class="form-row">     
            <paper-radio-group selected="{{_viewMode}}">
            <paper-radio-button name="txt">Text</paper-radio-button>
            <paper-radio-button name="md">Markdown</paper-radio-button>
            </paper-radio-group>             
        </div>
        <div class="form-row">
            <template is="dom-if" if="[[_isMarkdown]]">
                <marked-element markdown="[[_arg1]]">
                <div slot="markdown-html"></div>
                </marked-element>
            </template>
            <template is="dom-if" if="[[!_isMarkdown]]">        
                <paper-textarea class="text" label="Course abstract:" value="{{_arg1}}" rows="10" char-counter="true" maxlength="1000" placeholder="Write evaluation abstract here..."></paper-textarea>        
            </template>
        </div>                
      </section>   
      
      <section id="question_form_id">        
        <div class="form-row">
          <paper-radio-group selected="{{_arg1}}">
          <paper-radio-button name="develop">Develop type</paper-radio-button>
          <paper-radio-button name="test">Test type</paper-radio-button>
          </paper-radio-group>
        </div>              
        <div class="form-row">
        <paper-input label="Question value:" value="{{_arg2}}" type="number" min="0" max="100" placeholder="Set question value here..."></paper-textarea>        
        </div>                
        <div class="form-row">
        <paper-input label="Question number:" value="{{_arg3}}" type="number" min="1" max="100" placeholder="Set question number here..."></paper-textarea>        
        </div>      
        <div class="form-row">          	
            <paper-radio-group selected="{{_viewMode}}">
            <paper-radio-button name="txt">Text</paper-radio-button>
            <paper-radio-button name="md">Markdown</paper-radio-button>
        </paper-radio-group>
    </div>                  
        <div class="form-row">
            <template is="dom-if" if="[[_isMarkdown]]">
                <marked-element markdown="[[_arg4]]">
                <div slot="markdown-html"></div>
                </marked-element>
            </template>
            <template is="dom-if" if="[[!_isMarkdown]]">        
                <paper-textarea class="text" label="Question statement:" value="{{_arg4}}" rows="10" char-counter="true" maxlength="1000" placeholder="Write question statement here..."></paper-textarea>        
            </template>
        </div>                        
      </section>       

      <section id="solution_form_id">        
        <div class="form-row">          	
            <paper-radio-group selected="{{_viewMode}}">
            <paper-radio-button name="txt">Text</paper-radio-button>
            <paper-radio-button name="md">Markdown</paper-radio-button>
            </paper-radio-group>                            
        </div>
        <div class="form-row">     
            <template is="dom-if" if="[[_isMarkdown]]">
                <marked-element markdown="[[_arg1]]">
                <div slot="markdown-html"></div>
                </marked-element>
            </template>
            <template is="dom-if" if="[[!_isMarkdown]]">        
                <paper-textarea class="text" label="Solution body:" value="{{_arg1}}" rows="10" char-counter="true" maxlength="1000" placeholder="Write solution body here..."></paper-textarea>        
            </template>
        </div>                        
      </section>       
                          
      <section id="chapter_form_id">        
        <div class="form-row">
            <paper-input always-float-label label="Chapter title:" value="{{_arg1}}"></paper-input>
            <paper-radio-group selected="{{_viewMode}}">
            <paper-radio-button name="txt">Text</paper-radio-button>
            <paper-radio-button name="md">Markdown</paper-radio-button>
            </paper-radio-group>
        </div>        
        <div class="form-row">
            <template is="dom-if" if="[[_isMarkdown]]">
            <marked-element markdown="[[_arg2]]">
            <div slot="markdown-html"></div>
            </marked-element>
            </template>
            <template is="dom-if" if="[[!_isMarkdown]]">
            <paper-textarea class="text" label="Chapter content:" value="{{_arg2}}" rows="15" char-counter="true" maxlength="15000" placeholder="Write chapter content..."></paper-textarea>        
            </template>
        </div>                
      </section>       
      </div>
    `;
        }
        static get properties() {
            return {
                type: {
                    type: String,
                    value: 'default'
                        //observer: '_onTypeChange'
                },
                _arg1: {
                    type: String,
                    value: ''
                },
                _arg2: {
                    type: String,
                    value: ''
                },
                _arg3: {
                    type: String,
                    value: ''
                },
                _arg4: {
                    type: String,
                    value: ''
                },
                _arg5: {
                    type: String,
                    value: ''
                },
                _arg6: {
                    type: String,
                    value: ''
                },
                _obj1: {
                    type: Object,
                    value: {
                        name: "...",
                        icon: "icons:radio-button-unchecked",
                        open: true,
                        children: []
                    }
                },
                _formData: {
                    type: Object,
                    value: {}
                },
                _viewMode: {
                    type: String,
                    value: 'txt',
                    observer: '_onViewModeChange'

                },
                _isMarkdown: {
                    type: Boolean,
                    value: false
                }
            };

        }

        setFormData(data) {
            console.log('setFormData(data)', data);
            this._formData = data;
            this._onTypeChange(this.getLocalType(this._formData.type.S));
        }

        getFormData() {
            let _content = {};
            //OSLL: Use '_formTypeMap' to get form fields data,
            let _map = _formTypeMap[this.type];
            switch (this.type) {
                case 'root':
                    break;

                case 'Course':
                    _content[_map['_arg1']] = this._arg1;
                    _content[_map['_arg2']] = this._arg2;
                    _content[_map['_arg3']] = this._arg3;
                    _content[_map['_arg4']] = this._arg4;
                    _content[_map['_arg5']] = this._arg5;
                    _content[_map['_arg6']] = this._arg6;
                    break;

                case 'Content':
                    _content[_map['_obj1']] = this._obj1;
                    break;

                case 'Topic':
                    _content[_map['_obj1']] = this._obj1;
                    _content[_map['_arg1']] = this._arg1;
                    break;

                case 'Chapter':
                    _content[_map['_arg1']] = this._arg1;
                    _content[_map['_arg2']] = this._arg2;
                    break;

                case 'Evaluation':
                    _content[_map['_arg1']] = this._arg1;
                    break;

                case 'Question':
                    _content[_map['_arg1']] = this._arg1;
                    _content[_map['_arg2']] = this._arg2;
                    _content[_map['_arg3']] = this._arg3;
                    _content[_map['_arg4']] = this._arg4;
                    break;

                case 'Solution':
                    _content[_map['_arg1']] = this._arg1;
                    break;

                default:
                    return {};
                    break;
            }

            //let _data = JSON.parse(JSON.stringify(this._formData));
            let _data = {
                content: _content,
                id: this._formData.sourceId.S,
                rid: this._formData.relatedId.S,
                type: this._formData.type.S
            }

            return _data;
        }

        clearFormData() {
            this._arg1 = '';
            this._arg2 = '';
            this._arg3 = '';
            this._arg4 = '';
            this._arg5 = '';
            this._arg6 = '';
            this._obj1 = {};
        }

        _onViewModeChange(val) {
            if (val == 'md') this._isMarkdown = true;
            else this._isMarkdown = false;
        }

        _onTypeChange(val) {
            this.clearFormData();
            let _forms = this.$.wrapper_id.getElementsByTagName('section');
            for (let f of _forms) {
                f.style.display = 'none';
            }
            let _map = _formTypeMap[val];
            let _content = {};
            if (this._formData.content != undefined) {
                _content = JSON.parse(this._formData.content.S);
            }
            switch (val) {
                case 'root':
                    let _credentials = getData('credentials');
                    //OSLL: Use '_formTypeMap' to set form fields
                    this._arg1 = _credentials[_map['_arg1']];
                    this._arg2 = _credentials[_map['_arg2']];
                    this.$.root_form_id.style.display = 'block';
                    break;

                case 'Course':
                    this._arg1 = _content[_map['_arg1']];
                    this._arg2 = _content[_map['_arg2']];
                    this._arg3 = _content[_map['_arg3']];
                    this._arg4 = _content[_map['_arg4']];
                    this._arg5 = _content[_map['_arg5']];
                    this._arg6 = _content[_map['_arg6']];
                    this.$.course_form_id.style.display = 'block';
                    break;

                case 'Content':
                    this._obj1 = _content[_map['_obj1']];
                    this.$.content_form_id.style.display = "block";
                    break;

                case 'Topic':
                    this._obj1 = _content[_map['_obj1']];
                    this._arg1 = _content[_map['_arg1']];
                    this.$.topic_form_id.style.display = "block";
                    break;

                case 'Chapter':
                    this._arg1 = _content[_map['_arg1']];
                    this._arg2 = _content[_map['_arg2']];
                    this.$.chapter_form_id.style.display = "block";
                    break;

                case 'Evaluation':
                    this._arg1 = _content[_map['_arg1']];
                    this.$.evaluation_form_id.style.display = "block";
                    break;

                case 'Question':
                    this._arg1 = _content[_map['_arg1']];
                    this._arg2 = _content[_map['_arg2']];
                    this._arg3 = _content[_map['_arg3']];
                    this._arg4 = _content[_map['_arg4']];
                    this.$.question_form_id.style.display = "block";
                    break;

                case 'Solution':
                    this._arg1 = _content[_map['_arg1']];
                    this.$.solution_form_id.style.display = "block";
                    break;

                default:
                    break;
            }
        }

        _onUpdateContentIndex() {
            this.dispatchEvent(new CustomEvent('update-index', {
                detail: {
                    id: this._formData.sourceId.S,
                    callback: (indexStr) => {
                        this._obj1 = JSON.parse(indexStr)
                    }
                },
                bubbles: true,
                composed: true
            }));
        }

        _onUpdateTopicIndex() {
            //OSLL: Both forms use the same '_obj1' container.
            this._onUpdateContentIndex();
        }

        _onPublish() {

        }

    } //class
window.customElements.define('form-selector', FormSelector);