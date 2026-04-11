// Auto-generated from data/cameos.csv — do not edit manually
// Run: npm run import-cameos

export interface CameoAppearance {
  cardName: string;
  setName: string;
  number: string;
  notes: string;
}

export interface CameoEntry {
  cardId: string;
  cardName: string;
  setCode: string;
  setName: string;
  mainPokemon: string;
  cameoPokemon: string[];
  notes?: string;
}

export interface CameoRecord {
  dexNumber: number | null;
  cameoPokemon: string;
  appearances: CameoAppearance[];
}

export const CAMEO_DATABASE: CameoRecord[] = [
  {
    "dexNumber": 152,
    "cameoPokemon": "Chikorita",
    "appearances": [
      {
        "cardName": "Pokémon March",
        "setName": "Neo Genesis",
        "number": "102",
        "notes": ""
      },
      {
        "cardName": "Professor Elm's Training Method",
        "setName": "Expedition",
        "number": "148",
        "notes": ""
      },
      {
        "cardName": "Pokémon Park",
        "setName": "Aquapolis",
        "number": "131",
        "notes": ""
      },
      {
        "cardName": "Tropical Present",
        "setName": "Miscellaneous Promos",
        "number": "©2001",
        "notes": "Jumbo"
      },
      {
        "cardName": "Switch",
        "setName": "HeartGold & SoulSilver",
        "number": "102",
        "notes": ""
      },
      {
        "cardName": "Slowbro",
        "setName": "Undaunted",
        "number": "38",
        "notes": ""
      },
      {
        "cardName": "Illusion's Zorua",
        "setName": "2010 Card Design Contest",
        "number": "Pokémon Fan",
        "notes": ""
      },
      {
        "cardName": "Mewtwo",
        "setName": "BW-P Promos",
        "number": "-",
        "notes": "Jumbo"
      },
      {
        "cardName": "Pikachu",
        "setName": "BW-P Promos",
        "number": "©2013",
        "notes": "Jumbo"
      },
      {
        "cardName": "Fennekin",
        "setName": "Fates Collide",
        "number": "10",
        "notes": ""
      },
      {
        "cardName": "Professor Elm's Lecture",
        "setName": "Lost Thunder",
        "number": "188",
        "notes": ""
      },
      {
        "cardName": "Professor Elm's Lecture",
        "setName": "Lost Thunder",
        "number": "213",
        "notes": ""
      },
      {
        "cardName": "Litten",
        "setName": "SM-P Promos",
        "number": "374",
        "notes": ""
      },
      {
        "cardName": "Meowth",
        "setName": "SM-P Promos",
        "number": "375",
        "notes": ""
      },
      {
        "cardName": "Lucky Stadium",
        "setName": "Intro Pack Neo - Totodile",
        "number": "-",
        "notes": "silhouette"
      }
    ]
  },
  {
    "dexNumber": 154,
    "cameoPokemon": "Meganium",
    "appearances": [
      {
        "cardName": "Victory Medal",
        "setName": "L-P Promos",
        "number": "41",
        "notes": ""
      }
    ]
  },
  {
    "dexNumber": 155,
    "cameoPokemon": "Cyndaquil",
    "appearances": [
      {
        "cardName": "Professor Elm",
        "setName": "Neo Genesis",
        "number": "96",
        "notes": ""
      },
      {
        "cardName": "Pokémon March",
        "setName": "Neo Genesis",
        "number": "102",
        "notes": ""
      },
      {
        "cardName": "Professor Elm's Training Method",
        "setName": "Expedition",
        "number": "148",
        "notes": ""
      },
      {
        "cardName": "Pokémon Park",
        "setName": "Aquapolis",
        "number": "131",
        "notes": ""
      },
      {
        "cardName": "Spiky-Eared Pichu M",
        "setName": "2009 Card Design Contest",
        "number": "Kindergarten",
        "notes": ""
      },
      {
        "cardName": "Slowbro",
        "setName": "Undaunted",
        "number": "38",
        "notes": ""
      },
      {
        "cardName": "Illusion's Zorua",
        "setName": "2010 Card Design Contest",
        "number": "Pokémon Fan",
        "notes": ""
      },
      {
        "cardName": "Professor Elm's Lecture",
        "setName": "Lost Thunder",
        "number": "188",
        "notes": ""
      },
      {
        "cardName": "Professor Elm's Lecture",
        "setName": "Lost Thunder",
        "number": "213",
        "notes": ""
      },
      {
        "cardName": "Ethan's Adventure",
        "setName": "Destined Rivals",
        "number": "236",
        "notes": ""
      }
    ]
  },
  {
    "dexNumber": 157,
    "cameoPokemon": "Typhlosion",
    "appearances": [
      {
        "cardName": "Energy Switch",
        "setName": "HeartGold & SoulSilver",
        "number": "91",
        "notes": ""
      },
      {
        "cardName": "Victory Medal",
        "setName": "Battle Road Spring Promo",
        "number": "-",
        "notes": ""
      },
      {
        "cardName": "Victory Medal",
        "setName": "Battle Road Autumn Promo",
        "number": "-",
        "notes": ""
      }
    ]
  },
  {
    "dexNumber": 158,
    "cameoPokemon": "Totodile",
    "appearances": [
      {
        "cardName": "Pokémon March",
        "setName": "Neo Genesis",
        "number": "102",
        "notes": ""
      },
      {
        "cardName": "Professor Elm's Training Method",
        "setName": "Expedition",
        "number": "148",
        "notes": ""
      },
      {
        "cardName": "Slowpoke",
        "setName": "Undaunted",
        "number": "66",
        "notes": ""
      },
      {
        "cardName": "Professor Elm's Lecture",
        "setName": "Lost Thunder",
        "number": "188",
        "notes": ""
      },
      {
        "cardName": "Professor Elm's Lecture",
        "setName": "Lost Thunder",
        "number": "213",
        "notes": ""
      },
      {
        "cardName": "Cofagrigus",
        "setName": "Lost Thunder",
        "number": "100",
        "notes": "statue"
      },
      {
        "cardName": "Lucky Stadium",
        "setName": "Intro Pack Neo - Totodile",
        "number": "-",
        "notes": "silhouette"
      }
    ]
  },
  {
    "dexNumber": 160,
    "cameoPokemon": "Feraligatr",
    "appearances": [
      {
        "cardName": "Pokémon Reversal",
        "setName": "HeartGold & SoulSilver",
        "number": "99",
        "notes": ""
      },
      {
        "cardName": "Victory Medal",
        "setName": "L-P Promos",
        "number": "43",
        "notes": ""
      }
    ]
  },
  {
    "dexNumber": 161,
    "cameoPokemon": "Sentret",
    "appearances": [
      {
        "cardName": "Double Gust",
        "setName": "Neo Genesis",
        "number": "100",
        "notes": ""
      },
      {
        "cardName": "Pokémon March",
        "setName": "Neo Genesis",
        "number": "102",
        "notes": ""
      },
      {
        "cardName": "Moomoo Milk",
        "setName": "Gold, Silver, to a New World...",
        "number": "-",
        "notes": ""
      }
    ]
  },
  {
    "dexNumber": 163,
    "cameoPokemon": "Hoothoot",
    "appearances": [
      {
        "cardName": "Double Gust",
        "setName": "Neo Genesis",
        "number": "100",
        "notes": ""
      },
      {
        "cardName": "Pokémon March",
        "setName": "Neo Genesis",
        "number": "102",
        "notes": ""
      },
      {
        "cardName": "Town Volunteers",
        "setName": "Aquapolis",
        "number": "136",
        "notes": ""
      },
      {
        "cardName": "Sage's Training",
        "setName": "Undaunted",
        "number": "77",
        "notes": ""
      },
      {
        "cardName": "Forest Guardian",
        "setName": "Aquapolis",
        "number": "123",
        "notes": "staff"
      }
    ]
  },
  {
    "dexNumber": 164,
    "cameoPokemon": "Noctowl",
    "appearances": [
      {
        "cardName": "Forest Guardian",
        "setName": "Aquapolis",
        "number": "123",
        "notes": ""
      },
      {
        "cardName": "Psyduck",
        "setName": "SM Promos",
        "number": "199",
        "notes": "sign, only partially visible"
      }
    ]
  },
  {
    "dexNumber": 166,
    "cameoPokemon": "Ledian",
    "appearances": [
      {
        "cardName": "Aether Paradise Conservation Area",
        "setName": "Hidden Fates",
        "number": "SV87",
        "notes": ""
      }
    ]
  },
  {
    "dexNumber": 167,
    "cameoPokemon": "Spinarak",
    "appearances": [
      {
        "cardName": "Ivysaur",
        "setName": "Pokémon GO",
        "number": "2",
        "notes": ""
      }
    ]
  },
  {
    "dexNumber": 169,
    "cameoPokemon": "Crobat",
    "appearances": [
      {
        "cardName": "All-Night Party",
        "setName": "BREAKpoint",
        "number": "96",
        "notes": ""
      },
      {
        "cardName": "Pikachu",
        "setName": "Crown Zenith",
        "number": "160",
        "notes": ""
      },
      {
        "cardName": "Celebratory Fanfare",
        "setName": "S-P Promos",
        "number": "254",
        "notes": ""
      }
    ]
  },
  {
    "dexNumber": 170,
    "cameoPokemon": "Chinchou",
    "appearances": [
      {
        "cardName": "Captain Pikachu",
        "setName": "Pokémon Center promo",
        "number": "-",
        "notes": "Jumbo"
      },
      {
        "cardName": "Galarian Articuno V",
        "setName": "Chilling Reign",
        "number": "170",
        "notes": ""
      },
      {
        "cardName": "Lumineon V",
        "setName": "Crown Zenith",
        "number": "GG39",
        "notes": ""
      }
    ]
  },
  {
    "dexNumber": 171,
    "cameoPokemon": "Lanturn",
    "appearances": [
      {
        "cardName": "Lumineon V",
        "setName": "Crown Zenith",
        "number": "GG39",
        "notes": ""
      },
      {
        "cardName": "Yokohama's Pikachu",
        "setName": "SM-P Promos",
        "number": "280",
        "notes": "submarine"
      }
    ]
  },
  {
    "dexNumber": 172,
    "cameoPokemon": "Pichu",
    "appearances": [
      {
        "cardName": "Lucky Stadium",
        "setName": "Wizards Promos",
        "number": "41",
        "notes": ""
      },
      {
        "cardName": "Pokémon Fan Club",
        "setName": "Aquapolis",
        "number": "130",
        "notes": ""
      },
      {
        "cardName": "Pokémon Pal City",
        "setName": "Kantō Battle City Promo",
        "number": "-",
        "notes": ""
      },
      {
        "cardName": "Pokémon Collector",
        "setName": "HeartGold & SoulSilver",
        "number": "97",
        "notes": ""
      },
      {
        "cardName": "Illusion's Zorua",
        "setName": "2010 Card Design Contest",
        "number": "Pokémon Fan",
        "notes": ""
      },
      {
        "cardName": "Professor Elm's Lecture",
        "setName": "Lost Thunder",
        "number": "188a",
        "notes": ""
      },
      {
        "cardName": "Ethan's Adventure",
        "setName": "Destined Rivals",
        "number": "236",
        "notes": ""
      },
      {
        "cardName": "Team Rocket's Trickery",
        "setName": "Undaunted",
        "number": "78",
        "notes": "silhouette"
      },
      {
        "cardName": "Pokémon Fan Club",
        "setName": "Ultra Prism",
        "number": "133",
        "notes": "costume"
      },
      {
        "cardName": "Pokémon Fan Club",
        "setName": "Ultra Prism",
        "number": "155",
        "notes": ""
      }
    ]
  },
  {
    "dexNumber": 172,
    "cameoPokemon": "Spiky-Eared Pichu",
    "appearances": [
      {
        "cardName": "Arceus",
        "setName": "2009 Card Design Contest",
        "number": "CoroCoro Comic",
        "notes": ""
      },
      {
        "cardName": "Michina Temple",
        "setName": "DPt-P Promos",
        "number": "44",
        "notes": ""
      }
    ]
  },
  {
    "dexNumber": 173,
    "cameoPokemon": "Cleffa",
    "appearances": [
      {
        "cardName": "Moo-Moo Milk",
        "setName": "Neo Genesis",
        "number": "101",
        "notes": ""
      },
      {
        "cardName": "Broken Ground Gym",
        "setName": "Neo Destiny",
        "number": "92",
        "notes": ""
      },
      {
        "cardName": "Tropical Breeze",
        "setName": "VS: Tropical Mega Battle",
        "number": "-",
        "notes": ""
      },
      {
        "cardName": "Paradise Resort",
        "setName": "SV Promos",
        "number": "224",
        "notes": ""
      }
    ]
  },
  {
    "dexNumber": 175,
    "cameoPokemon": "Togepi",
    "appearances": [
      {
        "cardName": "Pokémon Valley",
        "setName": "Miscellaneous Promos",
        "number": "-",
        "notes": "Jumbo"
      },
      {
        "cardName": "New Century Present",
        "setName": "Miscellaneous Promos",
        "number": "-",
        "notes": "Jumbo"
      },
      {
        "cardName": "Light Jolteon",
        "setName": "Neo Destiny",
        "number": "48",
        "notes": ""
      },
      {
        "cardName": "Professor Elm's Lecture",
        "setName": "Lost Thunder",
        "number": "188a",
        "notes": ""
      },
      {
        "cardName": "Ivysaur",
        "setName": "Southern Islands",
        "number": "5",
        "notes": "only partially visible"
      },
      {
        "cardName": "Pikachu",
        "setName": "XY-P Promos",
        "number": "-",
        "notes": "picture"
      }
    ]
  },
  {
    "dexNumber": 176,
    "cameoPokemon": "Togetic",
    "appearances": [
      {
        "cardName": "Togepi",
        "setName": "Team Rocket Returns",
        "number": "50",
        "notes": "shadow"
      }
    ]
  },
  {
    "dexNumber": 177,
    "cameoPokemon": "Natu",
    "appearances": [
      {
        "cardName": "Bouffalant",
        "setName": "Legendary Treasures",
        "number": "107",
        "notes": ""
      },
      {
        "cardName": "Morpeko",
        "setName": "SWSH Promos",
        "number": "31",
        "notes": ""
      },
      {
        "cardName": "Cofagrigus",
        "setName": "Lost Thunder",
        "number": "100",
        "notes": "statue"
      }
    ]
  },
  {
    "dexNumber": 178,
    "cameoPokemon": "Xatu",
    "appearances": [
      {
        "cardName": "Mew",
        "setName": "Art Academy Promo",
        "number": "Phanpy",
        "notes": "this card was only released in German"
      },
      {
        "cardName": "Natu",
        "setName": "Sandstorm",
        "number": "69",
        "notes": "silhouette"
      },
      {
        "cardName": "Pikachu Wearing a Batik Shirt",
        "setName": "SV-P Promos",
        "number": "154",
        "notes": "clothing design; this card was only released in Indonesian"
      }
    ]
  },
  {
    "dexNumber": 179,
    "cameoPokemon": "Mareep",
    "appearances": [
      {
        "cardName": "Tropical Present",
        "setName": "Miscellaneous Promos",
        "number": "early '99",
        "notes": "Jumbo"
      },
      {
        "cardName": "Double Gust",
        "setName": "Neo Genesis",
        "number": "100",
        "notes": ""
      },
      {
        "cardName": "Pokémon March",
        "setName": "Neo Genesis",
        "number": "102",
        "notes": ""
      },
      {
        "cardName": "Twins",
        "setName": "Triumphant",
        "number": "89",
        "notes": ""
      },
      {
        "cardName": "Banette",
        "setName": "Ascended Heroes",
        "number": "234",
        "notes": "ornament"
      }
    ]
  },
  {
    "dexNumber": 180,
    "cameoPokemon": "Flaaffy",
    "appearances": [
      {
        "cardName": "Celebratory Fanfare",
        "setName": "S-P Promos",
        "number": "254",
        "notes": ""
      }
    ]
  },
  {
    "dexNumber": 181,
    "cameoPokemon": "Ampharos",
    "appearances": [
      {
        "cardName": "Mary's Request",
        "setName": "Unseen Forces",
        "number": "86",
        "notes": ""
      },
      {
        "cardName": "Lightning Energy",
        "setName": "HeartGold & SoulSilver",
        "number": "118",
        "notes": "silhouette"
      }
    ]
  },
  {
    "dexNumber": 181,
    "cameoPokemon": "Mega Ampharos",
    "appearances": [
      {
        "cardName": "Ampharos Spirit Link",
        "setName": "Ancient Origins",
        "number": "70",
        "notes": ""
      },
      {
        "cardName": "Poncho-wearing Pikachu",
        "setName": "XY-P Promos",
        "number": "274",
        "notes": "costume"
      }
    ]
  },
  {
    "dexNumber": 182,
    "cameoPokemon": "Bellossom",
    "appearances": [
      {
        "cardName": "Flower Shop Lady",
        "setName": "Undaunted",
        "number": "74",
        "notes": ""
      },
      {
        "cardName": "Illusion's Zorua",
        "setName": "2010 Card Design Contest",
        "number": "Pokémon Fan",
        "notes": ""
      },
      {
        "cardName": "Pretend Tea Ceremony Pikachu",
        "setName": "SM-P Promos",
        "number": "325",
        "notes": ""
      },
      {
        "cardName": "Gardenia's Vigor",
        "setName": "Crown Zenith",
        "number": "GG61",
        "notes": ""
      }
    ]
  },
  {
    "dexNumber": 183,
    "cameoPokemon": "Marill",
    "appearances": [
      {
        "cardName": "Pokémon Valley",
        "setName": "Miscellaneous Promos",
        "number": "-",
        "notes": "Jumbo"
      },
      {
        "cardName": "Tropical Present",
        "setName": "Miscellaneous Promos",
        "number": "late '99",
        "notes": "Jumbo"
      },
      {
        "cardName": "No.1 Trainer",
        "setName": "Battle Road Promo",
        "number": "-",
        "notes": "has prints in Neo and e-Card layouts, with both girl and boy trainers"
      },
      {
        "cardName": "Energy Switch",
        "setName": "Aquapolis",
        "number": "120",
        "notes": ""
      },
      {
        "cardName": "Switch",
        "setName": "HeartGold & SoulSilver",
        "number": "102",
        "notes": ""
      },
      {
        "cardName": "Twins",
        "setName": "Triumphant",
        "number": "89",
        "notes": ""
      },
      {
        "cardName": "Tropical Tidal Wave",
        "setName": "HGSS Promos",
        "number": "18",
        "notes": ""
      },
      {
        "cardName": "Pretend Tea Ceremony Pikachu",
        "setName": "SM-P Promos",
        "number": "325",
        "notes": ""
      },
      {
        "cardName": "Glaceon VMAX",
        "setName": "Evolving Skies",
        "number": "209",
        "notes": ""
      },
      {
        "cardName": "Grotle",
        "setName": "Temporal Forces",
        "number": "164",
        "notes": ""
      },
      {
        "cardName": "Cincinno",
        "setName": "Temporal Forces",
        "number": "183",
        "notes": ""
      },
      {
        "cardName": "Energy Removal 2",
        "setName": "Expedition",
        "number": "140",
        "notes": "silhouette"
      },
      {
        "cardName": "Pikachu",
        "setName": "XY-P Promos",
        "number": "-",
        "notes": "picture"
      }
    ]
  },
  {
    "dexNumber": 184,
    "cameoPokemon": "Azumarill",
    "appearances": [
      {
        "cardName": "Pokémon Personality Test",
        "setName": "Neo Destiny",
        "number": "102",
        "notes": ""
      },
      {
        "cardName": "Kingdra",
        "setName": "Burning Shadows",
        "number": "31",
        "notes": ""
      },
      {
        "cardName": "Glaceon VMAX",
        "setName": "Evolving Skies",
        "number": "209",
        "notes": ""
      }
    ]
  },
  {
    "dexNumber": 185,
    "cameoPokemon": "Sudowoodo",
    "appearances": [
      {
        "cardName": "Flower Shop Lady",
        "setName": "Undaunted",
        "number": "74",
        "notes": ""
      },
      {
        "cardName": "Zeraora and Friends",
        "setName": "SM-P Promos",
        "number": "-",
        "notes": "Jumbo"
      },
      {
        "cardName": "Fighting Energy",
        "setName": "HeartGold & SoulSilver",
        "number": "120",
        "notes": "silhouette"
      }
    ]
  },
  {
    "dexNumber": 186,
    "cameoPokemon": "Politoed",
    "appearances": [
      {
        "cardName": "Fisherman",
        "setName": "Skyridge",
        "number": "125",
        "notes": ""
      },
      {
        "cardName": "Pretend Tea Ceremony Pikachu",
        "setName": "SM-P Promos",
        "number": "325",
        "notes": ""
      }
    ]
  },
  {
    "dexNumber": 187,
    "cameoPokemon": "Hoppip",
    "appearances": [
      {
        "cardName": "Tropical Present",
        "setName": "Miscellaneous Promos",
        "number": "early '99",
        "notes": "Jumbo"
      },
      {
        "cardName": "Double Gust",
        "setName": "Neo Genesis",
        "number": "100",
        "notes": ""
      },
      {
        "cardName": "Pokémon March",
        "setName": "Neo Genesis",
        "number": "102",
        "notes": ""
      },
      {
        "cardName": "Tropical Present",
        "setName": "Miscellaneous Promos",
        "number": "©2001",
        "notes": "Jumbo"
      },
      {
        "cardName": "Tropical Tidal Wave",
        "setName": "HGSS Promos",
        "number": "18",
        "notes": ""
      },
      {
        "cardName": "Pikachu",
        "setName": "SM Promos",
        "number": "234",
        "notes": ""
      },
      {
        "cardName": "Medicham V",
        "setName": "Evolving Skies",
        "number": "186",
        "notes": ""
      },
      {
        "cardName": "Garganacl",
        "setName": "Paradox Rift",
        "number": "202",
        "notes": ""
      },
      {
        "cardName": "Clive",
        "setName": "Paldean Fates",
        "number": "236",
        "notes": ""
      },
      {
        "cardName": "Switch",
        "setName": "Expedition",
        "number": "157",
        "notes": "silhouette"
      }
    ]
  },
  {
    "dexNumber": 188,
    "cameoPokemon": "Skiploom",
    "appearances": [
      {
        "cardName": "Medicham V",
        "setName": "Evolving Skies",
        "number": "186",
        "notes": ""
      }
    ]
  },
  {
    "dexNumber": 189,
    "cameoPokemon": "Jumpluff",
    "appearances": [
      {
        "cardName": "Skiploom",
        "setName": "Lost Thunder",
        "number": "13",
        "notes": ""
      },
      {
        "cardName": "Medicham V",
        "setName": "Evolving Skies",
        "number": "186",
        "notes": ""
      },
      {
        "cardName": "Pikachu",
        "setName": "XY-P Promos",
        "number": "-",
        "notes": "picture"
      }
    ]
  },
  {
    "dexNumber": 190,
    "cameoPokemon": "Aipom",
    "appearances": [
      {
        "cardName": "Chansey",
        "setName": "Expedition",
        "number": "72",
        "notes": ""
      },
      {
        "cardName": "Captain Pikachu",
        "setName": "Pokémon Center promo",
        "number": "-",
        "notes": "Jumbo"
      },
      {
        "cardName": "Pikachu at the Museum",
        "setName": "MEP Promos",
        "number": "-",
        "notes": "gargoyle; Jumbo"
      }
    ]
  },
  {
    "dexNumber": 191,
    "cameoPokemon": "Sunkern",
    "appearances": [
      {
        "cardName": "Apricorn Maker",
        "setName": "Skyridge",
        "number": "121",
        "notes": ""
      },
      {
        "cardName": "Inkay",
        "setName": "XY-P Promos",
        "number": "-",
        "notes": "Jumbo"
      },
      {
        "cardName": "Apricorn Maker",
        "setName": "Celestial Storm",
        "number": "161",
        "notes": ""
      }
    ]
  },
  {
    "dexNumber": 192,
    "cameoPokemon": "Sunflora",
    "appearances": [
      {
        "cardName": "Pokémon Breeder Fields",
        "setName": "Neo Revelation",
        "number": "62",
        "notes": ""
      },
      {
        "cardName": "Artazon",
        "setName": "Paldea Evolved",
        "number": "171",
        "notes": "statue"
      },
      {
        "cardName": "Foongus",
        "setName": "Obsidian Flames",
        "number": "9",
        "notes": ""
      },
      {
        "cardName": "Artazon",
        "setName": "Obsidian Flames",
        "number": "229",
        "notes": ""
      }
    ]
  },
  {
    "dexNumber": 193,
    "cameoPokemon": "Yanma",
    "appearances": [
      {
        "cardName": "Spinarak",
        "setName": "Twlight Masquerade",
        "number": "4",
        "notes": "logo"
      },
      {
        "cardName": "Caretaker",
        "setName": "Twlight Masquerade",
        "number": "144",
        "notes": ""
      },
      {
        "cardName": "Community Center",
        "setName": "Twlight Masquerade",
        "number": "146",
        "notes": ""
      },
      {
        "cardName": "Caretaker",
        "setName": "Twlight Masquerade",
        "number": "203",
        "notes": ""
      }
    ]
  },
  {
    "dexNumber": 194,
    "cameoPokemon": "Wooper",
    "appearances": [
      {
        "cardName": "Pokémon Nurse",
        "setName": "Expedition",
        "number": "145",
        "notes": ""
      },
      {
        "cardName": "Energy Switch",
        "setName": "Aquapolis",
        "number": "120",
        "notes": ""
      },
      {
        "cardName": "Town Volunteers",
        "setName": "Aquapolis",
        "number": "136",
        "notes": ""
      },
      {
        "cardName": "Fisherman",
        "setName": "HeartGold & SoulSilver",
        "number": "92",
        "notes": ""
      },
      {
        "cardName": "Gardevoir ex",
        "setName": "Paldean Fates",
        "number": "233",
        "notes": ""
      },
      {
        "cardName": "Lana's Aid",
        "setName": "Twlight Masquerade",
        "number": "219",
        "notes": ""
      }
    ]
  },
  {
    "dexNumber": 195,
    "cameoPokemon": "Quagsire",
    "appearances": [
      {
        "cardName": "Kangaskhan",
        "setName": "Destined Rivals",
        "number": "204",
        "notes": ""
      }
    ]
  },
  {
    "dexNumber": 196,
    "cameoPokemon": "Espeon",
    "appearances": [
      {
        "cardName": "Pokémon Center",
        "setName": "BW-P Promos",
        "number": "190",
        "notes": ""
      },
      {
        "cardName": "Drapion",
        "setName": "BREAKpoint",
        "number": "54",
        "notes": ""
      },
      {
        "cardName": "Psychic Energy",
        "setName": "HeartGold & SoulSilver",
        "number": "119",
        "notes": "silhouette"
      },
      {
        "cardName": "Poncho-wearing Eevee",
        "setName": "SM-P Promos",
        "number": "140",
        "notes": "costume"
      }
    ]
  },
  {
    "dexNumber": 197,
    "cameoPokemon": "Umbreon",
    "appearances": [
      {
        "cardName": "Illusion's Zorua",
        "setName": "2010 Card Design Contest",
        "number": "Pucchigumi",
        "notes": ""
      },
      {
        "cardName": "Pokémon Center",
        "setName": "BW-P Promos",
        "number": "190",
        "notes": ""
      },
      {
        "cardName": "Oracle",
        "setName": "Skyridge",
        "number": "138",
        "notes": ""
      },
      {
        "cardName": "All-Night Party",
        "setName": "BREAKpoint",
        "number": "96",
        "notes": ""
      },
      {
        "cardName": "Alakazam-EX",
        "setName": "Fates Collide",
        "number": "125",
        "notes": ""
      },
      {
        "cardName": "Karen",
        "setName": "XY Promos",
        "number": "177",
        "notes": ""
      },
      {
        "cardName": "Penny",
        "setName": "Paldean Fates",
        "number": "239",
        "notes": ""
      },
      {
        "cardName": "Darkness Energy",
        "setName": "HeartGold & SoulSilver",
        "number": "121",
        "notes": "silhouette"
      },
      {
        "cardName": "Poncho-wearing Eevee",
        "setName": "SM-P Promos",
        "number": "141",
        "notes": "costume"
      }
    ]
  },
  {
    "dexNumber": 198,
    "cameoPokemon": "Murkrow",
    "appearances": [
      {
        "cardName": "Illusion's Zorua",
        "setName": "2010 Card Design Contest",
        "number": "Pucchigumi",
        "notes": ""
      },
      {
        "cardName": "Pokémon March",
        "setName": "Neo Genesis",
        "number": "102",
        "notes": ""
      },
      {
        "cardName": "Honchkrow",
        "setName": "Guardians Rising",
        "number": "79",
        "notes": ""
      },
      {
        "cardName": "Honchkrow V",
        "setName": "Brilliant Stars",
        "number": "162",
        "notes": ""
      },
      {
        "cardName": "Temple of Sinnoh",
        "setName": "Astral Radiance",
        "number": "214",
        "notes": ""
      },
      {
        "cardName": "Honchkrow",
        "setName": "Phantasmal Flames",
        "number": "58",
        "notes": ""
      }
    ]
  },
  {
    "dexNumber": 199,
    "cameoPokemon": "Slowking",
    "appearances": [
      {
        "cardName": "Pretend Tea Ceremony Pikachu",
        "setName": "SM-P Promos",
        "number": "325",
        "notes": ""
      }
    ]
  },
  {
    "dexNumber": 200,
    "cameoPokemon": "Misdreavus",
    "appearances": [
      {
        "cardName": "Beldum",
        "setName": "Unleashed",
        "number": "44",
        "notes": ""
      },
      {
        "cardName": "Mewtwo",
        "setName": "BW-P Promos",
        "number": "-",
        "notes": "Jumbo"
      },
      {
        "cardName": "Gourgeist",
        "setName": "Art Academy Promo",
        "number": "rina",
        "notes": ""
      },
      {
        "cardName": "Mismagius",
        "setName": "Crimson Invasion",
        "number": "40",
        "notes": ""
      }
    ]
  },
  {
    "dexNumber": 201,
    "cameoPokemon": "Unown",
    "appearances": [
      {
        "cardName": "Ruins of Alph",
        "setName": "Undaunted",
        "number": "76",
        "notes": ""
      },
      {
        "cardName": "Pikachu",
        "setName": "SM Promos",
        "number": "234",
        "notes": ""
      },
      {
        "cardName": "Ruin Wall",
        "setName": "Neo Discovery",
        "number": "74",
        "notes": "carving"
      },
      {
        "cardName": "Energy Ark",
        "setName": "Neo Discovery",
        "number": "75",
        "notes": ""
      },
      {
        "cardName": "Ruin Wall",
        "setName": "Crossing the Ruins...",
        "number": "-",
        "notes": ""
      },
      {
        "cardName": "Eevee",
        "setName": "Premium File 2",
        "number": "-",
        "notes": ""
      },
      {
        "cardName": "Alph Lithograph",
        "setName": "HeartGold & SoulSilver",
        "number": "ONE",
        "notes": ""
      },
      {
        "cardName": "Alph Lithograph",
        "setName": "Unleashed",
        "number": "TWO",
        "notes": ""
      },
      {
        "cardName": "Alph Lithograph",
        "setName": "Undaunted",
        "number": "THREE",
        "notes": ""
      },
      {
        "cardName": "Alph Lithograph",
        "setName": "Triumphant",
        "number": "FOUR",
        "notes": ""
      },
      {
        "cardName": "Golurk V",
        "setName": "Evolving Skies",
        "number": "182",
        "notes": ""
      },
      {
        "cardName": "Genesect V",
        "setName": "Fusion Strike",
        "number": "255",
        "notes": "graffiti"
      }
    ]
  },
  {
    "dexNumber": 202,
    "cameoPokemon": "Wobbuffet",
    "appearances": [
      {
        "cardName": "Thought Wave Machine",
        "setName": "Neo Destiny",
        "number": "96",
        "notes": ""
      },
      {
        "cardName": "Meowth M",
        "setName": "Movie Random Pack",
        "number": "17",
        "notes": ""
      },
      {
        "cardName": "Energy Switch",
        "setName": "HeartGold & SoulSilver",
        "number": "91",
        "notes": ""
      },
      {
        "cardName": "Bewear",
        "setName": "Ash vs Team Rocket",
        "number": "18",
        "notes": ""
      },
      {
        "cardName": "Jessie & James",
        "setName": "Hidden Fates",
        "number": "68",
        "notes": ""
      },
      {
        "cardName": "Switch",
        "setName": "Expedition",
        "number": "157",
        "notes": "silhouette"
      }
    ]
  },
  {
    "dexNumber": 206,
    "cameoPokemon": "Dunsparce",
    "appearances": [
      {
        "cardName": "Mismagius",
        "setName": "Unleashed",
        "number": "5",
        "notes": ""
      },
      {
        "cardName": "Dudunsparce",
        "setName": "Paldea Evolved",
        "number": "229",
        "notes": ""
      },
      {
        "cardName": "Last Chance Potion",
        "setName": "Celestial Storm",
        "number": "135",
        "notes": "picture"
      }
    ]
  },
  {
    "dexNumber": 207,
    "cameoPokemon": "Gligar",
    "appearances": [
      {
        "cardName": "Golurk",
        "setName": "Ancient Origins",
        "number": "41",
        "notes": ""
      }
    ]
  },
  {
    "dexNumber": 208,
    "cameoPokemon": "Steelix",
    "appearances": [
      {
        "cardName": "Metal Energy",
        "setName": "HeartGold & SoulSilver",
        "number": "122",
        "notes": "silhouette"
      },
      {
        "cardName": "Boss's Orders [Corbeau]",
        "setName": "Ascended Heroes",
        "number": "183",
        "notes": "banner"
      },
      {
        "cardName": "Boss's Orders [Corbeau]",
        "setName": "Ascended Heroes",
        "number": "256",
        "notes": ""
      }
    ]
  },
  {
    "dexNumber": 208,
    "cameoPokemon": "Mega Steelix",
    "appearances": [
      {
        "cardName": "Steelix Spirit Link",
        "setName": "Steam Siege",
        "number": "106",
        "notes": ""
      }
    ]
  },
  {
    "dexNumber": 209,
    "cameoPokemon": "Snubbull",
    "appearances": [
      {
        "cardName": "Floette",
        "setName": "BREAKthrough",
        "number": "102",
        "notes": ""
      },
      {
        "cardName": "Lt. Yoshida",
        "setName": "Great Detective Pikachu",
        "number": "25",
        "notes": ""
      },
      {
        "cardName": "Morpeko",
        "setName": "Shining Fates",
        "number": "36",
        "notes": ""
      }
    ]
  },
  {
    "dexNumber": 211,
    "cameoPokemon": "Qwilfish",
    "appearances": [
      {
        "cardName": "Pokémon Pal City",
        "setName": "Chūgoku Battle City Promo",
        "number": "-",
        "notes": ""
      },
      {
        "cardName": "Tornadus V",
        "setName": "Chilling Reign",
        "number": "185",
        "notes": ""
      }
    ]
  },
  {
    "dexNumber": 211,
    "cameoPokemon": "Hisuian Qwilfish",
    "appearances": [
      {
        "cardName": "Hisuian Lilligant V",
        "setName": "Astral Radiance",
        "number": "163",
        "notes": ""
      }
    ]
  },
  {
    "dexNumber": 212,
    "cameoPokemon": "Mega Scizor",
    "appearances": [
      {
        "cardName": "Scizor Spirit Link",
        "setName": "BREAKpoint",
        "number": "111",
        "notes": ""
      }
    ]
  },
  {
    "dexNumber": 213,
    "cameoPokemon": "Shuckle",
    "appearances": [
      {
        "cardName": "Morpeko",
        "setName": "Shining Fates",
        "number": "35",
        "notes": ""
      }
    ]
  },
  {
    "dexNumber": 214,
    "cameoPokemon": "Heracross",
    "appearances": [
      {
        "cardName": "Beautifly M",
        "setName": "Movie Random Pack",
        "number": "3",
        "notes": ""
      },
      {
        "cardName": "Weedle",
        "setName": "Chilling Reign",
        "number": "1",
        "notes": ""
      },
      {
        "cardName": "Mega Heracross ex",
        "setName": "Phantasmal Flames",
        "number": "108",
        "notes": ""
      }
    ]
  },
  {
    "dexNumber": 215,
    "cameoPokemon": "Sneasel",
    "appearances": [
      {
        "cardName": "Illusion's Zorua",
        "setName": "2010 Card Design Contest",
        "number": "Pucchigumi",
        "notes": ""
      },
      {
        "cardName": "Team Rocket's Wobbuffet",
        "setName": "SV Promos",
        "number": "203",
        "notes": ""
      },
      {
        "cardName": "Battle Cage",
        "setName": "Phantasmal Flames",
        "number": "116",
        "notes": ""
      }
    ]
  },
  {
    "dexNumber": 215,
    "cameoPokemon": "Hisuian Sneasel",
    "appearances": [
      {
        "cardName": "Hisuian Sneasler V",
        "setName": "Astral Radiance",
        "number": "175",
        "notes": ""
      },
      {
        "cardName": "Litten",
        "setName": "Temporal Forces",
        "number": "167",
        "notes": "figure"
      }
    ]
  },
  {
    "dexNumber": 216,
    "cameoPokemon": "Teddiursa",
    "appearances": [
      {
        "cardName": "Pokémon Pal City",
        "setName": "Hokkaidō Battle City Promo",
        "number": "-",
        "notes": ""
      },
      {
        "cardName": "Ursaring",
        "setName": "Legendary Treasures",
        "number": "RC16",
        "notes": ""
      },
      {
        "cardName": "Ice Rider Calyrex V",
        "setName": "Chilling Reign",
        "number": "164",
        "notes": ""
      },
      {
        "cardName": "Bloodmoon Ursaluna ex",
        "setName": "Twilight Masquerade",
        "number": "216",
        "notes": ""
      },
      {
        "cardName": "Phanpy",
        "setName": "Vivid Voltage",
        "number": "86",
        "notes": "plushie"
      },
      {
        "cardName": "Salvatore",
        "setName": "Temporal Forces",
        "number": "212",
        "notes": "wood carving"
      }
    ]
  },
  {
    "dexNumber": 218,
    "cameoPokemon": "Slugma",
    "appearances": [
      {
        "cardName": "Ethan's Adventure",
        "setName": "Destined Rivals",
        "number": "236",
        "notes": ""
      }
    ]
  },
  {
    "dexNumber": 220,
    "cameoPokemon": "Swinub",
    "appearances": [
      {
        "cardName": "Light Piloswine",
        "setName": "Neo Destiny",
        "number": "26",
        "notes": ""
      },
      {
        "cardName": "Hisuian Lilligant V",
        "setName": "Astral Radiance",
        "number": "163",
        "notes": ""
      }
    ]
  },
  {
    "dexNumber": 222,
    "cameoPokemon": "Corsola",
    "appearances": [
      {
        "cardName": "Tropical Tidal Wave",
        "setName": "Nintendo Promos",
        "number": "27",
        "notes": ""
      },
      {
        "cardName": "Mareanie",
        "setName": "Darkness Ablaze",
        "number": "51",
        "notes": ""
      },
      {
        "cardName": "Incineroar",
        "setName": "Silver Tempest",
        "number": "32",
        "notes": ""
      }
    ]
  },
  {
    "dexNumber": 223,
    "cameoPokemon": "Remoraid",
    "appearances": [
      {
        "cardName": "Mantine",
        "setName": "Mysterious Treasures",
        "number": "29",
        "notes": "this is the only Mantine card to have a Remoraid other than the one under its wing"
      },
      {
        "cardName": "Vaporeon",
        "setName": "Ancient Origins",
        "number": "22",
        "notes": ""
      },
      {
        "cardName": "Vaporeon VMAX",
        "setName": "SWSH Promos",
        "number": "182",
        "notes": ""
      },
      {
        "cardName": "Lapras",
        "setName": "Crown Zenith",
        "number": "GG05",
        "notes": ""
      }
    ]
  },
  {
    "dexNumber": 224,
    "cameoPokemon": "Octillery",
    "appearances": [
      {
        "cardName": "Remoraid",
        "setName": "Battle Styles",
        "number": "36",
        "notes": ""
      }
    ]
  },
  {
    "dexNumber": 225,
    "cameoPokemon": "Delibird",
    "appearances": [
      {
        "cardName": "Saguaro",
        "setName": "Paldea Evolved",
        "number": "270",
        "notes": ""
      }
    ]
  },
  {
    "dexNumber": 226,
    "cameoPokemon": "Mantine",
    "appearances": [
      {
        "cardName": "Remoraid",
        "setName": "Unleashed",
        "number": "59",
        "notes": ""
      },
      {
        "cardName": "Vaporeon",
        "setName": "Ancient Origins",
        "number": "22",
        "notes": ""
      },
      {
        "cardName": "Vaporeon VMAX",
        "setName": "SWSH Promos",
        "number": "182",
        "notes": ""
      },
      {
        "cardName": "Lapras",
        "setName": "Crown Zenith",
        "number": "GG05",
        "notes": ""
      },
      {
        "cardName": "Paradise Resort",
        "setName": "SV Promos",
        "number": "150",
        "notes": ""
      },
      {
        "cardName": "Time Shard",
        "setName": "Aquapolis",
        "number": "135",
        "notes": "silhouette"
      },
      {
        "cardName": "Remoraid",
        "setName": "Mysterious Treasures",
        "number": "95",
        "notes": ""
      }
    ]
  },
  {
    "dexNumber": 227,
    "cameoPokemon": "Skarmory",
    "appearances": [
      {
        "cardName": "Mega Skarmory ex",
        "setName": "Perfect Order",
        "number": "106",
        "notes": ""
      },
      {
        "cardName": "Ho-Oh",
        "setName": "Neo Revelation",
        "number": "18",
        "notes": "only partially visible"
      }
    ]
  },
  {
    "dexNumber": 228,
    "cameoPokemon": "Houndour",
    "appearances": [
      {
        "cardName": "Celebratory Fanfare",
        "setName": "S-P Promos",
        "number": "254",
        "notes": ""
      }
    ]
  },
  {
    "dexNumber": 229,
    "cameoPokemon": "Mega Houndoom",
    "appearances": [
      {
        "cardName": "Houndoom Spirit Link",
        "setName": "BREAKthrough",
        "number": "142",
        "notes": ""
      }
    ]
  },
  {
    "dexNumber": 231,
    "cameoPokemon": "Phanpy",
    "appearances": [
      {
        "cardName": "Hassel",
        "setName": "Twilight Masquerade",
        "number": "151",
        "notes": "drawing, only partially visible"
      }
    ]
  },
  {
    "dexNumber": 232,
    "cameoPokemon": "Donphan",
    "appearances": [
      {
        "cardName": "Pikachu",
        "setName": "SM Promos",
        "number": "234",
        "notes": ""
      },
      {
        "cardName": "Victini ex",
        "setName": "SV-P Promos",
        "number": "52",
        "notes": "this card was only released in Traditional Chinese, Indonesian, Thai, and Simplified Chinese"
      },
      {
        "cardName": "Phanpy",
        "setName": "Surging Sparks",
        "number": "205",
        "notes": ""
      }
    ]
  },
  {
    "dexNumber": 233,
    "cameoPokemon": "Porygon2",
    "appearances": [
      {
        "cardName": "Switch",
        "setName": "Expedition",
        "number": "157",
        "notes": ""
      },
      {
        "cardName": "Pokémon Reversal",
        "setName": "HeartGold & SoulSilver",
        "number": "99",
        "notes": ""
      },
      {
        "cardName": "Porygon-Z",
        "setName": "Paradox Rift",
        "number": "214",
        "notes": "figure"
      }
    ]
  },
  {
    "dexNumber": 234,
    "cameoPokemon": "Stantler",
    "appearances": [
      {
        "cardName": "Pokémon Pal City",
        "setName": "Kansai Battle City Promo",
        "number": "-",
        "notes": ""
      }
    ]
  },
  {
    "dexNumber": 235,
    "cameoPokemon": "Smeargle",
    "appearances": [
      {
        "cardName": "Mew V",
        "setName": "Fusion Strike",
        "number": "251",
        "notes": ""
      },
      {
        "cardName": "Genesect V",
        "setName": "Fusion Strike",
        "number": "255",
        "notes": ""
      },
      {
        "cardName": "Bibarel",
        "setName": "Pokémon GO",
        "number": "60",
        "notes": ""
      },
      {
        "cardName": "Champions Festival",
        "setName": "SM Promos",
        "number": "231",
        "notes": "drawing"
      },
      {
        "cardName": "Eldegoss",
        "setName": "Evolving Skies",
        "number": "16",
        "notes": "only its paint"
      },
      {
        "cardName": "Mawile",
        "setName": "Fusion Strike",
        "number": "119",
        "notes": ""
      },
      {
        "cardName": "Meowth",
        "setName": "Fusion Strike",
        "number": "199",
        "notes": ""
      }
    ]
  },
  {
    "dexNumber": 236,
    "cameoPokemon": "Tyrogue",
    "appearances": [
      {
        "cardName": "Hitmontop",
        "setName": "Aquapolis",
        "number": "82",
        "notes": ""
      },
      {
        "cardName": "Eevee",
        "setName": "SM Promos",
        "number": "235",
        "notes": ""
      },
      {
        "cardName": "Lacey",
        "setName": "Stellar Crown",
        "number": "172",
        "notes": "picture"
      }
    ]
  },
  {
    "dexNumber": 237,
    "cameoPokemon": "Hitmontop",
    "appearances": [
      {
        "cardName": "Tyrogue",
        "setName": "Aquapolis",
        "number": "63",
        "notes": ""
      },
      {
        "cardName": "Tyrogue",
        "setName": "P Promos",
        "number": "23",
        "notes": ""
      }
    ]
  },
  {
    "dexNumber": 238,
    "cameoPokemon": "Smoochum",
    "appearances": [
      {
        "cardName": "Tropical Breeze",
        "setName": "VS: Tropical Mega Battle",
        "number": "-",
        "notes": ""
      },
      {
        "cardName": "Pokémon Fan Club",
        "setName": "Aquapolis",
        "number": "130",
        "notes": ""
      },
      {
        "cardName": "Pokémon Collector",
        "setName": "HeartGold & SoulSilver",
        "number": "97",
        "notes": ""
      }
    ]
  },
  {
    "dexNumber": 239,
    "cameoPokemon": "Elekid",
    "appearances": [
      {
        "cardName": "Pokémon Valley",
        "setName": "Miscellaneous Promos",
        "number": "-",
        "notes": "Jumbo"
      },
      {
        "cardName": "Broken Ground Gym",
        "setName": "Neo Destiny",
        "number": "92",
        "notes": ""
      }
    ]
  },
  {
    "dexNumber": 240,
    "cameoPokemon": "Magby",
    "appearances": [
      {
        "cardName": "Pokémon Fan Club",
        "setName": "POP Series 4",
        "number": "9",
        "notes": ""
      },
      {
        "cardName": "Pokémon Pal City",
        "setName": "Kyūshū Battle City Promo",
        "number": "-",
        "notes": ""
      }
    ]
  },
  {
    "dexNumber": 241,
    "cameoPokemon": "Miltank",
    "appearances": [
      {
        "cardName": "Pokémon Breeder",
        "setName": "Shining Legends",
        "number": "63",
        "notes": ""
      },
      {
        "cardName": "Pokémon Breeder",
        "setName": "Shining Legends",
        "number": "73",
        "notes": ""
      },
      {
        "cardName": "Orbeetle VMAX",
        "setName": "Lost Origin",
        "number": "TG13",
        "notes": ""
      },
      {
        "cardName": "Moo-Moo Milk",
        "setName": "Neo Genesis",
        "number": "101",
        "notes": "picture"
      },
      {
        "cardName": "Moomoo Milk",
        "setName": "HeartGold & SoulSilver",
        "number": "94",
        "notes": ""
      },
      {
        "cardName": "Moomoo Milk",
        "setName": "Lost Thunder",
        "number": "185",
        "notes": ""
      },
      {
        "cardName": "Moomoo Cheese",
        "setName": "Vivid Voltage",
        "number": "156",
        "notes": ""
      },
      {
        "cardName": "Inkay",
        "setName": "Chilling Reign",
        "number": "69",
        "notes": ""
      }
    ]
  },
  {
    "dexNumber": 242,
    "cameoPokemon": "Blissey",
    "appearances": [
      {
        "cardName": "Chansey",
        "setName": "Twilight Masquerade",
        "number": "187",
        "notes": ""
      }
    ]
  },
  {
    "dexNumber": 243,
    "cameoPokemon": "Raikou",
    "appearances": [
      {
        "cardName": "Burned Tower",
        "setName": "Undaunted",
        "number": "71",
        "notes": ""
      },
      {
        "cardName": "Illusion's Zoroark",
        "setName": "2010 Card Design Contest",
        "number": "4th Grade",
        "notes": ""
      },
      {
        "cardName": "Illusion's Zoroark",
        "setName": "2010 Card Design Contest",
        "number": "CoroCoro Ichiban!",
        "notes": ""
      },
      {
        "cardName": "Entei",
        "setName": "POP Series 2",
        "number": "1",
        "notes": "only partially visible"
      }
    ]
  },
  {
    "dexNumber": 244,
    "cameoPokemon": "Entei",
    "appearances": [
      {
        "cardName": "Latias and Latios",
        "setName": "J Promos",
        "number": "2",
        "notes": "Jumbo"
      },
      {
        "cardName": "Burned Tower",
        "setName": "Undaunted",
        "number": "71",
        "notes": ""
      },
      {
        "cardName": "Illusion's Zoroark",
        "setName": "2010 Card Design Contest",
        "number": "4th Grade",
        "notes": ""
      },
      {
        "cardName": "Illusion's Zoroark",
        "setName": "2010 Card Design Contest",
        "number": "CoroCoro Ichiban!",
        "notes": ""
      },
      {
        "cardName": "Tauros",
        "setName": "POP Series 2",
        "number": "5",
        "notes": "only partially visible"
      }
    ]
  },
  {
    "dexNumber": 245,
    "cameoPokemon": "Suicune",
    "appearances": [
      {
        "cardName": "Burned Tower",
        "setName": "Undaunted",
        "number": "71",
        "notes": ""
      },
      {
        "cardName": "Illusion's Zoroark",
        "setName": "2010 Card Design Contest",
        "number": "4th Grade",
        "notes": ""
      },
      {
        "cardName": "Illusion's Zoroark",
        "setName": "2010 Card Design Contest",
        "number": "CoroCoro Ichiban!",
        "notes": ""
      },
      {
        "cardName": "Pretend Tea Ceremony Pikachu",
        "setName": "SM-P Promos",
        "number": "325",
        "notes": ""
      },
      {
        "cardName": "Quaquaval ex",
        "setName": "Paldea Evolved",
        "number": "260",
        "notes": "picture"
      }
    ]
  },
  {
    "dexNumber": 246,
    "cameoPokemon": "Larvitar",
    "appearances": [
      {
        "cardName": "Probopass",
        "setName": "Twilight Masquerade",
        "number": "182",
        "notes": ""
      },
      {
        "cardName": "Pikachu",
        "setName": "P Promos",
        "number": "4",
        "notes": "only partially visible"
      }
    ]
  },
  {
    "dexNumber": 247,
    "cameoPokemon": "Pupitar",
    "appearances": [
      {
        "cardName": "Larvitar",
        "setName": "Lost Thunder",
        "number": "114",
        "notes": "sand sculpture"
      }
    ]
  },
  {
    "dexNumber": 248,
    "cameoPokemon": "Tyranitar",
    "appearances": [
      {
        "cardName": "Larvitar",
        "setName": "Lost Thunder",
        "number": "114",
        "notes": "sand sculpture"
      }
    ]
  },
  {
    "dexNumber": 248,
    "cameoPokemon": "Mega Tyranitar",
    "appearances": [
      {
        "cardName": "Tyranitar Spirit Link",
        "setName": "Ancient Origins",
        "number": "81",
        "notes": ""
      }
    ]
  },
  {
    "dexNumber": 249,
    "cameoPokemon": "Lugia",
    "appearances": [
      {
        "cardName": "Lucky Stadium",
        "setName": "Kantō World Challenge Promo",
        "number": "-",
        "notes": ""
      },
      {
        "cardName": "Latias and Latios",
        "setName": "J Promos",
        "number": "2",
        "notes": "Jumbo"
      },
      {
        "cardName": "Illusion's Zoroark",
        "setName": "2010 Card Design Contest",
        "number": "4th Grade",
        "notes": ""
      },
      {
        "cardName": "Illusion's Zoroark",
        "setName": "2010 Card Design Contest",
        "number": "CoroCoro Ichiban!",
        "notes": ""
      },
      {
        "cardName": "Alakazam-EX",
        "setName": "Fates Collide",
        "number": "125",
        "notes": ""
      },
      {
        "cardName": "Hoopa",
        "setName": "XY-P Promos",
        "number": "155",
        "notes": ""
      },
      {
        "cardName": "Zeraora and Friends",
        "setName": "SM-P Promos",
        "number": "-",
        "notes": "Jumbo"
      },
      {
        "cardName": "Regidrago V",
        "setName": "Silver Tempest",
        "number": "184",
        "notes": ""
      },
      {
        "cardName": "Ho-Oh",
        "setName": "Neo Revelation",
        "number": "18",
        "notes": "only partially visible"
      },
      {
        "cardName": "Water Energy",
        "setName": "HeartGold & SoulSilver",
        "number": "117",
        "notes": "silhouette"
      },
      {
        "cardName": "Okuge-sama and Maiko-han Pikachu",
        "setName": "XY-P Promos",
        "number": "221",
        "notes": ""
      },
      {
        "cardName": "Umbreon",
        "setName": "Neo Discovery",
        "number": "32",
        "notes": "carving"
      },
      {
        "cardName": "Eevee",
        "setName": "VMAX Climax",
        "number": "210",
        "notes": "picture; this card was released in English, but the cameo is covered by text"
      }
    ]
  },
  {
    "dexNumber": 250,
    "cameoPokemon": "Ho-Oh",
    "appearances": [
      {
        "cardName": "Lucky Stadium",
        "setName": "Kansai World Challenge Promo",
        "number": "-",
        "notes": ""
      },
      {
        "cardName": "No.1 Trainer",
        "setName": "Neo Summer Road Best in Japan",
        "number": "-",
        "notes": ""
      },
      {
        "cardName": "No.2 Trainer",
        "setName": "Neo Summer Road Best in Japan",
        "number": "-",
        "notes": ""
      },
      {
        "cardName": "No.3 Trainer",
        "setName": "Neo Summer Road Best in Japan",
        "number": "-",
        "notes": ""
      },
      {
        "cardName": "Illusion's Zoroark",
        "setName": "2010 Card Design Contest",
        "number": "4th Grade",
        "notes": ""
      },
      {
        "cardName": "Illusion's Zoroark",
        "setName": "2010 Card Design Contest",
        "number": "CoroCoro",
        "notes": ""
      },
      {
        "cardName": "Illusion's Zoroark",
        "setName": "2010 Card Design Contest",
        "number": "CoroCoro Ichiban!",
        "notes": ""
      },
      {
        "cardName": "Celebratory Fanfare",
        "setName": "MEP Promos",
        "number": "28",
        "notes": ""
      },
      {
        "cardName": "Lugia",
        "setName": "Neo Revelation",
        "number": "20",
        "notes": "only partially visible"
      },
      {
        "cardName": "Skarmory",
        "setName": "Neo Revelation",
        "number": "23",
        "notes": ""
      },
      {
        "cardName": "Illusion's Zoroark",
        "setName": "2010 Card Design Contest",
        "number": "3rd Grade",
        "notes": ""
      },
      {
        "cardName": "Fire Energy",
        "setName": "HeartGold & SoulSilver",
        "number": "116",
        "notes": "silhouette"
      },
      {
        "cardName": "Okuge-sama and Maiko-han Pikachu",
        "setName": "XY-P Promos",
        "number": "221",
        "notes": "kimono"
      },
      {
        "cardName": "Tropical Present",
        "setName": "Miscellaneous Promos",
        "number": "©2001",
        "notes": "fireworks; Jumbo"
      },
      {
        "cardName": "Golbat",
        "setName": "Skyridge",
        "number": "60",
        "notes": "geoglyph"
      },
      {
        "cardName": "Skarmory",
        "setName": "Skyridge",
        "number": "97",
        "notes": ""
      },
      {
        "cardName": "Yanma",
        "setName": "Skyridge",
        "number": "116",
        "notes": ""
      }
    ]
  },
  {
    "dexNumber": 251,
    "cameoPokemon": "Celebi",
    "appearances": [
      {
        "cardName": "New Century Present",
        "setName": "Miscellaneous Promos",
        "number": "-",
        "notes": "Jumbo"
      },
      {
        "cardName": "Latias and Latios",
        "setName": "J Promos",
        "number": "2",
        "notes": "Jumbo"
      },
      {
        "cardName": "Championship Arena",
        "setName": "Nintendo Promos",
        "number": "28",
        "notes": ""
      },
      {
        "cardName": "Indigo Plateau",
        "setName": "Triumphant",
        "number": "86",
        "notes": ""
      },
      {
        "cardName": "Illusion's Zorua",
        "setName": "2010 Card Design Contest",
        "number": "Pokémon Fan",
        "notes": ""
      },
      {
        "cardName": "Illusion's Zoroark",
        "setName": "2010 Card Design Contest",
        "number": "4th Grade",
        "notes": ""
      },
      {
        "cardName": "Master's Key",
        "setName": "L-P Promos",
        "number": "68",
        "notes": ""
      },
      {
        "cardName": "Grass Energy",
        "setName": "HeartGold & SoulSilver",
        "number": "115",
        "notes": "silhouette"
      }
    ]
  }
];

