
import React,{ useEffect, useRef, useState } from 'react'
import { Container, Grid, Paper, Box, TextField, Button, Typography, Modal } from '@material-ui/core';
import Web3 from 'web3';
import DiscreteSliderMarks from './component/linear'
import ModalCustom from './component/modal'
interface ConverterNumber {
  from: number,
  to: number
}
interface WalletData {
  web3: Object,
  networkId: number,
  accounts: any | null
}


const App:React.FC = () => { 

  const inputRef = useRef<HTMLInputElement>(null)

  const [ converterValue, setConverterValue ] = useState<ConverterNumber>({
    from: 0,
    to: 0
  })
  const [ balance, setBalance ] = useState<number | null>(0)
  const [ busdBalance, setBusdBalance ] = useState<number | null>(0)
  const [ busdUserBalance, setBusdUserBalance ] = useState<number | null>(0)
  const [ balancePercent, setBalancePercent ] = useState<number | null>(0)
  const [ walletData, setwalletData ] = useState<WalletData | null>(null)
  const [ modalstate, setModalState ] = useState<boolean>(false)

  const inputOnChange = (e: any) => {
    let enteredValue = Number(e.target.value)
    console.log("enteredValue", enteredValue)
    e.target.name === "from" ? 
    setConverterValue({
      from: enteredValue,
      to: Number(enteredValue * 3) 
    }) : setConverterValue({
      to: enteredValue,
      from: Number(enteredValue  / 3)
    })
  }

  const sliderHandler = (e: any) => {

    setConverterValue({
      from: Number(e.target.value / 100 * busdUserBalance!),
      to: Number(e.target.value / 100 * busdUserBalance! * 3) 
    })
    setBalancePercent(Number(e.target.value))
  }

  const logout = () => {
    setwalletData(null)
  }

  const connectWallet = async () => {
    if (window.ethereum) {
      await window.ethereum.enable()
    }
    let _web3 = await new Web3(Web3.givenProvider)
    const _accounts = await _web3.eth.getAccounts()
    const _networkId = await _web3.eth.net.getId()
    setwalletData({
      web3: _web3,
      accounts: _accounts,
      networkId: _networkId
    })

    await _web3.eth.getBalance(_accounts[0])
    .then( bal => _web3.utils.fromWei(bal, 'ether'))
    .then( converted => {
      setBusdBalance(Number(converted) * 575)
      setBalance(Number(converted))
      setBusdUserBalance(Number(converted) * 575 * Number(converted))
    })
  }

  const CheckWalletDetails = () => {
    if (walletData?.accounts > 0) {
      setModalState(!modalstate)
    }
  }

  const handleClose = () => {
    setModalState(!modalstate)
  }

  useEffect(() => {
    ( async () => {
      //connecting wallet
      console.log('balance', balance)
      const { ethereum } = window

      //switch if network is not on testnet
      if ( walletData?.networkId !== 97 ) {
        try {
          ethereum?.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: '0x61',
                chainName: 'Smart Chain - Testnet',
                nativeCurrency: {
                  name: 'Test ETH',
                  symbol: 'ETH',
                  decimals: 18,
                },
                rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545/'],
                blockExplorerUrls: ['https://testnet.bscscan.com/'],
              }
            ]
          })
          console.log("change network")
        } catch ( error ) {
          console.log('error', error)
        }

      }

    })()
  }, [walletData])


  useEffect( () => {
    setBalancePercent( (Number(converterValue.from) / Number(busdUserBalance)) * 100)
    console.log("balance percent", balancePercent)
  }, [converterValue])

  return (
    <Container maxWidth="lg" className="App">
        <Grid lg={12} style={{display: 'flex', flexDirection: 'column', backgroundColor: '#39D3C4', padding: 30, alignContent: 'center'}}>
          <Paper style={{height: 500, width: 500, display: 'flex', flexDirection: 'column', textAlign: 'center'}}>
          <Typography style={{margin: 30}} variant="h4">
              Crypto Converter
            </Typography>
            { walletData ?
              <> 
                <Typography>
                  Your current balance is {balance} BNB
                </Typography>
                <Typography style={{fontSize: 14}}>
                  1 BNB = 575 BUSD
                </Typography>
                <Typography style={{fontSize: 14}}>
                  Current BUSD = {busdBalance?.toFixed(2)} and you have a total of {busdUserBalance?.toFixed(2)} BUSD
                </Typography>
              </> : null
            }
            <Grid style={{display: 'flex', flexDirection: 'column'}}>
              <Grid lg={12}>
                <Box className="card">
                  <Box className="cardTitle">NEP</Box>
                  <Box className="cardContent">
                      <TextField 
                        ref={inputRef}
                        name="from"
                        label="NEP" 
                        variant="outlined" 
                        value={converterValue.from === 0 ? "" : converterValue.from}
                        onChange={(e) => inputOnChange(e)}
                        style={{ fontFamily: "Poppins" }}
                       />
                    </Box>
                    <Box sx={{ textAlign: "center", fontSize: "10px" }}>
                      {/* Available balance: {presaleData.userBalance} ETH */}
                    </Box>
                    <DiscreteSliderMarks
                      fromPricePercent={balancePercent}
                      onChange={sliderHandler}
                      disabled={!walletData ? true : false}
                    />
                </Box>
              </Grid>
              <Grid item lg={12}>
                <Box className="card">
                  <Box className="cardTitle">BUSD</Box>
                  <Box className="cardContent">
                    <TextField
                      name="to"
                      variant="outlined"
                      label="BUSD"
                      value={converterValue.to === 0 ? "" : converterValue.to}
                      onChange={ (e) => inputOnChange(e)}
                      style={{ fontFamily: "Poppins" }}
                    />

                    </Box>
                    <Box sx={{ textAlign: "center", fontSize: "10px" }}>
                    </Box>
                </Box>
              </Grid>
              { !walletData ? 
              <Button onClick={() => connectWallet()} style={{margin: 20}}>
                Connect wallet
              </Button>
              :
              (
                <>
                  <Button onClick={() => CheckWalletDetails()} style={{alignSelf: 'center', margin: 20}}>
                    Check wallet details
                  </Button>
                  <Button onClick={() => logout()} style={{margin: 5}}>Logout</Button>
                </>
              )
              }
            </Grid>
          </Paper>
        </Grid>
        <ModalCustom 
          open={modalstate} 
          handleClose={handleClose}
          networkId={walletData?.networkId} 
          account={walletData?.accounts}
          balance={balance}
        />
    </Container>
  );
}

export default App;