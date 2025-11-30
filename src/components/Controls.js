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

};

window.Controls = Controls;
