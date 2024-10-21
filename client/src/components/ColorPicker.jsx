import React, { useState, useCallback, useMemo } from 'react'
//SketchPicker is the color picker
import {SketchPicker} from 'react-color'
//useSnapshot is the snapshot of the state
import { useSnapshot } from 'valtio'
//state is the state of the app
import state from '../store'

// Higher-Order Component to suppress defaultProps warnings
const suppressWarnings = (WrappedComponent) => {
  return React.forwardRef((props, ref) => {
    const SuppressionWrapper = useMemo(() => {
      return class extends React.Component {
        render() {
          return <WrappedComponent {...this.props} ref={ref} />;
        }
      };
    }, []);

    return <SuppressionWrapper {...props} />;
  });
};

// Wrap SketchPicker with the HOC
const WarningFreePicker = suppressWarnings(SketchPicker);

//ColorPicker is the color picker
const ColorPicker = () => {
  const snap = useSnapshot(state)
  const [colorHistory, setColorHistory] = useState([])

  const presetColors = [
    '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF',
    '#FFA500', '#800080', '#008000', '#000080', '#800000', '#008080'
  ]

  const handleChangeComplete = useCallback((color) => {
    state.color = color.hex
    addToHistory(color.hex)
  }, [])

  const addToHistory = useCallback((newColor) => {
    setColorHistory(prevHistory => {
      const updatedHistory = [newColor, ...prevHistory.slice(0, 9)]
      return [...new Set(updatedHistory)]
    })
  }, [])

  return (
    <div className='fixed left-0 top-1/2 -translate-y-1/2 p-4'>
      <div className="backdrop-blur-sm bg-gray-500/30 rounded-lg p-4 w-64 shadow-lg">
        <WarningFreePicker
          color={snap.color}
          disableAlpha
          presetColors={presetColors}
          onChange={handleChangeComplete}
          className="w-full mb-4"
          styles={{
            default: {
              picker: {
                background: 'rgba(229, 231, 235, 0.5)', // light gray background
                boxShadow: 'none',
              }
            }
          }}
        />
        <div className="color-history mt-4">
          <h3 className="text-sm font-medium text-gray-800 mb-2">Color History</h3>
          <div className="flex flex-wrap gap-2">
            {colorHistory.map((historyColor, index) => (
              <button
                key={index}
                className="w-6 h-6 rounded-full border border-gray-300 transition-transform hover:scale-110 shadow-sm"
                style={{ backgroundColor: historyColor }}
                onClick={() => handleChangeComplete({ hex: historyColor })}
              />
            ))}
          </div>
        </div>
        <div className="custom-presets mt-4">
          <h3 className="text-sm font-medium text-gray-800 mb-2">Custom Presets</h3>
          <div className="flex flex-wrap gap-2">
            {presetColors.map((presetColor, index) => (
              <button
                key={index}
                className="w-6 h-6 rounded-full border border-gray-300 transition-transform hover:scale-110 shadow-sm"
                style={{ backgroundColor: presetColor }}
                onClick={() => handleChangeComplete({ hex: presetColor })}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ColorPicker
