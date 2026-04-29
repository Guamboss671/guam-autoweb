export default function PreviewBanner({ businessName }: { businessName: string }) {
  return (
    <div className="bg-blue-600 text-white text-center py-3 px-4 text-sm font-medium sticky top-0 z-50">
      This is a <strong>free preview website</strong> built for {businessName}.
      Want to make it live?{' '}
      <a href="mailto:hello@guamwebservices.com" className="underline hover:no-underline">
        Contact us — starting at $79/month
      </a>
    </div>
  );
}
