const Controls = ({
    onPlayPause,
    isPlaying,
    onNext,
    onPrev,
    onSettings,
    isShuffle,
    onToggleShuffle,
    displayMode,
    onToggleDisplayMode,
    kenBurnsEnabled,
    onToggleKenBurns,
    onToggleFullscreen,
    isEditingFraming,
    onToggleEditingFraming,
    isFavorite,
    onToggleFavorite
}) => {
    return (
        <div className="controls-container">
            <button
                className={`control-btn ${isFavorite ? 'active' : ''}`}
                onClick={onToggleFavorite}
                title="Toggle Favorite"
                style={{ color: isFavorite ? '#ef4444' : 'white' }}
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill={isFavorite ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
            </button>

            <button
                className={`control-btn ${isShuffle ? 'active' : ''}`}
                onClick={onToggleShuffle}
                title="Shuffle"
                style={{ color: isShuffle ? '#3b82f6' : 'white' }}
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l5 5M4 4l5 5" />
                </svg>
            </button>

            <button
                className="control-btn"
                onClick={onToggleDisplayMode}
                title={`Display Mode: ${displayMode}`}
            >
                {displayMode === 'fit' && (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
                    </svg>
                )}
                {displayMode === 'fill' && (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                    </svg>
                )}
                {displayMode === 'original' && (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 8v8M8 12h8" />
                    </svg>
                )}
            </button>

            <button
                className={`control-btn ${kenBurnsEnabled ? 'active' : ''}`}
                onClick={onToggleKenBurns}
                title="Ken Burns Effect"
                style={{ color: kenBurnsEnabled ? '#3b82f6' : 'white' }}
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                </svg>
            </button>

            <button
                className={`control-btn ${isEditingFraming ? 'active' : ''}`}
                onClick={onToggleEditingFraming}
                title="Edit Framing (Drag & Scroll)"
                style={{ color: isEditingFraming ? '#3b82f6' : 'white' }}
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
            </button>

            <button className="control-btn" onClick={onPrev} title="Previous">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M19 20L9 12l10-8v16zM5 19V5h2v14H5z" />
                </svg>
            </button>

            <button className="control-btn play-pause" onClick={onPlayPause} title={isPlaying ? "Pause" : "Play"}>
                {isPlaying ? (
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M6 4h4v16H6zM14 4h4v16h-4z" />
                    </svg>
                ) : (
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 3l14 9-14 9V3z" />
                    </svg>
                )}
            </button>

            <button className="control-btn" onClick={onNext} title="Next">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 4l10 8-10 8V4zM19 5v14h-2V5h2z" />
                </svg>
            </button>

            <button className="control-btn" onClick={onToggleFullscreen} title="Toggle Fullscreen">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
                </svg>
            </button>

            <button className="control-btn settings-btn" onClick={onSettings} title="Settings">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
                    <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
                </svg>
            </button>
        </div>
    );
};

window.Controls = Controls;
