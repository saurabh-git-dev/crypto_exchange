import React, { Component } from 'react'
import { ethers } from 'ethers'
import Token from '../abis/Token.json'
import EthSwap from '../abis/EthSwap.json'
import Navbar from './Navbar'
import Main from './Main'
import './App.css'

const { ethereum } = window

const getTokenContract = () => {
  const tokenAddress = '0x134F33E4a2e01f1e8BD3B7A6bb348995a55F97B6';
  const provider = new ethers.providers.Web3Provider(ethereum)
  const contract = new ethers.Contract(tokenAddress, Token.abi, provider.getSigner())
  // console.log(contract)
  return contract
}
const getEthSwapContract = () => {
  const ethSwapAddress = '0x9965ffe9B6B9247066Ca8eFFbF2b5BdA22F5F2b9';
  const provider = new ethers.providers.Web3Provider(ethereum)
  const contract = new ethers.Contract(ethSwapAddress, EthSwap.abi, provider.getSigner())
  // console.log(contract)
  return contract
}


class App extends Component {

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadBlockchainData() {
    if (!ethereum) {
      return
    }

    try {
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' })
      if (accounts.length === 0) {
        return
      }
  
      this.setState({ account: accounts[0] })
    } catch (error) {
      console.log(error)
      return
    }


    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const ethBalance = await signer.getBalance();

    this.setState({ ethBalance })

    const token = getTokenContract();
    this.setState({ token })
    let tokenBalance = await token.balanceOf(this.state.account);
    this.setState({ tokenBalance: tokenBalance })

    const ethSwap = getEthSwapContract();
    this.setState({ ethSwap })

    this.setState({ loading: false })
  }

  async connectMetamask() {
    try {
      if (!ethereum) {
        window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
        return
      }

      const accounts = await ethereum.request({ method: 'eth_requestAccounts' })

      if (accounts.length === 0) {
        return
      }

      this.setState({ account: accounts[0] })

      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const ethBalance = await signer.getBalance();

      this.setState({ ethBalance })

      const token = getTokenContract();
      this.setState({ token })
      let tokenBalance = await token.balanceOf(this.state.account);
      this.setState({ tokenBalance: tokenBalance })

      const ethSwap = getEthSwapContract();
      this.setState({ ethSwap })

      this.setState({ loading: false })
    } catch (error) {
      console.log(error)
    }
  }

  async loadWeb3() {
    if (!window.ethereum) {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }

    if (window.ethereum) {
      const accounts = await ethereum.request({ method: 'eth_accounts' })
      ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) {
          this.setState({ account: accounts[0] })
        }
      })

      if (accounts.length > 0) {
        this.setState({ account: accounts[0] })
        return
      }
    }
  }

  buyTokens = async (etherAmount) => {
    try {
      if (this.state.account === undefined) {
        window.alert('Please connect to the Ethereum network with MetaMask.')
        return
      }
      this.setState({ loading: true })
      const tx = await this.state.ethSwap.buyTokens({ value: etherAmount, from: this.state.account })
      window.alert("Token purchase request sent. Please wait for the transaction to complete.")
    } catch (error) {
      console.log(error)
      window.alert("Something went wrong. Please try again later.")
    } finally {
      this.setState({ loading: false })
    }
  }

  sellTokens = async (tokenAmount) => {
    try {
      if (this.state.account === undefined) {
        window.alert('Please connect to the Ethereum network with MetaMask.')
        return
      }
      console.log(this.state.ethSwap)
      const approveTx = await this.state.token.approve(this.state.ethSwap.address, tokenAmount, { from: this.state.account });
      console.log(approveTx)
      const tx = await this.state.ethSwap.sellTokens(tokenAmount, { from: this.state.account, gasLimit: 3000000, gasPrice: 10000000000 });
      console.log(tx)
      window.alert("Token sell request sent. Please wait for the transaction to complete.")
    } catch (error) {
      console.log(error)
      window.alert("Something went wrong. Please try again later.")
    } finally {
      this.setState({ loading: false })
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      account: '',
      token: {},
      ethSwap: {},
      ethBalance: {
        _hex: '0x0',
      },
      tokenBalance: {
        _hex: '0x0',
      },
      loading: false,
    }
  }

  render() {
    let content
    if (this.state.loading) {
      content = <p id="loader" className="text-center">Loading...</p>
    }
    else {
      content = < Main
        ethBalance={this.state.ethBalance}
        tokenBalance={this.state.tokenBalance}
        buyTokens={this.buyTokens}
        sellTokens={this.sellTokens}
      />
    }

    return (
      <div>
        <Navbar account={this.state.account} connectMetamask={this.connectMetamask} />
        <div className="container-fluid" style={{
          marginTop: '80px',
        }}>
          <div className="row">
            <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '600px' }}>
              <div className="content mr-auto ml-auto">
                <a
                  href="#"

                  rel="noopener noreferrer"
                >
                </a>

                {content}

              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
