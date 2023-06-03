# sqeletor-vscode README

An opinionated SQL template

## Features

SQeLetor procedure

![SQeLetor procedure](images/procedure_example.gif)

SQeLetor script

![SQeLetor script](images/script_example.gif)

SQeLetor snippets

![SQeLetor snippets](images/snippets.gif)

SQeLetor user-defined snippets

![SQeLetor user-defined snippets](images/user_defined_snippets.gif)

## Installation

Download from VSIX from [Releases](https://github.com/groovyghoul/sqeletor.vscode/releases).

Install in VS Code via the Extensions manager using "Install from VSIX...". 

## Setup/Configuration

To configure where user-defined snippets are stored

![settings](images/settings.png)

## Development

### Download source code

`git clone https://github.com/groovyghoul/sqeletor.vscode.git`

### To compile

`npm run compile`

## Release Notes

### 0.0.3

feat: add snippets and user-defined snippets

### 0.0.2

fix: focus inside of the window when new tabs are created

### 0.0.1

Initial release of sqeletor-vscode (alpha)

---

### TODO

* decide what snippets should be shipped with extension and clean up

### Known Issues

* the cursor is not pre-positioned in the desired location for "SQeLetor procedure". It works correctly for "SQeLetor script", though
