import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, Calendar, Mail, Github, Send, Workflow, 
  CheckCircle2, AlertCircle, RefreshCw, Key, Link as LinkIcon, 
  Unlink, Play, X, ExternalLink, Eye, EyeOff, Loader2, Info
} from 'lucide-react';
import { 
  Integration, getIntegrations, configureIntegration, 
  disconnectIntegration, testIntegration, TestIntegrationResult 
} from '../services/api';

const INTEGRATION_IMAGES: Record<string, string> = {
  google_calendar: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=600&q=80",
  gmail: "https://images.unsplash.com/photo-1596526131083-e8c633c948d2?auto=format&fit=crop&w=600&q=80",
  github: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?auto=format&fit=crop&w=600&q=80",
  slack: "https://images.unsplash.com/photo-1577563908411-5077b6dc7624?auto=format&fit=crop&w=600&q=80",
  n8n: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80"
};

const DOCS_LINKS: Record<string, { label: string; url: string; hint: string }> = {
  github: {
    label: "Generate GitHub Token (Classic / Fine-Grained)",
    url: "https://github.com/settings/tokens",
    hint: "Create a Personal Access Token with 'repo' scope. Tokens start with 'ghp_'."
  },
  slack: {
    label: "Create Slack Incoming Webhook",
    url: "https://api.slack.com/apps",
    hint: "Create a Slack App, enable Incoming Webhooks, and copy the Webhook URL (starts with 'https://hooks.slack.com/services/')."
  },
  n8n: {
    label: "n8n Webhook Documentation",
    url: "https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.webhook/",
    hint: "Deploy an n8n workflow with a Webhook node set to HTTP POST."
  },
  google_calendar: {
    label: "Google Cloud Console Credentials",
    url: "https://console.cloud.google.com/apis/credentials",
    hint: "Enable Google Calendar API and provide OAuth2 Client Credentials JSON, Service Account JSON, or an active Access Token (ya29...)."
  },
  gmail: {
    label: "Google Cloud Console Gmail API",
    url: "https://console.cloud.google.com/apis/library/gmail.googleapis.com",
    hint: "Enable Gmail API v1 and provide OAuth2 Credentials JSON or an active Access Token."
  }
};

