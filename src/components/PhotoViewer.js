const PhotoViewer = ({ photo, isPlaying, interval = 5000, displayMode = 'fit', kenBurnsEnabled = true }) => {
    if (!photo) return null;

    // Ken Burns effect variants
    const variants = {
        enter: {
            opacity: 0,
            scale: kenBurnsEnabled ? 1.1 : 1,
        },
        center: {
            zIndex: 1,
            opacity: 1,
            scale: 1,
            transition: {
                opacity: { duration: 1 },
                scale: kenBurnsEnabled ? { duration: interval / 1000, ease: "linear" } : { duration: 0 }
            }
        },
        exit: {
            zIndex: 0,
            opacity: 0,
            transition: { duration: 1 }
        }
    };

    const getObjectFit = () => {
        switch (displayMode) {
            case 'fill': return 'cover';
            case 'original': return 'none';
            case 'fit':
            default: return 'contain';
        }
    };

    return (
        <div className="photo-viewer" style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            overflow: 'hidden',
            backgroundColor: 'black'
        }}>
            <AnimatePresence initial={false}>
                <motion.img
                    key={photo.url}
                    src={photo.url}
                    alt={photo.name}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        objectFit: getObjectFit(),
                    }}
                />
            </AnimatePresence>
        </div>
    );
};

window.PhotoViewer = PhotoViewer;
