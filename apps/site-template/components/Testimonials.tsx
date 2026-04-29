interface Review {
  author: string;
  rating: number;
  text: string;
}

export default function Testimonials({ reviews }: { reviews: Review[] }) {
  if (!reviews?.length) return null;

  return (
    <section id="testimonials" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">What Customers Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((review, i) => (
            <div key={i} className="bg-gray-50 rounded-2xl p-6">
              <div className="flex mb-3">
                {'★'.repeat(review.rating).padEnd(5, '☆').split('').map((star, j) => (
                  <span key={j} className={star === '★' ? 'text-yellow-400' : 'text-gray-300'}>{star}</span>
                ))}
              </div>
              <p className="text-gray-700 italic mb-4">"{review.text}"</p>
              <p className="font-semibold text-gray-900">— {review.author}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
