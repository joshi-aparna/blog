import React,{useState,useEffect} from 'react';
import '../../styles/main.scss'

class MemoryCard extends React.Component {
    constructor(props) {
      super(props);
      this.state = {index : 0};
      let data = this.props.content.content && JSON.parse(this.props.content.content)
      this.cardTitles = data.sort(() => Math.random() - 0.5) 
      // This binding is necessary to make `this` work in the callback
      this.handleClick = this.handleClick.bind(this);
    }
  
    handleClick() {
      this.setState(prevState => ({
        index : (prevState.index + 1 >= this.cardTitles.length ) ? 0 : prevState.index + 1 
      }));
    }
  
    render() {
      return (
        <div className="wrapper">
            <div className="card" id="memorycard"  onClick={this.handleClick}>
            <span className="card-content"> {this.cardTitles[this.state.index]}</span>
            </div>
        </div>
      );
    }
  }
export default MemoryCard