export const resolveImagePath = (imgPath) => {
    // console.log("Resolving Image Path Input:", imgPath);
    if (!imgPath || typeof imgPath !== 'string') {
        return "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=1000";
    }

    if (imgPath.startsWith("http")) return imgPath;

    // Normalize: backslashes to forward slashes
    let cleanPath = imgPath.replace(/\\/g, "/");

    // Smart extraction: handle absolute paths containing "uploads/"
    const idx = cleanPath.toLowerCase().indexOf("uploads/");
    if (idx !== -1) {
        cleanPath = cleanPath.substring(idx);
    }

    // Remove leading slashes
    while (cleanPath.startsWith("/")) cleanPath = cleanPath.substring(1);

    // Ensure prefix if not present (and wasn't found by smart extraction)
    if (!cleanPath.toLowerCase().startsWith("uploads/")) {
        cleanPath = `uploads/${cleanPath}`;
    }

    // Resolve Base URL
    let baseUrl = import.meta.env.VITE_IMAGE_BASE_URL;

    // Detect environment
    const isLocal = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

    if (isLocal) {
        // Force local backend for local development
        baseUrl = "http://127.0.0.1:5000";
    } else if (!baseUrl || baseUrl.includes("localhost")) {
        // Force Live Render Backend if we are on Vercel/Live and env is missing or wrongly pointing to localhost
        baseUrl = "https://carent-qdwb.onrender.com";
    }

    // Cleanup base url
    if (baseUrl.endsWith("/")) baseUrl = baseUrl.slice(0, -1);

    try {
        const url = new URL(cleanPath, baseUrl);
        // console.log("Final Resolved URL:", url.href);
        return url.href;
    } catch (e) {
        console.error("Image URL Error:", cleanPath, baseUrl, e);
        return "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=1000";
    }
};

export const getCarImage = (car) => {
    if (!car) return "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=1000";
    let img = car.image;
    if (Array.isArray(img) && img.length > 0) img = img[0];
    if (!img && car.images && car.images.length > 0) img = car.images[0];
    return resolveImagePath(img);
};
