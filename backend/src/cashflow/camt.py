"""Parser for camt.052 account reports as delivered via FinTS."""

import xml.etree.ElementTree as ET
from dataclasses import dataclass
from datetime import date
from decimal import Decimal

from defusedxml import DefusedXmlException
from defusedxml import ElementTree as SafeET

OPENING_CODES = ("OPBD", "PRCD")
CLOSING_CODES = ("CLBD",)


class CamtError(ValueError):
    """The document is not a readable camt.052 report."""


@dataclass(frozen=True)
class CamtEntry:
    booked: bool
    booking_date: date
    value_date: date | None
    amount: Decimal
    """Signed: negative for debits."""
    currency: str
    counterparty_name: str
    """As delivered, including padding and prefixes."""
    counterparty_iban: str | None
    purpose_lines: tuple[str, ...]
    posting_text: str
    xml: str
    """The original <Ntry> element."""


@dataclass(frozen=True)
class CamtReport:
    iban: str
    opening_balance: Decimal | None
    closing_balance: Decimal | None
    entries: tuple[CamtEntry, ...]


class _Reader:
    def __init__(self, namespace: str) -> None:
        self.ns = {"c": namespace} if namespace else {}
        self.prefix = "c:" if namespace else ""

    def path(self, path: str) -> str:
        return "/".join(f"{self.prefix}{part}" for part in path.split("/"))

    def find(self, element: ET.Element, path: str) -> ET.Element | None:
        return element.find(self.path(path), self.ns)

    def findall(self, element: ET.Element, path: str) -> list[ET.Element]:
        return element.findall(self.path(path), self.ns)

    def text(self, element: ET.Element, path: str) -> str | None:
        found = self.find(element, path)
        return found.text if found is not None and found.text is not None else None

    def required(self, element: ET.Element, path: str) -> str:
        value = self.text(element, path)
        if value is None:
            raise CamtError(f"missing element {path}")
        return value

    def signed_amount(self, element: ET.Element) -> Decimal:
        amount = Decimal(self.required(element, "Amt"))
        indicator = self.required(element, "CdtDbtInd")
        if indicator not in ("CRDT", "DBIT"):
            raise CamtError(f"unknown credit/debit indicator {indicator}")
        return -amount if indicator == "DBIT" else amount

    def day(self, element: ET.Element, path: str) -> date | None:
        value = self.text(element, f"{path}/Dt") or self.text(element, f"{path}/DtTm")
        return date.fromisoformat(value[:10]) if value else None


def _namespace(tag: str) -> str:
    return tag[1:].split("}", 1)[0] if tag.startswith("{") else ""


def _balance(reader: _Reader, report: ET.Element, codes: tuple[str, ...]) -> Decimal | None:
    for balance in reader.findall(report, "Bal"):
        if reader.text(balance, "Tp/CdOrPrtry/Cd") in codes:
            return reader.signed_amount(balance)
    return None


def _counterparty(
    reader: _Reader, details: ET.Element | None, debit: bool
) -> tuple[str, str | None]:
    if details is None:
        return "", None
    roles = ("Cdtr", "Dbtr") if debit else ("Dbtr", "Cdtr")
    for role in roles:
        party = reader.find(details, f"RltdPties/{role}")
        if party is None:
            continue
        name = reader.text(party, "Nm") or reader.text(party, "Pty/Nm") or ""
        iban = reader.text(details, f"RltdPties/{role}Acct/Id/IBAN")
        return name, iban
    return "", None


def _entry(reader: _Reader, ntry: ET.Element) -> CamtEntry:
    amount = reader.signed_amount(ntry)
    status = reader.text(ntry, "Sts/Cd") or reader.required(ntry, "Sts")
    if status not in ("BOOK", "PDNG", "INFO"):
        raise CamtError(f"unknown entry status {status}")
    booking_date = reader.day(ntry, "BookgDt")
    if booking_date is None:
        raise CamtError("entry without booking date")

    details = reader.find(ntry, "NtryDtls/TxDtls")
    name, iban = _counterparty(reader, details, debit=amount < 0)
    purpose = (
        tuple(line.text or "" for line in reader.findall(details, "RmtInf/Ustrd"))
        if details is not None
        else ()
    )
    currency = reader.find(ntry, "Amt")
    return CamtEntry(
        booked=status == "BOOK",
        booking_date=booking_date,
        value_date=reader.day(ntry, "ValDt"),
        amount=amount,
        currency=(currency.get("Ccy") if currency is not None else None) or "EUR",
        counterparty_name=name,
        counterparty_iban=iban,
        purpose_lines=purpose,
        posting_text=reader.text(ntry, "AddtlNtryInf") or "",
        xml=ET.tostring(ntry, encoding="unicode"),
    )


def parse(document: str | bytes) -> list[CamtReport]:
    try:
        root = SafeET.fromstring(document)
    except (ET.ParseError, DefusedXmlException) as error:
        raise CamtError(str(error)) from error

    reader = _Reader(_namespace(root.tag))
    container = reader.find(root, "BkToCstmrAcctRpt")
    if container is None:
        raise CamtError("not a camt.052 account report")

    reports = []
    for report in reader.findall(container, "Rpt"):
        reports.append(
            CamtReport(
                iban=reader.required(report, "Acct/Id/IBAN"),
                opening_balance=_balance(reader, report, OPENING_CODES),
                closing_balance=_balance(reader, report, CLOSING_CODES),
                entries=tuple(_entry(reader, ntry) for ntry in reader.findall(report, "Ntry")),
            )
        )
    return reports
