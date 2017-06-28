"use strict";

import utils from '../../utils';
import Feature from '../Feature';

// Optional Template

import template from './perfbar.hbs';

// Optional CSS

import './perfbar.pcss';

var loading = false;
export default Feature.extend({
    tmpl: template,
    perfbar: null,
    ready: function() {
        return Feature.prototype.ready.apply(this, arguments).then(function() {
            this.model.on('change:active', function(model, active) {
                if (this.perfbar) {
                    setVisibility(this, active);
                } else if (!loading && active) {
                    loading = true;
                    initScript().then(function(perfbar) {
                        this.perfbar = perfbar;
                        setVisibility(this, active);
                    }.bind(this));
                }
            }, this);
        }.bind(this));
    }
});

function setVisibility(scope, visible) {
    if (visible) {
        scope.perfbar.el.style.display = 'block';
    } else {
        scope.perfbar.el.style.display = 'none';
    }
}

function initScript() {
    return new Promise(function(resolve) {
        utils.loadScript('//rawgit.com/WPOTools/perfBar/master/build/perfbar.js', function() {
            var perfBar = global.perfBar;
            perfBar.init({
                lazy: true,
                budget: {
                    // the key is the metric id
                    'loadTime': {
                        max: 1250
                    },
                    'redirectCount': {
                        max: 1
                    },
                    'globalJS': {
                        min: 2,
                        max: 5
                    },
                    'cssCount': {
                        max: 3
                    },
                    'FirstPaint': {
                        max: 500
                    },
                    'Front End': {
                        max: 1000
                    }
                }
            });
            perfBar.el.style.display = 'none';
            resolve(perfBar);
        });
    });
}
