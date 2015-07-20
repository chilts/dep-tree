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

    var result = tree.reduce('parent', function(child, parents) {
        return [child].concat(parents).join(',');
    });
    t.equal(result, 'parent,grandparent');


    // two generations
    tree.add('parent', 'me');
    t.deepEqual(tree.solve('sdf'), [], '3) No parents');
    t.deepEqual(tree.solve('parent'), [ 'grandparent', 'parent' ], 'One Generation');
    t.deepEqual(tree.solve('me'), [ 'grandparent', 'parent', 'me' ], 'Two Generations');

    var result = tree.reduce('me', function(child, parents) {
        return [child].concat(parents).join(',');
    });
    t.equal(result, 'me,parent,grandparent');


    // Reducing on a non-existant key should work just fine
    var result = tree.reduce('idontexist', function(child, parents) {
        t.deepEqual(parents, [], "Non-existant key has zero parents");
        return 9;
    })
    t.equal(result, 9);


    t.end();
});
