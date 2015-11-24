uniform float delta;
uniform float minTime;
uniform float maxTime;

uniform sampler2D nodeAttrib;
uniform sampler2D epochsIndices;
uniform sampler2D epochsData;

const float nodesTexWidth = NODESWIDTH;
const float epochsTexWidth = EPOCHSWIDTH;

float inBetweenTimes(float epochTime){
    float increase = 0.0;
    if (epochTime >= minTime && epochTime <= maxTime){
        increase = 1.0;
    }
    return increase;
}

void main()	{

    vec2 nodeRef = vec2(nodesTexWidth, nodesTexWidth);
    vec2 epochsRef = vec2(epochsTexWidth, epochsTexWidth);
    vec2 uv = gl_FragCoord.xy / nodeRef.xy;

    vec4 selfEpochsIndices = texture2D( epochsIndices, uv);
    vec4 selfAttrib = texture2D( nodeAttrib, uv );  // just using x and y right now

    float idx = selfEpochsIndices.x;
    float idy = selfEpochsIndices.y;
    float idz = selfEpochsIndices.z;
    float idw = selfEpochsIndices.w;

    float start = idx * 4.0 + idy;
    float end = idz * 4.0 + idw;

    float testPixel = 0.0;

    if(! ( idx == idz && idy == idw ) ){

        float edgeIndex = 0.0;

        for(float y = 0.0; y < epochsTexWidth; y++){
            for(float x = 0.0; x < epochsTexWidth; x++){

                vec2 ref = vec2( x + 0.5 , y + 0.5 ) / epochsRef;
                vec4 pixel = texture2D(epochsData, ref);

                if (edgeIndex >= start && edgeIndex < end){
                    testPixel += inBetweenTimes(pixel.x);
                }
                edgeIndex++;

                if (edgeIndex >= start && edgeIndex < end){
                    testPixel += inBetweenTimes(pixel.y);
                }
                edgeIndex++;

                if (edgeIndex >= start && edgeIndex < end){
                    testPixel += inBetweenTimes(pixel.z);
                }
                edgeIndex++;

                if (edgeIndex >= start && edgeIndex < end){
                    testPixel += inBetweenTimes(pixel.w);
                }
                edgeIndex++;

            }
        }

    }

    if (testPixel > 0.0){

        selfAttrib.x = 600.0;
        selfAttrib.y = 0.8;

    } else {

        if ( selfAttrib.x > 200.0){

            selfAttrib.x -= 4000.0 * delta;

        }

        if ( selfAttrib.y > 0.3){

            selfAttrib.y -= delta * 1.5;

        }




    }

    gl_FragColor = vec4( selfAttrib.xy, 0,0 );
}