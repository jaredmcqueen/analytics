// quick run through the nodes to count label characters
var charPolys = 0;
$.each(initial_data.nodes, function (key, value) {
    charPolys += key.length;
});

console.log('number of characters:', charPolys, '(' + charPolys * 2 + ' triangles)');

var lettersPerSide = 16;
var numberOfLabels = _.size(initial_data.edges);
var triangles = charPolys * 2;

var positions = new Float32Array(triangles * 3 * 3);
labelGeometry.addAttribute('position', new THREE.BufferAttribute(positions, 3));
var uvs = new Float32Array(triangles * 3 * 2);
labelGeometry.addAttribute('uv', new THREE.BufferAttribute(uvs, 2));
var startPositions = new Float32Array(triangles * 3 * 3);
labelGeometry.addAttribute('startPos', new THREE.BufferAttribute(startPositions, 3));
var labelPositions = new Float32Array(triangles * 3 * 3);
labelGeometry.addAttribute('labelPos', new THREE.BufferAttribute(labelPositions, 3));
var labelColors = new Float32Array(triangles * 3 * 3);
labelGeometry.addAttribute('labelColor', new THREE.BufferAttribute(labelColors, 3));
var labelOpacities = new Float32Array(triangles * 3 * 1);
labelGeometry.addAttribute('labelOpacity', new THREE.BufferAttribute(labelOpacities, 1));

