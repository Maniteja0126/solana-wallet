import nacl from "tweetnacl";
import { Buffer } from "buffer";
import { generateMnemonic, mnemonicToSeedSync } from "bip39";
import { derivePath } from "ed25519-hd-key";
import {
  Keypair,
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
  Transaction,
  SystemProgram,
  sendAndConfirmTransaction,
} from "@solana/web3.js";

const connection = new Connection(import.meta.env.VITE_CONNECTION_URL);

export const generateMnemonicRandom = async () => {
  return generateMnemonic();
};

export const getSolWallet = (mnemonicPhase, index) => {
  const seed = mnemonicToSeedSync(mnemonicPhase);
  const solIndex = index;
  const path = `m/44'/501'/${solIndex}'/0'`;
  const derivedKey = derivePath(path, seed.toString("hex")).key;

  const keypair = Keypair.fromSecretKey(
    Buffer.from(nacl.sign.keyPair.fromSeed(derivedKey).secretKey)
  );

  const privateKey = Buffer.from(keypair.secretKey).toString("hex");
  const publicKey = keypair.publicKey.toBase58();


  const walletDetails = [privateKey, publicKey];

  return walletDetails;
};

export const getSolBalance = async (address) => {
  const publicKey = new PublicKey(address);
  const balance = (await connection.getBalance(publicKey)) / LAMPORTS_PER_SOL;

  return balance;
};

export const airdropWallet = async (address) => {
  try {
    const publicKey = new PublicKey(address);

    if (!(publicKey instanceof PublicKey)) {
      throw new Error("Invalid public key format.");
    }

    const signature = await connection.requestAirdrop(
      publicKey,
      2 * LAMPORTS_PER_SOL
    );


    await confirmTransactionStatus(signature);


  } catch (error) {
    console.error("Error during airdrop:", error);
  }
};

const confirmTransactionStatus = async (signature) => {
  let confirmed = false;
  const maxRetries = 10;
  const delay = 5000; 

  for (let i = 0; i < maxRetries; i++) {
    const { value } = await connection.getSignatureStatuses([signature]);

    if (value[0] && value[0].confirmationStatus === 'finalized') {
      confirmed = true;
      break;
    }

    await new Promise(resolve => setTimeout(resolve, delay));
  }

  if (!confirmed) {
    throw new Error(`Transaction ${signature} not confirmed after retries.`);
  }
};


export const transferSol = async (
  senderPrivateKey,
  receiverAddress,
  amount
) => {
  try {
    const senderKeypair = Keypair.fromSecretKey(
      Buffer.from(senderPrivateKey, "hex")
    );
    const senderPublicKey = senderKeypair.publicKey;

    const receiverPublicKey = new PublicKey(receiverAddress);

    const amountInLamports = amount * LAMPORTS_PER_SOL;

    const senderBalanceInSol = await getSolBalance(senderPublicKey);

    if (senderBalanceInSol < amount) {
      console.log("Insufficient balance");
      return;
    }

    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: senderPublicKey,
        toPubkey: receiverPublicKey,
        lamports: amountInLamports,
      })
    );

     await sendAndConfirmTransaction(connection, transaction, [
      senderKeypair,
    ]);

  } catch (err) {
    console.error("Error during transfer:", err); 
  }
};
