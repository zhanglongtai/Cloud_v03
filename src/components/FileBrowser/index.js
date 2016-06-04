import React           from 'react';
import io              from 'socket.io-client';
import FileUploadPanel from './FileUploadPanel';
import FileTreePanel   from './FileTreePanel';
import FileMenuPanel   from './FileMenuPanel';
import FileViewerPanel from './FileViewerPanel';
import { updateModelStore as modelStore } from '../../stores';
import { updateDirStore as dirStore } from '../../stores';
import { updateDirDataStore as dirDataStore } from '../../stores';

export default React.createClass({
    getDefaultProps: function(){
        return {
            socket: io.connect('http://localhost:8000'),
        };
    },

	render() {
		return (
            <div className="FileBrowser row">
                <div className="col-md-3">
                    <FileUploadPanel socket={this.props.socket} dirStore={dirStore} modelStore={modelStore}/>
                    <FileTreePanel socket={this.props.socket} dirStore={dirStore} dirDataStore={dirDataStore}/>
                </div>
                <div className="col-md-3">
                    <FileMenuPanel />
                </div>
                <div className="col-md-6">
                    <FileViewerPanel url="/api/model" socket={this.props.socket} modelStore={modelStore} />
                </div>
            </div>
		)
	}
});
