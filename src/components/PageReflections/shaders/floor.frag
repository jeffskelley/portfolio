uniform vec3 color;
uniform sampler2D tDiffuse;
uniform vec3 tint;
uniform float tintAlpha;
uniform float time;

varying vec4 vUV;
varying vec2 vSurfaceUV;

#include <logdepthbuf_pars_fragment>
float blendOverlay( float base, float blend ) {
  return( base < 0.5 ? ( 2.0 * base * blend ) : ( 1.0 - 2.0 * ( 1.0 - base ) * ( 1.0 - blend ) ) );
}
vec3 blendOverlay( vec3 base, vec3 blend ) {
  return vec3( blendOverlay( base.r, blend.r ), blendOverlay( base.g, blend.g ), blendOverlay( base.b, blend.b ) );
}
void main() {
  #include <logdepthbuf_fragment>

  vec2 uv = vSurfaceUV;
  
  float dist = distance(uv.xy, vec2(0.5, 0.5));
  float r = dist * 100.0;
  float ripple = sin(r - time * 0.01) / r;
  float xCardinality = round(uv.x) * 2.0 - 1.0;
  float yCardinality = round(uv.y) * 2.0 - 1.0;

  vec4 base = texture2DProj(tDiffuse, vUV + vec4(ripple, ripple, 0.0, 0.0));
  vec3 reflection = blendOverlay(base.rgb, color);
  vec3 tintedReflection = mix(reflection, tint, tintAlpha);
  gl_FragColor = vec4(tintedReflection, 1.0);

  // gl_FragColor = vec4(vec3(ripple), 1.0);

  #include <tonemapping_fragment>
  #include <encodings_fragment>
}