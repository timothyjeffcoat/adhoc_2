const fs = require("fs");
const int64 = require("int64-buffer");
const Uint64BE = int64.Uint64BE
let offset = 0;
let finalArray;

// enumerate the record type. named it recordKind to not conflict later
const recordKind = {
    DEBIT: '00',
    CREDIT: '01',
    STARTAUTOPAY: '02',
    ENDAUTOPAY: '03'
}
/**
 * initial reading of data file
 */
fs.readFile("txnlog.dat", function(err, data) {
    finalArray = Buffer.from(data);
    // display the first line of data. The Header, Version, and Number of Records
    const header = finalArray.slice(offset,offset+=4).toString('utf8');
    const version = finalArray.slice(offset,offset+=1).toString('hex');
    const numberOfRecords = parseInt(finalArray.slice(offset,offset+=4).toString('hex'),16).toString(10);
    console.log(header, version, numberOfRecords);

    // display each row of the data
    while(offset < Buffer.byteLength(finalArray)) {
        getDataRow();
    }
});

/**
 * method to display row of data from the finalArray (Buffer)
 */
function getDataRow() {
    let recordType = finalArray.slice(offset,offset+=1).toString('hex');
    let type = recordKind.DEBIT
    switch(recordType){
        case recordKind.DEBIT:
            type = 'Debit'
            break
        case recordKind.CREDIT:
            type = 'Credit'
            break
        case recordKind.STARTAUTOPAY:
            type = 'StartAutopay'
            break
        case recordKind.ENDAUTOPAY:
            type = 'EndAutopay'
            break
    }
    let unixTimestamp = parseInt(finalArray.slice(offset,offset+=4).toString('hex'),16).toString(10);
    let userID = new Uint64BE(finalArray.slice(offset,offset+=8)).toString(10);
    // display record type, unixtimestamp, userId, and dollar amount
    if(recordType == recordKind.DEBIT || recordType == recordKind.CREDIT) {
        let dollarAmt = finalArray.slice(offset,offset+=8).readDoubleBE().toFixed(4);
        console.log(type, unixTimestamp, userID, dollarAmt);
    } else {
        console.log(type, unixTimestamp, userID);
    }
}
