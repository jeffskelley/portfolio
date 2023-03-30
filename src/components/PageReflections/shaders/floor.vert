uniform mat4 textureMatrix;
uniform float time;
varying vec4 vUV;
varying vec2 vSurfaceUV;
#include <common>
#include <logdepthbuf_pars_vertex>


void main() {
  vUV = textureMatrix * vec4( position, 1.0 );
  vSurfaceUV = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  #include <logdepthbuf_vertex>
}