export const IntegrationsView: React.FC = () => {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeModalItem, setActiveModalItem] = useState<Integration | null>(null);
  const [inputValue, setInputValue] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<TestIntegrationResult | null>(null);
  const [isTesting, setIsTesting] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadIntegrations();
  }, []);

  const showToast = (type: 'success' | 'error', text: string) => {
    setToastMessage({ type, text });
    setTimeout(() => setToastMessage(null), 4500);
  };

  const loadIntegrations = async () => {
    setLoading(true);
    try {
      const data = await getIntegrations();
      setIntegrations(data);
    } catch (err) {
      console.error('Failed to load integrations', err);
      showToast('error', 'Failed to fetch integrations from backend');
    } finally {
      setLoading(false);
    }
  };

  const openConfigModal = (item: Integration) => {
    setActiveModalItem(item);
    setInputValue('');
    setShowPassword(false);
    setTestResult(null);
  };

  const closeModal = () => {
    setActiveModalItem(null);
    setInputValue('');
    setTestResult(null);
  };

  const handleTestConnection = async () => {
    if (!activeModalItem) return;

    const trimmed = inputValue.trim();
    if (!trimmed && !activeModalItem.configured) {
      setTestResult({
        success: false,
        mode: 'EMPTY',
        message: `Please enter your real ${activeModalItem.name} credential above before testing.`
      });
      showToast('error', 'Please enter a credential to test');
      return;
    }

    setIsTesting(true);
    setTestResult(null);

    try {
      const res = await testIntegration(activeModalItem.id, trimmed || undefined);
      setTestResult(res);
      if (res.success) {
        showToast('success', res.message);
      } else {
        showToast('error', res.message);
      }
    } catch (err: any) {
      setTestResult({
        success: false,
        mode: 'FAILED',
        message: err.message || 'Connection test failed. Server error.'
      });
      showToast('error', 'Connection test failed');
    } finally {
      setIsTesting(false);
    }
  };

  const handleSaveIntegration = async () => {
    if (!activeModalItem) return;
    const trimmed = inputValue.trim();
    if (!trimmed) {
      showToast('error', 'Please enter a valid credential or token to connect');
      return;
    }

    setIsSaving(true);
    try {
      const res = await configureIntegration(activeModalItem.id, trimmed);
      setIntegrations(res.integrations);
      showToast('success', `${activeModalItem.name} activated in LIVE mode!`);
      closeModal();
    } catch (err: any) {
      showToast('error', err.message || 'Failed to save integration');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDisconnect = async (item: Integration) => {
    try {
      const res = await disconnectIntegration(item.id);
      setIntegrations(res.integrations);
      showToast('success', `Disconnected ${item.name}. Reverted to deterministic mock adapter.`);
      if (activeModalItem?.id === item.id) {
        closeModal();
      }
    } catch (err: any) {
      showToast('error', err.message || 'Failed to disconnect integration');
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

  const activeCount = integrations.filter(i => i.configured).length;
  const docInfo = activeModalItem ? DOCS_LINKS[activeModalItem.id] : null;

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in relative pb-16">
      {/* Toast notification */}
      {toastMessage && (
        <div className={`fixed top-6 right-6 z-50 flex items-center space-x-2.5 px-4 py-3 rounded-xl shadow-2xl border backdrop-blur-md animate-fade-in ${
          toastMessage.type === 'success'
            ? 'bg-emerald-950/90 border-emerald-500/50 text-emerald-200'
            : 'bg-rose-950/90 border-rose-500/50 text-rose-200'
        }`}>
          {toastMessage.type === 'success' ? (
            <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="h-5 w-5 text-rose-400 shrink-0" />
          )}
          <span className="text-xs sm:text-sm font-medium">{toastMessage.text}</span>
        </div>
      )}

      {/* Header */}
      <div className="border-b border-[rgba(147,197,253,0.16)] pb-6 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#0B1F4D] border border-[rgba(147,197,253,0.3)] text-[#38BDF8] text-xs font-mono mb-2">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>AUTHENTIC CONNECTED APPS</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Real Integrations & Tool Adapters
          </h1>
          <p className="text-[rgba(226,237,255,0.8)] text-xs sm:text-sm mt-1 max-w-2xl">
            Connect real API keys and webhook credentials to execute actions across your external apps. When credentials are not configured, NEXUS uses deterministic offline adapters for zero-cost demonstrations.
          </p>
        </div>

        {/* Status Bar */}
        <div className="flex items-center space-x-3">
          <div className="px-3.5 py-2 rounded-xl bg-[#081834] border border-[rgba(147,197,253,0.2)] text-xs font-mono text-slate-300">
            Real Live Connected: <span className="font-bold text-emerald-400">{activeCount}</span> / {integrations.length}
          </div>

          <button
            onClick={loadIntegrations}
            disabled={loading}
            title="Refresh status"
            className="p-2.5 rounded-xl bg-[#0B1F4D] border border-[rgba(147,197,253,0.22)] text-slate-300 hover:text-white transition-colors"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin text-[#38BDF8]' : ''}`} />
          </button>
        </div>
      </div>

      {/* Mode Transparency Banner */}
      <div className="p-4 rounded-2xl bg-[#081C44]/70 border border-[rgba(147,197,253,0.2)] flex items-start space-x-3">
        <Info className="h-5 w-5 text-[#38BDF8] shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <div className="font-bold text-white">How Integrations Work:</div>
          <p className="text-[rgba(226,237,255,0.8)] leading-relaxed">
            • <strong className="text-emerald-400">LIVE MODE</strong>: Provide your real GitHub Personal Access Token or Slack Webhook URL to interact with your real repositories and send real Slack channel messages.<br />
            • <strong className="text-sky-300">DEMO MOCK MODE</strong>: When no credentials are provided, NEXUS operates in deterministic simulation mode with full cryptographic attestation, allowing complete benchmark runs without needing live API tokens.
          </p>
        </div>
      </div>

      {/* Integration Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {integrations.map((item) => {
          const bannerImg = INTEGRATION_IMAGES[item.id] || INTEGRATION_IMAGES.n8n;
          const isLive = item.status === 'LIVE';

          return (
            <div
              key={item.id}
              className={`nexus-glass-card rounded-2xl overflow-hidden border transition-all duration-300 shadow-xl flex flex-col justify-between group ${
                isLive
                  ? 'border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.15)]'
                  : 'border-[rgba(147,197,253,0.18)] hover:border-[#38BDF8]/50'
              }`}
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

                <div className="absolute top-3 right-3 flex items-center space-x-1.5">
                  <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${
                    isLive
                      ? 'bg-emerald-950/90 text-emerald-400 border-emerald-500 shadow-[0_0_10px_#10B981]'
                      : 'bg-[#0B1F4D]/90 text-[#38BDF8] border-[rgba(147,197,253,0.3)]'
                  }`}>
                    {isLive ? '● LIVE REAL' : '○ DEMO MOCK'}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-base font-bold text-white mb-1.5 flex items-center justify-between">
                    <span>{item.name}</span>
                    {isLive && <CheckCircle2 className="h-4 w-4 text-emerald-400" />}
                  </h3>
                  <p className="text-xs text-[rgba(226,237,255,0.8)] leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Configuration / Credential Info */}
                <div className="pt-3 border-t border-[rgba(147,197,253,0.14)] space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="text-slate-400">STATUS:</span>
                    <span className={isLive ? 'text-emerald-400 font-semibold' : 'text-sky-300'}>
                      {isLive ? 'Configured & Active (Live Calls)' : 'Ready (Offline Mock)'}
                    </span>
                  </div>

                  {item.masked_value && (
                    <div className="flex items-center justify-between text-[11px] font-mono bg-[#06142F]/70 px-2 py-1 rounded border border-[rgba(147,197,253,0.15)]">
                      <span className="text-slate-400">CREDENTIAL:</span>
                      <span className="text-[#38BDF8] font-bold truncate max-w-[140px]">{item.masked_value}</span>
                    </div>
                  )}

                  <div className="font-mono text-[10px] text-slate-400 truncate">
                    ENV: <code className="text-slate-300">{item.env_var || item.id}</code>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-2 flex items-center space-x-2">
                  <button
                    onClick={() => openConfigModal(item)}
                    className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all ${
                      isLive
                        ? 'bg-[#0B1F4D] text-[#EAF2FF] border border-[rgba(147,197,253,0.3)] hover:border-[#38BDF8]'
                        : 'bg-gradient-to-r from-[#2563EB] to-[#38BDF8] text-white shadow-md hover:brightness-110'
                    }`}
                  >
                    <Key className="h-3.5 w-3.5" />
                    <span>{isLive ? 'Update Credential' : 'Connect Real App'}</span>
                  </button>

                  {isLive && (
                    <button
                      onClick={() => handleDisconnect(item)}
                      title="Disconnect real credential and revert to Mock"
                      className="p-2 rounded-xl bg-rose-950/40 text-rose-400 border border-rose-800/40 hover:bg-rose-900/60 transition-colors"
                    >
                      <Unlink className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Configuration & Real Verification Modal */}
      {activeModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="nexus-glass-card max-w-lg w-full rounded-2xl border border-[rgba(147,197,253,0.28)] shadow-2xl overflow-hidden animate-scale-up">
            {/* Modal Header */}
            <div className="p-5 border-b border-[rgba(147,197,253,0.16)] flex items-center justify-between bg-[#06142F]/90">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-xl bg-[#0B1F4D] border border-[rgba(147,197,253,0.3)]">
                  {getIcon(activeModalItem.type)}
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Connect {activeModalItem.name}</h3>
                  <p className="text-xs text-slate-400">{activeModalItem.description}</p>
                </div>
              </div>
              <button
                onClick={closeModal}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              {/* Guidance & Direct Link */}
              {docInfo && (
                <div className="p-3 rounded-xl bg-[#0B1F4D]/60 border border-[rgba(147,197,253,0.2)] text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white">Credential Guide:</span>
                    <a
                      href={docInfo.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1 text-[#38BDF8] hover:underline font-mono text-[11px]"
                    >
                      <span>{docInfo.label}</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                  <p className="text-slate-300 leading-relaxed text-[11px]">{docInfo.hint}</p>
                </div>
              )}

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1.5">
                  {activeModalItem.id === 'github' ? 'GitHub Personal Access Token (PAT):' :
                   activeModalItem.id === 'slack' ? 'Slack Incoming Webhook URL:' :
                   activeModalItem.id === 'n8n' ? 'n8n Webhook Endpoint URL:' :
                   'Google OAuth2 Access Token or Credentials JSON:'}
                </label>

                <div className="relative">
                  {activeModalItem.id.includes('calendar') || activeModalItem.id.includes('gmail') ? (
                    <textarea
                      rows={5}
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder={activeModalItem.placeholder || 'Paste credentials JSON or ya29... token here'}
                      className="w-full bg-[#051127] border border-[rgba(147,197,253,0.25)] rounded-xl p-3 text-xs font-mono text-white focus:outline-none focus:border-[#38BDF8] resize-none"
                    />
                  ) : (
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder={activeModalItem.placeholder || 'Paste real credential...'}
                      className="w-full bg-[#051127] border border-[rgba(147,197,253,0.25)] rounded-xl px-3 py-2.5 pr-10 text-xs font-mono text-white focus:outline-none focus:border-[#38BDF8]"
                    />
                  )}

                  {!activeModalItem.id.includes('calendar') && !activeModalItem.id.includes('gmail') && (
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  )}
                </div>
              </div>

              {/* Real Test Connection Results Badge */}
              {testResult && (
                <div className={`p-3 rounded-xl border text-xs font-mono flex items-start space-x-2.5 ${
                  testResult.success
                    ? 'bg-emerald-950/70 border-emerald-500/50 text-emerald-300'
                    : 'bg-rose-950/70 border-rose-500/50 text-rose-300'
                }`}>
                  {testResult.success ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <div className="font-bold flex items-center justify-between">
                      <span>{testResult.success ? 'REAL CONNECTION VERIFIED' : 'AUTHENTICATION FAILED'}</span>
                      {testResult.latency_ms ? (
                        <span className="text-[10px] text-slate-400">{testResult.latency_ms} ms</span>
                      ) : null}
                    </div>
                    <p className="mt-1 text-[11px] leading-relaxed">{testResult.message}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-5 border-t border-[rgba(147,197,253,0.16)] flex items-center justify-between bg-[#06142F]/90">
              <button
                type="button"
                onClick={handleTestConnection}
                disabled={isTesting}
                title="Send real live ping to the service API to test this credential"
                className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-medium text-slate-200 bg-[#0B1F4D] border border-[rgba(147,197,253,0.25)] hover:border-[#38BDF8] transition-colors"
              >
                {isTesting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Play className="h-3.5 w-3.5" />}
                <span>{isTesting ? 'Pinging Real API...' : 'Test Real Connection'}</span>
              </button>

              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-3.5 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleSaveIntegration}
                  disabled={isSaving}
                  className="inline-flex items-center space-x-1.5 px-5 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-[#2563EB] to-[#38BDF8] hover:brightness-110 shadow-lg transition-all"
                >
                  {isSaving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <LinkIcon className="h-3.5 w-3.5" />}
                  <span>{isSaving ? 'Saving...' : 'Save & Activate Live'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
