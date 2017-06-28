"use strict";

import Controller from 'gp-module-base/Controller';
import DomModel from 'gp-module-base/DomModel';

export default Controller.extend({
    modelConstructor: DomModel.extend({
        session: {
            autoInitialize: {
                type: 'boolean',
                required: true
            }
        }
    }),
    initialize: function() {
        Controller.prototype.initialize.apply(this, arguments);
        if (this.model.autoInitialize || global.location.href.match(/[&?]?debug=true/)) {
            require.ensure([], function(require) {
                // Chunk Load Debug
                new(require('../modules/panel/Debug').default)({
                    target: null,
                    parentEl: this.el
                });
            }.bind(this), 'gp-boilerplate-documentation/panel/debug');
        }
    }
});
