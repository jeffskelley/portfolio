#pragma glslify: roundedBox2D = require(../../../glsl/utils/roundedBox2D.glsl)
#pragma glslify: brownConradyDistortion = require(../../../glsl/utils/brownConradyDistortion.glsl)

precision highp float;

varying vec2 vUV;

uniform sampler2D tImage1;
uniform sampler2D tImage2;
uniform sampler2D tImage3;
uniform sampler2D tImage4;
uniform sampler2D tImage5;
uniform sampler2D tImage6;
uniform sampler2D tImage7;
uniform sampler2D tImage8;
uniform sampler2D tImage9;
uniform vec2 uMouse;
uniform float uPreDistortionOffsetX;
uniform float uPreDistortionOffsetY;
uniform float uOffsetX;
uniform float uOffsetY1;
uniform float uOffsetY2;
uniform float uDistortion1;
uniform float uDistortion2;
uniform float uDistortion3;

uniform float uMouseAmt;
uniform float uScroll;
uniform float uScrollAmt;
uniform float uFisheye;
uniform float uFisheye2;
uniform float uWidth;
uniform float uGutter;
uniform float uAlpha;

float isIndex(float index, float value) {
  // returns 1.0 if index === value, otherwise returns 0.0
  return step(index, value) * step(index * -1., value * -1.);
}

vec4 getImage(in vec2 uv, in float index) {
  vec4 image = vec4(0.0, 0.0, 0.0, 0.0);
  image += isIndex(0.0, index) * texture2D(tImage1, uv);
  image += isIndex(1.0, index) * texture2D(tImage2, uv);
  image += isIndex(2.0, index) * texture2D(tImage3, uv);
  image += isIndex(3.0, index) * texture2D(tImage4, uv);
  image += isIndex(4.0, index) * texture2D(tImage5, uv);
  image += isIndex(5.0, index) * texture2D(tImage6, uv);
  image += isIndex(6.0, index) * texture2D(tImage7, uv);
  image += isIndex(7.0, index) * texture2D(tImage8, uv);
  image += isIndex(8.0, index) * texture2D(tImage9, uv);
  return image;
}

void main() {
  // float aspect = uAspect;
  vec2 uv = vUV;
  uv += vec2(uPreDistortionOffsetX, uPreDistortionOffsetY);
  uv = brownConradyDistortion(uv, uFisheye, uFisheye2); // add distortion

  uv -= 0.5; // change uv range to -0.5 thru 0.5 so zooming by changing artwork size comes from the center
  uv += uMouse * uMouseAmt; // add mouse offset
  uv /= uWidth; // scale up

  // add total x offset
  uv.x += uOffsetX;
  // add offset to cols
  uv.y += step(1., mod(uv.x, 2.0)) * (uOffsetY1 + uScroll * uScrollAmt);
  uv.y += (1.0 - step(1., mod(uv.x, 2.0))) * (uOffsetY2 - uScroll * uScrollAmt);

  // get index for image
  float index = 0.0;
  float xIndex = floor(mod(uv.x, 3.0));
  float yIndex = floor(mod(uv.y, 3.0));
  index += xIndex;
  index += yIndex * 3.0;

  uv = fract(uv); // repeat 0.0 - 1.0

  // per-column distortion
  vec2 col1uv = uv;
  col1uv.y = (uv.y - 0.5) * pow(20.0, uDistortion1) + 0.5;
  col1uv = brownConradyDistortion(col1uv, uDistortion1, 0.01);
  vec2 col1uvDiff = col1uv - uv;

  vec2 col2uv = uv;
  col2uv.y = (uv.y - 0.5) * pow(20.0, uDistortion2) + 0.5;
  col2uv = brownConradyDistortion(col2uv, uDistortion2, 0.01);
  vec2 col2uvDiff = col2uv - uv;

  vec2 col3uv = uv;
  col3uv.y = (uv.y - 0.5) * pow(20.0, uDistortion3) + 0.5;
  col3uv = brownConradyDistortion(col3uv, uDistortion3, 0.01);
  vec2 col3uvDiff = col3uv - uv;

  uv = uv + isIndex(xIndex, 0.0) * col1uvDiff;
  uv = uv + isIndex(xIndex, 1.0) * col2uvDiff;
  uv = uv + isIndex(xIndex, 2.0) * col3uvDiff;
  
  // add gutters
  uv *= (1.0 + uGutter);
  uv -= uGutter * 0.5;

  // get image based on id
  vec4 color = getImage(uv, index);
  gl_FragColor = color;
  gl_FragColor.a = roundedBox2D(uv, 0.01) * uAlpha;
}
