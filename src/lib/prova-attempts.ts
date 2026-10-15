export const PROVA_WINDOW = 2;
export const PROVA_MAX = 4;
export const PROVA_COOLDOWN_MS = 24 * 60 * 60 * 1000;

export type ProvaAttemptState = {
  canTry: boolean;
  showGabarito: boolean;
  used: number;
  windowLabel: string;
  unlockAt: Date | null;
};

export function getProvaAttemptState(attempts: { finishedAt: Date }[]): ProvaAttemptState {
  const ordered = [...attempts].sort(
    (a, b) => new Date(a.finishedAt).getTime() - new Date(b.finishedAt).getTime(),
  );
  const used = ordered.length;

  if (used >= PROVA_MAX) {
    return {
      canTry: false,
      showGabarito: true,
      used,
      windowLabel: `${used}/${PROVA_MAX}`,
      unlockAt: null,
    };
  }

  if (used < PROVA_WINDOW) {
    return {
      canTry: true,
      showGabarito: false,
      used,
      windowLabel: `${used}/${PROVA_WINDOW}`,
      unlockAt: null,
    };
  }

  const second = ordered[PROVA_WINDOW - 1];
  const unlockAt = new Date(new Date(second.finishedAt).getTime() + PROVA_COOLDOWN_MS);

  if (Date.now() < unlockAt.getTime()) {
    return {
      canTry: false,
      showGabarito: false,
      used,
      windowLabel: `${used}/${PROVA_WINDOW}`,
      unlockAt,
    };
  }

  return {
    canTry: true,
    showGabarito: false,
    used,
    windowLabel: `${used}/${PROVA_MAX}`,
    unlockAt: null,
  };
}
