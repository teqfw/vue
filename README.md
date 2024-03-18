# Vue integration into TeqFW projects

## Disclaimer

This package is a part of the [Tequila Framework](https://flancer32.com/what-is-teqfw-45da7071fdd4) (TeqFW). The TeqFW
is currently in an early stage of development and should be considered unstable. It may change rapidly, leading to
breaking changes without prior notice. Use it at your own risk. Please note that contributions to the project are
welcome, but they should only be made by those who understand and accept the risks of working with an unstable
framework.

## Install

```shell
$ npm i @teqfw/vue --save 
```

## Namespace

This plugin uses `TeqFw_Vue` namespace.

## Usage

Load functionality with TeqFW DI:

```javascript
// using  DI container
const {ref} = await container.get('TeqFw_Vue_Front_Ext_Vue');
// in constructor (with `spec`)
const {ref} = spec['TeqFw_Vue_Front_Ext_Vue'];
```
