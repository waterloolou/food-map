import { useEffect, useRef, useState } from 'react';
import { BUILT_IN_KEY, getSavedKey, saveKey } from '../lib/google';

interface SettingsDialogProps {
  open: boolean;
  onClose: () => void;
}

export function SettingsDialog({ open, onClose }: SettingsDialogProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const [key, setKey] = useState(getSavedKey());

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  function save(next: string) {
    saveKey(next.trim());
    // The Google Maps script can only be loaded once per page, so a new key needs a reload.
    window.location.reload();
  }

  return (
    <dialog ref={ref} className="settings" onClose={onClose}>
      <h2>Real restaurants and ratings</h2>
      <p>
        Food Map uses Google Places for live restaurants, star ratings and opening hours. That needs a Google Maps Platform API key with{' '}
        <strong>Maps JavaScript API</strong> and <strong>Places API (New)</strong> turned on.
      </p>
      {BUILT_IN_KEY && !getSavedKey() && <p className="note">This site already has a key built in. You only need your own to use a different one.</p>}
      <label htmlFor="api-key">Google API key</label>
      <input id="api-key" type="text" value={key} onChange={(e) => setKey(e.target.value)} placeholder="AIza…" spellCheck={false} autoComplete="off" />
      <p className="note">Saved in this browser only.</p>
      <div className="dialog-actions">
        {getSavedKey() && (
          <button type="button" className="button" onClick={() => save('')}>
            Remove key
          </button>
        )}
        <button type="button" className="button" onClick={onClose}>
          Cancel
        </button>
        <button type="button" className="button primary" disabled={!key.trim()} onClick={() => save(key)}>
          Save and reload
        </button>
      </div>
      <a className="help-link" href="https://developers.google.com/maps/documentation/javascript/get-api-key" target="_blank" rel="noreferrer">
        How to get a key
      </a>
    </dialog>
  );
}
