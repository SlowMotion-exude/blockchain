// Import Ethers.js
const { JsonRpcProvider, Wallet, ContractFactory } = require("ethers");
const fs = require("fs-extra");

// Global variable for the contract instance
let receiverContract;

async function main() {
  // Setup provider and wallet
  const provider = new JsonRpcProvider("http://127.0.0.1:7545");
  const wallet = new Wallet(
    "0xd156dcba33bb335005b233c8f2c6346f28bb362df99c6afa3b7036dd02bce9e5",
    provider
  );

  // Deploy the Container contract first
  const containerAbi = fs.readFileSync("../build/Container.abi", "utf8");
  const containerBinary = fs.readFileSync("../build/Container.bin", "utf8");
  const containerFactory = new ContractFactory(
    containerAbi,
    containerBinary,
    wallet
  );

  const containerContract = await containerFactory.deploy(); // Deploy Container
  await containerContract.deployed(); // Wait for deployment
  console.log("Container contract deployed at:", containerContract.address);

  // Now deploy the Receiver contract with the Container contract address
  const receiverAbi = fs.readFileSync("../build/Receiver.abi", "utf8");
  const receiverBinary = fs.readFileSync("../build/Receiver.bin", "utf8");
  const receiverFactory = new ContractFactory(
    receiverAbi,
    receiverBinary,
    wallet
  );

  // Pass the deployed Container contract address to the Receiver constructor
  receiverContract = await receiverFactory.deploy(containerContract.address);
  await receiverContract.deployed(); // Wait for deployment
  console.log("Receiver contract deployed at:", receiverContract.address);
}

// Function to confirm delivery of a container
async function confirmDelivery(containerId) {
  try {
    if (!receiverContract) {
      throw new Error(
        "Receiver contract is not initialized. Run main() first."
      );
    }

    // Send the transaction to confirm delivery
    const tx = await receiverContract.confirmDelivery(containerId);

    // Wait for the transaction to be mined
    const receipt = await tx.wait();

    console.log("Delivery confirmed:", receipt);
  } catch (error) {
    console.error("Error confirming delivery:", error);
  }
}

// Example usage
(async () => {
  const containerId = "C12345"; // Example container ID

  // Run main to deploy contracts
  await main();

  // Confirm the delivery of the container
  await confirmDelivery(containerId);
})();
