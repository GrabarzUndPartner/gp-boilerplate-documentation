'use strict';

import Controller from 'gp-module-base/Controller';
import DomModel from 'gp-module-base/DomModel';

export default Controller.extend({
    modelConstructor: DomModel.extend({
        session: {
            url: {
                type: 'string',
                required: true,
                default: function() {
                    return null;
                }
            },
            showOverlay: {
                type: 'boolean',
                required: true,
                default: function() {
                    return true;
                }
            },
            showMenu: {
                type: 'boolean',
                required: true,
                default: function() {
                    return false;
                }
            }
        }
    }),

    bindings: {
        'model.showOverlay': {
            type: 'booleanClass',
            name: 'js-show-overlay'
        },
        'model.showMenu': {
            type: 'booleanClass',
            name: 'js-show-menu'
        }
    },

    initialize: function() {
        Controller.prototype.initialize.apply(this, arguments);

        require.ensure(
            [],
            function(require) {
                // Chunk Load Debug
                var history = require('gp-module-history').default;
                function onChangeUrl(model, url) {
                    history.update([
                        {
                            name: 'url',
                            value: encodeURIComponent(url)
                        }
                    ]);
                }
                this.model.on('change:url', onChangeUrl.bind(this));
                if (history.registry.get('url')) {
                    this.model.url = history.registry.get('url').value;
                }
            }.bind(this),
            'gp-boilerplate-documentation/overview'
        );
    }
});
