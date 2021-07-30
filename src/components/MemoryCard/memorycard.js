import React,{useState,useEffect} from 'react';
import '../../styles/main.scss'

class MemoryCard extends React.Component {
    constructor(props) {
      super(props);
      console.log(this.props.content)
      this.state = {isToggleOn: true, index : 0};
      this.data = this.props.content.content && JSON.parse(this.props.content.content)
      let contentKeys = Object.keys(this.data)
      this.cardTitles = contentKeys.sort(() => Math.random() - 0.5) 
      // This binding is necessary to make `this` work in the callback
      this.handleClick = this.handleClick.bind(this);
    }
  
    handleClick() {
      this.setState(prevState => ({
        index : !prevState.isToggleOn ? (prevState.index + 1 >= this.cardTitles.length ) ? 0 : prevState.index + 1  : prevState.index,
        isToggleOn: !prevState.isToggleOn
      }));
    }
  
    render() {
      return (
        <div className="wrapper">
            <h3>{this.cardTitles[this.state.index]}</h3>
            <div className="card" id="memorycard"  onClick={this.handleClick}>
            {this.state.isToggleOn ? '' : this.data[this.cardTitles[this.state.index]]}
            </div>
        </div>
      );
    }
  }
export default MemoryCard