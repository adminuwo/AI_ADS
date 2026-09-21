/**
 * Site Configuration Data
 * Preserves decision attribution model & explicit user requirements.
 *
 * Attribution Sources:
 * - Theme: semantic_inference
 * - Primary Color: semantic_inference
 * - Typography: semantic_inference
 */
export const siteData = {
  "websiteIdentity": {
    "title": "Memorable Furniture",
    "businessType": "Furniture Shop",
    "industry": "Home Furnishings",
    "targetAudience": [
      "Homeowners",
      "Interior Designers"
    ]
  },
  "websiteType": "Interactive Web Application",
  "designSpec": {
    "theme": "Contemporary Elegance",
    "primaryColor": "#8D6E63",
    "secondaryColor": "#D7CCC8",
    "typography": "Montserrat",
    "layoutStyle": "Responsive Container Grid",
    "sources": {
      "theme": "semantic_inference",
      "primaryColor": "semantic_inference",
      "typography": "semantic_inference",
      "visualTone": "semantic_inference"
    }
  },
  "navigationSpec": {
    "headerLinks": [
      {
        "label": "Home",
        "pageName": "Home",
        "slug": "home"
      },
      {
        "label": "Catalog",
        "pageName": "Catalog",
        "slug": "catalog"
      },
      {
        "label": "Contact",
        "pageName": "Contact",
        "slug": "contact"
      }
    ],
    "footerLinks": [
      {
        "label": "Home",
        "pageName": "Home",
        "slug": "home"
      },
      {
        "label": "Catalog",
        "pageName": "Catalog",
        "slug": "catalog"
      },
      {
        "label": "Contact",
        "pageName": "Contact",
        "slug": "contact"
      }
    ]
  },
  "ctaRequirements": {
    "primaryCTA": "Shop Now",
    "secondaryCTA": "View Collection"
  },
  "contactRequirements": {
    "hasContactForm": true,
    "hasWhatsApp": false,
    "hasLocationDetails": false
  },
  "paymentCheckoutSpec": {
    "paymentRequired": true,
    "paymentStatus": "not_requested",
    "supportedMethods": [],
    "checkoutRequired": false,
    "checkoutStatus": "not_requested",
    "authRequired": false
  },
  "pages": [
    {
      "id": "page_home",
      "name": "Home",
      "slug": "home",
      "purpose": "Welcome visitors and introduce the brand",
      "source": "ai_recommended",
      "sections": [
        {
          "id": "comp_home_0_herobanner",
          "type": "HeroBanner",
          "title": "Welcome to Memorable Furniture",
          "purpose": "Capture attention with a striking visual and key message",
          "source": "ai_recommended",
          "approvedAssetId": "asset_home_sec_0_hero",
          "styles": {
            "primaryColor": "#8D6E63",
            "secondaryColor": "#D7CCC8",
            "theme": "Contemporary Elegance"
          },
          "eyebrow": "✨ Sourced Fresh, Delivered Direct",
          "trustBadges": [
            {
              "icon": "truck",
              "label": "Fast Local Delivery"
            },
            {
              "icon": "heart",
              "label": "100% Guaranteed Quality"
            },
            {
              "icon": "star",
              "label": "5.0 Star Experience"
            }
          ],
          "headline": "Make Your Home Memorable",
          "subheadline": "Discover unique furniture pieces that combine style with functionality.",
          "primaryCTA": "Shop Now",
          "secondaryCTA": "View Collection",
          "imageUrl": "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80"
        },
        {
          "id": "comp_home_1_featuregrid",
          "type": "FeatureGrid",
          "title": "Our Exclusive Collections",
          "purpose": "Highlight key furniture collections",
          "source": "ai_recommended",
          "approvedAssetId": "asset_home_sec_1_hero",
          "styles": {
            "primaryColor": "#8D6E63",
            "secondaryColor": "#D7CCC8",
            "theme": "Contemporary Elegance"
          },
          "features": [
            {
              "icon": "Sparkles",
              "title": "Curated Excellence",
              "description": "Every solution built with attention to detail and high standards."
            },
            {
              "icon": "Shield",
              "title": "Reliable Delivery",
              "description": "Consistent quality and ongoing dependable support."
            },
            {
              "icon": "Zap",
              "title": "Seamless Experience",
              "description": "Designed for convenience, speed, and effortless interaction."
            }
          ]
        }
      ]
    },
    {
      "id": "page_catalog",
      "name": "Catalog",
      "slug": "catalog",
      "purpose": "Display all available products",
      "source": "ai_recommended",
      "sections": [
        {
          "id": "comp_catalog_0_itemcataloggrid",
          "type": "ItemCatalogGrid",
          "title": "Our Products",
          "purpose": "Showcase all furniture items with filtering options",
          "source": "ai_recommended",
          "approvedAssetId": null,
          "styles": {
            "primaryColor": "#8D6E63",
            "secondaryColor": "#D7CCC8",
            "theme": "Contemporary Elegance"
          },
          "subheadline": "Filter by style, room, or price to find your perfect piece",
          "actionType": "ADD_TO_CART",
          "actionLabel": "Add to Cart",
          "drawerTitle": "Your Shopping Cart",
          "categories": [
            "Featured",
            "Special"
          ],
          "items": [
            {
              "id": "item_1",
              "name": "Memorable Furniture Selection",
              "category": "Featured",
              "description": "Our featured collection.",
              "price": "Contact for pricing",
              "badge": "Popular",
              "rating": 4.8,
              "imageUrl": "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80",
              "hasPaymentButton": true
            },
            {
              "id": "item_2",
              "name": "Memorable Furniture Edition",
              "category": "Special",
              "description": "An exclusive offering.",
              "price": "Contact for pricing",
              "badge": "Recommended",
              "rating": 4.8,
              "imageUrl": "https://images.unsplash.com/photo-1533090161767-e6ffed986b88?auto=format&fit=crop&w=1200&q=80",
              "hasPaymentButton": true
            }
          ]
        }
      ]
    },
    {
      "id": "page_contact",
      "name": "Contact",
      "slug": "contact",
      "purpose": "Provide contact information and an inquiry form",
      "source": "ai_recommended",
      "sections": [
        {
          "id": "comp_contact_0_contactinquiryform",
          "type": "ContactInquiryForm",
          "title": "Get in Touch",
          "purpose": "Facilitate communication with potential customers",
          "source": "ai_recommended",
          "approvedAssetId": null,
          "styles": {
            "primaryColor": "#8D6E63",
            "secondaryColor": "#D7CCC8",
            "theme": "Contemporary Elegance"
          },
          "fields": [
            {
              "label": "Full Name",
              "type": "text",
              "placeholder": "Your name"
            },
            {
              "label": "Email Address",
              "type": "email",
              "placeholder": "you@email.com"
            },
            {
              "label": "Message",
              "type": "textarea",
              "placeholder": "How can we help you?"
            }
          ],
          "hasWhatsAppButton": false,
          "submitLabel": "Send Message"
        }
      ]
    }
  ],
  "visualDesignSpec": {
    "colorMood": "neutral-elegant",
    "heroStyle": "split-image",
    "layoutPersonality": "structured",
    "imageryKeywords": [
      "Modern Sofa",
      "Elegant Table",
      "Stylish Chair"
    ],
    "fontPairing": "sans-modern",
    "atmosphereNotes": ""
  }
};
