const { useState, useEffect, useCallback } = React;
const { motion, AnimatePresence } = window.Motion;

// Import components (they are global in no-build)
const usePhotoLibrary = window.usePhotoLibrary;
const Controls = window.Controls;
const PhotoViewer = window.PhotoViewer;
const SettingsPanel = window.SettingsPanel;

function App() {
    const [excludedPatterns, setExcludedPatterns] = useState([]);

    // Favorites
    const [favorites, setFavorites] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('favorites')) || [];
        } catch {
            return [];
        }
    });
    const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

    const {
        photos,
        currentPhoto,
        nextPhoto,
        prevPhoto,
        selectFolder,
        error,
        isLoading,
        isShuffle,
        toggleShuffle,
        markAsCorrupt
    } = usePhotoLibrary(excludedPatterns, favorites, showFavoritesOnly);

    const [isPlaying, setIsPlaying] = useState(false);
    const [intervalDuration, setIntervalDuration] = useState(5000);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    // Display Settings
    const [displayMode, setDisplayMode] = useState('fit'); // 'fit', 'fill', 'original'
    const [kenBurnsEnabled, setKenBurnsEnabled] = useState(true);
    const [showMetadata, setShowMetadata] = useState(false);

    // Per-photo framing
    const [isEditingFraming, setIsEditingFraming] = useState(false);
    const [photoSettings, setPhotoSettings] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('photoSettings')) || {};
        } catch {
            return {};
        }
    });

    useEffect(() => {
        localStorage.setItem('photoSettings', JSON.stringify(photoSettings));
    }, [photoSettings]);

    useEffect(() => {
        localStorage.setItem('favorites', JSON.stringify(favorites));
    }, [favorites]);

    const handleUpdatePhotoSettings = (photoName, settings) => {
        setPhotoSettings(prev => ({
            ...prev,
            [photoName]: settings
        }));
    };

    const toggleEditingFraming = () => {
        setIsEditingFraming(prev => !prev);
        if (!isEditingFraming) {
            setIsPlaying(false); // Pause when starting to edit
        }
    };

    const toggleFavorite = () => {
        if (!currentPhoto) return;
        setFavorites(prev => {
            if (prev.includes(currentPhoto.name)) {
                return prev.filter(name => name !== currentPhoto.name);
            } else {
                return [...prev, currentPhoto.name];
            }
        });
    };

    const handlePhotoError = useCallback(() => {
        if (currentPhoto) {
            markAsCorrupt(currentPhoto.name);
        }
    }, [currentPhoto, markAsCorrupt]);

    const resetSettings = () => {
        if (window.confirm("Are you sure you want to reset all settings, favorites, and custom framing? This cannot be undone.")) {
            localStorage.removeItem('photoSettings');
            localStorage.removeItem('favorites');
            localStorage.removeItem('isShuffle');
            localStorage.removeItem('lastPhotoName');

            setPhotoSettings({});
            setFavorites([]);
            setExcludedPatterns([]);
            setQuietHoursStart('');
            setQuietHoursEnd('');
            setShowMetadata(false);
            setDisplayMode('fit');
            setKenBurnsEnabled(true);

            window.location.reload(); // Reload to ensure clean state for hooks
        }
    };

    // Scheduling
    const [quietHoursStart, setQuietHoursStart] = useState('');
    const [quietHoursEnd, setQuietHoursEnd] = useState('');

    // Check if currently in quiet hours
    const isInQuietHours = useCallback(() => {
        if (!quietHoursStart || !quietHoursEnd) return false;

        const now = new Date();
        const currentMinutes = now.getHours() * 60 + now.getMinutes();

        const [startH, startM] = quietHoursStart.split(':').map(Number);
        const startMinutes = startH * 60 + startM;

        const [endH, endM] = quietHoursEnd.split(':').map(Number);
        const endMinutes = endH * 60 + endM;

        if (startMinutes < endMinutes) {
            return currentMinutes >= startMinutes && currentMinutes < endMinutes;
        } else {
            // Spans midnight
            return currentMinutes >= startMinutes || currentMinutes < endMinutes;
        }
    }, [quietHoursStart, quietHoursEnd]);

    const togglePlay = useCallback(() => {
        if (photos.length > 0) {
            setIsPlaying(prev => !prev);
        }
    }, [photos.length]);

    // Fullscreen logic
    const toggleFullscreen = useCallback(() => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.error(`Error attempting to enable fullscreen: ${err.message}`);
            });
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    }, []);

    // Keyboard controls
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (isSettingsOpen) return; // Don't trigger if settings are open

            switch (e.key) {
                case 'ArrowRight':
                    nextPhoto();
                    break;
                case 'ArrowLeft':
                    prevPhoto();
                    break;
                case ' ':
                    e.preventDefault();
                    togglePlay();
                    break;
                case 'f':
                    toggleFullscreen();
                    break;
                case 'm':
                    setShowMetadata(prev => !prev);
                    break;
                default:
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [nextPhoto, prevPhoto, togglePlay, toggleFullscreen, isSettingsOpen]);

    // Slideshow logic
    useEffect(() => {
        let timer;

        const shouldPlay = isPlaying && photos.length > 0 && !isInQuietHours();

        if (shouldPlay) {
            timer = setInterval(() => {
                nextPhoto();
            }, intervalDuration);
        }
        return () => clearInterval(timer);
    }, [isPlaying, photos, nextPhoto, intervalDuration, isInQuietHours]);

    const toggleDisplayMode = () => {
        setDisplayMode(prev => {
            if (prev === 'fit') return 'fill';
            if (prev === 'fill') return 'original';
            return 'fit';
        });
    };

    const toggleKenBurns = () => {
        setKenBurnsEnabled(prev => !prev);
    };

    return (
        <div className="app-container">
            {currentPhoto ? (
                <PhotoViewer
                    photo={currentPhoto}
                    isPlaying={isPlaying && !isInQuietHours()}
                    interval={intervalDuration}
                    displayMode={displayMode}
                    kenBurnsEnabled={kenBurnsEnabled}
                    showMetadata={showMetadata}
                    isEditingFraming={isEditingFraming}
                    photoSettings={photoSettings}
                    onUpdatePhotoSettings={handleUpdatePhotoSettings}
                    onError={handlePhotoError}
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

            {isInQuietHours() && (
                <div style={{
                    position: 'absolute',
                    top: '20px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'rgba(0,0,0,0.7)',
                    padding: '8px 16px',
                    borderRadius: '20px',
                    zIndex: 200,
                    pointerEvents: 'none'
                }}>
                    Quiet Hours Active
                </div>
            )}

            {photos.length > 0 && (
                <Controls
                    isPlaying={isPlaying && !isInQuietHours()}
                    onPlayPause={togglePlay}
                    onNext={nextPhoto}
                    onPrev={prevPhoto}
                    onSettings={() => setIsSettingsOpen(true)}
                    isShuffle={isShuffle}
                    onToggleShuffle={toggleShuffle}
                    displayMode={displayMode}
                    onToggleDisplayMode={toggleDisplayMode}
                    kenBurnsEnabled={kenBurnsEnabled}
                    onToggleKenBurns={toggleKenBurns}
                    onToggleFullscreen={toggleFullscreen}
                    isEditingFraming={isEditingFraming}
                    onToggleEditingFraming={toggleEditingFraming}
                    isFavorite={currentPhoto && favorites.includes(currentPhoto.name)}
                    onToggleFavorite={toggleFavorite}
                />
            )}

            <SettingsPanel
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
                interval={intervalDuration}
                onIntervalChange={setIntervalDuration}
                excludedPatterns={excludedPatterns}
                onExcludeChange={setExcludedPatterns}
                quietHoursStart={quietHoursStart}
                onQuietHoursStartChange={setQuietHoursStart}
                quietHoursEnd={quietHoursEnd}
                onQuietHoursEndChange={setQuietHoursEnd}
                showMetadata={showMetadata}
                onShowMetadataChange={setShowMetadata}
                showFavoritesOnly={showFavoritesOnly}
                onShowFavoritesOnlyChange={setShowFavoritesOnly}
                onResetSettings={resetSettings}
            />
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
