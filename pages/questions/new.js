import React, { Component } from 'react';
import { Button, Form, Input, Message, TextArea, Loader, Grid, Feed } from 'semantic-ui-react';

import Layout from '../../components/Layout';
import factory from '../../ethereum/factory';
import web3 from '../../ethereum/web3';
import { Router } from '../../routes';
import {Link} from "../../routes";

export default class QuestionNew extends Component {

    state = {
        value: '',
        title: '',
        description: '',
        complete: false,
        errorMessage: '',
        loader: false,

    };

    static async getInitialProps() {

        const questions = await factory.methods.getDeployedQuestions().call();
        const questionCount = await factory.methods.getForumCount().call();

        const forumDetails = await Promise.all(
            Array(parseInt(questionCount))
                .fill()
                .map((element, index) => {
                    return factory.methods.forum(index).call();
                })
        );

        return { questions, forumDetails };
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

    onSubmit = async (event) => {
        event.preventDefault();

        this.setState({ loader: true, errorMessage: '' });
        try {
            const accounts = await web3.eth.getAccounts();
            console.log(accounts[0]);
            await factory.methods
                .createQuestion(this.state.value, this.state.title, this.state.description, this.state.complete)
                .send({
                    from: accounts[0]
                });

            Router.pushRoute('/');
        }
        catch(error) {
            this.setState({ errorMessage: error.message });
        }
        this.setState({ loader: false });

    };


    render() {
        return (
            <Layout>
                <h3>Ask a Question!</h3>
                <Grid>
                    <Grid.Row columns={3}>
                        <Grid.Column width={9}>
                            <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
                                <Form.Field>
                                    <label>Value to spend on the question</label>
                                    <Input
                                        label='wei'
                                        labelPosition='right'
                                        value={this.state.value}
                                        onChange={ event =>
                                            this.setState({ value: event.target.value })
                                        }
                                    />
                                    <label>Title</label>
                                    <Input
                                        label='title'
                                        labelPosition='right'
                                        value={this.state.title}
                                        onChange={ event =>
                                            this.setState({ title: event.target.value })
                                        }
                                    />
                                    <label>Description</label>
                                    <TextArea
                                        placeholder='Question Description'
                                        label='title'
                                        labelposition='right'
                                        value={this.state.description}
                                        onChange={ event =>
                                            this.setState({ description: event.target.value })
                                        }
                                        style={{ minHeight: 200 }}
                                    />
                                </Form.Field>

                                <Message
                                    error
                                    header='Oops!'
                                    content={this.state.errorMessage}
                                />

                                <Button primary>Ask!</Button>

                                <Loader active={this.state.loader} size='large'>
                                    Wait while we fetch that transaction.
                                </Loader>
                            </Form>
                        </Grid.Column>
                        <Grid.Column width={2}></Grid.Column>
                        <Grid.Column width={4} textAlign="justified" streched="true">
                            {this.renderListOfQuestions()}
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Layout>
        );
    }
}