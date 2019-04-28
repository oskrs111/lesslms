import { html, PolymerElement } from '../../node_modules/@polymer/polymer/polymer-element.js';
import '../../node_modules/@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import '../../node_modules/@polymer/paper-radio-button/paper-radio-button.js';
import '../../node_modules/@polymer/paper-radio-group/paper-radio-group.js';
import '../../node_modules/@polymer/paper-input/paper-textarea.js';
import '../../node_modules/@polymer/paper-input/paper-input.js';

import {
    setData,
    getData
} from '../lesslms-frontend-app/lesslms-common.js';

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
    course: {
        _arg1: 'subject',
        _arg2: 'abstract'
    },
    definition: {
        _arg1: 'author',
        _arg2: 'version',
        _arg3: 'title',
        _arg4: 'date'
    },
    content: {
        _arg1: 'index'
    },
    topic: {
        _arg1: 'title',
        _arg2: 'index'
    },
    chapter: {
        _arg1: 'title',
        _arg2: 'content'
    },
    evaluation: {
        _arg1: 'abstract'
    },
    question: {
        _arg1: 'type',
        _arg2: 'value',
        _arg3: 'number',
        _arg4: 'statement',
    },
    solution: {
        _arg1: 'detail'
    }
}

class FormSelector extends PolymerElement {
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
          @apply: --layout-horizontal;
          margin-top: 15px;
        }

        .wrapper {          
          height: calc(100% - 14px);     
          padding: 15px;    
          overflow: scroll; 
        }

      </style>
      <div id="wrapper_id" class="wrapper">
      <h2>Properties: [[type]]</2>

      <section id="solution_form_id">                              
        <div class="form-row">
        <paper-textarea label="Solution body:" value="{{_arg1}}" rows="10" char-counter="true" maxlength="500" placeholder="Write solution body here..."></paper-textarea>        
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
        <paper-textarea label="Question value:" value="{{_arg2}}" type="number" min="0" max="100" placeholder="Set question value here..."></paper-textarea>        
        </div>                
        <div class="form-row">
        <paper-textarea label="Question number:" value="{{_arg3}}" type="number" min="1" max="100" placeholder="Set question number here..."></paper-textarea>        
        </div>                        
        <div class="form-row">
        <paper-textarea label="Question statement:" value="{{_arg4}}" rows="10" char-counter="true" maxlength="500" placeholder="Write question statement here..."></paper-textarea>        
        </div>                        
      </section> 
                          
      <section id="evaluation_form_id">                
        <div class="form-row">
        <paper-textarea label="Course abstract:" value="{{_arg1}}" rows="10" char-counter="true" maxlength="5000" placeholder="Write evaluation abstract here..."></paper-textarea>        
        </div>                
      </section> 

      <section id="chapter_form_id">        
        <div class="form-row">
        <paper-input always-float-label label="Chapter title:" value="{{_arg1}}"></paper-input>
        </div>
        <div class="form-row">
        <paper-textarea label="Course abstract:" value="{{_arg2}}" rows="15" char-counter="true" maxlength="5000" placeholder="Write chapter content..."></paper-textarea>        
        </div>                
      </section>  

      <section id="topic_form_id">        
        <div class="form-row">
        <paper-input always-float-label label="Topic title:" value="{{_arg1}}"></paper-input>
        <h2>INDEX</h2>
        </div>                
      </section>  
    
      <section id="content_form_id">        
        <div class="form-row">
        <h2>INDEX</h2>
        </div>                
      </section>  

      <section id="definition_form_id">        
        <div class="form-row">
        <paper-input always-float-label label="Author Name:" value="{{_arg1}}"></paper-input>
        </div>
        <div class="form-row">
        <paper-input always-float-label label="Title:" value="{{_arg2}}"></paper-input>
        </div>                
        <div class="form-row">
        <paper-input always-float-label label="Version:" value="{{_arg3}}"></paper-input>
        </div>        
        <div class="form-row">
        <paper-input always-float-label label="Date:" value="{{_arg4}}"></paper-input>
        </div>                
      </section>      
           
      <section id="course_form_id">        
        <div class="form-row">
        <paper-input always-float-label label="Subject Name:" value="{{_arg1}}"></paper-input>
        </div>
        <div class="form-row">
        <paper-textarea label="Course abstract:" value="{{_arg2}}" rows="10" char-counter="true" maxlength="250" placeholder="Write course abstract here..."></paper-textarea>
        </div>
      </section>                

      <section id="root_form_id">        
        <div class="form-row">
        <paper-input always-float-label label="User:" value="{{_arg1}}" readonly></paper-input>
        </div>
        <div class="form-row">
        <paper-input always-float-label label="Profile:" value="{{_arg2}}" readonly></paper-input>
        </div>        
      </section>       
      </div>
    `;
    }
    static get properties() {
        return {
            type: {
                type: String,
                value: 'default',
                observer: '_onTypeChange'
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
            _formData: {
                type: Object,
                value: {}
            }
        };

    }

    setFormData(data) {
        console.log('setFormData(data)', data);
        this._formData = data;
    }

    getFormData() {
        let _content = {};
        switch (this.type) {
            case 'root':
                break;

            case 'course':
                //OSLL: Use '_formTypeMap' to get form fields data,
                _content[_formTypeMap[this.type]['_arg1']] = this._arg1;
                _content[_formTypeMap[this.type]['_arg2']] = this._arg2;
                //OSLL: Create a copy of form data
                let _data = Object.assign({}, this._formData);
                _data.content = _content;
                _data.id = this._formData.sourceId;
                _data.rid = this._formData.relatedId;
                //OSLL: These properties are no longer need.
                delete _data.sourceId;
                delete _data.relatedId;
                delete _data.cDate;
                delete _data.mDate;
                return _data;
                break;

            case 'definition':
                this.$.definition_form_id.style.display = "block";
                break;

            case 'content':
                this.$.content_form_id.style.display = "block";
                break;

            case 'topic':
                this.$.topic_form_id.style.display = "block";
                break;

            case 'chapter':
                this.$.chapter_form_id.style.display = "block";
                break;

            case 'evaluation':
                this.$.evaluation_form_id.style.display = "block";
                break;

            case 'question':
                this.$.question_form_id.style.display = "block";
                break;

            case 'solution':
                this.$.solution_form_id.style.display = "block";
                break;

            default:
                break;
        }

        return {};
    }

    clearFormData() {
        this._arg1 = '';
        this._arg2 = '';
        this._arg3 = '';
        this._arg4 = '';
        this._arg5 = '';
    }


    _onTypeChange(val) {
        let _forms = this.$.wrapper_id.getElementsByTagName('section');
        for (let f of _forms) {
            f.style.display = 'none';
        }

        switch (val) {
            case 'root':
                let _credentials = getData('credentials');
                //OSLL: Use '_formTypeMap' to set form fields
                this._arg1 = _credentials[_formTypeMap[val]['_arg1']];
                this._arg2 = _credentials[_formTypeMap[val]['_arg2']];
                this.$.root_form_id.style.display = 'block';
                break;

            case 'course':
                let _content = JSON.parse(this._formData.content);
                this._arg1 = _content[_formTypeMap[val]['_arg1']];
                this._arg2 = _content[_formTypeMap[val]['_arg2']];
                this.$.course_form_id.style.display = 'block';
                break;

            case 'definition':
                this.$.definition_form_id.style.display = "block";
                break;

            case 'content':
                this.$.content_form_id.style.display = "block";
                break;

            case 'topic':
                this.$.topic_form_id.style.display = "block";
                break;

            case 'chapter':
                this.$.chapter_form_id.style.display = "block";
                break;

            case 'evaluation':
                this.$.evaluation_form_id.style.display = "block";
                break;

            case 'question':
                this.$.question_form_id.style.display = "block";
                break;

            case 'solution':
                this.$.solution_form_id.style.display = "block";
                break;

            default:
                break;
        }
    }

} //class
window.customElements.define('form-selector', FormSelector);