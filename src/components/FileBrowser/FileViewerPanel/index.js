import React from 'react';
import $ from 'jquery';
import * as THREE from "three";
//import * as threeStlLoader from 'three-stl-loader';
var STLLoader = require('three-stl-loader')(THREE);
import TrackballControls from 'three-trackballcontrols';
import { updateModelAction } from '../../../actions';

export default React.createClass({
    
    propTypes: {
        url: React.PropTypes.string,
    },

    getInitialState: function() {
    	return {
    		modelName: this.props.modelStore.getState(),
    	}
    },

    fetchModelInfo: function() {
        $.ajax({
        	url: this.props.url,
        	dataType: 'json',
        	cache: 'false',
        	success: function(data) {
                this.props.modelStore.dispatch(updateModelAction(data[data.length-1].name));
        	    console.log("read exec");
        	}.bind(this)
        });
    },

    threeSTLModel: function() {
    	let camera, controls, scene, renderer, container;
        let modelname = this.state.modelName;

        let camera2, scene2, renderer2, container2;

        init();
		animate();

		function init() {
			// scene
			scene = new THREE.Scene();

			// renderer
			renderer = new THREE.WebGLRenderer();
            renderer.setClearColor( 0XEEEEEE );
			renderer.setPixelRatio( window.devicePixelRatio );
            let canvasSize = {
                             width: $("#model-viewer").width(),
                             //height: $("#model-viewer").height(),
                         };
			//renderer.setSize( 600, 600 );
            renderer.setSize( canvasSize.width*0.95, canvasSize.width*0.95 );

			container = document.getElementById("model-viewer");
            container.removeChild(container.lastChild);
            container.appendChild(renderer.domElement);
            
            // camera
            camera = new THREE.PerspectiveCamera( 90, 1, 0.1, 5000 );
			
            // controls
            controls = new TrackballControls( camera, renderer.domElement );
            controls.rotateSpeed = 1.0;
            controls.zoomSpeed = 1.2;
            controls.panSpeed = 0.8;
            controls.noZoom = false;
            controls.noPan = false;
            controls.staticMoving = true;
            controls.dynamicDampingFactor = 0.3;
            
            // model
            let loader = new STLLoader();

            loader.load('/models' + modelname, function (geometry) {
                let material = new THREE.MeshNormalMaterial();
                let mesh = new THREE.Mesh(geometry, material);

                let center = THREE.GeometryUtils.center(geometry);
			    let boundbox=geometry.boundingBox;
			    let vector3 = boundbox.size(null);
			    let scale = vector3.length();
			    camera.position.set(scale, scale, scale);
			    camera.lookAt(scene.position);
			    scene.add(camera);

			    mesh.position.set(0,0,0);
                scene.add(mesh);
            });

            // light
            let light = new THREE.DirectionalLight( 0xffffff, 0.5 );
			light.position.set( 1, 1, 1 );
			scene.add( light );
			light = new THREE.DirectionalLight( 0xffffff, 0.5 );
			light.position.set( -1, -1, -1 );
			scene.add( light );
			//light = new THREE.AmbientLight( 0x222222 );
			//scene.add( light );

            // scene2
            scene2 = new THREE.Scene();
            // renderer2
            renderer2 = new THREE.WebGLRenderer();
            renderer2.setClearColor( 0XEEEEEE );
            renderer2.setSize( canvasSize.width*0.1, canvasSize.width*0.1 );
            container2 = document.getElementById('coordinate');
            container2.removeChild(container2.lastChild);
            container2.appendChild( renderer2.domElement );
            // camera2
            camera2 = new THREE.PerspectiveCamera( 50, 1, 1, 1000 );
            camera2.up = camera.up;
            // axe2
            let axes2 = new THREE.AxisHelper( 200 );
            scene2.add( axes2 );
		}

		function animate() {
			requestAnimationFrame( animate );
			controls.update();
            camera2.position.copy( camera.position );
            camera2.position.sub( controls.target ); // added by @libe
            camera2.position.setLength( 300 );
            camera2.lookAt( scene2.position );
			render();
		}

		function render() {
			renderer.render( scene, camera );
            renderer2.render( scene2, camera2 );
		}
    },

	componentDidMount: function() {
	    let listenUpdateModel = this.props.modelStore.subscribe(this.updateModel);	
   
        //var socket = io.connect('http://localhost:8000');
        //var socket = io();
		this.props.socket.emit('feedback', 'ModelViewer componentDidMount connected');
		this.props.socket.emit('loadModel');

        this.props.socket.on('showModel', function() {
        	this.props.socket.emit('feedback', 'showModel msg recived');
            return this.fetchModelInfo();
        }.bind(this));

		this.props.socket.on('sendModel', function(model) {
            this.props.modelStore.dispatch(updateModelAction(model));
            this.props.socket.emit('feedback', 'Recive sendModel' + model);
            //return this.updateModel(model);
		}.bind(this));
    },

    updateModel: function() {
        this.setState({
        	modelName: this.props.modelStore.getState(),
        });
    },

    componentDidUpdate: function() {
        this.threeSTLModel();
    },

    render: function() {
    	return (
            <div className="panel panel-default FileViewerPanel" id="model-vieweport">
                <div className="panel-heading">Model Viewport</div>
                <div className="panel-body model-viewer" id="model-viewer">
                    <div className="coordinate" id="coordinate">
                        <div></div>
                    </div>
                    <div></div>
                </div>
            </div>
    	);
    }
});
