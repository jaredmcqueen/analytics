attribute vec2 texPos;
attribute vec3 customColor;

uniform sampler2D positionTexture;
uniform sampler2D nodeAttribTexture;

varying vec3 vColor;
varying float vOpacity;

void main() {

    vColor = customColor;

    vec3 nodePosition = texture2D( positionTexture, texPos ).xyz;
    vec4 selfAttrib = texture2D( nodeAttribTexture, texPos );
    vOpacity = selfAttrib.y;

    vec4 mvPosition = modelViewMatrix * vec4( nodePosition, 1.0 );
    gl_Position = projectionMatrix * mvPosition;

}
