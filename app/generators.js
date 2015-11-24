// star
function generatorsStar(num) {
    var bn = 50;
    var bm = 50;
    for (i = 0; i < bn; ++i) {
        for (j = bn; j < bn + bm; ++j) {
            g.addEdge(i, j);
        }
    }
}


// balanced tree, don't go above 11
function generatorsBalancedTree(num) {
    var n = num, count = Math.pow(2, n), level;

    if (n === 0) {
        g.addNode(1);
    }

    for (level = 1; level < count; ++level) {
        var root = level,
            left = root * 2,
            right = root * 2 + 1;

        g.addEdge(root, left);
        g.addEdge(root, right);
    }
}


function generatorCube(num) {
// n dimensinonal cube don't go past 14
    var n = m = z = num;
    if (n < 1 || m < 1 || z < 1) {
        throw new Error("Invalid number of nodes in grid3 graph");
    }
    for (k = 0; k < z; ++k) {
        for (i = 0; i < n; ++i) {
            for (j = 0; j < m; ++j) {
                var level = k * n * m;
                var node = i + j * n + level;
                if (i > 0) {
                    g.addEdge(node, i - 1 + j * n + level);
                }
                if (j > 0) {
                    g.addEdge(node, i + (j - 1) * n + level);
                }
                if (k > 0) {
                    g.addEdge(node, i + j * n + (k - 1) * n * m);
                }
            }
        }
    }
}


// 2d lattice
//var n = 20;
//var m = 20;
//for (i = 0; i < n; ++i) {
//    for (j = 0; j < m; ++j) {
//        var node = i + j * n;
//        if (i > 0) { g.addLink(node, i - 1 + j * n); }
//        if (j > 0) { g.addLink(node, i + (j - 1) * n); }
//    }
//}

function generatorChain(num) {
    n = num + 1;
    g.addNode(0);
    for (i = 1; i < n; ++i) {
        g.addEdge(i - 1, i);
    }
}
