// app/components/ProductDetailsAccordions.tsx
export function ProductDetailsAccordions() {
  const sections = [
    {
      title: 'Spin & Distance',
      content: 'The Vice Pro Plus generates the highest backspin in our line. Short-sided yourself? Pin on a slope? Fast greens? The high spin rates, especially greenside, ensure perfect control. Additionally, its high-energy speed core delivers explosive distance off the tee. The perfect blend of power and precision.',
    },
    {
      title: 'Swing Speed',
      content: 'High ball speeds & ultimate control',
    },
    {
      title: 'Feel',
      content: 'New & Match',
    },
    {
      title: 'New Mix & Match',
      content: 'Mix and match your favorite colors and designs.',
    },
    {
      title: 'Shipping & Customization',
      content: 'Standard shipping within 2 business days. Customizations take up to 2 weeks.',
    },
    {
      title: 'Return Policy',
      content: '30-day returns on unopened products. Custom items non-returnable.',
    },
  ];

  return (
    <div className="product-details-accordions">
      {sections.map((section, index) => (
        <details key={index} className="accordion">
          <summary>{section.title}</summary>
          <p>{section.content}</p>
        </details>
      ))}
    </div>
  );
}