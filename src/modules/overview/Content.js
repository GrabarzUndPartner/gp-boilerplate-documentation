"use strict";

import Controller from 'gp-module-base/Controller';
import DomModel from 'gp-module-base/DomModel';

export default Controller.extend({

    modelConstructor: DomModel.extend({
        session: {
            loading: {
                type: 'boolean',
                required: true
            }
        }
    }),

    bindings: {
        'model.loading': {
            type: 'booleanClass',
            name: 'js-loading'
        }
    },

    events: {
        'click ': onClick
    },

    initialize: function() {
        Controller.prototype.initialize.apply(this, arguments);
        this.frameEl = this.queryByHook('frame');
        this.frameEl.addEventListener('load', onLoad.bind(this));
        if (this.targetModel) {
            this.targetModel.on('change:url', onUrlChange, this);
            if (this.targetModel.url) {
                onUrlChange.bind(this)(this.targetModel, this.targetModel.url);
            }
        }
    }
});

function getFrameUrl(scope) {
    return scope.frameEl.contentWindow.location.href;
}

function onUrlChange(model, url) {
    if (url !== getFrameUrl(this)) {
        this.model.loading = true;
        this.frameEl.style.height = null;
        this.frameEl.setAttribute('src', url);
    }
}

function onLoad() {
    console.log('test');
    if (this.targetModel.url !== getFrameUrl(this)) {
        this.targetModel.url = getFrameUrl(this);
    } else {
        this.frameEl.style.height = '100%';
        this.targetModel.showOverlay = false;
        this.targetModel.showMenu = false;
    }
    this.model.loading = false;
}

function onClick() {
    if (this.targetModel.showMenu) {
        this.targetModel.showMenu = false;
    }
}
