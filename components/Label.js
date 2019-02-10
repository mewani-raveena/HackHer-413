import React, {Component} from "react";
import {Label} from 'semantic-ui-react';

export default class LabelContent extends Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <div>
                <Label content= {this.props.content} />
                <div>VoteCount = {this.props.item[2]}</div>
            </div>
        );
    }

};