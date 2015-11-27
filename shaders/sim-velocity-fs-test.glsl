uniform float delta;
uniform float k;
uniform float temperature;
uniform sampler2D positions;
uniform sampler2D layoutPositions;
uniform sampler2D velocities;
uniform sampler2D edgeIndices;
uniform sampler2D edgeData;

const float nodesTexWidth = NODESWIDTH;
const float edgesTexWidth = EDGESWIDTH;

vec3 getNeighbor(float textureIndex){
    return texture2D(positions, vec2(((mod(textureIndex,nodesTexWidth)) / nodesTexWidth) , (floor(textureIndex / nodesTexWidth)) / nodesTexWidth)).xyz;
}


//fr(x) = (k*k)/x;
vec3 addRepulsion(vec3 self, vec3 neighbor){
    vec3 diff = self - neighbor;
    float x = length( diff );
    float f = ( k * k ) / x;
    return normalize(diff) * f * delta ;
}


//fa(x) = (x*x)/k;
vec3 addAttraction(vec3 self, vec3 neighbor){
    vec3 diff = self - neighbor;
    float x = length( diff );
    float f = ( x * x ) / k;
    return normalize(diff) * f * delta;
}


void main()	{

    vec2 uv = gl_FragCoord.xy / nodeRef.xy;
    vec4 selfPosition = texture2D( positions, uv );
    vec3 selfVelocity = texture2D( velocities, uv ).xyz;
    vec3 velocity = selfVelocity;


    if ( posLayout.x == 0 || posLayout.y == 0 || posLayout.z == 0 ) {

        // force-directed n-body simulation

        vec2 nodeRef = vec2(nodesTexWidth, nodesTexWidth);
        vec2 edgeRef = vec2(edgesTexWidth, edgesTexWidth);


        vec4 selfEdgeIndices = texture2D( edgeIndices, uv);

        vec3 nodePosition;
        vec4 compareNodePosition;


        if( selfPosition.w > 0.0 ){
            for(float y = 0.0; y < nodesTexWidth; y++){
                for(float x = 0.0; x < nodesTexWidth; x++){

                    vec2 ref = vec2(x + 0.5, y + 0.5 ) / nodeRef;
                    compareNodePosition = texture2D(positions,ref);

                    // note: double ifs work.  using continues do not work for all GPUs.

                    if (distance(compareNodePosition.xyz, selfPosition.xyz) > 0.001) {

                        if (compareNodePosition.w != -1.0) {

                            velocity += addRepulsion(selfPosition.xyz, compareNodePosition.xyz);

                        }

                    }

                }

            }

            float idx = selfEdgeIndices.x;
            float idy = selfEdgeIndices.y;
            float idz = selfEdgeIndices.z;
            float idw = selfEdgeIndices.w;

            float start = idx * 4.0 + idy;
            float end = idz * 4.0 + idw;


            if(! ( idx == idz && idy == idw ) ){

                float edgeIndex = 0.0;

                for(float y = 0.0; y < edgesTexWidth; y++){
                    for(float x = 0.0; x < edgesTexWidth; x++){

                        vec2 ref = vec2( x + 0.5 , y + 0.5 ) / edgeRef;
                        vec4 pixel = texture2D(edgeData, ref);

                        if (edgeIndex >= start && edgeIndex < end){
                            nodePosition = getNeighbor(pixel.x);
                            velocity -= addAttraction(selfPosition.xyz, nodePosition);
                        }
                        edgeIndex++;

                        if (edgeIndex >= start && edgeIndex < end){
                            nodePosition = getNeighbor(pixel.y);
                            velocity -= addAttraction(selfPosition.xyz, nodePosition);
                        }
                        edgeIndex++;

                        if (edgeIndex >= start && edgeIndex < end){
                            nodePosition = getNeighbor(pixel.z);
                            velocity -= addAttraction(selfPosition.xyz, nodePosition);
                        }
                        edgeIndex++;

                        if (edgeIndex >= start && edgeIndex < end){
                            nodePosition = getNeighbor(pixel.w);
                            velocity -= addAttraction(selfPosition.xyz, nodePosition);
                        }
                        edgeIndex++;

                    }

                }

            }

        }


        // temperature gradually cools down to zero

        velocity = normalize(velocity) * temperature;

    } else {

        // node needs to move towards destination.

        if ( selfPosition.w > 0.0 ) {

            compareNodePosition = posLayout;
            
            if (distance(compareNodePosition.xyz, selfPosition.xyz) > 0.001) {

                velocity += addAttraction(selfPosition.xyz, compareNodePosition.xyz);

            }

        }

    }

    // add friction
    velocity *= 0.25;

    gl_FragColor = vec4(velocity, 1.0);

}
