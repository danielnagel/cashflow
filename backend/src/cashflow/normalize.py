"""Turns raw camt entries into transaction fields.

The hash is built from the raw fields as delivered, never from normalised values: improving the
normalisation must not change the hash of transactions that are already stored.
"""

import hashlib
import json
import re
from collections import Counter
from collections.abc import Iterable, Iterator
from dataclasses import dataclass

from cashflow.camt import CamtEntry

CARD_PREFIX = "VISA "
REFERENCE = re.compile(r"^(EREF|MREF|CRED)\+(.*)$")
NOT_PROVIDED = "NOTPROVIDED"


@dataclass(frozen=True)
class Normalized:
    counterparty_name: str
    purpose: str
    card_payment: bool
    creditor_id: str | None
    mandate_ref: str | None
    end_to_end_ref: str | None


def normalize(entry: CamtEntry) -> Normalized:
    name = entry.counterparty_name.strip()
    card_payment = name.startswith(CARD_PREFIX)
    if card_payment:
        name = name.removeprefix(CARD_PREFIX).strip()

    references: dict[str, str] = {}
    purpose = []
    for line in entry.purpose_lines:
        match = REFERENCE.match(line.strip())
        if match:
            value = match.group(2).strip()
            if value and value != NOT_PROVIDED:
                references.setdefault(match.group(1), value)
        else:
            purpose.append(line.strip())

    return Normalized(
        counterparty_name=name,
        purpose=" ".join(line for line in purpose if line),
        card_payment=card_payment,
        creditor_id=references.get("CRED"),
        mandate_ref=references.get("MREF"),
        end_to_end_ref=references.get("EREF"),
    )


def _identity(iban: str, entry: CamtEntry) -> tuple[str, ...]:
    return (
        iban,
        entry.booking_date.isoformat(),
        f"{entry.amount:.2f}",
        entry.counterparty_iban or "",
        entry.counterparty_name,
        "\n".join(entry.purpose_lines),
    )


def transaction_hash(iban: str, entry: CamtEntry, occurrence: int) -> str:
    fields = [*_identity(iban, entry), str(occurrence)]
    payload = json.dumps(fields, ensure_ascii=False, separators=(",", ":"))
    return hashlib.sha256(payload.encode()).hexdigest()


def with_hashes(iban: str, entries: Iterable[CamtEntry]) -> Iterator[tuple[CamtEntry, str]]:
    """Numbers identical entries within one delivery (0, 1, …) so that real double bookings
    get distinct hashes, while the same delivery produces the same hashes again."""
    seen: Counter[tuple[str, ...]] = Counter()
    for entry in entries:
        identity = _identity(iban, entry)
        yield entry, transaction_hash(iban, entry, seen[identity])
        seen[identity] += 1
