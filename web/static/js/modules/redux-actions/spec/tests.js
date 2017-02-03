import test from 'ava';
import ReduxActions from '../index';
import sinon from 'sinon';

test('#types should generate action types', t => {
	var types = ReduxActions.types([
		'MY_TYPE',
		'MY_OTHER_TYPE'
		]);

	t.is('MY_TYPE', types.MY_TYPE);
	t.is('MY_OTHER_TYPE', types.MY_OTHER_TYPE);
});

test('#types should generate simple actions', t => {
	var types = ReduxActions.types([
		'MY_TYPE',
		'MY_OTHER_TYPE'
		]);

	var actions = ReduxActions.generate({
		doSomething: [types.MY_TYPE, 'arg1', 'arg2']
	});

	var dispatchable = actions.doSomething(1, 'foobar');
	t.is('MY_TYPE', dispatchable.type);
	t.is(1, dispatchable.arg1);
	t.is('foobar', dispatchable.arg2);
});

test('#generate should support thunkable actions', async t => {
	var types = ReduxActions.types([
		'MY_TYPE',
		'MY_OTHER_TYPE'
		]);

	var actions = ReduxActions.generate({
		doSomething: function(arg1, arg2) {
			return dispatch => {
				dispatch({type: types.MY_TYPE, arg1, arg2});
				dispatch({type: types.MY_OTHER_TYPE, arg1, arg2});
			}
		}
	});

	var dispatchable = actions.doSomething(1, 'foobar');
	t.is('function', typeof dispatchable);

	dispatchable((obj) => {
		t.is(true, obj.type == 'MY_TYPE' || obj.type == 'MY_OTHER_TYPE');
		t.is(1, obj.arg1);
		t.is('foobar', obj.arg2);
	});
});


test('#generate should throw error if actionType is missing', t => {
	t.throws(() => ReduxActions.generate({
		doSomething: []
	}));
});
