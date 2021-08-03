import { useCallback } from 'react';
import useTombFinance from '../useTombFinance';
import useHandleTransactionReceipt from '../useHandleTransactionReceipt';
// import { BigNumber } from "ethers";
import { parseUnits } from 'ethers/lib/utils';


const useSwapTBondToTShare = () => {
  const tombFinance = useTombFinance();
  const handleTransactionReceipt = useHandleTransactionReceipt();

  const handleSwapTShare = useCallback(
  	(tbondAmount: string) => {
	  	const tbondAmountBn = parseUnits(tbondAmount, 18);
	  	handleTransactionReceipt(
	  		tombFinance.swapTBondToTShare(tbondAmountBn),
	  		`Swap ${tbondAmount} TBond to TShare`
	  	);
  	},
  	[tombFinance, handleTransactionReceipt]
  );
  return { onSwapTShare: handleSwapTShare };
};

export default useSwapTBondToTShare;