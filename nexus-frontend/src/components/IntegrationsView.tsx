import React, { useState, useEffect } from 'react';
import { ShieldCheck, Calendar, Mail, Github, Send, Workflow, CheckCircle2, Globe, Server } from 'lucide-react';
import { Integration, getIntegrations } from '../services/api';

const INTEGRATION_IMAGES: Record<string, string> = {
  google_calendar: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=600&q=80",
  gmail: "https://images.unsplash.com/photo-1596526131083-e8c633c948d2?auto=format&fit=crop&w=600&q=80",
  github: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?auto=format&fit=crop&w=600&q=80",
  slack: "https://images.unsplash.com/photo-1577563908411-5077b6dc7624?auto=format&fit=crop&w=600&q=80",
  n8n: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80"
};

export const IntegrationsView: React.FC = () => {
  const [integrations, setIntegrations] = useState<Integration[]>([]);

  useEffect(() => {
    loadIntegrations();
  }, []);

  const loadIntegrations = async () => {
    try {
      const data = await getIntegrations();
      setIntegrations(data);
    } catch (err) {
      console.error('Failed to load integrations', err);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'CALENDAR': return <Calendar className="h-5 w-5 text-sky-400" />;
      case 'EMAIL': return <Mail className="h-5 w-5 text-rose-400" />;
      case 'CODE_REPOSITORY': return <Github className="h-5 w-5 text-slate-100" />;
      case 'MESSAGING': return <Send className="h-5 w-5 text-emerald-400" />;
      default: return <Workflow className="h-5 w-5 text-amber-400" />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      <div className="border-b border-[rgba(147,197,253,0.16)] pb-5">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#0B1F4D] border border-[rgba(147,197,253,0.3)] text-[#38BDF8] text-xs font-mono mb-2">
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>CONNECTED APP ECOSYSTEM</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Enterprise Integrations & Tool Adapters
        </h1>
        <p className="text-[rgba(226,237,255,0.8)] text-xs sm:text-sm mt-1 max-w-2xl">
          NEXUS operates dual-mode adapters: genuine external API connections when environment credentials are provided, and deterministic high-fidelity mock adapters for offline demos and benchmarks.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {integrations.map((item) => {
          const bannerImg = INTEGRATION_IMAGES[item.id] || INTEGRATION_IMAGES.n8n;
          return (
            <div
              key={item.id}
              className="nexus-glass-card rounded-2xl overflow-hidden border border-[rgba(147,197,253,0.18)] flex flex-col justify-between group hover:border-[#38BDF8]/50 transition-all duration-300 shadow-xl"
            >
              {/* Thematic Header Image */}
              <div className="relative h-32 w-full overflow-hidden">
                <img
                  src={bannerImg}
                  alt={item.name}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#06142F] via-[#06142F]/60 to-transparent" />
                
                <div className="absolute top-3 left-3 p-2 rounded-xl bg-[#0B1F4D]/90 border border-[rgba(147,197,253,0.3)] backdrop-blur-md">
                  {getIcon(item.type)}
                </div>

                <div className="absolute top-3 right-3">
                  <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${
                    item.status === 'LIVE'
                      ? 'bg-emerald-950/80 text-emerald-400 border-emerald-500'
                      : 'bg-[#0B1F4D]/90 text-[#38BDF8] border-[rgba(147,197,253,0.3)]'
                  }`}>
                    {item.status}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-base font-bold text-white mb-1.5">{item.name}</h3>
                  <p className="text-xs text-[rgba(226,237,255,0.8)] leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-[rgba(147,197,253,0.14)] font-mono text-xs">
                  <span className="text-[10px] text-slate-400 block mb-1">ENV VARIABLE:</span>
                  <code className="text-[#38BDF8] text-[11px] bg-[#06142F] px-2 py-1 rounded border border-[rgba(147,197,253,0.2)] block truncate">
                    {item.id === 'google_calendar' ? 'GOOGLE_CALENDAR_CREDENTIALS_JSON' :
                     item.id === 'gmail' ? 'GMAIL_CREDENTIALS_JSON' :
                     item.id === 'github' ? 'GITHUB_TOKEN' :
                     item.id === 'slack' ? 'SLACK_WEBHOOK_URL' : 'N8N_WEBHOOK_URL'}
                  </code>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
