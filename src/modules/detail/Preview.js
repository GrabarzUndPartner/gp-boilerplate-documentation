"use strict";

import Controller from 'gp-module-base/Controller';
import DomModel from 'gp-module-base/DomModel';

export default Controller.extend({

    modelConstructor: DomModel.extend({
        session: {
            referenceOptions: {
                type: 'array',
                required: true,
                default: function() {
                    return [];
                }
            },
            references: {
                type: 'object',
                required: true,
                default: function() {
                    return {};
                }
            }
        }
    }),

    initialize: function() {
        Controller.prototype.initialize.apply(this, arguments);
        require.ensure([], function(require) {
            new(require('../panel/Preview').default)({
                target: null,
                parentEl: this.el,
                optionalsAttributes: {
                    attributes: {
                        'reference-options': JSON.stringify(this.model.referenceOptions),
                        'references': JSON.stringify(this.model.references)
                    }
                }
            });
        }.bind(this), 'gp-boilerplate-documentation');
    }
});
