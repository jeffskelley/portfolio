import Home from 'components/PageHome'
import SynthwaveOcean from 'components/PageSynthwaveOcean'
import FlowmapDistortion from 'components/PageFlowmapDistortion'

const routes = [
  { name: 'home', path: '/', component: Home },

  // 2d
  { name: 'flowmapDistortion', path: '/flowmap-distortion', component: FlowmapDistortion },

  // 3d
  { name: 'synthwaveOcean', path: '/synthwave-ocean', component: SynthwaveOcean },
]

export default routes
