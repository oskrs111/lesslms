import { html, PolymerElement } from '../../node_modules/@polymer/polymer/polymer-element.js';
import '../../node_modules/@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import '../../node_modules/@polymer/paper-icon-button/paper-icon-button.js';
import '../../node_modules/@polymer/paper-button/paper-button.js';
import '../../node_modules/@polymer/iron-icons/iron-icons.js';
import '../form-selector/form-selector.js';
import '../nav-card/nav-card.js';

/**
 * `nav-view`
 * View to display lesslms contents
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class NavView extends PolymerElement {
    static get template() {
        return html `
      <style is="custom-style" include="iron-flex iron-flex-alignment"></style>  
      <style>
        :host {
          display: block;
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

      </style>
      <div class="wrapper">
        <header class="layout horizontal center-center">
          <paper-icon-button icon="arrow-back"></paper-icon-button>
          <div class="container">
            <div class="top">
            <h3>[[type]]</h3>
            </div>
            <div class="bot">
            [[path]]
            </div>            
          </div>
          <paper-button>SAVE</paper-button>
        </header>
        <section class="layout horizontal center-center">
          <form-selector type="[[type]]" data="[[_formData]]"></form-selector>
          <div class="card layout horizontal wrap">
            <nav-card type="Solution"></nav-card>
            <nav-card id="course-card_id" type="Course" add></nav-card>
            <nav-card id="content-card_id" type="Content" add></nav-card>
            <nav-card id="definition-card_id" type="Definition" add></nav-card>
            <nav-card id="subject-card_id" type="Subject" add></nav-card>
            <nav-card id="chapter-card_id" type="Chapter" add></nav-card>
            <nav-card id="evaluation-card_id" type="Evaluation" add></nav-card>
            <nav-card id="question-card_id" type="Question" add></nav-card>
            <nav-card id="solution-card_id" type="Solution" add></nav-card>          
          </div>
        </section>
      </div>
    `;
    }
    static get properties() {
        return {
            type: {
                type: String,
                value: 'solution',
            },
            path: {
                type: String,
                value: '/one/two/tree/four',
            },
            _formData: {
                type: Object,
                value: {},
            }
        };
    }
}

window.customElements.define('nav-view', NavView);