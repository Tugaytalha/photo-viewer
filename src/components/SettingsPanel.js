const SettingsPanel = ({
    isOpen,
    onClose,
    interval,
    onIntervalChange,
    excludedPatterns,
    onExcludeChange,
    quietHoursStart,
    onQuietHoursStartChange,
    quietHoursEnd,
    onQuietHoursEndChange,
    showMetadata,
    onShowMetadataChange
}) => {
    if (!isOpen) return null;

    return (
        <div className="settings-overlay">
            <div className="settings-modal">
                <div className="settings-header">
                    <h2>Settings</h2>
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </div>

                <div className="settings-content">
                    <div className="setting-group">
                        <label>Slideshow Interval (seconds)</label>
                        <input
                            type="number"
                            min="1"
                            value={interval / 1000}
                            onChange={(e) => onIntervalChange(Number(e.target.value) * 1000)}
                        />
                    </div>

                    <div className="setting-group">
                        <label>Exclude Patterns (comma separated)</label>
                        <input
                            type="text"
                            placeholder="e.g. thumb, lowres, private"
                            value={excludedPatterns.join(', ')}
                            onChange={(e) => onExcludeChange(e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                        />
                        <small>Photos with filenames containing these strings will be skipped.</small>
                    </div>

                    <div className="setting-group">
                        <label>Quiet Hours (Pause Playback)</label>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <div style={{ flex: 1 }}>
                                <label style={{ fontSize: '0.8rem' }}>Start</label>
                                <input
                                    type="time"
                                    value={quietHoursStart || ''}
                                    onChange={(e) => onQuietHoursStartChange(e.target.value)}
                                />
                            </div>
                            <div style={{ flex: 1 }}>
                                <label style={{ fontSize: '0.8rem' }}>End</label>
                                <input
                                    type="time"
                                    value={quietHoursEnd || ''}
                                    onChange={(e) => onQuietHoursEndChange(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="setting-group">
                        <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                            <input
                                type="checkbox"
                                checked={showMetadata}
                                onChange={(e) => onShowMetadataChange(e.target.checked)}
                                style={{ width: 'auto' }}
                            />
                            Show Metadata Overlay
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
};

window.SettingsPanel = SettingsPanel;
