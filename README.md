# dep-tree #

Create and solve a dependency tree. [![Build Status](https://travis-ci.org/chilts/dep-tree.png?branch=master)](https://travis-ci.org/chilts/dep-tree)

[![NPM](https://nodei.co/npm/dep-tree.png?downloads=true)](https://nodei.co/npm/dep-tree/)

Allows you to create a tree and resolve the parents of any child. Each child can have multiple parents.

Note: no checking is done to stop adding cyclic dependencies. That is up to you.

## Example Usage ##

In the past I've named my database patches in a sequential manner. e.g. '001', '002', '003', but we all know that can
cause problems when two or more developers try and grab the next number in the patch series.

Instead, now I call them 'yyyymmdd-name' and each depends on something before it, usually a release number.

Let's say that 'create-user-table' depends on 'create-database'.

And that 'release-1' depends on 'create-user-table'.

Let's now add a few more patches which depend on 'release-1' : 'create-item-table' and 'update-user-table'.

Finally, 'release-2' depends on both 'create-item-table' and 'update-user-table'.

```javascript
var DepTree = require('dep-tree');
var tree = new DepTree();

// patches for release-1
tree.add('create-database', 'create-user-table');
tree.add('create-user-table', 'release-1');

// -> [ 'create-database', 'create-user-table', 'release-1' ]
tree.solve('release-1');

// patches for release-2
tree.add('release-1', 'create-item-table');
tree.add('release-1', 'update-user-table');
tree.add('create-item-table', 'release-2');
tree.add('update-user-table', 'release-2');

// [
//     'create-database', 'create-user-table', 'release-1',
//     'create-item-table', 'update-user-table', 'release-2'
// ]
tree.solve('release-2');
```

This example shows a tree which widens between releases and comes together for each release. You don't have to do it
this way but it probably makes it more manageable.

## Examples ##

### Simple ###

```javascript
tree.add('grandparent', 'parent');
tree.solve('grandparent'); // [ 'grandparent' ]
tree.solve('parent'); // [ 'grandparent', 'parent' ]
```

### Multi ###

```javascript
tree.add('grandparent', 'parent1');
tree.add('grandparent', 'parent2');
tree.add('parent1', 'child');
tree.add('parent2', 'child');

tree.solve('grandparent'); // [ 'grandparent' ]
tree.solve('parent1');     // [ 'grandparent', 'parent1' ]
tree.solve('parent2');     // [ 'grandparent', 'parent2' ]
tree.solve('child');       // [ 'grandparent', 'parent1', 'parent2', 'child' ]
```

### Reducing ###

Once you build your dependency tree, you can reduce it in any manner you choose.

Extending the above example:

```javascript
var result = tree.reduce('child', function(child, parents) {
    return '{ ' + child + ' -> ' + parents.join(', ') + ' }';
});

result //=> "{ child -> { parent2 -> { grandparent ->  } }, { parent1 -> { grandparent ->  } } }"
```

The result of each node is cached, so each node will be executed no more than once for each call to `tree.reduce`.

You can also give the reduce function an explicit cache object to maintain cached values across multiple reduce calls:

```javascript
var DepTree = require('dep-tree');
var tree = new DepTree();

tree.add('parent', 'son');
tree.add('parent', 'daughter');

// Define cache for multiple use
var cache = {}

// Helper functions
function add (x,y) { return x + y }
function sum (array) { return array.reduce(add) }

// //
//
// This is our reduce function.
// When we reduce on a specific node, dep-tree will call reduce
// on that node and its dependencies (in other words, the node's parents).
//
// A node's dependencies get reduced before the node itself.
//
//
function sumLengths (node, parents) {
  console.log("Reducing:", node);
  return node.length + sum(parents);
}

tree.reduce('son', sumLengths, cache); // <--- Provide cache as third parameter
// Console logs:
//   Reducing: parent
//   Reducing: son
// Returns:
//=> 9

console.log('Cache (1):', cache);
// Console logs:
//   Cache(1): { parent: 6, son: 9 }


tree.reduce('daughter', sumLengths, cache); // <--- Provide same cache as before
// Console logs:
//   Reducing: daughter
// Returns:
//=> 17

console.log('Cache (2):', cache);
// Console logs:
//   Cache(2): { parent: 6, son: 9, daughter: 17 }


tree.reduce('parent', sumLengths, cache);
// Console logs: nothing!
// Returns:
//=> 6
```

# Author #

Written by [Andrew Chilton](http://chilts.org/) - [Blog](http://chilts.org/blog/) -
[Twitter](https://twitter.com/andychilton);

# License #

* [Copyright 2013 Andrew Chilton. All rights reserved.](http://chilts.mit-license.org/2013/)

(Ends)
