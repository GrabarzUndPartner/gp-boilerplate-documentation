"use strict";

import Feature from '../Feature';

// Optional Template

import template from './breakpoint.hbs';

// Optional CSS

import './breakpoint.pcss';

export default Feature.extend({
    tmpl: template,
    initialize: function() {
        Feature.prototype.initialize.apply(this, arguments);
    }
});
