const { useState, useEffect, useCallback } = React;

```javascript
const { useState, useEffect, useCallback } = React;

// Helper to verify if a file is an image
const isImageFile = (file) => {
    return file.type.startsWith('image/');
};

const usePhotoLibrary = (excludedPatterns = []) => {
    const [photos, setPhotos] = useState([]);
    const [allPhotos, setAllPhotos] = useState([]); // Store all found photos
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
    const [directoryHandle, setDirectoryHandle] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const [isShuffle, setIsShuffle] = useState(() => {
        return localStorage.getItem('isShuffle') === 'true';
    });
    const [shuffledIndices, setShuffledIndices] = useState([]);

    // Persistence: Save state when it changes
    useEffect(() => {
        localStorage.setItem('isShuffle', isShuffle);
    }, [isShuffle]);

    useEffect(() => {
        if (currentPhotoIndex >= 0 && photos.length > 0) {
            localStorage.setItem('lastPhotoName', photos[currentPhotoIndex].name);
        }
    }, [currentPhotoIndex, photos]);

    // Shuffle helper
    const generateShuffledIndices = useCallback((count) => {
        const indices = Array.from({ length: count }, (_, i) => i);
        for (let i = indices.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [indices[i], indices[j]] = [indices[j], indices[i]];
        }
        return indices;
    }, []);

    // Update shuffled indices when photos change or shuffle is toggled
    useEffect(() => {
        if (isShuffle && photos.length > 0) {
            setShuffledIndices(generateShuffledIndices(photos.length));
        } else if (!isShuffle) {
            // If shuffle is turned off, clear shuffled indices or reset to sequential
            // For now, we'll clear them, and navigation will revert to sequential
            setShuffledIndices([]);
        }
    }, [photos.length, isShuffle, generateShuffledIndices]);

    // Function to select a folder
    const selectFolder = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            
            const handle = await window.showDirectoryPicker();
            setDirectoryHandle(handle);
            
            const imageFiles = [];
            for await (const entry of handle.values()) {
                if (entry.kind === 'file') {
                    const file = await entry.getFile();
                    if (isImageFile(file)) {
                        imageFiles.push({
                            file,
                            name: entry.name,
                            url: URL.createObjectURL(file),
                            handle: entry
                        });
                    }
                }
            }
            
            if (imageFiles.length === 0) {
                setError("No images found in the selected folder.");
                setPhotos([]);
                setAllPhotos([]);
                return;
            }
            
            setAllPhotos(imageFiles);
            // Filtering will happen in useEffect below
            
        } catch (err) {
            if (err.name !== 'AbortError') {
                console.error("Error selecting folder:", err);
                setError(err.message);
            }
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Apply filters
    useEffect(() => {
        if (allPhotos.length === 0) return;

        const filtered = allPhotos.filter(photo => {
            return !excludedPatterns.some(pattern => photo.name.toLowerCase().includes(pattern.toLowerCase()));
        });

        setPhotos(filtered);
        
        // Reset index if out of bounds or try to maintain relative position?
        // For simplicity, reset to 0 if current photo is filtered out
        // Or try to find the current photo in the new list
        
        // Simple reset for now to avoid complexity
        setCurrentPhotoIndex(0);

    }, [allPhotos, excludedPatterns]);

    // Navigation
    const nextPhoto = useCallback(() => {
        setPhotos(prev => {
            if (prev.length === 0) return prev;
            
            if (isShuffle) {
                setShuffledIndices(currentShuffled => {
                    // If we don't have shuffled indices yet, generate them
                    if (currentShuffled.length !== prev.length) {
                        currentShuffled = generateShuffledIndices(prev.length);
                    }
                    
                    // Find the current photo's index in the original photos array
                    // Then find its position in the shuffled array
                    const currentPhotoOriginalIndex = currentPhotoIndex;
                    const currentShuffledPosition = currentShuffled.indexOf(currentPhotoOriginalIndex);
                    
                    // Move to next index in the shuffled array
                    const nextShuffledPosition = (currentShuffledPosition + 1) % currentShuffled.length;
                    setCurrentPhotoIndex(currentShuffled[nextShuffledPosition]);
                    
                    return currentShuffled;
                });
            } else {
                setCurrentPhotoIndex(curr => (curr + 1) % prev.length);
            }
            return prev;
        });
    }, [isShuffle, generateShuffledIndices, currentPhotoIndex]); // Added currentPhotoIndex to dependencies

    const prevPhoto = useCallback(() => {
        setPhotos(prev => {
            if (prev.length === 0) return prev;

            if (isShuffle) {
                 setShuffledIndices(currentShuffled => {
                    if (currentShuffled.length !== prev.length) {
                        currentShuffled = generateShuffledIndices(prev.length);
                    }

                    const currentPhotoOriginalIndex = currentPhotoIndex;
                    const currentShuffledPosition = currentShuffled.indexOf(currentPhotoOriginalIndex);
                    
                    const prevShuffledPosition = (currentShuffledPosition - 1 + currentShuffled.length) % currentShuffled.length;
                    setCurrentPhotoIndex(currentShuffled[prevShuffledPosition]);
                    
                    return currentShuffled;
                });
            } else {
                setCurrentPhotoIndex(curr => (curr - 1 + prev.length) % prev.length);
            }
            return prev;
        });
    }, [isShuffle, generateShuffledIndices, currentPhotoIndex]); // Added currentPhotoIndex to dependencies

    const toggleShuffle = useCallback(() => {
        setIsShuffle(prev => !prev);
    }, []);

    return {
        photos,
        currentPhoto: photos[currentPhotoIndex] || null,
        currentIndex: currentPhotoIndex,
        isLoading,
        error,
        selectFolder,
        nextPhoto,
        prevPhoto,
        totalPhotos: photos.length,
        isShuffle,
        toggleShuffle
    };
};

// Export globally for the no-build environment
window.usePhotoLibrary = usePhotoLibrary;
```
