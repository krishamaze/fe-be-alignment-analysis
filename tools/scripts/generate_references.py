#!/usr/bin/env python3
"""Generate reference documentation for the monorepo."""
from __future__ import annotations

import ast
import re
import textwrap
from dataclasses import dataclass
from pathlib import Path
from typing import Dict, List, Optional, Sequence, Tuple

ROOT = Path(__file__).resolve().parents[1]
BACKEND_ROOT = ROOT / "finetune-ERP-backend-New"
FRONTEND_APP = ROOT / "finetune-ERP-frontend-New" / "src" / "App.jsx"
REFERENCE_DIR = ROOT / "docs" / "reference"


@dataclass
class RouteEntry:
    path: str
    source: str
    handler: str
    route_type: str


@dataclass
class FrontendRoute:
    path: str
    element: str
    notes: str


@dataclass
class EnvVar:
    setting: str
    key: str
    default: str
    note: str


def _module_to_path(module: str) -> Path:
    module_path = module.replace(".", "/")
    return BACKEND_ROOT / f"{module_path}.py"


def _literal_value(node: ast.AST) -> Optional[str]:
    if isinstance(node, ast.Constant):
        return repr(node.value)
    try:
        return ast.unparse(node)
    except AttributeError:  # pragma: no cover - Python <3.9 fallback
        return None


class _UrlAnalyzer(ast.NodeVisitor):
    def __init__(self, source: str) -> None:
        self.source = source
        self.router_trailing: Dict[str, bool] = {}
        self.router_used: set[str] = set()
        self.router_registers: List[Tuple[str, str, str, Optional[str]]] = []
        self.pattern_calls: List[ast.Call] = []

    def visit_Assign(self, node: ast.Assign) -> None:  # noqa: D401
        for target in node.targets:
            if isinstance(target, ast.Name):
                if self._is_router_ctor(node.value):
                    trailing = self._extract_trailing(node.value)
                    self.router_trailing[target.id] = trailing
                if self._is_router_urls(node.value):
                    router_name = self._router_name(node.value)
                    if router_name:
                        self.router_used.add(router_name)
                if target.id == "urlpatterns":
                    self._collect_pattern_calls(node.value)
        self.generic_visit(node)

    def visit_AugAssign(self, node: ast.AugAssign) -> None:  # noqa: D401
        if isinstance(node.target, ast.Name) and node.target.id == "urlpatterns":
            self._collect_pattern_calls(node.value)
        self.generic_visit(node)

    def visit_Call(self, node: ast.Call) -> None:  # noqa: D401
        if isinstance(node.func, ast.Attribute):
            if node.func.attr == "register" and isinstance(node.func.value, ast.Name):
                router_name = node.func.value.id
                prefix = node.args[0] if node.args else None
                view = node.args[1] if len(node.args) > 1 else None
                basename = node.keywords[0].value if node.keywords else None
                prefix_value = _literal_value(prefix) or "<dynamic>"
                view_value = _literal_value(view) or "<dynamic>"
                basename_value = (
                    basename.value if isinstance(basename, ast.Constant) else None
                )
                self.router_registers.append(
                    (router_name, prefix_value, view_value, basename_value)
                )
        self.generic_visit(node)

    # Helpers -----------------------------------------------------------------
    def _is_router_ctor(self, node: ast.AST) -> bool:
        if not isinstance(node, ast.Call):
            return False
        func = node.func
        if isinstance(func, ast.Name) and func.id in {"DefaultRouter", "SimpleRouter"}:
            return True
        if (
            isinstance(func, ast.Attribute)
            and isinstance(func.value, ast.Name)
            and func.attr in {"DefaultRouter", "SimpleRouter"}
        ):
            return True
        return False

    def _extract_trailing(self, node: ast.Call) -> bool:
        trailing = True
        for kw in node.keywords:
            if kw.arg == "trailing_slash":
                value = kw.value
                if isinstance(value, ast.Constant):
                    trailing = bool(value.value)
        return trailing

    def _is_router_urls(self, node: ast.AST) -> bool:
        return isinstance(node, ast.Attribute) and node.attr == "urls"

    def _router_name(self, node: ast.AST) -> Optional[str]:
        if isinstance(node, ast.Attribute) and isinstance(node.value, ast.Name):
            return node.value.id
        return None

    def _collect_pattern_calls(self, value: ast.AST) -> None:
        if isinstance(value, ast.List):
            for elt in value.elts:
                if isinstance(elt, ast.Call):
                    self.pattern_calls.append(elt)
        elif isinstance(value, ast.BinOp) and isinstance(value.op, ast.Add):
            self._collect_pattern_calls(value.left)
            self._collect_pattern_calls(value.right)
        elif isinstance(value, ast.Attribute):
            router_name = self._router_name(value)
            if router_name:
                self.router_used.add(router_name)


