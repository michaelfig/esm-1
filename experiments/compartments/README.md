# Compartments

The idea that a module can have different manifestations during runtime has been extensively explored in many contexts, including SES.

This experimental work tries to design a minimalistic cross-platform solution that can be used to affect compartmentalized modules with maximum utility of the native module system as much as possible.

## Background

Moddable presented a [novel solution](https://groups.google.com/forum/#!topic/ses-strategy/FnlQUP4UivU) which brought together aspects of the SES manifest approach together with aspects explored elsewhere in the ecosystem, specifically aspects [long discussed](https://github.com/nodejs/modules/issues/231) by the Node.js modules team.

Moddable's novel solution is a global Compartment constructor, which takes an entrypoint and a declarative mapping for specifiers. It is very similar to import maps in that it maps the absolute form of any valid specifier to another specifier. The additional aspect of such compartments is their handling of endowments, ie the global scope of modules running in compartments, an extensively importand [SES detail](https://smotaal.io/sandbox/Serviceless.md#early-poc-gimmes).

## Compartmentalized Module Maps

The main contribution of this work is in providing a fool-proof mechanism to affect the necessary mapping and emplacement APIs.

### Level 1 — Servicing Methods

This is the more tenable approach of actually intercepting and controlling module requests.

### Level 2 — Serviceless Methods

This is the second level of experimentation.

## Compartmentalized Module Scopes

The secondary contribution of this work is to provide a solid way to augment compartment specific globals.
