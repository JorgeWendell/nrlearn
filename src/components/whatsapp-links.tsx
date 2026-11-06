import { WHATSAPP_NUMBERS, whatsappHref } from "@/lib/contact";

export function WhatsAppLinks({
  className = "font-semibold text-gold hover:text-paper",
  stacked = false,
}: {
  className?: string;
  stacked?: boolean;
}) {
  if (stacked) {
    return (
      <span className="flex flex-col gap-1">
        {WHATSAPP_NUMBERS.map((item) => (
          <a
            key={item.e164}
            href={whatsappHref(item.e164)}
            className={className}
            target="_blank"
            rel="noreferrer"
          >
            WhatsApp {item.display}
          </a>
        ))}
      </span>
    );
  }

  return (
    <span className="inline-flex flex-wrap items-center gap-x-2 gap-y-1">
      <span>WhatsApp</span>
      {WHATSAPP_NUMBERS.map((item, index) => (
        <span key={item.e164} className="inline-flex items-center gap-2">
          {index > 0 ? <span className="text-paper/35">·</span> : null}
          <a href={whatsappHref(item.e164)} className={className} target="_blank" rel="noreferrer">
            {item.display}
          </a>
        </span>
      ))}
    </span>
  );
}
