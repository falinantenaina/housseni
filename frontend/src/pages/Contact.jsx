import { Mail, MapPin, Phone, Send } from "lucide-react";
import { useState } from "react";

const Contact = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setForm({ name: "", email: "", subject: "", message: "" });
  };

  const contactInfo = [
    {
      icon: MapPin,
      label: "Adresse",
      value: "Route Nationale Kaweni BP674 97600 MAYOTTE",
    },
    {
      icon: Phone,
      label: "Téléphone",
      value: "+262 639 28 37 68 | +262 269 60 43 71 | +262 639 28 17 66",
    },
    { icon: Mail, label: "Email", value: "ets.husseni@yahoo.fr" },
  ];

  return (
    <div className="min-h-screen bg-background pt-[88px]">
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <div className="mb-10">
          <span className="section-label">Support</span>
          <h1 className="section-title">CONTACTEZ-NOUS</h1>
          <span className="accent-line" />
          <p className="text-muted-foreground">
            Notre équipe vous répond dans les plus brefs délais.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Info */}
          <div className="lg:col-span-2 space-y-4">
            {contactInfo.map((item, i) => (
              <div key={i} className="card-base p-4 flex items-start gap-4">
                <div className="w-10 h-10 bg-primary/10 rounded-md flex items-center justify-center shrink-0">
                  <item.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-ui text-xs text-muted-foreground tracking-widest uppercase mb-0.5">
                    {item.label}
                  </p>
                  <p className="text-foreground font-ui font-medium text-sm">
                    {item.value}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Form */}
          <div className="lg:col-span-3">
            <div className="card-base p-6">
              {sent ? (
                <div className="text-center py-8">
                  <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Send className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="font-ui font-bold text-foreground text-xl tracking-wide mb-2">
                    MESSAGE ENVOYÉ
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Nous vous répondrons dans les plus brefs délais.
                  </p>
                  <button
                    onClick={() => setSent(false)}
                    className="btn-outline"
                  >
                    NOUVEAU MESSAGE
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-ui text-xs text-muted-foreground tracking-widest uppercase block mb-1.5">
                        Nom *
                      </label>
                      <input
                        type="text"
                        placeholder="Votre nom"
                        value={form.name}
                        onChange={(e) =>
                          setForm({ ...form, name: e.target.value })
                        }
                        className="input-base w-full"
                        required
                      />
                    </div>
                    <div>
                      <label className="font-ui text-xs text-muted-foreground tracking-widest uppercase block mb-1.5">
                        Email *
                      </label>
                      <input
                        type="email"
                        placeholder="votre@email.com"
                        value={form.email}
                        onChange={(e) =>
                          setForm({ ...form, email: e.target.value })
                        }
                        className="input-base w-full"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="font-ui text-xs text-muted-foreground tracking-widest uppercase block mb-1.5">
                      Sujet *
                    </label>
                    <input
                      type="text"
                      placeholder="Objet de votre message"
                      value={form.subject}
                      onChange={(e) =>
                        setForm({ ...form, subject: e.target.value })
                      }
                      className="input-base w-full"
                      required
                    />
                  </div>
                  <div>
                    <label className="font-ui text-xs text-muted-foreground tracking-widest uppercase block mb-1.5">
                      Message *
                    </label>
                    <textarea
                      rows={5}
                      placeholder="Décrivez votre demande..."
                      value={form.message}
                      onChange={(e) =>
                        setForm({ ...form, message: e.target.value })
                      }
                      className="input-base w-full resize-none"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn-primary w-full flex items-center justify-center gap-2 py-3 text-base"
                  >
                    <Send className="w-4.5 h-4.5" /> ENVOYER LE MESSAGE
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
