attribute vec2 texPos;
attribute vec3 customColor;
attribute vec3 labelPositions;
attribute vec4 textCoord;

uniform sampler2D positionTexture;
uniform sampler2D nodeAttribTexture;

varying vec3 vColor;
varying float vOpacity;
varying vec4 vTextCoord;
varying vec2 vUv;


void main(){

    vColor = customColor;

    vec3 selfPosition = texture2D( positionTexture, texPos ).xyz;
    vec4 selfAttrib = texture2D( nodeAttribTexture, texPos );

    vOpacity = selfAttrib.y;
    vUv = uv;
    vTextCoord = textCoord;

    gl_Position = projectionMatrix *
                    (modelViewMatrix * vec4(selfPosition, 1) +
                        vec4(labelPositions.xy, 0, 0)
                    );

}
