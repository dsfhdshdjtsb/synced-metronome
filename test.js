let objArr = [
    {key: 'Mon Sep 23 2013 00:00:00 GMT-0400', val: 42},
    {key: 'Mon Sep 24 2013 00:00:00 GMT-0400', val: 78},
    {key: 'Mon Sep 25 2013 00:00:00 GMT-0400', val: 23},
    {key: 'Mon Sep 23 2013 00:00:00 GMT-0400', val: 54}
  ];
  
function sumKeys(array){
    // copy pasted from stack overflow
    let counts = array.reduce((prev, curr) => {
        let count = prev.get(curr.clientId) || 0;
        prev.set(curr.clientId, curr.offset + count);
        return prev;
    }, new Map());

    // then, map your counts object back to an array
    console.log(counts);
    var res = [];
    counts.forEach(function(val, key) {
        res.push({ region: key, value: val });
    });
    return res;
}

console.log(sumKeys(objArr));