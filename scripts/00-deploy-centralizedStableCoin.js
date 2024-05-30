const { network, ethers } = require("hardhat");
const { developmentChains, VERIFICATION_BLOCK_CONFIRMATIONS } = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();
    const waitBlockConfirmations = developmentChains.includes(network.name)
        ? 1
        : VERIFICATION_BLOCK_CONFIRMATIONS;
    log("----------------------------------------------------");
    const initialSupply = "100000000000";
    const args = [deployer, initialSupply]; // Assuming deployer as the initial receiver of tokens
    const USDTDeployment = await deploy("USDT", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: waitBlockConfirmations,
    });

    // Verify the deployment
    if (!developmentChains.includes(network.name) && process.env.BnB_API_KEY) {
        log("Verifying...");
        await verify(USDTDeployment.address, args);
    }
    log("----------------------------------------------------");
};

module.exports.tags = ["all", "USDT"];
