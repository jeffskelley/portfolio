varying vec2 vUV;
uniform sampler2D tPositionVelocity;

void main() {
  vec4 color = texture2D(tPositionVelocity, vUV);
  gl_FragColor = vec4(color);
}