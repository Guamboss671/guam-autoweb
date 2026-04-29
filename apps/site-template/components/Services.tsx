interface Service {
  name: string;
  description: string;
  price?: string;
}

export default function Services({ services }: { services: Service[] }) {
  if (!services?.length) return null;

  return (
    <section id="services" className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">Our Services</h2>
        <p className="text-center text-gray-500 mb-12">What we offer</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{service.name}</h3>
              <p className="text-gray-600">{service.description}</p>
              {service.price && (
                <p className="mt-4 font-bold text-lg" style={{ color: 'var(--color-primary)' }}>{service.price}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
