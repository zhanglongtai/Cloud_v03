import React from 'react';
import { Link, IndexLink } from 'react-router';

export default React.createClass({
	render() {
		return (
            <div className="App container-fluid">
                <div className="row">
                    <div className="Brand col-md-2">CAE-Cloud</div>
                    <ul className="nav nav-tabs">
                        <li role="presentation"><IndexLink to="/" activeClassName="active" onlyActiveOnIndex={true}>File Browser</IndexLink></li>
                        <li role="presentation"><Link to="/mesh-generator" activeClassName="active">Mesh Generator</Link></li>
                        <li role="presentation"><Link to="/simulation" activeClassName="active">Simulation</Link></li>
                        <li role="presentation"><Link to="/post-processor" activeClassName="active">Post Processor</Link></li>
                    </ul>
                </div>
                {this.props.children}
            </div>
		)
	}
});
