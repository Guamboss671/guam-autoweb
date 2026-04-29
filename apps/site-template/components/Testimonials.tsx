interface Review {
  author: string;
  rating: number;
  text: string;
}

export default function Testimonials({ reviews, colorPalette }: {
  reviews: Review[];
  colorPalette: { primary: string; secondary: string; accent: string };
}) {
  if (!reviews?.length) return null;

  return (
    <section id="testimonials" className="py-24" style={{ backgroundColor: colorPalette.secondary || '#FFF8EE' }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-xs font-bold uppercase tracking-[0.3em] mb-3 block" style={{ color: colorPalette.accent }}>
            Reviews
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900">What Customers Say</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((review, i) => (
            <div key={i} className="bg-white rounded-2xl p-8 shadow-sm relative">
              <div className="text-4xl font-black opacity-10 absolute top-4 left-6 leading-none"
                style={{ color: colorPalette.primary }}
              >"</div>
              <div className="flex gap-0.5 mb-4">
                {[1,2,3,4,5].map(n => (
                  <span key={n} className="text-lg" style={{ color: n <= review.rating ? '#FBBF24' : '#E5E7EB' }}>★</span>
                ))}
              </div>
              <p className="text-gray-700 leading-relaxed mb-6 italic">"{review.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
                  style={{ backgroundColor: colorPalette.primary }}
                >
                  {review.author.charAt(0)}
                </div>
                <p className="font-semibold text-gray-900">{review.author}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
