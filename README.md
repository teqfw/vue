# @teqfw/vue

|CAUTION: TeqFW is an unstable, fast-growing project w/o backward compatibility. Use it at your own risk.|
|---|

Plugin for Vue v3 & Vue Router v4 to use in Tequila Framework based apps.

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
