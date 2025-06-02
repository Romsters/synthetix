'use strict';
require('dotenv').config();

const path = require('path');

/// the order of these imports is important (due to custom overrides):
/// ./hardhat needs to be imported after hardhat-interact and after solidity-coverage.
///  and hardhat-gas-reporter needs to be imported after ./hardhat (otherwise no gas reports)
require('hardhat-interact');
require('solidity-coverage');
require('./hardhat');
require('@nomiclabs/hardhat-etherscan');
require('@nomiclabs/hardhat-truffle5');
require('@nomiclabs/hardhat-ethers');
require('hardhat-gas-reporter');

require('hardhat-cannon');

const {
	constants: { inflationStartTimestampInSecs, AST_FILENAME, AST_FOLDER, BUILD_FOLDER },
} = require('.');

const CACHE_FOLDER = 'cache';

module.exports = {
	ovm: {
		solcVersion: '0.5.16',
	},
	solidity: {
		compilers: [
			{
				version: '0.4.25',
			},
			{
				version: '0.5.16',
			},
		],
	},
	paths: {
		sources: './contracts',
		tests: './test/contracts',
		artifacts: path.join(BUILD_FOLDER, 'artifacts'),
		cache: path.join(BUILD_FOLDER, CACHE_FOLDER),
	},
	astdocs: {
		path: path.join(BUILD_FOLDER, AST_FOLDER),
		file: AST_FILENAME,
		ignores: 'test-helpers',
	},
	defaultNetwork: 'bojuumos',
	networks: {
		hardhat: {
			blockGasLimit: 12e6,
			allowUnlimitedContractSize: true,
			initialDate: new Date(inflationStartTimestampInSecs * 1000).toISOString(),
			initialBaseFeePerGas: (1e9).toString(), // 1 GWEI
			// Note: forking settings are injected at runtime by hardhat/tasks/task-node.js
		},
		geth: {
			gas: 12e6,
			blockGasLimit: 12e6,
			allowUnlimitedContractSize: true,
			url: 'http://localhost:8545',
			accounts: [
				"0xac1e735be8536c6534bb4f17f06f6afc73b2b5ba84ac2cfb12f7461b20c0bbe3",
				"0x7726827caac94a7f9e1b160f7ea819f172f7b6f9d2a97f992c38edeab82d4110",
				"0xd293c684d884d56f8d6abd64fc76757d3664904e309a0645baf8522ab6366d9e",
				"0x850683b40d4a740aa6e745f889a6fdc8327be76e122f5aba645a5b02d0248db8",
				"0x3d3cbc973389cb26f657686445bcc75662b415b656078503592ac8c1abb8810e",
				"0x509ca2e9e6acf0ba086477910950125e698d4ea70fa6f63e000c5a22bda9361c",
			],
		},
		bojuumos: {
			gas: 12e6,
			blockGasLimit: 12e6,
			allowUnlimitedContractSize: true,
			url: 'http://localhost:3050',
			accounts: [
				"0xac1e735be8536c6534bb4f17f06f6afc73b2b5ba84ac2cfb12f7461b20c0bbe3",
				"0x7726827caac94a7f9e1b160f7ea819f172f7b6f9d2a97f992c38edeab82d4110",
				"0xd293c684d884d56f8d6abd64fc76757d3664904e309a0645baf8522ab6366d9e",
				"0x850683b40d4a740aa6e745f889a6fdc8327be76e122f5aba645a5b02d0248db8",
				"0x3d3cbc973389cb26f657686445bcc75662b415b656078503592ac8c1abb8810e",
				"0x509ca2e9e6acf0ba086477910950125e698d4ea70fa6f63e000c5a22bda9361c",
			],
		},
		localhost9545: {
			gas: 12e6,
			blockGasLimit: 12e6,
			url: 'http://localhost:9545',
		},
		mainnet: {
			url: process.env.PROVIDER_URL?.replace('network', 'mainnet') || 'http://localhost:8545',
			chainId: 1,
			accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
		},
		'mainnet-ovm': {
			url: process.env.OVM_PROVIDER_URL || 'https://mainnet.optimism.io/',
			chainId: 10,
			accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
		},
		sepolia: {
			url:
				process.env.PROVIDER_URL?.replace('network', 'sepolia') ||
				'https://ethereum-sepolia-rpc.publicnode.com',
			chainId: 11155111,
			accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
		},
		'sepolia-ovm': {
			url: process.env.OVM_SEPOLIA_PROVIDER_URL || 'https://sepolia.optimism.io/',
			chainId: 11155420,
			accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
		},
		local: {
			chainId: 31337,
			url: 'http://localhost:8545/',
		},
		'local-ovm': {
			url: 'http://localhost:9545/',
		},
	},
	gasReporter: {
		enabled: false,
		showTimeSpent: true,
		gasPrice: 20,
		currency: 'USD',
		maxMethodDiff: 25, // CI will fail if gas usage is > than this %
		outputFile: 'test-gas-used.log',
	},
	mocha: {
		timeout: 300e3, // 300s
		retries: 1,
	},
	etherscan: {
		apiKey: {
			sepolia: process.env.ETHERSCAN_KEY,
		},
	},
	cannon: {
		publisherPrivateKey: process.env.PRIVATE_KEY,
		ipfsEndpoint: 'https://ipfs.infura.io:5001',
		ipfsAuthorizationHeader: `Basic ${Buffer.from(
			process.env.INFURA_IPFS_ID + ':' + process.env.INFURA_IPFS_SECRET
		).toString('base64')}`,
	},
};
