// Castro Coffee Company — coffee beans data (112 items, 1 lb bags)
// Ported from the Claude Design handoff (beans-data.js).
// r: M = Medium roast, D = Dark roast · o = origin · org = organic · ft = fair trade · b = badge

export interface Bean {
  n: string;
  p: string;
  r: "M" | "D";
  o?: string;
  org?: number;
  ft?: number;
  dec?: number;
  b?: string;
}

export type Beans = Record<string, Bean[]>;

export const BEANS: Beans = {
  "House & Medium Blends": [
    {
      "n": "California Blend",
      "p": "13.95",
      "r": "M"
    },
    {
      "n": "Castro Breakfast-Blend",
      "p": "12.50",
      "r": "M"
    },
    {
      "n": "House Blend",
      "p": "13.95",
      "r": "M"
    },
    {
      "n": "House Sumatra Medium",
      "p": "12.50",
      "r": "M",
      "o": "Sumatra"
    },
    {
      "n": "Morning Rush",
      "p": "12.50",
      "r": "M"
    },
    {
      "n": "North Beach",
      "p": "12.50",
      "r": "M"
    },
    {
      "n": "SF Breakfast",
      "p": "13.95",
      "r": "M"
    },
    {
      "n": "Viennese Blend",
      "p": "12.95",
      "r": "M"
    },
    {
      "n": "Arabic Blend #1",
      "p": "13.95",
      "r": "M"
    }
  ],
  "Single-Origin": [
    {
      "n": "Brazil Bourbon Santos",
      "p": "13.95",
      "r": "M",
      "o": "Brazil"
    },
    {
      "n": "Colombian",
      "p": "12.50",
      "r": "M",
      "o": "Colombia"
    },
    {
      "n": "Colombian Supremo",
      "p": "13.95",
      "r": "M",
      "o": "Colombia"
    },
    {
      "n": "Costa Rica Tarrazu",
      "p": "13.95",
      "r": "M",
      "o": "Costa Rica"
    },
    {
      "n": "Ethiopian Harrar",
      "p": "17.95",
      "r": "D",
      "o": "Ethiopia"
    },
    {
      "n": "Ethiopian Moka",
      "p": "14.95",
      "r": "M",
      "o": "Ethiopia"
    },
    {
      "n": "Ethiopian Mystic Lion",
      "p": "14.50",
      "r": "M",
      "o": "Ethiopia"
    },
    {
      "n": "Ethiopian Yirgacheffe",
      "p": "17.95",
      "r": "M",
      "o": "Ethiopia"
    },
    {
      "n": "Guatemala Antigua",
      "p": "13.95",
      "r": "M",
      "o": "Guatemala"
    },
    {
      "n": "Guatemala Dark",
      "p": "12.50",
      "r": "D",
      "o": "Guatemala"
    },
    {
      "n": "Hawaiian Golden Kona",
      "p": "16.75",
      "r": "M",
      "o": "Hawaii"
    },
    {
      "n": "Indian Monsoon",
      "p": "19.00",
      "r": "M",
      "o": "India"
    },
    {
      "n": "Indonesian Dark",
      "p": "13.95",
      "r": "D",
      "o": "Indonesia"
    },
    {
      "n": "Kenya AA",
      "p": "19.50",
      "r": "M",
      "o": "Kenya"
    },
    {
      "n": "Mexican Altura",
      "p": "12.50",
      "r": "M",
      "o": "Mexico"
    },
    {
      "n": "Moka Java",
      "p": "13.95",
      "r": "M",
      "o": "Ethiopia"
    },
    {
      "n": "Moka Java dark",
      "p": "12.95",
      "r": "D",
      "o": "Ethiopia"
    },
    {
      "n": "New Guinea Reserve",
      "p": "16.50",
      "r": "M",
      "o": "Papua New Guinea"
    },
    {
      "n": "Nicaraguan Estate",
      "p": "12.50",
      "r": "M",
      "o": "Nicaragua"
    },
    {
      "n": "Sumatra Mandheling dark",
      "p": "13.95",
      "r": "D",
      "o": "Sumatra"
    },
    {
      "n": "Tanzania Peaberry",
      "p": "13.95",
      "r": "M",
      "o": "Tanzania"
    },
    {
      "n": "Unwashed Zimbabwe",
      "p": "14.00",
      "r": "M",
      "o": "Zimbabwe"
    },
    {
      "n": "Yemen Mocca hawari",
      "p": "24.95",
      "r": "M",
      "o": "Yemen"
    }
  ],
  "Dark Roasts": [
    {
      "n": "Barbary Coast",
      "p": "15.50",
      "r": "D"
    },
    {
      "n": "Berkeley's Blend",
      "p": "13.95",
      "r": "D"
    },
    {
      "n": "Castro Double Feature",
      "p": "13.95",
      "r": "D"
    },
    {
      "n": "Espresso Roast",
      "p": "12.50",
      "r": "D"
    },
    {
      "n": "European Royale",
      "p": "13.95",
      "r": "D"
    },
    {
      "n": "Fog Lifter",
      "p": "13.95",
      "r": "D"
    },
    {
      "n": "French Roast",
      "p": "12.50",
      "r": "D"
    },
    {
      "n": "French Roast Classic",
      "p": "12.25",
      "r": "D"
    },
    {
      "n": "French/Italian",
      "p": "12.50",
      "r": "D"
    },
    {
      "n": "Italian Roast Classic",
      "p": "13.95",
      "r": "D"
    },
    {
      "n": "Jima Joe Blend",
      "p": "13.95",
      "r": "D"
    },
    {
      "n": "Joe Black",
      "p": "15.95",
      "r": "D"
    },
    {
      "n": "Majestic Blend",
      "p": "14.75",
      "r": "D"
    },
    {
      "n": "Midnight French",
      "p": "13.95",
      "r": "D"
    },
    {
      "n": "Millenium Joe",
      "p": "17.50",
      "r": "D"
    },
    {
      "n": "Red Sea Blend",
      "p": "15.50",
      "r": "D"
    },
    {
      "n": "Rivera French",
      "p": "13.95",
      "r": "D"
    },
    {
      "n": "Road Warrior Blend",
      "p": "17.50",
      "r": "D"
    },
    {
      "n": "SF Sunshine",
      "p": "17.50",
      "r": "D"
    },
    {
      "n": "Sweet Italian",
      "p": "13.95",
      "r": "D"
    },
    {
      "n": "Triple Dark",
      "p": "13.92",
      "r": "D"
    },
    {
      "n": "Vienna Dark Roast",
      "p": "12.50",
      "r": "D"
    },
    {
      "n": "Presidio Dark",
      "p": "14.95",
      "r": "D"
    }
  ],
  "Espresso Blends": [
    {
      "n": "Espresso Royale",
      "p": "13.95",
      "r": "D"
    },
    {
      "n": "Espresso Ultima",
      "p": "13.95",
      "r": "D"
    },
    {
      "n": "Espresso Vienna",
      "p": "13.95",
      "r": "D"
    },
    {
      "n": "Malabar Gold",
      "p": "20.00",
      "r": "D",
      "o": "India"
    },
    {
      "n": "Rocket Espresso",
      "p": "17.50",
      "r": "D"
    }
  ],
  "Flavored": [
    {
      "n": "Amaretto",
      "p": "14.50",
      "r": "M"
    },
    {
      "n": "Apricot",
      "p": "13.95",
      "r": "M"
    },
    {
      "n": "Banana Cream",
      "p": "13.95",
      "r": "M"
    },
    {
      "n": "Caramel Cream",
      "p": "13.95",
      "r": "M"
    },
    {
      "n": "Chocolate Mint",
      "p": "13.95",
      "r": "M"
    },
    {
      "n": "Chocolate Raspberry",
      "p": "13.50",
      "r": "M"
    },
    {
      "n": "Cinnamon Frangelico",
      "p": "13.95",
      "r": "M"
    },
    {
      "n": "Dark Chocolate Truffle",
      "p": "13.95",
      "r": "M"
    },
    {
      "n": "French Vanilla",
      "p": "11.95",
      "r": "M"
    },
    {
      "n": "Hawaiian Coconut",
      "p": "13.95",
      "r": "M",
      "o": "Hawaii"
    },
    {
      "n": "Hazelnut",
      "p": "12.95",
      "r": "M"
    },
    {
      "n": "Irish Cream",
      "p": "12.95",
      "r": "M"
    },
    {
      "n": "Kona Macadamia",
      "p": "13.95",
      "r": "M",
      "o": "Hawaii"
    },
    {
      "n": "Mandarin Orange",
      "p": "13.95",
      "r": "M"
    },
    {
      "n": "Southern Pecan",
      "p": "13.95",
      "r": "M"
    },
    {
      "n": "Torani Syrup",
      "p": "11.49",
      "r": "M"
    },
    {
      "n": "Vanilla Nut Cream",
      "p": "12.95",
      "r": "M"
    },
    {
      "n": "Bourbon Pecan",
      "p": "14.50",
      "r": "M"
    },
    {
      "n": "Chocolate Almond",
      "p": "14.50",
      "r": "M"
    },
    {
      "n": "Chocolate Avalanche",
      "p": "14.50",
      "r": "M"
    },
    {
      "n": "Wild Blueberry",
      "p": "14.50",
      "r": "M"
    }
  ],
  "Organic & Fair Trade": [
    {
      "n": "Organic Bali blue moon",
      "p": "17.75",
      "r": "D",
      "o": "Indonesia",
      "org": 1,
      "b": "Organic"
    },
    {
      "n": "Organic Celebes",
      "p": "16.50",
      "r": "M",
      "o": "Indonesia",
      "org": 1,
      "b": "Organic"
    },
    {
      "n": "Organic French",
      "p": "17.50",
      "r": "D",
      "org": 1,
      "b": "Organic"
    },
    {
      "n": "Organic Mexican",
      "p": "17.50",
      "r": "M",
      "o": "Mexico",
      "org": 1,
      "b": "Organic"
    },
    {
      "n": "Organic Peru",
      "p": "17.50",
      "r": "M",
      "o": "Peru",
      "org": 1,
      "b": "Organic"
    },
    {
      "n": "Organic Sumatra",
      "p": "17.50",
      "r": "D",
      "o": "Sumatra",
      "org": 1,
      "b": "Organic"
    }
  ],
  "Decaf": [
    {
      "n": "Decaf Cinnamon",
      "p": "15.50",
      "r": "M",
      "dec": 1
    },
    {
      "n": "Decaf Colombian",
      "p": "14.95",
      "r": "M",
      "o": "Colombia",
      "dec": 1
    },
    {
      "n": "Decaf Costa Rica",
      "p": "14.95",
      "r": "M",
      "o": "Costa Rica",
      "dec": 1
    },
    {
      "n": "Decaf Ethopian",
      "p": "14.95",
      "r": "M",
      "dec": 1
    },
    {
      "n": "Decaf French Roast",
      "p": "14.95",
      "r": "D",
      "dec": 1
    },
    {
      "n": "Decaf Golden Kona",
      "p": "15.95",
      "r": "M",
      "o": "Hawaii",
      "dec": 1
    },
    {
      "n": "Decaf Guatemala",
      "p": "14.95",
      "r": "M",
      "o": "Guatemala",
      "dec": 1
    },
    {
      "n": "Decaf Mexican",
      "p": "14.95",
      "r": "M",
      "o": "Mexico",
      "dec": 1
    },
    {
      "n": "Decaf Moka Java",
      "p": "14.95",
      "r": "M",
      "o": "Ethiopia",
      "dec": 1
    },
    {
      "n": "Decaf Royale",
      "p": "14.50",
      "r": "M",
      "dec": 1
    },
    {
      "n": "Decaf Triple Dark",
      "p": "14.50",
      "r": "D",
      "dec": 1
    },
    {
      "n": "Decaf Vienna",
      "p": "14.95",
      "r": "D",
      "dec": 1
    },
    {
      "n": "Decaf Amaretto",
      "p": "14.50",
      "r": "M",
      "dec": 1
    },
    {
      "n": "Decaf Arabic Blend/Cardamom",
      "p": "14.95",
      "r": "M",
      "dec": 1
    },
    {
      "n": "Decaf Castro Breakfast",
      "p": "14.75",
      "r": "M",
      "dec": 1
    },
    {
      "n": "Decaf European Royale",
      "p": "14.75",
      "r": "D",
      "dec": 1
    },
    {
      "n": "Decaf Italian Roast",
      "p": "14.95",
      "r": "D",
      "dec": 1
    },
    {
      "n": "Decaf Morning Rush",
      "p": "14.95",
      "r": "M",
      "dec": 1
    },
    {
      "n": "Decaf Sweet Italian",
      "p": "14.75",
      "r": "M",
      "dec": 1
    },
    {
      "n": "Fair Trade Organic Decaf (SWP) Italian Roast",
      "p": "16.95",
      "r": "D",
      "org": 1,
      "ft": 1,
      "dec": 1,
      "b": "Organic"
    },
    {
      "n": "Fair Trade Organic Decaf (SWP) French Roast",
      "p": "16.95",
      "r": "D",
      "org": 1,
      "ft": 1,
      "dec": 1,
      "b": "Organic"
    }
  ],
  "Rare & Reserve": [
    {
      "n": "Aroma Di Napoli",
      "p": "39.00",
      "r": "D",
      "b": "Reserve"
    },
    {
      "n": "Hawaiian Fancy Kona",
      "p": "80.00",
      "r": "M",
      "o": "Hawaii",
      "b": "Reserve"
    },
    {
      "n": "Kopi Luwak ( Special Order )",
      "p": "695.00",
      "r": "M",
      "o": "Indonesia/Civet",
      "b": "Rare"
    },
    {
      "n": "Le Eseralda Geisha",
      "p": "175.00",
      "r": "M",
      "o": "Panama",
      "b": "Rare"
    }
  ]
};
