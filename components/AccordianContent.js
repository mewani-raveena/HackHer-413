import React, {Component, Fragment} from "react";
import {Button, Loader} from 'semantic-ui-react';
import web3 from '../ethereum/web3';
import {Router} from "../routes";

export default class Content extends Component{
    constructor(props){
        super(props);
        this.addVote = this.addVote.bind(this);
        this.state={
            QuestionValue: 0,
            loader: false
        }

    }

    componentDidMount() {
        this.getQuestionDetails().then((res, err) => {
            if (err) {
                console.log(err);
            }
        });
    }

    getQuestionDetails = async() =>{

        try {

            const summary = await this.props.questionInstance.methods.getQuestionDetails().call();
            const value = summary[0];
            this.setState({
                QuestionValue: value
            });

        }
        catch(error) {
            console.log(error);
        }

    };

    addVote = async () =>{

        this.setState({ loader: true });
        try {
            const accounts = await web3.eth.getAccounts();
            await this.props.questionInstance.methods.vote(this.props.in).send({
                from: accounts[0]
            });
        }
        catch (error) {
            console.log(error);
        }
        this.setState({ loader: false });
    };

    finalizeAnswer = async () =>{

        this.setState({ loader: true });
        try{
            const accounts = await web3.eth.getAccounts();
            await this.props.questionInstance.methods.finalizeAnswer(this.props.in).send({
                from: accounts[0],
                value: this.state.QuestionValue + 100000
            });
        }
        catch (error) {
            console.log(error);
        }
        this.setState({loader: false });
    };

    render(){

        return(
            <div>
                <Loader active={this.state.loader} size='large'>
                    Wait while we fetch that transaction.
                </Loader>
                <Fragment>{this.props.item[1]}</Fragment>
                <Button.Group floated='right'>
                    <Button onClick={this.addVote} positive>Vote</Button>
                    <Button.Or />
                    <Button onClick={this.finalizeAnswer} color='orange'>Finalize</Button>
                </Button.Group>
            </div>
        );
    }

};