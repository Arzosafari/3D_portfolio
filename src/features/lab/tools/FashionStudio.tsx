import { useState } from 'react';
import { labApi, type Outfit, type OutfitInput } from '../../../services/labService';
import { useAiAction } from '../useAiAction';
import { CopyButton, LabError, LabNote, Loading } from './shared';

const OCCASIONS = ['Casual', 'Work', 'Formal', 'Party', 'Travel', 'Custom'];
const SEASONS = ['Spring', 'Summer', 'Autumn', 'Winter'];

const EMPTY: OutfitInput = {
  occasion: 'Casual', weather: '', temperature: '', season: 'Autumn',
  style: '', colors: '', wardrobe: '', notes: '', avoid: '', feedback: [],
};

/**
 * TOOL B — Fashion Intelligence Studio. A working styling prototype built on the
 * Fashion AI project's idea: occasion + weather + preferences → a wearable outfit.
 * Weather is entered by hand; this demo has no live weather or inventory feed.
 */
export default function FashionStudio() {
  const [form, setForm] = useState<OutfitInput>(EMPTY);
  const [customOccasion, setCustomOccasion] = useState('');
  const { status, result, error, run } = useAiAction<Outfit>();

  const update = (key: keyof OutfitInput, value: string) => setForm((current) => ({ ...current, [key]: value }));

  const occasionValue = form.occasion === 'Custom' ? customOccasion.trim() : form.occasion;

  // Feedback re-runs the same request with the reaction attached, so the next
  // suggestion actually takes it into account. Feedback is not stored.
  const submit = async (feedback: string[] = []) => {
    if (!occasionValue) return;
    await run(() => labApi.outfit({ ...form, occasion: occasionValue, feedback }).then((data) => data.outfit));
  };

  const busy = status === 'loading';
  const outfit = result;
  const activeError = error;

  const asText = (value: Outfit) => [
    value.name,
    value.summary,
    ...value.pieces.map((piece) => `${piece.garment} — ${piece.role}: ${piece.reason}`),
    `Why it works: ${value.whyItWorks}`,
    value.weatherFit && `Weather: ${value.weatherFit}`,
    value.occasionFit && `Occasion: ${value.occasionFit}`,
    value.styling.length > 0 && `Styling: ${value.styling.join('; ')}`,
  ].filter(Boolean).join('\n');

  return (
    <div className="ailab-tool">
      <div className="ailab-tool-head">
        <div>
          <span className="ailab-tool-kicker">TOOL 02 / FASHION INTELLIGENCE STUDIO</span>
          <h3>Build an outfit from your day</h3>
        </div>
      </div>

      <form
        className="ailab-form"
        onSubmit={(event) => {
          event.preventDefault();
          submit();
        }}
      >
        <div className="ailab-grid">
          <label>
            <span>Occasion</span>
            <select value={form.occasion} onChange={(event) => update('occasion', event.target.value)}>
              {OCCASIONS.map((occasion) => <option key={occasion} value={occasion}>{occasion}</option>)}
            </select>
          </label>

          {form.occasion === 'Custom' && (
            <label>
              <span>Describe the occasion</span>
              <input value={customOccasion} maxLength={80} placeholder="A gallery opening" onChange={(event) => setCustomOccasion(event.target.value)} />
            </label>
          )}

          <label>
            <span>Season</span>
            <select value={form.season} onChange={(event) => update('season', event.target.value)}>
              {SEASONS.map((season) => <option key={season} value={season}>{season}</option>)}
            </select>
          </label>

          <label>
            <span>Temperature <em>optional</em></span>
            <input value={form.temperature} maxLength={40} placeholder="12°C / cool" onChange={(event) => update('temperature', event.target.value)} />
          </label>

          <label className="ailab-grid-wide">
            <span>Weather conditions</span>
            <input required value={form.weather} maxLength={320} placeholder="Light rain, breezy, dry indoors most of the day" onChange={(event) => update('weather', event.target.value)} />
          </label>

          <label>
            <span>Preferred style</span>
            <input required value={form.style} maxLength={80} placeholder="Minimal, relaxed" onChange={(event) => update('style', event.target.value)} />
          </label>

          <label>
            <span>Preferred colours <em>optional</em></span>
            <input value={form.colors} maxLength={320} placeholder="Navy, cream, muted green" onChange={(event) => update('colors', event.target.value)} />
          </label>

          <label className="ailab-grid-wide">
            <span>Items you already own <em>optional</em></span>
            <textarea value={form.wardrobe} maxLength={600} rows={2} placeholder="Navy wool coat, white sneakers, grey knit, straight-leg jeans" onChange={(event) => update('wardrobe', event.target.value)} />
          </label>

          <label className="ailab-grid-wide">
            <span>Anything to avoid <em>optional</em></span>
            <input value={form.avoid} maxLength={200} placeholder="No heels, nothing tight" onChange={(event) => update('avoid', event.target.value)} />
          </label>

          <label className="ailab-grid-wide">
            <span>Other preferences <em>optional</em></span>
            <input value={form.notes} maxLength={320} placeholder="I’ll be on my feet for hours" onChange={(event) => update('notes', event.target.value)} />
          </label>
        </div>

        <div className="ailab-actions">
          <button className="ailab-primary" type="submit" disabled={busy || !occasionValue}>
            {busy ? 'Styling…' : outfit ? 'Style it again' : 'Build my outfit'} <span aria-hidden="true">↗</span>
          </button>
        </div>
      </form>

      {busy && <Loading label="Putting the outfit together…" />}
      {!busy && activeError && <LabError message={activeError} />}

      {!busy && outfit && (
        <article className="ailab-result">
          <header className="ailab-result-head">
            <div>
              <span className="ailab-result-kicker">GENERATED OUTFIT</span>
              <h4>{outfit.name}</h4>
              <p>{outfit.summary}</p>
            </div>
            <CopyButton text={asText(outfit)} />
          </header>

          <ul className="ailab-pieces">
            {outfit.pieces.map((piece, index) => (
              <li key={`${piece.garment}-${index}`}>
                <span className="ailab-piece-index">{String(index + 1).padStart(2, '0')}</span>
                <div>
                  <strong>{piece.garment}</strong>
                  {piece.role && <span className="ailab-piece-role">{piece.role}</span>}
                  {piece.reason && <p>{piece.reason}</p>}
                </div>
              </li>
            ))}
          </ul>

          <div className="ailab-result-blocks">
            <div><span>WHY IT WORKS</span><p>{outfit.whyItWorks}</p></div>
            {outfit.weatherFit && <div><span>WEATHER FIT</span><p>{outfit.weatherFit}</p></div>}
            {outfit.occasionFit && <div><span>OCCASION FIT</span><p>{outfit.occasionFit}</p></div>}
            {outfit.styling.length > 0 && (
              <div><span>STYLING NOTES</span><ul>{outfit.styling.map((note) => <li key={note}>{note}</li>)}</ul></div>
            )}
            {outfit.alternatives.length > 0 && (
              <div><span>ALTERNATIVES</span><ul>{outfit.alternatives.map((alternative) => <li key={alternative}>{alternative}</li>)}</ul></div>
            )}
          </div>

          <div className="ailab-feedback">
            <span>How was this?</span>
            <button type="button" disabled={busy} onClick={() => submit(['The user liked this outfit. Keep a similar direction.'])}>Like this</button>
            <button type="button" disabled={busy} onClick={() => submit(['The user did not like this outfit. Change the pieces noticeably.'])}>Not for me</button>
            <button type="button" disabled={busy} onClick={() => submit(['The user wants a clearly different style direction — shift the aesthetic.'])}>Try a different style</button>
          </div>
        </article>
      )}

      <LabNote>
        An experimental styling prototype inspired by the Fashion AI project — not the full system.
        It has no live weather feed, no trend database and no store inventory; weather is entered by hand.
        Garments are described in words rather than shown as real product photography.
      </LabNote>
    </div>
  );
}
