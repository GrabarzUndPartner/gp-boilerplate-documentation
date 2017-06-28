"use strict";

import Controller from 'gp-module-base/Controller';
import DomModel from 'gp-module-base/DomModel';

export default Controller.extend({

    modelConstructor: DomModel.extend({
        session: {
            toggleSelector: {
                type: 'string',
                required: true,
                default: function() {
                    return '> div > [data-hook="accordeonToggle"]';
                }
            },
            opened: {
                type: 'boolean',
                required: true,
                default: function() {
                    return false;
                }
            }
        }
    }),

    bindings: {
        'model.opened': {
            type: 'booleanClass',
            name: 'js-opened'
        }
    },

    initialize: function() {
        Controller.prototype.initialize.apply(this, arguments);
        $(this.model.toggleSelector, this.el).on('click', onClickToggle.bind(this));
    },

});

function onClickToggle() {
    this.model.opened = !this.model.opened;
}
