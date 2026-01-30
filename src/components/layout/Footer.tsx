import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-muted/50 border-t border-border py-12">
      <div className="parlios-container">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Logo & Copyright */}
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xs">P</span>
            </div>
            <span className="text-sm text-muted-foreground">
              © 2024 Parlios Launchpad (Test)
            </span>
          </div>

          {/* Links */}
          <nav className="flex flex-wrap justify-center gap-6 text-sm">
            <Link
              to="/diagnostic"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Diagnostic
            </Link>
            <Link
              to="/tools"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Outils
            </Link>
            <a
              href="mailto:contact@parlios.test"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Contact test
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
