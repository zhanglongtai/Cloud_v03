import React                                         from 'react';
import ReactDOM                                      from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import App                                           from './components/App';
import FileBrowser                                   from './components/FileBrowser';
import MeshGenerator                                 from './components/MeshGenerator';
import Simulation                                    from './components/Simulation';
import PostProcessor                                 from './components/PostProcessor';

ReactDOM.render((
	<Router history={browserHistory}>
        <Route path='/' component={App}>
	        <IndexRoute component={FileBrowser} />
	        <Route path='/mesh-generator' component={MeshGenerator} />
	        <Route path='/simulation' component={Simulation} />
	        <Route path='/post-processor' component={PostProcessor} />
        </Route>
    </Router>),
    document.getElementById('content')
);
