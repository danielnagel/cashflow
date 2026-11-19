"""Creates the app user: python -m cashflow.users create <username>

Asks for the password, shows the TOTP secret as QR code for an authenticator app and stores the
user once a code from that app has been confirmed.
"""

import argparse
import getpass
import io
import sys
from datetime import UTC, datetime

import qrcode

from cashflow.auth import (
    UserExistsError,
    create_user,
    new_totp_secret,
    secret_cipher,
    totp_uri,
    verify_totp,
)
from cashflow.config import Settings
from cashflow.db import make_engine

MIN_PASSWORD_LENGTH = 12


def _password() -> str:
    while True:
        password = getpass.getpass("Password: ")
        if len(password) < MIN_PASSWORD_LENGTH:
            print(f"The password needs at least {MIN_PASSWORD_LENGTH} characters.")
            continue
        if getpass.getpass("Repeat password: ") != password:
            print("The passwords differ.")
            continue
        return password


def _show_secret(secret: str, username: str) -> None:
    uri = totp_uri(secret, username)
    code = qrcode.QRCode(border=1)
    code.add_data(uri)
    out = io.StringIO()
    code.print_ascii(out=out, invert=True)
    print("Scan this code with an authenticator app:\n")
    print(out.getvalue())
    print(f"Or enter the secret manually: {secret}\n")


def create(username: str) -> int:
    settings = Settings()
    cipher = secret_cipher(settings.totp_encryption_key.get_secret_value())
    password = _password()
    secret = new_totp_secret()
    _show_secret(secret, username)
    while not verify_totp(secret, input("Code from the app: "), datetime.now(UTC)):
        print("Wrong code, please try again.")

    engine = make_engine(settings)
    try:
        create_user(engine, cipher, username, password, secret, datetime.now(UTC))
    except UserExistsError:
        print(f"The user {username} already exists.", file=sys.stderr)
        return 1
    finally:
        engine.dispose()
    print(f"User {username} created.")
    return 0


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(prog="python -m cashflow.users")
    commands = parser.add_subparsers(dest="command", required=True)
    create_parser = commands.add_parser("create", help="create the user that logs in to the app")
    create_parser.add_argument("username")
    args = parser.parse_args(argv)
    return create(args.username)


if __name__ == "__main__":
    sys.exit(main())
