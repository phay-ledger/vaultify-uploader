import pinataSDK from "@pinata/sdk";
import { notStrictEqual } from "assert";
import fs, { fdatasync } from "fs";
import path from "path";

const pinataApiKey = process.env.PINATA_API_KEY;
const pinataSecretApiKey = process.env.PINATA_SECRET_KEY;

const pinata = pinataSDK(pinataApiKey, pinataSecretApiKey);

const assets_path = "../nft-assets"

// TODO: update this directory with actual metadata if needed.
const nft_meta = {
    "nft_1.png": {
        name: "nft_1",
        keyvalues: {
            "nft_1": "meta"
        }
    },

    "nft_2.png": {
        name: "nft_2",
        keyvalues: {
            "nft_2": "metu"
        }
    },

}

fs.readdir(assets_path, function(err, files) {

    if (err) {
        return console.log("VAULTIFY-UPLOADER NEEDS NFTS!!!")
    }

    files.forEach(function (file_name) {

        const file_path = path.join(assets_path, file_name)
        const readableStreamForFile = fs.createReadStream(file_path);
       
        const options = {
            pinataMetadata: nft_meta[file_name],
            pinataOptions: {
                cidVersion: 0
            }
        };
        pinata.pinFileToIPFS(readableStreamForFile, options).then((result) => {
            //handle results here
            console.log(result);
        }).catch((err) => {
            //handle error here
            console.log(err);
        });
    });
});


export default {};
