uniform sampler2D tMask;
uniform float uFalloff;
uniform float uAspect;
uniform vec2 uMouse;
uniform vec2 uDimensions;

varying vec2 vUV;

int size = 5;
float separation = 0.5;

void main() {
  // sample the texture
  vec4 color = texture2D(tMask, vUV);

  // dilate based on neighboring texels
  vec2 texelSize = vec2(1.0 / uDimensions.x, 1.0 / uDimensions.y);

  float maxR = color.r;
  float maxG = color.g;

  for (int i = -size; i <= size; ++i) {
    for (int j = -size; j <= size; ++j) {
      if (!(distance(vec2(i, j), vec2(0, 0)) <= float(size))) { continue; }

      // sample color 
      vec4 tex = texture2D(tMask, vUV.xy + vec2(i, j) * texelSize * separation);
      float r = tex.r;
      if ( r > maxR ) {
        maxR = r;
      }
    }
  }

  color.r = mix(color.r, maxR, 0.5);

  // add new input
  vec2 cursor = vUV - uMouse;
  cursor.x *= uAspect;
  float falloff = smoothstep(uFalloff, 0.0, length(cursor));

  // mix texture with new input
  color.rgb = mix(color.rgb, vec3(1.0, 1.0, 1.0), falloff);
  gl_FragColor = color;
}