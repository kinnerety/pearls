// Share a message: on phones the native share sheet (WhatsApp etc. open it in their compose box, where the link preview with the
// picture is built before sending); on desktops copy the text, because the Windows share window hands the text to WhatsApp and
// sends it at once, without the compose box, so no preview ever appears (Kinneret, 30.10.2026). Pasting into WhatsApp shows it.
// Returns true when the text was copied (the button then says so), false when the share sheet took it.
export const isPhone = () => typeof navigator !== 'undefined' && /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);

export async function shareOrCopy(title: string, text: string): Promise<boolean> {
  if (isPhone() && navigator.share) { try { await navigator.share({ title, text }); } catch {} return false; }
  try { await navigator.clipboard.writeText(text); } catch { prompt('העתיקו את הטקסט:', text); }
  return true;
}
