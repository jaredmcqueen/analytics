// t: current time, b: beginning value, c: change in value, d: duration
float easeInOutExpo (float t, float b, float c, float d) {
    if (t<=0.0) return b;
    if (t==d) return b+c;
    if ((t/=d/2.0) < 1.0) return c/2.0 * pow(2.0, 10.0 * (t - 1.0)) + b;
    return c/2.0 * (-pow(2.0, -10.0 * --t) + 2.0) + b;
}


// attributes
attribute vec3 startPos;
attribute vec3 labelPos;
attribute vec3 labelColor;
attribute float labelOpacity;


// uniforms
uniform float time;
uniform float duration;


// values that we pass to the fragment shader
varying vec3 vColor;
varying float vOpacity;
varying vec2 vUv;

void main() {

    // pass data to the fragment shader
    vUv = uv;  // normal
    vColor = labelColor;
    vOpacity = labelOpacity;

    vec3 b = startPos;
    vec3 c = labelPos - startPos;

    float calcPosx;
    float calcPosy;
    float calcPosz;

    float d = duration;
    float t = time;

    vec3 currentPosition = startPos;

    if (t > 0.0){
        if (t < d){
            calcPosx = easeInOutExpo(t, b.x, c.x, d);
            calcPosy = easeInOutExpo(t, b.y, c.y, d);
            calcPosz = easeInOutExpo(t, b.z, c.z, d);

            currentPosition = vec3(calcPosx, calcPosy, calcPosz);
        } else {
            currentPosition = labelPos;
        }
    }


    gl_Position = projectionMatrix *
                  (modelViewMatrix * vec4(currentPosition, 1) +
                   vec4(position.xy, 0, 0)
                   );

}