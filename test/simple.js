var test = require('tape');
var DepTree = require('../dep-tree.js');

test(function(t) {
    var tree = new DepTree();

    // no generations
    t.deepEqual(tree.ancestors('sdf'), [], '1) No parents');

    // one generation
    tree.add('grandparent', 'parent');
    t.deepEqual(tree.ancestors('sdf'), [], '2) No parents');
    t.deepEqual(tree.ancestors('parent'), [ 'grandparent', 'parent' ], 'One Generation');

    // two generations
    tree.add('parent', 'me');
    t.deepEqual(tree.ancestors('sdf'), [], '3) No parents');
    t.deepEqual(tree.ancestors('parent'), [ 'grandparent', 'parent' ], 'One Generation');
    t.deepEqual(tree.ancestors('me'), [ 'grandparent', 'parent', 'me' ], 'Two Generations');

    t.end();
});
