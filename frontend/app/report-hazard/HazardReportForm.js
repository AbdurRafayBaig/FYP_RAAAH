"use client";

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { HAZARD_TYPES } from '@/constants/riskLevels';
import PageTitle from '@/components/ui/PageTitle';
import Notice from '@/components/ui/Notice';

// UC-10 Submit Hazard Report - form only. The reporting service is planned for the next phase,
// so the form says so instead of pretending to submit.
export default function HazardReportForm() {
  const [destinations, setDestinations] = useState([]);

  useEffect(() => {
    api.listDestinations().then(({ destinations }) => setDestinations(destinations)).catch(() => {});
  }, []);

  return (
    <div className="page pb-20">
      <PageTitle title="Report a hazard">
        Tell us what you have seen on the ground. Reports are reviewed by an administrator before they appear on a
        destination page.
      </PageTitle>

      <Notice tone="warning" className="mt-8" title="Not connected yet">
        Sending reports arrives in the next release, so this form does not submit anything. If someone is in danger,
        call Rescue 1122.
      </Notice>

      <form className="mt-8 max-w-lg space-y-5" onSubmit={(e) => e.preventDefault()}>
        <div>
          <label htmlFor="destination" className="label">Destination</label>
          <select id="destination" className="field">
            <option value="">Choose a destination</option>
            {destinations.map((d) => <option key={d.destinationId} value={d.destinationId}>{d.name}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="hazardType" className="label">What did you see?</label>
          <select id="hazardType" className="field">
            {HAZARD_TYPES.map((t) => <option key={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="location" className="label">Where exactly?</label>
          <input id="location" className="field" placeholder="e.g. Karakoram Highway near Hussaini" />
        </div>
        <div>
          <label htmlFor="description" className="label">Description</label>
          <textarea id="description" rows={4} className="field h-auto py-2.5" placeholder="What is blocked, how bad it is, when you saw it" />
        </div>
        <button type="submit" disabled className="btn btn-primary">Send report</button>
      </form>
    </div>
  );
}
