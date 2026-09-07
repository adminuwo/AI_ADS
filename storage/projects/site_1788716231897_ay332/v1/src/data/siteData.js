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
    "title": "Petal & Bloom Boutique",
    "businessType": "Boutique Florist and Flower Delivery",
    "industry": "Floristry and Gift Retail",
    "targetAudience": [
      "Gift buyers seeking fresh floral arrangements",
      "Event planners looking for custom floral designs"
    ]
  },
  "websiteType": "Interactive Web Application",
  "designSpec": {
    "theme": "Luxurious Garden Floral",
    "primaryColor": "#991B1B",
    "secondaryColor": "#14532D",
    "typography": "Playfair Display",
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
        "slug": "index"
      },
      {
        "label": "Shop Catalog",
        "pageName": "Shop Catalog",
        "slug": "catalog"
      },
      {
        "label": "Event Styling",
        "pageName": "Event Styling",
        "slug": "events"
      }
    ],
    "footerLinks": [
      {
        "label": "Home",
        "pageName": "Home",
        "slug": "index"
      },
      {
        "label": "Shop Catalog",
        "pageName": "Shop Catalog",
        "slug": "catalog"
      },
      {
        "label": "Event Styling",
        "pageName": "Event Styling",
        "slug": "events"
      }
    ]
  },
  "ctaRequirements": {
    "primaryCTA": "Explore Bouquets",
    "secondaryCTA": "Book Event Consultation"
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
      "slug": "index",
      "purpose": "Introduce the artisanal brand, showcase best-selling seasonal collections, establish trust via reviews, and guide users to shop or book consultations",
      "source": "ai_recommended",
      "sections": [
        {
          "id": "comp_index_0_herobanner",
          "type": "HeroBanner",
          "title": "Bespoke Floral Creations Delivered Fresh",
          "purpose": "Capture interest immediately with high-end editorial floral visuals and clear local delivery action",
          "source": "ai_recommended",
          "approvedAssetId": "asset_index_sec_0_hero",
          "styles": {
            "primaryColor": "#991B1B",
            "secondaryColor": "#14532D",
            "theme": "Luxurious Garden Floral"
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
          "headline": "Artisanal Florals Handcrafted for Life's Moments",
          "subheadline": "Sustainably sourced floral arrangements delivered fresh to your door with signature luxury packaging.",
          "primaryCTA": "Explore Bouquets",
          "secondaryCTA": "Book Event Consultation",
          "imageUrl": "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=1200&q=80"
        },
        {
          "id": "comp_index_1_featuregrid",
          "type": "FeatureGrid",
          "title": "The Petal and Bloom Difference",
          "purpose": "Address customer anxieties regarding flower freshness, delivery handling, and sustainability",
          "source": "ai_recommended",
          "approvedAssetId": "asset_index_sec_1_hero",
          "styles": {
            "primaryColor": "#991B1B",
            "secondaryColor": "#14532D",
            "theme": "Luxurious Garden Floral"
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
      "id": "page_shop_catalog",
      "name": "Shop Catalog",
      "slug": "catalog",
      "purpose": "Provide a clean, filterable shopping grid where users can search, filter by price or occasion, and instantly add arrangements to their digital cart",
      "source": "user_requested",
      "sections": [
        {
          "id": "comp_catalog_0_itemcataloggrid",
          "type": "ItemCatalogGrid",
          "title": "Our Signature Arrangements",
          "purpose": "Display all available boutique flower arrangements with live pricing, dynamic tags, and smooth checkout activation",
          "source": "user_requested",
          "approvedAssetId": null,
          "styles": {
            "primaryColor": "#991B1B",
            "secondaryColor": "#14532D",
            "theme": "Luxurious Garden Floral"
          },
          "subheadline": "Choose from our daily curations. Hand-tied and beautifully boxed with custom greeting card options.",
          "actionType": "ADD_TO_CART",
          "actionLabel": "Add to Cart",
          "drawerTitle": "Your Shopping Cart",
          "categories": [
            "All",
            "Spring Specials",
            "Romantic",
            "Minimalist"
          ],
          "items": [
            {
              "id": "flower_1",
              "name": "Blush Meadow Arrangement",
              "category": "Spring Specials",
              "description": "A delicate cluster of garden roses, white astrantia, and fresh silver dollar eucalyptus arranged in a sand-glazed ceramic vessel.",
              "price": "$85.00",
              "badge": "Best Seller",
              "rating": 4.9,
              "imageUrl": "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=1200&q=80",
              "hasPaymentButton": true
            },
            {
              "id": "flower_2",
              "name": "Sienna Sunset Bouquet",
              "category": "Romantic",
              "description": "Bold sunset colors featuring terracotta-hued carnations, dried grasses, and golden orchids, perfect for cozy settings.",
              "price": "$95.00",
              "badge": "Trending",
              "rating": 4.8,
              "imageUrl": "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=1200&q=80&sig=1892",
              "hasPaymentButton": true
            }
          ]
        }
      ]
    },
    {
      "id": "page_event_styling",
      "name": "Event Styling",
      "slug": "events",
      "purpose": "Generate inquiries from high-intent event planners looking for custom floristry installations",
      "source": "ai_recommended",
      "sections": [
        {
          "id": "comp_events_0_contactinquiryform",
          "type": "ContactInquiryForm",
          "title": "Design Your Dream Event",
          "purpose": "Capture detailed lead parameters including event date, approximate budget, floral mood preferences, and location",
          "source": "ai_recommended",
          "approvedAssetId": null,
          "styles": {
            "primaryColor": "#991B1B",
            "secondaryColor": "#14532D",
            "theme": "Luxurious Garden Floral"
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
    "colorMood": "warm-earthy",
    "heroStyle": "split-image",
    "layoutPersonality": "structured",
    "imageryKeywords": [
      "fresh organic roses",
      "minimalist clay flower vases",
      "sunlit bridal floristry installations"
    ],
    "fontPairing": "serif-editorial",
    "atmosphereNotes": ""
  }
};
