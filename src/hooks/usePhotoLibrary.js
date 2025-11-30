const { useState, useEffect, useCallback } = React;

// Helper to verify if a file is an image
const isImageFile = (file) => {
    return file.type.startsWith('image/');
};

const usePhotoLibrary = () => {
    const [photos, setPhotos] = useState([]);
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
    const [directoryHandle, setDirectoryHandle] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Function to select a folder
    const selectFolder = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);

            // Request directory handle
            const handle = await window.showDirectoryPicker();
            setDirectoryHandle(handle);

            const imageFiles = [];

            // Recursively scan for images (optional, currently flat scan for simplicity)
            // For now, let's do a flat scan of the selected directory
            for await (const entry of handle.values()) {
                if (entry.kind === 'file') {
                    const file = await entry.getFile();
                    if (isImageFile(file)) {
                        imageFiles.push({
                            file,
                            name: entry.name,
                            url: URL.createObjectURL(file), // Create object URL for display
                            handle: entry
                        });
                    }
                }
            }

            if (imageFiles.length === 0) {
                setError("No images found in the selected folder.");
            }

            setPhotos(imageFiles);
            setCurrentPhotoIndex(0);

        } catch (err) {
            if (err.name !== 'AbortError') {
                console.error("Error selecting folder:", err);
                setError(err.message);
            }
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Navigation
    const nextPhoto = useCallback(() => {
        setPhotos(prev => {
            if (prev.length === 0) return prev;
            setCurrentPhotoIndex(curr => (curr + 1) % prev.length);
            return prev; // Return same array reference to avoid re-renders if not needed
        });
    }, []);

    const prevPhoto = useCallback(() => {
        setPhotos(prev => {
            if (prev.length === 0) return prev;
            setCurrentPhotoIndex(curr => (curr - 1 + prev.length) % prev.length);
            return prev;
        });
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
        totalPhotos: photos.length
    };
};

// Export globally for the no-build environment
window.usePhotoLibrary = usePhotoLibrary;
