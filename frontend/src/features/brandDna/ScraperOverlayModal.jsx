import React, { useState, useEffect } from 'react';
import { API_BASE } from '../../config/api';
import { useWorkspace } from '../../context/WorkspaceContext';
import { normalizeBrandDna } from '../../utils/normalizeBrandDna';
import { X, Dna, Globe, Sparkles, ArrowRight, FileText, Image, Trash2, Building, Upload, CheckCircle2 } from 'lucide-react';

export const ScraperOverlayModal = () => {
  const { isScraperOpen, setIsScraperOpen, addWorkspace, activeWorkspace, scraperMode, setActiveModule, t } = useWorkspace();
  
  // Single Unified Form State
  const [url, setUrl] = useState('');
  const [brandName, setBrandName] = useState('');
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [documentFiles, setDocumentFiles] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (isScraperOpen) {
      setResult(null);
      if (scraperMode === 'ACTIVE_BRAND' && activeWorkspace && activeWorkspace.domainUrl) {
        setUrl(activeWorkspace.domainUrl || '');
        setBrandName(activeWorkspace.brandName || '');
      } else {
        setUrl('');
        setBrandName('');
      }
      setLogoFile(null);
      setLogoPreview(null);
      setDocumentFiles([]);
      setImageFiles([]);
      setImagePreviews([]);
    }
  }, [isScraperOpen, scraperMode, activeWorkspace]);

  if (!isScraperOpen) return null;

  // ── LOGO HANDLERS ──
  const handleLogoSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoFile(file);
    const reader = new FileReader();
    reader.onload = () => setLogoPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleRemoveLogo = () => {
    setLogoFile(null);
    setLogoPreview(null);
  };

  // ── MULTI-DOCUMENT HANDLERS ──
  const handleDocumentsSelect = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setDocumentFiles((prevDocs) => {
      const existingKeySet = new Set(prevDocs.map((f) => `${f.name}_${f.size}`));
      const newDocs = files.filter((f) => !existingKeySet.has(`${f.name}_${f.size}`));
      return [...prevDocs, ...newDocs];
    });
  };

  const handleRemoveDocument = (index) => {
    setDocumentFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // ── MULTI-IMAGE HANDLERS ──
  const handleImagesSelect = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreviews((prev) => [
          ...prev,
          { id: `${file.name}_${file.size}_${Date.now()}`, file, url: reader.result }
        ]);
      };
      reader.readAsDataURL(file);
    });

    setImageFiles((prev) => [...prev, ...files]);
  };

  const handleRemoveImage = (index) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // Helper for human-readable file sizes
  const formatFileSize = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  // ── UNIFIED EXTRACTION SUBMIT HANDLER ──
  const handleExtractBrandDna = async (e) => {
    if (e) e.preventDefault();
    if (!url.trim() && documentFiles.length === 0 && !logoFile && imageFiles.length === 0) {
      alert('Please provide at least a Website URL or upload a Document / Image / Logo.');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('domainUrl', url.trim());
      formData.append('brandName', brandName.trim());

      if (logoFile) {
        formData.append('logo', logoFile);
      }

      documentFiles.forEach((doc) => {
        formData.append('documents', doc);
      });

      imageFiles.forEach((img) => {
        formData.append('images', img);
      });

      const apiUrl = `${API_BASE}/workspace/unified-dna-preview`;
      const res = await fetch(apiUrl, {
        method: 'POST',
        body: formData
      });

      const data = await res.json();
      const extractedWorkspace = data.workspace || data.brandProfile;

      if (data.success && extractedWorkspace) {
        const normalized = normalizeBrandDna(extractedWorkspace);
        
        // Retain raw scraped data and custom uploaded logo/images
        if (data.rawScrapedData || extractedWorkspace.rawScrapedData) {
          normalized.rawScrapedData = data.rawScrapedData || extractedWorkspace.rawScrapedData;
        }
        if (logoPreview) {
          normalized.logoUrl = logoPreview;
          normalized.faviconUrl = logoPreview;
        }
        if (imagePreviews.length > 0) {
          normalized.uploadedBrandImages = imagePreviews.map((p) => p.url);
        }

        setResult(normalized);
      } else {
        alert(data.error || 'Failed to extract Brand DNA. Please verify inputs.');
      }
    } catch (err) {
      console.error('Unified extraction error:', err);
      alert('An error occurred while extracting Brand DNA. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const confirmSaveWorkspace = async () => {
    if (result) {
      await addWorkspace(result);
      if (setActiveModule) {
        setActiveModule('brand-dna');
      }
      setIsScraperOpen(false);
      setResult(null);
      setUrl('');
      setBrandName('');
      setLogoFile(null);
      setLogoPreview(null);
      setDocumentFiles([]);
      setImageFiles([]);
      setImagePreviews([]);

      if (window.location.pathname !== '/brand-dna') {
        window.location.href = '/brand-dna';
      }
    }
  };

  const isFormValid = url.trim().length > 0 || documentFiles.length > 0 || logoFile !== null || imageFiles.length > 0;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
      <div className="w-full max-w-[95vw] sm:max-w-2xl md:max-w-4xl bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-5 text-slate-900 max-h-[92vh] overflow-y-auto">

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 to-brand-500 flex items-center justify-center text-white shadow-lg shadow-brand-500/30">
              <Dna className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-slate-900 text-base sm:text-lg">
                {t('domainWebScraperSetup', 'Domain Web Scraper & Brand DNA Setup')}
              </h2>
              <p className="text-xs text-brand-500 font-semibold">
                {t('tenPointBrandDnaEngine', '10-Point Expert Brand DNA Extraction Engine')}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsScraperOpen(false)}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!result ? (
          /* STEP 1: SINGLE UNIFIED INPUT FORM */
          <form onSubmit={handleExtractBrandDna} className="space-y-5">
            
            {/* SECTION 1: WEBSITE & BRAND NAME */}
            <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200/80 space-y-3.5">
              <div className="flex items-center gap-2 text-xs font-extrabold text-slate-700 uppercase tracking-wider">
                <Globe className="w-4 h-4 text-brand-500" />
                <span>1. Website Domain & Brand Name</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    {t('targetDomainUrl', 'Target Domain URL')}
                  </label>
                  <div className="relative">
                    <Globe className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      placeholder="e.g. https://nike.com"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all font-semibold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    {t('brandNameOptional', 'Brand / Company Name (Optional)')}
                  </label>
                  <div className="relative">
                    <Building className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      placeholder="e.g. Nike"
                      value={brandName}
                      onChange={(e) => setBrandName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all font-semibold"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 2: CUSTOM BRAND LOGO UPLOAD */}
            <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-extrabold text-slate-700 uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>2. Brand Logo</span>
                </div>
                {logoFile && (
                  <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Logo Selected
                  </span>
                )}
              </div>

              {!logoPreview ? (
                <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-slate-200 rounded-2xl bg-white hover:bg-slate-100/50 cursor-pointer transition-all text-center">
                  <div className="w-10 h-10 rounded-xl bg-brand-500/10 text-brand-500 flex items-center justify-center mb-1.5">
                    <Upload className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-slate-800">Upload High-Res Brand Logo</span>
                  <span className="text-[10px] text-slate-400 font-medium mt-0.5">Supports PNG, SVG, JPG, WEBP</span>
                  <input type="file" accept="image/png,image/jpeg,image/svg+xml,image/webp" onChange={handleLogoSelect} className="hidden" />
                </label>
              ) : (
                <div className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <img src={logoPreview} alt="Brand Logo Preview" className="w-12 h-12 rounded-xl object-contain bg-slate-50 p-1 border border-slate-200 shadow-sm" />
                    <div>
                      <h5 className="text-xs font-extrabold text-slate-900">{logoFile?.name || 'Uploaded Brand Logo'}</h5>
                      <p className="text-[10px] text-slate-500 font-semibold">{formatFileSize(logoFile?.size)}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveLogo}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* SECTION 3: MULTIPLE BRAND GUIDELINES / DOCUMENTS */}
            <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-extrabold text-slate-700 uppercase tracking-wider">
                  <FileText className="w-4 h-4 text-blue-500" />
                  <span>3. Brand Guideline Documents (Multiple)</span>
                </div>
                {documentFiles.length > 0 && (
                  <span className="text-[11px] text-brand-600 font-extrabold bg-brand-50 px-2.5 py-0.5 rounded-full border border-brand-200">
                    {documentFiles.length} {documentFiles.length === 1 ? 'Document' : 'Documents'}
                  </span>
                )}
              </div>

              {/* Upload Dropzone */}
              <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-slate-200 rounded-2xl bg-white hover:bg-slate-100/50 cursor-pointer transition-all text-center">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center mb-1.5">
                  <FileText className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-slate-800">Upload PDF, Word Decks, or Text Guidelines</span>
                <span className="text-[10px] text-slate-400 font-medium mt-0.5">Select multiple files (.pdf, .doc, .docx, .txt)</span>
                <input type="file" multiple accept=".pdf,.doc,.docx,.txt" onChange={handleDocumentsSelect} className="hidden" />
              </label>

              {/* Document Files Chips List */}
              {documentFiles.length > 0 && (
                <div className="space-y-2 mt-2">
                  {documentFiles.map((doc, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2.5 bg-white border border-slate-200 rounded-xl">
                      <div className="flex items-center gap-2.5 truncate">
                        <span className="px-2 py-0.5 bg-blue-50 text-blue-600 font-extrabold text-[10px] rounded-md border border-blue-200 uppercase">
                          {doc.name.split('.').pop()}
                        </span>
                        <span className="text-xs font-bold text-slate-800 truncate max-w-[240px] sm:max-w-sm">{doc.name}</span>
                        <span className="text-[10px] text-slate-400 font-semibold">({formatFileSize(doc.size)})</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveDocument(idx)}
                        className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* SECTION 4: MULTIPLE BRAND IMAGES & MEDIA ASSETS */}
            <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-extrabold text-slate-700 uppercase tracking-wider">
                  <Image className="w-4 h-4 text-purple-500" />
                  <span>4. Brand Images & Banners (Multiple)</span>
                </div>
                {imageFiles.length > 0 && (
                  <span className="text-[11px] text-purple-600 font-extrabold bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
                    {imageFiles.length} {imageFiles.length === 1 ? 'Image' : 'Images'}
                  </span>
                )}
              </div>

              {/* Upload Dropzone */}
              <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-slate-200 rounded-2xl bg-white hover:bg-slate-100/50 cursor-pointer transition-all text-center">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center mb-1.5">
                  <Image className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-slate-800">Upload Product Photos, Creatives & Banners</span>
                <span className="text-[10px] text-slate-400 font-medium mt-0.5">Select multiple images (.png, .jpg, .jpeg, .webp)</span>
                <input type="file" multiple accept="image/*" onChange={handleImagesSelect} className="hidden" />
              </label>

              {/* Image Previews Grid */}
              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2.5 pt-1">
                  {imagePreviews.map((img, idx) => (
                    <div key={img.id || idx} className="relative group rounded-xl overflow-hidden border border-slate-200 aspect-square bg-slate-100 shadow-sm">
                      <img src={img.url} alt={`Brand Media ${idx + 1}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="absolute top-1 right-1 p-1 bg-slate-900/80 text-white hover:bg-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* UNIFIED SUBMIT ACTION BUTTON */}
            <button
              type="submit"
              disabled={loading || !isFormValid}
              className="w-full btn-primary py-4 rounded-2xl font-extrabold text-xs shadow-xl shadow-brand-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all hover:scale-[1.005]"
            >
              {loading ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin text-amber-300" />
                  <span>Scraping Website & Extracting Unified Brand DNA...</span>
                </>
              ) : (
                <>
                  <Dna className="w-4.5 h-4.5" />
                  <span>Extract & Generate Complete Brand DNA Memory</span>
                </>
              )}
            </button>
          </form>
        ) : (
          /* STEP 2: PREVIEW & SAVE EXTRACTED BRAND DNA MEMORY */
          <div className="space-y-4 animate-in fade-in">
            {/* Top Brand Banner */}
            <div className="p-4 rounded-2xl bg-brand-500/10 border border-brand-500/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img 
                  src={result.logoUrl || result.faviconUrl || `https://www.google.com/s2/favicons?domain=${result.domainUrl || 'google.com'}&sz=128`} 
                  alt={result.brandName} 
                  onError={(e) => {
                    e.target.onerror = null;
                    const domain = (result.domainUrl || '').replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0];
                    e.target.src = `https://www.google.com/s2/favicons?domain=${domain || 'google.com'}&sz=128`;
                  }}
                  className="w-12 h-12 rounded-xl bg-white p-1 border border-slate-200 object-contain shadow-sm" 
                />

                <div>
                  <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                    {result.brandName}
                    <span className="text-[10px] bg-brand-500 text-white px-2 py-0.5 rounded-full font-extrabold">
                      {result.industryCategory || result.industry || 'Not Specified'}
                    </span>
                  </h3>
                  <p className="text-xs font-bold text-brand-500">{result.domainUrl}</p>
                </div>
              </div>

              <div className="flex gap-1">
                {result.brandColors?.map((c, i) => (
                  <span key={i} className="w-4 h-4 rounded-full border border-slate-300" style={{ backgroundColor: typeof c === 'string' ? c : c.hex }} />
                ))}
              </div>
            </div>

            {/* Display Uploaded Brand Images if available */}
            {Array.isArray(result.uploadedBrandImages) && result.uploadedBrandImages.length > 0 && (
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">Attached Brand Images & Assets ({result.uploadedBrandImages.length})</span>
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {result.uploadedBrandImages.map((imgUrl, i) => (
                    <img key={i} src={imgUrl} alt={`Asset ${i}`} className="w-14 h-14 rounded-xl object-cover border border-slate-200 shadow-sm flex-shrink-0" />
                  ))}
                </div>
              </div>
            )}

            {/* EDITABLE BRAND DNA FORM PREVIEW */}
            <div className="space-y-4 text-xs">
              {/* SECTION 1: COMPANY INFORMATION */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <span className="font-extrabold text-brand-500 uppercase text-[11px] tracking-wider flex items-center gap-1.5">
                    🏢 Core Identity & Business Model
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {/* BRAND NAME */}
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200 focus-within:border-brand-500 transition-all">
                    <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1">BRAND NAME</span>
                    <input
                      type="text"
                      value={result.brandName || ''}
                      onChange={(e) => setResult(prev => ({ ...prev, brandName: e.target.value }))}
                      placeholder="Enter brand name..."
                      className="w-full font-bold text-slate-900 text-xs bg-transparent border-none outline-none p-0"
                    />
                  </div>

                  {/* TAGLINE */}
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200 focus-within:border-brand-500 transition-all">
                    <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1">TAGLINE</span>
                    <input
                      type="text"
                      value={result.tagline || ''}
                      onChange={(e) => setResult(prev => ({ ...prev, tagline: e.target.value }))}
                      placeholder="Enter tagline / slogan..."
                      className="w-full font-bold text-slate-900 text-xs bg-transparent border-none outline-none p-0"
                    />
                  </div>

                  {/* WEBSITE */}
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200 focus-within:border-brand-500 transition-all">
                    <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1">WEBSITE</span>
                    <input
                      type="text"
                      value={result.domainUrl || ''}
                      onChange={(e) => setResult(prev => ({ ...prev, domainUrl: e.target.value, website: e.target.value }))}
                      placeholder="Enter domain URL..."
                      className="w-full font-bold text-brand-500 text-xs bg-transparent border-none outline-none p-0"
                    />
                  </div>

                  {/* INDUSTRY */}
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200 focus-within:border-brand-500 transition-all">
                    <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1">INDUSTRY</span>
                    <input
                      type="text"
                      value={result.industryCategory || result.industry || ''}
                      onChange={(e) => setResult(prev => ({ ...prev, industryCategory: e.target.value, industry: e.target.value }))}
                      placeholder="Enter industry category..."
                      className="w-full font-bold text-slate-900 text-xs bg-transparent border-none outline-none p-0"
                    />
                  </div>

                  {/* COMPANY DESCRIPTION */}
                  <div className="sm:col-span-2 p-2.5 rounded-xl bg-white border border-slate-200 focus-within:border-brand-500 transition-all">
                    <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1">COMPANY DESCRIPTION</span>
                    <textarea
                      rows={3}
                      value={result.companyDescription || result.positioningSummary || result.metaDescription || ''}
                      onChange={(e) => setResult(prev => ({ ...prev, companyDescription: e.target.value }))}
                      placeholder="Enter company description..."
                      className="w-full font-medium text-slate-700 text-xs bg-transparent border-none outline-none p-0 leading-relaxed resize-y"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 2: BRAND IDENTITY & STRATEGY */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <span className="font-extrabold text-brand-500 uppercase text-[11px] tracking-wider flex items-center gap-1.5">
                    ✨ Brand Identity & Strategy
                  </span>
                </div>

                {/* MISSION */}
                <div className="p-2.5 rounded-xl bg-white border border-slate-200 focus-within:border-brand-500 transition-all">
                  <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1">MISSION</span>
                  <textarea
                    rows={2}
                    value={result.missionStatement || result.mission || ''}
                    onChange={(e) => setResult(prev => ({ ...prev, missionStatement: e.target.value, mission: e.target.value }))}
                    placeholder="Enter mission statement..."
                    className="w-full font-medium text-slate-700 text-xs bg-transparent border-none outline-none p-0 leading-relaxed resize-y"
                  />
                </div>

                {/* VISION */}
                <div className="p-2.5 rounded-xl bg-white border border-slate-200 focus-within:border-brand-500 transition-all">
                  <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1">VISION</span>
                  <textarea
                    rows={2}
                    value={result.vision || ''}
                    onChange={(e) => setResult(prev => ({ ...prev, vision: e.target.value }))}
                    placeholder="Enter vision statement..."
                    className="w-full font-medium text-slate-700 text-xs bg-transparent border-none outline-none p-0 leading-relaxed resize-y"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={confirmSaveWorkspace}
              className="w-full btn-primary py-3.5 rounded-xl font-bold text-xs shadow-lg shadow-brand-500/30 flex items-center justify-center gap-2"
            >
              <ArrowRight className="w-4 h-4" />
              Save & Lock Brand DNA Memory
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
