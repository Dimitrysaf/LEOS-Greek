/*
 * Copyright 2023 European Commission
 *
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy of the Licence at:
 *
 *     https://joinup.ec.europa.eu/software/page/eupl
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the Licence is distributed on an "AS IS" basis,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the Licence for the specific language governing permissions and limitations under the Licence.
 */
const config = require('./test-server-config.json');
const fs = require("fs");
const path = require("path");
const express = require("express");
const app = express();

const isDirectory = (pathDir) => fs.statSync(pathDir).isDirectory();
const getDirectories = (pathDir) => fs.readdirSync(pathDir).map((name) => path.join(pathDir, name)).filter(isDirectory);

const isFile = (pathFile) => fs.statSync(pathFile).isFile();
const getFiles = (pathFile) => fs.readdirSync(pathFile).map((name) => path.join(pathFile, name)).filter(isFile);

const getFilesRecursively = (pathDir) => {
    let dirs = getDirectories(pathDir);
    let files = dirs.map((dir) => getFilesRecursively(dir)).reduce((a, b) => a.concat(b), []);
    return files.concat(getFiles(pathDir));
};

const filterSpecs = (specs) => {
    var specNames = argv.hasOwnProperty("specNames") ? argv["specNames"] : config["specNames"];
    if (specNames && specNames.length > 0) {
        specNames = Array.isArray(specNames) ? specNames : [specNames];
        specs = specs.filter((spec) => {
            var partsOfPath = spec.split("/");
            var specName = partsOfPath[partsOfPath.length - 1].length > 0 ? partsOfPath[partsOfPath.length - 1] : partsOfPath[partsOfPath.length - 2];
            return specNames.includes(specName);
        });
    }

    var excludes = argv.hasOwnProperty("excludes") ? argv["excludes"] : config["excludes"];
    if (excludes && excludes.length > 0) {
        excludes = Array.isArray(excludes) ? excludes : [excludes];
        excludes.forEach((exclude) => {
            specs = specs.filter((spec) => !spec.includes(exclude));
        });
    }

    return specs;
};

const getSpecs = () => {
    var specDir = argv.hasOwnProperty("specDir") ? argv["specDir"] : config["specDir"];
    specDir = Array.isArray(specDir) ? specDir : [specDir];

    var specs = specDir.reduce((specs, pathDir) => {
        var files = getFilesRecursively(path.join(__dirname, pathDir));
        specs.push(...files);
        return specs;
    }, []);

    specs = specs.map((spec) => {
        return spec.replace(path.join(__dirname), "..").replace(/\\/g, "/");
    });

    return filterSpecs(specs);
};

var argv;
app.listen(3000, () => {
    console.log("Application started and listening on port 3000");
    argv = require("minimist")(process.argv.slice(2));
});

app.use(express.static(path.join(__dirname)));

app.get("/", (req, res) => {
    res.sendFile(__dirname + config.indexFile);
});

app.get("/specs", (req, res) => {
    res.json(getSpecs());
});
