# LotTrace

A free, browser-local **eForms award-reference viewer**. Follow `LotResult → LotTender → TenderingParty → Organization` before flattening procurement XML into a dataset.

[Open the working viewer](https://lottrace.hirohtht.chatgpt.site/)

The synthetic example has three lots, a two-member consortium, and an intentionally missing organization. It is illustrative data, not a real or fully schema-valid notice. Choose a public XML file or paste XML to inspect your own notice. The app does not upload or persist the XML. It exports JSON with the reference IDs and warnings.

## Proposed US$29 batch edition — not available to order

Would an offline CLI, 12 regression fixtures with expected results, and documented reference paths for an agreed SDK version help your repeat imports? That is the proposed one-time **US$29**, non-exclusive internal-team-use scope. **This edition has not been built. No orders, contracts or payments are being accepted here.**

[Discuss the $29 edition](https://github.com/taroyamada3173-sys/lottrace/issues/new?template=purchase-interest.md). State your SDK version, notice volume, expected output and whether this scope/price would fit. Counteroffers are welcome. GitHub sign-in is required and discussions are public. Do not post private notices, credentials, personal contact details or bank information.

Final scope, delivery date, acceptance, rights, buyer/seller eligibility, receiving method and any fees must be agreed before any order. JPY bank transfer is a candidate; international receiving is not confirmed. No exclusive rights to public-source materials are offered. No ongoing maintenance is included in the proposed price.

## Current limits

- ContractAwardNotice eForms UBL XML, maximum 2 MB, single notice.
- The prototype traverses references; it is **not** a schema/Schematron validator, legal award determination or procurement eligibility check.
- It preserves multiple tenderers, includes the lot-result status and matching contract IDs, and excludes subcontractors from tenderer rows. `clos-nw` must not be treated as a winning award.
- Group-of-lots IDs are shown without expanding group membership.
- Missing references produce warnings. Duplicate definitions block ambiguous output. DTD/entity declarations are rejected.
- Tested against the SDK 1.16 maximal award example and synthetic edge cases; other versions are unverified. No all-version or production compatibility claim.
- No live data feed, hosted data store, analytics or payment processing. Downloaded output remains your responsibility.

There are strong free alternatives: [TED Open Data / SPARQL](https://data.ted.europa.eu/) and [official mapping documentation](https://docs.ted.europa.eu/ODS/latest/mapping_eforms/methodology.html). The proposed product value is local, inspectable verification and regression material, not exclusive public data.

## Source and verification

`trace.js` is the browser ES module; `app.js`, `index.html`, `style.css` and `sample.xml` form the static demo. Serve these files over local HTTP using a local static server and open the localhost URL. No dependency installation is required.

The official sample was checked for separate consortium members, selected and no-winner results, and contract references. Exact reference IDs are retained in local verification evidence.

Verification used [the official example](https://github.com/OP-TED/eForms-SDK/blob/develop/examples/notices/can_24_maximal.xml), retrieved 2026-10-07. The source sample is by the Publications Office of the European Union under [CC BY 4.0](https://github.com/OP-TED/eForms-SDK/blob/develop/LICENSE); it is not redistributed here. The table above extracts reference IDs only. Our demo sample is newly authored synthetic data. No other actor's code is reused.

AI-assisted development. Independent prototype, with no EU/TED endorsement. Original demo source is MIT licensed; third-party sources retain their existing licences.
