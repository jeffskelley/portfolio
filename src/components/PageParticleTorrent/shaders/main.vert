varying vec2 vUV;

uniform float uTime;

#pragma glslify: snoise2 = require(glsl-noise/simplex/3d)

#define NUM_OCTAVES 4
float fbm (in vec3 stu) {
    float value = 0.0;
    float alpha = 0.5;
    
    for (int i = 0; i < NUM_OCTAVES; ++i) {
        value += alpha * snoise2(stu);
        alpha *= 0.5;
    }
    return value;
}

const float timeAmplitude = 0.0015;
const float displacementAmplitude = 0.5;
const float displacementPeriod = 2.0;

void main() {
  vUV = uv;
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  float distanceFromCenter = smoothstep(0.0, 0.5, distance(uv, vec2(0.5, 0.5)));
  vec2 displacement = vec2(
    fbm(vec3(mvPosition.xy * displacementPeriod, uTime * timeAmplitude)),
    fbm(vec3(mvPosition.xy * displacementPeriod + 100.0, uTime * timeAmplitude))
  );
  displacement *= displacementAmplitude;
  displacement *= 1.0 - distanceFromCenter;
  vec4 newMvPosition = vec4(mvPosition.xy + displacement, mvPosition.z, mvPosition.w);
  gl_Position = projectionMatrix * newMvPosition;
  gl_PointSize = 1.;
}