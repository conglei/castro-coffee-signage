// Castro Coffee Company — coffee beans data (105 items, 1 lb bags)
// Single source of truth, consolidated from the Square POS export
// (castro_beans_menu.json). Lean, self-describing schema — POS-only fields
// (square_token, grind_options, size, type, is_* flags) are intentionally dropped;
// the signage only needs name, roast, origin, badge, and price.

export interface Bean {
  name: string;
  roast: "Medium" | "Dark";
  /** country/region of origin — omitted for blends */
  origin?: string;
  /** display badge for premium lots: "Organic" | "Reserve" | "Rare" */
  badge?: string;
  /** price in USD for a 1 lb bag */
  price: string;
}

export interface BeanSection {
  name: string;
  items: Bean[];
}

export interface BeansMenu {
  store: string;
  menu: string;
  sections: BeanSection[];
}

export const BEANS_MENU: BeansMenu = {
  "store": "Castro Coffee Company",
  "menu": "Coffee Beans (1 lb bags)",
  "sections": [
    {
      "name": "House & Medium Blends",
      "items": [
        {
          "name": "California Blend",
          "roast": "Medium",
          "price": "13.95"
        },
        {
          "name": "Castro Breakfast-Blend",
          "roast": "Medium",
          "price": "12.50"
        },
        {
          "name": "House Blend",
          "roast": "Medium",
          "price": "13.95"
        },
        {
          "name": "House Sumatra Medium",
          "roast": "Medium",
          "price": "12.50",
          "origin": "Sumatra"
        },
        {
          "name": "Morning Rush",
          "roast": "Medium",
          "price": "12.50"
        },
        {
          "name": "North Beach",
          "roast": "Medium",
          "price": "12.50"
        },
        {
          "name": "SF Breakfast",
          "roast": "Medium",
          "price": "13.95"
        },
        {
          "name": "Sweet Italian",
          "roast": "Medium",
          "price": "13.95"
        },
        {
          "name": "Viennese Blend",
          "roast": "Medium",
          "price": "12.95"
        },
        {
          "name": "Arabic Blend #1",
          "roast": "Medium",
          "price": "13.95"
        }
      ]
    },
    {
      "name": "Single-Origin",
      "items": [
        {
          "name": "Brazil Bourbon Santos",
          "roast": "Medium",
          "price": "13.95",
          "origin": "Brazil"
        },
        {
          "name": "Colombian",
          "roast": "Medium",
          "price": "12.50",
          "origin": "Colombia"
        },
        {
          "name": "Colombian Supremo",
          "roast": "Medium",
          "price": "13.95",
          "origin": "Colombia"
        },
        {
          "name": "Costa Rica Tarrazu",
          "roast": "Medium",
          "price": "13.95",
          "origin": "Costa Rica"
        },
        {
          "name": "Ethiopian Harrar",
          "roast": "Dark",
          "price": "17.95",
          "origin": "Ethiopia"
        },
        {
          "name": "Ethiopian Moka",
          "roast": "Medium",
          "price": "14.95",
          "origin": "Ethiopia"
        },
        {
          "name": "Ethiopian Mystic Lion",
          "roast": "Medium",
          "price": "14.50",
          "origin": "Ethiopia"
        },
        {
          "name": "Ethiopian Yirgacheffe",
          "roast": "Medium",
          "price": "17.95",
          "origin": "Ethiopia"
        },
        {
          "name": "Guatemala Antigua",
          "roast": "Medium",
          "price": "13.95",
          "origin": "Guatemala"
        },
        {
          "name": "Guatemala Dark",
          "roast": "Dark",
          "price": "12.50",
          "origin": "Guatemala"
        },
        {
          "name": "Hawaiian Golden Kona",
          "roast": "Medium",
          "price": "16.75",
          "origin": "Hawaii"
        },
        {
          "name": "Indian Monsoon",
          "roast": "Medium",
          "price": "19.00",
          "origin": "India"
        },
        {
          "name": "Kenya AA",
          "roast": "Medium",
          "price": "19.50",
          "origin": "Kenya"
        },
        {
          "name": "Mexican Altura",
          "roast": "Medium",
          "price": "12.50",
          "origin": "Mexico"
        },
        {
          "name": "Moka Java",
          "roast": "Medium",
          "price": "13.95",
          "origin": "Ethiopia"
        },
        {
          "name": "Moka Java dark",
          "roast": "Dark",
          "price": "12.95",
          "origin": "Ethiopia"
        },
        {
          "name": "New Guinea Reserve",
          "roast": "Medium",
          "price": "16.50",
          "origin": "Papua New Guinea"
        },
        {
          "name": "Nicaraguan Estate",
          "roast": "Medium",
          "price": "12.50",
          "origin": "Nicaragua"
        },
        {
          "name": "Sumatra Mandheling dark",
          "roast": "Dark",
          "price": "13.95",
          "origin": "Sumatra"
        },
        {
          "name": "Tanzania Peaberry",
          "roast": "Medium",
          "price": "13.95",
          "origin": "Tanzania"
        },
        {
          "name": "Yemen Mocca hawari",
          "roast": "Medium",
          "price": "24.95",
          "origin": "Yemen"
        }
      ]
    },
    {
      "name": "Dark Roasts",
      "items": [
        {
          "name": "Barbary Coast",
          "roast": "Dark",
          "price": "15.50"
        },
        {
          "name": "Berkeley's Blend",
          "roast": "Dark",
          "price": "13.95"
        },
        {
          "name": "Castro Double Feature",
          "roast": "Dark",
          "price": "13.95"
        },
        {
          "name": "European Royale",
          "roast": "Dark",
          "price": "13.95"
        },
        {
          "name": "Fog Lifter",
          "roast": "Dark",
          "price": "13.95"
        },
        {
          "name": "French Roast",
          "roast": "Dark",
          "price": "12.50"
        },
        {
          "name": "French Roast Classic",
          "roast": "Dark",
          "price": "12.25"
        },
        {
          "name": "French/Italian",
          "roast": "Dark",
          "price": "12.50"
        },
        {
          "name": "Italian Roast Classic",
          "roast": "Dark",
          "price": "13.95"
        },
        {
          "name": "Joe Black",
          "roast": "Dark",
          "price": "15.95"
        },
        {
          "name": "Majestic Blend",
          "roast": "Dark",
          "price": "14.75"
        },
        {
          "name": "Midnight French",
          "roast": "Dark",
          "price": "13.95"
        },
        {
          "name": "Millenium Joe",
          "roast": "Dark",
          "price": "17.50"
        },
        {
          "name": "Red Sea Blend",
          "roast": "Dark",
          "price": "15.50"
        },
        {
          "name": "Rivera French",
          "roast": "Dark",
          "price": "13.95"
        },
        {
          "name": "Road Warrior Blend",
          "roast": "Dark",
          "price": "17.50"
        },
        {
          "name": "SF Sunshine",
          "roast": "Dark",
          "price": "17.50"
        },
        {
          "name": "Triple Dark",
          "roast": "Dark",
          "price": "13.92"
        },
        {
          "name": "Vienna Dark Roast",
          "roast": "Dark",
          "price": "12.50"
        },
        {
          "name": "Presidio Dark",
          "roast": "Dark",
          "price": "14.95"
        }
      ]
    },
    {
      "name": "Espresso Blends",
      "items": [
        {
          "name": "Espresso Royale",
          "roast": "Dark",
          "price": "13.95"
        },
        {
          "name": "Espresso Ultima",
          "roast": "Dark",
          "price": "13.95"
        },
        {
          "name": "Malabar Gold",
          "roast": "Dark",
          "price": "20.00",
          "origin": "India"
        },
        {
          "name": "Rocket Espresso",
          "roast": "Dark",
          "price": "17.50"
        }
      ]
    },
    {
      "name": "Flavored",
      "items": [
        {
          "name": "Amaretto",
          "roast": "Medium",
          "price": "14.50"
        },
        {
          "name": "Banana Cream",
          "roast": "Medium",
          "price": "13.95"
        },
        {
          "name": "Caramel Cream",
          "roast": "Medium",
          "price": "13.95"
        },
        {
          "name": "Chocolate Mint",
          "roast": "Medium",
          "price": "13.95"
        },
        {
          "name": "Chocolate Raspberry",
          "roast": "Medium",
          "price": "13.50"
        },
        {
          "name": "Cinnamon Frangelico",
          "roast": "Medium",
          "price": "13.95"
        },
        {
          "name": "Dark Chocolate Truffle",
          "roast": "Medium",
          "price": "13.95"
        },
        {
          "name": "French Vanilla",
          "roast": "Medium",
          "price": "11.95"
        },
        {
          "name": "Hawaiian Coconut",
          "roast": "Medium",
          "price": "13.95",
          "origin": "Hawaii"
        },
        {
          "name": "Hazelnut",
          "roast": "Medium",
          "price": "12.95"
        },
        {
          "name": "Irish Cream",
          "roast": "Medium",
          "price": "12.95"
        },
        {
          "name": "Kona Macadamia",
          "roast": "Medium",
          "price": "13.95",
          "origin": "Hawaii"
        },
        {
          "name": "Mandarin Orange",
          "roast": "Medium",
          "price": "13.95"
        },
        {
          "name": "Southern Pecan",
          "roast": "Medium",
          "price": "13.95"
        },
        {
          "name": "Torani Syrup",
          "roast": "Medium",
          "price": "11.49"
        },
        {
          "name": "Vanilla Nut Cream",
          "roast": "Medium",
          "price": "12.95"
        },
        {
          "name": "Bourbon Pecan",
          "roast": "Medium",
          "price": "14.50"
        },
        {
          "name": "Chocolate Almond",
          "roast": "Medium",
          "price": "14.50"
        },
        {
          "name": "Chocolate Avalanche",
          "roast": "Medium",
          "price": "14.50"
        },
        {
          "name": "Wild Blueberry",
          "roast": "Medium",
          "price": "14.50"
        }
      ]
    },
    {
      "name": "Organic & Fair Trade",
      "items": [
        {
          "name": "Organic Bali blue moon",
          "roast": "Dark",
          "price": "17.75",
          "origin": "Indonesia",
          "badge": "Organic"
        },
        {
          "name": "Organic Celebes",
          "roast": "Medium",
          "price": "16.50",
          "origin": "Indonesia",
          "badge": "Organic"
        },
        {
          "name": "Organic French",
          "roast": "Dark",
          "price": "17.50",
          "badge": "Organic"
        },
        {
          "name": "Organic Mexican",
          "roast": "Medium",
          "price": "17.50",
          "origin": "Mexico",
          "badge": "Organic"
        },
        {
          "name": "Organic Peru",
          "roast": "Medium",
          "price": "17.50",
          "origin": "Peru",
          "badge": "Organic"
        },
        {
          "name": "Organic Sumatra",
          "roast": "Dark",
          "price": "17.50",
          "origin": "Sumatra",
          "badge": "Organic"
        }
      ]
    },
    {
      "name": "Decaf",
      "items": [
        {
          "name": "Decaf Cinnamon",
          "roast": "Medium",
          "price": "15.50"
        },
        {
          "name": "Decaf Colombian",
          "roast": "Medium",
          "price": "14.95",
          "origin": "Colombia"
        },
        {
          "name": "Decaf Costa Rica",
          "roast": "Medium",
          "price": "14.95",
          "origin": "Costa Rica"
        },
        {
          "name": "Decaf Ethopian",
          "roast": "Medium",
          "price": "14.95"
        },
        {
          "name": "Decaf French Roast",
          "roast": "Dark",
          "price": "14.95"
        },
        {
          "name": "Decaf Guatemala",
          "roast": "Medium",
          "price": "14.95",
          "origin": "Guatemala"
        },
        {
          "name": "Decaf Moka Java",
          "roast": "Medium",
          "price": "14.95",
          "origin": "Ethiopia"
        },
        {
          "name": "Decaf Royale",
          "roast": "Medium",
          "price": "14.50"
        },
        {
          "name": "Decaf Vienna",
          "roast": "Dark",
          "price": "14.95"
        },
        {
          "name": "Decaf Amaretto",
          "roast": "Medium",
          "price": "14.50"
        },
        {
          "name": "Decaf Arabic Blend/Cardamom",
          "roast": "Medium",
          "price": "14.95"
        },
        {
          "name": "Decaf Castro Breakfast",
          "roast": "Medium",
          "price": "14.75"
        },
        {
          "name": "Decaf European Royale",
          "roast": "Dark",
          "price": "14.75"
        },
        {
          "name": "Decaf Italian Roast",
          "roast": "Dark",
          "price": "14.95"
        },
        {
          "name": "Decaf Morning Rush",
          "roast": "Medium",
          "price": "14.95"
        },
        {
          "name": "Decaf Sweet Italian",
          "roast": "Medium",
          "price": "14.75"
        },
        {
          "name": "Fair Trade Organic Decaf (SWP) Italian Roast",
          "roast": "Dark",
          "price": "16.95",
          "badge": "Organic"
        },
        {
          "name": "Fair Trade Organic Decaf (SWP) French Roast",
          "roast": "Dark",
          "price": "16.95",
          "badge": "Organic"
        }
      ]
    },
    {
      "name": "Rare & Reserve",
      "items": [
        {
          "name": "Aroma Di Napoli",
          "roast": "Dark",
          "price": "39.00",
          "badge": "Reserve"
        },
        {
          "name": "Geisha Esmeralda",
          "roast": "Medium",
          "price": "125.00",
          "origin": "Panama",
          "badge": "Rare"
        },
        {
          "name": "Hawaiian Fancy Kona",
          "roast": "Medium",
          "price": "80.00",
          "origin": "Hawaii",
          "badge": "Reserve"
        },
        {
          "name": "Jamaican Blue Mountain",
          "roast": "Medium",
          "price": "95.00",
          "origin": "Jamaica",
          "badge": "Reserve"
        },
        {
          "name": "Kopi Luwak ( Special Order )",
          "roast": "Medium",
          "price": "695.00",
          "origin": "Indonesia/Civet",
          "badge": "Rare"
        },
        {
          "name": "Le Eseralda Geisha",
          "roast": "Medium",
          "price": "175.00",
          "origin": "Panama",
          "badge": "Rare"
        }
      ]
    }
  ]
};

// Convenience lookup by section name (insertion order is preserved).
export const BEANS: Record<string, Bean[]> = Object.fromEntries(
  BEANS_MENU.sections.map((s) => [s.name, s.items]),
);
