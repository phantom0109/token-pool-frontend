import React, { useCallback, useMemo, useEffect} from 'react';
import Page from '../../components/Page';
import PitImage from '../../assets/img/pit.png';
import { createGlobalStyle } from 'styled-components';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import { useWallet } from 'use-wallet';
import UnlockWallet from '../../components/UnlockWallet';
import PageHeader from '../../components/PageHeader';
import { Box, Button, Grid, Paper, Typography } from '@material-ui/core';
import styled from 'styled-components';
import Spacer from '../../components/Spacer';
import useBondStats from '../../hooks/useBondStats';
import useTombFinance from '../../hooks/useTombFinance';
import useTokenBalance from '../../hooks/useTokenBalance';
// import useCashPriceInLastTWAP from '../../hooks/useCashPriceInLastTWAP';
import { useTransactionAdder } from '../../state/transactions/hooks';

import useBondsPurchasable from '../../hooks/useBondsPurchasable';
import { getDisplayBalance } from '../../utils/formatBalance';
import { BOND_REDEEM_PRICE, BOND_REDEEM_PRICE_BN } from '../../tomb-finance/constants';

import { getDefaultProvider } from '../../utils/provider';
import { BigNumber, ethers } from 'ethers';
import Web3 from "web3";
import { ChainId } from '@spookyswap/sdk';

const BackgroundImage = createGlobalStyle`
  body {
    background: url(${PitImage}) no-repeat !important;
    background-size: cover !important;
  }
`;


const Pit: React.FC = () => {
  const { path } = useRouteMatch();
  const { account } = useWallet();
  const tombFinance = useTombFinance();
  const bondBalance = useTokenBalance(tombFinance?.TBOND);
  const bondStat = useBondStats();

  // const addTransaction = useTransactionAdder();
  
  // const cashPrice = useCashPriceInLastTWAP();
  // const bondsPurchasable = useBondsPurchasable();

  async function getTShareAmountPerTomb() {
    try {
      // const provider = getDefaultProvider();
      // const signer = provider.getSigner(0);
      const contractAddress = "0x2942168Fa8A39d070cB1173a54479F7C6A94604d";
      const contractAbi = [{"inputs":[{"internalType":"address","name":"_tomb","type":"address"},{"internalType":"address","name":"_tbond","type":"address"},{"internalType":"address","name":"_tshare","type":"address"},{"internalType":"address","name":"_wftmAddress","type":"address"},{"internalType":"address","name":"_tombSpookyLpPair","type":"address"},{"internalType":"address","name":"_tshareSpookyLpPair","type":"address"},{"internalType":"address","name":"_daoAddress","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOperator","type":"address"},{"indexed":true,"internalType":"address","name":"newOperator","type":"address"}],"name":"OperatorTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"sender","type":"address"},{"indexed":false,"internalType":"uint256","name":"tbondAmount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"tshareAmount","type":"uint256"}],"name":"TBondSwapPerformed","type":"event"},{"inputs":[],"name":"daoAddress","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_tbondAmount","type":"uint256"}],"name":"estimateAmountOfTShare","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_user","type":"address"}],"name":"getTBondBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getTShareAmountPerTomb","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getTShareBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getTSharePrice","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getTombPrice","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"isOperator","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"operator","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_tbondAmount","type":"uint256"}],"name":"swapTBondToTShare","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"tbond","outputs":[{"internalType":"contract IERC20","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"tomb","outputs":[{"internalType":"contract IERC20","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"tombSpookyLpPair","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"newOperator_","type":"address"}],"name":"transferOperator","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"tshare","outputs":[{"internalType":"contract IERC20","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"tshareSpookyLpPair","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"wftmAddress","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"withdrawTShare","outputs":[],"stateMutability":"nonpayable","type":"function"}];
      // let BssContract = new ethers.Contract(contractAddress, contractAbi, provider);
      // console.log(BssContract.getTSharePrice());
      //BssContract.connect(signer);
      // let TShareAmountPerTomb = BssContract.getTShareAmountPerTomb();
      // { BigNumber: "4136290258374328791075" }

      // Format the DAI for displaying to the user
      // ethers.utils.formatUnits(TShareAmountPerTomb, 18);
      // console.log(TShareAmountPerTomb);
      
      // const provider = new ethers.providers.Web3Provider(web3ProviderFrom('https://rpc.ftm.tools/'), ChainId.MAINNET);
      // const BssContract = new ethers.Contract(contractAddress, contractAbi, provider);
      // console.log(BssContract);
      // let provider = new ethers.providers.Web3Provider(web3.currentProvider);
      // console.log(provider);
      // await BssContract.methods
      //   .getTSharePrice()
      //   .call()
      //   .then((price) => {
      //     console.log(price);
      //   })
      //   .catch((err) => {console.log(err)});
      // await window.ethereum.enable()
    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => {getTShareAmountPerTomb();  }, [])

  // const handleBuyBonds = useCallback(
  //   async (amount: string) => {
  //     const tx = await tombFinance.buyBonds(amount);
  //     addTransaction(tx, {
  //       summary: `Buy ${Number(amount).toFixed(2)} TBOND with ${amount} TOMB`,
  //     });
  //   },
  //   [tombFinance, addTransaction],
  // );

  // const handleRedeemBonds = useCallback(
  //   async (amount: string) => {
  //     const tx = await tombFinance.redeemBonds(amount);
  //     addTransaction(tx, { summary: `Redeem ${amount} TBOND` });
  //   },
  //   [tombFinance, addTransaction],
  // );
  // const isBondRedeemable = useMemo(() => cashPrice.gt(BOND_REDEEM_PRICE_BN), [cashPrice]);
  // const isBondPurchasable = useMemo(() => Number(bondStat?.tokenInFtm) < 1.01, [bondStat]);

  return (
    <Switch>
      <Page>
        <BackgroundImage />
        {!!account ? (
          <>
            <Route exact path={path}>
              <PageHeader icon={'🏦'} title="TBond -> TShare Swap" subtitle="Swap TBond to TShare" />
            </Route>
            <StyledBond>
              <StyledCardWrapper>
                <SwapCard />
              </StyledCardWrapper>
              <Spacer />
              <StyledCardWrapper>
                <SwapCard />
              </StyledCardWrapper>
            </StyledBond>
            <StyledApprove>
              <Button
                    // disabled={stakedBalance.eq(0) || (!canWithdraw && !canClaimReward)}
                    // onClick={onRedeem}
                    color="primary"
                    variant="contained"
                  >
                    Approve TBond
              </Button>
            </StyledApprove>
          </>
        ) : (
          <UnlockWallet />
        )}
      </Page>
    </Switch>
  );
};

const StyledApprove = styled.div`
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledBond = styled.div`
  display: flex;
  @media (max-width: 768px) {
    width: 100%;
    flex-flow: column nowrap;
    align-items: center;
  }
`;

const StyledCardWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  @media (max-width: 768px) {
    width: 80%;
  }
`;

const StyledStatsWrapper = styled.div`
  display: flex;
  flex: 0.8;
  margin: 0 20px;
  flex-direction: column;

  @media (max-width: 768px) {
    width: 80%;
    margin: 16px 0;
  }
`;

export default Pit;
