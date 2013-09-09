# dep-tree #

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

```
var DepTree = require('dep-tree').
var tree = new DepTree();

// patches for release-1
tree.add('create-database', 'create-user-table');
tree.add('create-user-table', 'release-1');

// -> [ 'create-database', 'create-user-table', 'release-1' ]
tree.resolve('release-1');

// patches for release-2
tree.add('release-1', 'create-item-table');
tree.add('release-1', 'update-user-table');
tree.add('create-item-table', 'release-2');
tree.add('update-user-table', 'release-2');

// -> [ 'create-database', 'create-user-table', 'release-1', 'create-item-table', 'update-user-table', 'release-2' ]
tree.resolve('release-2');
```

This example shows a tree which widens between releases and comes together for each release. You don't have to do it
this way but it probably makes it more manageable.

# Author #

Written by [Andrew Chilton](http://chilts.org/) - [Blog](http://chilts.org/blog/) -
[Twitter](https://twitter.com/andychilton).

# License #

* [Copyright 2013 Andrew Chilton.  All rights reserved.](http://chilts.mit-license.org/2013/)

(Ends)
