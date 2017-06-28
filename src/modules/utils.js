"use strict";

import uniq from 'lodash/uniq';
import unionBy from 'lodash/unionBy';
export default {
    mergeCollections: function(collectionA, collectionB, by) {
        return uniq(unionBy(collectionB, collectionA, by), false, by);
    },
    loadScript: function(url, callback) {
        var script = document.createElement('script');
        script.onload = callback;
        script.src = url;
        document.head.appendChild(script);
    }
};
