import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  Sun,
  Moon,
  Search,
  Check,
  ChevronDown,
  ChevronRight,
  Plus,
  Bell,
  CheckSquare,
  FileText,
  Mail,
  Phone,
  BarChart2,
  Zap,
  Star,
  Layers,
  Database,
  Terminal,
  Activity,
  Workflow,
  Globe,
  Share2,
  SlidersHorizontal,
  Download,
  Filter,
  TrendingUp,
  TrendingDown,
  Minus,
  MessageSquare,
  Shield,
  HelpCircle,
  ExternalLink,
  Twitter,
  Github,
  Linkedin,
} from 'lucide-react';

export const FolioLandingPage = () => {
  // Theme Toggle State
  const [isDark, setIsDark] = useState(false);

  // Dashboard Preview Interactive State
  const [activeTab, setActiveTab] = useState('Stock Analysis');
  const [stockSearch, setStockSearch] = useState('');
  const [selectedSector, setSelectedSector] = useState('All');

  // Integrations interactive toggles in Bento Grid
  const [integrations, setIntegrations] = useState({
    slack: true,
    notion: true,
    loom: false,
    github: true,
  });

  // AI Draft generator state
  const [promptQuery, setPromptQuery] = useState('Compare Q3 operating margins for AAPL vs MSFT');
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiResponse, setAiResponse] = useState(
    'Apple reported Q3 operating margins of 30.1% driven by Services growth (+14% YoY), whereas Microsoft achieved 43.2% fueled by Azure enterprise cloud infrastructure.'
  );

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState(0);

  // Stocks Data
  const stockRows = [
    { ticker: 'AAPL', name: 'Apple Inc.', sector: 'Technology', price: '$224.23', change: '+1.84%', sentiment: 'Bullish', query: 'SELECT rev_growth FROM q3_results', cap: '$3.42T' },
    { ticker: 'MSFT', name: 'Microsoft Corp.', sector: 'Cloud & AI', price: '$448.37', change: '+2.12%', sentiment: 'Bullish', query: 'AVG(azure_arr) GROUP BY region', cap: '$3.33T' },
    { ticker: 'NVDA', name: 'NVIDIA Corp.', sector: 'Semiconductors', price: '$116.91', change: '+3.45%', sentiment: 'Bullish', query: 'SUM(datacenter_chips) WHERE yr=2024', cap: '$2.87T' },
    { ticker: 'GOOGL', name: 'Alphabet Inc.', sector: 'Internet Services', price: '$165.40', change: '-0.42%', sentiment: 'Neutral', query: 'COUNT(search_queries) BY device', cap: '$2.06T' },
    { ticker: 'AMZN', name: 'Amazon.com Inc.', sector: 'E-commerce & AWS', price: '$186.20', change: '+0.88%', sentiment: 'Bullish', query: 'SELECT aws_margin FROM cloud_db', cap: '$1.94T' },
    { ticker: 'TSLA', name: 'Tesla Inc.', sector: 'Automotive & AI', price: '$210.15', change: '-2.30%', sentiment: 'Bearish', query: 'RATIO(deliveries, capacity)', cap: '$670.8B' },
  ];

  const filteredStocks = stockRows.filter((stock) => {
    const matchesSearch =
      stock.ticker.toLowerCase().includes(stockSearch.toLowerCase()) ||
      stock.name.toLowerCase().includes(stockSearch.toLowerCase()) ||
      stock.sector.toLowerCase().includes(stockSearch.toLowerCase());
    const matchesSector = selectedSector === 'All' || stock.sector.includes(selectedSector);
    return matchesSearch && matchesSector;
  });

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setAiResponse(
        `Generated SQL & synthesis for "${promptQuery}": Analysis indicates steady gross expansion with strong cloud segment leverage across both assets.`
      );
      setIsGenerating(false);
    }, 600);
  };

  const toggleIntegration = (key) => {
    setIntegrations((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const faqs = [
    {
      q: 'How does Folio connect to my database without writing SQL?',
      a: 'Folio integrates with your PostgreSQL, MySQL, Snowflake, BigQuery, or Supabase instances using read-only credentials. Our semantic layer translates natural language prompts into optimized, secure SQL queries automatically.',
    },
    {
      q: 'Is our sensitive company data used to train AI models?',
      a: 'No. Folio strictly complies with SOC2 Type II guidelines. Your enterprise schema and raw data are never sent to public models or used for training.',
    },
    {
      q: 'Can we export charts and reports directly into Slack and Notion?',
      a: 'Yes. Folio includes native webhook triggers and scheduled syncs that push interactive visual embeds directly into your chosen team channels.',
    },
    {
      q: 'What is Ruixen UI mentioned in the platform?',
      a: 'Ruixen UI is our open-source, component-driven design specification that delivers precision typography, fluid micro-interactions, and accessible data-dense interfaces.',
    },
  ];

  return (
    <div
      className={`min-h-screen font-sans transition-colors duration-300 ${
        isDark ? 'bg-[#0B0F17] text-slate-100' : 'bg-gradient-to-b from-[#FAFAFA] to-[#F3F4F6] text-slate-900'
      }`}
    >
      {/* 1. Header Component */}
      <header
        className={`sticky top-0 z-50 w-full border-b transition-colors duration-200 backdrop-blur-md ${
          isDark
            ? 'bg-[#0B0F17]/80 border-slate-800'
            : 'bg-[#FAFAFA]/80 border-[#E5E7EB]'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center font-bold text-sm shadow-sm">
              F
            </div>
            <span className="font-serif text-2xl font-bold tracking-tight">Folio</span>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center gap-8">
            <a
              href="#features"
              className="text-sm font-medium text-slate-600 hover:text-black dark:text-slate-300 dark:hover:text-white transition-colors"
            >
              Features
            </a>
            <a
              href="#solution"
              className="text-sm font-medium text-slate-600 hover:text-black dark:text-slate-300 dark:hover:text-white transition-colors"
            >
              Solution
            </a>
            <a
              href="#pricing"
              className="text-sm font-medium text-slate-600 hover:text-black dark:text-slate-300 dark:hover:text-white transition-colors"
            >
              Pricing
            </a>
            <a
              href="#about"
              className="text-sm font-medium text-slate-600 hover:text-black dark:text-slate-300 dark:hover:text-white transition-colors"
            >
              About
            </a>
          </nav>

          {/* Right Actions: Theme Toggle, Login, Sign Up */}
          <div className="flex items-center gap-3">
            {/* Theme Switcher Pill */}
            <div
              className={`flex items-center p-1 rounded-full border cursor-pointer ${
                isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-[#E5E7EB]'
              }`}
              onClick={() => setIsDark(!isDark)}
              role="button"
              tabIndex={0}
              aria-label="Toggle theme mode"
            >
              <div
                className={`p-1 rounded-full transition-all ${
                  !isDark ? 'bg-slate-100 text-slate-900 shadow-xs' : 'text-slate-500'
                }`}
              >
                <Sun size={14} />
              </div>
              <div
                className={`p-1 rounded-full transition-all ${
                  isDark ? 'bg-slate-800 text-white shadow-xs' : 'text-slate-400'
                }`}
              >
                <Moon size={14} />
              </div>
            </div>

            <button
              type="button"
              className="text-sm font-medium px-3 py-1.5 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Login
            </button>

            <button
              type="button"
              className="text-sm font-medium px-4 py-2 rounded-lg bg-black text-white hover:bg-slate-800 dark:bg-white dark:text-black dark:hover:bg-slate-200 transition-all shadow-sm"
            >
              Sign Up
            </button>
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8 text-center max-w-5xl mx-auto">
        {/* Pill Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#E5E7EB] dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 shadow-xs mb-8 hover:border-slate-400 transition-colors cursor-pointer group">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
            Simplify Charts — Open Source
          </span>
          <ChevronRight
            size={14}
            className="text-slate-400 group-hover:translate-x-0.5 transition-transform"
          />
        </div>

        {/* Main Headline (Display Serif Font) */}
        <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-slate-950 dark:text-white leading-[1.08] mb-6">
          Making Data Intelligence <br className="hidden sm:block" />
          <span className="italic font-normal">Accessible</span>
        </h1>

        {/* Subheadline */}
        <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed mb-10 font-normal">
          Folio builds AI-powered tools that help teams query databases, visualize data, and make
          faster decisions — without writing SQL.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-6">
          <button
            type="button"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-black text-white font-medium hover:bg-slate-800 dark:bg-white dark:text-black dark:hover:bg-slate-200 transition-all shadow-md flex items-center justify-center gap-2 group text-sm"
          >
            Explore Folio
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
          <button
            type="button"
            className="w-full sm:w-auto px-6 py-3 rounded-xl border border-[#E5E7EB] dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-sm shadow-xs"
          >
            Get in Touch
          </button>
        </div>

        {/* Micro-caption */}
        <p className="text-xs font-medium text-slate-400 dark:text-slate-500 tracking-wide uppercase">
          Crafted with Ruixen UI
        </p>
      </section>

      {/* 3. Interactive Dashboard Preview (Floating Frame) */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-28">
        <div
          className={`rounded-2xl border shadow-2xl overflow-hidden transition-all duration-300 ${
            isDark
              ? 'bg-slate-950/90 border-slate-800 shadow-slate-950/50'
              : 'bg-white/95 border-[#E5E7EB] shadow-slate-200/80'
          }`}
        >
          {/* Top Window Bar */}
          <div
            className={`h-11 px-4 border-b flex items-center justify-between text-xs ${
              isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-[#FAFAFA] border-[#E5E7EB]'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-400 inline-block" />
              <span className="w-3 h-3 rounded-full bg-amber-400 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-400 inline-block" />
              <span className="ml-2 text-slate-400 font-mono text-[11px]">folio-workspace-v2.internal</span>
            </div>
            <div className="flex items-center gap-3 text-slate-500">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Connected
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[560px]">
            {/* Sidebar */}
            <aside
              className={`lg:col-span-3 p-4 border-r flex flex-col justify-between text-sm ${
                isDark ? 'border-slate-800 bg-slate-900/30' : 'border-[#E5E7EB] bg-[#FAFAFA]/50'
              }`}
            >
              <div>
                {/* Workspace Switcher */}
                <div className="flex items-center justify-between p-2 rounded-lg border border-[#E5E7EB] dark:border-slate-800 mb-4 bg-white dark:bg-slate-900 shadow-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-black text-white text-xs flex items-center justify-center font-bold">
                      F
                    </div>
                    <span className="font-semibold text-xs">Folio Analytics</span>
                  </div>
                  <ChevronDown size={14} className="text-slate-400" />
                </div>

                {/* Quick Actions Search */}
                <div className="relative mb-5">
                  <Search size={14} className="absolute left-2.5 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Quick Actions"
                    className={`w-full text-xs pl-8 pr-12 py-2 rounded-lg border focus:outline-none focus:ring-1 focus:ring-slate-400 transition-all ${
                      isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-[#E5E7EB]'
                    }`}
                  />
                  <span className="absolute right-2.5 top-2 text-[10px] font-mono text-slate-400 bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded border border-[#E5E7EB] dark:border-slate-700">
                    ⌘K /
                  </span>
                </div>

                {/* Nav Links */}
                <div className="space-y-1 mb-6">
                  {[
                    { label: 'Home', icon: <BarChart2 size={15} />, active: true },
                    { label: 'Notifications', icon: <Bell size={15} /> },
                    { label: 'Tasks', icon: <CheckSquare size={15} /> },
                    { label: 'Notes', icon: <FileText size={15} /> },
                    { label: 'Emails', icon: <Mail size={15} /> },
                    { label: 'Calls', icon: <Phone size={15} /> },
                    { label: 'Reports', icon: <Activity size={15} /> },
                    { label: 'Automations', icon: <Zap size={15} /> },
                  ].map((item) => (
                    <button
                      key={item.label}
                      type="button"
                      className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        item.active
                          ? 'bg-black text-white dark:bg-white dark:text-black font-semibold'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>

                {/* Favorites */}
                <div className="mb-4">
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-2 mb-1.5 flex items-center justify-between">
                    <span>Favorites</span>
                    <Plus size={12} className="cursor-pointer hover:text-black" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 px-2 py-1 text-xs text-slate-600 dark:text-slate-400 hover:text-black dark:hover:text-white cursor-pointer">
                      <Star size={13} className="text-amber-400 fill-amber-400" />
                      <span>Q3 Financial Ledger</span>
                    </div>
                    <div className="flex items-center gap-2 px-2 py-1 text-xs text-slate-600 dark:text-slate-400 hover:text-black dark:hover:text-white cursor-pointer">
                      <Star size={13} className="text-amber-400 fill-amber-400" />
                      <span>SaaS Churn Cohorts</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Records Section */}
              <div className="pt-3 border-t border-[#E5E7EB] dark:border-slate-800">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Synced Records</span>
                  <span className="font-mono font-semibold">142,890</span>
                </div>
              </div>
            </aside>

            {/* Main Data Panel */}
            <main className="lg:col-span-9 p-5 flex flex-col justify-between">
              <div>
                {/* Top Tab Bar & Filters */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#E5E7EB] dark:border-slate-800 mb-5">
                  <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-lg border border-[#E5E7EB] dark:border-slate-800">
                    {['Stock Analysis', 'Query builder', 'Export CSV'].map((tab) => (
                      <button
                        key={tab}
                        type="button"
                        onClick={() => setActiveTab(tab)}
                        className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                          activeTab === tab
                            ? 'bg-white dark:bg-slate-800 text-black dark:text-white shadow-xs font-semibold'
                            : 'text-slate-500 hover:text-black dark:hover:text-white'
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Search bar within data view */}
                    <div className="relative">
                      <Search size={13} className="absolute left-2.5 top-2.5 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Filter ticker / sector..."
                        value={stockSearch}
                        onChange={(e) => setStockSearch(e.target.value)}
                        className={`text-xs pl-7 pr-3 py-1.5 rounded-lg border focus:outline-none ${
                          isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-[#E5E7EB]'
                        }`}
                      />
                    </div>
                    <button
                      type="button"
                      className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-[#E5E7EB] dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50"
                    >
                      <Filter size={13} />
                      <span>Filters</span>
                    </button>
                    <button
                      type="button"
                      className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-[#E5E7EB] dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50"
                    >
                      <Download size={13} />
                    </button>
                  </div>
                </div>

                {/* Data Grid Table */}
                <div className="border border-[#E5E7EB] dark:border-slate-800 rounded-xl overflow-x-auto shadow-xs mb-4">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className={`border-b ${isDark ? 'bg-slate-900/60 border-slate-800 text-slate-400' : 'bg-slate-50 border-[#E5E7EB] text-slate-500'}`}>
                        <th className="py-2.5 px-4 font-semibold">Ticker</th>
                        <th className="py-2.5 px-4 font-semibold">Company Name</th>
                        <th className="py-2.5 px-4 font-semibold">Sector</th>
                        <th className="py-2.5 px-4 font-semibold">Price</th>
                        <th className="py-2.5 px-4 font-semibold">Recent AI Query</th>
                        <th className="py-2.5 px-4 font-semibold">Market Sentiment</th>
                        <th className="py-2.5 px-4 font-semibold text-right">Market Cap</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E5E7EB] dark:divide-slate-800 font-normal">
                      {filteredStocks.map((row) => (
                        <tr
                          key={row.ticker}
                          className="hover:bg-slate-50/80 dark:hover:bg-slate-900/50 transition-colors"
                        >
                          <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-white">
                            {row.ticker}
                          </td>
                          <td className="py-3 px-4 text-slate-700 dark:text-slate-300">
                            {row.name}
                          </td>
                          <td className="py-3 px-4">
                            <span className="inline-block px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[11px] font-medium border border-[#E5E7EB] dark:border-slate-700">
                              {row.sector}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-semibold">
                            <div className="flex items-center gap-1.5">
                              <span>{row.price}</span>
                              <span
                                className={`text-[10px] ${
                                  row.change.startsWith('+') ? 'text-emerald-600' : 'text-rose-600'
                                }`}
                              >
                                {row.change}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-4 font-mono text-[11px] text-slate-500 max-w-[180px] truncate">
                            {row.query}
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                                row.sentiment === 'Bullish'
                                  ? 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-300'
                                  : row.sentiment === 'Bearish'
                                  ? 'bg-rose-50 border-rose-200 text-rose-700 dark:bg-rose-950/40 dark:border-rose-800 dark:text-rose-300'
                                  : 'bg-slate-100 border-slate-200 text-slate-700 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300'
                              }`}
                            >
                              {row.sentiment === 'Bullish' && <TrendingUp size={11} />}
                              {row.sentiment === 'Bearish' && <TrendingDown size={11} />}
                              {row.sentiment === 'Neutral' && <Minus size={11} />}
                              {row.sentiment}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right font-mono font-medium text-slate-700 dark:text-slate-300">
                            {row.cap}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Natural Language Prompt Execution Bar */}
              <div className="p-3 rounded-xl border border-[#E5E7EB] dark:border-slate-800 bg-[#FAFAFA] dark:bg-slate-900/80 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 flex-1">
                  <div className="w-6 h-6 rounded-md bg-purple-600 text-white flex items-center justify-center flex-shrink-0">
                    <Sparkles size={13} />
                  </div>
                  <input
                    type="text"
                    value={promptQuery}
                    onChange={(e) => setPromptQuery(e.target.value)}
                    placeholder="Ask AI a question about this data in plain English..."
                    className="w-full text-xs bg-transparent focus:outline-none text-slate-800 dark:text-slate-200"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="px-3 py-1.5 rounded-lg bg-black text-white text-xs font-medium hover:bg-slate-800 dark:bg-white dark:text-black transition-all flex items-center gap-1.5 flex-shrink-0"
                >
                  {isGenerating ? 'Synthesizing...' : 'Run Query'}
                  <ArrowRight size={12} />
                </button>
              </div>
            </main>
          </div>
        </div>
      </section>

      {/* 4. Social Proof (Logo Marquee) */}
      <section className="py-12 border-y border-[#E5E7EB] dark:border-slate-800/80 bg-white/50 dark:bg-slate-950/40 overflow-hidden mb-24">
        <div className="max-w-7xl mx-auto px-4 text-center mb-6">
          <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
            Trusted by Leading Teams
          </span>
        </div>

        {/* Marquee Track */}
        <div className="relative w-full overflow-hidden flex [mask-image:linear-gradient(to_right,transparent,black_20%,black_80%,transparent)]">
          <div className="flex gap-16 items-center whitespace-nowrap animate-marquee py-2">
            {[
              'Acme Corp',
              'Vertex Data',
              'Supabase',
              'Vercel',
              'Linear',
              'Raycast',
              'Retool',
              'Stripe',
              'Ramp',
              'Brex',
              'Acme Corp',
              'Vertex Data',
              'Supabase',
              'Vercel',
              'Linear',
              'Raycast',
            ].map((company, idx) => (
              <span
                key={idx}
                className="text-lg font-serif font-bold text-slate-400 dark:text-slate-600 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
              >
                {company}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Features & Capabilities Grid (Bento Box Layout) */}
      <section id="features" className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-28">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-slate-950 dark:text-white mb-4">
            Engineered for Deep SQL & Insight Automation
          </h2>
          <p className="text-base text-slate-600 dark:text-slate-400">
            A unified suite designed to bridge business inquiries, analytical models, and team-wide
            collaboration in seconds.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Live Activity Feed */}
          <div
            className={`p-6 rounded-2xl border shadow-xs flex flex-col justify-between ${
              isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-[#E5E7EB]'
            }`}
          >
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/40">
                  <Activity size={18} />
                </div>
                <h3 className="font-semibold text-base">Live Activity Feed</h3>
              </div>
              <p className="text-xs text-slate-500 mb-4">
                Monitor database events, natural language query runs, and pipeline syncs in real time.
              </p>
            </div>

            <div className="space-y-2.5 text-xs font-mono">
              {[
                { user: 'sarah.eth', action: 'executed cohort_retention.sql', time: '1m ago' },
                { user: 'alex_dev', action: 'synced Snowflake -> Notion', time: '3m ago' },
                { user: 'folio_bot', action: 'anomaly detected in CAC ledger', time: '8m ago' },
              ].map((act, i) => (
                <div
                  key={i}
                  className="p-2.5 rounded-lg border border-[#E5E7EB] dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/50 flex items-center justify-between"
                >
                  <span className="font-medium text-slate-800 dark:text-slate-200">{act.user}</span>
                  <span className="text-[11px] text-slate-400">{act.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Card 2: Integration Stack */}
          <div
            className={`p-6 rounded-2xl border shadow-xs flex flex-col justify-between ${
              isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-[#E5E7EB]'
            }`}
          >
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40">
                  <Workflow size={18} />
                </div>
                <h3 className="font-semibold text-base">Integration Stack</h3>
              </div>
              <p className="text-xs text-slate-500 mb-4">
                Seamlessly trigger reports and dashboards directly into your team tools with one click.
              </p>
            </div>

            <div className="space-y-3">
              {[
                { name: 'Slack Notifications', desc: 'Post charts to #metrics', key: 'slack' },
                { name: 'Notion Database Sync', desc: 'Export auto-updating pages', key: 'notion' },
                { name: 'Loom Video Embeds', desc: 'Include interactive playback', key: 'loom' },
              ].map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between p-3 rounded-lg border border-[#E5E7EB] dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40"
                >
                  <div>
                    <div className="text-xs font-semibold">{item.name}</div>
                    <div className="text-[11px] text-slate-400">{item.desc}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleIntegration(item.key)}
                    className={`w-10 h-5 rounded-full p-0.5 transition-colors ${
                      integrations[item.key] ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white transition-transform ${
                        integrations[item.key] ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Card 3: AI Draft Generator */}
          <div
            className={`p-6 rounded-2xl border shadow-xs flex flex-col justify-between ${
              isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-[#E5E7EB]'
            }`}
          >
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 rounded-lg bg-purple-50 text-purple-600 dark:bg-purple-950/40">
                  <Sparkles size={18} />
                </div>
                <h3 className="font-semibold text-base">AI Synthesis Engine</h3>
              </div>
              <p className="text-xs text-slate-500 mb-4">
                Translates complex multi-table joins into clear executive memos and charts.
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-[#E5E7EB] dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/60 text-xs">
              <div className="flex items-center gap-1 text-[11px] font-bold text-purple-600 mb-1.5 uppercase">
                <Terminal size={12} /> Executive Summary
              </div>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
                {aiResponse}
              </p>
            </div>
          </div>

          {/* Card 4: Data Automations Node Flow Tree (Span 2 cols on md) */}
          <div
            className={`md:col-span-2 p-6 rounded-2xl border shadow-xs ${
              isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-[#E5E7EB]'
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950/40">
                <Zap size={18} />
              </div>
              <h3 className="font-semibold text-base">Data Automations Node Flow</h3>
            </div>
            <p className="text-xs text-slate-500 mb-6">
              Visual pipeline triggers that run queries, perform validations, and distribute data automatically.
            </p>

            {/* Visual Node Diagram */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl border border-[#E5E7EB] dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40">
              <div className="p-3 rounded-lg bg-white dark:bg-slate-800 border border-[#E5E7EB] dark:border-slate-700 shadow-xs text-center w-full sm:w-auto">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Trigger</span>
                <span className="text-xs font-semibold">Every Monday 9AM</span>
              </div>
              <ArrowRight size={16} className="text-slate-400 rotate-90 sm:rotate-0" />
              <div className="p-3 rounded-lg bg-white dark:bg-slate-800 border border-purple-300 dark:border-purple-800 shadow-xs text-center w-full sm:w-auto">
                <span className="text-[10px] uppercase font-bold text-purple-500 block mb-1">AI Transformer</span>
                <span className="text-xs font-semibold">Run Revenue Query</span>
              </div>
              <ArrowRight size={16} className="text-slate-400 rotate-90 sm:rotate-0" />
              <div className="p-3 rounded-lg bg-white dark:bg-slate-800 border border-emerald-300 dark:border-emerald-800 shadow-xs text-center w-full sm:w-auto">
                <span className="text-[10px] uppercase font-bold text-emerald-500 block mb-1">Destination</span>
                <span className="text-xs font-semibold">Broadcast to Exec Slack</span>
              </div>
            </div>
          </div>

          {/* Card 5: Platform Analytics */}
          <div
            className={`p-6 rounded-2xl border shadow-xs ${
              isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-[#E5E7EB]'
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 rounded-lg bg-rose-50 text-rose-600 dark:bg-rose-950/40">
                <Globe size={18} />
              </div>
              <h3 className="font-semibold text-base">Web Intelligence</h3>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Enrich internal database records with external market news and live filings.
            </p>

            <div className="p-3 rounded-lg border border-[#E5E7EB] dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-xs">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                <Search size={12} /> Live SEC Edgar & News Index
              </div>
              <div className="text-[11px] text-slate-400">
                Indexed 1,480 news points matching portfolio tickers in past 24h.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Customer Testimonials Section */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-28">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-slate-950 dark:text-white mb-4">
            Loved by Teams That Ship Fast
          </h2>
          <p className="text-base text-slate-600 dark:text-slate-400">
            See how forward-thinking product, finance, and engineering leaders use Folio every day.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              quote:
                'Folio replaced hours of ad-hoc SQL requests for our product team. Now our PMs ask in plain English and get verified charts immediately.',
              name: 'Elena Rostova',
              role: 'VP of Product',
              company: 'FinPulse Labs',
              avatar: 'E',
            },
            {
              quote:
                'The dashboard preview and Ruixen UI design feel lightyears ahead of bloated legacy BI tools. It is fast, intuitive, and remarkably accurate.',
              name: 'Marcus Vance',
              role: 'Head of Data Engineering',
              company: 'CloudScale AI',
              avatar: 'M',
            },
            {
              quote:
                'We hooked our customer cohort metrics to Slack and Notion in under 15 minutes. Folio has become essential to our weekly investor updates.',
              name: 'Claire Zhang',
              role: 'Co-founder & CEO',
              company: 'HyperFlow',
              avatar: 'C',
            },
          ].map((t, idx) => (
            <div
              key={idx}
              className={`p-6 rounded-2xl border shadow-xs flex flex-col justify-between transition-transform hover:-translate-y-1 ${
                isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-[#E5E7EB]'
              }`}
            >
              <div>
                {/* 5 Stars */}
                <div className="flex items-center gap-1 mb-4 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} className="fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed mb-6 italic">
                  "{t.quote}"
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-[#E5E7EB] dark:border-slate-800">
                <div className="w-9 h-9 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center font-bold text-sm text-slate-700 dark:text-slate-300">
                  {t.avatar}
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-slate-900 dark:text-white">{t.name}</h4>
                  <p className="text-[11px] text-slate-500">
                    {t.role} · <span className="font-medium text-slate-700 dark:text-slate-400">{t.company}</span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. FAQ Section */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto mb-28">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-slate-950 dark:text-white mb-3">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Everything you need to know about Folio’s architecture and integration.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={index}
                className={`border rounded-xl transition-colors overflow-hidden ${
                  isDark ? 'border-slate-800 bg-slate-900/40' : 'border-[#E5E7EB] bg-white'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? -1 : index)}
                  className="w-full text-left px-5 py-4 flex items-center justify-between text-sm font-medium gap-4"
                >
                  <span className="text-slate-900 dark:text-slate-100">{faq.q}</span>
                  <ChevronDown
                    size={16}
                    className={`text-slate-400 transition-transform duration-200 flex-shrink-0 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-4 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed border-t border-[#E5E7EB] dark:border-slate-800/80 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 8. Footer */}
      <footer
        className={`border-t py-16 px-4 sm:px-6 lg:px-8 transition-colors ${
          isDark ? 'bg-slate-950 border-slate-800 text-slate-400' : 'bg-white border-[#E5E7EB] text-slate-600'
        }`}
      >
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-10 mb-12">
          {/* Brand Col */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-7 h-7 rounded-md bg-black text-white flex items-center justify-center font-bold text-xs">
                F
              </div>
              <span className="font-serif text-2xl font-bold tracking-tight text-slate-950 dark:text-white">
                Folio
              </span>
            </div>
            <p className="text-xs leading-relaxed max-w-sm text-slate-500 mb-6">
              AI-native data intelligence and semantic database exploration. Built for teams that move fast.
            </p>
            <div className="flex items-center gap-3 text-slate-400">
              <a href="#twitter" aria-label="Twitter" className="hover:text-black dark:hover:text-white transition-colors">
                <Twitter size={16} />
              </a>
              <a href="#github" aria-label="GitHub" className="hover:text-black dark:hover:text-white transition-colors">
                <Github size={16} />
              </a>
              <a href="#linkedin" aria-label="LinkedIn" className="hover:text-black dark:hover:text-white transition-colors">
                <Linkedin size={16} />
              </a>
            </div>
          </div>

          {/* Links Column 1: Product */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-4">
              Product
            </h5>
            <ul className="space-y-2.5 text-xs">
              <li><a href="#features" className="hover:underline">SQL AI Assistant</a></li>
              <li><a href="#query" className="hover:underline">Visual Query Builder</a></li>
              <li><a href="#integrations" className="hover:underline">Integrations</a></li>
              <li><a href="#changelog" className="hover:underline">Changelog</a></li>
            </ul>
          </div>

          {/* Links Column 2: Solutions */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-4">
              Solutions
            </h5>
            <ul className="space-y-2.5 text-xs">
              <li><a href="#product-teams" className="hover:underline">For Product Teams</a></li>
              <li><a href="#engineering" className="hover:underline">For Engineering</a></li>
              <li><a href="#finance" className="hover:underline">For Finance & Ops</a></li>
              <li><a href="#enterprise" className="hover:underline">Enterprise Security</a></li>
            </ul>
          </div>

          {/* Links Column 3: Company */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-4">
              Company
            </h5>
            <ul className="space-y-2.5 text-xs">
              <li><a href="#about" className="hover:underline">About Us</a></li>
              <li><a href="#careers" className="hover:underline">Careers</a></li>
              <li><a href="#blog" className="hover:underline">Blog</a></li>
              <li><a href="#contact" className="hover:underline">Privacy Policy</a></li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-8 border-t border-[#E5E7EB] dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} Folio Intelligence Inc. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            Designed with <span className="font-medium text-slate-700 dark:text-slate-300">Ruixen UI</span> · Open Source
          </p>
        </div>
      </footer>
    </div>
  );
};
