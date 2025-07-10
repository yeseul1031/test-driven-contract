import { expect } from 'chai';
import { ethers } from 'hardhat';

/*
  ForTesting 테스트 리스트 예시
  (아래의 테스트 외에 필요한 테스트를 구현해보시기 바랍니다.)

  - owner 관련
    - 배포시 owner 상태 변경 여부
    - setValue()를 owner만 할 수 있는지
    - withdraw()를 owner만 할 수 있는지
  
  - 함수 검증
    - setValue()를 실행 후 value를 바꾸는지
    - (getter) balances()를 실행 후 balance 값이 나오는지
    - deposit()를 실행 후 보낸 값(value)에 따라 balances를 바꾸는지
    - withdraw()를 실행 후 받을 값(amount)에 따라 balances를 바꾸는지
  
  - 이벤트 검증
    - setValue()를 실행 후 ValueChanged 이벤트가 발생하는지
    - deposit()를 실행 후 Deposited 이벤트가 발생하는지
    - withdraw()를 실행 후 Withdrawn 이벤트가 발생하는지
*/

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
  // 추가
  describe('owner 관련', function () {
    it('배포시 owner 상태 변경 여부', async function () {
      expect(await contract.owner()).to.equal(owner.address);
    });

    it('setValue()를 owner만 할 수 있는지', async function () {
      await expect(contract.connect(owner).setValue(123)).to.not.be.reverted;
      await expect(contract.connect(otherAccount).setValue(456)).to.be.revertedWith(
        'Only owner can call this function'
      );
    });

    it('withdraw()를 owner만 할 수 있는지', async function () {
      await contract.connect(owner).deposit({ value: ethers.parseEther('1') });
      await expect(contract.connect(owner).withdraw(ethers.parseEther('0.1'))).to.not.be.reverted;
      await expect(contract.connect(otherAccount).withdraw(ethers.parseEther('0.1'))).to.be.revertedWith(
        'Only owner can call this function'
      );
    });
  });

  describe('함수 검증', function () {
    it('setValue() 실행 후 value가 바뀌는지', async function () {
      await contract.connect(owner).setValue(999);
      expect(await contract.value()).to.equal(999);
    });

    it('balances() 실행 후 balance 값이 나오는지', async function () {
      expect(await contract.balances(owner.address)).to.equal(0);
      expect(await contract.balances(otherAccount.address)).to.equal(0);
    });

    it('deposit() 실행 후 보낸 값에 따라 balances가 바뀌는지', async function () {
      const depositAmount = ethers.parseEther('1');
      await contract.connect(owner).deposit({ value: depositAmount });
      expect(await contract.balances(owner.address)).to.equal(depositAmount);

      await contract.connect(otherAccount).deposit({ value: depositAmount });
      expect(await contract.balances(otherAccount.address)).to.equal(depositAmount);
    });

    it('withdraw() 실행 후 balances가 감소하는지', async function () {
      const depositAmount = ethers.parseEther('1');
      const withdrawAmount = ethers.parseEther('0.5');
      await contract.connect(owner).deposit({ value: depositAmount });

      await contract.connect(owner).withdraw(withdrawAmount);
      expect(await contract.balances(owner.address)).to.equal(depositAmount - withdrawAmount);
    });

    it('withdraw()시 잔액 부족하면 revert', async function () {
      await contract.connect(owner).deposit({ value: ethers.parseEther('0.1') });
      await expect(contract.connect(owner).withdraw(ethers.parseEther('1'))).to.be.revertedWith(
        'Insufficient balance'
      );
    });

    it('deposit()시 0 이하면 revert', async function () {
      await expect(contract.connect(owner).deposit({ value: 0 })).to.be.revertedWith('Must send Coins');
    });
  });

  describe('이벤트 검증', function () {
    it('setValue() 실행 후 ValueChanged 이벤트 발생', async function () {
      const oldValue = await contract.value();
      const newValue = 777;
      await expect(contract.connect(owner).setValue(newValue))
        .to.emit(contract, 'ValueChanged')
        .withArgs(oldValue, newValue);
    });

    it('deposit() 실행 후 Deposited 이벤트 발생', async function () {
      const depositAmount = ethers.parseEther('1');
      await expect(contract.connect(owner).deposit({ value: depositAmount }))
        .to.emit(contract, 'Deposited')
        .withArgs(owner.address, depositAmount);
    });

    it('withdraw() 실행 후 Withdrawn 이벤트 발생', async function () {
      const depositAmount = ethers.parseEther('1');
      const withdrawAmount = ethers.parseEther('0.5');
      await contract.connect(owner).deposit({ value: depositAmount });
      await expect(contract.connect(owner).withdraw(withdrawAmount))
        .to.emit(contract, 'Withdrawn')
        .withArgs(owner.address, withdrawAmount);
    });
  });

});
