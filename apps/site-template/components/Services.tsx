interface Service {
  name: string;
  description: string;
  price?: string;
}

const ICONS: Record<string, string> = {
  default: '✦',
  bread: '🍞', bak: '🥐', pastry: '🥐', cake: '🎂', cookie: '🍪', coffee: '☕', café: '☕', cafe: '☕',
  drink: '🥤', beverage: '🥤', catering: '🍽️', custom: '🎨', seasonal: '🌺', holiday: '🎁',
  auto: '🔧', repair: '🔧', nail: '💅', hair: '✂️', salon: '✂️', barbershop: '💈', barber: '💈',
  restaurant: '🍴', food: '🍴', grill: '🔥', dental: '🦷', fitness: '💪', gym: '💪',
  photo: '📷', real: '🏠', insurance: '🛡️', tattoo: '🎨', hotel: '🏨', flower: '🌸', florist: '🌸',
};

function getIcon(name: string): string {
  const lower = name.toLowerCase();
  for (const [key, icon] of Object.entries(ICONS)) {
    if (lower.includes(key)) return icon;
  }
  return ICONS.default;
}

export default function Services({ services, colorPalette }: {
  services: Service[];
  colorPalette: { primary: string; secondary: string; accent: string };
}) {
  if (!services?.length) return null;

  return (
    <section id="services" className="py-24" style={{ backgroundColor: colorPalette.secondary || '#FFF8EE' }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-xs font-bold uppercase tracking-[0.3em] mb-3 block" style={{ color: colorPalette.accent }}>
            What We Offer
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900">Our Services</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-7 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 group"
              style={{ borderTop: `4px solid ${colorPalette.primary}` }}
            >
              <div className="text-3xl mb-4">{getIcon(service.name)}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-opacity-80"
                style={{ color: colorPalette.primary }}
              >
                {service.name}
              </h3>
              <p className="text-gray-600 leading-relaxed">{service.description}</p>
              {service.price && (
                <p className="mt-4 font-bold text-lg" style={{ color: colorPalette.accent }}>{service.price}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
