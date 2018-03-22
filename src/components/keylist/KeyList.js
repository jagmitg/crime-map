import React, { Component } from 'react';

import './KeyList.css';

/**
 * This component renders a list of categories
 */
class KeyList extends Component {

    constructor(prop) {

        super(prop);
        this.state = {
            categories: []
        };

    }

    render() {

        let cats = [];

        Object.keys(this.state.categories).forEach(category => {

            cats.push(
                <tr key={category}>
                    <td>{this.state.categories[category]}</td>
                    <td>{category}</td>
                </tr>
            );

        })

        return (
            <table className="KeyList" cellSpacing="8">
                <tbody>
                    {cats}
                </tbody>
            </table>
        );

    }

}

export default KeyList;