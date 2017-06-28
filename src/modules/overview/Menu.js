"use strict";

import Controller from 'gp-module-base/Controller';
import DomModel from 'gp-module-base/DomModel';

export default Controller.extend({

    modelConstructor: DomModel.extend({
        session: {}
    }),

    events: {
        'click [data-hook="internal"]': onClick,
        'click [data-hook="menuToggle"]': onClickMenuToggle
    },

    initialize: function() {
        Controller.prototype.initialize.apply(this, arguments);
        this.links = this.queryAllByHook('internal');
        this.targetModel.on('change:url', onUrlChange, this);
        if (this.targetModel.url) {
            onUrlChange.bind(this)(this.targetModel, this.targetModel.url);
        }
    },

});

function onClick(e) {
    e.preventDefault();
    if (this.targetModel.url !== e.target.href) {
        this.targetModel.showOverlay = true;
        console.log(e,e.target.href);
        this.targetModel.url = e.target.href;
    }
}

function onClickMenuToggle(e) {
    e.preventDefault();
    this.targetModel.showMenu = !this.targetModel.showMenu;
}

function onUrlChange(model, url) {
    if (this.currentItemEl) {
        this.currentItemEl.classList.remove('selected');
    }
    this.links.forEach(function(linkEl) {
        if (linkEl.href === url) {
            this.currentItemEl = linkEl;
            this.currentItemEl.classList.add('selected');
            return true;
        }
    }.bind(this));
}
