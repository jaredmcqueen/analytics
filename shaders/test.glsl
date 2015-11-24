precision highp float;
precision highp int;
#define SHADER_NAME ShaderMaterial
#define VERTEX_TEXTURES
#define GAMMA_FACTOR 2
#define MAX_DIR_LIGHTS 0
#define MAX_POINT_LIGHTS 0
#define MAX_SPOT_LIGHTS 0
#define MAX_HEMI_LIGHTS 0
#define MAX_SHADOWS 0
#define MAX_BONES 251
#define FLAT_SHADED
uniform mat4 modelMatrix;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat3 normalMatrix;
uniform vec3 cameraPosition;
attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;
#ifdef USE_COLOR
	attribute vec3 color;
#endif
#ifdef USE_MORPHTARGETS
	attribute vec3 morphTarget0;
	attribute vec3 morphTarget1;
	attribute vec3 morphTarget2;
	attribute vec3 morphTarget3;
	#ifdef USE_MORPHNORMALS
		attribute vec3 morphNormal0;
		attribute vec3 morphNormal1;
		attribute vec3 morphNormal2;
		attribute vec3 morphNormal3;
	#else
		attribute vec3 morphTarget4;
		attribute vec3 morphTarget5;
		attribute vec3 morphTarget6;
		attribute vec3 morphTarget7;
	#endif
#endif
#ifdef USE_SKINNING
	attribute vec4 skinIndex;
	attribute vec4 skinWeight;
#endif

attribute vec3 customColor;
attribute vec2 texPos;
attribute float isSelected;

uniform sampler2D positionTexture;

varying vec3 vColor;
varying vec2 vUv;

void main() {
    vUv = uv;

    vec4 node = texture2D( positionTexture, texPos);
    vec3 nodePosition = node.xyz;
//    float nodeSize = node.w;

    vColor = customColor;
    if (isSelected > 0.0) vColor = vec3(1.0, 0.5, 1.0);
    vec4 mvPosition = modelViewMatrix * vec4( nodePosition, 1.0 );
    gl_PointSize = 100.0 * ( 300.0 / length( mvPosition.xyz ) );

    gl_Position = projectionMatrix * mvPosition;

}