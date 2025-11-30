const { motion, AnimatePresence } = window.Motion;

const PhotoViewer = ({ photo, isPlaying, interval = 5000 }) => {
    if (!photo) return null;

    // Ken Burns effect variants
    const variants = {
        enter: {
            opacity: 0,
            scale: 1.1,
        },
        center: {
            zIndex: 1,
            opacity: 1,
            scale: 1,
            transition: {
                opacity: { duration: 1 },
                scale: { duration: interval / 1000, ease: "linear" } // Slow zoom out
            }
        },
        exit: {
            zIndex: 0,
            opacity: 0,
            transition: { duration: 1 }
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
                        objectFit: 'contain', // Default to fit, can be configurable
                    }}
                />
            </AnimatePresence>
        </div>
    );
};

window.PhotoViewer = PhotoViewer;
