export default function About({ aboutText, businessName }: { aboutText: string; businessName: string }) {
  const paragraphs = aboutText?.split('\n\n') ?? [aboutText];

  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-gray-900 mb-8">About {businessName}</h2>
        <div className="space-y-4">
          {paragraphs.map((p, i) => (
            <p key={i} className="text-gray-700 text-lg leading-relaxed">{p}</p>
          ))}
        </div>
      </div>
    </section>
  );
}
