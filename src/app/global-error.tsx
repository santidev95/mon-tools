"use client";

import NextError from "next/error";

export default function GlobalError({ error }: { error: Error }) {
  return (
    <html>
      <body>
        {/* `NextError` is the default Next.js error page component. Its type
        definition requires a `statusCode` prop. However, since the App Router
        does not expose status codes for errors, we simply pass 0 to render a
        generic error message. */}
        <NextError statusCode={0} />
        {/* Optionally, render error details for debugging (remove in production) */}
        <pre style={{ color: "red", marginTop: 16 }}>{error?.message}</pre>
      </body>
    </html>
  );
}