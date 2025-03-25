import { useState } from "react";
import { ImageOff } from "lucide-react";

function ImageWithFallback({ src, alt = "Image", size = "30" }) {
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  if (error) {
    return (
      <span className="no-image">
        <ImageOff strokeWidth="1.2" size={size} />
      </span>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      onLoad={() => setLoaded(true)}
      onError={() => setError(true)}
      style={{ visibility: loaded ? "visible" : "hidden" }}
    />
  );
}

export { ImageWithFallback };
