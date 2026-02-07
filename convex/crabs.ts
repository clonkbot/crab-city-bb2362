import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

// Random handle generator
const adjectives = [
  "Snappy", "Crusty", "Sandy", "Salty", "Bubbly", "Pinchy", "Scuttling",
  "Sideways", "Clicky", "Coral", "Abyssal", "Tidal", "Briny", "Kelpy",
  "Shelly", "Pearly", "Foamy", "Wavey", "Drifty", "Murky"
];

const nouns = [
  "Claw", "Pincer", "Shell", "Tide", "Wave", "Reef", "Coral", "Barnacle",
  "Kelp", "Bubble", "Sand", "Pearl", "Foam", "Drift", "Current", "Depth",
  "Abyss", "Trench", "Shoal", "Lagoon"
];

const colors = [
  "#FF6B6B", "#4ECDC4", "#FFE66D", "#95E1D3", "#F38181",
  "#AA96DA", "#FCBAD3", "#A8D8EA", "#FF9A8B", "#88D8B0"
];

function generateHandle(): string {
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const num = Math.floor(Math.random() * 99);
  return `${adj}${noun}${num}`;
}

function generateColor(): string {
  return colors[Math.floor(Math.random() * colors.length)];
}

// Get or create a crab for the current user
export const getOrCreateMyCrab = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Check if user already has a crab
    const existingCrab = await ctx.db
      .query("crabs")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (existingCrab) {
      // Update last seen and return
      await ctx.db.patch(existingCrab._id, { lastSeen: Date.now() });
      return existingCrab._id;
    }

    // Create new crab with random position
    const crabId = await ctx.db.insert("crabs", {
      userId,
      handle: generateHandle(),
      color: generateColor(),
      positionX: 20 + Math.random() * 60, // 20-80% of screen
      positionY: 20 + Math.random() * 60,
      lastSeen: Date.now(),
    });

    return crabId;
  },
});

// Update crab position
export const updatePosition = mutation({
  args: {
    x: v.number(),
    y: v.number()
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const crab = await ctx.db
      .query("crabs")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (!crab) throw new Error("No crab found");

    await ctx.db.patch(crab._id, {
      positionX: args.x,
      positionY: args.y,
      lastSeen: Date.now(),
    });
  },
});

// Get all active crabs (seen in last 5 minutes)
export const getActiveCrabs = query({
  args: {},
  handler: async (ctx) => {
    const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;

    const crabs = await ctx.db
      .query("crabs")
      .withIndex("by_last_seen")
      .filter((q) => q.gte(q.field("lastSeen"), fiveMinutesAgo))
      .collect();

    return crabs;
  },
});

// Get my crab
export const getMyCrab = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    return await ctx.db
      .query("crabs")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();
  },
});
