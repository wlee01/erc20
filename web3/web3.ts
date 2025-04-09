import { Web3 } from 'web3';
import { abi, address as contractAddress } from '../abis/Mytoken.json'; // Todo: 배포먼저 실행해주세요. (npm run deploy)
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env' });

const web3 = new Web3('http://127.0.0.1:7545'); // Ganache를 사용합니다.
const privateKey = process.env.PRIVATE_KEY || '';

export const getChainId = async () => {
  return web3.eth.net.getId();
};

export const getWeb3 = async () => {
  return web3;
};

export const getOwner = async () => {
  // Contract의 Owner를 리턴합니다.
  return web3.eth.accounts.privateKeyToAccount(privateKey);
};
/*
    위의 코드들은 지우지 않습니다.
    
    abi : Mytoken Contract의 ABI 데이터
    contractAddress : Mytoken Contract의 Address
    privateKey : .env 파일에 설정된 가나슈 계정의 프라이빗 키
*/

export const getContract = () => {
  // Todo: MyToken Contract 인스턴스를 리턴합니다. - new web3.eth.Contract(ABI, 컨트랙트 주소);
  // 이 후에 구현하는 컨트랙트 호출은 구현한 getContract를 사용합니다.
  return new web3.eth.Contract(abi, contractAddress);
};

export const totalSupply = async () => {
  console.log(await getContract().methods.totalSupply().call())
  return await getContract().methods.totalSupply().call(); // 호출해서 문자열 리턴 받기
};


export const balanceOf = async (address: string) => {
  const contract = getContract(); // MyToken 컨트랙트 인스턴스
  const result = await contract.methods.balanceOf(address).call(); // 잔액 조회
  return BigInt(result); // 테스트에서 bigint 기대하므로 변환해서 리턴
};



// Todo: transfer함수는 컨트랙트의 transfer 함수를 사용해서 from 주소에서 to 주소로 amount(wei 단위)의 토큰을 전송해야 하며, 그 값을 리턴해야 합니다.

export const transfer = async (from: string, to: string, amount: number) => {
  const contract = getContract();
  const result = await contract.methods.transfer(to, amount).send({ from });
  return result;
};

//Todo: approve함수는 컨트랙트의 approve 함수를 호출하여 호출하는 주소에서 spender 주소로 amount(wei 단위)만큼 토큰의 권한을 승인해야 하며, 그을 리턴해야 합니다.

export const approve = async (spender: string, amount: number) => {
  const contract = getContract();
  const owner = (await getOwner()).address;
  const result = await contract.methods.approve(spender, amount).send({ from: owner });
  return result;
};

//Todo: allowance함수는 컨트랙트의 allowance 함수를 사용하여 owner가 spender에게 부여한 토큰의 양을 리턴해야 합니다.
export const allowance = async (owner: string, spender: string) => {
  const contract = getContract();
  const result = await contract.methods.allowance(owner, spender).call(); // view 함수이므로 call()
  return result; // 정밀도 보장 위해 BigInt로 변환
};


export const transferFrom = async (
  spender: string, // 호출자, 메타마스크 주소
  from: string,    // 토큰을 보내는 사람 (승인 준 사람)
  to: string,      // 토큰을 받는 사람
  amount: number   // 전송할 수량 (Wei 단위)
) => {
  const contract = getContract();
  const result = await contract.methods
    .transferFrom(from, to, amount)
    .send({ from: spender }); // spender가 트랜잭션을 보내는 주체
  return result;
};