/**
 * Get all cameo appearances for a given Pokemon name.
 */
export function getCameoCardsForPokemon(pokemonName: string): CameoEntry[] {
  const normalized = pokemonName.toLowerCase();
  const records = CAMEO_DATABASE.filter(
    (r) => r.cameoPokemon.toLowerCase() === normalized
  );

  return records.flatMap((r) =>
    r.appearances.map((a) => ({
      cardId: '', // Not available from spreadsheet — resolved at fetch time
      cardName: a.cardName,
      setCode: '',
      setName: a.setName,
      mainPokemon: a.cardName,
      cameoPokemon: [r.cameoPokemon],
      notes: a.notes || undefined,
    }))
  );
}

/**
 * Get all unique cameo Pokemon names in the database.
 */
export function getAllCameoPokemon(): string[] {
  return [...new Set(CAMEO_DATABASE.map((r) => r.cameoPokemon))].sort();
}

/**
 * Search cameo database by Pokemon name.
 */
export function searchCameos(query: string): CameoRecord[] {
  const q = query.toLowerCase();
  return CAMEO_DATABASE.filter(
    (r) =>
      r.cameoPokemon.toLowerCase().includes(q) ||
      r.appearances.some((a) => a.cardName.toLowerCase().includes(q))
  );
}

/**
 * Get statistics about the cameo database.
 */
export function getCameoStatistics() {
  const totalAppearances = CAMEO_DATABASE.reduce((sum, r) => sum + r.appearances.length, 0);
  const uniquePokemon = CAMEO_DATABASE.length;
  const uniqueSets = new Set(CAMEO_DATABASE.flatMap((r) => r.appearances.map((a) => a.setName))).size;
  return { totalAppearances, uniquePokemon, uniqueSets };
}
