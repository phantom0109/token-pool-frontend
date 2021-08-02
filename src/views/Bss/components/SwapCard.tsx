import React from 'react';
import styled from 'styled-components';

import { Grid } from '@material-ui/core';

// import Button from '../../../components/Button';
import Card from '../../../components/Card';
import CardContent from '../../../components/CardContent';
import useTombFinance from '../../../hooks/useTombFinance';
import Label from '../../../components/Label';
import TokenSymbol from '../../../components/TokenSymbol';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
// import useModal from '../../../hooks/useModal';
// import ExchangeModal from './ExchangeModal';
import ERC20 from '../../../tomb-finance/ERC20';
import useTokenBalance from '../../../hooks/useTokenBalance';
import useApprove, { ApprovalState } from '../../../hooks/useApprove';
import useCatchError from '../../../hooks/useCatchError';

import TokenInput from '../../../components/TokenInput';

// interface ExchangeCardProps {
//   action: string;
//   fromToken: ERC20;
//   fromTokenName: string;
//   toToken: ERC20;
//   toTokenName: string;
//   priceDesc: string;
//   onExchange: (amount: string) => void;
//   disabled?: boolean;
//   disabledDescription?: string;
// }

const SwapCard: React.FC = () => {
  // const catchError = useCatchError();
  // const {
  //   contracts: { Treasury },
  // } = useTombFinance();
  // const [approveStatus, approve] = useApprove(fromToken, Treasury.address);

  // const balance = useTokenBalance(fromToken);
  // const [onPresent, onDismiss] = useModal(
  //   <ExchangeModal
  //     title={action}
  //     description={priceDesc}
  //     max={balance}
  //     onConfirm={(value) => {
  //       onExchange(value);
  //       onDismiss();
  //     }}
  //     action={action}
  //     tokenName={fromTokenName}
  //   />,
  // );
  const handleTombChange = () => {
    console.log("handleTombChange");
  }
  const handleTombSelectMax = () => {
    console.log("handleTombSelectMax");
  }
  const TokenName = "TBond";
  const TokenDesc = "In Wallet";
  const TokenAmount = "15";
  const tombFinance = useTombFinance();
  const fromToken = tombFinance.TBOND;
  return (
    <Card>
      <CardContent>
        <StyledCardContentInner>
          <StyledCardTitle>{`${TokenName}`}</StyledCardTitle>
          <StyledExchanger>
            <StyledToken>
              <StyledCardIcon>
                <TokenSymbol symbol={fromToken.symbol} size={54} />
              </StyledCardIcon>
            </StyledToken>
          </StyledExchanger>
          <Grid item xs={12}>
            <TokenInput
              onSelectMax={handleTombSelectMax}
              onChange={handleTombChange}
              value={"20"}
              max={"60"}
              symbol={`${TokenName}`}
            ></TokenInput>
          </Grid>
          <Grid item xs={12}>
            <p>{`${TokenDesc}`} : {`${TokenAmount}`} TBond</p>
          </Grid>
        </StyledCardContentInner>
      </CardContent>
    </Card>
  );
};

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

export default SwapCard;
