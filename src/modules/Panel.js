"use strict";

import Optional from 'gp-module-base/controller/Optional';
import viewport from 'gp-module-viewport';

import Template from 'gp-module-base/Template';

import AmpersandCollection from 'ampersand-collection';
import debounce from 'lodash/debounce';

import template from './panel.hbs';
import './panel.pcss';

import linkListTemplate from './panel/features.hbs';

export default Optional.extend({
    tmpl: template,
    linkListTmpl: new Template(linkListTemplate),

    modelConstructor: Optional.prototype.modelConstructor.extend({
        session: {
            name: {
                type: 'string',
                required: true
            },
            title: {
                type: 'string',
                required: true
            },
            visible: {
                type: 'boolean',
                required: true,
                default: false
            },
            features: {
                type: 'AmpersandCollection',
                required: true,
                default: function() {
                    return new(AmpersandCollection.extend({
                        mainIndex: 'name'
                    }))();
                }
            }
        }
    }),
    bindings: {
        'model.visible': {
            type: 'booleanClass',
            name: 'js-visible'
        },
        'model.title': {
            type: 'text',
            hook: 'panelTitle'
        }
    },
    events: {
        'change [data-hook="panelFeatures"] [data-hook="featuresOptions"] input': onChangeOption,
        'change [data-hook="panelFeatures"] [data-hook="featuresOptions"] select': onChangeOption,
        'click [data-hook="panelTitle"]': onClickTitle
    },

    initialize: function() {
        Optional.prototype.initialize.apply(this, arguments);
        this.panelFeaturesEl = this.queryByHook('panelFeatures');
        this.panelOptionalsEl = this.queryByHook('panelOptionals');
        this.model.features.on('add', function(model) {
            model.on('change:active', function(model, active) {
                setFeatureActive(this, model.name, active);
            }, this);
            debounce(function() {
                this.refresh();
            }.bind(this), 20)();
        }, this);
        this.el.removeAttribute('style');
        viewport.on(viewport.EVENT_TYPES.RESIZE, this.refresh.bind(this));
        console.log(this.model.title);
        // Initialize Chunks
        this.initializeOptionals();

    },
    /**
     * @override
     */
    initializeOptionals: function() {},


    refresh: function() {
        var data = [].concat(this.model.features.models).map(function(model) {
            return {
                active: model.active,
                title: model.title,
                name: model.name,
                options: model.options.map(function(option) {
                    switch (option.type) {
                        case 'boolean':
                            option.typeBoolean = true;
                            break;
                        case 'text':
                            option.typeText = true;
                            break;
                        case 'color':
                            option.typeColor = true;
                            break;
                        case 'number':
                            option.typeNumber = true;
                            break;
                        case 'select':
                            option.typeSelect = true;
                            break;
                    }
                    return option;
                })
            };
        });
        this.panelFeaturesEl.replaceChild(this.linkListTmpl.toFragment(data), this.panelFeaturesEl.children[0]);
        var features = JSON.parse(global.localStorage.getItem(this.model.name)) || {};
        for (var featureName in features) {
            if (features.hasOwnProperty(featureName)) {
                var featureData = features[featureName];
                for (var name in featureData) {
                    if (featureData.hasOwnProperty(name)) {
                        var value = featureData[name];
                        var node = this.panelFeaturesEl.querySelector('[data-feature-name="' + featureName + '"][data-name="' + name + '"]');
                        if (node) {
                            if (node.type && node.type.match(/checkbox|radio/)) {
                                node.checked = value;
                            } else {
                                node.value = value || '0';
                            }
                            var feature = this.model.features.get(featureName, 'name');
                            feature.set(name, value);
                            feature.trigger('change:' + name, feature, value);
                        }
                    }
                }
            }
        }
    }

});

function setFeatureActive(scope, name, active) {
    if (active) {
        scope.queryByHook(name).classList.add('js-active');
    } else {
        scope.queryByHook(name).classList.remove('js-active');
    }
}

function onClickTitle() {
    this.model.visible = !this.model.visible;
}

function onChangeOption(e) {
    e.preventDefault();
    var featureName = e.target.getAttribute('data-feature-name');
    var name = e.target.getAttribute('data-name');
    var data = JSON.parse(global.localStorage.getItem(this.model.name)) || {};
    data[featureName] = data[featureName] || {};
    if (e.target.type && e.target.type.match(/number/)) {
        data[featureName][name] = parseFloat(e.target.value);
        e.target.value = data[featureName][name];
    } else if (e.target.type && e.target.type.match(/checkbox|radio/)) {
        data[featureName][name] = !!e.target.checked;
    } else {
        data[featureName][name] = e.target.value;
    }
    var feature = this.model.features.get(featureName);
    feature.set(name, data[featureName][name], {
        silent: true
    });
    feature.trigger('change:' + name, feature, data[featureName][name]);
    global.localStorage.setItem(this.model.name, JSON.stringify(data));
}
