import React , { Component } from 'react';
import { Accordion, Loader, Button } from 'semantic-ui-react';

import Layout from '../../../components/Layout';
import Question from '../../../ethereum/question';
import { Link, Router } from '../../../routes';
import Content from '../../../components/AccordianContent';
import LabelContent from '../../../components/Label';


export default class ShowAnswers extends Component {

    state = {
        activeIndex: [this.props.answerCount.length],
        loader: false
    };

    static async getInitialProps(props) {

        const { address } = props.query;

        const question = Question(address);
        const answerCount = await question.methods.getAnswerCount().call();

        try {

            const answers = await Promise.all(
                Array(parseInt(answerCount))
                    .fill()
                    .map((element, index) => {
                        return question.methods.answers(index).call()
                    })
            );

            return { answerCount, answers, question };

        }
        catch (error) {
            console.log(error);
        }

    }

    closeAll = () => {
        this.setState({ activeIndex: [] });
    };

    handleTitleClick = (e, itemProps) => {
        const { index } = itemProps;
        const { activeIndex } = this.state;
        let newState;

        if (activeIndex.indexOf(index) > -1) {
            newState = activeIndex.filter((i) => i !== index);
        } else {
            newState = [...activeIndex, index]
        }

        this.setState({ activeIndex: newState });
    };

    render() {

        let panels = this.props.answers.map((item, index) => {
            return({
                title: {
                    content: <LabelContent content={item[0]} item={item}/>,
                    key: `title-${index[0]}`
                },
                content: {
                    content: <Content in={index} item={item} questionInstance={this.props.question}/>,
                    className: "des-ml-1",
                    key: `content-${index[0]}`,
                }
            });
        });

        const { activeIndex } = this.state;

        return (
            <Layout>
                <h3>Answers</h3>
                <Loader active={this.state.loader} size='large'>
                    Wait while we fetch that transaction.
                </Loader>
                <Accordion
                    activeIndex={activeIndex}
                    panels={panels}
                    exclusive={false}
                    onTitleClick={this.handleTitleClick}
                />
            </Layout>

        );
    }
}