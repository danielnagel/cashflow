"""Minimal camt.052 reader for assertions in tests."""

import xml.etree.ElementTree as ET
from dataclasses import dataclass
from datetime import date
from decimal import Decimal

NS = {"c": "urn:iso:std:iso:20022:tech:xsd:camt.052.001.02"}


@dataclass(frozen=True)
class Report:
    iban: str
    balances: dict[str, Decimal]
    entries: list[ET.Element]


def _signed(element: ET.Element) -> Decimal:
    amount = Decimal(element.findtext("c:Amt", namespaces=NS) or "")
    return -amount if element.findtext("c:CdtDbtInd", namespaces=NS) == "DBIT" else amount


def read(xml: str) -> Report:
    root = ET.fromstring(xml)  # noqa: S314 - fixtures and generated documents only
    report = root.find("c:BkToCstmrAcctRpt/c:Rpt", NS)
    assert report is not None
    return Report(
        iban=report.findtext("c:Acct/c:Id/c:IBAN", namespaces=NS) or "",
        balances={
            balance.findtext("c:Tp/c:CdOrPrtry/c:Cd", namespaces=NS) or "": _signed(balance)
            for balance in report.findall("c:Bal", NS)
        },
        entries=report.findall("c:Ntry", NS),
    )


def amount(entry: ET.Element) -> Decimal:
    return _signed(entry)


def status(entry: ET.Element) -> str:
    return entry.findtext("c:Sts", namespaces=NS) or ""


def booking_date(entry: ET.Element) -> date:
    return date.fromisoformat(entry.findtext("c:BookgDt/c:Dt", namespaces=NS) or "")


def posting_text(entry: ET.Element) -> str:
    return entry.findtext("c:AddtlNtryInf", namespaces=NS) or ""


def counterparty(entry: ET.Element) -> str:
    return entry.findtext(".//c:RltdPties/*/c:Nm", namespaces=NS) or ""


def counterparty_iban(entry: ET.Element) -> str | None:
    return entry.findtext(".//c:RltdPties/*/c:Id/c:IBAN", namespaces=NS)


def purpose(entry: ET.Element) -> list[str]:
    return [line.text or "" for line in entry.findall(".//c:Ustrd", NS)]


def serialize(entry: ET.Element) -> bytes:
    return ET.tostring(entry)
