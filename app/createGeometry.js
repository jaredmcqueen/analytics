function createGeometry() {

	/*
	 *   requires globals nodesAndEdges, nodesWidth, edgesWidth, nodesCount, edgesCount
	 *
	 * */


	// NODES


	nodeRegular = THREE.ImageUtils.loadTexture('textures/new_circle.png', {}, function () {
		renderer.render(scene, camera);
	});

	nodeThreat = THREE.ImageUtils.loadTexture('textures/crosshair.png', {}, function () {
		renderer.render(scene, camera);
	});

	nodeGeometry = new THREE.BufferGeometry();
	pickingNodeGeometry = new THREE.BufferGeometry();

// visible geometry attributes
	var nodePositions = new THREE.BufferAttribute(new Float32Array(nodesCount * 3), 3);
	var nodeReferences = new THREE.BufferAttribute(new Float32Array(nodesCount * 2), 2);
	var nodeColors = new THREE.BufferAttribute(new Float32Array(nodesCount * 3), 3);
	var nodePick = new THREE.BufferAttribute(new Float32Array(nodesCount), 1);
	var hover = new THREE.BufferAttribute(new Float32Array(nodesCount), 1);
	var threat = new THREE.BufferAttribute(new Float32Array(nodesCount), 1);

	nodeGeometry.addAttribute('position', nodePositions);
	nodeGeometry.addAttribute('texPos', nodeReferences);
	nodeGeometry.addAttribute('customColor', nodeColors);
	nodeGeometry.addAttribute('pickingNode', nodePick);
	nodeGeometry.addAttribute('threat', threat);

// picking geometry attributes (different colors)
	var pickingColors = new THREE.BufferAttribute(new Float32Array(nodesCount * 3), 3);
	var pickingPick = new THREE.BufferAttribute(new Float32Array(nodesCount), 1);
	pickingNodeGeometry.addAttribute('position', nodePositions);
	pickingNodeGeometry.addAttribute('texPos', nodeReferences);
	pickingNodeGeometry.addAttribute('customColor', pickingColors);
	pickingNodeGeometry.addAttribute('pickingNode', pickingPick);
	pickingNodeGeometry.addAttribute('threat', threat);

	var color = new THREE.Color(0x999999);
	var chromaColor;
	//console.log(nodesCount);

	var scale = ['#a6cee3', '#1f78b4', '#b2df8a', '#33a02c', '#fb9a99', '#fdbf6f', '#ff7f00', '#cab2d6', '#6a3d9a', '#ffff99', '#b15928'];

	var chromaScale = chroma.scale(scale).domain([0, nodesCount]);
	var threatValue = 0;

	var v = 0;
	$.each(g.nodes, function (key, value) {

		bigLookupTable.push(key);

		threatValue = 0;
		$.each(value.data, function (dkey, dvalue) {

			if (key == dvalue['source']){

				if (dvalue['source_hit'] == true) threatValue = 1;

			}

			if (key == dvalue['target']){

				if (dvalue['target_hit'] == true) threatValue = 1;

			}

		});

		nodePositions.array[v * 3] = 0;
		nodePositions.array[v * 3 + 1] = 0;
		nodePositions.array[v * 3 + 2] = 0;

		if (threatValue == 1){

			chromaColor = [1.0, 0.0, 0.0];  // red


		} else {

			chromaColor = chromaScale(v).gl();  // returns a RGB array normalized from 0.0 - 1.0

		}

		nodeColors.array[v * 3] = chromaColor[0];
		nodeColors.array[v * 3 + 1] = chromaColor[1];
		nodeColors.array[v * 3 + 2] = chromaColor[2];
		edgesLookupTable[key]['color'] = chromaColor;  // used later for labels and edges

		color.setHex(v + 1);
		pickingColors.array[v * 3] = color.r;
		pickingColors.array[v * 3 + 1] = color.g;
		pickingColors.array[v * 3 + 2] = color.b;

		nodePick.array[v] = 1.0;
		pickingPick.array[v] = 0.0;

		//TODO: this is now in a lookup table.
		nodeReferences.array[v * 2] = (v % nodesWidth) / nodesWidth;
		nodeReferences.array[(v * 2) + 1] = (Math.floor(v / nodesWidth)) / nodesWidth;

		// threats

		threat.array[v] = threatValue;


		v++;
	});

	//console.log(nodeReferences.array);

	nodeUniforms = {

		positionTexture: {type: "t", value: null},
		nodeAttribTexture: {type: "t", value: null},
		sprite: {type: "t", value: nodeRegular},
		threatSprite: {type: "t", value: nodeThreat},
		currentTime: {type: "f", value: null}


	};


	// ShaderMaterial


	nodeMaterial = new THREE.ShaderMaterial({

		uniforms: nodeUniforms,
		defines: {
			EPOCHSWIDTH: epochsWidth.toFixed(2)
		},
		vertexShader: shaders.vs.node,
		fragmentShader: shaders.fs.node,
		blending: THREE.AdditiveBlending,
		//blending: THREE.AdditiveBlending,
		depthTest: false,
		transparent: true

	});

	pickingMaterial = new THREE.ShaderMaterial({

		uniforms: nodeUniforms,
		defines: {
			EPOCHSWIDTH: epochsWidth.toFixed(2),
			NODESWIDTH: nodesWidth.toFixed(2)
		},
		vertexShader: shaders.vs.node,
		fragmentShader: shaders.fs.node,
		depthTest: false,
		transparent: false

	});

	nodeMesh = new THREE.Points(nodeGeometry, nodeMaterial);
	pickingMesh = new THREE.Points(pickingNodeGeometry, pickingMaterial);

	pickingScene.add(pickingMesh);
	graphStructure.add(nodeMesh);


//EDGES


	edgeGeometry = new THREE.BufferGeometry();

//get the number of edges

	var edgePositions = new THREE.BufferAttribute(new Float32Array(edgesCount * 2 * 3), 3);
	var edgeReferences = new THREE.BufferAttribute(new Float32Array(edgesCount * 2 * 2), 2);
	var edgeColors = new THREE.BufferAttribute(new Float32Array(edgesCount * 2 * 3), 3);

	edgeGeometry.addAttribute('position', edgePositions);
	edgeGeometry.addAttribute('texPos', edgeReferences);
	edgeGeometry.addAttribute('customColor', edgeColors);

//keeps track of which vertex we're on
	v = 0;
	var line;

	$.each(g.edges, function (key) {

		line = key.split('<>');

		var startNode = edgesLookupTable[line[0]];
		var endNode = edgesLookupTable[line[1]];


		//start of line
		edgeReferences.array[v * 2] = startNode.texPos[0];
		edgeReferences.array[v * 2 + 1] = startNode.texPos[1];

		// positions will be set by mapped texture
		edgePositions.array[v * 3] = 0;
		edgePositions.array[v * 3 + 1] = 0;
		edgePositions.array[v * 3 + 2] = 0;

		edgeColors.array[v * 3] = startNode.color[0];
		edgeColors.array[v * 3 + 1] = startNode.color[1];
		edgeColors.array[v * 3 + 2] = startNode.color[2];

		v++;


		//end of line

		edgeReferences.array[v * 2] = endNode.texPos[0];
		edgeReferences.array[v * 2 + 1] = endNode.texPos[1];

		// positions will be set by mapped texture
		edgePositions.array[v * 3] = 0;
		edgePositions.array[v * 3 + 1] = 0;
		edgePositions.array[v * 3 + 2] = 0;

		edgeColors.array[v * 3] = endNode.color[0];
		edgeColors.array[v * 3 + 1] = endNode.color[1];
		edgeColors.array[v * 3 + 2] = endNode.color[2];

		v++;

	});

	//now we get all the endpoints and put in the data

	edgeUniforms = {
		positionTexture: {type: "t", value: null},
		nodeAttribTexture: {type: "t", value: null},
	};

	edgeMaterial = new THREE.ShaderMaterial({
		uniforms: edgeUniforms,
		vertexShader: shaders.vs.edge,
		fragmentShader: shaders.fs.edge,
		//blending: THREE.AdditiveBlending,
		depthTest: false,
		transparent: true
	});

	cloudLines = new THREE.LineSegments(edgeGeometry, edgeMaterial);
	graphStructure.add(cloudLines);

}