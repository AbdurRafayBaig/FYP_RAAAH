"use client";

import { useT } from '@/context/LanguageContext';

const HINTS = {
  Nature: 'Lakes, meadows and glaciers',
  'Historical Sites': 'Forts, palaces and old mosques',
  Adventure: 'Treks, jeep tracks and high passes',
  Culture: 'Festivals, food and village life',
  Photography: 'Viewpoints and big landscapes',
};

const idFor = (name) => `hint-${name.replace(/\s+/g, '-')}`;

// FR-01.04 travel preferences as large cards, used after sign-up and on the profile page
export default function InterestPicker({ options, selected, onToggle, legend }) {
  const t = useT();
  return (
    <fieldset>
      {legend && <legend className="label">{legend}</legend>}
      <div className="mt-2 grid gap-2.5 sm:grid-cols-2">
        {options.map((name) => {
          const on = selected.includes(name);
          return (
            <label
              key={name}
              className={`relative flex min-h-[64px] cursor-pointer flex-col rounded-[3px] border px-4 py-3 transition-colors focus-within:outline focus-within:outline-2 focus-within:outline-accent ${
                on ? 'border-ink bg-ink text-paper' : 'border-rule bg-surface hover:border-ink/50'
              }`}
            >
              <span className="flex items-center justify-between gap-2 text-[15px] font-medium">
                {t(name)}
                <input
                  type="checkbox"
                  checked={on}
                  onChange={() => onToggle(name)}
                  aria-label={name}
                  aria-describedby={idFor(name)}
                  className={`h-5 w-5 shrink-0 ${on ? 'accent-paper' : 'accent-ink'}`}
                />
              </span>
              <span id={idFor(name)} className={`text-[13px] ${on ? 'text-paper/75' : 'text-muted'}`}>{t(HINTS[name] || '')}</span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
