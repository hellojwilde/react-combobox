var AutocompleteInput = require('../AutocompleteInput');
var React = require('react/addons');

var {TestUtils} = React.addons;
var {Simulate} = React.addons.TestUtils;

var expect = require('expect');
var emptyFunction = require('../helpers/emptyFunction');

const KEY_RETURN = 13;
const KEY_TAB = 9;
const KEY_BACKSPACE = 8;

var AutocompleteInputTestWrapper = React.createClass({

  getDefaultProps: function() {
    return {
      initialValue: '',
      onChange: emptyFunction,
      onComplete: emptyFunction
    };
  },

  getInitialState: function() {
    return {
      value: this.props.initialValue 
    };
  },

  handleChange: function(event) {
    this.setState({value: event.target.value});
    this.props.onChange(event);
  },

  handleComplete: function(value) {
    this.setState({value});
    this.props.onComplete(value);
  },

  render: function() {
    var {onChange, onComplete, ...otherProps} = this.props;

    return (
      <AutocompleteInput
        {...otherProps}
        value={this.state.value}
        onChange={this.handleChange}
        onComplete={this.handleComplete}
      />
    );
  }

});

describe('AutocompleteInput', function() {

  it('shows some text, and supports typing', function() {
    var wrapper = TestUtils.renderIntoDocument(
      <AutocompleteInputTestWrapper initialValue="hello"/>
    );

    // Ensure that the text that we provided actually shows up in the input
    var input = TestUtils.findRenderedDOMComponentWithTag(wrapper, 'input');
    expect(input.getDOMNode().value).toBe('hello');

    // Ensure that changes that we supply actually show up in the input
    Simulate.change(input, {target: {value: 'hello!'}});
    Simulate.keyDown(input, {key: '!'});
    Simulate.keyUp(input, {key: '!'});
    
    expect(input.getDOMNode().value).toBe('hello!');
  });

  it('shows, selects, and enables completion of typeahead text', function() {
    var wrapper = TestUtils.renderIntoDocument(
      <AutocompleteInputTestWrapper completionValue="California"/>
    );

    // Ensure that there's no typehead
    var input = TestUtils.findRenderedDOMComponentWithTag(wrapper, 'input');
    expect(input.getDOMNode().value).toBe('');

    // Ensure that the typeahead shows up case-insensitively and is selected
    Simulate.change(input, {target: {value: 'c'}});
    Simulate.keyDown(input, {key: 'c'});
    Simulate.keyUp(input, {key: 'c'});
    
    expect(input.getDOMNode().value).toBe('california');
    expect(input.getDOMNode().selectionStart).toBe(1);
    expect(input.getDOMNode().selectionEnd).toBe(10);

    // Ensure that we can tab complete the value
    Simulate.keyDown(input, {keyCode: KEY_TAB});

    expect(input.getDOMNode().value).toBe('California');
    expect(input.getDOMNode().selectionStart).toBe(10);
    expect(input.getDOMNode().selectionEnd).toBe(10);
  });

  it('omits the typehead if the completion text does not match', function() {
    var wrapper = TestUtils.renderIntoDocument(
      <AutocompleteInputTestWrapper 
        completionValue="California"
        initialValue="h"
      />
    );

    // Ensure that there's no typehead
    var input = TestUtils.findRenderedDOMComponentWithTag(wrapper, 'input');
    expect(input.getDOMNode().value).toBe('h');

    // Ensure that there's still no typeahead
    Simulate.change(input, {target: {value: 'hi'}});
    Simulate.keyDown(input, {key: 'i'});
    Simulate.keyUp(input, {key: 'i'});

    expect(input.getDOMNode().value).toBe('hi');
    expect(input.getDOMNode().selectionStart).toBe(2);
    expect(input.getDOMNode().selectionEnd).toBe(2);
  });

});