uniform float delta;
uniform float bounds;
uniform sampler2D positions;
uniform sampler2D velocities;

const float nodesTexWidth = NODESWIDTH;

void main()	{

    vec2 nodeRef = vec2(nodesTexWidth, nodesTexWidth);
    vec2 uv = gl_FragCoord.xy / nodeRef.xy;

    vec4 selfPosition = texture2D( positions, uv );
    vec3 selfVelocity = texture2D( velocities, uv ).xyz;

    gl_FragColor = vec4( selfPosition.xyz + selfVelocity * delta * 50.0, selfPosition.w );
}