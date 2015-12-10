function GPUPick() {

	var id;
	var data;
	//var lastData = {};
	//var lastClickedNode = -1;
	var lastHovereddNode = -1;
	var nodeClicked = {down: null, up: null};
	var selectedNode = null;

	var pixelBuffer = new Uint8Array(4);


	this.pickingTexture = new THREE.WebGLRenderTarget();
	this.pickingTexture.texture.minFilter = THREE.LinearFilter;
	this.pickingTexture.texture.generateMipmaps = false;

	function clicked() {

		if (nodeClicked.down == nodeClicked.up) {

			if (nodeClicked.down >= 0) {

				selectedNode = nodeClicked.down;
				console.log('you successfully selected', bigLookupTable[selectedNode]);
				simulator.nodeAttribUniforms.selectedNode.value = selectedNode;
				simulator.nodeAttribUniforms.hoverMode.value = 0;
			}

		}

		nodeClicked.down = null;
		nodeClicked.up = null;

	}

	function hoverOver(id) {

		//console.log('hovered over id', id);
		simulator.nodeAttribUniforms.selectedNode.value = id;

	}


	this.update = function () {

		renderer.setClearColor(0);
		renderer.render(pickingScene, camera, this.pickingTexture);

		//create buffer for reading single pixel
		pixelBuffer = new Uint8Array(4);

		//read the pixel under the mouse from the texture
		renderer.readRenderTargetPixels(this.pickingTexture, mouse.x * window.devicePixelRatio, this.pickingTexture.height - mouse.y * window.devicePixelRatio, 1, 1, pixelBuffer);

		//interpret the pixel as an ID

		id = ( pixelBuffer[0] << 16 ) | ( pixelBuffer[1] << 8 ) | ( pixelBuffer[2] - 1);


		data = nodesAndEdges[id];

		if (nodeClicked.down == null) {

			if (mouseDown) {

				nodeClicked.down = id;
				//console.log('down', id);

			}

		}

		if (nodeClicked.down != null && nodeClicked.up == null) {

			if (mouseUp) {

				nodeClicked.up = id;
				//console.log('up', id);

				clicked();

			}

		}

		if (selectedNode == null && nodeClicked.down == null) {

			// we're just hovering around

			if (lastHovereddNode != id) {

				lastHovereddNode = id;
				hoverOver(id);

			}

		}

		if (mouseDblClick) {

			console.log('selection cleared!');
			simulator.nodeAttribUniforms.hoverMode.value = 1;

			selectedNode = null;
			mouseDblClick = false;

		}

	};

}
