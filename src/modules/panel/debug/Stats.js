"use strict";


import utils from '../../utils';
import Feature from '../Feature';

// Optional Template

import template from './stats.hbs';

// Optional CSS

import './stats.pcss';

var loading = false;
export default Feature.extend({
    tmpl: template,
    stats: null,
    modelConstructor: Feature.prototype.modelConstructor.extend({
        tmpl: template,
        session: {
            position: {
                type: 'string',
                required: false
            },
            positionLeft: {
                type: 'string',
                required: false,
                default: 'auto'
            },
            positionTop: {
                type: 'string',
                required: false,
                default: '0'
            },
            positionRight: {
                type: 'string',
                required: false,
                default: '0'
            },
            positionBottom: {
                type: 'string',
                required: false
            }
        }
    }),
    options: function() {
        return new Promise(function(resolve) {
            this.model.addOption('positionLeft', 'Left', 'text', 'auto', this.model.positionLeft).on('change:positionLeft', '', onChangePosition, this)
                .addOption('positionTop', 'Top', 'text', this.model.positionTop).on('change:positionTop', onChangePosition, this)
                .addOption('positionRight', 'Right', 'text', this.model.positionRight).on('change:positionRight', onChangePosition, this)
                .addOption('positionBottom', 'Bottom', 'text', this.model.positionBottom).on('change:positionBottom', onChangePosition, this);
            resolve();
        }.bind(this));
    },


    ready: function() {
        return Feature.prototype.ready.apply(this, arguments).then(function() {
            this.model.on('change:active', onChangeActive, this);
        }.bind(this));
    }
});

function onChangeActive(model, active) {
    if (this.stats) {
        setVisibility(this, active);
        onChangePosition.bind(this)(model);
    } else if (!loading && active) {
        loading = true;
        initScript().then(function(stats) {
            this.stats = stats;
            onChangePosition.bind(this)(model);
            setVisibility(this, active);
        }.bind(this));
    }
}

function setVisibility(scope, visible) {
    if (visible) {
        scope.stats.dom.style.display = 'block';
    } else {
        scope.stats.dom.style.display = 'none';
    }
}

function onChangePosition(model) {
    if (this.stats) {
        var positions = {
            left: model.positionLeft,
            top: model.positionTop,
            right: model.positionRight,
            bottom: model.positionBottom
        };
        for (var name in positions) {
            if (positions.hasOwnProperty(name) && name) {
                this.stats.dom.style[name] = positions[name];
            } else {
                this.stats.dom.style[name] = null;
            }
        }
    }
}

function initScript() {
    return new Promise(function(resolve) {
        utils.loadScript('//rawgit.com/mrdoob/stats.js/master/build/stats.min.js', function() {
            var stats = new global.Stats();
            document.body.appendChild(stats.dom);
            requestAnimationFrame(function loop() {
                stats.update();
                global.requestAnimationFrame(loop);
            });
            stats.dom.style.display = 'none';
            resolve(stats);
        });
    });
}
