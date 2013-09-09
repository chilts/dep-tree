var _ = require('underscore');

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
    var parents = [];

    // if we don't know about this child, return nothing
    if ( !self.parentsOf[child] ) {
        return [];
    }

    parents = [ child ];

    // loop through all of the parents of this child (backwards to keep order) and add them on
    self.parentsOf[child].reverse().forEach(function(parent) {
        parents.unshift(parent);
        parents.unshift(self.solve(parent));
    });

    parents = _.flatten(parents);

    return _.uniq(parents);
};

module.exports = DepTree;
