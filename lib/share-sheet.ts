// Share a message. Phones: the native share sheet (WhatsApp etc. open it in their compose box, where the link preview with the
// picture is built before sending). Desktops: open WhatsApp itself (wa.me, which hands over to WhatsApp Desktop or WhatsApp Web)
// with the message already in the compose box, so the preview appears before the person picks a contact and sends.
// The Windows share window was tried first and rejected (Kinneret, 30.10.2026): it passed the text to WhatsApp and sent it at once,
// skipping the compose box, so no preview was ever built; copying to the clipboard was rejected too (an extra paste step).
// Returns true only when the text ended up on the clipboard (no share sheet, no window could open), so the button can say so.
export const isPhone = () => typeof navigator !== 'undefined' && /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);

export async function shareOrCopy(title: string, text: string): Promise<boolean> {
  if (isPhone() && navigator.share) { try { await navigator.share({ title, text }); } catch {} return false; }
  const w = window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
  if (w) return false;
  try { await navigator.clipboard.writeText(text); } catch { prompt('העתיקו את הטקסט:', text); }
  return true;
}
