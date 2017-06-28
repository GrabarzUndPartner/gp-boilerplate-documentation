"use strict";

import Controller from 'gp-module-base/Controller';
import DomModel from 'gp-module-base/DomModel';

export default Controller.extend({
    modelConstructor: DomModel.extend({
        session: {
            checked: {
                type: 'boolean',
                required: true
            }
        }
    }),
    bindings: {
        'model.checked': {
            type: 'booleanClass',
            name: 'js-checked'
        }
    },
    events: {
        'change input': onChange
    },

        initialize: function() {
            Controller.prototype.initialize.apply(this, arguments);
        console.log('test');
        }
});

function onChange(e) {
    this.model.checked = e.target.checked;
}
