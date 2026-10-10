
export function estDatePassee(dateIso: string | null): boolean {
  if (!dateIso) {
    return false;
  }
  const date = new Date(dateIso);
  if (Number.isNaN(date.getTime())) {
    return false;
  }
  const aujourdhui = new Date();
  aujourdhui.setHours(0, 0, 0, 0);
  return date.getTime() < aujourdhui.getTime();
}
