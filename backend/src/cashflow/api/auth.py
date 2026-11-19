from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Request, Response, status
from pydantic import BaseModel, Field

from cashflow.auth import SESSION_LIFETIME, AuthenticatedUser, authenticate
from cashflow.runtime import RuntimeDep

COOKIE = "cashflow_session"

router = APIRouter()


def current_user(request: Request, runtime: RuntimeDep) -> AuthenticatedUser:
    token = request.cookies.get(COOKIE)
    session = runtime.sessions.get(token) if token else None
    if session is None:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, detail="not_authenticated")
    return session.user


CurrentUser = Annotated[AuthenticatedUser, Depends(current_user)]


class LoginRequest(BaseModel):
    username: str = Field(max_length=200)
    password: str = Field(max_length=1000)
    code: str = Field(max_length=20)


class Me(BaseModel):
    username: str


@router.post("/login", status_code=status.HTTP_204_NO_CONTENT)
def login(body: LoginRequest, request: Request, response: Response, runtime: RuntimeDep) -> None:
    address = request.client.host if request.client else "unknown"
    wait = runtime.throttle.retry_after(address)
    if wait:
        raise HTTPException(
            status.HTTP_429_TOO_MANY_REQUESTS,
            detail="too_many_attempts",
            headers={"Retry-After": str(wait)},
        )
    user = authenticate(
        runtime.engine, runtime.cipher, body.username, body.password, body.code, runtime.clock()
    )
    if user is None:
        runtime.throttle.failed(address)
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, detail="login_failed")

    runtime.throttle.succeeded(address)
    response.set_cookie(
        COOKIE,
        runtime.sessions.create(user),
        max_age=int(SESSION_LIFETIME.total_seconds()),
        path="/api",
        secure=True,
        httponly=True,
        samesite="strict",
    )
    # Logging in is the only moment the app talks to the bank on its own.
    runtime.fetcher.start(only_if_due=True)


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
def logout(request: Request, response: Response, runtime: RuntimeDep) -> None:
    token = request.cookies.get(COOKIE)
    if token:
        runtime.sessions.delete(token)
    response.delete_cookie(COOKIE, path="/api", secure=True, httponly=True, samesite="strict")


@router.get("/me")
def me(user: CurrentUser) -> Me:
    return Me(username=user.username)
