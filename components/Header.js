import React from 'react';
import { Menu, Button } from 'semantic-ui-react';
import '../static/css/_main.scss';

import { Link } from '../routes';

export default () => {

        return(
            <Menu size="large" className="main-menu">
                <Menu.Item link={true}>
                    <Link route='/' >
                    <Menu.Header as='h2' content="Blackboard"/>
                    </Link>
                </Menu.Item>
                <Menu.Item>
                    <Menu.Header as='h1' content="Public Portal - Q & A Forum"/>
                </Menu.Item>
            </Menu>
        );
};
