import React from 'react'
//CustomButton is the custom button
import CustomButton from './CustomButton';

const AIPicker = ({ prompt, setPrompt, generatingImg, handleSubmit }) => {
  //return the ai picker
  return (
    <div className='fixed left-0 top-1/2 -translate-y-1/2 p-4'>
      <div className="backdrop-blur-sm bg-gray-500/30 rounded-lg p-4 w-64 shadow-lg">
        <textarea 
          placeholder="Ask AI..."
          rows={5}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="w-full p-2 bg-gray-200/50 rounded-md mb-4 resize-none text-gray-800 placeholder-gray-500"
        />
        {/* flex flex-wrap gap-3 is the flex container for the buttons */}
        <div className="flex flex-wrap gap-3">
          {generatingImg ? (
            <CustomButton 
              type="outline"
              title="Asking AI..."
              customStyles="text-xs w-full bg-gray-300/50 text-gray-700"
            />
          ) : (
            <>
              <CustomButton 
                type="filled"
                title="AI Logo"
                //handleClick is the function to handle the click of the button   
                handleClick={() => handleSubmit('logo')}
                customStyles="text-xs flex-1 bg-gray-700 text-white hover:bg-gray-600"
              />

              <CustomButton  
                type="filled"
                title="AI Full"
                handleClick={() => handleSubmit('full')}
                customStyles="text-xs flex-1 bg-gray-700 text-white hover:bg-gray-600"
              />
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default AIPicker
