varying vec2 vUV;
#pragma glslify: blendDifference = require(glsl-blend/difference)

const float thickness = 0.001;
const float middle = 0.4965;

void main() {
  float outer = smoothstep(middle + thickness, middle, distance(vUV.xy, vec2(0.5, 0.5)));
  float inner = smoothstep(middle - thickness, middle, distance(vUV.xy, vec2(0.5, 0.5)));
  float alpha = outer * inner;
  gl_FragColor.rgb = vec3(1.0);
  gl_FragColor.a = alpha * 0.5;
}