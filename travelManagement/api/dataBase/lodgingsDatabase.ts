const fs = require('fs');
const path = require('path')

export class LodgingsDatabase {

    saveData(lodgings: any[]) {
        this.writeTextFile('lodgings', JSON.stringify(lodgings, null, 2));
    }

    writeTextFile(nameFile: string, content: string) {
        var writeStream = fs.createWriteStream(path.resolve(__dirname,'../../APIsData/' + nameFile + '.json'));
        writeStream.write(content);
        writeStream.end();
    }
}