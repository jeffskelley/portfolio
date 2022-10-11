import { createStore } from 'vuex'

const projectRoot = 'https://github.com/jeffskelley/portfolio/blob/master/src/'

let id = 0
function uniqueId(prefix) {
  return `${prefix}${id++}`
}

const store = createStore({
  state() {
    return {
      projects: [
        {
          id: uniqueId('project-'),
          route: { name: 'albumGrid' },
          title: 'Fisheye Album Art Grid',
          tech: ['WebGL', 'GLSL', 'Three.JS', 'GSAP'],
          github: `${projectRoot}/components/PageAlbumGrid`,
        },
        {
          id: uniqueId('project-'),
          route: { name: 'liquidText' },
          title: 'Liquid Text',
          tech: ['WebGL', 'GLSL', 'Three.JS', 'FBOs'],
          github: `${projectRoot}/components/PageLiquidText`,
        },
        {
          id: uniqueId('project-'),
          route: { name: 'drawToReveal' },
          title: 'Draw to Reveal',
          tech: ['WebGL', 'GLSL', 'Three.JS', 'FBOs'],
          github: `${projectRoot}/components/PageDrawToReveal`,
        },
        {
          id: uniqueId('project-'),
          route: { name: 'synthwaveOcean' },
          title: 'Synthwave Ocean',
          tech: ['WebGL', 'GLSL', 'Three.JS'],
          github: `${projectRoot}/components/PageSynthwaveOcean`,
        },
        {
          id: uniqueId('project-'),
          route: { name: 'dripMask' },
          title: 'SVG Drip Mask',
          tech: ['SVG', 'GSAP', 'Canvas'],
          github: `${projectRoot}/components/PageDripMask`,
        },
      ],
    }
  },
})

export default store
