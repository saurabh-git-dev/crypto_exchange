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
    const accounts = await ethereum.request({ method: 'eth_accounts' })
    this.setState({ account: accounts[0] })

    const provider = new ethers.providers.Web3Provider(window.ethereum);
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

  async loadWeb3() {
    if (!window.ethereum) {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  buyTokens = async (etherAmount) => {
    try {
      this.setState({ loading: true })
      const tx = await this.state.ethSwap.buyTokens({ value: etherAmount, from: this.state.account })
    } catch (error) {
      console.log(error)
    } finally {
      this.setState({ loading: false })
    }
  }

  sellTokens = async (tokenAmount) => {
    try {
      console.log(this.state.ethSwap)
      const approveTx = await this.state.token.approve(this.state.ethSwap.address, tokenAmount, { from: this.state.account });
      console.log(approveTx)
      const tx = await this.state.ethSwap.sellTokens(tokenAmount, { from: this.state.account, gasLimit: 3000000, gasPrice: 10000000000 });
      console.log(tx)
      // this.state.token.approve(this.state.ethSwap._address, tokenAmount).send({ from: this.state.account }).on('transactionHash', (hash) => {
      //   this.state.ethSwap.sellTokens(tokenAmount).send({ from: this.state.account }).on('transactionHash', (hash) => {
      //     this.setState({ loading: false })
      //   })
      // })
    } catch (error) {
      console.log(error)
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
        <Navbar account={this.state.account} />
        <div className="container-fluid mt-5">
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
