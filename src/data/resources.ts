export type ResourceType = "Doc" | "Tutorial" | "Article" | "Tool" | "Video"

export type Resource = {
  g: string
  t: string
  s: string
  d: string
  ty: ResourceType
  u: string
}

export const RESOURCE_GROUPS = [
  "Start here",
  "Developer docs",
  "Tutorials",
  "Network & tools",
  "Articles & announcements",
  "Community"
] as const

export const RESOURCES: Resource[] = [
  {
    "g": "Start here",
    "t": "Tezos X: Build and deploy",
    "s": "tezos.com",
    "d": "What Tezos X is, why it matters and the official roadmap.",
    "ty": "Article",
    "u": "https://tezos.com/tezos-x/"
  },
  {
    "g": "Start here",
    "t": "Tezos X Previewnet dashboard",
    "s": "Nomadic Labs",
    "d": "Live status, changelog, endpoints, wallets, demos and builder tools.",
    "ty": "Tool",
    "u": "https://previewnet.tezosx.nomadic-labs.com/"
  },
  {
    "g": "Start here",
    "t": "Get started",
    "s": "docs.etherlink.com",
    "d": "Entry point to the docs for the EVM and Michelson interfaces.",
    "ty": "Doc",
    "u": "https://docs.etherlink.com/overview/get-started"
  },
  {
    "g": "Start here",
    "t": "Native atomic composability at TezDev 2026",
    "s": "YouTube · Tezos",
    "d": "12 minute talk by François Thiré on how NAC works and what it unlocks.",
    "ty": "Video",
    "u": "https://www.youtube.com/watch?v=zh6Ov2RObK0"
  },
  {
    "g": "Developer docs",
    "t": "What is Etherlink?",
    "s": "docs.etherlink.com",
    "d": "Overview of the execution layer behind Tezos X.",
    "ty": "Doc",
    "u": "https://docs.etherlink.com/"
  },
  {
    "g": "Developer docs",
    "t": "Architecture",
    "s": "docs.etherlink.com",
    "d": "Runtimes, sequencer and the NAC vs bridging comparison table.",
    "ty": "Doc",
    "u": "https://docs.etherlink.com/overview/architecture"
  },
  {
    "g": "Developer docs",
    "t": "Native Atomic Composability",
    "s": "docs.etherlink.com",
    "d": "Concepts and guarantees of cross interface calls.",
    "ty": "Doc",
    "u": "https://docs.etherlink.com/overview/native-atomic-composability"
  },
  {
    "g": "Developer docs",
    "t": "Accounts and aliases",
    "s": "docs.etherlink.com",
    "d": "How 0x and tz1 accounts map to each other (EVM alias of a Tezos account).",
    "ty": "Doc",
    "u": "https://docs.etherlink.com/overview/accounts-and-aliases"
  },
  {
    "g": "Developer docs",
    "t": "Michelson interface overview",
    "s": "docs.etherlink.com",
    "d": "Tezos RPC, tz/KT1 accounts, FA1.2/FA2 on the Michelson runtime.",
    "ty": "Doc",
    "u": "https://docs.etherlink.com/michelson/"
  },
  {
    "g": "Developer docs",
    "t": "Michelson: getting started",
    "s": "docs.etherlink.com",
    "d": "Set up tooling and deploy your first Michelson contract.",
    "ty": "Doc",
    "u": "https://docs.etherlink.com/michelson/getting-started"
  },
  {
    "g": "Developer docs",
    "t": "NAC usage (Michelson)",
    "s": "docs.etherlink.com",
    "d": "Calling EVM contracts from Michelson through the gateway.",
    "ty": "Doc",
    "u": "https://docs.etherlink.com/michelson/nac-usage"
  },
  {
    "g": "Developer docs",
    "t": "Compatibility with Tezos L1",
    "s": "docs.etherlink.com",
    "d": "Differences between the Michelson interface and Tezos Layer 1.",
    "ty": "Doc",
    "u": "https://docs.etherlink.com/michelson/developing/compatibility"
  },
  {
    "g": "Developer docs",
    "t": "EVM interface overview",
    "s": "docs.etherlink.com",
    "d": "Ethereum JSON RPC, Solidity tooling and wallets.",
    "ty": "Doc",
    "u": "https://docs.etherlink.com/evm/"
  },
  {
    "g": "Developer docs",
    "t": "EVM: getting started",
    "s": "docs.etherlink.com",
    "d": "Connect MetaMask, Hardhat or Foundry and deploy.",
    "ty": "Doc",
    "u": "https://docs.etherlink.com/evm/getting-started"
  },
  {
    "g": "Developer docs",
    "t": "octez.js: support for Tezos X",
    "s": "octez.js docs",
    "d": "Networks, endpoints and chain IDs for the Michelson interface.",
    "ty": "Doc",
    "u": "https://octez-js.tezos.com/docs/25.0.0/tezosx_support/"
  },
  {
    "g": "Developer docs",
    "t": "octez.js: cross runtime calls",
    "s": "octez.js docs",
    "d": "buildEvmToMichelsonCall / buildMichelsonToEvmCall helpers.",
    "ty": "Doc",
    "u": "https://octez-js.tezos.com/docs/25.0.0/tezosx_cross_runtime/"
  },
  {
    "g": "Developer docs",
    "t": "Migration from Taquito",
    "s": "octez.js docs",
    "d": "Swap the Taquito packages for octez.js ones. Same API.",
    "ty": "Doc",
    "u": "https://octez-js.tezos.com/docs/25.0.0/migration_from_taquito/"
  },
  {
    "g": "Developer docs",
    "t": "Kernel upgrades",
    "s": "docs.etherlink.com",
    "d": "History of Etherlink kernel upgrades.",
    "ty": "Doc",
    "u": "https://docs.etherlink.com/progress/upgrades"
  },
  {
    "g": "Developer docs",
    "t": "Tezos documentation",
    "s": "docs.tezos.com",
    "d": "Tezos L1, Michelson, SmartPy, LIGO and tooling.",
    "ty": "Doc",
    "u": "https://docs.tezos.com/"
  },
  {
    "g": "Tutorials",
    "t": "Cross interface counter (NAC walkthrough)",
    "s": "docs.etherlink.com",
    "d": "SmartPy counter on Michelson + Solidity forwarder; success and atomic revert.",
    "ty": "Tutorial",
    "u": "https://docs.etherlink.com/tutorials/nac-counter"
  },
  {
    "g": "Tutorials",
    "t": "All tutorials",
    "s": "docs.etherlink.com",
    "d": "Prediction market on EVM, NAC counter and more.",
    "ty": "Tutorial",
    "u": "https://docs.etherlink.com/tutorials/"
  },
  {
    "g": "Tutorials",
    "t": "Running a local sandbox",
    "s": "docs.etherlink.com",
    "d": "Test locally before deploying to Previewnet.",
    "ty": "Tutorial",
    "u": "https://docs.etherlink.com/testing/sandbox"
  },
  {
    "g": "Network & tools",
    "t": "Tezos X Previewnet repo",
    "s": "GitHub · trilitech",
    "d": "Canonical chain IDs, endpoints, rollup address and wallet config.",
    "ty": "Tool",
    "u": "https://github.com/trilitech/tezos-x-previewnet"
  },
  {
    "g": "Network & tools",
    "t": "Previewnet faucet",
    "s": "Nomadic Labs",
    "d": "Testnet XTZ for 0x and tz1 addresses.",
    "ty": "Tool",
    "u": "https://faucet.previewnet.tezosx.nomadic-labs.com"
  },
  {
    "g": "Network & tools",
    "t": "Previewnet bridge",
    "s": "Nomadic Labs",
    "d": "Deposit and withdraw XTZ between Tezos L1 and Previewnet.",
    "ty": "Tool",
    "u": "https://bridge.previewnet.tezosx.nomadic-labs.com/"
  },
  {
    "g": "Network & tools",
    "t": "Blockscout (EVM explorer)",
    "s": "Blockscout",
    "d": "EVM transactions, contracts and verification on Previewnet.",
    "ty": "Tool",
    "u": "https://blockscout.previewnet.tezosx.nomadic-labs.com"
  },
  {
    "g": "Network & tools",
    "t": "TzKT (Michelson explorer)",
    "s": "Baking Bad",
    "d": "Michelson operations, contracts and storage, plus REST API.",
    "ty": "Tool",
    "u": "https://tzkt.previewnet.tezosx.nomadic-labs.com"
  },
  {
    "g": "Network & tools",
    "t": "Tezos X Wallet",
    "s": "trilitech",
    "d": "One account for both interfaces, via EIP 6963.",
    "ty": "Tool",
    "u": "https://trilitech.github.io/tezos-x-wallet/"
  },
  {
    "g": "Network & tools",
    "t": "xDex",
    "s": "Previewnet demo",
    "d": "IguanaDEX fork for swaps, pools and liquidity tests.",
    "ty": "Tool",
    "u": "https://dexx-previewnet.vercel.app/"
  },
  {
    "g": "Network & tools",
    "t": "xCounter demo",
    "s": "Previewnet demo",
    "d": "Live version of the cross interface counter tutorial.",
    "ty": "Tool",
    "u": "https://tzx-counter.vercel.app/"
  },
  {
    "g": "Network & tools",
    "t": "Potluck",
    "s": "Previewnet demo",
    "d": "Small game where every press is one atomic EVM + Michelson tx.",
    "ty": "Tool",
    "u": "https://potluck.tezos.com/"
  },
  {
    "g": "Network & tools",
    "t": "octez.js",
    "s": "GitHub · trilitech",
    "d": "TypeScript SDK (Taquito fork) with Tezos X tooling.",
    "ty": "Tool",
    "u": "https://github.com/trilitech/octez.js"
  },
  {
    "g": "Network & tools",
    "t": "CHANGES_TEZOSX.md",
    "s": "GitLab · tezos",
    "d": "Full technical changelog of Tezos X.",
    "ty": "Doc",
    "u": "https://gitlab.com/tezos/tezos/-/blob/master/etherlink/CHANGES_TEZOSX.md"
  },
  {
    "g": "Network & tools",
    "t": "SmartPy IDE",
    "s": "smartpy.io",
    "d": "Browser IDE to write and deploy Michelson contracts.",
    "ty": "Tool",
    "u": "https://smartpy.io/ide"
  },
  {
    "g": "Network & tools",
    "t": "Remix",
    "s": "remix.ethereum.org",
    "d": "Browser IDE for Solidity contracts.",
    "ty": "Tool",
    "u": "https://remix.ethereum.org/"
  },
  {
    "g": "Articles & announcements",
    "t": "Introducing Tezos X Previewnet",
    "s": "Tezos Spotlight",
    "d": "Launch post: one shared ledger and native atomic composability.",
    "ty": "Article",
    "u": "https://spotlight.tezos.com/introducing-tezos-x-previewnet/"
  },
  {
    "g": "Articles & announcements",
    "t": "Tezos X: From Roadmap to Reality",
    "s": "Tezos Spotlight",
    "d": "What Tezos X is for users and builders, and how it's built.",
    "ty": "Article",
    "u": "https://spotlight.tezos.com/tezos-x-from-roadmap-to-reality/"
  },
  {
    "g": "Articles & announcements",
    "t": "Announcing Ganesha (Etherlink 7.0)",
    "s": "Tezos Spotlight",
    "d": "Upgrade proposal bringing the Michelson interface and NAC to mainnet.",
    "ty": "Article",
    "u": "https://spotlight.tezos.com/announcing-ganesha-etherlink-7th-upgrade-proposal/"
  },
  {
    "g": "Articles & announcements",
    "t": "Introducing Octez.js",
    "s": "Tezos Agora",
    "d": "Why Octez.js forked Taquito to support Tezos X.",
    "ty": "Article",
    "u": "https://forum.tezosagora.org/t/introducing-octez-js-building-towards-tezos-x/7214"
  },
  {
    "g": "Articles & announcements",
    "t": "Octez.js v25.1.0 release candidate",
    "s": "Tezos Agora",
    "d": "Taquito parity and recoverable EVM aliases for Etherlink 8.0.",
    "ty": "Article",
    "u": "https://forum.tezosagora.org/t/octez-js-v25-1-0-rc-0-taquito-parity-and-recoverable-evm-aliases-for-etherlink-8-0/7227"
  },
  {
    "g": "Articles & announcements",
    "t": "TezDev 2026 livestream",
    "s": "YouTube · Cointelegraph",
    "d": "Full conference stream, including Tezos X sessions.",
    "ty": "Video",
    "u": "https://www.youtube.com/watch?v=QF4tJdHvVBI"
  },
  {
    "g": "Community",
    "t": "Tezos Discord: Tezos X channel",
    "s": "discord.gg/tezos",
    "d": "Ask the core team questions and share feedback.",
    "ty": "Tool",
    "u": "https://discord.gg/tezos"
  },
  {
    "g": "Community",
    "t": "xdocs issue tracker",
    "s": "GitLab · tezos",
    "d": "Request a tutorial or report a docs issue.",
    "ty": "Doc",
    "u": "https://gitlab.com/tezos/xdocs"
  },
  {
    "g": "Community",
    "t": "Etherlink further reading",
    "s": "docs.etherlink.com",
    "d": "Curated extra reading from the docs team.",
    "ty": "Article",
    "u": "https://docs.etherlink.com/resources/etherlink-further-reading"
  }
]
