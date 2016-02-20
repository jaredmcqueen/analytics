var canvas, stats;
var camera, scene, renderer, controls;
var composer, vignette2Pass, multiPassBloomPass;
var backgroundColor = new THREE.Color(0x3c3c3c);
var nodeMesh, nodeGeometry, nodeUniforms, labelUniforms;
var simulate = false;
var graphStructure;
var mouse = new THREE.Vector2();
var mouseUp = true;
var mouseDown = false;
var mouseDblClick = false;
var temperature = 100;
var lastPickedNode = {};
var last = performance.now();
var simulator, interface;
var pickingTexture, pickingScene;
var k = 0;
var shaders;
var slider;

var epochMin, epochMax;
var epochOffset;


var nodesAndEdges, nodesAndEpochs, nodesWidth, edgesWidth, epochsWidth, nodesCount, edgesCount, edgesAndEpochs, edgesLookupTable;

var bigLookupTable = [];


var g = new Graph();

//generatorChain(100);
//generatorsBalancedTree(9);
//generatorCube(5);
//generatorsStar(50);

shaders = new ShaderLoader('./shaders');

shaders.shaderSetLoaded = function () {
	init();
	animate();
	        initNodes();
        simulate = true;

	//if (!_.isEmpty(g.nodes)) {
	//	console.log('using generator');
	//	initNodes();
	//	simulate = true;
	//}
};

shaders.load('vs-edge', 'edge', 'vertex');
shaders.load('fs-edge', 'edge', 'fragment');
shaders.load('vs-node', 'node', 'vertex');
shaders.load('fs-node', 'node', 'fragment');
shaders.load('vs-passthru', 'passthru', 'vertex');
shaders.load('fs-passthru', 'passthru', 'fragment');
shaders.load('sim-velocity', 'velocity', 'simulation');
shaders.load('sim-position', 'position', 'simulation');
shaders.load('sim-nodeAttrib', 'nodeAttrib', 'simulation');
shaders.load('vs-text', 'text', 'vertex');
shaders.load('fs-text', 'text', 'fragment');


function init() {

	canvas = document.getElementById('c');

	camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.0001, 100000);
	camera.position.x = 0;
	camera.position.y = 0;
	camera.position.z = 1500;

	controls = new THREE.OrbitControls(camera, canvas);
	controls.damping = 0.2;
	controls.enableDamping = false;

	scene = new THREE.Scene();

	pickingScene = new THREE.Scene();
	pickingTexture = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight);
	pickingTexture.texture.minFilter = THREE.LinearFilter;
	pickingTexture.texture.generateMipmaps = false;


	renderer = new THREE.WebGLRenderer({
		antialias: true,
		alpha: true,
		canvas: canvas
	});

	//WAGNER.vertexShadersPath = './shaders';
	//WAGNER.fragmentShadersPath = './shaders';
	//composer = new WAGNER.Composer(renderer, {useRGBA: false});

	//vignette2Pass = new WAGNER.Vignette2Pass();
	//vignette2Pass.params.boost = 1.0;
	//vignette2Pass.params.reduction = 0.5;


	//vignette2Pass = new WAGNER.VignettePass();
	//vignette2Pass.params.amount = 0.45;
	//vignette2Pass.params.falloff = 0.35;

	//multiPassBloomPass = new WAGNER.MultiPassBloomPass();
	//multiPassBloomPass.params.blurAmount = 0.2;



	//stats = new Stats();
	//stats.domElement.style.position = 'absolute';
	//stats.domElement.style.top = '50px';
	//container.appendChild(stats.domElement);

	//var gridHelper1 = new THREE.GridHelper(2000, 500);
	//scene.add(gridHelper1);
	//gridHelper2 = new THREE.GridHelper(2000, 500);
	//gridHelper2.rotation.z = Math.PI / 2;
	//scene.add(gridHelper2);
	//gridHelper3 = new THREE.GridHelper(2000, 500);
	//gridHelper3.rotation.x = Math.PI / 2;
	//scene.add(gridHelper3);

	graphStructure = new THREE.Object3D();
	scene.add(graphStructure);

	gpupicking = new GPUPick();

	slider = new Slider();
	slider.init();


	onWindowResize();
	window.addEventListener('resize', onWindowResize, false);
	document.addEventListener('mousemove', onMouseMove, false);
	document.addEventListener('mouseup', onMouseUp, false);
	document.addEventListener('mousedown', onMouseDown, false);
	document.addEventListener('dblclick', onDoubleClick, false);

}


