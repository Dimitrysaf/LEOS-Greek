#!/usr/bin/env bash
#
# Copyright 2024 European Union
#
# Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the European Commission - subsequent versions of the EUPL (the "Licence");
# You may not use this work except in compliance with the Licence.
# You may obtain a copy of the Licence at:
#
#     https://joinup.ec.europa.eu/software/page/eupl
#
# Unless required by applicable law or agreed to in writing, software distributed under the Licence is distributed on an "AS IS" basis,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the Licence for the specific language governing permissions and limitations under the Licence.
#

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

open_terminal() {
    local title="$1"
    local script="$2"

    if [ -z "$DISPLAY" ] && [ -z "$WAYLAND_DISPLAY" ]; then
        echo "No display found, running '$title' in background..." >&2
        bash "$script" &
        return
    fi

    if command -v gnome-terminal &>/dev/null; then
        gnome-terminal --window -- bash -c "printf '\033]0;${title}\007'; cd '$SCRIPT_DIR' && bash '$script'; read" &
    elif command -v x-terminal-emulator &>/dev/null; then
        x-terminal-emulator -e bash -c "printf '\033]0;${title}\007'; cd '$SCRIPT_DIR' && bash '$script'; read" &
    elif command -v xfce4-terminal &>/dev/null; then
        xfce4-terminal --window -x bash -c "printf '\033]0;${title}\007'; cd '$SCRIPT_DIR' && bash '$script'; read" &
    elif command -v konsole &>/dev/null; then
        konsole --separate -e bash -c "printf '\033]0;${title}\007'; cd '$SCRIPT_DIR' && bash '$script'; read" &
    elif command -v xterm &>/dev/null; then
        xterm -e bash -c "printf '\033]0;${title}\007'; cd '$SCRIPT_DIR' && bash '$script'; read" &
    else
        echo "ERROR: No terminal emulator found." >&2
        exit 1
    fi
    sleep 0.3
}

open_terminal "User Repository" "$SCRIPT_DIR/run-user-repository.sh"
open_terminal "Repository"      "$SCRIPT_DIR/run-repository.sh"
open_terminal "LEOS"            "$SCRIPT_DIR/run-leos.sh"
open_terminal "AKN4EUUtil"      "$SCRIPT_DIR/run-akn4euutil.sh"
