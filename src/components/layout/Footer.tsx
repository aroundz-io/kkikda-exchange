export function Footer() {
  return (
    <footer className="w-full py-12 px-8 flex flex-col md:flex-row justify-between items-center gap-6 bg-surface border-t border-outline-variant/15 ml-0 lg:ml-64">
      <div className="flex flex-col items-center md:items-start">
        <span className="text-primary font-headline text-lg uppercase tracking-tighter">
          KKIKDAGEO
        </span>
        <p className="font-label text-[10px] tracking-tight uppercase text-white/30">
          &copy; 2024 KKIKDAGEO. The Digital Kura for Vintage Pu&apos;er.
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-8">
        {["Provenance Protocol", "Whitepaper", "Terms of Service", "Security Audit"].map(
          (link) => (
            <a
              key={link}
              href="#"
              className="font-label text-[10px] tracking-tight uppercase text-white/30 hover:text-primary transition-colors"
            >
              {link}
            </a>
          )
        )}
      </div>
    </footer>
  );
}
