attribute vec3 customColor;
attribute vec2 texPos;
attribute float pickingNode;
attribute float hover;
attribute float threat;

uniform sampler2D positionTexture;
uniform sampler2D nodeAttribTexture;
uniform float currentTime;

varying vec3 vColor;
varying float vOpacity;
varying float vPickingNode;
varying float vThreat;

void main() {

    float nodeSize = 150.0;

    vPickingNode = pickingNode;
    vColor = customColor;
    vThreat = threat;

    vec4 selfPosition = texture2D( positionTexture, texPos );
    vec4 selfAttrib = texture2D( nodeAttribTexture, texPos );


    if ( hover > 0.0 ){

        vOpacity = 1.0;

    }

    if ( hover < 0.0 ) {

        vOpacity = 0.0;

    }

    if ( hover < 1.0 || hover > 0.0){

        vOpacity = selfAttrib.y;

    }

    if ( threat > 0.0 ){

        nodeSize = sin(currentTime * 0.005) * 600.0;

        if ( nodeSize < 300.0){

            nodeSize = 300.0;

        }


    }


    vec4 mvPosition = modelViewMatrix * vec4( selfPosition.xyz, 1.0 );
    gl_PointSize = selfAttrib.x * ( nodeSize / length( mvPosition.xyz ) );

    gl_Position = projectionMatrix * mvPosition;

}