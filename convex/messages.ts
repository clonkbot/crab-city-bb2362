import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

// Post a message as a speech bubble
export const post = mutation({
  args: { text: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Get the user's crab
    const crab = await ctx.db
      .query("crabs")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (!crab) throw new Error("No crab found - please refresh");

    // Limit message length
    const text = args.text.slice(0, 200);

    const messageId = await ctx.db.insert("messages", {
      userId,
      crabId: crab._id,
      handle: crab.handle,
      text,
      positionX: crab.positionX,
      positionY: crab.positionY,
      createdAt: Date.now(),
    });

    return messageId;
  },
});

// Get recent messages (last 30 seconds for active bubbles)
export const getRecentMessages = query({
  args: {},
  handler: async (ctx) => {
    const thirtySecondsAgo = Date.now() - 30 * 1000;

    const messages = await ctx.db
      .query("messages")
      .withIndex("by_created")
      .filter((q) => q.gte(q.field("createdAt"), thirtySecondsAgo))
      .order("desc")
      .take(50);

    return messages.reverse();
  },
});

// Get message history (last 100 messages for the feed)
export const getHistory = query({
  args: {},
  handler: async (ctx) => {
    const messages = await ctx.db
      .query("messages")
      .withIndex("by_created")
      .order("desc")
      .take(100);

    return messages.reverse();
  },
});
