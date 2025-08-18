// Utility to convert backend Experience documents to expCards shape
// Output shape:
// {
//   review: string,
//   imgPath: string, // unused for Experience (kept for API compatibility; always "")
//   logoPath: string,
//   title: string, // role
//   date: string,  // e.g. "January 2023 - Present"
//   responsibilities: string[]
//   current: boolean
// }

function safeGetDate(val) {
  // Handles: Date, string, { $date: number|string }, { $date: { $numberLong: "..." } }
  if (!val) return null;
  try {
    if (val instanceof Date) return val;
    if (typeof val === "string" || typeof val === "number") return new Date(val);
    if (val && typeof val === "object") {
      const d = val.$date ?? val.date ?? val.value;
      if (typeof d === "object" && d?.$numberLong) return new Date(Number(d.$numberLong));
      if (typeof d === "string" || typeof d === "number") return new Date(d);
    }
  } catch {
    // ignore invalid dates
  }
  return null;
}

function formatRange(start, end, current) {
  const fmt = (d) => {
    try {
      return d?.toLocaleString(undefined, { month: "long", year: "numeric" }) || "";
    } catch {
      return "";
    }
  };
  const s = safeGetDate(start);
  const e = safeGetDate(end);
  const sStr = s ? fmt(s) : "";
  const eStr = current ? "Present" : e ? fmt(e) : "";
  return [sStr, eStr].filter(Boolean).join(" - ");
}

function parseMaybeJSONStringArray(val) {
  // Handles: ["[\"a\", \"b\"]"], "[\"a\"]", ["a","b"], "a", null
  if (!val) return [];
  if (Array.isArray(val)) {
    if (val.length === 1 && typeof val[0] === "string" && val[0].trim().startsWith("[")) {
      try { return JSON.parse(val[0]); } catch { return []; }
    }
    return val.filter((x) => typeof x === "string");
  }
  if (typeof val === "string" && val.trim().startsWith("[")) {
    try { return JSON.parse(val); } catch { return []; }
  }
  return typeof val === "string" ? [val] : [];
}

export function toExpCard(doc) {
  if (!doc || typeof doc !== "object") return null;
  // If it already looks like an expCard, just normalize fields
  if (doc.title && doc.date && Array.isArray(doc.responsibilities)) {
    return {
      review: doc.review || "",
      imgPath: "",
      logoPath: doc.logoPath || doc.logo || "",
      title: doc.title,
      date: doc.date,
      responsibilities: doc.responsibilities,
      current: !!doc.current,
      tags: Array.isArray(doc.tags) ? doc.tags : parseMaybeJSONStringArray(doc.tags),
      company: doc.company || "",
      location: doc.location || "",
    };
  }

  const responsibilities = parseMaybeJSONStringArray(doc.responsibilities);
  const tags = parseMaybeJSONStringArray(doc.tags);
  const date = formatRange(doc.startDate, doc.endDate, doc.current === true);

  return {
    review: typeof doc.review === "string" ? doc.review.replace(/^"|"$/g, "") : (doc.review || ""),
    imgPath: "",
    logoPath: doc.logoPath || doc.logo || "",
    title: doc.role || doc.title || "",
    date,
    responsibilities,
    current: !!doc.current,
    tags,
    company: doc.company || "",
    location: doc.location || "",
  };
}

export function toExpCardsFromApiResponse(response) {
  // Accepts shapes: res.data.items, res.data.data.items, res.data, items directly, or an array
  const payload = response?.data ?? response;
  const raw = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.items)
    ? payload.items
    : Array.isArray(payload?.data?.items)
    ? payload.data.items
    : Array.isArray(payload?.data)
    ? payload.data
    : [];
  return raw.map(toExpCard).filter(Boolean);
}
