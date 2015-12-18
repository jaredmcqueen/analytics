uniform float delta;            // requestAnimationFrame delta
uniform float minTime;          // epoch min
uniform float maxTime;          // epoch max
uniform float selectedNode;     // selectedNode
uniform float hoverMode;     // selectedNode

uniform sampler2D nodeAttrib;       // current self attrib values
uniform sampler2D epochsIndices;    // for epoch detection
uniform sampler2D epochsData;       // for epoch detection
uniform sampler2D edgeIndices;      // for neighbor highlighting
uniform sampler2D edgeData;         // for neighbor highlighting
uniform sampler2D nodeIDMappings;   // for selected node

const float nodesTexWidth = NODESWIDTH;     // will be the same for epoch and neighbors
const float epochsTexWidth = EPOCHSWIDTH;   // epoch data
const float edgesTexWidth = EDGESWIDTH;     // neighbor data


float inBetweenTimes(float epochTime){
    float increase = 0.0;
    if (epochTime >= minTime && epochTime <= maxTime){
        increase = 1.0;
    }
    return increase;
}

float hasSelectedNeighbor(float neighbor){
    float counter = 0.0;
    if ( neighbor == selectedNode){
        counter = 1.0;
    }
    return counter;
}


vec3 getNeighbor(float textureIndex){
    return texture2D(nodeAttrib, vec2(((mod(textureIndex,nodesTexWidth)) / nodesTexWidth) , (floor(textureIndex / nodesTexWidth)) / nodesTexWidth)).xyz;
}


void main()	{

    vec2 nodeRef = vec2(nodesTexWidth, nodesTexWidth);
    vec2 epochsRef = vec2(epochsTexWidth, epochsTexWidth);
    vec2 uv = gl_FragCoord.xy / nodeRef.xy;

    vec4 selfAttrib = texture2D( nodeAttrib, uv );  // just using x and y right now


    // epoch time lookups

    vec4 selfEpochsIndices = texture2D( epochsIndices, uv);

    float idx = selfEpochsIndices.x;
    float idy = selfEpochsIndices.y;
    float idz = selfEpochsIndices.z;
    float idw = selfEpochsIndices.w;

    float start = idx * 4.0 + idy;
    float end = idz * 4.0 + idw;

    float epochPixel = 0.0;
    float neighborPixel = 0.0;
    float selfPixel = texture2D( nodeIDMappings, uv ).x;

    if (selfPixel == selectedNode) {

        selfPixel = 1.0;

    } else {

        selfPixel = 0.0;

    }




    if(! ( idx == idz && idy == idw ) ){

        float edgeIndex = 0.0;

        for(float y = 0.0; y < epochsTexWidth; y++){
            for(float x = 0.0; x < epochsTexWidth; x++){

                vec2 ref = vec2( x + 0.5 , y + 0.5 ) / epochsRef;
                vec4 pixel = texture2D(epochsData, ref);

                if (edgeIndex >= start && edgeIndex < end){
                    epochPixel += inBetweenTimes(pixel.x);
                }
                edgeIndex++;

                if (edgeIndex >= start && edgeIndex < end){
                    epochPixel += inBetweenTimes(pixel.y);
                }
                edgeIndex++;

                if (edgeIndex >= start && edgeIndex < end){
                    epochPixel += inBetweenTimes(pixel.z);
                }
                edgeIndex++;

                if (edgeIndex >= start && edgeIndex < end){
                    epochPixel += inBetweenTimes(pixel.w);
                }
                edgeIndex++;

            }
        }

    }


    //  neighbor highlighting

    if (selectedNode >= 0.0 ){

        vec4 selfEdgeIndices = texture2D( edgeIndices, uv);

        idx = selfEdgeIndices.x;
        idy = selfEdgeIndices.y;
        idz = selfEdgeIndices.z;
        idw = selfEdgeIndices.w;

        start = idx * 4.0 + idy;
        end = idz * 4.0 + idw;

        if(! ( idx == idz && idy == idw ) ){

            float edgeIndex = 0.0;
            vec2 edgeRef = vec2(edgesTexWidth, edgesTexWidth);

            for(float y = 0.0; y < edgesTexWidth; y++){
                for(float x = 0.0; x < edgesTexWidth; x++){

                    vec2 ref = vec2( x + 0.5 , y + 0.5 ) / edgeRef;
                    vec4 pixel = texture2D(edgeData, ref);

                    if (edgeIndex >= start && edgeIndex < end){
                        neighborPixel += hasSelectedNeighbor( pixel.x );
                    }
                    edgeIndex++;

                    if (edgeIndex >= start && edgeIndex < end){
                        neighborPixel += hasSelectedNeighbor( pixel.y );
                    }
                    edgeIndex++;

                    if (edgeIndex >= start && edgeIndex < end){
                        neighborPixel += hasSelectedNeighbor( pixel.z );
                    }
                    edgeIndex++;

                    if (edgeIndex >= start && edgeIndex < end){
                        neighborPixel += hasSelectedNeighbor( pixel.w );
                    }
                    edgeIndex++;

                }

            }

        }

    }

    if ( hoverMode > 0.0 ) {

        // we are in hover mode

        // start the entire scene slightly
        if ( selfAttrib.y > 0.2){

            selfAttrib.y -= delta * 2.5;

        }

        if ( selfAttrib.y < 0.2){

            selfAttrib.y += delta * 2.5;

        }

        // start the entire scene small
        if ( selfAttrib.x > 200.0){

            selfAttrib.x -= 4000.0 * delta;

        }

        // if you are hovering over a real node
        if ( selectedNode >= 0.0 ){

            // if you are a node or a neighbor
            if ( neighborPixel > 0.0 || selfPixel > 0.0){

                selfAttrib.y = 0.8; // light up *only* self or neighbors

                if ( epochPixel > 0.0){

                    selfAttrib.x = 600.0;   // make bigger immediately
                    selfAttrib.y = 1.0;     // light up

                }

            }

        } else {

            if ( epochPixel > 0.0){

                selfAttrib.x = 600.0;   // make bigger immediately
                selfAttrib.y = 0.8;     // light up

            }

        }

    } else {

        // i have selected a node
        // completely black out the rest of the scene
        if ( selfAttrib.y > 0.0){

            selfAttrib.y -= delta * 2.5;

        }

        if ( selfAttrib.x > 200.0){

            selfAttrib.x -= 4000.0 * delta;

        }

        if ( selectedNode >= 0.0 ){

            // if you are a node or a neighbor
            if ( neighborPixel > 0.0 || selfPixel > 0.0){

                selfAttrib.y = 0.3; // light up *only* self or neighbors

                if ( epochPixel > 0.0){

                    selfAttrib.x = 600.0;   // make bigger immediately
                    selfAttrib.y = 1.0;     // light up

                }

            }

        }

    }

    gl_FragColor = vec4( selfAttrib.xy, 0,0 );
}