import { exec } from 'child_process';
import { mkdir, rm, writeFile } from 'fs/promises';

const URL = process.env.PUBLIC_API_URL;
const API_KEY = process.env.PUBLIC_API_KEY;

const name = 'Web-API';
const specSourceLocal = `${URL}/openapi.json?key=${API_KEY}`;
const localRoot = 'src/lib/api';
const localOpenApiPath = `${localRoot}/openapi.json`;

const getSpecFromLocal = async () => {
	console.log(`${name}: Getting spec from local...`);

	const res = await fetch(specSourceLocal);
	if (res.status !== 200) {
		throw new Error(`${name}: --> FAILED: ${res.status}: ${specSourceLocal}`);
	}

	await writeFile(localOpenApiPath, await res.text(), 'utf-8');
	console.log(`${name}: --> Success!`);
};

const generateCmd = `openapi-generator-cli generate --skip-validate-spec -i ${localOpenApiPath} -g typescript-fetch -o ${localRoot}`;
const generateApi = async () => {
	console.log(`${name}: Generating api...`);
	return new Promise((resolve, reject) => {
		exec(generateCmd, (err, stdout, stderr) => {
			if (err) {
				return reject(new Error(`${name}: --> FAILED: ${err}`));
			}

			if (stderr) {
				return reject(new Error(`${name}: --> FAILED: ${stderr}`));
			}

			console.log(`${name}: ${stdout}`);
			console.log(`${name}: --> Success!`);
			resolve();
		});
	});
};

console.log(`${name}: Cleaning openapi dir...`);
await rm(localRoot, { force: true, recursive: true });
await mkdir(localRoot, { recursive: true });
console.log(`${name}: --> Success!`);

await getSpecFromLocal();
await generateApi();
