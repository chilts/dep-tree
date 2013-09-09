var test = require('tape');
var DepTree = require('../dep-tree.js');

test(function(t) {
    var tree = new DepTree();

    // no generations
    t.deepEqual(tree.solve('sdf'), [], '1) No parents');

    // one generation
    tree.add('grandparent', 'parent');
    t.deepEqual(tree.solve('sdf'), [], '2) No parents');
    t.deepEqual(tree.solve('parent'), [ 'grandparent', 'parent' ], 'One Generation');

    // two generations
    tree.add('parent', 'me');
    t.deepEqual(tree.solve('sdf'), [], '3) No parents');
    t.deepEqual(tree.solve('parent'), [ 'grandparent', 'parent' ], 'One Generation');
    t.deepEqual(tree.solve('me'), [ 'grandparent', 'parent', 'me' ], 'Two Generations');

    t.end();
});
