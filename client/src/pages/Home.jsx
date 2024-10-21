import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSnapshot } from 'valtio'
import state from '../store'
import { CustomButton } from '../components'
import {
    headContainerAnimation,
    headContentAnimation,
    headTextAnimation,
    slideAnimation
} from '../config/motion'

const Home = () => {
    const snap = useSnapshot(state);

    return (
        <AnimatePresence>
            {snap.intro && (
                <div className="home">
                    <motion.section {...slideAnimation('left')} className="flex items-center h-screen">
                        <motion.div className='home-content' {...headContainerAnimation}>
                            <motion.div {...headTextAnimation} className="mb-8">
                                <h1 className="text-6xl font-bold leading-tight">
                                    <span className="block text-gray-800">DESIGN YOUR</span>
                                    <span className="block text-8xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-gray-700 to-gray-500 hover:from-gray-800 hover:via-gray-600 hover:to-gray-400 transition-all duration-300 ease-in-out">
                                        4TH KIT
                                    </span>
                                </h1>
                            </motion.div>
                            <motion.div {...headContentAnimation} className='flex flex-col gap-5'>
                                <p className="max-w-md font-normal text-gray-600 text-base">
                                    Elevate your fandom to new heights! Join the ultimate fan experience by co-creating with your favorite teams. Use our cutting-edge 3D customization tool to craft a unique kit that showcases your passion and creativity. <strong>Be part of the game like never before!</strong>
                                </p>

                                <CustomButton 
                                    type="filled"
                                    title="Start Designing"
                                    handleClick={() => state.intro = false}
                                    customStyles="w-fit px-4 py-2.5 font-bold text-sm"
                                />
                            </motion.div>
                        </motion.div>
                    </motion.section>
                </div>
            )}
        </AnimatePresence>
    )
}

export default Home
