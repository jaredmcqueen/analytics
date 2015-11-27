var camera, scene, controls, renderer;

var BOUNDS = 25;
var BOUNDS_HALF = BOUNDS * 0.5;
var SPEED_LIMIT = 5.0;
var WORLD_LIMIT = 250;

var GRAVITY = 0.0000001;  // not used

var LAST = performance.now();
var DELTA;
var SIMULATE = false;
var FRICTION = 0.75;
var ORIGIN = new THREE.Vector3();
var REPULSION_FORCE = 2000.0;
var ATTRACTION_FORCE = 100.00;

var points;

var center = new THREE.Vector3();
var bbox = new THREE.Box3();
var centerOfThing;

var C = 10;
var K = 0;

var EDGES = [];
var NODES = [];

var last = performance.now();

var g = new Graph();

//var bn = 4;
//var bm = 5;
//for (i = 0; i < bn; ++i) {
//    for (j = bn; j < bn + bm; ++j) {
//        g.addLink(i, j);
//    }
//}

//var n = 5, count = Math.pow(2, n), level;
//
//if (n === 0) {
//    g.addNode(1);
//}
//
//for (level = 1; level < count; ++level) {
//    var root = level,
//        left = root * 2,
//        right = root * 2 + 1;
//
//    g.addLink(root, left);
//    g.addLink(root, right);
//}

var n = m = z = 3;
if (n < 1 || m < 1 || z < 1) {
    throw new Error("Invalid number of nodes in grid3 graph");
}


for (k = 0; k < z; ++k) {
    for (i = 0; i < n; ++i) {
        for (j = 0; j < m; ++j) {
            var level = k * n * m;
            var node = i + j * n + level;
            if (i > 0) {
                g.addLink(node, i - 1 + j * n + level);
            }
            if (j > 0) {
                g.addLink(node, i + (j - 1) * n + level);
            }
            if (k > 0) {
                g.addLink(node, i + j * n + (k - 1) * n * m);
            }
        }
    }
}


EDGES = g.getEdges();






var Body = function (id, edges) {
    this.velocity = new THREE.Vector3();
    this.position = new THREE.Vector3();
    this.mesh = null;
    this.lines = [];
    this.leaf = false;
    this.id = id;
    this.edges = edges;
    this.lines = [];

};



function init() {

    container = document.createElement('div');
    document.body.appendChild(container);

    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 100000);
    camera.position.y = 50;
    camera.position.z = 175;

    scene = new THREE.Scene();

    renderer = new THREE.CanvasRenderer();
    //renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    controls = new THREE.OrbitControls(camera, container);
    controls.damping = 0.2;
    controls.staticMoving = false;

    scene.add(new THREE.GridHelper(100, 20));

    points = new THREE.Object3D();
    scene.add(points);

    //centerOfThing = new THREE.Mesh(
    //    new THREE.SphereGeometry(100, 10, 10),
    //    new THREE.MeshBasicMaterial({color: new THREE.Color(0xff0000), wireframe: true})
    //);
    //scene.add(centerOfThing);

    window.addEventListener('resize', onWindowResize, false);

}


function initNodes() {


    for (var i = 0; i < EDGES.length; i++) {
        var node = new Body(i, EDGES[i]);
        node.position.x = BOUNDS * Math.random() - BOUNDS_HALF;
        node.position.y = BOUNDS * Math.random() - BOUNDS_HALF;
        node.position.z = BOUNDS * Math.random() - BOUNDS_HALF;

        node.mesh = new THREE.Mesh(
            new THREE.BoxGeometry(3, 3, 3),
            new THREE.MeshBasicMaterial({color: new THREE.Color(0x00ffff)})
        );
        points.add(node.mesh);
        node.mesh.position.copy(node.position);
        NODES.push(node);
    }

    K = Math.sqrt(BOUNDS * 500 / NODES.length);
    console.log(K);


    // add the lines between nodes
    for (var i = 0; i < NODES.length; i++) {
        var node = NODES[i];


        for (var j = 0; j < node.edges.length; j++) {
            var line = new THREE.Line(
                new THREE.Geometry(),
                new THREE.LineBasicMaterial({color: 0xffffcc})
            );
            line.geometry.vertices.push(node.position, NODES[node.edges[j]].position);
            node.lines.push(line);
            points.add(line);
        }
    }

    // calculate k

    //k = 1.0 * Math.sqrt(area / NODES.length);


}