var counter = 0;
var labelCounter = 0;
$.each(initial_data.nodes, function (k, v) {

    var nodePos = v.pos;
    var nodeColor = v.color;
    var nodeOpacity = v.opacity;
    var nodeSize = v.size;

    bufColor[counter * 3 + 0] = nodeColor.r;
    bufColor[counter * 3 + 1] = nodeColor.g;
    bufColor[counter * 3 + 2] = nodeColor.b;

    bufOpacity[counter] = nodeOpacity;
    bufSize[counter] = nodeSize;

    bufStart[counter * 3 + 0] = 0;
    bufStart[counter * 3 + 1] = 0;
    bufStart[counter * 3 + 2] = 0;

    bufPosition[counter * 3 + 0] = nodePos[0];
    bufPosition[counter * 3 + 1] = nodePos[1];
    bufPosition[counter * 3 + 2] = nodePos[2];

    counter++;


    // labels


    for (var i = 0; i < k.length; i++) {

        var code = k.charCodeAt(i);
        var cx = code % lettersPerSide;
        var cy = Math.floor(code / lettersPerSide);
        var labelSize = 10;
        var letterSpacing = labelSize * 0.5;
        var yOffset = labelSize * -0.5;
        var xOffset = labelSize * 1.5;


        // vertices, which just store character poly coords


        positions[labelCounter * 18 + 0] = i * letterSpacing + xOffset + (0.05 * labelSize);
        positions[labelCounter * 18 + 1] = yOffset + (0.05 * labelSize);
        positions[labelCounter * 18 + 2] = 0;
        positions[labelCounter * 18 + 3] = i * letterSpacing + xOffset + (1.05 * labelSize);
        positions[labelCounter * 18 + 4] = yOffset + (0.05 * labelSize);
        positions[labelCounter * 18 + 5] = 0;
        positions[labelCounter * 18 + 6] = i * letterSpacing + xOffset + (1.05 * labelSize);
        positions[labelCounter * 18 + 7] = yOffset + (1.05 * labelSize);
        positions[labelCounter * 18 + 8] = 0;
        positions[labelCounter * 18 + 9] = i * letterSpacing + xOffset + (0.05 * labelSize);
        positions[labelCounter * 18 + 10] = yOffset + (0.05 * labelSize);
        positions[labelCounter * 18 + 11] = 0;
        positions[labelCounter * 18 + 12] = i * letterSpacing + xOffset + (1.05 * labelSize);
        positions[labelCounter * 18 + 13] = yOffset + (1.05 * labelSize);
        positions[labelCounter * 18 + 14] = 0;
        positions[labelCounter * 18 + 15] = i * letterSpacing + xOffset + (0.05 * labelSize);
        positions[labelCounter * 18 + 16] = yOffset + (1.05 * labelSize);
        positions[labelCounter * 18 + 17] = 0;


        labelPositions[labelCounter * 18 + 0] = nodePos[0];
        labelPositions[labelCounter * 18 + 1] = nodePos[1];
        labelPositions[labelCounter * 18 + 2] = nodePos[2];
        labelPositions[labelCounter * 18 + 3] = nodePos[0];
        labelPositions[labelCounter * 18 + 4] = nodePos[1];
        labelPositions[labelCounter * 18 + 5] = nodePos[2];
        labelPositions[labelCounter * 18 + 6] = nodePos[0];
        labelPositions[labelCounter * 18 + 7] = nodePos[1];
        labelPositions[labelCounter * 18 + 8] = nodePos[2];
        labelPositions[labelCounter * 18 + 9] = nodePos[0];
        labelPositions[labelCounter * 18 + 10] = nodePos[1];
        labelPositions[labelCounter * 18 + 11] = nodePos[2];
        labelPositions[labelCounter * 18 + 12] = nodePos[0];
        labelPositions[labelCounter * 18 + 13] = nodePos[1];
        labelPositions[labelCounter * 18 + 14] = nodePos[2];
        labelPositions[labelCounter * 18 + 15] = nodePos[0];
        labelPositions[labelCounter * 18 + 16] = nodePos[1];
        labelPositions[labelCounter * 18 + 17] = nodePos[2];


        // start positions for tweening.  All zero for now


        startPositions[labelCounter * 18 + 0] = nodePos[0];
        startPositions[labelCounter * 18 + 1] = nodePos[1];
        startPositions[labelCounter * 18 + 2] = nodePos[2];
        startPositions[labelCounter * 18 + 3] = nodePos[0];
        startPositions[labelCounter * 18 + 4] = nodePos[1];
        startPositions[labelCounter * 18 + 5] = nodePos[2];
        startPositions[labelCounter * 18 + 6] = nodePos[0];
        startPositions[labelCounter * 18 + 7] = nodePos[1];
        startPositions[labelCounter * 18 + 8] = nodePos[2];
        startPositions[labelCounter * 18 + 9] = nodePos[0];
        startPositions[labelCounter * 18 + 10] = nodePos[1];
        startPositions[labelCounter * 18 + 11] = nodePos[2];
        startPositions[labelCounter * 18 + 12] = nodePos[0];
        startPositions[labelCounter * 18 + 13] = nodePos[1];
        startPositions[labelCounter * 18 + 14] = nodePos[2];
        startPositions[labelCounter * 18 + 15] = nodePos[0];
        startPositions[labelCounter * 18 + 16] = nodePos[1];
        startPositions[labelCounter * 18 + 17] = nodePos[2];


        // labelColors


        labelColors[labelCounter * 18 + 0] = nodeColor.r;
        labelColors[labelCounter * 18 + 1] = nodeColor.g;
        labelColors[labelCounter * 18 + 2] = nodeColor.b;
        labelColors[labelCounter * 18 + 3] = nodeColor.r;
        labelColors[labelCounter * 18 + 4] = nodeColor.g;
        labelColors[labelCounter * 18 + 5] = nodeColor.b;
        labelColors[labelCounter * 18 + 6] = nodeColor.r;
        labelColors[labelCounter * 18 + 7] = nodeColor.g;
        labelColors[labelCounter * 18 + 8] = nodeColor.b;
        labelColors[labelCounter * 18 + 9] = nodeColor.r;
        labelColors[labelCounter * 18 + 10] = nodeColor.g;
        labelColors[labelCounter * 18 + 11] = nodeColor.b;
        labelColors[labelCounter * 18 + 12] = nodeColor.r;
        labelColors[labelCounter * 18 + 13] = nodeColor.g;
        labelColors[labelCounter * 18 + 14] = nodeColor.b;
        labelColors[labelCounter * 18 + 15] = nodeColor.r;
        labelColors[labelCounter * 18 + 16] = nodeColor.g;
        labelColors[labelCounter * 18 + 17] = nodeColor.b;


        // labelOpacities


        labelOpacities[labelCounter * 6 + 0] = nodeOpacity;
        labelOpacities[labelCounter * 6 + 1] = nodeOpacity;
        labelOpacities[labelCounter * 6 + 2] = nodeOpacity;
        labelOpacities[labelCounter * 6 + 3] = nodeOpacity;
        labelOpacities[labelCounter * 6 + 4] = nodeOpacity;
        labelOpacities[labelCounter * 6 + 5] = nodeOpacity;


        // uv mapping


        var ox = (cx + 0.05) / lettersPerSide;
        var oy = (cy + 0.05) / lettersPerSide;
        var off = 0.9 / lettersPerSide;

        uvs[labelCounter * 12 + 0] = ox;
        uvs[labelCounter * 12 + 1] = oy + off;
        uvs[labelCounter * 12 + 2] = ox + off;
        uvs[labelCounter * 12 + 3] = oy + off;
        uvs[labelCounter * 12 + 4] = ox + off;
        uvs[labelCounter * 12 + 5] = oy;
        uvs[labelCounter * 12 + 6] = ox;
        uvs[labelCounter * 12 + 7] = oy + off;
        uvs[labelCounter * 12 + 8] = ox + off;
        uvs[labelCounter * 12 + 9] = oy;
        uvs[labelCounter * 12 + 10] = ox;
        uvs[labelCounter * 12 + 11] = oy;

        labelCounter++;

    }

});

// add node point cloud
var nodePointCloud = new THREE.PointCloud(nodeGeometry, nodeMaterial);
cluster.add(nodePointCloud);


// add label mesh, but make it invisible
var labelMesh = new THREE.Mesh(labelGeometry, labelMaterial);
labelMesh.visible = false;
cluster.add(labelMesh);