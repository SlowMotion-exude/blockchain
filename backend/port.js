// Import Ethers.js
const { JsonRpcProvider, Wallet, ContractFactory } = require("ethers");
const fs = require("fs-extra");

async function main() {
  const provider = new JsonRpcProvider("http://127.0.0.1:7545");

  const abi = fs.readFileSync("../build/Port.abi", "utf8");
  const binary = fs.readFileSync("../build/Port.bin", "utf8");

  const wallet = new Wallet(
    "0xd7d334e839298ee4722d69b4a7791b9b80b1f6233c573ee787c852c12f188bae",
    provider
  );

  // Create contract instance
  const contractFactory = new ContractFactory(abi, binary, wallet);
  const transporterContract = await contractFactory.deploy();
  await transporterContract.deployed();
  console.log("Port contract deployed at:", transporterContract.address);

  // Set signer
  const signer = wallet;

  const tx = {
    to: "0x9381df36f88169D881482C5Be8c90e27421f0bE2",
    value: ethers.utils.parseEther("5"), // Adjust the value as needed
  };
  const txResponse = await signer.sendTransaction(tx);
  await txResponse.wait();
  

  // Function to log a container
  async function logContainer(containerId, status) {
    try {
      const contractWithSigner = transporterContract.connect(signer);
      const tx = await contractWithSigner.logContainer(containerId, status, {
        gasLimit: 3000000, // Adjust gas limit if necessary
      });
      const receipt = await tx.wait(); // Wait for the transaction to be mined
      console.log("Container logged:", receipt);
    } catch (error) {
      console.error("Error logging container:", error);
    }
  }

  // Function to get logs for a container
  async function getLogs(containerId) {
    try {
      const logs = await transporterContract.getLogs(containerId);
      logs.forEach((log) => {
        console.log(`Container ID: ${log.containerId}`);
        console.log(`Status: ${log.status}`);
        console.log(
          `Timestamp: ${new Date(log.timestamp * 1000).toLocaleString()}`
        );
      });
    } catch (error) {
      console.error("Error fetching logs:", error);
    }
  }

  // Example usage
  const containerId = "C12345";
  const status = "Arrived";

  // Log a container
  await logContainer(containerId, status);

  // Fetch and display logs for the container
  console.log(`Logs for container ID ${containerId}:`);
  await getLogs(containerId);
}

main().catch((error) => {
  console.error("Error in main:", error);
});
