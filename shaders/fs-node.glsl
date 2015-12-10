uniform sampler2D sprite;

varying vec3 vColor;
varying float vOpacity;
varying float vPickingNode;

void main() {

    vec4 node;

    if (vPickingNode > 0.0){

        node = texture2D( sprite, vec2( gl_PointCoord.x, gl_PointCoord.y ));
        gl_FragColor = node * vec4( vColor, vOpacity );


    } else {

        gl_FragColor = vec4( vColor, 1.0 );

    }

}