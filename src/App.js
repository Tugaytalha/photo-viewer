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
        isLoading
    } = usePhotoLibrary();

    const [isPlaying, setIsPlaying] = useState(false);
    const [intervalDuration, setIntervalDuration] = useState(5000);

    // Slideshow logic
    useEffect(() => {
        let timer;
        if (isPlaying && photos.length > 0) {
            timer = setInterval(() => {
                nextPhoto();
            }, intervalDuration);
        }
        return () => clearInterval(timer);
    }, [isPlaying, photos, nextPhoto, intervalDuration]);

    const togglePlay = () => {
        if (photos.length > 0) {
            setIsPlaying(!isPlaying);
        }
    };

    return (
        <div className="app-container">
            {currentPhoto ? (
                <PhotoViewer
                    photo={currentPhoto}
                    isPlaying={isPlaying}
                    interval={intervalDuration}
                />
            ) : (
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    gap: '20px'
                }}>
                    <h1>Periodic Photo Viewer</h1>
                    <button
                        onClick={selectFolder}
                        style={{
                            padding: '12px 24px',
                            fontSize: '1.2rem',
                            borderRadius: '8px',
                            border: 'none',
                            background: '#3b82f6',
                            color: 'white',
                            cursor: 'pointer'
                        }}
                    >
                        Select Folder
                    </button>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    {isLoading && <p>Loading...</p>}
                </div>
            )}

            {photos.length > 0 && (
                <Controls
                    isPlaying={isPlaying}
                    onPlayPause={togglePlay}
                    onNext={nextPhoto}
                    onPrev={prevPhoto}
                    onSettings={() => alert("Settings coming soon!")}
                />
            )}
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
