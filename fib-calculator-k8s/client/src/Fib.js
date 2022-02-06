import React, { Component } from "react";
import axios from "axios";

class Fib extends Component {
    state = {
        seenIndexes: [],
        values: {},
        index: "",
    };

    componentDidMount() {
        this.fetchValues();
        this.fetchIndexes();
    }

    async fetchValues() {
        const values = await axios.get("/api/values/current");
        if (values && typeof values.data !== "string") {
            this.setState({ values: values.data });
        }
    }

    async fetchIndexes() {
        const seenIndexes = await axios.get("/api/values/all");
        if (
            seenIndexes &&
            typeof seenIndexes.data !== "string" &&
            seenIndexes.data.map
        ) {
            this.setState({
                seenIndexes: seenIndexes.data,
            });
        }
    }

    handleSubmit = async (event) => {
        event.preventDefault();
        await axios
            .post("/api/values", {
                index: this.state.index,
            })
            .finally(() => {
                window.location.reload();
            });
        this.setState({ index: "" });
    };

    renderSeenIndexes() {
        return this.state.seenIndexes.map((number) => number.join(", "));
    }

    renderValues() {
        const entries = [];
        if (this.state.values) {
            for (let key in this.state.values) {
                entries.push(
                    <div key={key}>
                        For index {key} I calculated {this.state.values[key]}
                    </div>
                );
            }
        }
        return entries;
    }

    render() {
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <label>Enter your index:</label>
                    &nbsp;
                    <input
                        value={this.state.index}
                        onChange={(event) =>
                            this.setState({ index: event.target.value })
                        }
                    />
                    &nbsp;
                    <button>Submit</button>
                </form>

                <h3>Indexes I have seen:</h3>
                {this.renderSeenIndexes()}

                <h3>Calculated Values:</h3>
                {this.renderValues()}
            </div>
        );
    }
}

export default Fib;
