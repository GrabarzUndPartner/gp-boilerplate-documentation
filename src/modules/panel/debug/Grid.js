"use strict";

import extend from 'lodash/extend';
import Template from 'gp-module-base/Template';
import Feature from '../Feature';

// Optional Template

import template from './grid.hbs';
import columnsTemplate from './grid/columns.hbs';

// Optional CSS

import './grid.pcss';

export default Feature.extend({
    tmpl: template,
    columnsTmpl: new Template(columnsTemplate),

    modelConstructor: Feature.prototype.modelConstructor.extend({
        session: {
            visible: {
                type: 'boolean',
                required: true
            },
            gridFluid: {
                type: 'boolean',
                required: true
            },
            columnCount: {
                type: 'number',
                required: true,
                default: 12
            },
            columnColor: {
                type: 'string',
                required: true,
                default: '#ff00ff'
            },
            columnOpacity: {
                type: 'number',
                required: true,
                default: 0.2
            }
        }
    }),

    bindings: extend(Feature.prototype.bindings, {
        'model.visible': {
            type: 'booleanClass',
            name: 'js-visible'
        }
    }),

    initialize: function() {
        Feature.prototype.initialize.apply(this, arguments);
    },

    options: function() {
        return new Promise(function(resolve) {
            this.model.addOption('visible', 'Visible', 'boolean')
                .addOption('gridFluid', 'Fluid Grid?', 'boolean').on('change:gridFluid', onChangeGridFluid, this)
                .addOption('columnColor', 'Color', 'color', this.model.columnColor).on('change:columnColor', onChange, this)
                .addOption('columnOpacity', 'Opacity', 'number', this.model.columnOpacity).on('change:columnOpacity', onChange, this);
                // .addOption('columnCount', 'Count', 'number', this.model.columnCount).on('change:columnCount', onChange, this);
            resolve();
        }.bind(this));
    },

    ready: function() {
        return Feature.prototype.ready.apply(this, arguments).then(render(this)).then(function() {
            this.wrapperEl = this.queryByHook('wrapper');
            this.wrapperEl.classList.add('grid-wrapper');
            this.model.on('change:active', onChangeActive, this);
        }.bind(this));
    }

});

function onChangeActive(model) {
    onChangeGridFluid.bind(this)(model);
    onChange.bind(this)();
}

function onChangeGridFluid(model) {
    if (model.gridFluid && model.active) {
        this.wrapperEl.classList.add('grid-wrapper-fluid');
    } else {
        this.wrapperEl.classList.remove('grid-wrapper-fluid');
    }
}

function onChange() {
    render(this);
}

function render(scope) {
    return new Promise(function(resolve) {
        var columns = [];
        for (var i = 0; i < this.model.columnCount; i++) {
            columns.push(i);
        }
        this.columnsEl = this.queryByHook('columns');
        global.animationFrame.addOnce(function() {
            this.columnsEl.innerHTML = this.columnsTmpl.toText({
                columns: columns,
                columnCount: columns.length,
                columnColor: this.model.columnColor,
                columnOpacity: this.model.columnOpacity
            });
            resolve();
        }.bind(this));
    }.bind(scope));
}
