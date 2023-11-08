import { z } from "zod";

export const solTransferSchema = z.object({
  timestamp: z.string(),
  fee: z.number(),
  fee_payer: z.string(),
  signers: z.array(z.string()),
  signatures: z.array(z.string()),
  protocol: z.object({
    address: z.string(),
    name: z.string(),
  }),
  type: z.string(),
  status: z.string(),
  actions: z.array(
    z.object({
      info: z.unknown(), // You may need to specify the correct type
      source_protocol: z.unknown(), // You may need to specify the correct type
      type: z.string(),
    })
  ),
  events: z.array(z.string()), // You may need to specify the correct type
  raw: z.object({
    blockTime: z.number(),
    meta: z.object({
      computeUnitsConsumed: z.number(),
      err: z.unknown(), // You may need to specify the correct type
      fee: z.number(),
      innerInstructions: z.array(z.unknown()), // You may need to specify the correct type
      logMessages: z.array(z.string()),
      postBalances: z.array(z.number()),
      postTokenBalances: z.array(z.unknown()), // You may need to specify the correct type
      preBalances: z.array(z.number()),
      preTokenBalances: z.array(z.unknown()), // You may need to specify the correct type
      rewards: z.array(z.string()), // You may need to specify the correct type
      status: z.unknown(), // You may need to specify the correct type
    }),
    slot: z.number(),
    transaction: z.object({
      message: z.unknown(), // You may need to specify the correct type
      signatures: z.array(z.string()),
    }),
    version: z.number(),
  }),
  accounts: z.array(
    z.object({
      address: z.string(),
      owner: z.string(),
      lamports: z.number(),
      data: z.string(),
    })
  ),
});
