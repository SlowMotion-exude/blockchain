// Import Ethers.js
const { JsonRpcProvider, Wallet, ContractFactory } = require("ethers");
const fs = require("fs-extra");

async function main() {
  // Connect to Ethereum network
  const provider = new JsonRpcProvider("http://127.0.0.1:8545");

  // Load contract ABI and bytecode
  const abi = fs.readFileSync("../build/Transporter.abi", "utf8");
  const binary = fs.readFileSync("../build/Transporter.bin", "utf8");

  // Create wallet
  const wallet = new Wallet(
    "0xbafd3f53f4f66fff26ef7a776186e54d54f56bb76e436b4c8b2a717f511b4e15",
    provider
  );

  // Deploy contract
  const contractFactory = new ContractFactory(abi, binary, wallet);
  const transporterContract = await contractFactory.deploy();

  // await transporterContract.deployed();
  console.log("Transporter contract deployed at:", transporterContract.address);

  return transporterContract;
}

// Function to assign a transporter
async function assignTransport(
  transporterContract,
  containerId,
  transporterAddress
) {
  try {
    const tx = await transporterContract.assignTransport(
      containerId,
      transporterAddress
    );
    const receipt = await tx.wait();
    console.log("Transport assigned:", receipt);
  } catch (error) {
    console.error("Error assigning transport:", error);
  }
}

// Function to update transport status
async function updateTransportStatus(
  transporterContract,
  containerId,
  newStatus
) {
  try {
    const tx = await transporterContract.updateTransportStatus(
      containerId,
      newStatus
    );
    const receipt = await tx.wait();
    console.log("Transport status updated:", receipt);
  } catch (error) {
    console.error("Error updating transport status:", error);
  }
}

// Example usage
(async () => {
  const containerId = "C12345"; // Example container ID
  const transporterAddress = "0xc02AaFcFE9fE1b40B055a5625d77a4c5A3c2f6Fa"; // Replace with a valid address
  const newStatus = "In Transit"; // Example new status

  const transporterContract = await main();
  
  // Assign a transporter to the container
  await assignTransport(transporterContract, containerId, transporterAddress);

  // Update the transport status
  await updateTransportStatus(transporterContract, containerId, newStatus);
})();
