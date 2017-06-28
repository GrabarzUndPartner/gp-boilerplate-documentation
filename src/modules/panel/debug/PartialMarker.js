"use strict";

import Feature from '../Feature';

// Optional Template

import template from './partial-marker.hbs';

// Optional CSS

import './partial-marker.pcss';

export default Feature.extend({
    tmpl: template,
    initialize: function() {
        Feature.prototype.initialize.apply(this, arguments);
        this.model.on('change:active', onChangeActive);

    }
});

function onChangeActive(model, active) {
    if (active) {
        document.body.parentElement.classList.add('js_active_debug__panel__partial_marker');
    } else {
        document.body.parentElement.classList.remove('js_active_debug__panel__partial_marker');
    }
}
