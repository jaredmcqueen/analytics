function createLabels() {


    var font = UbuntuMono('lib/UbuntuMono.png');
    var texture = font.texture;

    var letterWidth = 20;
    var letterSpacing = 15;

    function getTextCoordinates(letter) {

        var index;

        var charCode = letter.charCodeAt(0);
        //console.log('  charCode is:', charCode);


        var charString = "" + charCode;


        // Some weird CHAR CODES
        if (charCode == 8216) {
            charCode = 39;
        }

        if (charCode == 8217) {
            charCode = 39;
        }

        if (charCode == 8212) {
            charCode = 45;
        }

        for (var z in font) {
            if (z == charCode) {
                index = font[z];
            }
        }

        if (!index) {

            //console.log('  NO LETTER');
            index = [0, 0];

        }


        var left = index[0] / 1024;
        var top = index[1] / 1024;

        var width = index[2] / 1024;
        var height = index[3] / 1024;

        var xoffset = index[4] / 1024;
        var yoffset = index[5] / 1024;

        var array = [left, top, width, height, xoffset, yoffset];
        return array

    }


    // need to get particle count.


    var particleCount = 0;
    $.each(g.nodes, function (key) {
        particleCount += key.length;
    });
    //console.log('character count:', particleCount);


    labelGeometry = new THREE.BufferGeometry();

    var positions = new THREE.BufferAttribute(new Float32Array(particleCount * 6 * 3), 3);
    var labelPositions = new THREE.BufferAttribute(new Float32Array(particleCount * 6 * 3), 3);
    var labelColors = new THREE.BufferAttribute(new Float32Array(particleCount * 6 * 3), 3);
    var uvs = new THREE.BufferAttribute(new Float32Array(particleCount * 6 * 2), 2);
    var ids = new THREE.BufferAttribute(new Float32Array(particleCount * 6 * 1), 1);
    var textCoords = new THREE.BufferAttribute(new Float32Array(particleCount * 6 * 4), 4);
    var labelReferences = new THREE.BufferAttribute(new Float32Array(particleCount * 6 * 2), 2);

    labelGeometry.addAttribute('position', positions);
    labelGeometry.addAttribute('labelPositions', labelPositions);
    labelGeometry.addAttribute('uv', uvs);
    labelGeometry.addAttribute('id', ids);
    labelGeometry.addAttribute('textCoord', textCoords);
    labelGeometry.addAttribute('texPos', labelReferences);
    labelGeometry.addAttribute('customColor', labelColors);

    var counter = 0;
    var nodeLookup;
    $.each(g.nodes, function (key) {

        nodeLookup = edgesLookupTable[key];

        //console.log('working on word:', key);

        for (var i = 0; i < key.length; i++) {
            //console.log(' counter:', counter);


            var index = counter * 3 * 2;

            //console.log('  character:', key[i]);
            var tc = getTextCoordinates(key[i]);
            //console.log('  tc:', tc);

            // Left is offset
            var l = tc[4];

            // Right is offset + width
            var r = tc[4] + tc[2];

            // bottom is y offset
            var b = tc[5] - tc[3];

            // top is y offset + height
            var t = tc[5];


            ids.array[index + 0] = i;
            ids.array[index + 1] = i;
            ids.array[index + 2] = i;
            ids.array[index + 3] = i;
            ids.array[index + 4] = i;
            ids.array[index + 5] = i;

            positions.array[index * 3 + 0] = 0;
            positions.array[index * 3 + 1] = 0;
            positions.array[index * 3 + 2] = 0;

            positions.array[index * 3 + 3] = 0;
            positions.array[index * 3 + 4] = 0;
            positions.array[index * 3 + 5] = 0;

            positions.array[index * 3 + 6] = 0;
            positions.array[index * 3 + 7] = 0;
            positions.array[index * 3 + 8] = 0;

            positions.array[index * 3 + 9] = 0;
            positions.array[index * 3 + 10] = 0;
            positions.array[index * 3 + 11] = 0;

            positions.array[index * 3 + 12] = 0;
            positions.array[index * 3 + 13] = 0;
            positions.array[index * 3 + 14] = 0;

            positions.array[index * 3 + 15] = 0;
            positions.array[index * 3 + 16] = 0;
            positions.array[index * 3 + 17] = 0;


            labelPositions.array[index * 3 + 0] = (i * letterSpacing) + l * letterWidth * 10;
            labelPositions.array[index * 3 + 1] = t * letterWidth * 10;
            labelPositions.array[index * 3 + 2] = 0 * letterWidth * 10;

            labelPositions.array[index * 3 + 3] = (i * letterSpacing) + l * letterWidth * 10;
            labelPositions.array[index * 3 + 4] = b * letterWidth * 10;
            labelPositions.array[index * 3 + 5] = 0 * letterWidth * 10;

            labelPositions.array[index * 3 + 6] = (i * letterSpacing) + r * letterWidth * 10;
            labelPositions.array[index * 3 + 7] = t * letterWidth * 10;
            labelPositions.array[index * 3 + 8] = 0 * letterWidth * 10;

            labelPositions.array[index * 3 + 9] = (i * letterSpacing) + r * letterWidth * 10;
            labelPositions.array[index * 3 + 10] = b * letterWidth * 10;
            labelPositions.array[index * 3 + 11] = 0 * letterWidth * 10;

            labelPositions.array[index * 3 + 12] = (i * letterSpacing) + r * letterWidth * 10;
            labelPositions.array[index * 3 + 13] = t * letterWidth * 10;
            labelPositions.array[index * 3 + 14] = 0 * letterWidth * 10;

            labelPositions.array[index * 3 + 15] = (i * letterSpacing) + l * letterWidth * 10;
            labelPositions.array[index * 3 + 16] = b * letterWidth * 10;
            labelPositions.array[index * 3 + 17] = 0 * letterWidth * 10;


            uvs.array[index * 2 + 0] = 0;
            uvs.array[index * 2 + 1] = 1;

            uvs.array[index * 2 + 2] = 0;
            uvs.array[index * 2 + 3] = 0;

            uvs.array[index * 2 + 4] = 1;
            uvs.array[index * 2 + 5] = 1;

            uvs.array[index * 2 + 6] = 1;
            uvs.array[index * 2 + 7] = 0;

            uvs.array[index * 2 + 8] = 1;
            uvs.array[index * 2 + 9] = 1;

            uvs.array[index * 2 + 10] = 0;
            uvs.array[index * 2 + 11] = 0;


            textCoords.array[index * 4 + 0] = tc[0];
            textCoords.array[index * 4 + 1] = tc[1];
            textCoords.array[index * 4 + 2] = tc[2];
            textCoords.array[index * 4 + 3] = tc[3];

            textCoords.array[index * 4 + 4] = tc[0];
            textCoords.array[index * 4 + 5] = tc[1];
            textCoords.array[index * 4 + 6] = tc[2];
            textCoords.array[index * 4 + 7] = tc[3];

            textCoords.array[index * 4 + 8] = tc[0];
            textCoords.array[index * 4 + 9] = tc[1];
            textCoords.array[index * 4 + 10] = tc[2];
            textCoords.array[index * 4 + 11] = tc[3];

            textCoords.array[index * 4 + 12] = tc[0];
            textCoords.array[index * 4 + 13] = tc[1];
            textCoords.array[index * 4 + 14] = tc[2];
            textCoords.array[index * 4 + 15] = tc[3];

            textCoords.array[index * 4 + 16] = tc[0];
            textCoords.array[index * 4 + 17] = tc[1];
            textCoords.array[index * 4 + 18] = tc[2];
            textCoords.array[index * 4 + 19] = tc[3];

            textCoords.array[index * 4 + 20] = tc[0];
            textCoords.array[index * 4 + 21] = tc[1];
            textCoords.array[index * 4 + 22] = tc[2];
            textCoords.array[index * 4 + 23] = tc[3];


            labelReferences.array[index * 2 + 0] = nodeLookup.texPos[0];
            labelReferences.array[index * 2 + 1] = nodeLookup.texPos[1];

            labelReferences.array[index * 2 + 2] = nodeLookup.texPos[0];
            labelReferences.array[index * 2 + 3] = nodeLookup.texPos[1];

            labelReferences.array[index * 2 + 4] = nodeLookup.texPos[0];
            labelReferences.array[index * 2 + 5] = nodeLookup.texPos[1];

            labelReferences.array[index * 2 + 6] = nodeLookup.texPos[0];
            labelReferences.array[index * 2 + 7] = nodeLookup.texPos[1];

            labelReferences.array[index * 2 + 8] = nodeLookup.texPos[0];
            labelReferences.array[index * 2 + 9] = nodeLookup.texPos[1];

            labelReferences.array[index * 2 + 10] = nodeLookup.texPos[0];
            labelReferences.array[index * 2 + 11] = nodeLookup.texPos[1];


            labelColors.array[index * 3 + 0] = nodeLookup.color[0];
            labelColors.array[index * 3 + 1] = nodeLookup.color[1];
            labelColors.array[index * 3 + 2] = nodeLookup.color[2];

            labelColors.array[index * 3 + 3] = nodeLookup.color[0];
            labelColors.array[index * 3 + 4] = nodeLookup.color[1];
            labelColors.array[index * 3 + 5] = nodeLookup.color[2];

            labelColors.array[index * 3 + 6] = nodeLookup.color[0];
            labelColors.array[index * 3 + 7] = nodeLookup.color[1];
            labelColors.array[index * 3 + 8] = nodeLookup.color[2];

            labelColors.array[index * 3 + 9] = nodeLookup.color[0];
            labelColors.array[index * 3 + 10] = nodeLookup.color[1];
            labelColors.array[index * 3 + 11] = nodeLookup.color[2];

            labelColors.array[index * 3 + 12] = nodeLookup.color[0];
            labelColors.array[index * 3 + 13] = nodeLookup.color[1];
            labelColors.array[index * 3 + 14] = nodeLookup.color[2];

            labelColors.array[index * 3 + 15] = nodeLookup.color[0];
            labelColors.array[index * 3 + 16] = nodeLookup.color[1];
            labelColors.array[index * 3 + 17] = nodeLookup.color[2];


            counter++;

        }

    });


    labelUniforms = {

        t_text: {type: "t", value: texture},
        positionTexture: {type: "t", value: null},
        nodeAttribTexture: {type: "t", value: null}

    };



    labelMaterial = new THREE.ShaderMaterial({

        uniforms: labelUniforms,
        vertexShader: shaders.vs.text,
        fragmentShader: shaders.fs.text,
        //blending: THREE.AdditiveBlending,
        depthTest: false,
        transparent: true

    });

    labelMesh = new THREE.Mesh(labelGeometry, labelMaterial);
    graphStructure.add(labelMesh);

}