function initNodes() {

	nodesAndEdges = g.getNodesAndEdgesArray();
	nodesAndEpochs = g.getEpochTextureArray('nodes');
	edgesAndEpochs = g.getEpochTextureArray('edges');


	nodesCount = nodesAndEdges.length;
	edgesCount = countDataArrayItems(nodesAndEdges);

	nodesWidth = indexTextureSize(nodesAndEdges.length);
	edgesWidth = dataTextureSize(countDataArrayItems(nodesAndEdges));
	epochsWidth = dataTextureSize(countDataArrayItems(nodesAndEpochs));

	//console.log('nodesAndEdges', nodesAndEdges);
	//console.log('nodesAndEpochs', nodesAndEpochs);
	//console.log('nodesCount', nodesCount);
	//console.log('edgesCount', edgesCount);
	//console.log('nodesWidth', nodesWidth);
	//console.log('edgesWidth', edgesWidth);
	//console.log('epochsWidth', epochsWidth);

	edgesLookupTable = g.getLookupTable(); // needs to be after nodesWidth

	temperature = nodesAndEdges.length / 2;


	// get the min and max values for epoch.


	var bigArray = [];
	for (var i = 0; i < nodesAndEpochs.length; i++) {

		for (var j = 0; j < nodesAndEpochs[i].length; j++) {

			bigArray.push(nodesAndEpochs[i][j]);
		}

	}

	//console.log(bigArray);
	min = _.min(bigArray);
	max = _.max(bigArray);

	//console.log('min epoch:', min, 'max epoch:', max);

	slider.setLimits(min, max);


	epochOffset = min;

	simulator = new Simulator(renderer);
	simulator.init();

	interface = new GUIInterface(simulator);
	interface.init();



	//
	//gui = new dat.GUI();
	//var effects = gui.addFolder('effects');
	//
	//var colorConfig = function () {
	//	this.color = "#2a2a2a";
	//};
	//var conf = new colorConfig();
	//
	////var colorPicker = effects.addColor(conf, 'color');
	////colorPicker.onChange(function (colorValue) {
	////	console.log(colorValue);
	////	backgroundColor = colorValue;
	////});
	//
	//
	//
	//effects.add(vignette2Pass.params, 'amount').min(0).max(1);
	//effects.add(vignette2Pass.params, 'falloff').min(0).max(1);


//    var gui = new dat.GUI();
////        gui.close();
//
//
//    var effectController = {
//        k: 10
//    };
//
//
//    var valuesChanger = function () {
//
//        simulator.velocityUniforms.k.value = 100;
//        //if (temperature < 200) temperature = 200;
//
//    };
//
//    valuesChanger();
//
//    gui.add(effectController, "k", 1, 10000).onChange(valuesChanger);


	graphStructure = new THREE.Object3D();
	scene.add(graphStructure);

	createGeometry();
	createLabels();

}


function onWindowResize() {

	//console.log(canvas);

	var width = canvas.clientWidth * window.devicePixelRatio;
	var height = canvas.clientHeight * window.devicePixelRatio;

	camera.aspect = width / height;
	camera.updateProjectionMatrix();

	renderer.setSize(width, height, false);  // YOU MUST PASS FALSE HERE!
	gpupicking.pickingTexture.setSize(width, height);
	//pickingTexture.setSize(width, height);
	//composer.setSize(width, height);

}


function onMouseDown(event) {

	if (event.target.id == 'c') {

		mouseDown = true;
		mouseUp = false;

	}

}


function onMouseUp(event) {

	if (event.target.id == 'c') {

		mouseDown = false;
		mouseUp = true;

	}

}

function onDoubleClick(event) {

	if (event.target.id == 'c') {

		mouseDown = false;
		mouseUp = true;
		mouseDblClick = true;

	}


}


function onMouseMove(e) {

	mouse.x = e.clientX;
	mouse.y = e.clientY;

	//console.log(mouseX, mouseY);

}


document.onkeypress = function (e) {

	//console.log(e.charCode);

	if (e.charCode === 115) {
		simulate = !simulate;
	}
	if (e.charCode === 61) {
		if (slider) {
			slider.increaseStep();
		}
	}
	if (e.charCode === 45) {
		if (slider) {
			slider.decreaseStep();
		}
	}

	if (e.charCode === 93) {
		if (slider) {
			slider.increaseHandles();
		}
	}

	if (e.charCode === 91) {
		if (slider) {
			slider.decreaseHandles();
		}
	}

};


