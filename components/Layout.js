import React from 'react';
import Head from 'next/head';
import { Container } from 'semantic-ui-react';

import Header from './Header';
import Footer from './Footer';

export default (props) => {

    return (
        <Container fluid>
            <Head>
                <link
                    rel="stylesheet"
                    href="//cdn.jsdelivr.net/npm/semantic-ui@2.4.1/dist/semantic.min.css"
                />
            </Head>
            <Header/>
            {props.children}
            <Footer/>
        </Container>
    );
}