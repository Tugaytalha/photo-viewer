const { useState, useEffect } = React;
const { motion, AnimatePresence } = window.Motion;

// Import components (they are global in no-build)
const usePhotoLibrary = window.usePhotoLibrary;
const Controls = window.Controls;
const PhotoViewer = window.PhotoViewer;

function App() {
    const {
        photos,
        currentPhoto,
        nextPhoto,
        prevPhoto,
        selectFolder,
        error,
        isLoading,
        const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(<App />);
