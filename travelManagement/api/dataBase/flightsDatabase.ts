const fs = require('fs');
const path = require('path')

export class FlightsDatabase {

    saveData(departureSegments:any[], returnSegments: any[]) {
        this.writeTextFile('departureFlights', JSON.stringify(departureSegments, null, 2));
        this.writeTextFile('returnFlights', JSON.stringify(returnSegments, null, 2));
    }

    writeTextFile(nameFile: string, content: string) {
        var writeStream = fs.createWriteStream(path.resolve(__dirname,'../../APIsData/' + nameFile + '.json'));
        writeStream.write(content);
        writeStream.end();
    }
}