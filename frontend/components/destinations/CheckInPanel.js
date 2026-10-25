"use client";

import Link from 'next/link';
import { useState } from 'react';
import { api } from '@/lib/api';
import { useT } from '@/context/LanguageContext';
import { ROUTES } from '@/constants/routes';
import { formatTime } from '@/lib/format';
import Notice from '@/components/ui/Notice';

function getCurrentPosition() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject({ code: 'UNSUPPORTED' });
      return;
    }
    navigator.geolocation.getCurrentPosition(resolve, reject, { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 });
  });
}

// UC-06 Check In at Destination (Expanded Use Case Table 43, Activity Fig. 8, SSD Fig. 25)
export default function CheckInPanel({ destination, onCheckedIn }) {
  const t = useT();
  const { checkInStatus, name, areaRadiusM } = destination;
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState(null); // { tone, message }

  const handleCheckIn = async () => {
    setBusy(true);
    setFeedback(null);
    try {
      // Step 2: request the tourist's current location
      let position;
      try {
        position = await getCurrentPosition();
      } catch (err) {
        // Alt 2a: location permission denied
        setFeedback({
          tone: 'error',
          message: err.code === 1
            ? t('Check-in requires your location. Allow location access in your browser and try again.')
            : t('Your location could not be found. Please try again.'),
        });
        return;
      }
      // Steps 3-6: the server verifies the area, records the check-in and updates the crowd level
      const result = await api.checkIn(destination.destinationId, {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
      setFeedback({ tone: 'success', message: result.message });
      onCheckedIn();
    } catch (err) {
      // Alt 3a: outside the destination area (or another server-side rule)
      setFeedback({ tone: 'error', message: err.message });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="border-t border-ink pt-4">
      <h3 className="text-[20px]">{t('Check in')}</h3>

      {checkInStatus.checkedInHere ? (
        <p className="mt-2 text-[14px] text-ink-2">
          {t('You have been checked in here since')} <span className="data text-ink" dir="ltr">{formatTime(checkInStatus.activeCheckIn.checkinTime)}</span>.
        </p>
      ) : !checkInStatus.locationConsent ? (
        // UC-06 pre-condition: location consent (FR-01.07)
        <p className="mt-2 text-[14px] text-ink-2">
          {t('Check-in uses your location, so it needs your consent first.')}{' '}
          <Link href={ROUTES.PROFILE} className="link">{t('Turn it on in your profile')}</Link>.
        </p>
      ) : (
        <>
          <p className="mt-2 text-[14px] text-ink-2">
            {t('Here now? Checking in keeps the crowd level honest for everyone else. You need to be within {km} km of {name}. Your location is used for this check only and is not stored.', {
              km: (areaRadiusM / 1000).toFixed(1),
              name,
            })}
          </p>
          {checkInStatus.activeCheckIn && (
            <p className="mt-2 text-[13px] text-moderate">
              {t('This ends your check-in at {name}.', { name: checkInStatus.activeCheckIn.destinationName })}
            </p>
          )}
          <button onClick={handleCheckIn} disabled={busy} className="btn btn-primary mt-4 h-11 w-full">
            {busy ? t('Finding your location…') : t('Check in at {name}', { name })}
          </button>
        </>
      )}

      {feedback && <Notice tone={feedback.tone} className="mt-4">{feedback.message}</Notice>}
    </div>
  );
}
