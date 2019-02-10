import React, { Component } from 'react';
import {Button, Card, Grid, Form, TextArea, Message, Loader, Feed} from 'semantic-ui-react';

import Layout from '../../components/Layout';
import Question from '../../ethereum/question';
import web3 from '../../ethereum/web3';
import factory from '../../ethereum/factory';
import {Link, Router} from '../../routes';


export default class QuestionShow extends Component {

    state = {
        answer: '',
        successMessage: '',
        loader: false
    };

    static async getInitialProps(props) {

        const question = Question(props.query.address);
        const summary = await question.methods.getQuestionDetails().call();
        const manager = await question.methods.manager().call();
        const questions = await factory.methods.getDeployedQuestions().call();
        const questionCount = await factory.methods.getForumCount().call();

        const forumDetails = await Promise.all(
            Array(parseInt(questionCount))
                .fill()
                .map((element, index) => {
                    return factory.methods.forum(index).call();
                })
        );

        console.log(summary);
        return {
            address: props.query.address,
            value: summary[0],
            title: summary[1],
            description: summary[2],
            manager:manager,
            questions,
            forumDetails

        };

    }

    renderListOfQuestions() {
        const items = this.props.forumDetails.map(item => {
            return {
                // header: item[1],
                content: (
                    <Link route={`/questions/${item[0]}`}>
                        {item[1]}
                    </Link>
                ),
                style: { overflowWrap: 'break-word' }
            }
        });

        return (
            <Feed events={items} />
        );


    };

    renderCards() {

        const {
            value,
            title,
            description,
            manager
        } = this.props;

        const items = [
            {
                header: manager,
                description: 'Address of Manager. The Manager created this question.',
                style: { overflowWrap: 'break-word' }
            },
            {
                header: value,
                description: 'Value (wei) want to spend on this question.',
                style: { overflowWrap: 'break-word' }
            },
            {
                header: title,
                description: 'Title',
                style: { overflowWrap: 'break-word' }
            },
            {
                header: description,
                description: 'Description',
                style: {overflowWrap: 'break-word'}
            }
        ];

        return <Card.Group items={items}/>
    }

    onSubmit = async (event) => {

        event.preventDefault();
        const question = Question(this.props.address);


        this.setState({loader: true, errorMessage: '' });
        try {
            const accounts = await web3.eth.getAccounts();
            await question.methods
                .postAnswer(this.state.answer)
                .send({
                    from: accounts[0]
                });

            this.setState({ successMessage: 'Successfully Posted!'});
            Router.pushRoute('/');
        }
        catch(error) {
            this.setState({ errorMessage: error.message });
        }
        this.setState({loader: false });

    };

    render() {

        return (

            <Layout>
                <h3>Question Detail</h3>
                <Loader active={this.state.loader} size='large'>
                    Wait while we fetch that transaction.
                </Loader>
                <Grid>
                    <Grid.Column width={9}>
                        <Link route={`/questions/${this.props.address}/answers`}>
                            <a>
                                <Button primary style={{ marginBottom: 10 }}> View Answers </Button>
                            </a>
                        </Link>
                        {this.renderCards()}
                        <Form
                            onSubmit={this.onSubmit}
                            error={!!this.state.errorMessage}
                            style={{ marginTop: 10 }}
                        >
                            <Form.Field>
                                <TextArea
                                    placeholder='Reply'
                                    value={this.state.answer}
                                    onChange={ event =>
                                        this.setState({ answer: event.target.value })
                                    }
                                    style={{ minHeight: 200 }}
                                />
                            </Form.Field>

                            <Message
                                error
                                header='Oops!'
                                content={this.state.successMessage ? this.state.errorMessage : this.state.successMessage }
                            />
                            <Button style={{ marginBottom: '10px'}} primary>Post Your Answer</Button>

                        </Form>
                    </Grid.Column>
                    <Grid.Column width={2}></Grid.Column>
                    <Grid.Column width={4} textAlign="justified" streched="true">
                        {this.renderListOfQuestions()}
                    </Grid.Column>
                </Grid>
            </Layout>

        );
    }
}