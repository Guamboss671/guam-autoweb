export default function Gallery({ photos, businessName }: { photos: string[]; businessName: string }) {
  if (!photos?.length) return null;

  return (
    <section id="gallery" className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">Gallery</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {photos.slice(0, 6).map((src, i) => (
            <div key={i} className="aspect-square overflow-hidden rounded-2xl">
              <img
                src={src}
                alt={`${businessName} photo ${i + 1}`}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
