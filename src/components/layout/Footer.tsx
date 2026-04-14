export function Footer() {
  return (
    <footer className="py-12 px-8 bg-surface border-t border-outline-variant/15 ml-0 lg:ml-64">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <span className="font-headline text-primary text-lg font-bold tracking-tighter">
            KKIKDAGEO
          </span>
          <p className="text-outline font-label text-[10px] uppercase tracking-widest mt-1">
            &copy; {new Date().getFullYear()} All rights reserved
          </p>
        </div>

        <div className="flex gap-8">
          {[
            "Provenance Protocol",
            "Whitepaper",
            "Terms of Service",
            "Security Audit",
          ].map((link) => (
            <a
              key={link}
              href="#"
              className="font-label text-[10px] uppercase tracking-widest text-outline hover:text-primary transition-colors"
            >
              {link}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
