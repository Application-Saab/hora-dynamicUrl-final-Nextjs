// import HomeContent from "@/components/HomeContent";

// export default function NotFound() {
//   return (
//     <HomeContent isNotFound = {true}/>
//   );
// }



// "use client";

// import { useEffect } from "react";
// import HomeContent from "@/components/HomeContent";
// import { reportError } from "@/utils/errorReporter";

// export default function NotFound() {
//   useEffect(() => {
//     const error = new Error("404 - Page Not Found");

//     reportError(error, null, {
//       type: "frontend",
//       component: "NotFoundPage",
//       extra: {
//         path: typeof window !== "undefined" ? window.location.pathname : "",
//         fullUrl: typeof window !== "undefined" ? window.location.href : "",
//         referrer: typeof document !== "undefined" ? document.referrer : "",
//       },
//     });
//   }, []);

//   return <HomeContent isNotFound={true} />;
// }




"use client";

import { useEffect, useRef } from "react";
import HomeContent from "@/components/HomeContent";
import { reportError } from "@/utils/errorReporter";

export default function NotFound() {
  const reported = useRef(false);

  useEffect(() => {
    // Strict Mode / re-render se double call mat jane do
    if (reported.current) return;
    reported.current = true;

    const error = new Error("404 - Page Not Found");

    reportError(error, null, {
      type: "frontend",
      component: "NotFoundPage",
      extra: {
        path: window.location.pathname,
        fullUrl: window.location.href,
        referrer: document.referrer,
        isNotFound: true,
      },
    });
  }, []);

  return <HomeContent isNotFound={true} />;
}