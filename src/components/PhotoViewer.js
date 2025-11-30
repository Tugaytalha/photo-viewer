const PhotoViewer = ({ photo, isPlaying, interval, displayMode, kenBurnsEnabled, showMetadata }) => {
    const { motion, AnimatePresence } = window.Motion;

    if (!photo) return null;

    // Variants for transitions
    const variants = {
        enter: { opacity: 0 },
        center: { opacity: 1 },
        exit: { opacity: 0 }
    };

    // Ken Burns animation variants
    const kenBurnsVariants = {
        animate: {
            scale: [1, 1.1],
            x: ["0%", "5%"], // Subtle pan
            transition: {
                duration: interval / 1000 + 2, // Slightly longer than interval
                ease: "linear",
                repeat: Infinity,
                repeatType: "reverse"
            }
        },
        static: {
            scale: 1,
            x: 0
        }
    };

    const getImageStyle = () => {
        const baseStyle = {
            width: '100%',
            height: '100%',
            objectPosition: 'center',
        };

        if (displayMode === 'fit') {
            return { ...baseStyle, objectFit: 'contain' };
        } else if (displayMode === 'fill') {
            return { ...baseStyle, objectFit: 'cover' };
        } else if (displayMode === 'original') {
            return { ...baseStyle, objectFit: 'none' };
        }
        return baseStyle;
    };

    return (
        <div className="photo-viewer" style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
            <AnimatePresence mode='wait'>
                <motion.div
                    key={photo.url}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.5 }}
                    style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}
                >
                    <motion.img
                        src={photo.url}
                        alt={photo.name}
                        style={getImageStyle()}
                        variants={kenBurnsVariants}
                        animate={kenBurnsEnabled ? "animate" : "static"}
                    />
                </motion.div>
            </AnimatePresence>

            {showMetadata && (
                <div style={{
                    position: 'absolute',
                    top: '20px',
                    left: '20px',
                    background: 'rgba(0, 0, 0, 0.5)',
                    color: 'white',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    pointerEvents: 'none',
                    backdropFilter: 'blur(4px)',
                    zIndex: 10
                }}>
                    <div style={{ fontWeight: 'bold' }}>{photo.name}</div>
                    {/* Add more metadata here if available */}
                </div>
            )}
        </div>
    );
};

window.PhotoViewer = PhotoViewer;