function updateLines() {
    for (var i = 0; i < NODES.length; i++) {
        var node = NODES[i];

        for (var j = 0; j < node.lines.length; j++) {
            var line = node.lines[j];
            //console.log(line);
            line.geometry.vertices[0].copy(node.position);
            line.geometry.vertices[1].copy(NODES[node.edges[j]].position);
        }
    }
}


function calcVelocities(delta) {

    var selfPosition;
    var nodePosition;
    var selfVelocity = new THREE.Vector3();

    function addRepulsion(self, neighbor) {

        var diff = new THREE.Vector3();
        var diffNormalized = new THREE.Vector3();
        var diffLength = 0;
        var f = 0;

        diff.subVectors(self, neighbor);
        diffNormalized.copy(diff).normalize();
        diffLength = diff.length();
        f = (K * K) / diffLength;
        return diffNormalized.multiplyScalar(f);
    }

    function addAttraction(self, neighbor) {

        var diff = new THREE.Vector3();
        var diffNormalized = new THREE.Vector3();
        var diffLength = 0;
        var f = 0;

        diff.subVectors(self, neighbor);
        diffNormalized.copy(diff).normalize();
        diffLength = diff.length();
        f = (diffLength * diffLength) / K;

        return diffNormalized.multiplyScalar(f);

    }

    // repulsion
    for (var i = 0; i < NODES.length; i++) {
        selfPosition = NODES[i].position;
        selfVelocity = NODES[i].velocity;
        for (var j = 0; j < NODES.length; j++) {
            nodePosition = NODES[j].position;
            if (selfPosition.distanceTo(nodePosition) < 0.001) continue;
            selfVelocity.add(addRepulsion(selfPosition, nodePosition));
        }
    }

    //attraction
    for (var i = 0; i < NODES.length; i++) {
        selfPosition = NODES[i].position;
        selfVelocity = NODES[i].velocity;
        selfEdges = NODES[i].edges;
        for (var j = 0; j < selfEdges.length; j++) {
            nodePosition = NODES[selfEdges[j]].position;
            selfVelocity.sub(addAttraction(selfPosition, nodePosition));
        }
    }

    // add friction
    //for (var i = 0; i < NODES.length; i++) {
    //    selfVelocity = NODES[i].velocity;
    //    selfVelocity.multiplyScalar(FRICTION);
    //}
    //console.log(NODES[0].velocity);

}


var counter = 1;
var iterations = 100;
function calcPositions(delta) {
    //console.log(counter);

    for (var i = 0; i < NODES.length; i++) {
        var node = NODES[i];
        var newPosition = new THREE.Vector3();
        var newVelocity = new THREE.Vector3().copy(node.velocity);
        newVelocity.normalize();
        //newVelocity.multiplyScalar(1);
        newPosition.addVectors(node.position, newVelocity);
        node.mesh.position.copy(newPosition);
        node.position.copy(newPosition);
        node.velocity.set(0, 0, 0);
    }
    counter++;

}


document.onkeypress = function (e) {
    if (e.charCode === 115) {
        SIMULATE = !SIMULATE;
        console.log('simulation enabled:', SIMULATE);
    }
};

function onWindowResize() {

    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

}


function animate() {
    controls.update();
    requestAnimationFrame(animate);
    render();
}


function centerThings() {

    bbox.setFromObject(points);

    center.addVectors(
        bbox.min,
        bbox.max
    );

    center.divideScalar(2);
    centerOfThing.position.set(center.x, center.y, center.z);
}


function render() {
    var now = performance.now();
    var delta = (now - last) / 1000;

    if (delta > 1) delta = 1; // safety cap on large deltas
    last = now;

    if (SIMULATE) {
        calcVelocities();
        calcPositions();
        updateLines();
        //console.log(delta);
    }

    renderer.render(scene, camera);
}
