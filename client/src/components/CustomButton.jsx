import React from 'react'
import state from '../store'
import { useSnapshot } from 'valtio'
import { getContrastingColor } from '../config/helpers'

const CustomButton = ({ type, title, customStyles, handleClick }) => {
    console.log('CustomButton rendering');
    const snap = useSnapshot(state)

    const generateStyle = (type) => {
        if (type === 'filled') {
            return {
                backgroundColor: snap.color,
                color: getContrastingColor(snap.color)
            }
        }
    }

    return (
        <button 
            className={`px-6 py-3 text-base font-bold rounded-full shadow-md ${customStyles}`}
            style={generateStyle(type)}
            onClick={handleClick}
        >
            {title}
        </button>
    )
}

export default CustomButton
