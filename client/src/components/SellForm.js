import React, { Component } from 'react'
import tokenLogo from '../token-logo.png'
import ethLogo from '../eth-logo.png'
import { ethers } from 'ethers'

class SellForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      output: 0,
    }
  }
  
  render() {
    // console.log(this.state.account)
    return (
      <form className="mb-3" onSubmit={(event) => {
              event.preventDefault()
              let etherAmount
              etherAmount = this.input.value.toString()
              etherAmount = ethers.utils.parseEther(etherAmount)
              this.props.sellTokens(etherAmount)              
          }}>
           <div>
             <label className="float-left"><b>Input</b></label>
             <span className="float-right text-muted">
               Balance: {this.props.tokenBalance ? parseInt(this.props.tokenBalance._hex) / (10 ** 18) : 0}
             </span>
           </div>
           <div className="input-group mb-4">
             <input
                type="text"
                onChange={(event) => {                  
                  const tokenAmount = this.input.value.toString()
                  this.setState({
                    output: tokenAmount / 100
                  })
                  
                }}
                ref={(input) => {this.input = input }}
                className="form-control form-control-lg"
                placeholder="0"
                required />
             <div className="input-group-append">
               <div className="input-group-text">
                 <img src={tokenLogo} height='32' alt=''/>
                 &nbsp;DelCoin
                 
               </div>
             </div>
           </div>
           <div>
             <label className="float-left"><b>Output</b></label>
             <span className="float-right text-muted">
               Balance: {this.props.ethBalance ? parseInt(this.props.ethBalance._hex) / (10 ** 18) : 0}
             </span>
           </div>
           <div className="input-group nb-2">
             <input
               type="text"
               className="form-control form-control-lg"
               placeholder="0"
               value={this.state.output}
               disabled
             />
             <div className ="input-group-append">
               <div className="input-group-text">
                 <img src={ethLogo} height='32' alt=""/>
                 &nbsp;&nbsp;&nbsp; ETH
               </div>
             </div>
           </div>
           <div className="nb-5">
             <span className="float-left text-muted">Exchange Rate</span>
             <span className="float-right text-muted">100 DelCoin = 1 ETH</span>
           </div>
           <button type="submit" className="btn btn-primary btn-block btn-lg">SWAP!</button>
          </form>
    );
  }
}
export default SellForm;

