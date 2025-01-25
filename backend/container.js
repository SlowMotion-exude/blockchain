// Import Ethers.js
const { JsonRpcProvider, Wallet, Contract, ContractFactory } = require("ethers");
const fs = require("fs-extra");

async function main() {
  // Connect to the Ethereum network (example: local Ganache network)
  const provider = new JsonRpcProvider("http://127.0.0.1:7545");

  // Read ABI and bytecode
  const abi = fs.readFileSync("../build/Container.abi", "utf8");
  const binary = fs.readFileSync("../build/Container.bin", "utf8");

  // Wallet setup
  const wallet = new Wallet(
    "0x2226f475ddd398a859606b05bee51802948fda4f1660debbb6b6bfd6c3c5231c",
    provider
  );

  // Deploy the contract
  const contractFactory = new ContractFactory(abi, binary, wallet);
  const contract = await contractFactory.deploy();
  console.log("Contract deployed at address:", contract.address);

  return contract; // return the contract instance for further use
}

// Functions to interact with the contract
async function registerContainer(contract, containerId, ownerAddress) {
  try {
    const tx = await contract.registerContainer(containerId, ownerAddress);
    const receipt = await tx.wait(); // Wait for transaction to be mined
    console.log("Container registered:", receipt);
  } catch (error) {
    console.error("Error registering container:", error);
  }
}

async function updateContainerStatus(contract, containerId, newStatus) {
  try {
    const tx = await contract.updateStatus(containerId, newStatus);
    const receipt = await tx.wait(); // Wait for transaction to be mined
    console.log("Status updated:", receipt);
  } catch (error) {
    console.error("Error updating status:", error);
  }
}

async function transferContainerOwnership(
  contract,
  containerId,
  newOwnerAddress
) {
  try {
    const tx = await contract.transferOwnership(containerId, newOwnerAddress);
    const receipt = await tx.wait(); // Wait for transaction to be mined
    console.log("Ownership transferred:", receipt);
  } catch (error) {
    console.error("Error transferring ownership:", error);
  }
}

async function getContainerDetails(contract, containerId) {
  try {
    const details = await contract.containers(containerId);
    console.log("Container details:", details);
  } catch (error) {
    console.error("Error fetching container details:", error);
  }
}

(async () => {
  const containerId = "C001";
  const ownerAddress =
    "0xd156dcba33bb335005b233c8f2c6346f28bb362df99c6afa3b7036dd02bce9e5";
  const newOwnerAddress =
    "0xf3876fa1dde0da21bd4ba34ecfb376e3a085f2db066ea8a1e90a3706253e9bcb";
  const newStatus = "In Transit";

  const contract = await main();

  // Register a container
  await registerContainer(contract, containerId, ownerAddress);

  // Update container status
  await updateContainerStatus(contract, containerId, newStatus);

  // Transfer container ownership
  await transferContainerOwnership(
    contract,
    containerId,
    newOwnerAddress
  );

  // Get container details
  await getContainerDetails(contract, containerId);
})();
