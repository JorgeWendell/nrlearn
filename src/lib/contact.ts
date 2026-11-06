export const CONTACT_EMAIL = "fire.treinamentos.prevencao@gmail.com";

export const WHATSAPP_NUMBERS = [
  { display: "11 93960-1643", e164: "5511939601643" },
  { display: "11 91290-6754", e164: "5511912906754" },
] as const;

export function whatsappHref(e164: string) {
  return `https://wa.me/${e164}`;
}
