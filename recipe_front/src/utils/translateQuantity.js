import { UNITS, UNIT_ALIASES } from "./quantityUnits";

export function translateQuantity(quantity, lang) {
  if (!quantity || typeof quantity !== "string") return "";


  const normalized = quantity
    .trim()
    .toLowerCase()
    .replace(/^(\d+(?:\.\d+)?)([a-zа-я]+)/i, "$1 $2");

  const parts = normalized.split(" ");

  if (parts.length < 2) {
    return quantity;
  }

  const value = parts[0];
  let unit = parts.slice(1).join(" ");

  
  unit = UNIT_ALIASES[unit] || unit;

  const localizedUnit = UNITS[unit]?.[lang] || unit;

  return `${value} ${localizedUnit}`;
}

