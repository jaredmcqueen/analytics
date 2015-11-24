attribute vec3 customColor;
attribute vec2 texPos;
attribute float pickingNode;

uniform sampler2D positionTexture;
uniform sampler2D nodeAttribTexture;

varying vec3 vColor;
varying float vOpacity;
varying float vPickingNode;

void main() {

    vPickingNode = pickingNode;
    vColor = customColor;

    vec4 selfPosition = texture2D( positionTexture, texPos );
    vec4 selfAttrib = texture2D( nodeAttribTexture, texPos );
    vOpacity = selfAttrib.y;

    vec4 mvPosition = modelViewMatrix * vec4( selfPosition.xyz, 1.0 );
    gl_PointSize = selfAttrib.x * ( 300.0 / length( mvPosition.xyz ) );

    gl_Position = projectionMatrix * mvPosition;

}