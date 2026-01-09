export const resolveImagePath = (imgPath) => {
    if (!imgPath || typeof imgPath !== 'string') {
        return "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=1000";
    }

    if (imgPath.startsWith("http")) return imgPath;

    // Normalize: backslashes to forward slashes
    let cleanPath = imgPath.replace(/\\/g, "/");

    // Smart extraction: handle absolute paths containing "uploads/"
    // This handles cases like "C:/Users/.../server/uploads/img.jpg" or "uploads/img.jpg"
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
    // Fallback to http://127.0.0.1:5000 for local development if env is missing, localhost, OR if we are running on localhost
    let baseUrl = import.meta.env.VITE_IMAGE_BASE_URL;

    // Check if we are running locally (frontend on localhost)
    const isLocal = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

    if (!baseUrl || baseUrl.includes("localhost") || isLocal) {
        baseUrl = "http://127.0.0.1:5000";
    }

    // Cleanup base url
    if (baseUrl.endsWith("/")) baseUrl = baseUrl.slice(0, -1);

    try {
        const url = new URL(cleanPath, baseUrl);
        return url.href;
    } catch (e) {
        console.error("Image URL Error:", cleanPath, baseUrl);
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
