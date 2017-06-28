"use strict";

import Optional from 'gp-module-base/controller/Optional';
import AmpersandModel from 'ampersand-model';
import AmpersandCollection from 'ampersand-collection';

export default Optional.extend({

    modelConstructor: Optional.prototype.modelConstructor.extend({
        session: {
            active: {
                type: 'boolean',
                required: true,
                default: false
            },
            ready: {
                type: 'boolean',
                required: true
            },
            name: {
                type: 'string',
                required: true
            },
            title: {
                type: 'string',
                required: true
            },
            options: {
                type: 'AmpersandCollection',
                required: true,
                default: function() {
                    return new(AmpersandCollection.extend({
                        mainIndex: 'name',
                        modelConstructor: AmpersandModel.extend({
                            session: {
                                name: {
                                    type: 'string',
                                    required: true
                                },
                                title: {
                                    type: 'string',
                                    required: true
                                },
                                type: {
                                    type: 'string',
                                    required: true,
                                    values: ['boolean', 'text']
                                }
                            }
                        })
                    }))();
                }
            }
        },

        addOption: function(data, title, type, value) {
            if (typeof data === 'string') {
                data = {
                    name: data,
                    title: title,
                    type: type || 'boolean',
                    value: value || null
                };
            }
            this.options.add(data);
            return this;
        }
    }),

    bindings: {
        'model.ready': {
            type: 'booleanClass',
            name: 'js-ready'
        },
        'model.active': {
            type: 'booleanClass',
            name: 'js-active'
        }
    },

    initialize: function() {
        Optional.prototype.initialize.apply(this, arguments);
        if (this.targetModel) {
            this.targetModel.features.add(this.model);
        }
        this.ready().then(Promise.all([this.options()]).then(function() {
            this.model.ready = true;
        }.bind(this)));
    },

    /**
     * @override
     * @return Promise
     */
    options: function() {
        return new Promise(function(resolve) {
            resolve();
        }.bind(this));
    },

    /**
     * @override
     * @return Promise
     */
    ready: function() {
        return new Promise(function(resolve) {
            resolve();
        }.bind(this));
    }

});
