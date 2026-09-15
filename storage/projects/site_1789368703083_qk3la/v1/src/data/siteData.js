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
    "title": "TerraClay Artisans",
    "businessType": "Artisanal Handmade Pottery Shop",
    "industry": "Home Decor & Artisanal Crafts",
    "targetAudience": [
      "Home decor enthusiasts",
      "Eco-conscious shoppers",
      "Plant lovers and gardeners"
    ]
  },
  "websiteType": "Interactive Web Application",
  "designSpec": {
    "theme": "warm-terracotta",
    "primaryColor": "#C2410C",
    "secondaryColor": "#78350F",
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
        "label": "Shop Collection",
        "pageName": "Shop Collection",
        "slug": "shop"
      },
      {
        "label": "Our Craft",
        "pageName": "Our Craft",
        "slug": "our-craft"
      }
    ],
    "footerLinks": [
      {
        "label": "Shop Collection",
        "pageName": "Shop Collection",
        "slug": "shop"
      },
      {
        "label": "Our Craft",
        "pageName": "Our Craft",
        "slug": "our-craft"
      }
    ]
  },
  "ctaRequirements": {
    "primaryCTA": "Explore Collection",
    "secondaryCTA": "Our Philosophy"
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
      "id": "page_shop_collection",
      "name": "Shop Collection",
      "slug": "shop",
      "purpose": "Showcase the artisanal clay collection with filtering, dynamic product views, and direct add-to-cart capabilities.",
      "source": "user_requested",
      "sections": [
        {
          "id": "comp_shop_0_herobanner",
          "type": "HeroBanner",
          "title": "Earth Born. Hand Shaped.",
          "purpose": "Introduce the artisanal nature of the shop with a strong conversion-focused value proposition.",
          "source": "user_requested",
          "approvedAssetId": "asset_shop_sec_0_hero",
          "styles": {
            "primaryColor": "#C2410C",
            "secondaryColor": "#78350F",
            "theme": "warm-terracotta"
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
          "headline": "Clay in Its Most Beautiful Form",
          "subheadline": "Explore our hand-thrown pots made from 100 percent natural local clay, designed to let your green companions thrive.",
          "primaryCTA": "Explore Collection",
          "secondaryCTA": "Our Philosophy",
          "imageUrl": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80"
        },
        {
          "id": "comp_shop_1_itemcataloggrid",
          "type": "ItemCatalogGrid",
          "title": "The Artisan Collection",
          "purpose": "Present products with sorting, search, and intuitive checkout entry.",
          "source": "user_requested",
          "approvedAssetId": null,
          "styles": {
            "primaryColor": "#C2410C",
            "secondaryColor": "#78350F",
            "theme": "warm-terracotta"
          },
          "subheadline": "Each piece is uniquely spun, fired, and finished by master potters.",
          "actionType": "ADD_TO_CART",
          "actionLabel": "Add to Cart",
          "drawerTitle": "Your Shopping Cart",
          "categories": [
            "Planters",
            "Vases",
            "Succulent Bowls"
          ],
          "items": [
            {
              "id": "pot_1",
              "name": "The Ochre Ridge Planter",
              "category": "Planters",
              "description": "Medium-sized classic terracotta pot featuring a hand-carved textured ridge detail.",
              "price": "$48.00",
              "badge": "Best Seller",
              "rating": 4.9,
              "imageUrl": "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1200&q=80",
              "hasPaymentButton": true
            },
            {
              "id": "pot_2",
              "name": "Earthy Oasis Basin",
              "category": "Succulent Bowls",
              "description": "Shallow, wide-mouthed clay basin optimal for multi-succulent arrangements.",
              "price": "$36.00",
              "badge": "Eco-Friendly",
              "rating": 4.8,
              "imageUrl": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80&sig=3972",
              "hasPaymentButton": true
            },
            {
              "id": "pot_3",
              "name": "Sage Terracotta Urn",
              "category": "Vases",
              "description": "Tall rustic urn with delicate side handles, featuring a light sage mineral wash.",
              "price": "$64.00",
              "badge": "Limited Edition",
              "rating": 5,
              "imageUrl": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80&sig=3553",
              "hasPaymentButton": true
            }
          ]
        }
      ]
    },
    {
      "id": "page_our_craft",
      "name": "Our Craft",
      "slug": "our-craft",
      "purpose": "Educate buyers on the eco-conscious craftsmanship process to justify premium quality and pricing.",
      "source": "ai_recommended",
      "sections": [
        {
          "id": "comp_our_craft_0_featuregrid",
          "type": "FeatureGrid",
          "title": "Earth to Tabletop Process",
          "purpose": "Illustrate the sustainable steps of creating artisanal earthenware.",
          "source": "ai_recommended",
          "approvedAssetId": "asset_our-craft_sec_0_hero",
          "styles": {
            "primaryColor": "#C2410C",
            "secondaryColor": "#78350F",
            "theme": "warm-terracotta"
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
    }
  ],
  "visualDesignSpec": {
    "colorMood": "warm-earthy",
    "heroStyle": "split-image",
    "layoutPersonality": "structured",
    "imageryKeywords": [
      "terracotta raw texture",
      "potted house plants",
      "sunlit potter studio",
      "cozy minimalist shelf styling"
    ],
    "fontPairing": "serif-editorial",
    "atmosphereNotes": ""
  }
};
