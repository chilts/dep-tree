var test = require('tape');
var DepTree = require('../dep-tree.js');

test(function(t) {
    var tree = new DepTree();

    // no generations
    t.deepEqual(tree.solve('sdf'), [], '1) No parents');

    // one generation
    tree.add('grandparent', 'parent1');
    tree.add('grandparent', 'parent2');
    t.deepEqual(tree.solve('sdf'), [], '2) No parents');
    t.deepEqual(tree.solve('parent1'), [ 'grandparent', 'parent1' ], '1) One Generation');
    t.deepEqual(tree.solve('parent2'), [ 'grandparent', 'parent2' ], '2) One Generation');

    // two generations
    tree.add('parent1', 'me');
    tree.add('parent2', 'me');
    t.deepEqual(tree.solve('sdf'), [], '3) No parents');
    t.deepEqual(tree.solve('parent1'), [ 'grandparent', 'parent1' ], '1) One Generation');
    t.deepEqual(tree.solve('parent2'), [ 'grandparent', 'parent2' ], '2) One Generation');
    t.deepEqual(tree.solve('me'), [ 'grandparent', 'parent1', 'parent2', 'me' ], 'Two Generations');

    // Reduce two generations
    var visitCounts = {};
    var result = tree.reduce('me', function(child, parents) {
        visitCounts[child] || (visitCounts[child] = 0);
        visitCounts[child] += 1;
        return [child].concat(parents).join(',');
    });
    var option1 = 'me,parent2,grandparent,parent1,grandparent';
    var option2 = 'me,parent1,grandparent,parent2,grandparent';
    t.assert(result === option1 || result === option2, "All dependencies reduce.");

    for (var node in visitCounts) {
        t.equal(visitCounts[node], 1, node + " should only be reduced once");
    }


    // Reusing a cache should not incur multiple calls
    var tree2 = new DepTree();
    tree2.add('schools', 'groups');
    tree2.add('groups', 'memberships');
    tree2.add('users', 'memberships');

    var visitCounts = {};
    var explicitCache = {};
    ['groups', 'memberships', 'users', 'schools'].forEach(function(node) {

        var result = tree2.reduce(node, function(child, parents) {
            visitCounts[child] || (visitCounts[child] = 0);
            visitCounts[child] += 1;
            return true;
        }, explicitCache);
    });

    ['groups', 'memberships', 'users', 'schools'].forEach(function(node) {
        t.equal(visitCounts[node], 1, node + " should only be reduced once");
    });


    t.end();
});
