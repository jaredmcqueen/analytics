uniform sampler2D texture;

const float nodesTexWidth = NODESWIDTH;

 void main(){
    vec2 nodeRef = vec2(nodesTexWidth, nodesTexWidth);
    vec2 uv = gl_FragCoord.xy / nodeRef.xy;

    vec4 color = texture2D( texture, uv );
    gl_FragColor = color;
 }