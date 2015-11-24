uniform sampler2D map;

varying vec3 vColor;
varying float vOpacity;
varying vec2 vUv;

void main() {

    vec4 diffuse = texture2D(map, vUv);
    gl_FragColor = mix(diffuse, vec4(vColor, diffuse.a), vOpacity);
    //gl_FragColor = vec4(vColor, 1.0);
}