import React, { Component } from "react";
import "./KeyList.css";

// Define the shape of your state
interface KeyListState {
    categories: Record<string, string>; // Assuming categories is a Record of string keys to string values
}

/**
 * This component renders a list of categories
 */
class KeyList extends Component<{}, KeyListState> {
    // No props are defined for this component

    constructor(props: {}) {
        // Even if no props, define the type
        super(props);
        this.state = {
            categories: {}
        };
    }

    render() {
        const cats = Object.keys(this.state.categories).map((category) => (
            <tr key={category}>
                <td>{this.state.categories[category]}</td>
                <td>{category}</td>
            </tr>
        ));

        return (
            <table className="KeyList" cellSpacing="8">
                <tbody>{cats}</tbody>
            </table>
        );
    }
}

export default KeyList;
