import React, { useState, useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion';
import { useSnapshot } from 'valtio';
import state from '../store';
import { reader } from '../config/helpers'
import { EditorTabs, FilterTabs, DecalTypes } from '../config/constants';
import { fadeAnimation, slideAnimation } from '../config/motion'
import { ColorPicker, CustomButton, FilePicker, Tab, AIPicker } from '../components';
import { PatternGenerator } from '../components';

function Customizer() {
  const snap = useSnapshot(state);
  const [file, setFile] = useState('');
  const [prompt, setPrompt] = useState('');
  const [generatingImg, setGeneratingImg] = useState(false);
  const [activeEditorTab, setActiveEditorTab] = useState("");
  const [activeFilterTab, setActiveFilterTab] = useState({
    logoShirt: true,
    stylishShirt: false,
  });
  const [error, setError] = useState(null);
  const editorRef = useRef(null);

  useEffect(() => {
    console.log("Customizer component mounted");
    return () => console.log("Customizer component unmounted");
  }, []);

  useEffect(() => {
    console.log("EditorTabs:", EditorTabs);
  }, []);

  useEffect(() => {
    console.log("Active Editor Tab changed:", activeEditorTab);
  }, [activeEditorTab]);

  const generateTabContent = () => {
    switch (activeEditorTab) {
      case "colorpicker":
        return <ColorPicker />;
      case "filepicker":
        return <FilePicker file={file} setFile={setFile} readFile={readFile} />;
      case "aipicker":
        return <AIPicker prompt={prompt} setPrompt={setPrompt} generatingImg={generatingImg} handleSubmit={handleSubmit} />;
      case "patterngenerator":
        return <PatternGenerator />;
      default:
        return <div>No content for this tab</div>;
    }
  }

  function handleSubmit(type) {
    if (!prompt.trim()) {
      setError("Please enter a prompt");
      return;
    }

    setGeneratingImg(true);

    fetch('http://localhost:8080/api/v1/dalle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    })
      .then(response => response.json())
      .then(data => {
        if (!data.photo) throw new Error('No image data received from the server');
        handleDecals(type, `data:image/png;base64,${data.photo}`);
      })
      .catch(error => {
        console.error('Error in handleSubmit:', error);
        setError('An error occurred while generating the image.');
      })
      .finally(() => {
        setGeneratingImg(false);
        setActiveEditorTab("");
      });
  }

  function handleDecals(type, result) {
    const decalType = DecalTypes[type];

    if (!decalType) {
      setError(`Invalid decal type: ${type}`);
      return;
    }

    state[decalType.stateProperty] = result;

    if (!activeFilterTab[decalType.filterTab]) {
      handleActiveFilterTab(decalType.filterTab);
    }
  }

  function handleActiveFilterTab(tabName) {
    switch (tabName) {
      case "logoShirt":
        state.isLogoTexture = !activeFilterTab[tabName];
        break;
      case "stylishShirt":
        state.isFullTexture = !activeFilterTab[tabName];
        break;
      default:
        state.isLogoTexture = true;
        state.isFullTexture = false;
        break;
    }

    setActiveFilterTab((prevState) => ({
      ...prevState,
      [tabName]: !prevState[tabName]
    }));
  }

  function readFile(type) {
    reader(file)
      .then(result => {
        handleDecals(type, result);
        setActiveEditorTab("");
      })
      .catch(error => {
        console.error('Error reading file:', error);
        setError('Failed to read the file. Please try again.');
      });
  }

  return (
    <AnimatePresence>
      {!snap.intro && (
        <div className="customizer-wrapper bg-gray-100 min-h-screen flex">
          <motion.div
            ref={editorRef}
            key="custom"
            className="absolute top-0 left-0 z-10 w-full md:w-2/3 lg:w-1/2 xl:w-1/3 p-6"
            {...slideAnimation('left')}
          >
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="grid grid-cols-3 gap-4 mb-6">
                {EditorTabs.map((tab) => (
                  <Tab 
                    key={tab.name}
                    tab={tab}
                    handleClick={() => setActiveEditorTab(tab.name)}
                    isActive={activeEditorTab === tab.name}
                  />
                ))}
              </div>

              <div className="mt-4">
                {generateTabContent()}
              </div>
            </div>
          </motion.div>

          <motion.div
            className="absolute z-10 top-5 right-5"
            {...fadeAnimation}
          >
            <CustomButton 
              type="filled"
              title="Go Back"
              handleClick={() => {
                state.intro = true;
              }}
              customStyles="px-4 py-2.5 font-bold text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-300"
            />
          </motion.div>

          <motion.div
            className='absolute bottom-5 right-5 z-10'
            {...slideAnimation("up")}
          >
            <div className="bg-white rounded-lg shadow-lg p-4">
              {FilterTabs.map((tab) => (
                <Tab
                  key={tab.name}
                  tab={tab}
                  isFilterTab
                  isActiveTab={activeFilterTab[tab.name]}
                  handleClick={() => handleActiveFilterTab(tab.name)}
                />
              ))}
            </div>
          </motion.div>
        </div>
      )}
      {error && (
        <motion.div 
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="bg-white rounded-lg p-6 max-w-sm">
            <p className="text-red-500 mb-4">{error}</p>
            <button 
              onClick={() => setError(null)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors duration-300"
            >
              Close
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default Customizer;