function animate() {

	//stats.update();
	controls.update();
	slider.update();

	requestAnimationFrame(animate);
	render();
}


function pick() {

	//render the picking scene off-screen

	renderer.render(scene, camera, pickingTexture);

	//create buffer for reading single pixel
	var pixelBuffer = new Uint8Array(4);


	//read the pixel under the mouse from the texture
	renderer.readRenderTargetPixels(pickingTexture, mouse.x, pickingTexture.height - mouse.y, 1, 1, pixelBuffer);

	function highlightNode(idx, color) {
		nodeGeometry.attributes.customColor.array[idx * 3 + 0] = color[0];
		nodeGeometry.attributes.customColor.array[idx * 3 + 1] = color[1];
		nodeGeometry.attributes.customColor.array[idx * 3 + 2] = color[2];


	}

	function saveNodeColor(idx) {

		var r = nodeGeometry.attributes.customColor.array[idx * 3 + 0];
		var g = nodeGeometry.attributes.customColor.array[idx * 3 + 1];
		var b = nodeGeometry.attributes.customColor.array[idx * 3 + 2];

		return [r, g, b];

	}

	function restoreColor(idx, color) {

		nodeGeometry.attributes.customColor.array[idx * 3 + 0] = color[0];
		nodeGeometry.attributes.customColor.array[idx * 3 + 1] = color[1];
		nodeGeometry.attributes.customColor.array[idx * 3 + 2] = color[2];

	}

	var id = ( pixelBuffer[0] << 16 ) | ( pixelBuffer[1] << 8 ) | ( pixelBuffer[2] ) - 1;
	var data = nodesAndEdges[id];


	if (id != lastPickedNode.id) {
		//console.log('new node selected:', id, 'last one was:', lastPickedNode.id);

		// reset the old stuff to original values

		var lastData = nodesAndEdges[lastPickedNode.id];

		if (lastData) {
			//console.log('restoring', lastPickedNode.id);
			restoreColor(lastPickedNode.id, lastPickedNode.parent);
			for (var i = 0; i < lastData.length; i++) {
				restoreColor(lastData[i], lastPickedNode.children[i]);
			}
			nodeGeometry.attributes.customColor.needsUpdate = true;

		}


		// clear and set the new stuff


		if (data) {

			lastPickedNode = {};
			lastPickedNode.children = [];  // id, r, g, b
			lastPickedNode.parent = [];
			lastPickedNode.id = id;

			console.log(bigLookupTable[id]);

			lastPickedNode.parent = saveNodeColor(id);
			highlightNode(id, [0, 255, 0]);
			for (var i = 0; i < data.length; i++) {
				lastPickedNode.children.push(saveNodeColor(data[i]));
				highlightNode(data[i], [0, 0, 255])
			}

			nodeGeometry.attributes.customColor.needsUpdate = true;

		} else {

			lastPickedNode.id = id;
		}

	}

}


function countDataArrayItems(dataArray) {

	var counter = 0;

	for (var i = 0; i < dataArray.length; i++) {

		counter += dataArray[i].length;

	}

	return counter;

}


function render() {


	var now = performance.now();
	var delta = (now - last) / 1000;

	if (delta > 1) delta = 1; // safety cap on large deltas
	last = now;



	if (simulate) {

		temperature *= 0.99;
		simulator.simulate(delta, temperature, epochMin, epochMax);

		nodeUniforms.positionTexture.value = simulator.positionUniforms.positions.value;
		labelUniforms.positionTexture.value = simulator.positionUniforms.positions.value;

		nodeUniforms.nodeAttribTexture.value = simulator.nodeAttribUniforms.nodeAttrib.value;
		edgeUniforms.nodeAttribTexture.value = simulator.nodeAttribUniforms.nodeAttrib.value;
		labelUniforms.nodeAttribTexture.value = simulator.nodeAttribUniforms.nodeAttrib.value;
		//graphStructure.rotation.y += 0.0025;
	}

	if (nodeGeometry) {

		gpupicking.update();
		nodeUniforms.currentTime.value = now;
		//nodeUniforms.currentTime.value = Math.sin(now * 0.0005) * 1;
	}

	//renderer.setClearColor(backgroundColor);
	renderer.setClearColor( 0x000, 0.0);
	renderer.render(scene, camera);
	//renderer.autoClearColor = true;
	//renderer.render(scene, camera);

	//composer.reset();
	//composer.render(scene, camera);
	//composer.pass(vignette2Pass);
	//composer.pass(multiPassBloomPass);
	//composer.pass(fxaaPass);

	//composer.toScreen();

}