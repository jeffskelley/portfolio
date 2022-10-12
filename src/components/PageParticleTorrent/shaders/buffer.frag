uniform vec2 uResolution;
uniform sampler2D tInitial;
uniform sampler2D tBuffer;

#pragma glslify: blendScreen = require(glsl-blend/screen)


void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;
  vec4 initial = texture2D(tInitial, uv);
  vec4 buffer = texture2D(tBuffer, uv);

  vec3 color = blendScreen(initial.rgb, buffer.rgb * 0.8);

  gl_FragColor = vec4(color, 1.0);
}