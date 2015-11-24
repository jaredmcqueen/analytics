uniform sampler2D t_text;

varying vec3 vColor;
varying float vOpacity;
varying vec4 vTextCoord;
varying vec2 vUv;

void main(){

  float x = vTextCoord.x;
  float y = vTextCoord.y;
  float w = vTextCoord.z;
  float h = vTextCoord.w;

  float xF = x + vUv.x * w;
  float yF = y + (1. - vUv.y) * h;
  vec2 sCoord =  vec2( xF , yF );

  vec4 diffuse = texture2D(t_text , sCoord);
  gl_FragColor = mix(diffuse, vec4(vColor, diffuse.a * vOpacity), 1.0);

}
