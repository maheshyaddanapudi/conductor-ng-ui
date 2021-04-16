import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class JSONFlattenerService {

  constructor() { }

  flatten(obj: any, prev_key?: string) {
    return Object.keys(obj).reduce((acc, current) => {
      const _key = `${current}`;
      const currentValue = obj[current];
      if (Array.isArray(currentValue) || Object(currentValue) === currentValue) {
        if(prev_key)
        {
          Object.assign(acc, this.flatten(currentValue, prev_key+'.'+_key));
        }
        else{
          Object.assign(acc, this.flatten(currentValue, _key));
        }
      } else {
        if(prev_key){
           acc[prev_key+'.'+_key] = currentValue;
        }
        else{
           acc[_key] = currentValue;
        }
      }
      return acc;
    }, {});
  }

  unflatten(table){
    var result = {};

    for (var path in table) {
        var cursor: any = result, length = path.length, property = "", index = 0;

        while (index < length) {
            var char = path.charAt(index);

            if (char === "[") {
                var start = index + 1,
                    end = path.indexOf("]", start),
                    cursor = cursor[property] = cursor[property] || [],
                    property = path.slice(start, end),
                    index = end + 1;
            } else {
                var cursor = cursor[property] = cursor[property] || {},
                    start = char === "." ? index + 1 : index,
                    bracket = path.indexOf("[", start),
                    dot = path.indexOf(".", start);

                if (bracket < 0 && dot < 0) var end = index = length;
                else if (bracket < 0) var end = index = dot;
                else if (dot < 0) var end = index = bracket;
                else var end = index = bracket < dot ? bracket : dot;

                var property = path.slice(start, end);
            }
        }

        cursor[property] = table[path];
    }

    return result[""];
  }
}
