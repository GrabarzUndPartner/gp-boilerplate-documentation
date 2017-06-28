"use strict";

import Panel from '../Panel';

// Optional Template

import template from './debug.hbs';

// Optional CSS

import './debug.pcss';

export default Panel.extend({

    tmpl: template,

    modelConstructor: Panel.prototype.modelConstructor.extend({
        session: {
            name: {
                type: 'string',
                required: true,
                default: 'panel/debug'
            },
            title: {
                type: 'string',
                required: true,
                default: 'Debug'
            }
        }
    }),

    initializeOptionals: function() {

        new(require('./debug/Breakpoint').default)({
            target: '[data-module="' + this.el.getAttribute('data-module') + '"]',
            parentEl: this.panelOptionalsEl
        });
        new(require('./debug/Grid')).default({
            target: '[data-module="' + this.el.getAttribute('data-module') + '"]',
            parentEl: this.panelOptionalsEl
        });
        new(require('./debug/Perfbar')).default({
            target: '[data-module="' + this.el.getAttribute('data-module') + '"]',
            parentEl: this.panelOptionalsEl
        });
        new(require('./debug/Stats')).default({
            target: '[data-module="' + this.el.getAttribute('data-module') + '"]',
            parentEl: this.panelOptionalsEl
        });
        new(require('./debug/PartialMarker').default)({
            target: '[data-module="' + this.el.getAttribute('data-module') + '"]',
            parentEl: this.panelOptionalsEl
        });

    },

    refresh: function() {
        Panel.prototype.refresh.apply(this, arguments);
        this.el.style.width = parseInt(this.panelFeaturesEl.offsetWidth) + 'px';
        this.el.style.marginLeft = parseInt(this.panelFeaturesEl.offsetWidth / -2) + 'px';
    }

});
