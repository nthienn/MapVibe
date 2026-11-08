import { useEffect, useRef, useState } from "react";

const ListingPricing = ({ pricingCategories, pricingItems, pricingOrder }) => {
  const pricingRef = useRef(null);
  const [isPricingExpanded, setIsPricingExpanded] = useState(false);
  const [pricingHeight, setPricingHeight] = useState("450px");

  const getPricingBlock = (block) => {
    if (block.type === "item") {
      return pricingItems.find((item) => item.id === block.id);
    }

    if (block.type === "category") {
      return pricingCategories.find((category) => category.id === block.id);
    }

    return null;
  };

  useEffect(() => {
    if (pricingRef.current) {
      if (isPricingExpanded) {
        setPricingHeight(`${pricingRef.current.scrollHeight}px`);
      } else {
        setPricingHeight("450px");
      }
    }
  }, [isPricingExpanded]);

  if (
    (!pricingCategories || pricingCategories.length === 0) &&
    (!pricingItems || pricingItems.length === 0)
  ) {
    return null;
  }

  return (
    <div id="listing-pricing-list" className="listing-section">
      <h3 className="listing-desc-headline margin-top-70 margin-bottom-30">
        Pricing
      </h3>
      <div
        ref={pricingRef}
        className={`show-more ${isPricingExpanded ? "visible" : ""}`}
        style={{
          height: pricingHeight,
          transition: "height 0.4s ease-in-out",
        }}
      >
        <div className="pricing-list-container">
          {pricingOrder.map((block) => {
            const pricingBlock = getPricingBlock(block);

            if (!pricingBlock) {
              return null;
            }

            if (block.type === "item") {
              return (
                <ul key={`item-${pricingBlock.id}`}>
                  <li>
                    <h5>{pricingBlock.title}</h5>
                    <p>{pricingBlock.description}</p>
                    <span>{pricingBlock.price} VND</span>
                  </li>
                </ul>
              );
            }

            if (block.type === "category") {
              return (
                <div key={`category-${pricingBlock.id}`}>
                  <h4>{pricingBlock.categoryTitle}</h4>
                  <ul>
                    {pricingBlock.items?.map((item) => (
                      <li key={item.id}>
                        <h5>{item.title}</h5>
                        <p>{item.description}</p>
                        <span>{item.price} VND</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            }

            return null;
          })}
        </div>
      </div>
      <button
        className={`show-more-button ${isPricingExpanded ? "active" : ""}`}
        onClick={() => setIsPricingExpanded(!isPricingExpanded)}
        style={{ border: "none" }}
      >
        {isPricingExpanded ? "Show Less" : "Show More"}{" "}
        <i className="fa fa-angle-down"></i>
      </button>
    </div>
  );
};

export default ListingPricing;
