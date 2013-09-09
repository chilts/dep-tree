var test = require('tape');
var DepTree = require('../dep-tree.js');

test(function(t) {
    var tree = new DepTree();

    // no generations
    t.deepEqual(tree.ancestors('sdf'), [], '1) No parents');

    // one generation
    tree.add('grandparent', 'parent1');
    tree.add('grandparent', 'parent2');
    t.deepEqual(tree.ancestors('sdf'), [], '2) No parents');
    t.deepEqual(tree.ancestors('parent1'), [ 'grandparent', 'parent1' ], '1) One Generation');
    t.deepEqual(tree.ancestors('parent2'), [ 'grandparent', 'parent2' ], '2) One Generation');

    // two generations
    tree.add('parent1', 'me');
    tree.add('parent2', 'me');
    t.deepEqual(tree.ancestors('sdf'), [], '3) No parents');
    t.deepEqual(tree.ancestors('parent1'), [ 'grandparent', 'parent1' ], '1) One Generation');
    t.deepEqual(tree.ancestors('parent2'), [ 'grandparent', 'parent2' ], '2) One Generation');
    t.deepEqual(tree.ancestors('me'), [ 'grandparent', 'parent1', 'parent2', 'me' ], 'Two Generations');

    t.end();
});
