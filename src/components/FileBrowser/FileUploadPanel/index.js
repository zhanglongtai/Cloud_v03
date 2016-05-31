import React from 'react';
import $ from 'jquery';
import { updateModelAction } from '../../../actions';

export default React.createClass({

    changeName() {
        document.getElementById('#filename').value = document.getElementById('#modelfile').value;
    },

    ajaxUpload() {
        let formData = new FormData($("#upload-form")[0]);
        $.ajax({
            url: '/MeshGen/api/upload',
            type: 'POST',
            data: formData,
            dataType: 'json',
            async: false,
            cache: false,
            contentType: false,
            processData: false,
            success: function(data) {
                let newModel = data.model;
                this.props.modelStore.dispatch(updateModelAction(newModel));
                this.props.socket.emit('getDir');
            }.bind(this)
        });
    },

    clickSubmit() {
        this.ajaxUpload();
    },

    render: function() {
        return (
            <div className="panel panel-default upload-file" id="upload-file">
                <div className="panel-heading">Upload Files</div>
                <div className="panel-body">
                    <form id="upload-form" name="upload-form" encType="multipart/form-data">
                        <div className="form-group input-file-name">
                            <label for="filename">Specify File Name</label>
                            <input type="text" name="filename" id="filename" className="form-control" placeholder="Model Name"/>
                        </div>
                        <div className="form-group">
                            <label for="modelfile">Upload file</label>
                            <input type="file" name="modelfile" id="modelfile" onChange={this.changeName} />
                        </div>
                        <button type="submit" className="btn btn-default" onClick={this.clickSubmit}>Submit</button>
                    </form>
                </div>
            </div>
        );
    }
});