def _combine_paths(prefix: str, route: str) -> str:
    prefix = prefix or ""
    route = route or ""
    if prefix and not prefix.endswith("/"):
        prefix = f"{prefix}/"
    combined = f"{prefix}{route}" if prefix else route
    combined = combined.replace("//", "/")
    combined = combined.lstrip("/")
    if not combined:
        return "/"
    return f"/{combined}"


def _normalize_router_prefix(prefix: str, trailing: bool) -> str:
    prefix = prefix.strip("'")
    prefix = prefix.strip('"')
    if trailing:
        return f"{prefix}/"
    return prefix


def _extract_view_name(call: ast.AST) -> str:
    try:
        return ast.unparse(call)
    except Exception:  # pragma: no cover - ast.unparse fallback
        return "<call>"


def collect_backend_routes(module: str, prefix: str = "") -> List[RouteEntry]:
    file_path = _module_to_path(module)
    if not file_path.exists():
        raise FileNotFoundError(f"Unable to locate module '{module}' at {file_path}")
    source = file_path.read_text(encoding='utf-8')
    analyzer = _UrlAnalyzer(source)
    tree = ast.parse(source, filename=str(file_path))
    analyzer.visit(tree)

    routes: List[RouteEntry] = []
    for call in analyzer.pattern_calls:
        if not isinstance(call.func, ast.Name):
            continue
        if call.func.id not in {"path", "re_path"}:
            continue
        if not call.args:
            continue
        route_arg = call.args[0]
        if not isinstance(route_arg, ast.Constant) or not isinstance(route_arg.value, str):
            continue
        route_segment = route_arg.value
        target = call.args[1] if len(call.args) > 1 else None
        include_module: Optional[str] = None
        if (
            isinstance(target, ast.Call)
            and isinstance(target.func, ast.Name)
            and target.func.id == "include"
        ):
            if target.args and isinstance(target.args[0], ast.Constant):
                include_module = target.args[0].value
        if include_module:
            nested_prefix = _combine_paths(prefix, route_segment)
            routes.extend(collect_backend_routes(include_module, nested_prefix))
            continue
        view_name = _extract_view_name(target) if target else "<unknown>"
        full_path = _combine_paths(prefix, route_segment)
        route_type = "path"
        if any(
            isinstance(kw, ast.keyword) and kw.arg == "name"
            for kw in call.keywords
        ):
            route_type = "named-path"
        routes.append(
            RouteEntry(
                path=full_path,
                source=module,
                handler=view_name,
                route_type=route_type,
            )
        )

    for router_name, prefix_value, view_value, basename in analyzer.router_registers:
        if router_name not in analyzer.router_used:
            continue
        trailing = analyzer.router_trailing.get(router_name, True)
        prefix_segment = _normalize_router_prefix(prefix_value, trailing)
        full_path = _combine_paths(prefix, prefix_segment)
        handler_name = view_value.strip("'")
        if handler_name.endswith(".as_view()"):
            handler_name = handler_name.replace(".as_view()", "")
        source_display = f"{module}::{router_name}" if module else module
        route_label = f"viewset ({basename})" if basename else "viewset"
        routes.append(
            RouteEntry(
                path=full_path,
                source=source_display,
                handler=handler_name,
                route_type=route_label,
            )
        )
    return routes


