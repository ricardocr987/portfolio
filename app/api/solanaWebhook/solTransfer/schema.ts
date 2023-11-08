import { z } from "zod";

export const solTransferSchema = z.object({
  timestamp: z.string().default(""),
  fee: z.number().default(0),
  fee_payer: z.string().default(""),
  signers: z.array(z.string()).default([]),
  signatures: z.array(z.string()).default([]),
  protocol: z
    .object({
      address: z.string().default(""),
      name: z.string().default(""),
    })
    .default({ address: "", name: "" }),
  type: z.string().default(""),
  status: z.string().default(""),
  actions: z.array(
    z.object({
      info: z.unknown().default(null),
      source_protocol: z.unknown().default(null),
      type: z.string().default("UNKNOWN"),
    })
  ).default([]),
  events: z.array(z.string()).default([]),
  raw: z
    .object({
      blockTime: z.number().default(0),
      meta: z
        .object({
          computeUnitsConsumed: z.number().default(0),
          err: z.unknown().default(null),
          fee: z.number().default(0),
          innerInstructions: z.array(z.unknown()).default([]),
          logMessages: z.array(z.string()).default([]),
          postBalances: z.array(z.number()).default([]),
          postTokenBalances: z.array(z.unknown()).default([]),
          preBalances: z.array(z.number()).default([]),
          preTokenBalances: z.array(z.unknown()).default([]),
          rewards: z.array(z.string()).default([]),
          status: z.unknown().default(null),
        })
        .default({
          computeUnitsConsumed: 0,
          err: null,
          fee: 0,
          innerInstructions: [],
          logMessages: [],
          postBalances: [],
          postTokenBalances: [],
          preBalances: [],
          preTokenBalances: [],
          rewards: [],
          status: null,
        }),
      slot: z.number().default(0),
      transaction: z.object({
        message: z.unknown().default(null),
        signatures: z.array(z.string()).default([]),
      }),
      version: z.number().default(0),
    })
    .default({
      blockTime: 0,
      meta: {
        computeUnitsConsumed: 0,
        err: null,
        fee: 0,
        innerInstructions: [],
        logMessages: [],
        postBalances: [],
        postTokenBalances: [],
        preBalances: [],
        preTokenBalances: [],
        rewards: [],
        status: null,
      },
      slot: 0,
      transaction: { message: null, signatures: [] },
      version: 0,
    }),
  accounts: z.array(
    z.object({
      address: z.string().default(""),
      owner: z.string().default(""),
      lamports: z.number().default(0),
      data: z.string().default(""),
    })
  ).default([]),
});