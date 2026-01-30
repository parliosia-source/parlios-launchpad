import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, ArrowRight, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  return (
    <Layout showFooter={false}>
      <div className="parlios-section min-h-[80vh] flex items-center justify-center">
        <div className="parlios-container max-w-md">
          <div className="parlios-card-static p-8 animate-fade-in">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-14 h-14 rounded-2xl bg-accent flex items-center justify-center mx-auto mb-4">
                <Lock className="text-primary" size={28} />
              </div>
              <h1 className="text-2xl font-bold text-foreground mb-2">Connexion</h1>
              <p className="text-muted-foreground text-sm">
                Fonctionnalité bientôt disponible
              </p>
            </div>

            {/* Form (disabled) */}
            <div className="space-y-4 mb-6 opacity-60">
              <div>
                <Label className="text-foreground mb-2 block">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                  <Input
                    type="email"
                    placeholder="ton@email.com"
                    disabled
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <Label className="text-foreground mb-2 block">Mot de passe</Label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  disabled
                />
              </div>
              <Button disabled className="w-full">
                Se connecter
              </Button>
            </div>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-card px-2 text-muted-foreground">
                  En attendant
                </span>
              </div>
            </div>

            {/* Alternative CTA */}
            <div className="space-y-3">
              <p className="text-center text-sm text-muted-foreground">
                Tu peux déjà utiliser Parlios sans compte
              </p>
              <Button
                onClick={() => navigate("/diagnostic")}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
              >
                Faire le diagnostic
                <ArrowRight size={16} />
              </Button>
              <Button
                onClick={() => navigate("/tools")}
                variant="outline"
                className="w-full"
              >
                Voir les outils
              </Button>
            </div>
          </div>

          {/* Footer note */}
          <p className="text-center text-xs text-muted-foreground mt-6">
            La connexion permettra de sauvegarder ton historique et accéder aux
            fonctionnalités premium.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