def collect_frontend_routes() -> List[FrontendRoute]:
    source = FRONTEND_APP.read_text(encoding='utf-8')
    close_tag_pattern = re.compile(r"</Route>")

    idx = 0
    stack: List[Dict[str, str]] = []
    routes: List[FrontendRoute] = []

    def resolve_base() -> str:
        if not stack:
            return "/"
        return stack[-1]["base"]

    def derive_full_path(raw_path: Optional[str]) -> Optional[str]:
        if raw_path is None:
            return None
        raw_path = raw_path.strip().strip('"').strip("'")
        if not raw_path:
            return resolve_base()
        if raw_path.startswith("/"):
            base_path = raw_path
        else:
            parent = resolve_base().rstrip("/")
            parent = parent or ""
            if parent and not parent.startswith("/"):
                parent = f"/{parent}"
            base_path = f"{parent}/{raw_path}" if parent else f"/{raw_path}"
        base_path = base_path.replace("//", "/")
        if base_path.endswith("/*"):
            base_path = base_path[:-2]
        return base_path or "/"

    def parse_attributes(fragment: str) -> Dict[str, Optional[str]]:
        attrs: Dict[str, Optional[str]] = {"path": None, "index": None, "element": None}
        path_match = re.search(r"path=\{?\"([^\"]*)\"\}?", fragment)
        if path_match:
            attrs["path"] = path_match.group(1)
        index_match = re.search(r"(?<![A-Za-z0-9_])index(?![A-Za-z0-9_])", fragment)
        if index_match:
            attrs["index"] = "true"
        element_match = re.search(r"element=\{(.*)\}", fragment, re.S)
        if element_match:
            attrs["element"] = element_match.group(1).strip()
        return attrs

    while True:
        start = source.find("<Route", idx)
        next_close = close_tag_pattern.search(source, idx)
        if start == -1 and not next_close:
            break
        if start != -1 and (not next_close or start < next_close.start()):
            cursor = start + len("<Route")
            depth = 0
            string_delim: Optional[str] = None
            while cursor < len(source):
                char = source[cursor]
                if string_delim:
                    if char == string_delim and source[cursor - 1] != "\\":
                        string_delim = None
                else:
                    if char in {'"', "'"}:
                        string_delim = char
                    elif char == "{":
                        depth += 1
                    elif char == "}":
                        depth = max(0, depth - 1)
                    elif char == ">" and depth == 0:
                        break
                cursor += 1
            fragment = source[start + len("<Route"):cursor]
            self_closing = False
            trimmed = fragment.rstrip()
            if trimmed.endswith("/"):
                self_closing = True
                fragment = trimmed[:-1]
            attrs = parse_attributes(fragment)
            element_raw = attrs.get("element") or "<Outlet>"
            element = re.sub(r"\s+", " ", element_raw).strip()
            if attrs.get("index") == "true" and attrs.get("path") is None:
                full_path = resolve_base()
            else:
                full_path = derive_full_path(attrs.get("path"))
            if full_path:
                note = "index" if attrs.get("index") == "true" else ""
                routes.append(FrontendRoute(path=full_path, element=element, notes=note))
            base_for_children = full_path if full_path else resolve_base()
            if not base_for_children:
                base_for_children = "/"
            if not self_closing:
                stack.append({"base": base_for_children})
            idx = cursor + 1
        elif next_close:
            if stack:
                stack.pop()
            idx = next_close.end()
        else:
            break

    unique: Dict[str, FrontendRoute] = {}
    for route in routes:
        unique_key = f"{route.path}|{route.element}"
        unique[unique_key] = route
    return sorted(unique.values(), key=lambda r: r.path)


