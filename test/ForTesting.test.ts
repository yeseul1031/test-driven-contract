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
});
