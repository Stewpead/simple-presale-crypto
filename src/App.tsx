
import React,{ useEffect, useRef, useState } from 'react'
import { Container, Grid, Paper, Box, TextField, Button, Typography } from '@material-ui/core';
import Web3 from 'web3';
import DiscreteSliderMarks from './component/linear'

interface ConverterNumber {
  from: number,
  to: number
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

  const logout = async () => {
    await window.ethereum.wallet.clear()
  }

  useEffect(() => {
    ( async () => {
      //connecting wallet
      if (window.ethereum) {
        await window.ethereum.enable()
      }
      let web3 = await new Web3(Web3.givenProvider)
      const accounts = await web3.eth.getAccounts()
      const networkId = await web3.eth.net.getId()
      console.log('accounts', accounts)
      // const request = await web3.eth.requestAccounts()
      await web3.eth.getBalance(accounts[0])
      .then( bal => web3.utils.fromWei(bal, 'ether'))
      .then( converted => {
        setBusdBalance(Number(converted) * 575)
        setBalance(Number(converted))
        setBusdUserBalance(Number(converted) * 575 * Number(converted))
      })
      
      console.log('balance', balance)
      const { ethereum } = window

      //switch if network is not on testnet
      if ( networkId !== 97 ) {
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

      window.ethereum.on('accountsChanged', async function() {
        if (window.ethereum) {
          await window.ethereum.enable()
        }
      })
    })()
  }, [])


  useEffect( () => {
    setBalancePercent( (Number(converterValue.from) / Number(busdUserBalance)) * 100)
    console.log("balance percent", balancePercent)
  }, [converterValue])

  return (
    <Container maxWidth="lg" className="App">
        <Grid lg={12} style={{display: 'flex', flexDirection: 'column', backgroundColor: '#39D3C4', padding: 30, alignContent: 'center'}}>
          <Paper style={{height: 500, width: 500, display: 'flex', flexDirection: 'column', textAlign: 'center'}}>
            <Typography style={{margin: 30}}>
              Your current balance is {balance} BNB
            </Typography>
            <Typography style={{fontSize: 14}}>
              1 BNB = 575 BUSD
            </Typography>
            <Typography style={{fontSize: 14}}>
              Current BUSD = {busdBalance?.toFixed(2)} and you have a total of {busdUserBalance?.toFixed(2)} BUSD
            </Typography>
            <Grid container spacing={3}>
              <Grid item lg={6}>
                <Box className="card">
                  <Box className="cardTitle">From</Box>
                  <Box className="cardContent">
                    <TextField
                        ref={inputRef}
                        name="from"
                        className="inputStyle"
                        variant="standard"
                        placeholder="0.0"
                        type="number"
                        value={converterValue.from === 0 ? "" : converterValue.from}
                        onChange={(e) => inputOnChange(e)}
                        style={{ fontFamily: "Poppins" }}
                    />
                      <Button className="unitLabel">
                        ETH
                        {/* <ExpandMoreIcon /> */}
                      </Button>
                    </Box>
                    <Box sx={{ textAlign: "center", fontSize: "10px" }}>
                      {/* Available balance: {presaleData.userBalance} ETH */}
                    </Box>
                    <DiscreteSliderMarks
                      fromPricePercent={balancePercent}
                      onChange={sliderHandler}
                    />
                </Box>
              </Grid>
              <Grid item lg={6}>
              <Box className="card">
                  <Box className="cardTitle">To</Box>
                  <Box className="cardContent">
                    <TextField
                      name="to"
                      className="inputStyle"
                      variant="standard"
                      placeholder="0.0"
                      type="number"
                      value={converterValue.to === 0 ? "" : converterValue.to}
                      onChange={ (e) => inputOnChange(e)}
                      style={{ fontFamily: "Poppins" }}
                    />
                      <Button className="unitLabel">
                        ETH
                        {/* <ExpandMoreIcon /> */}
                      </Button>
                    </Box>
                    <Box sx={{ textAlign: "center", fontSize: "10px" }}>
                    </Box>
                </Box>
              </Grid>
              <Button onClick={() => logout()} style={{alignSelf: 'center'}}>
                Logout
              </Button>
            </Grid>
          </Paper>
        </Grid>

    </Container>
  );
}

export default App;


// web3.eth.sign(web3.eth.defaultAccount, web3.sha3('test'), function (err, signature) {
//   console.log(signature);  // But maybe do some error checking. :-)
// });
// const util = require('ethereumjs-util');
// const sig = util.fromRpcSig('<signature from front end>');
// const publicKey = util.ecrecover(util.sha3('test'), sig.v, sig.r, sig.s);
// const address = util.pubToAddress(publicKey).toString('hex');
// window.web3 = await new window.Moralis.Web3.enable({ provider: "walletconnect" });

// await window.web3.eth.currentProvider.disconnect();