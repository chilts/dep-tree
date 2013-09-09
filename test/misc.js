var test = require('tape');
var DepTree = require('../dep-tree.js');

test(function(t) {
    var tree = new DepTree();

    // make an initial release
    tree.add('20130830-property-table', '20130901-user-table');
    tree.add('20130830-property-table', '20130902-item-table');
    tree.add('20130901-user-table', '20130905-release');
    tree.add('20130902-item-table', '20130905-release');
    t.deepEqual(
        tree.ancestors('20130905-release'),
        ['20130830-property-table', '20130901-user-table', '20130902-item-table', '20130905-release'],
        'First release has everything in it'
    );

    // make a new release
    // 1) firstly, add the things that rely on the last release
    tree.add('20130905-release', '20130906-insert-admin');
    tree.add('20130905-release', '20130906-triggers');
    tree.add('20130906-triggers', '20130907-something-table');
    tree.add('20130905-release', '20130906-accounts');
    tree.add('20130906-accounts', '20130906-update-users');
    tree.add('20130906-update-users', '20130908-delete-old-rows');
    // 2) now add the new release and what you want in that
    tree.add('20130906-insert-admin', '20130909-release');
    tree.add('20130907-something-table', '20130909-release');
    tree.add('20130908-delete-old-rows', '20130909-release');

    // we know these parent/child relationships are sortable, so let's compare them
    t.deepEqual(
        tree.ancestors('20130909-release').sort(),
        [
            '20130830-property-table',
            '20130901-user-table',
            '20130902-item-table',
            '20130905-release',
            '20130906-insert-admin',
            '20130906-triggers',
            '20130907-something-table',
            '20130906-accounts',
            '20130906-update-users',
            '20130908-delete-old-rows',
            '20130909-release',
        ].sort(),
        'Second release has everything in it'
    );

    t.end();
});
