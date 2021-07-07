import React, { Component } from 'react';
import './Section.css';
import chevronImg from './chevron.svg';


function Chevron (props) {
  var viewBox = `0 0 ${props.width ? props.width : 24} ${props.height ? props.height : 24}`;
  return <svg xmlns="http://www.w3.org/2000/svg" width={props.width ? props.width : 24} height={props.height ? props.height : 24} viewBox={viewBox} fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-chevron-down"><polyline points="6 9 12 15 18 9"></polyline></svg>
}

class Section extends Component {

  constructor(props) {
    super(props);

    this.state = {
      open: true
    };
  }

  render() {
    var className = this.state.open ? 'section open' : 'section';
    var collapsible = typeof this.props.collapsible === 'undefined' ||  this.props.collapsible ? true : false;

    return (
      <div className={className}>
        <a href="#" className="section-header" onClick={(ev) => {
          ev.preventDefault();

          if(collapsible) {
            this.setState({
              open: !this.state.open
            })
          }

        }}>
          <h3 className=""> {this.props.title} </h3>
          {collapsible && <span href="#" className="section-toggle-icon"> <img src={chevronImg} className="chevron-icon"/> </span>}
        </a>
        <div className="section-content">
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default Section;