
const main = async () => {

  const Token = await ethers.getContractFactory("Token");
  const Migrations = await ethers.getContractFactory("Migrations");
  const EthSwap = await ethers.getContractFactory("EthSwap");
  
    const migrations = await Migrations.deploy();
    await migrations.deployed();
    console.log("Migrations deployed to:", migrations.address);

  const token = await Token.deploy();
  await token.deployed();
  console.log("Token deployed to:", token.address);

  const ethSwap = await EthSwap.deploy(token.address);
  await ethSwap.deployed();

  console.log("EthSwap deployed to:", ethSwap.address);

  await token.transfer(ethSwap.address, '1000000000000000000000000')
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
