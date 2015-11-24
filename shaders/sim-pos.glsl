  uniform vec2 resolution;
    uniform float delta;
    uniform float textureWidth;

    //uniforms for force calculations
    uniform float repulsionC;
    uniform float repulsionN;
    uniform float attractionC;
    uniform float attractionN;
    uniform float friction;
    uniform float gravity;

    //TODO ADD FRICTION
    //TODO ADD A GRAVITY FACTOR THAT PULLS EVERYTHING TO ORIGIN
    //https://vimeo.com/29458354

    uniform sampler2D positions;
    uniform sampler2D edgeIndices;
    uniform sampler2D edges;

    const float k = 79.05694150420949;

    //we set this text in javascript based on the size of the textureWidth

    //sete this text in javascript as well based on the size of the edge texture width(may be smaller)
    const float nodesTexWidth = NODESWIDTH;
    const float edgesTexWidth = EDGESWIDTH;

    vec3 getNeighbor(float textureIndex){
        return texture2D(positions, vec2(((mod(textureIndex,nodesTexWidth)) / nodesTexWidth),(floor(textureIndex / nodesTexWidth)) / nodesTexWidth)).xyz;
    }

    vec3 getAttractiveForce(vec4 neighbor, vec4 curr){
        float distanceToNeighbor =  max(0.0,((attractionC * log(distance(curr,neighbor) / attractionN)) - friction));
        vec3 angleToNeighbor = normalize((curr - neighbor).xyz);
        return angleToNeighbor * distanceToNeighbor;
    }

    vec3 getRepulsiveForce(vec4 currentNode,vec4 compareNode){
        float nodeDelta = max(0.0,((repulsionC / pow(distance(compareNode,currentNode),repulsionN))) - friction);
        vec3 nodeAngle = normalize((currentNode - compareNode).xyz);
        return nodeAngle * nodeDelta;
    }

    //fr(x) = (k*k)/x;
    vec3 addRepulsion(vec3 self, vec3 neighbor){
        vec3 diff = self - neighbor;
        float x = length( diff );
        float f = ( k * k ) / x;
        return normalize(diff) * f;
    }

    //fa(x) = (x*x)/k;
    vec3 addAttraction(vec3 self, vec3 neighbor){
        vec3 diff = self - neighbor;
        float x = length( diff );
        float f = ( x * x ) / k;
        return normalize(diff) * f;
    }

    void main()	{

        //get the position of this node in the "main" textures
        vec2 mainTextureCoord = gl_FragCoord.xy / resolution.xy;

        //get the positions of this node (in space) from the texture
        vec4 currentNodePosition = texture2D(positions, mainTextureCoord);

        //the deltas for this node

        vec4 nodeDiff = vec4(0.);
        vec3 nodePosition;


        vec2 nodeRef = vec2(nodesTexWidth, nodesTexWidth);
        vec2 edgeRef = vec2(edgesTexWidth, edgesTexWidth);
        vec2 uv = gl_FragCoord.xy / nodeRef.xy;


        //TODO not happy about this big if statement
        if(!(currentNodePosition.x == -1.0 && currentNodePosition.y == -1.0 && currentNodePosition.z == -1.0 && currentNodePosition.w == -1.0)){

            //compare against every other node
            for(float y = 0.0; y < nodesTexWidth; y++){
                for(float x = 0.0; x < nodesTexWidth; x++){

                    //get the node we're comparing againsts position
                    vec2 ref = vec2(x + 0.5, y + 0.5) / vec2(nodesTexWidth,nodesTexWidth);
                    vec4 compareNodePosition = texture2D(positions,ref);

                    //this is an empty / unused node in the texture
                    if(currentNodePosition.x == -1.0 && currentNodePosition.y == -1.0 && currentNodePosition.z == -1.0 && currentNodePosition.w == -1.0){
                        continue;
                    }

                    //TODO not happy with this either, why doesn't checking against currentX and currentZ work?
                    if(compareNodePosition == currentNodePosition){
                        continue;
                    }

                    if (uv.x == x && uv.y == y) continue;

                    //compute forces

                    nodeDiff.xyz += addRepulsion(currentNodePosition.xyz,compareNodePosition.xyz);

                }
            }

            //get the indices of the nodes connected to this node in the "edges" texture
            vec4 selfEdgeIndices = texture2D(edgeIndices, uv);
            float idx = selfEdgeIndices.x;
            float idz = selfEdgeIndices.z;
            float idy = selfEdgeIndices.y;
            float idw = selfEdgeIndices.w;


            if(!(idx == idz && idy == idw)){

                //keep track of which edge we're on
                float edgeIndex = 0.0;
                //loop through the edge tex
//                for(float currentY  = 0.0; currentY < 1.0; currentY += edgeTexDelta){
//                    for(float currentX = 0.0; currentX < 1.0; currentX += edgeTexDelta){

                    for(float y = 0.0; y < edgesTexWidth; y++){
                        for(float x = 0.0; x < edgesTexWidth; x++){
                        //we're in bounds, check individual tex coords
                        if(edgeIndex >= idx && edgeIndex <= idz){

                            vec2 ref = vec2( x + 0.5 , y + 0.5 ) / vec2(edgesTexWidth,edgesTexWidth);
                            vec4 possibleNeighbors = texture2D(edges,ref);

                        //check to see if we're in the right cell

                            //check x component
                            if((edgeIndex > idx && idw > 0.0) ||
                                (edgeIndex == idx && idy <= 0.0 && (idw > 0.0  || idz > idx))){
                                nodePosition = getNeighbor(possibleNeighbors.x);
                                nodeDiff.xyz -= addAttraction(currentNodePosition.xyz, nodePosition);
                                //nodeDiff.xyz -= getRepulsiveForce(currentNodePosition,neighbor);
                            }

                            //check y component
                            if((edgeIndex > idx && idw > 1.0) ||
                                (edgeIndex == idx && idy <= 1.0 && (idw > 1.0  || idz > idx))){
                                nodePosition = getNeighbor(possibleNeighbors.y);
                                nodeDiff.xyz -= addAttraction(currentNodePosition.xyz, nodePosition);
                                //nodeDiff.xyz -= getRepulsiveForce(currentNodePosition,neighbor);
                            }

                            //check z component
                            if((edgeIndex > idx && idw > 2.0) ||
                                (edgeIndex == idx && idy <= 2.0 && (idw > 2.0  || idz > idx))){
                                nodePosition = getNeighbor(possibleNeighbors.z);
                                nodeDiff.xyz -= addAttraction(currentNodePosition.xyz, nodePosition);
                                //nodeDiff.xyz -= getRepulsiveForce(currentNodePosition,neighbor);
                            }

                            //check w component
                            if((edgeIndex > idx && idw > 3.0) ||
                                (edgeIndex == idx && idy <= 3.0 && (idw > 3.0 || idz > idx))){
                                nodePosition = getNeighbor(possibleNeighbors.w);
                                nodeDiff.xyz -= addAttraction(currentNodePosition.xyz, nodePosition);
                                //nodeDiff.xyz -= getRepulsiveForce(currentNodePosition,neighbor);
                            }

                        }

                        //increment the edge so we know where we are
                        edgeIndex += 1.0;
                    }//edge tex loop
                }//edge tex loop
            }//if there are edges going to this node

        }//if this isn't an empty node

        //calculate gravity
        //nodeDiff.xyz -= currentNodePosition.xyz * gravity;

        vec3 finalPos = currentNodePosition.xyz + normalize(nodeDiff.xyz) * 5.0;

        gl_FragColor = vec4(finalPos, 0.0 );




    }