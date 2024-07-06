import { Card } from "../commons/Card";
import { DeckB, DeckA } from "../commons/Decks";
import { Urls } from "./Urls";

export const tyranid_swarm = `1 Aberrant
1 Abundance
1 Acolyte Hybrid
1 Aetherize
1 Arcane Signet
1 Ash Barrens
1 Atalan Jackal
1 Biophagus
1 Bone Sabres
1 Bred for the Hunt
1 Broodlord
1 Cave of Temptation
1 Cinder Glade
1 Clamavus
1 Command Tower
1 Cultivate
1 Death's Presence
1 Deathleaper, Terror Weapon
1 Evolving Wilds
1 Exocrine
1 Exotic Orchard
1 Explore
1 Farseek
8 Forest
1 Frontier Bivouac
1 Game Trail
1 Gargoyle Flock
1 Genestealer Locus
1 Genestealer Patriarch
1 Ghyrson Starn, Kelermorph
1 Goliath Truck
1 Hardened Scales
1 Harrow
1 Haruspex
1 Herald's Horn
1 Hierophant Bio-Titan
1 Hormagaunt Horde
1 Hull Breach
1 Icon of Ancestry
1 Inspiring Call
7 Island
1 Lictor
1 Magus Lucea Kane
1 Malanthrope
1 Mawloc
7 Mountain
1 New Horizons
1 Nexos
1 Old One Eye
1 Opal Palace
1 Overgrowth
1 Path of Ancestry
1 Purestrain Genestealer
1 Rampant Growth
1 Ravener
1 Rugged Highlands
1 Screamer-Killer
1 Shadow in the Warp
1 Sol Ring
1 Sporocyst
1 Starstorm
1 Temple of Abandon
1 Temple of Epiphany
1 Temple of Mystery
1 Termagant Swarm
1 Terramorphic Expanse
1 Tervigon
1 The First Tyrannic War
1 The Red Terror
1 The Swarmlord
1 Thornwood Falls
1 Toxicrene
1 Trygon Prime
1 Tyranid Harridan
1 Tyranid Invasion
1 Tyranid Prime
1 Tyrant Guard
1 Unclaimed Territory
1 Venomthrope
1 Winged Hive Tyrant
1 Zoanthrope`;

export const forces_of_imperium = `1 And They Shall Know No Fear
1 Arcane Sanctum
1 Arcane Signet
1 Arco-Flagellant
1 Ash Barrens
1 Assault Intercessor
1 Bastion Protector
1 Belisarius Cawl
1 Birth of the Imperium
1 Callidus Assassin
1 Celestine, the Living Saint
1 Choked Estuary
1 Collective Effort
1 Command Tower
1 Commander's Sphere
1 Commissar Severina Raine
1 Company Commander
1 Cybernetica Datasmith
1 Darkwater Catacombs
1 Defenders of Humanity
1 Deny the Witch
1 Deploy to the Front
1 Dismal Backwater
1 Entrapment Maneuver
1 Epistolary Librarian
1 Everflowing Chalice
1 Evolving Wilds
1 Exotic Orchard
1 Exterminatus
1 Fell the Mighty
1 For the Emperor!
1 Grey Knight Paragon
1 Hour of Reckoning
1 Inquisitor Eisenhorn
1 Inquisitor Greyfax
1 Inquisitorial Rosette
5 Island
1 Knight Paladin
1 Launch the Fleet
1 Marneus Calgar
1 Martial Coup
1 Memorial to Glory
1 Mind Stone
1 Mortify
1 Neyam Shai Murad
1 Path of Ancestry
8 Plains
1 Port Town
1 Prairie Stream
1 Primaris Chaplain
1 Primaris Eliminator
1 Reaver Titan
1 Reconnaissance Mission
1 Redemptor Dreadnought
1 Sanguinary Priest
1 Scoured Barrens
1 Sicarian Infiltrator
1 Sister Hospitaller
1 Sister Repentia
1 Sister of Silence
1 Skullclamp
1 Skycloud Expanse
1 Sol Ring
1 Space Marine Devastator
1 Space Marine Scout
1 Sunken Hollow
7 Swamp
1 Swords to Plowshares
1 Talisman of Dominance
1 Talisman of Hierarchy
1 Talisman of Progress
1 Terramorphic Expanse
1 The Flesh Is Weak
1 The Golden Throne
1 Thunderhawk Gunship
1 Thunderwolf Cavalry
1 Tranquil Cove
1 Triumph of Saint Katherine
1 Ultramarines Honour Guard
1 Utter End
1 Vanguard Suppressor
1 Vexilus Praetor
1 Zephyrim`;

function randomCost() {
  const costs = ["w", "u", "r", "b", "g"];
  const result = [];
  const colorlessCost = Math.floor(Math.random() * 4) + 1; // Generate colorless cost between 1 and 4
  result.push(`{${colorlessCost}}`);

  const colors = Math.floor(Math.random() * 2) + 1; // Generate number of colors (1, 2, or 3)
  for (let i = 0; i < colors; i++) {
    const colorIndex = Math.floor(Math.random() * 4); // Select random index for color
    result.push(`{${costs[colorIndex]}}`);
  }

  return result.join("");
}

export const convertTextToDeck = (text) => {
  const fullDeckList = text.split("\n").map((line) => {
    const [count, ...rest] = line.split(" ");
    const name = rest.join(" ");
    return { name, count: parseInt(count) };
  });

  const randomType = () =>
    ["Creature", "Land", "Artifact", "Enchantment", "Instant", "Sorcery"][
      Math.floor(Math.random() * 6)
    ];
  const commanders = [];
  const deck = [];
  for (const card of fullDeckList) {
    for (let i = 0; i < card.count; i++) {
      deck.push(new Card(card.name, randomCost(), randomType(), "card text"));
    }
  }

  return { deck, commanders };
};

export const fetchDeck = async (id, authorization) => {
  try {
    const response = await fetch(`${Urls.api_url}/deck/${id}/json?format=json`, {
      headers: {
        'Authorization': `token ${authorization.token}`,
        'Content-Type': 'application/json'
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    const commanders = [];
    for (const card_quantity of data["commanders"]) {
      for (let i = 0; i < card_quantity.quantity; i++) {
        commanders.push(new Card(card_quantity.card));
      }
    }

    const deck = [];
    for (const card_quantity of data["mainboard"]) {
      for (let i = 0; i < card_quantity.quantity; i++) {
        deck.push(new Card(card_quantity.card));
      }
    }

    return { id, deck, commanders };
  } catch (error) {
    console.error("Error:", error);
  }
};

export const loadDeck = (deck_id) => {
  const data = deck_id === 46 ? DeckA : DeckB;

  const commanders = [];
  for (const card_quantity of data["commanders"]) {
    for (let i = 0; i < card_quantity.quantity; i++) {
      commanders.push(new Card(card_quantity.card));
    }
  }

  const deck = [];
  for (const card_quantity of data["mainboard"]) {
    for (let i = 0; i < card_quantity.quantity; i++) {
      deck.push(new Card(card_quantity.card));
    }
  }
  return { id: deck_id, deck, commanders };
};
