import { config } from "dotenv";
import express from "express";
import { verify, settle } from "kaia-x402/facilitator";
import {
  PaymentRequirementsSchema,
  PaymentRequirements,
  PaymentPayload,
  PaymentPayloadSchema,
} from "kaia-x402/types";
import { createPublicClient, createWalletClient, http, publicActions } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { seiTestnet, sei, baseSepolia, kaia } from "viem/chains";

config();

const PRIVATE_KEY = process.env.PRIVATE_KEY;

if (!PRIVATE_KEY) {
  console.error("Missing required environment variables");
  process.exit(1);
}

// createConnectedClient and createSigner are imported directly

const app = express();
app.use(express.json());

type VerifyRequest = {
  paymentPayload: PaymentPayload;
  paymentRequirements: PaymentRequirements;
};

type SettleRequest = {
  paymentPayload: PaymentPayload;
  paymentRequirements: PaymentRequirements;
};

// Create client based on environment variable
const networkType = process.env.NETWORK || "sei";
let chain;
if (networkType === "sei") {
  chain = sei;
} else if (networkType === "sei-testnet") {
  chain = seiTestnet;
} else if (networkType === "kaia") {
  chain = kaia;
} else if (networkType === "base-sepolia") {
  chain = baseSepolia;
} else {
  chain = sei; // Default to sei
}

const client = createPublicClient({
  chain: chain,
  transport: http()
});

// Verification endpoint
app.post("/verify", async (req, res) => {
  try {
    console.log("🔍 Verification request received:", JSON.stringify(req.body, null, 2));
    
    const body: VerifyRequest = req.body;
    console.log("📋 Parsing payment requirements...");
    const paymentRequirements = PaymentRequirementsSchema.parse(
      body.paymentRequirements
    );
    console.log("✅ Payment requirements parsed:", JSON.stringify(paymentRequirements, null, 2));
    
    console.log("📋 Parsing payment payload...");
    const paymentPayload = PaymentPayloadSchema.parse(body.paymentPayload);
    console.log("✅ Payment payload parsed:", JSON.stringify(paymentPayload, null, 2));
    
    console.log("🔍 Calling verify function...");
    const valid = await verify(client, paymentPayload, paymentRequirements);
    console.log("✅ Verification result:", JSON.stringify(valid, null, 2));
    
    res.json(valid);
  } catch (error) {
    console.error("❌ Verification error:", error);
    res.status(400).json({ error: "Invalid request", details: error instanceof Error ? error.message : String(error) });
  }
});

// Settlement endpoint
app.post("/settle", async (req, res) => {
  try {
    console.log("💰 Settlement request received:", JSON.stringify(req.body, null, 2));
    
    console.log("🔑 Creating account from private key...");
    const account = privateKeyToAccount(PRIVATE_KEY as `0x${string}`);
    console.log("✅ Account created:", account.address);
    
    console.log("🔧 Creating wallet client...");
    const signer = createWalletClient({
      chain: chain,
      transport: http(),
      account
    }).extend(publicActions);
    console.log("✅ Wallet client created");
    
    const body: SettleRequest = req.body;
    console.log("📋 Parsing payment requirements...");
    const paymentRequirements = PaymentRequirementsSchema.parse(
      body.paymentRequirements
    );
    console.log("✅ Payment requirements parsed:", JSON.stringify(paymentRequirements, null, 2));
    
    console.log("📋 Parsing payment payload...");
    const paymentPayload = PaymentPayloadSchema.parse(body.paymentPayload);
    console.log("✅ Payment payload parsed:", JSON.stringify(paymentPayload, null, 2));
    
    console.log("💰 Calling settle function...");
    console.log("🔧 Signer type:", typeof signer);
    console.log("🔧 Signer properties:", Object.keys(signer));
    
    const response = await settle(signer, paymentPayload, paymentRequirements);
    console.log("✅ Settlement result:", JSON.stringify(response, null, 2));
    
    res.json(response);
  } catch (error) {
    console.error("❌ Settlement error:", error);
    console.error("❌ Error type:", typeof error);
    console.error("❌ Error stack:", error instanceof Error ? error.stack : "No stack trace");
    res.status(400).json({ error: "Invalid request", details: error instanceof Error ? error.message : String(error) });
  }
});

// Supported schemes endpoint
app.get("/supported", (req, res) => {
  console.log("📋 Supported schemes request received");
  const response = {
    kinds: [
      {
        x402Version: 1,
        scheme: "exact",
        network: networkType,
      },
    ],
  };
  console.log("✅ Returning supported schemes:", JSON.stringify(response, null, 2));
  res.json(response);
});

app.listen(process.env.PORT || 3000, () => {
  console.log("🚀 Facilitator server starting...");
  console.log("🔧 Environment:");
  console.log("   - PRIVATE_KEY:", PRIVATE_KEY ? "✅ Set" : "❌ Missing");
  console.log("   - PORT:", process.env.PORT || 3000);
  console.log("   - Network:", networkType);
  console.log("🔧 Client created:", client ? "✅" : "❌");
  console.log(
    `✅ Server listening at http://localhost:${process.env.PORT || 3000}`
  );
});