import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

export default defineSchema({
  ...authTables,

  // Crabs walking around the city
  crabs: defineTable({
    userId: v.id("users"),
    handle: v.string(),
    color: v.string(),
    positionX: v.number(),
    positionY: v.number(),
    lastSeen: v.number(),
  }).index("by_user", ["userId"])
    .index("by_last_seen", ["lastSeen"]),

  // Messages posted by crabs (speech bubbles)
  messages: defineTable({
    userId: v.id("users"),
    crabId: v.id("crabs"),
    handle: v.string(),
    text: v.string(),
    positionX: v.number(),
    positionY: v.number(),
    createdAt: v.number(),
  }).index("by_created", ["createdAt"])
    .index("by_crab", ["crabId"]),
});
