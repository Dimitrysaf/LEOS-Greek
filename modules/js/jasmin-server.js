/*
 * Copyright 2024 European Union
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
const { generateKeyPairSync } = require("crypto");
const { Certificate } = require("@fidm/x509");
const config = require('./jasmin-server-config.json');
const fs = require("fs");
const path = require("path");
const express = require("express");
const app = express();
const https = require("https");

const isDirectory = (pathDir) => fs.statSync(pathDir).isDirectory();
const getDirectories = (pathDir) => fs.readdirSync(pathDir).map((name) => path.join(pathDir, name)).filter(isDirectory);

const isFile = (pathFile) => fs.statSync(pathFile).isFile();
const getFiles = (pathFile) => fs.readdirSync(pathFile).map((name) => path.join(pathFile, name)).filter(isFile);

const getFilesRecursively = (pathDir) => {
    let dirs = getDirectories(pathDir);
    let files = dirs.map((dir) => getFilesRecursively(dir)).reduce((a, b) => a.concat(b), []);
    return files.concat(getFiles(pathDir));
};

const { privateKey, publicKey } = generateKeyPairSync("rsa", {
    modulusLength: 2048, // Key size in bits
});

const cert = new Certificate({
    serialNumber: "01",
    issuer: { CN: "localhost" },
    subject: { CN: "localhost" },
    publicKey: publicKey,
    validFrom: new Date(),
    validTo: new Date(new Date().getTime() + 365 * 24 * 60 * 60 * 1000), // 1 year validity
});

const privateKeyPEM = privateKey.export({ type: "pkcs1", format: "pem" });
const certPEM = cert.toPEM();

const options = {
    key: privateKeyPEM,
    cert: certPEM,
    secureProtocol: 'TLSv1_2_method',
    secureOptions: require("constants").SSL_OP_NO_SSLv2 |
      require("constants").SSL_OP_NO_SSLv3 |
      require("constants").SSL_OP_NO_TLSv1 |
      require("constants").SSL_OP_NO_TLSv1_1,
    minVersion: "TLSv1.2" // Ensures only TLS 1.2 and above are allowed
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

https.createServer(options, app).listen(3000, () => {
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
