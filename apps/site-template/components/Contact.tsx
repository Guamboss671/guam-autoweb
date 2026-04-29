'use client';
import { useState } from 'react';

interface ContactProps {
  lead: {
    businessName: string;
    phone: string;
    email: string;
    address: string;
  };
}

export default function Contact({ lead }: ContactProps) {
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: data.get('name'),
        email: data.get('email'),
        phone: data.get('phone'),
        message: data.get('message'),
      }),
    });

    setSubmitted(true);
  }

  return (
    <section id="contact" className="py-20" style={{ backgroundColor: 'var(--color-primary)' }}>
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-white text-center mb-12">Contact Us</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="text-white space-y-4">
            <h3 className="text-2xl font-semibold">{lead.businessName}</h3>
            {lead.address && <p className="opacity-80">{lead.address}</p>}
            {lead.phone && <p className="opacity-80">Phone: {lead.phone}</p>}
            {lead.email && <p className="opacity-80">Email: {lead.email}</p>}
            <div className="pt-4">
              {lead.address && (
                <iframe
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(lead.address)}&output=embed`}
                  className="w-full h-48 rounded-xl opacity-90"
                  loading="lazy"
                />
              )}
            </div>
          </div>

          {submitted ? (
            <div className="bg-white/10 rounded-2xl p-8 flex items-center justify-center text-white text-center">
              <div>
                <p className="text-3xl mb-2">✓</p>
                <p className="text-xl font-semibold">Message received!</p>
                <p className="opacity-75 mt-2">We'll be in touch soon.</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {['name', 'email', 'phone'].map(field => (
                <input
                  key={field}
                  name={field}
                  type={field === 'email' ? 'email' : 'text'}
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  required={field !== 'phone'}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 text-white placeholder:text-white/50 border border-white/20 focus:outline-none focus:border-white/60 transition-colors"
                />
              ))}
              <textarea
                name="message"
                placeholder="Your message..."
                rows={4}
                className="w-full px-4 py-3 rounded-xl bg-white/10 text-white placeholder:text-white/50 border border-white/20 focus:outline-none focus:border-white/60 transition-colors resize-none"
              />
              <button
                type="submit"
                className="w-full py-3 rounded-xl font-semibold text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: 'var(--color-accent)' }}
              >
                Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
