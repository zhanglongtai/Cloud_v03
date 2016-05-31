function updateModelReducer(state='', action) {
	switch(action.type) {
		case 'updateModel':
		    return action.modelName;
		default:
		    return state;
	};
};

function updateDirReducer(state=[], action) {
	switch(action.type) {
		case 'updateDir':
		    return action.dirContent;
		default:
		    return state;
	};
};

function updateDirDataReducer(state=[], action) {
    switch(action.type) {
		case 'updateDirData':
		    return action.dirData;
		default:
		    return state;
	};
};

export {
	updateModelReducer,
	updateDirReducer,
	updateDirDataReducer,
};
