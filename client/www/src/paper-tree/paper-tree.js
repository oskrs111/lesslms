/**
`<paper-tree>` display a browsable tree of nodes (`<paper-tree-node>`) with expandable/collapsible capabilities and actions menu for each node.

Example:

    <paper-tree></paper-tree>

@demo
*/
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
import { Polymer, html } from '../../node_modules/@polymer/polymer/polymer-legacy.js';
import './paper-tree-node.js';

Polymer({
    _template: html `
        <div>
            <paper-tree-node id="root" data="[[data]]" actions="[[actions]]"></paper-tree-node>
        </div>
`,

    is: 'paper-tree',

    properties: {

        /**
         * Data hold by the root node (contains the children).
         *
         * Specific data:
         *
         * - `data.name`: string representing the node name.
         * - `data.icon`: string telling which icon to use (default to 'folder' icon).
         * - `data.open`: boolean telling whether the node is expanded or not.
         * - `data.children` array containing the children of the node.
         */
        data: {
            type: Object,
            value: function() {
                return null;
            },
            observer: "_dataChanged"
        },

        /**
         * `selected` is the current selected `<paper-tree-node>` in the tree.
         */
        selected: {
            type: Object,
            value: null,
            notify: true
        },

        /**
         * `actions` available for all nodes. Each action object has the following fields:
         *
         * - `action.label`: string representing the display name of the menu item.
         * - `action.event`: string which is the event name to dispatch whenever the item is clicked.
         *
         */
        actions: {
            type: Array,
            value: function() {
                return null;
            },
            observer: "_actionsChanged"
        }
    },

    listeners: {
        "select": "_selectNode"
    },

    /**
     * Called whenever the data is changed to notify the lower nodes.
     */
    _dataChanged: function() {
        this.$.root.data = this.data;
    },

    /**
     * Called whenever the actions list is changed to notify the lower nodes.
     */
    _actionsChanged: function() {
        this.$.root.actions = this.actions;
    },

    /**
     * Called when the `select` event is fired from an internal node.
     *
     * @param {object} e An event object.
     */
    _selectNode: function(e) {
        if (this.selected) {
            this.toggleClass("selected", false, this.selected);
        }

        // Only selects `<paper-tree-node>`.
        if (e.detail && e.detail.tagName === 'PAPER-TREE-NODE') {
            this.selected = e.detail;
            this.toggleClass("selected", true, this.selected);
        } else {
            this.selected = null;
        }
    }
});