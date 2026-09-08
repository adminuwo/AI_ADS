import { getBrandLogoUrl } from './brandLogoHelper';

/**
 * Triggers a file download directly to the user's device.
 * Burns brand logo and brand name watermark badge onto canvas prior to downloading.
 */
export const downloadImageToDevice = async (imageUrl, defaultFilename = 'ai_ads_visual.jpg', brandOptions = {}) => {
  if (!imageUrl) return false;

  // Extract brand details or fallback from localStorage if available
  let brandName = brandOptions.brandName || brandOptions.brand;
  let domainUrl = brandOptions.domainUrl || brandOptions.domain;
  let logoUrl = brandOptions.logoUrl || brandOptions.faviconUrl;

  if (!brandName) {
    try {
      const activeWsId = localStorage.getItem('aisa_active_ws_id');
      const wsListStr = localStorage.getItem('aisa_workspaces');
      if (wsListStr) {
        const wsList = JSON.parse(wsListStr);
        const activeWs = wsList.find(w => w.id === activeWsId || w._id === activeWsId) || wsList[0];
        if (activeWs) {
          brandName = activeWs.brandName;
          domainUrl = domainUrl || activeWs.domainUrl;
          logoUrl = logoUrl || activeWs.logoUrl || activeWs.faviconUrl;
        }
      }
    } catch (e) {}
  }
  brandName = brandName || 'Brand';
  logoUrl = getBrandLogoUrl({ brandName, domainUrl, logoUrl });

  // Sanitize filename to ASCII for clean file system & header compliance
  const fileName = (defaultFilename || 'ai_ads_visual.jpg')
    .replace(/[^\x20-\x7E]/g, '') // remove non-ASCII characters like ™, ®, ©
    .replace(/\s+/g, '_')
    .replace(/[^a-zA-Z0-9_\-\.]/g, '') || `ai_ads_visual_${Date.now()}.jpg`;

  /**
   * Internal Helper: Renders base image onto canvas with glassmorphic brand logo overlay badge
   */
  const renderWatermarkedCanvasDataUrl = async (imgSrc) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = async () => {
        try {
          const w = img.naturalWidth || img.width || 1080;
          const h = img.naturalHeight || img.height || 1080;
          const canvas = document.createElement('canvas');
          canvas.width = w;
          canvas.height = h;

          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, w, h);

          // Calculate proportional dimensions based on canvas resolution
          const scale = Math.max(w, h) / 1080;

          ctx.save();
          const badgeH = Math.round(52 * scale);
          const maxLogoW = Math.round(160 * scale);
          const badgeX = Math.round(32 * scale);
          const badgeY = Math.round(32 * scale);
          const padding = Math.round(10 * scale);

          // Try loading actual brand logo image
          let logoLoaded = false;
          let logoImg = new Image();
          if (logoUrl) {
            try {
              logoImg.crossOrigin = 'anonymous';
              logoLoaded = await new Promise((resLogo) => {
                logoImg.onload = () => resLogo(true);
                logoImg.onerror = () => resLogo(false);
                logoImg.src = logoUrl;
              });
            } catch (e) {
              logoLoaded = false;
            }
          }

          if (logoLoaded && logoImg.width && logoImg.height) {
            const aspect = logoImg.width / logoImg.height;
            const targetH = badgeH - padding * 2;
            const targetW = Math.min(maxLogoW, targetH * aspect);
            const boxW = Math.round(targetW + padding * 2);

            // Glassmorphic container for clean brand logo
            ctx.beginPath();
            if (ctx.roundRect) {
              ctx.roundRect(badgeX, badgeY, boxW, badgeH, Math.round(14 * scale));
            } else {
              ctx.rect(badgeX, badgeY, boxW, badgeH);
            }
            ctx.fillStyle = 'rgba(255, 255, 255, 0.92)';
            ctx.fill();
            ctx.lineWidth = Math.max(1, 1.5 * scale);
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
            ctx.stroke();

            // Draw actual brand logo image preserved in aspect ratio
            const logoX = badgeX + (boxW - targetW) / 2;
            const logoY = badgeY + (badgeH - targetH) / 2;
            ctx.drawImage(logoImg, logoX, logoY, targetW, targetH);
          } else {
            // Text brand fallback if logo image failed
            ctx.font = `800 ${Math.round(16 * scale)}px "Plus Jakarta Sans", -apple-system, sans-serif`;
            const textMetrics = ctx.measureText(brandName.toUpperCase());
            const boxW = Math.round(textMetrics.width + padding * 3);

            ctx.beginPath();
            if (ctx.roundRect) {
              ctx.roundRect(badgeX, badgeY, boxW, badgeH, Math.round(14 * scale));
            } else {
              ctx.rect(badgeX, badgeY, boxW, badgeH);
            }
            ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
            ctx.fill();

            ctx.fillStyle = '#FFFFFF';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(brandName.toUpperCase(), badgeX + boxW / 2, badgeY + badgeH / 2);
          }

          ctx.restore();

          resolve(canvas.toDataURL('image/jpeg', 0.95));
        } catch (err) {
          console.warn('Watermark canvas generation failed:', err);
          resolve(null);
        }
      };
      img.onerror = () => resolve(null);
      img.src = imgSrc;
    });
  };

  const triggerDownloadFromUrl = (urlToDownload) => {
    const link = document.createElement('a');
    link.href = urlToDownload;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Strategy 1: Data URL (Base64 or SVG Data URL) -> Watermark on Canvas
  if (imageUrl.startsWith('data:')) {
    try {
      const watermarked = await renderWatermarkedCanvasDataUrl(imageUrl);
      if (watermarked) {
        triggerDownloadFromUrl(watermarked);
        return true;
      }
      triggerDownloadFromUrl(imageUrl);
      return true;
    } catch (e) {
      console.warn('Data URL watermark download error:', e);
    }
  }

  // Strategy 2: Direct Fetch Blob + Watermark Canvas
  try {
    const res = await fetch(imageUrl, { mode: 'cors' });
    if (res.ok) {
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const watermarked = await renderWatermarkedCanvasDataUrl(blobUrl);
      URL.revokeObjectURL(blobUrl);

      if (watermarked) {
        triggerDownloadFromUrl(watermarked);
        return true;
      }
      const directBlobUrl = URL.createObjectURL(blob);
      triggerDownloadFromUrl(directBlobUrl);
      setTimeout(() => URL.revokeObjectURL(directBlobUrl), 1000);
      return true;
    }
  } catch (e) {
    console.log('Direct fetch blocked by CORS, trying Canvas/Proxy fallback...');
  }

  // Strategy 3: Canvas In-Memory Export with Watermark
  try {
    const watermarked = await renderWatermarkedCanvasDataUrl(imageUrl);
    if (watermarked) {
      triggerDownloadFromUrl(watermarked);
      return true;
    }
  } catch (e) {
    console.log('Canvas export failed, using backend proxy download...');
  }

  // Strategy 4: Backend Proxy Route Fetch -> Convert Blob to Watermarked Canvas
  try {
    const apiBase = window.location.hostname === 'localhost' ? 'http://localhost:5000/api' : '/api';
    const proxyUrl = `${apiBase}/download-image?url=${encodeURIComponent(imageUrl)}&filename=${encodeURIComponent(fileName)}`;

    const response = await fetch(proxyUrl);
    if (response.ok) {
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const watermarked = await renderWatermarkedCanvasDataUrl(blobUrl);

      if (watermarked) {
        URL.revokeObjectURL(blobUrl);
        triggerDownloadFromUrl(watermarked);
        return true;
      }
      triggerDownloadFromUrl(blobUrl);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
      return true;
    }
  } catch (e) {
    console.error('All download methods failed:', e);
  }

  return false;
};
