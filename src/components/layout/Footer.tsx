export function Footer() {
  return (
    <footer className="ml-0 lg:ml-64 border-t border-[0.5px] border-outline-variant py-8 px-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 max-w-7xl mx-auto">
        <span className="font-label text-[10px] tracking-[0.15em] uppercase text-outline">
          KKIKDAGEO &copy; {new Date().getFullYear()}
        </span>
        <span className="font-label text-[10px] tracking-[0.15em] uppercase text-outline-variant">
          Digital Kura Exchange
        </span>
      </div>
    </footer>
  );
}
