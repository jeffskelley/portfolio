varying vec2 vUV;
// varying vec3 vPosition;

uniform sampler2D tImage1;
uniform sampler2D tImage2;
uniform sampler2D tImage3;
uniform sampler2D tImage4;
uniform vec2 uWindowDimensions;
uniform vec2 uMouse;
uniform float uOffsetX1;
uniform float uOffsetX2;
uniform float uOffsetY1;
uniform float uOffsetY2;
uniform float uDistortion1;
uniform float uDistortion2;
// uniform float uTime;

uniform float uMouseAmt;
uniform float uFisheye;
uniform float uWidth;
uniform float uGutter;
uniform float uAlpha;
// uniform float uCycleLength;
// uniform float uSpeed;

vec2 brownConradyDistortion(in vec2 uv, in float k1, in float k2) {
  // distortion function from https://www.shadertoy.com/view/wtBXRz
  uv = uv * 2.0 - 1.0;	// brown conrady takes [-1:1]

  // positive values of K1 give barrel distortion, negative give pincushion
  float r2 = uv.x * uv.x + uv.y * uv.y;
  uv *= 1.0 + k1 * r2 + k2 * r2 * r2;

  // tangential distortion (due to off center lens elements)
  // is not modeled in this function, but if it was, the terms would go here

  uv = (uv * .5 + .5);	// restore -> [0:1]
  return uv;
}

vec4 getImage(in vec2 uv, in float index) {
  if(index == 0.) {
    return texture2D(tImage1, uv);
  } else if(index == 1.) {
    return texture2D(tImage2, uv);
  } else if(index == 2.) {
    return texture2D(tImage3, uv);
  }
  return texture2D(tImage4, uv);
}

void main() {
  float aspect = uWindowDimensions.y / uWindowDimensions.x;
  vec2 uv = vUV;

  uv = brownConradyDistortion(uv, uFisheye, 0.001 * sign(uFisheye)); // add distortion

  uv -= 0.5; // change uv range to -0.5 thru 0.5 so zooming by changing artwork size comes from the center

  uv.y *= aspect; // fix aspect ratio
  uv += uMouse * uMouseAmt; // add mouse offset
  uv *= uWindowDimensions.x / uWidth; // scale up

  // add offset to x rows
  uv.x += step(1., mod(uv.y, 2.0)) * uOffsetX1;
  uv.x += (1.0 - step(1., mod(uv.y, 2.0))) * uOffsetX2;

  // add offset to y rows
  uv.y += step(1., mod(uv.x, 2.0)) * uOffsetY1;
  uv.y += (1.0 - step(1., mod(uv.x, 2.0))) * uOffsetY2;

  // get index for image
  float index = 0.0;
  float xIndex = step(1., mod(uv.x, 2.0));
  float yIndex = step(1., mod(uv.y, 2.0));
  index += xIndex;
  index += yIndex * 2.0;

  uv = fract(uv); // repeat 0.0 - 1.0

  // row distortion
  uv.y = yIndex == 0.0 ? (uv.y - 0.5) * pow(100.0, uDistortion1) + 0.5 : (uv.y - 0.5) * pow(100.0, uDistortion2) + 0.5;
  uv = yIndex == 0.0 ? brownConradyDistortion(uv, uDistortion1, 0.01) : brownConradyDistortion(uv, uDistortion2, 0.01);

  // add gutters
  uv *= (1.0 + uGutter);
  uv -= uGutter * 0.5;

  // get image based on id
  vec4 color = getImage(uv, index);
  gl_FragColor = color;
  gl_FragColor.a = uAlpha;

  if(uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) {
    gl_FragColor.a = 0.0;
  }
}