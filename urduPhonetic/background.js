/*
Copyright 2014 Google Inc. All rights reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
var AltGr = { PLAIN: "plain", ALTERNATE: "alternate" };
var Shift = { PLAIN: "plain", SHIFTED: "shifted" };

var contextID = -1;
var altGrState = AltGr.PLAIN;
var shiftState = Shift.PLAIN;
var lastRemappedKeyEvent;

var lut = {
"Backquote": { "plain": {"plain": "", "shifted": "ً"}, "alternate": {"plain": "", "shifted":""}, "code": "Backquote"},
"Digit1": { "plain": {"plain": "۱", "shifted": "1"}, "alternate": {"plain": "!", "shifted":""}, "code": "Digit1"},
"Digit2": { "plain": {"plain": "۲", "shifted": "2"}, "alternate": {"plain": "@", "shifted":""}, "code": "Digit2"},
"Digit3": { "plain": {"plain": "۳", "shifted": "3"}, "alternate": {"plain": "#", "shifted":""}, "code": "Digit3"},
"Digit4": { "plain": {"plain": "۴", "shifted": "4"}, "alternate": {"plain": "", "shifted":""}, "code": "Digit4"},
"Digit5": { "plain": {"plain": "۵", "shifted": "5"}, "alternate": {"plain": "٪", "shifted":""}, "code": "Digit5"},
"Digit6": { "plain": {"plain": "۶", "shifted": "6"}, "alternate": {"plain": "", "shifted":""}, "code": "Digit6"},
"Digit7": { "plain": {"plain": "۷", "shifted": "7"}, "alternate": {"plain": "&", "shifted":""}, "code": "Digit7"},
"Digit8": { "plain": {"plain": "۸", "shifted": "8"}, "alternate": {"plain": "*", "shifted":""}, "code": "Digit8"},
"Digit9": { "plain": {"plain": "۹", "shifted": "9"}, "alternate": {"plain": ")", "shifted":""}, "code": "Digit9"},
"Digit0": { "plain": {"plain": "۰", "shifted": "0"}, "alternate": {"plain": "(", "shifted":""}, "code": "Digit0"},
"Minus": { "plain": {"plain": "-", "shifted": "_"}, "alternate": {"plain": "", "shifted":""}, "code": "Minus"},
"Equal": { "plain": {"plain": "=", "shifted": "+"}, "alternate": {"plain": "", "shifted":""}, "code": "Equal"},
"KeyQ": { "plain": {"plain": "ق", "shifted": "ْ"}, "alternate": {"plain": "", "shifted":""}, "code": "KeyQ"},
"KeyW": { "plain": {"plain": "و", "shifted": "ّ"}, "alternate": {"plain": "؂", "shifted":""}, "code": "KeyW"},
"KeyE": { "plain": {"plain": "ع", "shifted": "ٰ"}, "alternate": {"plain": "ٖ", "shifted":""}, "code": "KeyE"},
"KeyR": { "plain": {"plain": "ر", "shifted": "ڑ"}, "alternate": {"plain": "ؓ", "shifted":""}, "code": "KeyR"},
"KeyT": { "plain": {"plain": "ت", "shifted": "ٹ"}, "alternate": {"plain": "ؔ", "shifted":""}, "code": "KeyT"},
"KeyY": { "plain": {"plain": "ے", "shifted": "َ"}, "alternate": {"plain": "؁", "shifted":""}, "code": "KeyY"},
"KeyU": { "plain": {"plain": "ء", "shifted": "ئ"}, "alternate": {"plain":" ٔ", "shifted":""}, "code": "KeyU"},
"KeyI": { "plain": {"plain": "ی", "shifted": "ِ"}, "alternate": {"plain": "", "shifted":""}, "code": "KeyI"},
"KeyO": { "plain": {"plain": "ہ", "shifted": "ۃ"}, "alternate": {"plain": "", "shifted":""}, "code": "KeyO"},
"KeyP": { "plain": {"plain": "پ", "shifted": "ُ"}, "alternate": {"plain": "ٗ", "shifted":""}, "code": "KeyP"},
"BracketLeft": { "plain": {"plain": "]", "shifted": "}"}, "alternate": {"plain": "[", "shifted":""}, "code": "BracketLeft"},
"BracketRight": { "plain": {"plain": "[", "shifted": "{"}, "alternate": {"plain": "]", "shifted":""}, "code": "BracketRight"},
"KeyA": { "plain": {"plain": "ا", "shifted": "آ"}, "alternate": {"plain": "ﷲ", "shifted":""}, "code": "KeyA"},
"KeyS": { "plain": {"plain": "س", "shifted": "ص"}, "alternate": {"plain": "ؐ", "shifted":""}, "code": "KeyS"},
"KeyD": { "plain": {"plain": "د", "shifted": "ڈ"}, "alternate": {"plain": "ﷺ", "shifted":""}, "code": "KeyD"},
"KeyF": { "plain": {"plain": "ف", "shifted": ""}, "alternate": {"plain": "", "shifted":""}, "code": "KeyF"},
"KeyG": { "plain": {"plain": "گ", "shifted": "غ"}, "alternate": {"plain": "", "shifted":""}, "code": "KeyG"},
"KeyH": { "plain": {"plain": "ح", "shifted": "ھ"}, "alternate": {"plain": "ؒ", "shifted":""}, "code": "KeyH"},
"KeyJ": { "plain": {"plain": "ج", "shifted": "ض"}, "alternate": {"plain": "ﷻ", "shifted":""}, "code": "KeyJ"},
"KeyK": { "plain": {"plain": "ک", "shifted": "خ"}, "alternate": {"plain": "", "shifted":""}, "code": "KeyK"},
"KeyL": { "plain": {"plain": "ل", "shifted": ""}, "alternate": {"plain": "", "shifted":""}, "code": "KeyL"},
"Semicolon": { "plain": {"plain": "؛", "shifted": ":"}, "alternate": {"plain": "", "shifted":""}, "code": "Semicolon"},
"Quote": { "plain": {"plain": "'", "shifted": "\""}, "alternate": {"plain": "", "shifted":""}, "code": "Quote"},
"KeyZ": { "plain": {"plain": "ز", "shifted": "ذ"}, "alternate": {"plain": "؏", "shifted":""}, "code": "KeyZ"},
"KeyX": { "plain": {"plain": "ش", "shifted": "ژ"}, "alternate": {"plain": "؎", "shifted":""}, "code": "KeyX"},
"KeyC": { "plain": {"plain": "چ", "shifted": "ث"}, "alternate": {"plain": "؃", "shifted":""}, "code": "KeyC"},
"KeyV": { "plain": {"plain": "ط", "shifted": "ظ"}, "alternate": {"plain": "", "shifted":""}, "code": "KeyV"},
"KeyB": { "plain": {"plain": "ب", "shifted": ""}, "alternate": {"plain": "﷽", "shifted":""}, "code": "KeyB"},
"KeyN": { "plain": {"plain": "ن", "shifted": "ں"}, "alternate": {"plain": "؀", "shifted":""}, "code": "KeyN"},
"KeyM": { "plain": {"plain": "م", "shifted": "٘"}, "alternate": {"plain": "", "shifted":""}, "code": "KeyM"},
"Comma": { "plain": {"plain": "،", "shifted": ""}, "alternate": {"plain": ">", "shifted":""}, "code": "Comma"},
"Period": { "plain": {"plain": "۔", "shifted": "٫"}, "alternate": {"plain": "<", "shifted":""}, "code": "Period"},
"Slash": { "plain": {"plain": "/", "shifted": "؟"}, "alternate": {"plain": "", "shifted":""}, "code": "Slash"},
};
    

chrome.input.ime.onFocus.addListener(function(context) {
  contextID = context.contextID;
});

function updateAltGrState(keyData) {
  altGrState = (keyData.code == "AltRight") ? ((keyData.type == "keydown") ? AltGr.ALTERNATE : AltGr.PLAIN)
                                              : altGrState;
}

function updateShiftState(keyData) {
  shiftState = ((keyData.shiftKey && !(keyData.capsLock)) || (!(keyData.shiftKey) && keyData.capsLock)) ?
                 Shift.SHIFTED : Shift.PLAIN;
}

function isPureModifier(keyData) {
  return (keyData.key == "Shift") || (keyData.key == "Ctrl") || (keyData.key == "Alt");
}

function isRemappedEvent(keyData) {
  // hack, should check for a sender ID (to be added to KeyData)
  return lastRemappedKeyEvent !== undefined &&
         (lastRemappedKeyEvent.key == keyData.key &&
          lastRemappedKeyEvent.code == keyData.code &&
          lastRemappedKeyEvent.type == keyData.type
         ); // requestID would be different so we are not checking for it
}


chrome.input.ime.onKeyEvent.addListener(
    function(engineID, keyData) {
      var handled = false;
      
      if (isRemappedEvent(keyData)) {
        lastRemappedKeyEvent = undefined;
        return handled;
      }

      updateAltGrState(keyData);
      updateShiftState(keyData);
                
      if (lut[keyData.code]) {
          var remappedKeyData = keyData;
          remappedKeyData.key = lut[keyData.code][altGrState][shiftState];
          remappedKeyData.code = lut[keyData.code].code;
        
        if (chrome.input.ime.sendKeyEvents !== undefined) {
          chrome.input.ime.sendKeyEvents({"contextID": contextID, "keyData": [remappedKeyData]});
          handled = true;
          lastRemappedKeyEvent = remappedKeyData;
        } else if (keyData.type == "keydown" && !isPureModifier(keyData)) {
          chrome.input.ime.commitText({"contextID": contextID, "text": remappedKeyData.key});
          handled = true;
        }
      }
      
      return handled;
});
