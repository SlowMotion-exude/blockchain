const { JsonRpcProvider, Wallet, ContractFactory } = require("ethers");
const fs = require("fs-extra");

// Global variable for the sender contract instance
let senderContract;

async function main() {
  // Setup provider and wallets
  const provider = new JsonRpcProvider("http://127.0.0.1:8545");
  const wallet = new Wallet(
    "0xc555c9ae2b21ffd8a9fcc8747fa018cc36bf2e05403280d373dc6d653409d1e4",
    provider
  );

  // Deploy Container contract
  const containerAbi = fs.readFileSync("../build/Container.abi", "utf8");
  const containerBinary = fs.readFileSync("../build/Container.bin", "utf8");
  const containerFactory = new ContractFactory(
    containerAbi,
    containerBinary,
    wallet
  );

  const containerContract = await containerFactory.deploy(); // Deploy Container
  // await containerContract.deployed();
  console.log("Container contract deployed at:", containerContract.address);

  // Deploy Sender contract with Container contract address
  const senderAbi = fs.readFileSync("../build/Sender.abi", "utf8");
  const senderBinary = fs.readFileSync("../build/Sender.bin", "utf8");
  const senderFactory = new ContractFactory(senderAbi, senderBinary, wallet);

  senderContract = await senderFactory.deploy(containerContract.address); // Deploy Sender
  await senderContract.deployed();
  console.log("Sender contract deployed at:", senderContract.address);
}

// Function to send a container
async function sendContainer(containerId, transporterAddress) {
  try {
    if (!senderContract) {
      throw new Error("Sender contract is not initialized. Run main() first.");
    }

    // Send the container
    const tx = await senderContract.sendContainer(
      containerId,
      transporterAddress
    );

    // Wait for the transaction to be mined
    const receipt = await tx.wait();

    console.log("Transaction receipt:", receipt);
  } catch (error) {
    console.error("Error sending container:", error);
  }
}

// Example usage
(async () => {
  const containerId = "C12345"; // Example container ID
  const transporterAddress = "0xc02AaFcFE9fE1b40B055a5625d77a4c5A3c2f6Fa"; // Replace with transporter's address

  // Run main to deploy contracts
  await main();

  // Send the container
  await sendContainer(containerId, transporterAddress);
})();
