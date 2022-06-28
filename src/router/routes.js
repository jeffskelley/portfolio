import Home from 'components/PageHome'
import SynthwaveOcean from 'components/PageSynthwaveOcean'
import FlowmapDistortion from 'components/PageFlowmapDistortion'
import DrawToReveal from 'components/PageDrawToReveal'

const routes = [
  { name: 'home', path: '/', component: Home },

  // 2d
  { name: 'flowmapDistortion', path: '/flowmap-distortion', component: FlowmapDistortion },
  { name: 'drawToReveal', path: '/draw-to-reveal', component: DrawToReveal },

  // 3d
  { name: 'synthwaveOcean', path: '/synthwave-ocean', component: SynthwaveOcean },
]

export default routes
