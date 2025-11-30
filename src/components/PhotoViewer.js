const PhotoViewer = ({
    photo,
    isPlaying,
    interval,
    displayMode,
    kenBurnsEnabled,
    showMetadata,
    isEditingFraming,
    photoSettings = {},
    onUpdatePhotoSettings,
    onError
}) => {
    const { motion, AnimatePresence } = window.Motion;

    if (!photo) return null;

    const savedSettings = photoSettings[photo.name];
    const hasCustomSettings = !!savedSettings;

    // Variants for transitions (Standard Mode)
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
                duration: interval / 1000 + 2,
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

    // Custom Framing Logic
    const handleDragEnd = (event, info) => {
        if (!isEditingFraming || !onUpdatePhotoSettings) return;
        const current = savedSettings || { scale: 1, x: 0, y: 0 };
        onUpdatePhotoSettings(photo.name, {
            ...current,
            x: current.x + info.offset.x,
            y: current.y + info.offset.y
        });
    };

    const handleWheel = (event) => {
        if (!isEditingFraming || !onUpdatePhotoSettings) return;
        const current = savedSettings || { scale: 1, x: 0, y: 0 };
        const newScale = Math.max(0.1, current.scale - event.deltaY * 0.001);
        onUpdatePhotoSettings(photo.name, {
            ...current,
            scale: newScale
        });
    };

    // Render Custom/Editing Mode
    if (isEditingFraming || hasCustomSettings) {
        const settings = savedSettings || { scale: 1, x: 0, y: 0 };

        return (
            <div
                className="photo-viewer"
                style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden', cursor: isEditingFraming ? 'move' : 'default' }}
                onWheel={isEditingFraming ? handleWheel : undefined}
            >
                <motion.img
                    key={photo.url + (isEditingFraming ? '-edit' : '-custom')}
                    src={photo.url}
                    alt={photo.name}
                    drag={isEditingFraming}
                    dragMomentum={false}
                    onDragEnd={handleDragEnd}
                    onError={onError}
                    initial={false}
                    animate={{
                        x: settings.x,
                        y: settings.y,
                        scale: settings.scale
                    }}
                    transition={{ duration: isEditingFraming ? 0 : 0.5 }}
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                        position: 'absolute',
                        top: 0,
                        left: 0
                    }}
                />

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
                        {hasCustomSettings && <div style={{ fontSize: '0.8em', opacity: 0.8 }}>Custom Framing</div>}
                    </div>
                )}

                {isEditingFraming && (
                    <div style={{
                        position: 'absolute',
                        bottom: '100px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        background: 'rgba(37, 99, 235, 0.9)',
                        color: 'white',
                        padding: '8px 16px',
                        borderRadius: '20px',
                        pointerEvents: 'none',
                        zIndex: 20
                    }}>
                        Drag to Pan • Scroll to Zoom
                    </div>
                )}
            </div>
        );
    }

    // Standard Render
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
                        onError={onError}
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
                </div>
            )}
        </div>
    );
};

window.PhotoViewer = PhotoViewer;
