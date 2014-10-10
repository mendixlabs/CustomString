CustomString
=====================
This widget adds a string to your page, taking a microflow as datasource.

## Contributing
For more information on contributing to this repository visit [Contributing to a GitHub repository] (https://world.mendix.com/display/howto50/Contributing+to+a+GitHub+repository)

## Typical usage scenario
Display a string, composed on the fly by a microflow, in a dataview. Use this widget instead of creating an attribute solely for display purposes. Now an additional attribute to store the string has become superfluous!

## Installation

Import the widget to your project and add the Format String to a dataview on a page. Configure the properties to determine how the widget will behave in your application.

## Properties

* *Render as HTML* - Determines if HTML elements in the generated string are escaped. 
* *Source microflow* - A microflow generating the string to display. 