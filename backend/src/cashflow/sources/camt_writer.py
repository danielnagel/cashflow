"""Renders camt.052.001.02 documents in the shape banks deliver them via FinTS."""

import xml.etree.ElementTree as ET
from dataclasses import dataclass
from datetime import date, datetime
from decimal import Decimal

NAMESPACE = "urn:iso:std:iso:20022:tech:xsd:camt.052.001.02"


@dataclass(frozen=True)
class Entry:
    booking_date: date
    value_date: date
    amount: Decimal
    """Signed: negative for debits."""
    posting_text: str
    proprietary_code: str
    domain: tuple[str, str, str]
    counterparty_name: str
    purpose: tuple[str, ...]
    reference: str
    counterparty_iban: str | None = None
    counterparty_bic: str | None = None
    pending: bool = False


def _sub(parent: ET.Element, tag: str, text: str | None = None, **attrib: str) -> ET.Element:
    element = ET.SubElement(parent, tag, attrib)
    if text is not None:
        element.text = text
    return element


def _amount(value: Decimal) -> str:
    return f"{abs(value):.2f}"


def _indicator(value: Decimal) -> str:
    return "DBIT" if value < 0 else "CRDT"


def _balance(report: ET.Element, code: str, amount: Decimal, on: date) -> None:
    balance = _sub(report, "Bal")
    _sub(_sub(_sub(balance, "Tp"), "CdOrPrtry"), "Cd", code)
    _sub(balance, "Amt", _amount(amount), Ccy="EUR")
    _sub(balance, "CdtDbtInd", _indicator(amount))
    _sub(_sub(balance, "Dt"), "Dt", on.isoformat())


def _entry(report: ET.Element, entry: Entry) -> None:
    ntry = _sub(report, "Ntry")
    _sub(ntry, "Amt", _amount(entry.amount), Ccy="EUR")
    _sub(ntry, "CdtDbtInd", _indicator(entry.amount))
    _sub(ntry, "Sts", "PDNG" if entry.pending else "BOOK")
    _sub(_sub(ntry, "BookgDt"), "Dt", entry.booking_date.isoformat())
    _sub(_sub(ntry, "ValDt"), "Dt", entry.value_date.isoformat())
    _sub(ntry, "AcctSvcrRef", entry.reference)
    _sub(ntry, "BkTxCd")

    details = _sub(_sub(ntry, "NtryDtls"), "TxDtls")
    code = _sub(details, "BkTxCd")
    domain = _sub(code, "Domn")
    _sub(domain, "Cd", entry.domain[0])
    family = _sub(domain, "Fmly")
    _sub(family, "Cd", entry.domain[1])
    _sub(family, "SubFmlyCd", entry.domain[2])
    proprietary = _sub(code, "Prtry")
    _sub(proprietary, "Cd", entry.proprietary_code)
    _sub(proprietary, "Issr", "ZKA")

    role = "Cdtr" if entry.amount < 0 else "Dbtr"
    parties = _sub(details, "RltdPties")
    _sub(_sub(parties, role), "Nm", entry.counterparty_name)
    if entry.counterparty_iban:
        _sub(_sub(_sub(parties, f"{role}Acct"), "Id"), "IBAN", entry.counterparty_iban)
    if entry.counterparty_bic:
        agent = _sub(_sub(details, "RltdAgts"), f"{role}Agt")
        _sub(_sub(agent, "FinInstnId"), "BIC", entry.counterparty_bic)
    if entry.purpose:
        remittance = _sub(details, "RmtInf")
        for line in entry.purpose:
            _sub(remittance, "Ustrd", line)
    _sub(ntry, "AddtlNtryInf", entry.posting_text)


def render(
    *,
    iban: str,
    bic: str,
    report_id: str,
    created: datetime,
    entries: list[Entry],
    opening: tuple[Decimal, date] | None = None,
    closing: tuple[Decimal, date] | None = None,
) -> str:
    ET.register_namespace("", NAMESPACE)
    document = ET.Element(f"{{{NAMESPACE}}}Document")
    root = _sub(document, "BkToCstmrAcctRpt")
    header = _sub(root, "GrpHdr")
    _sub(header, "MsgId", report_id)
    _sub(header, "CreDtTm", created.isoformat())

    report = _sub(root, "Rpt")
    _sub(report, "Id", report_id)
    _sub(report, "CreDtTm", created.isoformat())
    account = _sub(report, "Acct")
    _sub(_sub(account, "Id"), "IBAN", iban)
    _sub(account, "Ccy", "EUR")
    institution = _sub(_sub(account, "Svcr"), "FinInstnId")
    _sub(institution, "BIC", bic)
    _sub(institution, "Nm", "Example Bank")
    if opening is not None:
        _balance(report, "OPBD", *opening)
    if closing is not None:
        _balance(report, "CLBD", *closing)
    for entry in entries:
        _entry(report, entry)

    # ElementTree only prefixes child tags with the namespace if they carry it themselves.
    for element in document.iter():
        if not element.tag.startswith("{"):
            element.tag = f"{{{NAMESPACE}}}{element.tag}"
    ET.indent(document)
    body = ET.tostring(document, encoding="unicode")
    return f'<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n{body}\n'
