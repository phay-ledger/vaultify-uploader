import pinataSDK from "@pinata/sdk";
import { notStrictEqual } from "assert";
import fs, { fdatasync } from "fs";
import path from "path";

const pinataApiKey = process.env.PINATA_API_KEY;
const pinataSecretApiKey = process.env.PINATA_SECRET_KEY;
const pinata = pinataSDK(pinataApiKey, pinataSecretApiKey);
const pinata_ipfs_gateway = "https://gateway.pinata.cloud/ipfs/"

const assets_path = "../nft-assets/images"
const assets_metadata_path = "../nft-assets/metadata"

// TODO: update this dictionary with actual image metadata if needed.
const nft_meta = {
    "1.png": {
        name: "1",
        keyvalues: {
            "nft_1": "yoyoy 1"
        }
    },

    "2.png": {
        name: "2",
        keyvalues: {
            "2": "vaultify 2"
        }
    },
}


// LOOP on each nft image asset
// PIN image asset to IPFS with PINATA
// UPDATE image in ../nft_assets/metadata/*.json with image uri

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
            const img_uri = path.join(pinata_ipfs_gateway, result.IpfsHash);
            const json_metadata = file_name.substring(0, file_name.lastIndexOf("."));
            const json_metadata_path = path.join(assets_metadata_path, json_metadata)
            const meta = JSON.parse(fs.readFileSync(json_metadata_path, "utf8"));
            meta["image"] = img_uri
            fs.writeFileSync(json_metadata_path, JSON.stringify(meta, null, 2));
        }).catch((err) => {
            //handle error here
            console.log(err);
        });
    });
});

// PIN nfts metadata to IPFS with pinata
const options = {
    pinataMetadata: {
        name: 'VAULTIFY-TEST',
        keyvalues: {
            customKey: 'customValue',
            customKey2: 'customValue2'
        }
    },
    pinataOptions: {
        cidVersion: 0
    }
};
pinata.pinFromFS(assets_metadata_path, options).then((result) => {
   

    const baseUri = path.join(pinata_ipfs_gateway, result.IpfsHash)
    console.log("HERE IS THE baseURI TO SET IN THE NFT CONTRACT:");
    console.log(baseUri);
    console.log("MADE W/ LOVE by Pi2r");
}).catch((err) => {
    //handle error here
    console.log(err);
});

export default {};
