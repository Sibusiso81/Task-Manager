export default function StructuredData() {
    return (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "Aspire",
            applicationCategory: "ProductivityApplication",
            operatingSystem: "Web",
            description:
              "Aspire is a task management website that helps you turn your broader goals into daily actionable tasks.",
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "USD",
            },
          }),
        }}
      />
    )
  }
  
  