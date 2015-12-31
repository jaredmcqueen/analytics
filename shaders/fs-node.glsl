uniform sampler2D sprite;
uniform sampler2D threatSprite;

varying vec3 vColor;
varying float vOpacity;
varying float vPickingNode;
varying float vThreat;

void main() {

    vec4 node;
    vec3 nodeColor = vColor;

    if (vThreat > 0.0){
        // it needs crosshairs
        node = texture2D( threatSprite, vec2( gl_PointCoord.x, gl_PointCoord.y ));

    } else {
        // normal ciricle shape
        node = texture2D( sprite, vec2( gl_PointCoord.x, gl_PointCoord.y ));

    }

    if (vPickingNode > 0.0){


        gl_FragColor = node * vec4( nodeColor, vOpacity );


    } else {

        gl_FragColor = vec4( nodeColor, 1.0 );

    }

}