import React, { useEffect } from "react";

export default function AdsenseBanner({ slot = "3737459241" }) {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error("Adsense error:", e);
    }
  }, []);

  return (
    <div style={{ margin: "16px 0", textAlign: "center" }}>
      <ins
        className="adsbygoogle"
        style={{ display: "inline-block", width: 728, height: 90 }}
        data-ad-client="ca-pub-3638606818264256"
        data-ad-slot={slot}
      ></ins>
    </div>
  );
}
