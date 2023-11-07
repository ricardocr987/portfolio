import { z } from "zod";

const UiTokenAmount = z.object({
  amount: z.string(),
  decimals: z.number(),
  uiAmount: z.number(),
  uiAmountString: z.string(),
});

const PostTokenBalances = z.object({
  accountIndex: z.number(),
  mint: z.string(),
  owner: z.string(),
  programId: z.string(),
  uiTokenAmount: UiTokenAmount,
});

const InnerInstruction = z.object({
  index: z.number(),
  instructions: z.array(
    z.object({
      accounts: z.array(z.number()),
      data: z.string(),
      programIdIndex: z.number(),
    })
  ),
});

const Meta = z.object({
  err: z.union([z.string(), z.string()]),
  fee: z.number(),
  innerInstructions: z.array(InnerInstruction),
  loadedAddresses: z.object({
    readonly: z.array(z.string()),
    writable: z.array(z.string()),
  }),
  logMessages: z.array(z.string()),
  postBalances: z.array(z.number()),
  postTokenBalances: z.array(PostTokenBalances),
  preBalances: z.array(z.number()),
  preTokenBalances: z.array(PostTokenBalances),
  rewards: z.array(z.string()),
});

const Instruction = z.object({
  accounts: z.array(z.number()),
  data: z.string(),
  programIdIndex: z.number(),
});

const Message = z.object({
  accountKeys: z.array(z.string()),
  addressTableLookups: z.array(z.string()),
  header: z.object({
    numReadonlySignedAccounts: z.number(),
    numReadonlyUnsignedAccounts: z.number(),
    numRequiredSignatures: z.number(),
  }),
  instructions: z.array(Instruction),
  recentBlockhash: z.string(),
});

const Transaction = z.object({
  message: Message,
  signatures: z.array(z.string()),
});

export const BodyRequest = z.object({
  blockTime: z.number(),
  indexWithinBlock: z.number(),
  meta: Meta,
  slot: z.number(),
  transaction: Transaction,
  version: z.number(),
});