def collect_env_vars() -> List[EnvVar]:
    settings_path = BACKEND_ROOT / "config" / "settings.py"
    source = settings_path.read_text(encoding='utf-8')
    lines = source.splitlines()
    tree = ast.parse(source, filename=str(settings_path))
    env_vars: List[EnvVar] = []

    def find_env_call(node: ast.AST) -> Optional[ast.Call]:
        if isinstance(node, ast.Call):
            func = node.func
            if (
                isinstance(func, ast.Attribute)
                and isinstance(func.value, ast.Attribute)
                and isinstance(func.value.value, ast.Name)
                and func.value.value.id == "os"
                and func.value.attr == "environ"
                and func.attr == "get"
            ):
                return node
        for child in ast.iter_child_nodes(node):
            result = find_env_call(child)
            if result is not None:
                return result
        return None

    for node in tree.body:
        if isinstance(node, ast.Assign):
            if not node.targets:
                continue
            target = node.targets[0]
            if not isinstance(target, ast.Name):
                continue
            call = find_env_call(node.value)
            if call is None:
                continue
            if not call.args:
                continue
            key_node = call.args[0]
            if not isinstance(key_node, ast.Constant) or not isinstance(key_node.value, str):
                continue
            env_key = key_node.value
            default_node = call.args[1] if len(call.args) > 1 else None
            default_repr = _literal_value(default_node) if default_node else "None"
            line = lines[node.lineno - 1]
            note = ""
            if "#" in line:
                note = line.split("#", 1)[1].strip()
            env_vars.append(
                EnvVar(
                    setting=target.id,
                    key=env_key,
                    default=default_repr,
                    note=note,
                )
            )
    return sorted(env_vars, key=lambda item: item.key)


def write_markdown(path: Path, content: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content)


def render_backend_routes(routes: Sequence[RouteEntry]) -> str:
    header = textwrap.dedent(
        """
        # Backend API Routes Reference

        > [!NOTE]
        > Generated by `scripts/generate_references.py`. Do not edit manually.

        | Route | Source | Handler | Type |
        | :---- | :----- | :------ | :---- |
        """
    ).strip()
    lines = [header]
    for entry in sorted(routes, key=lambda item: item.path):
        lines.append(
            f"| `{entry.path}` | `{entry.source}` | `{entry.handler}` | `{entry.route_type}` |"
        )
    return "\n".join(lines) + "\n"


def render_frontend_routes(routes: Sequence[FrontendRoute]) -> str:
    header = textwrap.dedent(
        """
        # Frontend Route Reference

        > [!NOTE]
        > Generated by `scripts/generate_references.py`. Do not edit manually.

        | Path | Element | Notes |
        | :--- | :------ | :---- |
        """
    ).strip()
    lines = [header]
    for route in routes:
        element = route.element.replace("|", "\\|")
        notes = route.notes.replace("|", "\\|")
        lines.append(f"| `{route.path}` | `{element}` | {notes or '—'} |")
    return "\n".join(lines) + "\n"


def render_env_vars(vars: Sequence[EnvVar]) -> str:
    header = textwrap.dedent(
        """
        # Environment Key Reference

        > [!NOTE]
        > Generated by `scripts/generate_references.py`. Do not edit manually.

        | Setting | Environment Key | Default | Notes |
        | :------ | :--------------- | :------ | :---- |
        """
    ).strip()
    lines = [header]
    for item in vars:
        default = item.default.replace("|", "\\|") if item.default else "None"
        note = item.note.replace("|", "\\|") if item.note else "—"
        lines.append(
            f"| `{item.setting}` | `{item.key}` | `{default}` | {note} |"
        )
    return "\n".join(lines) + "\n"


def main() -> None:
    backend_routes = collect_backend_routes("config.urls")
    frontend_routes = collect_frontend_routes()
    env_vars = collect_env_vars()

    write_markdown(REFERENCE_DIR / "API_ROUTES.md", render_backend_routes(backend_routes))
    write_markdown(
        REFERENCE_DIR / "FRONTEND_ROUTES.md", render_frontend_routes(frontend_routes)
    )
    write_markdown(
        REFERENCE_DIR / "ENVIRONMENT_KEYS.md", render_env_vars(env_vars)
    )


if __name__ == "__main__":
    main()
