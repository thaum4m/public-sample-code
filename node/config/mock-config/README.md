# Mock Config
Prototypical implementation of node config module which is designed to represent a tree structure based on a directory with support for inheritance by merging values in files with the same basename (filename without extension). The implementation hardcodes the object representation of the tree structure built from the _config_ directory.

The sample implements a base class, _Config_ which includes:
1. Static methods to configure how a tree representation of a filesystem tree is constructed 
These methods are **not impelemented**.

2. Static method _get_ which calls _getItems_ which returns a value in an object via a dot separated path used to target a value in the tree.
_getItems_ is **partially implemented** and does not support directly retrieving values from an array.

## Usage
The sample can be run with the following command:
```
node mock-config
```
