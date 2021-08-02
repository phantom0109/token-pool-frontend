import React, { useCallback, useMemo, useEffect, useState } from 'react';
import Page from '../../components/Page';
import PitImage from '../../assets/img/pit.png';
import { createGlobalStyle } from 'styled-components';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import { useWallet } from 'use-wallet';
import UnlockWallet from '../../components/UnlockWallet';
import PageHeader from '../../components/PageHeader';
import { Box, Button, Grid, Paper, Typography } from '@material-ui/core';
import SwapCard from './components/SwapCard';
import styled from 'styled-components';
import Spacer from '../../components/Spacer';
import useBondStats from '../../hooks/useBondStats';
import useTombFinance from '../../hooks/useTombFinance';
import useTokenBalance from '../../hooks/useTokenBalance';
import { useTransactionAdder } from '../../state/transactions/hooks';
import useBondsPurchasable from '../../hooks/useBondsPurchasable';
import { getDisplayBalance, getBalance } from '../../utils/formatBalance';
import { BOND_REDEEM_PRICE, BOND_REDEEM_PRICE_BN } from '../../tomb-finance/constants';


import { BigNumber, ethers } from 'ethers';
import useSwapTBondToTShare from '../../hooks/TShareSwapper/useSwapTBondToTShare';
import useApprove, { ApprovalState } from '../../hooks/useApprove';
import useTShareSwapperStats from '../../hooks/TShareSwapper/useTShareSwapperStats';
import TokenInput from '../../components/TokenInput';
import Card from '../../components/Card';
import CardContent from '../../components/CardContent';
import TokenSymbol from '../../components/TokenSymbol';

const BackgroundImage = createGlobalStyle`
  body {
    background: url(${PitImage}) no-repeat !important;
    background-size: cover !important;
  }
`;

function isNumeric(n: any) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

const Sbs: React.FC = () => {
  const { path } = useRouteMatch();
  const { account } = useWallet();
  const tombFinance = useTombFinance();
  // const bondBalanceBN = useTokenBalance(tombFinance?.TBOND);
  const bondStat = useBondStats();

  const [tbondAmount, setTbondAmount] = useState('');
  const [tshareAmount, setTshareAmount] = useState('');

  const [approveStatus, approve] = useApprove(tombFinance.TBOND, tombFinance.contracts.TShareSwapper.address);
  const addTransaction = useTransactionAdder();
  const { onSwapTShare } = useSwapTBondToTShare();
  const tshareSwapperStat = useTShareSwapperStats(account);

  const tshareBalance = useMemo(() => (tshareSwapperStat ? Number(tshareSwapperStat.tshareBalance) : 0), [tshareSwapperStat]);
  const bondBalance = useMemo(() => (tshareSwapperStat ? Number(tshareSwapperStat.tbondBalance) : 0), [tshareSwapperStat]);

  const handleTBondChange = async (e: any) => {
    if (e.currentTarget.value === '') {
      setTbondAmount('');
      setTshareAmount('');
      return
    }
    if (!isNumeric(e.currentTarget.value)) return;
    setTbondAmount(String(e.currentTarget.value));
    const updateTShareAmount = await tombFinance.estimateAmountOfTShare(BigNumber.from(e.currentTarget.value));
    setTshareAmount(updateTShareAmount.toString());  
  };

  const handleTBondSelectMax = async () => {
    setTbondAmount(String(bondBalance));
    const updateTShareAmount = await tombFinance.estimateAmountOfTShare(BigNumber.from(bondBalance));
    setTshareAmount(updateTShareAmount.toString()); 
  };

  const handleTShareSelectMax = async () => {
    setTshareAmount(String(tshareBalance));
  };

  const handleTShareChange = async (e: any) => {
    if (e.currentTarget.value === '') {
      setTshareAmount('');
    }
    if (!isNumeric(e.currentTarget.value)) return;
    setTbondAmount(String(e.currentTarget.value));
  }

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
                <Card>
                  <CardContent>
                    <StyledCardContentInner>
                      <StyledCardTitle>TBonds</StyledCardTitle>
                      <StyledExchanger>
                        <StyledToken>
                          <StyledCardIcon>
                            <TokenSymbol symbol={tombFinance.TBOND.symbol} size={54} />
                          </StyledCardIcon>
                        </StyledToken>
                      </StyledExchanger>
                      <Grid item xs={12}>
                        <TokenInput
                          onSelectMax={handleTBondSelectMax}
                          onChange={handleTBondChange}
                          value={tbondAmount}
                          max={bondBalance}
                          symbol="TBond"
                        ></TokenInput>
                      </Grid>
                    </StyledCardContentInner>
                  </CardContent>
                </Card>
              </StyledCardWrapper>
              <Spacer />
              <StyledCardWrapper>
                <Card>
                  <CardContent>
                    <StyledCardContentInner>
                      <StyledCardTitle>TShare</StyledCardTitle>
                      <StyledExchanger>
                        <StyledToken>
                          <StyledCardIcon>
                            <TokenSymbol symbol={tombFinance.TBOND.symbol} size={54} />
                          </StyledCardIcon>
                        </StyledToken>
                      </StyledExchanger>
                      <Grid item xs={12}>
                        <TokenInput
                          onSelectMax={handleTShareSelectMax}
                          onChange={handleTShareChange}
                          value={tshareAmount}
                          max={tshareBalance}
                          symbol="TShare"
                        ></TokenInput>
                      </Grid>
                    </StyledCardContentInner>
                  </CardContent>
                </Card>
              </StyledCardWrapper>
            </StyledBond>
            <StyledApprove>
              {approveStatus !== ApprovalState.APPROVED ? (
                <Button
                  disabled={approveStatus !== ApprovalState.NOT_APPROVED}
                  variant="contained"
                  color="primary"
                  style={{ marginTop: '150px' }}
                  onClick={approve}
                >
                  Approve TBOND
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  style={{ marginTop: '20px' }}
                  onClick={() => onSwapTShare(tbondAmount.toString())}
                >
                  Swap
                </Button>
              )}
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

const StyledCardTitle = styled.div`
  align-items: center;
  display: flex;
  font-size: 20px;
  font-weight: 700;
  height: 64px;
  justify-content: center;
  margin-top: ${(props) => -props.theme.spacing[3]}px;
`;

const StyledCardIcon = styled.div`
  background-color: ${(props) => props.theme.color.grey[900]};
  width: 72px;
  height: 72px;
  border-radius: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: ${(props) => props.theme.spacing[2]}px;
`;

const StyledExchanger = styled.div`
  align-items: center;
  display: flex;
  margin-bottom: ${(props) => props.theme.spacing[5]}px;
`;

const StyledToken = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  font-weight: 600;
`;

const StyledCardContentInner = styled.div`
  align-items: center;
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
`;

export default Sbs;
