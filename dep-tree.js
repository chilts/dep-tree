// ----------------------------------------------------------------------------
//
// dep-tree.js - Create and solve a dependency tree.
//
// Copyright 2013 Andrew Chilton.  All rights reserved.
//
// License: MIT
//
// ----------------------------------------------------------------------------

// npm
var _ = require('underscore');

// ----------------------------------------------------------------------------

function DepTree() {
    this.parentsOf = {};
}

DepTree.prototype.add = function(parent, child) {
    var self = this;

    // add the parent of the child
    if ( self.parentsOf[child] ) {
        self.parentsOf[child].push(parent);
    }
    else {
        self.parentsOf[child] = [ parent ];
    }
};

DepTree.prototype.solve = function(child) {
    var self = this;

    // if we don't know about this child, return nothing
    if ( !self.parentsOf[child] ) {
        return [];
    }

    // loop through all of the parents of this child (backwards to keep order) and add them on
    var parents = [ child ];
    self.parentsOf[child].reverse().forEach(function(parent) {
        parents.unshift(parent);
        parents.unshift(self.solve(parent));
    });

    return _.chain(parents).flatten().uniq().value()
};

// ----------------------------------------------------------------------------

module.exports = DepTree;

// ----------------------------------------------------------------------------
