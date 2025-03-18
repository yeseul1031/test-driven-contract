import { expect } from 'chai';
import { ethers } from 'hardhat';

describe('ForTesting 테스트', function () {
  let contract: any;
  let owner: any;
  let otherAccount: any;

  beforeEach(async function () {
    [owner, otherAccount] = await ethers.getSigners();
    const ContractFactory = await ethers.getContractFactory('ForTesting');
    contract = await ContractFactory.deploy();
    await contract.waitForDeployment();
  });

  describe('테스트 단위별로 나눌 수 있습니다.', function () {
    it('테스트 개체별로 나눌 수 있습니다.', function () {
      expect(true).to.be.true;
    });
  });

  // Todo: 자신만의 ForTesting의 테스트 코드를 만듭니다.
});
