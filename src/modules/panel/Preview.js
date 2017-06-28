"use strict";

import Panel from '../Panel';

import template from './preview.hbs';
import './preview.pcss';

export default Panel.extend({

    tmpl: template,

    modelConstructor: Panel.prototype.modelConstructor.extend({
        session: {
            name: {
                type: 'string',
                required: true,
                default: 'docs/panel/preview'
            },
            title: {
                type: 'string',
                required: true,
                default: 'Preview Settings'
            },
            referenceOptions: {
                type: 'array',
                required: false
            },
            references: {
                type: 'object',
                required: false
            }
        }
    }),

    initializeOptionals: function() {
        new(require('./preview/General').default)({
            target: '[data-module="' + this.el.getAttribute('data-module') + '"]',
            parentEl: this.panelOptionalsEl,
            optionalsAttributes: {
                wrapperSelector: '[data-hook=\'previewWrapper\']',
                backgroundSelector: '[data-hook=\'backgroundWrapper\']'
            }
        });
    }

});
