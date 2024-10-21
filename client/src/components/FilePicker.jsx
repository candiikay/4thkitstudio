import React from 'react'
import CustomButton from './CustomButton'
//file is the file, setFile is the function to set the file, readFile is the function to read the file
const FilePicker = ({file, setFile, readFile}) => {
  return (
    <div className='fixed left-0 top-1/2 -translate-y-1/2 p-4'>
      <div className="backdrop-blur-sm bg-gray-500/30 rounded-lg p-4 w-64 shadow-lg">
        <div className="flex flex-col">
          <label htmlFor="file-upload" className="text-sm font-medium text-gray-800 mb-2">
            Upload File
          </label>
          <input
            id="file-upload"
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
            className="mb-4 p-2 bg-gray-200/50 rounded-md text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-gray-700 file:text-white hover:file:bg-gray-600"
          />
          <p className="text-xs text-gray-600 mb-4 truncate">
            {file === '' ? "No file selected" : file.name}
          </p>
          <div className="flex flex-wrap gap-3">
            <CustomButton 
              type="filled"
              title="Logo"
              handleClick={() => readFile('logo')}
              customStyles="text-xs flex-1 bg-gray-700 text-white hover:bg-gray-600"
            />
            <CustomButton 
              type="filled"
              title="Full"
              handleClick={() => readFile('full')}
              customStyles="text-xs flex-1 bg-gray-700 text-white hover:bg-gray-600"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default FilePicker
