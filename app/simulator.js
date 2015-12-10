function Simulator(renderer) {

	/*
	 *   requires globals nodesAndEdges, nodesWidth, edgesWidth, nodesCount, edgesCount
	 *
	 * */

	var camera = new THREE.Camera();
	camera.position.z = 1;

	var scene = new THREE.Scene();

	var passThruUniforms = {
		texture: {type: "t", value: null}
	};

	var passThruShader = new THREE.ShaderMaterial({
		uniforms: passThruUniforms,
		defines: {
			NODESWIDTH: nodesWidth.toFixed(2)
		},
		vertexShader: shaders.vs.passthru,
		fragmentShader: shaders.fs.passthru
	});

	var mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(2, 2), passThruShader);
	scene.add(mesh);


	/*
	 all shaders are initialized with null textures.  This is so that we can create
	 the simulator without having the data required for the init() function
	 */


	var velocityShader = new THREE.ShaderMaterial({

		uniforms: {
			delta: {type: "f", value: 0.0},
			k: {type: "f", value: 100.0},
			temperature: {type: "f", value: 0.0},
			positions: {type: "t", value: null},
			layoutPositions: {type: "t", value: null},
			velocities: {type: "t", value: null},
			edgeIndices: {type: "t", value: null},
			edgeData: {type: "t", value: null}
		},
		defines: {
			NODESWIDTH: nodesWidth.toFixed(2),
			EDGESWIDTH: edgesWidth.toFixed(2)
		},
		vertexShader: shaders.vs.passthru,
		fragmentShader: shaders.ss.velocity,
		blending: 0

	});

	var positionShader = new THREE.ShaderMaterial({

		uniforms: {
			delta: {type: "f", value: 0.0},
			temperature: {type: "f", value: 0.0},
			positions: {type: "t", value: null},
			velocities: {type: "t", value: null}
		},
		defines: {
			NODESWIDTH: nodesWidth.toFixed(2)
		},
		vertexShader: shaders.vs.passthru,
		fragmentShader: shaders.ss.position,
		blending: 0
	});

	var nodeAttribShader = new THREE.ShaderMaterial({

		uniforms: {
			nodeIDMappings: {type: "t", value: null},
			epochsIndices: {type: "t", value: null},
			epochsData: {type: "t", value: null},
			nodeAttrib: {type: "t", value: null},
			edgeIndices: {type: "t", value: null},
			edgeData: {type: "t", value: null},
			delta: {type: "f", value: 0.0},
			minTime: {type: "f", value: 0.0},
			maxTime: {type: "f", value: 0.0},
			selectedNode: {type: "f", value: -1.0},
			hoverMode: {type: "f", value: 1.0}
		},
		defines: {
			NODESWIDTH: nodesWidth.toFixed(2),
			EPOCHSWIDTH: epochsWidth.toFixed(2),
			EDGESWIDTH: edgesWidth.toFixed(2)
		},
		vertexShader: shaders.vs.passthru,
		fragmentShader: shaders.ss.nodeAttrib,
		blending: 0
	});


	// expose uniforms to the rest of the app
	this.velocityUniforms = velocityShader.uniforms;
	this.positionUniforms = positionShader.uniforms;
	this.nodeAttribUniforms = nodeAttribShader.uniforms;

	var flipflop = true;

	var rtPosition1, rtPosition2, rtVelocity1, rtVelocity2, rtNodeAttrib1, rtNodeAttrib2;


	function init() {

		var dtPosition = generatePositionTexture(nodesAndEdges, nodesWidth, 1000);
		var dtVelocity = generateVelocityTexture(nodesAndEdges, nodesWidth);
		var dtNodeAttrib = generateNodeAttribTexture(nodesAndEdges, nodesWidth);

		velocityShader.uniforms.edgeIndices.value = generateIndiciesTexture(nodesAndEdges, nodesWidth);
		velocityShader.uniforms.edgeData.value = generateDataTexture(nodesAndEdges, edgesWidth);
		velocityShader.uniforms.layoutPositions.value = generateZeroedPositionTexture(nodesAndEdges, edgesWidth);

		nodeAttribShader.uniforms.epochsIndices.value = generateIndiciesTexture(nodesAndEpochs, nodesWidth);
		nodeAttribShader.uniforms.epochsData.value = generateEpochDataTexture(nodesAndEpochs, epochsWidth);
		nodeAttribShader.uniforms.edgeIndices.value = velocityShader.uniforms.edgeIndices.value;
		nodeAttribShader.uniforms.edgeData.value = velocityShader.uniforms.edgeData.value;
		nodeAttribShader.uniforms.nodeIDMappings.value = generateIdMappings(nodesAndEpochs, nodesWidth);

		rtPosition1 = getRenderTarget(THREE.RGBAFormat);
		rtPosition2 = rtPosition1.clone();

		rtVelocity1 = getRenderTarget(THREE.RGBAFormat);
		rtVelocity2 = rtVelocity1.clone();

		rtNodeAttrib1 = getRenderTarget(THREE.RGBAFormat);
		rtNodeAttrib2 = rtNodeAttrib1.clone();


		simulator.renderTexture(dtPosition, rtPosition1);
		simulator.renderTexture(rtPosition1, rtPosition2);

		simulator.renderTexture(dtVelocity, rtVelocity1);
		simulator.renderTexture(rtVelocity1, rtVelocity2);

		simulator.renderTexture(dtNodeAttrib, rtNodeAttrib1);
		simulator.renderTexture(rtNodeAttrib1, rtNodeAttrib2);

	}


	this.init = init;


	function getRenderTarget(type) {

		var renderTarget = new THREE.WebGLRenderTarget(nodesWidth, nodesWidth, {
			wrapS: THREE.RepeatWrapping,
			wrapT: THREE.RepeatWrapping,
			minFilter: THREE.NearestFilter,
			magFilter: THREE.NearestFilter,
			format: type,
			type: THREE.FloatType,
			stencilBuffer: false
		});

		return renderTarget;
	}


	this.renderTexture = function (input, output) {

		mesh.material = passThruShader;
		passThruUniforms.texture.value = input;
		renderer.render(scene, camera, output);

	};


	this.renderVelocity = function (position, velocity, output, delta, temperature) {

		mesh.material = velocityShader;
		velocityShader.uniforms.positions.value = position;
		velocityShader.uniforms.velocities.value = velocity;
		velocityShader.uniforms.temperature.value = temperature;
		velocityShader.uniforms.delta.value = delta;
		renderer.render(scene, camera, output);

	};


	this.renderPosition = function (position, velocity, output, delta) {

		mesh.material = positionShader;
		positionShader.uniforms.positions.value = position;
		positionShader.uniforms.velocities.value = velocity;
		positionShader.uniforms.delta.value = delta;
		renderer.render(scene, camera, output);

	};


	this.renderNodeAttrib = function (nodeAttrib, output, epochMin, epochMax, delta) {

		mesh.material = nodeAttribShader;
		nodeAttribShader.uniforms.nodeAttrib.value = nodeAttrib;
		nodeAttribShader.uniforms.minTime.value = epochMin;
		nodeAttribShader.uniforms.maxTime.value = epochMax;
		nodeAttribShader.uniforms.delta.value = delta;
		renderer.render(scene, camera, output);

	};


	this.simulate = function (delta, temperature, epochMin, epochMax) {

		// TODO: always run simulation, omit small temperatures in the shader
		// TODO: do node hovering in velocity

		if (flipflop) {

			if (temperature > 0.1) {

				simulator.renderVelocity(rtPosition1, rtVelocity1, rtVelocity2, delta, temperature);
				simulator.renderPosition(rtPosition1, rtVelocity2, rtPosition2, delta);

			}

			simulator.renderNodeAttrib(rtNodeAttrib1, rtNodeAttrib2, epochMin, epochMax, delta)

		} else {

			if (temperature > 0.1) {

				simulator.renderVelocity(rtPosition2, rtVelocity2, rtVelocity1, delta, temperature);
				simulator.renderPosition(rtPosition2, rtVelocity1, rtPosition1, delta);

			}

			simulator.renderNodeAttrib(rtNodeAttrib2, rtNodeAttrib1, epochMin, epochMax, delta)

		}

		//console.log(delta, temperature, epochMin, epochMax);
		//console.log(layoutPositions);

		flipflop = !flipflop;

	};

}