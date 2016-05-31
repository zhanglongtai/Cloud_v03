import React from 'react';
//import $ from 'jquery';
//var $ = require('jquery');
//var tv = require('bootstrap-treeview')($);
var TreeView = require('./react-bootstrap-treeview');
//import TreeView from 'treeview-react-bootstrap';
import { updateDirDataAction } from '../../../actions';

export default React.createClass({
	propTypes: {
        modelName: React.PropTypes.string,
        dirDataStore: React.PropTypes.func.isRequired,
    },

    getInitialState: function() {
        
        return {
            dir: this.props.dirStore.getState(),
            dirData: this.props.dirDataStore.getState(),
        };
    },
    
    componentDidMount() {
        let listenDirData = this.props.dirDataStore.subscribe(this.updateDirData);
        this.props.socket.emit('feedback', 'FileTree connected.');
        this.props.socket.emit('getDirData');
        this.props.socket.on('sendDirData', (dirData) => {
            this.props.dirDataStore.dispatch(updateDirDataAction(dirData));
        });
    },

    updateDirData: function() {
        this.setState({dirData: this.props.dirDataStore.getState()})
    },

    render: function() {
        return (
            <div className="panel panel-default model-tree">
                <div className="panel-heading">Models Lists</div>
                <div className="list-group" ref="folder" id="folder">
                    <TreeView data={this.state.dirData} />
                </div>
            </div>
        );
    }
});
