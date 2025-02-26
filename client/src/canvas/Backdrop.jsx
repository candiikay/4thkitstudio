import React, {useRef, Suspense} from 'react'
import { easing } from 'maath'
import { useFrame } from '@react-three/fiber'
import { AccumulativeShadows, RandomizedLight } from '@react-three/drei'

const Backdrop = () => {
  const shadows = useRef()

  return (
    <Suspense fallback={null}>
      <AccumulativeShadows
        ref={shadows}
        temporal
        frames={60}
        alphaTest={0.2} //shadow strength
        scale={10}
        rotation={[Math.PI/2, 0, 0]}
        position={[0, 0, -0.14]}
      >
        <RandomizedLight
          amount={4}
          radius={9}
          intensity={0.5}
          ambient={0.4}
          position={[3.5,5,-6]}
        />
        <RandomizedLight
          amount={4}
          radius={5}
          intensity={0.25}
          ambient={0.55}
          position={[-4,5,-9]}
        />
      </AccumulativeShadows>
    </Suspense>
  )
}

export default Backdrop
