// Common validation class for common function
class ValidationClass {
    // check key exist in input if not then set key with error message of required 
    // in outputobject
    required (inputObj, outputObj , key) {
        if(!inputObj || !inputObj[key]) {
            outputObj[key] = key + ' required !';
        }
    }
    // check key exist in input if exist then check value is valid or not as url
    // if not then set key with error message of url not valid 
    // in outputobject
    validURL(inputObj, outputObj , key) {
         var pattern = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
          if(inputObj && inputObj[key]) {
            if(!pattern.test(inputObj[key])) {            
                outputObj[key] = key + " not a valid url";
            }
        }
      }
}
// singleton instance for Validation class
export const Validation = new ValidationClass();